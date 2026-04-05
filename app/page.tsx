"use client";

import Link from "next/link";
import { useState } from "react";

const CAREERS = [
  {
    id: "construction",
    title: "Construction Engineer",
    emoji: "🏗️",
    color: "#E65100",
    bg: "#FFF3E0",
    tagline: "Build bridges, read blueprints & construct homes",
    skills: ["Problem Solving", "Math", "Physics"],
    salary: "$75K – $120K",
  },
  {
    id: "medical",
    title: "Medical Doctor",
    emoji: "🩺",
    color: "#1565C0",
    bg: "#E3F2FD",
    tagline: "Diagnose patients, learn first aid & perform surgery",
    skills: ["Science", "Empathy", "Attention to Detail"],
    salary: "$200K – $350K",
  },
  {
    id: "chef",
    title: "Chef & Cook",
    emoji: "👨‍🍳",
    color: "#E65100",
    bg: "#FFF8E1",
    tagline: "Master recipes, run a kitchen & compete in challenges",
    skills: ["Creativity", "Time Management", "Precision"],
    salary: "$45K – $90K",
  },
  {
    id: "marine-biologist",
    title: "Marine Biologist",
    emoji: "🐙",
    color: "#00838F",
    bg: "#E0F7FA",
    tagline: "Explore reefs, monitor ocean health & rescue creatures",
    skills: ["Science", "Observation", "Conservation"],
    salary: "$55K – $85K",
  },
  {
    id: "game-designer",
    title: "Game Designer",
    emoji: "🎮",
    color: "#4A148C",
    bg: "#EDE7F6",
    tagline: "Design levels, create pixel art & solve code puzzles",
    skills: ["Creativity", "Logic", "Programming"],
    salary: "$65K – $130K",
  },
  {
    id: "firefighter",
    title: "Firefighter",
    emoji: "🚒",
    color: "#C62828",
    bg: "#FFEBEE",
    tagline: "Rescue people, inspect safety & respond to emergencies",
    skills: ["Bravery", "Teamwork", "Quick Thinking"],
    salary: "$50K – $95K",
  },
];

// Inline SVG career illustrations
function ConstructionScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#87CEEB" rx="8" />
      <rect x="0" y="85" width="200" height="35" fill="#8BC34A" rx="4" />
      <rect x="30" y="35" width="45" height="50" fill="#E65100" rx="3" />
      <rect x="38" y="42" width="12" height="12" fill="#B3E5FC" rx="1" />
      <rect x="55" y="42" width="12" height="12" fill="#B3E5FC" rx="1" />
      <rect x="45" y="60" width="14" height="25" fill="#5D4037" rx="2" />
      <polygon points="25,35 52,15 80,35" fill="#BF360C" />
      <rect x="120" y="50" width="50" height="35" fill="#FFA726" rx="3" />
      <rect x="108" y="42" width="8" height="50" fill="#795548" />
      <line x1="112" y1="42" x2="135" y2="30" stroke="#795548" strokeWidth="3" />
      <line x1="135" y1="30" x2="160" y2="30" stroke="#795548" strokeWidth="2" />
      <line x1="160" y1="30" x2="160" y2="45" stroke="#616161" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="170" cy="25" r="12" fill="#FFEE58" opacity="0.8" />
    </svg>
  );
}
function DoctorScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#E3F2FD" rx="8" />
      <rect x="60" y="30" width="80" height="70" fill="white" rx="6" stroke="#90CAF9" strokeWidth="1.5" />
      <rect x="85" y="22" width="30" height="14" fill="#1565C0" rx="4" />
      <text x="100" y="32" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">ER</text>
      <rect x="92" y="50" width="16" height="3" fill="#EF5350" rx="1" />
      <rect x="98" y="44" width="4" height="15" fill="#EF5350" rx="1" />
      <circle cx="45" cy="55" r="10" fill="#FFCCBC" />
      <rect x="38" y="65" width="14" height="22" fill="white" rx="3" />
      <circle cx="155" cy="60" r="8" fill="#D7CCC8" />
      <rect x="149" y="68" width="12" height="18" fill="#90CAF9" rx="2" />
      <rect x="75" y="105" width="50" height="6" fill="#E0E0E0" rx="2" />
    </svg>
  );
}
function ChefScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#FFF8E1" rx="8" />
      <rect x="30" y="70" width="140" height="40" fill="#BCAAA4" rx="4" />
      <rect x="30" y="65" width="140" height="8" fill="#8D6E63" rx="2" />
      <circle cx="70" cy="55" r="18" fill="#E0E0E0" />
      <circle cx="70" cy="55" r="14" fill="#F5F5F5" />
      <circle cx="70" cy="50" r="4" fill="#EF5350" />
      <circle cx="66" cy="53" r="3" fill="#66BB6A" />
      <circle cx="74" cy="54" r="3" fill="#FFEE58" />
      <rect x="120" y="40" width="8" height="28" fill="#9E9E9E" rx="1" />
      <rect x="115" y="36" width="18" height="6" fill="#757575" rx="2" />
      <ellipse cx="55" cy="108" rx="20" ry="4" fill="#D7CCC8" opacity="0.5" />
      <text x="155" y="55" fontSize="18">🔥</text>
    </svg>
  );
}
function MarineScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#0288D1" rx="8" />
      <path d="M0 40 Q50 30 100 40 Q150 50 200 40 L200 120 L0 120Z" fill="#01579B" opacity="0.5" />
      <circle cx="50" cy="60" r="6" fill="#FFCC80" />
      <circle cx="53" cy="58" r="3" fill="#FFE082" />
      <rect x="80" y="80" width="30" height="20" fill="#66BB6A" rx="4" opacity="0.6" />
      <rect x="90" y="70" width="10" height="12" fill="#81C784" rx="2" opacity="0.5" />
      <circle cx="140" cy="55" r="4" fill="#4DD0E1" opacity="0.6" />
      <circle cx="150" cy="70" r="3" fill="#4DD0E1" opacity="0.4" />
      <text x="30" y="85" fontSize="14">🐠</text>
      <text x="120" y="95" fontSize="16">🐙</text>
      <text x="160" y="50" fontSize="12">🐬</text>
    </svg>
  );
}
function GameDevScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#311B92" rx="8" />
      <rect x="40" y="20" width="120" height="75" fill="#1A1A2E" rx="6" stroke="#7C4DFF" strokeWidth="1.5" />
      <rect x="50" y="28" width="100" height="55" fill="#0D0D1A" rx="3" />
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={55 + (i % 4) * 24} y={i < 4 ? 35 : 55} width="18" height="14" fill={["#EF5350","#66BB6A","#42A5F5","#FFEE58","#CE93D8","#FF7043","#26C6DA","#FFA726"][i]} rx="2" opacity="0.8" />
      ))}
      <rect x="70" y="95" width="60" height="6" fill="#424242" rx="2" />
      <circle cx="100" cy="102" r="3" fill="#7C4DFF" />
    </svg>
  );
}
function FirefighterScene() {
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="200" height="120" fill="#FFCCBC" rx="8" />
      <rect x="0" y="85" width="200" height="35" fill="#8D6E63" rx="4" />
      <rect x="60" y="30" width="80" height="55" fill="#F5F5F5" rx="4" stroke="#E0E0E0" strokeWidth="1" />
      <rect x="70" y="38" width="22" height="18" fill="#BBDEFB" rx="2" />
      <rect x="108" y="38" width="22" height="18" fill="#BBDEFB" rx="2" />
      <rect x="88" y="60" width="24" height="25" fill="#5D4037" rx="3" />
      <text x="42" y="48" fontSize="10">🔥</text>
      <text x="147" y="52" fontSize="10">🔥</text>
      <rect x="15" y="68" width="35" height="22" fill="#C62828" rx="4" />
      <rect x="8" y="86" width="10" height="8" fill="#424242" rx="2" />
      <rect x="38" y="86" width="10" height="8" fill="#424242" rx="2" />
      <rect x="20" y="72" width="8" height="6" fill="#BBDEFB" rx="1" />
      <circle cx="170" cy="40" r="14" fill="#FFEE58" opacity="0.7" />
    </svg>
  );
}

