# 🎓 CareerGame

An interactive career exploration platform for kids aged 6-15. Play games, learn about real careers, and discover what you love!

## 🎮 6 Career Paths × 3 Games Each = 18 Mini-Games

### 🏗️ Construction Engineer
- **Bridge Builder** — Design bridges to withstand heavy loads
- **Blueprint Reader** — Read construction blueprints & identify specs
- **Build a Home** — Construct a house step by step

### 🩺 Medical Doctor
- **Diagnosis Detective** — Examine patients & diagnose conditions
- **First Aid Hero** — Handle real emergency scenarios
- **Surgery Simulator** — Put surgical steps in correct order

### 👨‍🍳 Chef & Cook
- **Kitchen Rush** — Time-management cooking challenge
- **Recipe Master** — Follow recipes with precision
- **Iron Chef Challenge** — Create dishes with mystery ingredients

### 🐙 Marine Biologist
- **Reef Explorer** — Identify sea creatures from clues
- **Ocean Health Monitor** — Test water quality at reef sites
- **Creature Rescue** — Save injured marine animals

### 🎮 Game Designer
- **Level Builder** — Design a platformer level
- **Pixel Art Studio** — Create game characters pixel by pixel
- **Code Quest** — Solve programming logic puzzles

### 🚒 Firefighter
- **Rescue Mission** — Search burning buildings for trapped people
- **Fire Safety Inspector** — Spot fire hazards in rooms
- **Emergency Response** — Make critical emergency decisions

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- Custom SVG illustrations
- Inline styles (no CSS framework dependency)

## 📁 Project Structure

```
app/
├── page.tsx                          # Landing page hub
├── globals.css                       # Global styles & animations
├── layout.tsx                        # Root layout
├── components/
│   ├── BackButton.tsx                # Shared navigation
│   └── games/                        # All game components
│       ├── game-bridge-builder.tsx
│       ├── game-blueprint-reader.tsx
│       └── ... (13 game components)
└── careers/
    ├── construction/                 # Career detail + 3 game pages
    ├── medical/
    ├── chef/
    ├── marine-biologist/
    ├── game-designer/
    └── firefighter/
```

## 🌐 Deploy on Vercel

Push to GitHub and connect to [Vercel](https://vercel.com) for instant deployment.

## 📝 License

MIT
