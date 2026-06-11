const ai = require("../config/gemini");
const groq = require("../config/groq");

/**
 * CareerForge AI — Reusable Gemini Service Layer
 * Wraps @google/genai SDK with JSON response parsing and retry logic.
 *
 * Fallback: When Gemini fails with 503 / high-demand / overload errors
 * after MAX_GEMINI_RETRIES attempts, automatically falls back to Groq
 * (llama-3.3-70b-versatile) so the user request still succeeds.
 */

const MAX_RETRIES = 2;
const MAX_GEMINI_RETRIES = 3; // retries specifically for 503 / overload before Groq fallback

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Returns true when an error indicates Gemini is overloaded / unavailable.
 * Matches HTTP 503, "overloaded", "resource exhausted", and "high demand".
 */
const isOverloadError = (error) => {
  const msg = (error.message || "").toLowerCase();
  const status = error.status || error.statusCode || error.code;
  return (
    status === 503 ||
    msg.includes("503") ||
    msg.includes("overloaded") ||
    msg.includes("resource exhausted") ||
    msg.includes("resource_exhausted") ||
    msg.includes("high demand") ||
    msg.includes("service unavailable")
  );
};

/**
 * Call Groq (llama-3.3-70b-versatile) as a fallback provider.
 * Returns the raw text response from Groq.
 */
const callGroqFallback = async (systemPrompt, userPrompt) => {
  if (!groq) {
    throw new Error(
      "Groq fallback unavailable — GROQ_API_KEY is not configured."
    );
  }

  console.log("🔄 [Groq] Sending fallback request (llama-3.3-70b-versatile)...");

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 4096,
  });

  const text = response.choices?.[0]?.message?.content || "";
  console.log("📥 [Groq] Fallback response received");
  return text;
};

/**
 * Extract JSON from Gemini response text.
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

  throw new Error("No valid JSON found in Gemini response");
};

// ─── Main API functions ────────────────────────────────────────────

/**
 * Generate a structured JSON response from Gemini.
 * @param {string} systemPrompt - System instruction for Gemini
 * @param {string} userPrompt - User content to analyze
 * @param {number} retries - Current retry count (internal)
 * @returns {Promise<Object>} Parsed JSON response
 */
const generateJSON = async (systemPrompt, userPrompt, retries = 0) => {
  try {
    console.log("📤 [Gemini] Sending generateJSON request...");

    const response = await ai.models.generateContent({
      // model: "gemini-2.5-flash",
      model: "gemini-2.5-flash",
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

    console.log("📥 [Gemini] Response received from generateJSON");

    const text = response.text || "";

    if (!text.trim()) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = extractJSON(text);
    console.log("✅ [Gemini] JSON parsed successfully");
    return parsed;
  } catch (error) {
    // ── 503 / overload → retry up to MAX_GEMINI_RETRIES then Groq fallback ──
    if (isOverloadError(error)) {
      if (retries < MAX_GEMINI_RETRIES) {
        const delay = Math.min(1000 * 2 ** retries, 8000); // exponential back-off
        console.log(
          `⚠️ [Gemini] 503/overload detected, retrying in ${delay}ms (${retries + 1}/${MAX_GEMINI_RETRIES})...`
        );
        await new Promise((r) => setTimeout(r, delay));
        return generateJSON(systemPrompt, userPrompt, retries + 1);
      }

      // All Gemini retries exhausted — fall back to Groq
      console.warn(
        `🚨 [Gemini] All ${MAX_GEMINI_RETRIES} retries exhausted. Switching to Groq fallback...`
      );
      try {
        const groqText = await callGroqFallback(systemPrompt, userPrompt);
        const parsed = extractJSON(groqText);
        console.log("✅ [Groq] JSON parsed successfully (fallback)");
        return parsed;
      } catch (groqError) {
        console.error("❌ [Groq] Fallback also failed:", groqError.message);
        throw new Error(
          `Gemini overloaded & Groq fallback failed: ${groqError.message}`
        );
      }
    }

    // ── JSON parse failures → retry (original behaviour) ──
    if (retries < MAX_RETRIES && error.message.includes("No valid JSON")) {
      console.log(
        `⚠️ Gemini JSON parse failed, retrying (${retries + 1}/${MAX_RETRIES})...`
      );
      return generateJSON(systemPrompt, userPrompt, retries + 1);
    }

    console.error("❌ Gemini Service Error:", error.message);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

/**
 * Generate a plain text response from Gemini.
 * @param {string} systemPrompt - System instruction
 * @param {string} userPrompt - User content
 * @param {number} retries - Current retry count (internal — for 503 retries)
 * @returns {Promise<string>} Raw text response
 */
const generateText = async (systemPrompt, userPrompt, retries = 0) => {
  try {
    console.log("📤 [Gemini] Sending generateText request...");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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

    console.log("📥 [Gemini] Response received from generateText");
    return response.text || "";
  } catch (error) {
    // ── 503 / overload → retry up to MAX_GEMINI_RETRIES then Groq fallback ──
    if (isOverloadError(error)) {
      if (retries < MAX_GEMINI_RETRIES) {
        const delay = Math.min(1000 * 2 ** retries, 8000);
        console.log(
          `⚠️ [Gemini] 503/overload detected, retrying in ${delay}ms (${retries + 1}/${MAX_GEMINI_RETRIES})...`
        );
        await new Promise((r) => setTimeout(r, delay));
        return generateText(systemPrompt, userPrompt, retries + 1);
      }

      console.warn(
        `🚨 [Gemini] All ${MAX_GEMINI_RETRIES} retries exhausted. Switching to Groq fallback...`
      );
      try {
        const groqText = await callGroqFallback(systemPrompt, userPrompt);
        console.log("✅ [Groq] Text response received (fallback)");
        return groqText;
      } catch (groqError) {
        console.error("❌ [Groq] Fallback also failed:", groqError.message);
        throw new Error(
          `Gemini overloaded & Groq fallback failed: ${groqError.message}`
        );
      }
    }

    console.error("❌ Gemini Text Error:", error.message);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = {
  generateJSON,
  generateText,
  extractJSON,
};
