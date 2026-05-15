import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/alchemy", async (req, res) => {
  const { concepts } = req.body;
  
  if (!concepts || !Array.isArray(concepts) || concepts.length !== 3) {
    return res.status(400).json({ error: "Please provide exactly 3 concepts." });
  }

  try {
    const prompt = `Synthesize these 3 concepts into a singular design 'vibe': 
    1. ${concepts[0]}
    2. ${concepts[1]}
    3. ${concepts[2]}
    
    Provide a cohesive aesthetic identity including:
    1. A 'Manifesto' (a poetic, evocative 2-3 sentence description of this intersection).
    2. A 'Visual Prompt' for an image generation model to create a singular hero image representing this vibe.
    3. A color palette of 5 hex codes with descriptive names.
    4. Two font names for font pairings (one 'Display', one 'Body') that fit this mood.
    5. A unique 'Aesthetic Name' for this synthesis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["manifesto", "imagePrompt", "palette", "fonts", "aestheticName"],
          properties: {
            aestheticName: { type: Type.STRING },
            manifesto: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["hex", "name"],
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING }
                }
              }
            },
            fonts: {
              type: Type.OBJECT,
              required: ["display", "body"],
              properties: {
                display: { type: Type.STRING },
                body: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text!));
  } catch (error: any) {
    console.error("Alchemy Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    let imageData = null;
    for (const part of response.candidates![0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (!imageData) {
      throw new Error("No image data returned from model");
    }

    res.json({ image: `data:image/png;base64,${imageData}` });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ error: error.message });
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
  });
}

bootstrap();
