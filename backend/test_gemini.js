// Quick test with gemini-2.0-flash model
require("dotenv").config();
const ai = require("./config/gemini");

(async () => {
  try {
    console.log("Testing gemini-2.0-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "Say hello in JSON: {\"greeting\": \"...\"}" }],
        },
      ],
      config: {
        systemInstruction:
          'Respond with ONLY valid JSON: {"greeting": "hello"}',
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });
    console.log("SUCCESS:", response.text);
    process.exit(0);
  } catch (e) {
    console.error("FAIL:", e.message);
    process.exit(1);
  }
})();
