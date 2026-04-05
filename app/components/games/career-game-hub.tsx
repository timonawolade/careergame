"use client";

import { useState, useEffect, useRef } from "react";

// ─── SVG SCENE ILLUSTRATIONS ───────────────────────────────────
function ConstructionScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Sky */}
      <rect width="280" height="180" rx="0" fill="#87CEEB" />
      <circle cx="240" cy="30" r="18" fill="#FFF9C4" opacity="0.9" />
      {/* Clouds */}
      <g opacity="0.7">
        <ellipse cx="60" cy="28" rx="22" ry="10" fill="white" />
        <ellipse cx="78" cy="24" rx="16" ry="8" fill="white" />
        <ellipse cx="180" cy="38" rx="18" ry="8" fill="white" />
      </g>
      {/* Ground */}
      <rect x="0" y="140" width="280" height="40" fill="#8D6E63" />
      <rect x="0" y="136" width="280" height="8" fill="#A1887F" />
      {/* Building under construction */}
      <rect x="60" y="70" width="80" height="70" fill="#B0BEC5" stroke="#78909C" strokeWidth="2" />
      <rect x="70" y="80" width="20" height="18" rx="2" fill="#42A5F5" opacity="0.6" />
      <rect x="100" y="80" width="20" height="18" rx="2" fill="#42A5F5" opacity="0.6" />
      <rect x="70" y="108" width="20" height="18" rx="2" fill="#42A5F5" opacity="0.4" />
      <rect x="100" y="108" width="20" height="18" rx="2" fill="#42A5F5" opacity="0.4" />
      {/* Scaffolding */}
      <line x1="55" y1="70" x2="55" y2="140" stroke="#FF8F00" strokeWidth="2" />
      <line x1="145" y1="70" x2="145" y2="140" stroke="#FF8F00" strokeWidth="2" />
      <line x1="55" y1="90" x2="145" y2="90" stroke="#FF8F00" strokeWidth="1.5" />
      <line x1="55" y1="110" x2="145" y2="110" stroke="#FF8F00" strokeWidth="1.5" />
      {/* Crane */}
      <line x1="190" y1="20" x2="190" y2="140" stroke="#FFA726" strokeWidth="3" />
      <line x1="150" y1="20" x2="230" y2="20" stroke="#FFA726" strokeWidth="3" />
      <line x1="190" y1="20" x2="150" y2="40" stroke="#FFA726" strokeWidth="2" />
      <line x1="160" y1="20" x2="160" y2="60" stroke="#757575" strokeWidth="1" />
      <rect x="155" y="56" width="10" height="8" fill="#FFA726" rx="1" />
      {/* Hard hat on ground */}
      <path d="M25 138 Q32 126 39 138" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />
      <rect x="22" y="136" width="20" height="4" rx="2" fill="#FDD835" />
      {/* Worker */}
      <circle cx="220" cy="122" r="7" fill="#FFCC80" />
      <rect x="215" y="129" width="10" height="14" rx="2" fill="#FF7043" />
      <path d="M214 118 Q220 112 226 118" fill="#FDD835" />
    </svg>
  );
}

function DoctorScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="180" fill="#E3F2FD" />
      {/* Hospital building */}
      <rect x="70" y="40" width="140" height="110" rx="8" fill="white" stroke="#90CAF9" strokeWidth="2" />
      <rect x="125" y="120" width="30" height="30" rx="3" fill="#64B5F6" />
      {/* Cross */}
      <rect x="127" y="48" width="26" height="8" rx="2" fill="#EF5350" />
      <rect x="136" y="40" width="8" height="26" rx="2" fill="#EF5350" />
      {/* Windows */}
      <rect x="85" y="75" width="22" height="18" rx="3" fill="#BBDEFB" />
      <rect x="85" y="102" width="22" height="18" rx="3" fill="#BBDEFB" />
      <rect x="173" y="75" width="22" height="18" rx="3" fill="#BBDEFB" />
      <rect x="173" y="102" width="22" height="18" rx="3" fill="#BBDEFB" />
      {/* Ground */}
      <rect x="0" y="150" width="280" height="30" fill="#A5D6A7" />
      <rect x="100" y="150" width="80" height="4" fill="#90A4AE" />
      {/* Ambulance */}
      <g>
        <rect x="15" y="125" width="45" height="28" rx="4" fill="white" stroke="#E53935" strokeWidth="1.5" />
        <rect x="15" y="125" width="20" height="28" rx="4" fill="#BBDEFB" />
        <rect x="30" y="132" width="14" height="5" rx="1" fill="#E53935" />
        <rect x="35" y="129" width="4" height="11" rx="1" fill="#E53935" />
        <circle cx="24" cy="155" r="5" fill="#424242" />
        <circle cx="50" cy="155" r="5" fill="#424242" />
        <circle cx="24" cy="155" r="2" fill="#9E9E9E" />
        <circle cx="50" cy="155" r="2" fill="#9E9E9E" />
      </g>
      {/* Heartbeat line */}
      <polyline points="0,90 20,90 30,90 35,75 40,105 45,85 50,95 55,90 70,90" stroke="#EF5350" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Stethoscope */}
      <g transform="translate(230, 80)">
        <path d="M0 0 L0 20 Q0 30 10 30 Q20 30 20 20 L20 0" stroke="#546E7A" strokeWidth="2.5" fill="none" />
        <circle cx="10" cy="35" r="6" fill="#546E7A" />
        <circle cx="10" cy="35" r="3" fill="#78909C" />
      </g>
    </svg>
  );
}

function ChefScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="180" fill="#FFF8E1" />
      {/* Kitchen wall */}
      <rect x="0" y="100" width="280" height="80" fill="#EFEBE9" />
      <rect x="0" y="96" width="280" height="8" fill="#D7CCC8" />
      {/* Shelf */}
      <rect x="20" y="30" width="120" height="4" fill="#8D6E63" />
      <rect x="30" y="8" width="16" height="22" rx="3" fill="#EF5350" />
      <rect x="50" y="12" width="14" height="18" rx="3" fill="#66BB6A" />
      <rect x="70" y="6" width="18" height="24" rx="3" fill="#42A5F5" />
      <rect x="95" y="10" width="12" height="20" rx="3" fill="#FFA726" />
      {/* Stove */}
      <rect x="40" y="100" width="90" height="60" rx="4" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
      <circle cx="65" cy="118" r="12" fill="#455A64" />
      <circle cx="65" cy="118" r="8" fill="#37474F" />
      <circle cx="105" cy="118" r="12" fill="#455A64" />
      <circle cx="105" cy="118" r="8" fill="#37474F" />
      {/* Pot on stove */}
      <rect x="50" y="100" width="30" height="20" rx="2" fill="#78909C" />
      <rect x="48" y="98" width="34" height="4" rx="2" fill="#607D8B" />
      {/* Steam */}
      <g opacity="0.4">
        <path d="M60 92 Q58 82 62 72" stroke="#90A4AE" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M68 90 Q70 78 66 68" stroke="#90A4AE" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      {/* Pan with food */}
      <ellipse cx="200" cy="115" rx="30" ry="8" fill="#5D4037" />
      <rect x="228" y="110" width="30" height="4" rx="2" fill="#4E342E" />
      <circle cx="192" cy="112" r="4" fill="#FFA726" />
      <circle cx="202" cy="110" r="3" fill="#EF5350" />
      <circle cx="208" cy="113" r="3.5" fill="#66BB6A" />
      {/* Chef hat */}
      <g transform="translate(210, 30)">
        <ellipse cx="20" cy="35" rx="18" ry="6" fill="white" stroke="#E0E0E0" strokeWidth="1" />
        <path d="M5 35 Q0 15 12 8 Q20 2 28 8 Q40 15 35 35" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      </g>
      {/* Knife */}
      <g transform="translate(160, 140) rotate(-20)">
        <rect x="0" y="0" width="6" height="20" rx="1" fill="#8D6E63" />
        <path d="M0 0 L6 0 L4 -22 L2 -24 L0 -22Z" fill="#B0BEC5" />
      </g>
    </svg>
  );
}

function MarineScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Ocean gradient */}
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#0277BD" />
        </linearGradient>
      </defs>
      <rect width="280" height="180" fill="url(#ocean)" />
      {/* Light rays */}
      <g opacity="0.15">
        <polygon points="80,0 100,180 60,180" fill="white" />
        <polygon points="150,0 180,180 130,180" fill="white" />
        <polygon points="220,0 250,180 200,180" fill="white" />
      </g>
      {/* Coral */}
      <g transform="translate(20, 140)">
        <path d="M0 40 Q5 20 10 0 Q12 10 15 25 Q18 5 22 0 Q24 15 28 40" fill="#EF5350" opacity="0.8" />
        <path d="M35 40 Q38 25 42 10 Q44 20 48 40" fill="#FF7043" opacity="0.7" />
      </g>
      <g transform="translate(200, 145)">
        <path d="M0 35 Q8 15 5 0 Q10 12 15 5 Q13 20 20 35" fill="#AB47BC" opacity="0.7" />
        <ellipse cx="30" cy="30" rx="12" ry="6" fill="#66BB6A" opacity="0.6" />
        <ellipse cx="50" cy="32" rx="10" ry="5" fill="#4CAF50" opacity="0.5" />
      </g>
      {/* Seaweed */}
      <path d="M120 180 Q115 150 125 130 Q118 120 128 100" stroke="#388E3C" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M130 180 Q135 155 128 140 Q136 125 130 110" stroke="#2E7D32" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Big fish */}
      <g transform="translate(150, 60)">
        <ellipse cx="30" cy="15" rx="28" ry="14" fill="#FFB74D" />
        <polygon points="58,15 72,5 72,25" fill="#FFA726" />
        <circle cx="18" cy="12" r="3" fill="white" />
        <circle cx="18" cy="12" r="1.5" fill="#1A237E" />
        <path d="M10 20 Q18 24 25 20" stroke="#EF6C00" strokeWidth="1" fill="none" />
      </g>
      {/* Small fish */}
      <g transform="translate(60, 80)">
        <ellipse cx="12" cy="6" rx="11" ry="6" fill="#80DEEA" />
        <polygon points="23,6 32,1 32,11" fill="#4DD0E1" />
        <circle cx="7" cy="5" r="1.5" fill="#0D47A1" />
      </g>
      <g transform="translate(90, 40)">
        <ellipse cx="10" cy="5" rx="9" ry="5" fill="#CE93D8" />
        <polygon points="19,5 26,1 26,9" fill="#BA68C8" />
        <circle cx="5" cy="4" r="1.5" fill="#1A237E" />
      </g>
      {/* Turtle */}
      <g transform="translate(170, 110)">
        <ellipse cx="18" cy="12" rx="16" ry="10" fill="#66BB6A" />
        <ellipse cx="18" cy="12" rx="12" ry="7" fill="#81C784" />
        <circle cx="5" cy="8" r="4" fill="#66BB6A" />
        <circle cx="3" cy="7" r="1" fill="#1B5E20" />
        <ellipse cx="32" cy="16" rx="3" ry="5" fill="#66BB6A" />
        <ellipse cx="6" cy="18" rx="5" ry="3" fill="#66BB6A" />
      </g>
      {/* Bubbles */}
      <circle cx="100" cy="30" r="4" fill="white" opacity="0.3" />
      <circle cx="110" cy="50" r="3" fill="white" opacity="0.25" />
      <circle cx="95" cy="60" r="2" fill="white" opacity="0.2" />
      <circle cx="200" cy="25" r="3" fill="white" opacity="0.3" />
      <circle cx="45" cy="45" r="2.5" fill="white" opacity="0.2" />
    </svg>
  );
}

function GameDevScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="180" fill="#1A1A2E" />
      {/* Grid floor */}
      <g opacity="0.15" stroke="#7C4DFF" strokeWidth="0.5">
        {[0, 20, 40, 60, 80].map((y) => (
          <line key={`h${y}`} x1="0" y1={120 + y * 0.75} x2="280" y2={120 + y * 0.75} />
        ))}
        {[0, 40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line key={`v${x}`} x1={x} y1="120" x2={x < 140 ? x - 30 : x + 30} y2="180" />
        ))}
      </g>
      {/* Monitor */}
      <rect x="80" y="20" width="120" height="85" rx="6" fill="#16213E" stroke="#7C4DFF" strokeWidth="2" />
      <rect x="86" y="26" width="108" height="68" rx="3" fill="#0F3460" />
      {/* Code on screen */}
      <rect x="92" y="32" width="40" height="4" rx="1" fill="#7C4DFF" opacity="0.7" />
      <rect x="92" y="40" width="55" height="4" rx="1" fill="#00BFA5" opacity="0.6" />
      <rect x="100" y="48" width="35" height="4" rx="1" fill="#FF6E40" opacity="0.5" />
      <rect x="100" y="56" width="45" height="4" rx="1" fill="#FDD835" opacity="0.5" />
      <rect x="92" y="64" width="30" height="4" rx="1" fill="#7C4DFF" opacity="0.6" />
      <rect x="92" y="72" width="50" height="4" rx="1" fill="#80CBC4" opacity="0.5" />
      {/* Game preview on right side of screen */}
      <rect x="152" y="32" width="36" height="56" rx="2" fill="#1A237E" />
      <rect x="158" y="60" width="8" height="12" rx="1" fill="#66BB6A" />
      <circle cx="175" cy="50" r="5" fill="#EF5350" />
      <rect x="160" y="42" width="6" height="6" fill="#FDD835" />
      {/* Monitor stand */}
      <rect x="130" y="105" width="20" height="8" rx="1" fill="#16213E" />
      <rect x="120" y="111" width="40" height="4" rx="2" fill="#16213E" />
      {/* Controller */}
      <g transform="translate(25, 100)">
        <rect x="0" y="10" width="40" height="22" rx="11" fill="#311B92" />
        <circle cx="12" cy="21" r="4" fill="#1A1A2E" />
        <rect x="9" y="18" width="6" height="6" rx="3" fill="#7C4DFF" />
        <circle cx="28" cy="17" r="2" fill="#EF5350" />
        <circle cx="33" cy="21" r="2" fill="#42A5F5" />
        <circle cx="28" cy="25" r="2" fill="#66BB6A" />
        <circle cx="23" cy="21" r="2" fill="#FDD835" />
      </g>
      {/* Pixel art character */}
      <g transform="translate(220, 50)">
        {/* Head */}
        <rect x="8" y="0" width="16" height="16" fill="#FFB74D" />
        {/* Eyes */}
        <rect x="10" y="6" width="4" height="4" fill="#1A1A2E" />
        <rect x="18" y="6" width="4" height="4" fill="#1A1A2E" />
        {/* Body */}
        <rect x="6" y="16" width="20" height="16" fill="#42A5F5" />
        {/* Legs */}
        <rect x="8" y="32" width="6" height="10" fill="#1565C0" />
        <rect x="18" y="32" width="6" height="10" fill="#1565C0" />
        {/* Arms */}
        <rect x="0" y="18" width="6" height="10" fill="#42A5F5" />
        <rect x="26" y="18" width="6" height="10" fill="#42A5F5" />
      </g>
      {/* Floating stars */}
      <text x="40" y="40" fontSize="14" opacity="0.6">✦</text>
      <text x="250" y="30" fontSize="10" opacity="0.4">✦</text>
      <text x="30" y="70" fontSize="8" opacity="0.3">✦</text>
      <text x="260" y="90" fontSize="12" opacity="0.5">✦</text>
    </svg>
  );
}

