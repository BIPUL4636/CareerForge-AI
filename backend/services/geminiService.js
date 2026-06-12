const ai = require("../config/gemini");
const groq = require("../config/groq");

/**
 * CareerForge AI — Reusable Gemini Service Layer
 * Wraps @google/genai SDK with JSON response parsing, retry, and fallback.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  FLOW (same for generateJSON & generateText):       │
 * │                                                     │
 * │  1. Call Gemini (gemini-2.0-flash)                  │
 * │     └─ Success → return response                    │
 * │     └─ Failure → log error, wait 1 s, go to 2      │
 * │                                                     │
 * │  2. RETRY Gemini (one retry)                        │
 * │     └─ Success → return response                    │
 * │     └─ Failure → log error, go to 3                 │
 * │                                                     │
 * │  3. FALLBACK to Groq (llama-3.3-70b-versatile)      │
 * │     └─ Success → return response                    │
 * │     └─ Failure → throw structured error             │
 * └─────────────────────────────────────────────────────┘
 */

// ─── Constants ─────────────────────────────────────────────────────

const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const RETRY_DELAY_MS = 1000; // 1 second wait before the single retry

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Call Groq as a fallback provider.
 * Uses GROQ_API_KEY from .env (loaded in ../config/groq).
 * @returns {string} Raw text response from Groq.
 */
const callGroqFallback = async (systemPrompt, userPrompt) => {
  if (!groq) {
    throw new Error(
      "Groq fallback unavailable — GROQ_API_KEY is not configured."
    );
  }

  console.log(`🔄 [Groq] Sending fallback request (${GROQ_MODEL})...`);

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 4096,
  });

  const text = response.choices?.[0]?.message?.content || "";
  console.log("✅ [Groq] Fallback response received");
  return text;
};

/**
 * Extract JSON from LLM response text.
 * Handles ```json fencing, plain JSON, and nested objects.
 */
const extractJSON = (text) => {
  // Try to extract from ```json ... ``` fencing
  const fencedMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fencedMatch) {
    return JSON.parse(fencedMatch[1].trim());
  }

  // Try to find JSON object directly
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("No valid JSON found in response");
};

/**
 * Raw Gemini API call (no retry/fallback — used internally).
 * @returns {string} Raw text from Gemini.
 */
const callGemini = async (systemPrompt, userPrompt) => {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text || "";
  if (!text.trim()) {
    throw new Error("Empty response from Gemini");
  }
  return text;
};

// ─── Main API functions ────────────────────────────────────────────

/**
 * Generate a structured JSON response.
 * Retry + Groq fallback flow (see diagram at top of file).
 *
 * @param {string} systemPrompt - System instruction
 * @param {string} userPrompt   - User content to analyze
 * @returns {Promise<Object>}    Parsed JSON response
 */
const generateJSON = async (systemPrompt, userPrompt) => {
  // ── Step 1: Try Gemini (first attempt) ──
  try {
    console.log(`📤 [Gemini] Sending generateJSON request (${GEMINI_MODEL})...`);
    const text = await callGemini(systemPrompt, userPrompt);
    const parsed = extractJSON(text);
    console.log("✅ [Gemini] JSON parsed successfully — provider: Gemini");
    return parsed;
  } catch (firstError) {
    console.warn(
      `⚠️ [Gemini] First attempt failed: ${firstError.message}`
    );
    console.log(`⏳ [Gemini] Retrying in ${RETRY_DELAY_MS}ms...`);
  }

  // ── Step 2: Retry Gemini once after 1 s delay ──
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

  try {
    console.log(`🔁 [Gemini] Retry attempt (generateJSON)...`);
    const text = await callGemini(systemPrompt, userPrompt);
    const parsed = extractJSON(text);
    console.log("✅ [Gemini] JSON parsed on retry — provider: Gemini (retry)");
    return parsed;
  } catch (retryError) {
    console.error(
      `❌ [Gemini] Retry also failed: ${retryError.message}`
    );
    console.warn(
      "🔄 [Fallback] Gemini exhausted, switching to Groq..."
    );
  }

  // ── Step 3: Fall back to Groq ──
  try {
    const groqText = await callGroqFallback(systemPrompt, userPrompt);
    const parsed = extractJSON(groqText);
    console.log("✅ [Groq] JSON parsed successfully — provider: Groq (fallback)");
    return parsed;
  } catch (groqError) {
    // Both providers failed — throw a clear, structured error
    console.error("❌ [Groq] Fallback also failed:", groqError.message);
    throw new Error(
      `Both AI providers failed. Gemini and Groq are unavailable. Last error: ${groqError.message}`
    );
  }
};

/**
 * Generate a plain text response.
 * Retry + Groq fallback flow (see diagram at top of file).
 *
 * @param {string} systemPrompt - System instruction
 * @param {string} userPrompt   - User content
 * @returns {Promise<string>}    Raw text response
 */
const generateText = async (systemPrompt, userPrompt) => {
  // ── Step 1: Try Gemini (first attempt) ──
  try {
    console.log(`📤 [Gemini] Sending generateText request (${GEMINI_MODEL})...`);
    const text = await callGemini(systemPrompt, userPrompt);
    console.log("✅ [Gemini] Text received — provider: Gemini");
    return text;
  } catch (firstError) {
    console.warn(
      `⚠️ [Gemini] First attempt failed: ${firstError.message}`
    );
    console.log(`⏳ [Gemini] Retrying in ${RETRY_DELAY_MS}ms...`);
  }

  // ── Step 2: Retry Gemini once after 1 s delay ──
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

  try {
    console.log(`🔁 [Gemini] Retry attempt (generateText)...`);
    const text = await callGemini(systemPrompt, userPrompt);
    console.log("✅ [Gemini] Text received on retry — provider: Gemini (retry)");
    return text;
  } catch (retryError) {
    console.error(
      `❌ [Gemini] Retry also failed: ${retryError.message}`
    );
    console.warn(
      "🔄 [Fallback] Gemini exhausted, switching to Groq..."
    );
  }

  // ── Step 3: Fall back to Groq ──
  try {
    const groqText = await callGroqFallback(systemPrompt, userPrompt);
    console.log("✅ [Groq] Text received — provider: Groq (fallback)");
    return groqText;
  } catch (groqError) {
    // Both providers failed — throw a clear, structured error
    console.error("❌ [Groq] Fallback also failed:", groqError.message);
    throw new Error(
      `Both AI providers failed. Gemini and Groq are unavailable. Last error: ${groqError.message}`
    );
  }
};

module.exports = {
  generateJSON,
  generateText,
  extractJSON,
};
