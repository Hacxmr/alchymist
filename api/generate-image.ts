import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  try {
    const gradientImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><defs><linearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" style="stop-color:%23667eea;stop-opacity:1"/><stop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1"/></linearGradient></defs><rect width="400" height="600" fill="url(%23grad)"/></svg>`;

    return res.status(200).json({ image: gradientImage });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
};