function FirefighterScene() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="280" height="180" fill="#FF8A65" />
      {/* Smoky sky */}
      <rect width="280" height="120" fill="#FF7043" opacity="0.6" />
      <ellipse cx="80" cy="30" rx="50" ry="25" fill="#BDBDBD" opacity="0.3" />
      <ellipse cx="200" cy="20" rx="40" ry="20" fill="#9E9E9E" opacity="0.25" />
      {/* Fire station */}
      <rect x="140" y="50" width="100" height="100" fill="#C62828" rx="4" />
      <rect x="140" y="44" width="100" height="12" fill="#B71C1C" rx="2" />
      <rect x="155" y="100" width="32" height="50" rx="2" fill="#FFCC80" stroke="#FFB74D" strokeWidth="1" />
      <rect x="200" y="65" width="25" height="20" rx="2" fill="#FFAB91" />
      <rect x="200" y="90" width="25" height="20" rx="2" fill="#FFAB91" />
      {/* Fire station sign */}
      <circle cx="190" cy="60" r="10" fill="white" opacity="0.9" />
      <text x="190" y="64" textAnchor="middle" fontSize="12" fill="#C62828" fontWeight="bold">🚒</text>
      {/* Fire truck */}
      <g transform="translate(10, 108)">
        <rect x="0" y="8" width="70" height="32" rx="4" fill="#D32F2F" />
        <rect x="55" y="4" width="24" height="36" rx="4" fill="#E53935" />
        <rect x="58" y="8" width="18" height="14" rx="2" fill="#BBDEFB" opacity="0.7" />
        {/* Ladder */}
        <rect x="5" y="6" width="45" height="3" rx="1" fill="#FDD835" />
        <rect x="10" y="2" width="2" height="10" fill="#F9A825" />
        <rect x="20" y="2" width="2" height="10" fill="#F9A825" />
        <rect x="30" y="2" width="2" height="10" fill="#F9A825" />
        <rect x="40" y="2" width="2" height="10" fill="#F9A825" />
        {/* Wheels */}
        <circle cx="20" cy="42" r="7" fill="#424242" />
        <circle cx="60" cy="42" r="7" fill="#424242" />
        <circle cx="20" cy="42" r="3" fill="#757575" />
        <circle cx="60" cy="42" r="3" fill="#757575" />
        {/* Light */}
        <rect x="62" y="0" width="10" height="6" rx="3" fill="#F44336" />
      </g>
      {/* Flames */}
      <g opacity="0.7" transform="translate(100, 60)">
        <path d="M10 50 Q5 30 15 15 Q12 25 20 10 Q18 28 25 20 Q22 35 30 50Z" fill="#FF9800" />
        <path d="M14 50 Q12 35 18 22 Q16 32 22 25 Q20 38 26 50Z" fill="#FDD835" />
      </g>
      {/* Water spray */}
      <g opacity="0.5">
        <path d="M80 140 Q90 125 105 115 Q115 108 125 105" stroke="#42A5F5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 3" />
      </g>
      {/* Ground */}
      <rect x="0" y="150" width="280" height="30" fill="#5D4037" />
    </svg>
  );
}

// ─── MASCOT ───────────────────────────────────
function Mascot({ size = 80 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <circle cx="50" cy="55" r="32" fill="#FDD835" />
      <circle cx="50" cy="55" r="28" fill="#FFEE58" />
      {/* Eyes */}
      <circle cx="40" cy="48" r="5" fill="white" />
      <circle cx="60" cy="48" r="5" fill="white" />
      <circle cx="41" cy="48" r="2.5" fill="#1A237E" />
      <circle cx="61" cy="48" r="2.5" fill="#1A237E" />
      <circle cx="42" cy="47" r="1" fill="white" />
      <circle cx="62" cy="47" r="1" fill="white" />
      {/* Smile */}
      <path d="M38 58 Q50 70 62 58" stroke="#F57F17" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Graduation cap */}
      <polygon points="50,18 20,30 50,42 80,30" fill="#1A237E" />
      <rect x="47" y="18" width="6" height="12" fill="#1A237E" />
      <line x1="72" y1="32" x2="72" y2="45" stroke="#1A237E" strokeWidth="1.5" />
      <circle cx="72" cy="46" r="2.5" fill="#FDD835" />
      {/* Cheeks */}
      <circle cx="32" cy="56" r="5" fill="#FFB74D" opacity="0.4" />
      <circle cx="68" cy="56" r="5" fill="#FFB74D" opacity="0.4" />
    </svg>
  );
}

