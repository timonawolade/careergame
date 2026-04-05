"use client";

import Link from "next/link";
import BackButton from "@/app/components/BackButton";

const GAMES = [
  { id: "rescue-mission", name: "Rescue Mission", emoji: "🏢", desc: "Search burning buildings for trapped people", difficulty: "Hard" },
  { id: "fire-safety", name: "Fire Safety Inspector", emoji: "🔍", desc: "Spot fire hazards in rooms", difficulty: "Easy" },
  { id: "emergency-response", name: "Emergency Response", emoji: "🚨", desc: "Make critical emergency decisions", difficulty: "Medium" },
];

export default function FirefighterCareer() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #FFEBEE 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <BackButton label="← All Careers" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🚒</div>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Firefighter</h1>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280", marginBottom: 32 }}>Choose a game to play!</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GAMES.map((game) => (
            <Link key={game.id} href={`/careers/firefighter/${game.id}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "white", borderRadius: 18, border: "2px solid #F3F4F6", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: 32 }}>{game.emoji}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>{game.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>{game.desc}</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: 100, background: "#FFEBEE", fontSize: 11, fontWeight: 800, color: "#C62828" }}>{game.difficulty}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
