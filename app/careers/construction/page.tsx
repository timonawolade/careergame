"use client";

import Link from "next/link";
import BackButton from "@/app/components/BackButton";

const GAMES = [
  { id: "bridge-builder", name: "Bridge Builder", emoji: "🌉", desc: "Design bridges to withstand heavy loads", difficulty: "Medium" },
  { id: "blueprint-reader", name: "Blueprint Reader", emoji: "📐", desc: "Read construction blueprints", difficulty: "Easy" },
  { id: "build-a-home", name: "Build a Home", emoji: "🏠", desc: "Construct a house step by step", difficulty: "Easy" },
];

export default function ConstructionCareer() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #FFF3E0 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <BackButton label="← All Careers" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🏗️</div>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Construction Engineer</h1>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280", marginBottom: 32 }}>Choose a game to play!</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GAMES.map((game) => (
            <Link key={game.id} href={`/careers/construction/${game.id}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "white", borderRadius: 18, border: "2px solid #F3F4F6", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: 32 }}>{game.emoji}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>{game.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>{game.desc}</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: 100, background: "#FFF3E0", fontSize: 11, fontWeight: 800, color: "#E65100" }}>{game.difficulty}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
