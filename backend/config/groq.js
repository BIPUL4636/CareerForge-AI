// ─── Groq Client Configuration ────────────────────────────────────
// Fallback LLM provider used when Gemini is unavailable (503 / overload).
// Uses llama-3.3-70b-versatile via the Groq SDK.
// ───────────────────────────────────────────────────────────────────

const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.warn(
    "⚠️  GROQ_API_KEY is not set. Groq fallback will be unavailable."
  );
} else {
  console.log(
    `✅ GROQ_API_KEY loaded (starts with ${apiKey.substring(0, 6)}...)`
  );
}

const groq = apiKey ? new Groq({ apiKey }) : null;

console.log(
  groq
    ? "✅ Groq client initialized successfully (fallback ready)"
    : "⚠️  Groq client NOT initialized (no API key)"
);

module.exports = groq;
