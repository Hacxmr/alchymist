import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Mistral } from "@mistralai/mistralai";

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { concepts } = req.body;

  if (!concepts || !Array.isArray(concepts) || concepts.length !== 3) {
    return res
      .status(400)
      .json({ error: "Please provide exactly 3 concepts." });
  }

  try {
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY?.replace(
      /^["']|["']$/g,
      ""
    );

    console.log(
      "🔑 MISTRAL_API_KEY loaded:",
      MISTRAL_API_KEY ? `${MISTRAL_API_KEY.substring(0, 8)}...` : "NOT SET"
    );

    if (!MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY is not set");
    }

    const client = new Mistral({
      apiKey: MISTRAL_API_KEY,
    });

    const prompt = `You are a design synthesizer. Given 3 concepts, create a cohesive aesthetic identity.

Concepts:
1. ${concepts[0]}
2. ${concepts[1]}
3. ${concepts[2]}

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "aestheticName": "A unique 2-3 word name",
  "manifesto": "A poetic 2-3 sentence description of this intersection",
  "imagePrompt": "A detailed prompt for image generation (50-100 words)",
  "palette": [
    {"hex": "#FF0000", "name": "color name"},
    {"hex": "#00FF00", "name": "color name"},
    {"hex": "#0000FF", "name": "color name"},
    {"hex": "#FFFF00", "name": "color name"},
    {"hex": "#FF00FF", "name": "color name"}
  ],
  "fonts": {
    "display": "Font name for display text",
    "body": "Font name for body text"
  }
}`;

    console.log("Calling Mistral API...");
    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    console.log("Mistral response received");
    const content = response.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Response content:", content);
      throw new Error("No valid JSON found in response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    const required = [
      "aestheticName",
      "manifesto",
      "imagePrompt",
      "palette",
      "fonts",
    ];
    for (const field of required) {
      if (!(field in parsedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log("Alchemy successful");
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error("Alchemy Error:", error.message);
    console.error("Full error:", error);
    return res.status(500).json({
      error: error.message || "Failed to synthesize concepts",
      details: error.response?.data,
    });
  }
};