// ─── CAREER DATA ───────────────────────────────
const CAREERS = [
  {
    id: "construction-engineer",
    title: "Construction Engineer",
    tagline: "Build the world around you",
    emoji: "🏗️",
    color: "#E65100",
    colorLight: "#FFF3E0",
    colorMid: "#FFE0B2",
    scene: ConstructionScene,
    skills: ["Physics", "Design", "Problem Solving"],
    games: 3,
    description: "Design bridges that hold real weight, build houses from foundation to roof, and read blueprints like a pro.",
  },
  {
    id: "medical-doctor",
    title: "Medical Doctor",
    tagline: "Heal, discover, save lives",
    emoji: "🩺",
    color: "#1565C0",
    colorLight: "#E3F2FD",
    colorMid: "#BBDEFB",
    scene: DoctorScene,
    skills: ["Science", "Critical Thinking", "Empathy"],
    games: 3,
    description: "Diagnose patients by their symptoms, learn about the human body, and perform life-saving procedures.",
  },
  {
    id: "chef",
    title: "Chef & Cook",
    tagline: "Create flavors, feed the world",
    emoji: "👨‍🍳",
    color: "#E65100",
    colorLight: "#FFF8E1",
    colorMid: "#FFECB3",
    scene: ChefScene,
    skills: ["Creativity", "Time Management", "Chemistry"],
    games: 3,
    description: "Master recipes under pressure, manage a rush-hour kitchen, and compete in cooking challenges.",
  },
  {
    id: "marine-biologist",
    title: "Marine Biologist",
    tagline: "Explore the ocean's secrets",
    emoji: "🐙",
    color: "#00838F",
    colorLight: "#E0F7FA",
    colorMid: "#B2EBF2",
    scene: MarineScene,
    skills: ["Biology", "Observation", "Conservation"],
    games: 3,
    description: "Dive deep to classify sea creatures, track ocean health, and protect endangered marine life.",
  },
  {
    id: "game-designer",
    title: "Game Designer",
    tagline: "Imagine it, then build it",
    emoji: "🎮",
    color: "#4A148C",
    colorLight: "#EDE7F6",
    colorMid: "#D1C4E9",
    scene: GameDevScene,
    skills: ["Logic", "Art", "Storytelling"],
    games: 3,
    description: "Design levels, write game logic, and create pixel art — build games inside a game.",
  },
  {
    id: "firefighter",
    title: "Firefighter",
    tagline: "Courage when it counts",
    emoji: "🚒",
    color: "#C62828",
    colorLight: "#FFEBEE",
    colorMid: "#FFCDD2",
    scene: FirefighterScene,
    skills: ["Teamwork", "Quick Thinking", "Bravery"],
    games: 3,
    description: "Race to emergencies, rescue people from danger, and learn fire safety that could save real lives.",
  },
];

