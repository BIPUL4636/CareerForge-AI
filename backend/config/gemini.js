// ─── Gemini Client Configuration ───────────────────────────────────
// Uses @google/genai with API key authentication (NOT Vertex AI / ADC).
// dotenv.config() is called here to guarantee the API key is available
// regardless of module load order.
// ────────────────────────────────────────────────────────────────────

const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");

// ── Debug: confirm API key is loaded ──
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "❌ GEMINI_API_KEY is not set in environment variables. " +
      "Gemini API calls will fail. Check your .env file."
  );
} else {
  console.log(
    `✅ GEMINI_API_KEY loaded (starts with ${apiKey.substring(0, 6)}...)`
  );
}

const ai = new GoogleGenAI({ apiKey });

console.log("✅ Gemini client initialized successfully (using @google/genai)");

module.exports = ai;