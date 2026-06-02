const ai = require("../config/gemini");

/**
 * CareerForge AI — Reusable Gemini Service Layer
 * Wraps @google/genai SDK with JSON response parsing and retry logic.
 */

const MAX_RETRIES = 2;

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
 * @returns {Promise<string>} Raw text response
 */
const generateText = async (systemPrompt, userPrompt) => {
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
    console.error("❌ Gemini Text Error:", error.message);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = {
  generateJSON,
  generateText,
  extractJSON,
};