// ─── MAIN COMPONENT ───────────────────────────────
export default function CareerGameHub() {
  const [hoveredCareer, setHoveredCareer] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  if (selectedCareer) {
    const career = CAREERS.find((c) => c.id === selectedCareer);
    return <CareerDetail career={career} onBack={() => setSelectedCareer(null)} />;
  }

  return (
    <div style={s.page}>
      <style>{cssAnimations}</style>

      {/* Dotted background texture */}
      <div style={s.bgDots} />

      {/* ── HERO ── */}
      <header style={{ ...s.hero, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: "all 0.8s cubic-bezier(.22,1,.36,1)" }}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroBadge}>
              <span style={s.heroBadgeDot} />
              Ages 6–15
            </div>
            <h1 style={s.heroTitle}>
              What do you want
              <br />
              to be when you
              <br />
              <span style={s.heroHighlight}>grow up?</span>
            </h1>
            <p style={s.heroSub}>
              Explore real careers through games that teach you actual skills. Not a quiz — a hands-on adventure.
            </p>
            <div style={s.heroStats}>
              <div style={s.heroStat}>
                <div style={s.heroStatNum}>6</div>
                <div style={s.heroStatLabel}>Careers</div>
              </div>
              <div style={s.heroStatDivider} />
              <div style={s.heroStat}>
                <div style={s.heroStatNum}>18</div>
                <div style={s.heroStatLabel}>Games</div>
              </div>
              <div style={s.heroStatDivider} />
              <div style={s.heroStat}>
                <div style={s.heroStatNum}>Free</div>
                <div style={s.heroStatLabel}>Forever</div>
              </div>
            </div>
          </div>
          <div style={s.heroRight}>
            <div style={s.mascotWrap}>
              <Mascot size={120} />
            </div>
            <div style={s.heroFloatingCards}>
              {["🏗️", "🩺", "👨‍🍳", "🎮", "🐙", "🚒"].map((e, i) => (
                <div
                  key={i}
                  style={{
                    ...s.floatingEmoji,
                    animationDelay: `${i * 0.4}s`,
                    left: `${15 + (i % 3) * 30}%`,
                    top: `${10 + Math.floor(i / 3) * 45}%`,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── HOW IT WORKS ── */}
      <section style={s.howSection}>
        <div style={s.howInner}>
          <div style={s.sectionLabel}>How it works</div>
          <div style={s.howGrid}>
            {[
              { num: "01", title: "Pick a career", desc: "Choose from 6 real-world career paths that interest you", icon: "🧭" },
              { num: "02", title: "Play the games", desc: "Each career has 3 mini-games that simulate real job tasks", icon: "🎯" },
              { num: "03", title: "Learn real skills", desc: "Earn points while discovering if this career is your calling", icon: "🧠" },
            ].map((step, i) => (
              <div key={i} style={{ ...s.howCard, animationDelay: `${0.2 + i * 0.15}s` }}>
                <div style={s.howNum}>{step.num}</div>
                <div style={s.howIcon}>{step.icon}</div>
                <h3 style={s.howTitle}>{step.title}</h3>
                <p style={s.howDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER CARDS ── */}
      <section style={s.careersSection}>
        <div style={s.careersInner}>
          <div style={s.sectionLabel}>Choose your path</div>
          <h2 style={s.careersHeading}>Explore Career Worlds</h2>
          <div style={s.careerGrid}>
            {CAREERS.map((career, i) => {
              const Scene = career.scene;
              const isHovered = hoveredCareer === career.id;
              return (
                <button
                  key={career.id}
                  style={{
                    ...s.careerCard,
                    animationDelay: `${0.1 + i * 0.08}s`,
                    transform: isHovered ? "translateY(-8px) scale(1.02)" : "none",
                    boxShadow: isHovered
                      ? `0 20px 40px ${career.color}25, 0 8px 16px rgba(0,0,0,0.08)`
                      : "0 4px 16px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={() => setHoveredCareer(career.id)}
                  onMouseLeave={() => setHoveredCareer(null)}
                  onClick={() => setSelectedCareer(career.id)}
                >
                  {/* Scene illustration */}
                  <div style={{ ...s.sceneWrap, transform: isHovered ? "scale(1.05)" : "none" }}>
                    <Scene />
                  </div>

                  {/* Content */}
                  <div style={s.cardContent}>
                    <div style={s.cardTop}>
                      <span style={s.cardEmoji}>{career.emoji}</span>
                      <div style={{ ...s.cardGameCount, background: career.colorLight, color: career.color }}>
                        {career.games} games
                      </div>
                    </div>
                    <h3 style={s.cardTitle}>{career.title}</h3>
                    <p style={s.cardTagline}>{career.tagline}</p>
                    <div style={s.cardSkills}>
                      {career.skills.map((skill) => (
                        <span key={skill} style={{ ...s.skillChip, background: career.colorLight, color: career.color }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div style={{ ...s.cardCta, background: career.color, opacity: isHovered ? 1 : 0.85 }}>
                      Explore →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <Mascot size={36} />
            <span style={s.footerLogo}>CareerGame</span>
          </div>
          <p style={s.footerText}>Helping kids discover their future through play.</p>
          <div style={s.footerLinks}>
            <span style={s.footerLink}>About</span>
            <span style={s.footerDot}>·</span>
            <span style={s.footerLink}>For Parents</span>
            <span style={s.footerDot}>·</span>
            <span style={s.footerLink}>For Teachers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── CAREER DETAIL PAGE ───────────────────────────
function CareerDetail({ career, onBack }) {
  const Scene = career.scene;

  const GAME_DATA = {
    "construction-engineer": [
      { id: "bridge-builder", name: "Bridge Builder", desc: "Design and test bridges with real physics — pick materials, manage budgets, and see if your bridge holds!", icon: "🌉", difficulty: "Medium" },
      { id: "bungalow-builder", name: "Build a Home", desc: "Construct a house step by step — foundation, walls, roof. Stay on budget and on schedule.", icon: "🏠", difficulty: "Easy" },
      { id: "blueprint-reader", name: "Blueprint Reader", desc: "Read construction plans and match the right materials. Attention to detail is everything.", icon: "📐", difficulty: "Medium" },
    ],
    "medical-doctor": [
      { id: "diagnosis-detective", name: "Diagnosis Detective", desc: "Examine patients, check symptoms, and figure out what's wrong — just like a real doctor.", icon: "🔍", difficulty: "Medium" },
      { id: "first-aid-hero", name: "First Aid Hero", desc: "Learn life-saving first aid skills in emergency scenarios. Every second counts!", icon: "🏥", difficulty: "Easy" },
      { id: "surgery-sim", name: "Surgery Simulator", desc: "Steady hands required! Follow the steps to complete procedures safely.", icon: "🔬", difficulty: "Hard" },
    ],
    chef: [
      { id: "kitchen-rush", name: "Kitchen Rush", desc: "Customers are waiting! Cook orders fast, keep quality high, and don't burn anything.", icon: "⏱️", difficulty: "Medium" },
      { id: "recipe-master", name: "Recipe Master", desc: "Follow recipes step by step — measure ingredients, mix, and time everything perfectly.", icon: "📖", difficulty: "Easy" },
      { id: "iron-chef", name: "Iron Chef Challenge", desc: "Mystery ingredients! Create a dish from surprise items and impress the judges.", icon: "🏆", difficulty: "Hard" },
    ],
    "marine-biologist": [
      { id: "reef-explorer", name: "Reef Explorer", desc: "Dive into coral reefs and identify marine species. Build your field journal!", icon: "🐠", difficulty: "Easy" },
      { id: "ocean-health", name: "Ocean Health Monitor", desc: "Test water quality, track pollution, and protect endangered habitats.", icon: "🌊", difficulty: "Medium" },
      { id: "creature-rescue", name: "Creature Rescue", desc: "Rescue injured sea animals, treat them, and release them back into the wild.", icon: "🐢", difficulty: "Medium" },
    ],
    "game-designer": [
      { id: "level-builder", name: "Level Builder", desc: "Place platforms, enemies, and power-ups to design a playable game level.", icon: "🗺️", difficulty: "Medium" },
      { id: "pixel-studio", name: "Pixel Art Studio", desc: "Create characters and items pixel by pixel. Design your game's visual style.", icon: "🎨", difficulty: "Easy" },
      { id: "code-quest", name: "Code Quest", desc: "Solve logic puzzles using basic coding concepts — loops, conditions, and sequences.", icon: "💻", difficulty: "Hard" },
    ],
    firefighter: [
      { id: "rescue-mission", name: "Rescue Mission", desc: "Navigate through buildings, find trapped people, and get everyone out safely.", icon: "🏢", difficulty: "Medium" },
      { id: "fire-safety", name: "Fire Safety Inspector", desc: "Spot fire hazards in homes and buildings before they become dangerous.", icon: "🔍", difficulty: "Easy" },
      { id: "emergency-response", name: "Emergency Response", desc: "Drive the truck, deploy the team, and coordinate a real emergency response.", icon: "🚨", difficulty: "Hard" },
    ],
  };

  const games = GAME_DATA[career.id] || [];
  const diffColors = { Easy: "#27AE60", Medium: "#F39C12", Hard: "#E74C3C" };

  return (
    <div style={{ ...s.page, background: `linear-gradient(170deg, ${career.colorLight} 0%, white 40%, ${career.colorLight}44 100%)` }}>
      <style>{cssAnimations}</style>
      <div style={s.bgDots} />

      {/* Header */}
      <div style={s.detailHeader}>
        <button onClick={onBack} style={s.backButton}>← Back</button>

        <div style={s.detailHero}>
          <div style={s.detailSceneWrap}>
            <Scene />
          </div>
          <div style={s.detailInfo}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{career.emoji}</div>
            <h1 style={{ ...s.detailTitle, color: career.color }}>{career.title}</h1>
            <p style={s.detailTagline}>{career.tagline}</p>
            <p style={s.detailDesc}>{career.description}</p>
            <div style={s.detailSkills}>
              {career.skills.map((skill) => (
                <span key={skill} style={{ ...s.detailSkillChip, background: career.colorMid, color: career.color }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games */}
      <div style={s.gamesSection}>
        <div style={s.gamesInner}>
          <h2 style={s.gamesHeading}>Choose a Game</h2>
          <div style={s.gamesGrid}>
            {games.map((game, i) => (
              <div
                key={game.id}
                style={{
                  ...s.gameCard,
                  animationDelay: `${0.1 + i * 0.1}s`,
                  borderLeft: `5px solid ${career.color}`,
                }}
              >
                <div style={s.gameTop}>
                  <span style={s.gameIcon}>{game.icon}</span>
                  <span style={{ ...s.gameDifficulty, background: `${diffColors[game.difficulty]}18`, color: diffColors[game.difficulty] }}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 style={s.gameName}>{game.name}</h3>
                <p style={s.gameDesc}>{game.desc}</p>
                <button style={{ ...s.gamePlayBtn, background: career.color }}>
                  Play Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career insight */}
      <div style={s.insightSection}>
        <div style={s.insightCard}>
          <div style={s.insightIcon}>🎓</div>
          <div>
            <h3 style={s.insightTitle}>Real Career Insight</h3>
            <p style={s.insightText}>
              Every game in this path teaches skills that real {career.title.toLowerCase()}s use every day.
              Playing all 3 games gives you a taste of what this career actually feels like — the fun parts and the challenging parts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATIONS ───────────────────────────────
const cssAnimations = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-12px) rotate(3deg); }
    66% { transform: translateY(6px) rotate(-2deg); }
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10px) scale(1.1); }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// ─── STYLES ───────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(170deg, #FFFDF5 0%, #FFF 30%, #F5FAFF 70%, #FFFDF5 100%)",
    fontFamily: "'Nunito', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgDots: {
    position: "fixed",
    inset: 0,
    backgroundImage: "radial-gradient(circle, #E0D8CC 0.8px, transparent 0.8px)",
    backgroundSize: "28px 28px",
    opacity: 0.35,
    pointerEvents: "none",
  },

  // HERO
  hero: {
    padding: "60px 24px 40px",
    position: "relative",
    zIndex: 1,
  },
  heroInner: {
    maxWidth: 1000,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "center",
  },
  heroLeft: {},
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#FFF8E1",
    border: "1.5px solid #FFE082",
    padding: "6px 16px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 800,
    color: "#F57F17",
    marginBottom: 20,
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4CAF50",
    display: "inline-block",
  },
  heroTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 46,
    fontWeight: 700,
    color: "#1A1A2E",
    lineHeight: 1.1,
    marginBottom: 18,
    letterSpacing: "-0.5px",
  },
  heroHighlight: {
    background: "linear-gradient(135deg, #FF6F00 0%, #F4511E 50%, #D32F2F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 17,
    fontWeight: 600,
    color: "#6B7280",
    lineHeight: 1.6,
    maxWidth: 420,
    marginBottom: 28,
  },
  heroStats: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  heroStat: { textAlign: "center" },
  heroStatNum: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#1A1A2E",
  },
  heroStatLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 36,
    background: "#E5E7EB",
  },
  heroRight: {
    position: "relative",
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotWrap: {
    position: "relative",
    zIndex: 2,
    animation: "float 5s ease-in-out infinite",
  },
  heroFloatingCards: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  floatingEmoji: {
    position: "absolute",
    fontSize: 32,
    animation: "floatEmoji 4s ease-in-out infinite",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },

  // HOW IT WORKS
  howSection: {
    padding: "40px 24px 60px",
    position: "relative",
    zIndex: 1,
  },
  howInner: {
    maxWidth: 900,
    margin: "0 auto",
  },
  sectionLabel: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 2.5,
    marginBottom: 24,
  },
  howGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },
  howCard: {
    background: "white",
    borderRadius: 20,
    padding: "28px 22px",
    border: "1.5px solid #F3F4F6",
    animation: "fadeInUp 0.6s ease-out both",
  },
  howNum: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#D1D5DB",
    marginBottom: 12,
  },
  howIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  howTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: 6,
  },
  howDesc: {
    fontSize: 14,
    fontWeight: 600,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },

  // CAREERS
  careersSection: {
    padding: "20px 24px 60px",
    position: "relative",
    zIndex: 1,
  },
  careersInner: {
    maxWidth: 1060,
    margin: "0 auto",
  },
  careersHeading: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 34,
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: 32,
    marginTop: 4,
  },
  careerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
  },
  careerCard: {
    background: "white",
    borderRadius: 22,
    overflow: "hidden",
    border: "1.5px solid #F3F4F6",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
    animation: "fadeInUp 0.6s ease-out both",
    textAlign: "left",
    display: "block",
    width: "100%",
    fontFamily: "'Nunito', sans-serif",
  },
  sceneWrap: {
    width: "100%",
    height: 150,
    overflow: "hidden",
    transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
  },
  cardContent: {
    padding: "18px 20px 20px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardGameCount: {
    fontSize: 11,
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: 100,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: 4,
  },
  cardTagline: {
    fontSize: 13,
    fontWeight: 600,
    color: "#9CA3AF",
    marginBottom: 14,
  },
  cardSkills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 16,
  },
  skillChip: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 100,
  },
  cardCta: {
    width: "100%",
    textAlign: "center",
    padding: "10px 0",
    borderRadius: 12,
    color: "white",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    transition: "opacity 0.2s",
  },

  // FOOTER
  footer: {
    padding: "40px 24px",
    borderTop: "1.5px solid #F3F4F6",
    position: "relative",
    zIndex: 1,
  },
  footerInner: {
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  footerLogo: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#1A1A2E",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: 600,
    marginBottom: 14,
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    fontSize: 13,
    fontWeight: 700,
  },
  footerLink: {
    color: "#6B7280",
    cursor: "pointer",
  },
  footerDot: {
    color: "#D1D5DB",
  },

  // DETAIL PAGE
  detailHeader: {
    padding: "20px 24px 0",
    maxWidth: 1000,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  backButton: {
    background: "white",
    border: "1.5px solid #E5E7EB",
    borderRadius: 12,
    padding: "10px 20px",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    color: "#6B7280",
    cursor: "pointer",
    marginBottom: 24,
    display: "inline-block",
  },
  detailHero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    alignItems: "center",
    marginBottom: 40,
  },
  detailSceneWrap: {
    borderRadius: 22,
    overflow: "hidden",
    border: "2px solid #F3F4F6",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  detailInfo: {
    padding: "8px 0",
  },
  detailTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 6,
  },
  detailTagline: {
    fontSize: 16,
    fontWeight: 700,
    color: "#9CA3AF",
    marginBottom: 14,
  },
  detailDesc: {
    fontSize: 15,
    fontWeight: 600,
    color: "#6B7280",
    lineHeight: 1.6,
    marginBottom: 18,
  },
  detailSkills: {
    display: "flex",
    gap: 8,
  },
  detailSkillChip: {
    fontSize: 13,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 100,
  },

  // GAMES
  gamesSection: {
    padding: "0 24px 40px",
    position: "relative",
    zIndex: 1,
  },
  gamesInner: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  gamesHeading: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: 20,
  },
  gamesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },
  gameCard: {
    background: "white",
    borderRadius: 20,
    padding: "24px 22px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1.5px solid #F3F4F6",
    animation: "fadeInUp 0.5s ease-out both",
  },
  gameTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  gameIcon: { fontSize: 28 },
  gameDifficulty: {
    fontSize: 11,
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: 100,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gameName: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 19,
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: 8,
  },
  gameDesc: {
    fontSize: 13,
    fontWeight: 600,
    color: "#9CA3AF",
    lineHeight: 1.55,
    marginBottom: 18,
  },
  gamePlayBtn: {
    width: "100%",
    padding: "11px 0",
    borderRadius: 12,
    border: "none",
    color: "white",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },

  // INSIGHT
  insightSection: {
    padding: "0 24px 60px",
    position: "relative",
    zIndex: 1,
  },
  insightCard: {
    maxWidth: 1000,
    margin: "0 auto",
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    background: "#FFFDF5",
    border: "1.5px solid #FFF3C4",
    borderRadius: 20,
    padding: "24px 28px",
  },
  insightIcon: { fontSize: 32, flexShrink: 0, marginTop: 2 },
  insightTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: "#92400E",
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#B45309",
    lineHeight: 1.6,
  },
};
