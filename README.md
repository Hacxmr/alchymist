<div align="center">

# The Digital Alchemist
### AI-Powered Aesthetic Synthesis Engine

Transform disparate concepts into cohesive visual identities, design systems, and AI-generated creative directions.

<br>

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,ts,js" />
</p>

</div>

---

## What It Does

The Digital Alchemist is an AI-powered design synthesizer that combines multiple abstract concepts into a unified aesthetic system.

Enter three ideas — for example:

- Neon
- Baroque
- Cybernetics

The application synthesizes them into:

- AI-generated hero visuals
- Curated color palettes
- Font pairings
- Aesthetic manifestos
- Cohesive creative direction

Instead of generating isolated images, the system creates an entire design identity.

---

## Features

### Aesthetic Transmutation
Blend unrelated concepts into a coherent visual language.

### Vibe Cards
High-fidelity AI-generated visual compositions inspired by the synthesized themes.

### Design Systems
Each generation includes:
- 5-color palette
- Typography pairings
- Creative manifesto
- Technical aesthetic metadata

### Technical Interface
Minimal dark-mode interface with:
- fluid typography
- motion reveals
- cinematic transitions
- technical overlays

---

## Tech Stack

### AI
- Mistral AI — conceptual synthesis via `mistral-large-latest` model
- SVG gradient generation — visual representation

### Frontend
- React 19
- Vite 6
- Tailwind CSS 4
- Motion (Framer Motion alternative)

### Backend / Deployment
- Vercel Serverless Functions (`/api` directory)
- TypeScript runtime on Node.js
- No persistent server needed

---

## Run Locally

### Prerequisites
- Node.js 18+

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/the-digital-alchemist.git
cd the-digital-alchemist
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
MISTRAL_API_KEY=your_api_key_here
```

Get your API key from:

https://console.mistral.ai/

Leave the APP_URL variable as is (used only for deployment).

---

### 4. Start the development server

```bash
npm run dev
```

The application will run locally at:

```bash
http://localhost:3000
```

## Project Structure

```
alchymist/
├── src/                    # React frontend
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   └── lib/               # Utilities
├── api/                   # Vercel Serverless Functions
│   ├── alchemy.ts         # Mistral AI concept synthesis
│   └── generate-image.ts  # SVG image generation
├── dist/                  # Build output (Vite)
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel deployment config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## API Endpoints

### POST `/api/alchemy`

Synthesize 3 concepts into an aesthetic identity.

**Request:**
```json
{
  "concepts": ["concept1", "concept2", "concept3"]
}
```

**Response:**
```json
{
  "aestheticName": "Neon Baroque",
  "manifesto": "A poetic description...",
  "imagePrompt": "A detailed image prompt...",
  "palette": [
    {"hex": "#FF0000", "name": "Red"},
    ...
  ],
  "fonts": {
    "display": "Font name",
    "body": "Font name"
  }
}
```

### POST `/api/generate-image`

Generate an SVG gradient image.

**Request:**
```json
{
  "prompt": "image description"
}
```

**Response:**
```json
{
  "image": "data:image/svg+xml;..."
}
```

---

## Philosophy

The Digital Alchemist was intentionally designed as the smallest interesting version of an AI-native creative tool.

Instead of bloated workflows, dashboards, or productivity layers, it focuses entirely on one idea:

> The magic of conceptual synthesis.

The goal was not to build another generic image generator, but a system capable of transforming abstract concepts into coherent aesthetic identities.

---

## Future Improvements

With additional development time, the project could expand into:

- Interactive moodboard generation
- Exportable design systems
- Multi-image aesthetic exploration
- Style evolution timelines
- Collaborative creative sessions
- Animated visual synthesis

---

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variable in Vercel Dashboard:
   - **Name:** `MISTRAL_API_KEY`
   - **Value:** Your Mistral API key
4. Deploy

Vercel automatically:
- Builds the Vite frontend
- Sets up serverless functions from `/api` directory
- Handles routing between frontend and API

**Note:** Your Vercel deployment URL is your public app URL.

---

## Philosophy

## License

MIT License
