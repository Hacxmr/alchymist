import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiKey: MISTRAL_API_KEY ? "configured" : "MISSING",
  });
});

// API Routes
app.post("/api/alchemy", async (req, res) => {
  const { concepts } = req.body;
  
  if (!concepts || !Array.isArray(concepts) || concepts.length !== 3) {
    return res.status(400).json({ error: "Please provide exactly 3 concepts." });
  }

  try {
    if (!MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY is not set");
    }

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
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Mistral response received");
    const content = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Response content:", content);
      throw new Error("No valid JSON found in response");
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    const required = ["aestheticName", "manifesto", "imagePrompt", "palette", "fonts"];
    for (const field of required) {
      if (!(field in parsedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    console.log("Alchemy successful, sending response");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Alchemy Error:", error.message);
    console.error("Error details:", error.response?.data);
    res.status(500).json({
      error: error.message || "Failed to synthesize concepts",
      details: error.response?.data
    });
  }
});

app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const gradientImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><defs><linearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" style="stop-color:%23667eea;stop-opacity:1"/><stop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1"/></linearGradient></defs><rect width="400" height="600" fill="url(%23grad)"/></svg>`;
    
    res.json({ image: gradientImage });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Vite Middleware
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Mistral API: Ready");
  });
}

bootstrap();