const SCENE_MAP: Record<string, () => JSX.Element> = {
  construction: ConstructionScene,
  medical: DoctorScene,
  chef: ChefScene,
  "marine-biologist": MarineScene,
  "game-designer": GameDevScene,
  firefighter: FirefighterScene,
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #FFFDF7 0%, #FFF 40%, #F9F9F9 100%)" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", padding: "60px 20px 40px" }}>
        <div style={{ fontSize: 48, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>🎓</div>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 42, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.1, marginBottom: 12 }}>
          Career<span style={{ background: "linear-gradient(135deg, #E65100, #1565C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Game</span>
        </h1>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#6B7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.5 }}>
          Explore real careers through fun games. Build, heal, cook, discover — find what you love!
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
          {[
            { num: "6", label: "Career Paths" },
            { num: "18", label: "Mini-Games" },
            { num: "6-15", label: "Ages" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A1A2E" }}>{s.num}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* How it works */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 20 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { step: "1", emoji: "🎯", title: "Pick a Career", desc: "Choose from 6 exciting career paths" },
            { step: "2", emoji: "🎮", title: "Play Games", desc: "3 unique games per career" },
            { step: "3", emoji: "🌟", title: "Learn & Grow", desc: "Discover real career facts" },
          ].map((s) => (
            <div key={s.step} style={{ textAlign: "center", padding: "20px 12px", background: "white", borderRadius: 18, border: "1.5px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Career cards */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 24 }}>Choose Your Path</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340, 1fr))", gap: 16 }}>
          {CAREERS.map((career) => {
            const Scene = SCENE_MAP[career.id];
            return (
              <Link
                key={career.id}
                href={`/careers/${career.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "2px solid #F3F4F6",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                }}>
                  <Scene />
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 24 }}>{career.emoji}</span>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 19, fontWeight: 700, color: "#1A1A2E" }}>{career.title}</h3>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10, lineHeight: 1.4 }}>{career.tagline}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {career.skills.map((s) => (
                        <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: career.bg, color: career.color }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>💰 {career.salary}/year</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: career.color }}>Play →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "30px 20px", borderTop: "1px solid #F3F4F6" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>
          CareerGame — Helping kids discover their future through play 🎮
        </p>
      </footer>
    </div>
  );
}
