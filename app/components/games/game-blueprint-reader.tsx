"use client";

import { useState, useCallback } from "react";

const BLUEPRINTS = [
  {
    id: 1,
    name: "Garden Shed",
    difficulty: "Easy",
    image: { type: "shed", walls: 4, roof: "gable", foundation: "concrete", material: "wood", windows: 1, door: 1 },
    requirements: [
      { category: "Foundation", correct: "Concrete Slab", options: ["Concrete Slab", "Wooden Stilts", "Brick Piers", "No Foundation"] },
      { category: "Wall Material", correct: "Wood Panels", options: ["Wood Panels", "Brick", "Glass", "Steel Sheets"] },
      { category: "Roof Type", correct: "Gable Roof", options: ["Flat Roof", "Gable Roof", "Dome Roof", "Green Roof"] },
      { category: "Windows", correct: "1 Window", options: ["No Windows", "1 Window", "2 Windows", "4 Windows"] },
    ],
    funFact: "Garden sheds need good ventilation to prevent moisture buildup. That's why even a small shed has at least one window!",
  },
  {
    id: 2,
    name: "Two-Story House",
    difficulty: "Medium",
    image: { type: "house", walls: 4, roof: "hip", foundation: "deep", material: "brick", windows: 6, door: 2 },
    requirements: [
      { category: "Foundation", correct: "Deep Foundation", options: ["Surface Slab", "Deep Foundation", "Floating Raft", "No Foundation"] },
      { category: "Wall Material", correct: "Brick", options: ["Wood Panels", "Brick", "Mud Blocks", "Cardboard"] },
      { category: "Roof Type", correct: "Hip Roof", options: ["Hip Roof", "Flat Roof", "A-Frame", "Butterfly Roof"] },
      { category: "Floors", correct: "2 Floors", options: ["1 Floor", "2 Floors", "3 Floors", "Basement Only"] },
      { category: "Windows", correct: "6 Windows", options: ["2 Windows", "4 Windows", "6 Windows", "8 Windows"] },
    ],
    funFact: "A two-story house needs a deep foundation because it's heavier. Engineers calculate the exact depth based on soil type and building weight!",
  },
  {
    id: 3,
    name: "Pedestrian Bridge",
    difficulty: "Medium",
    image: { type: "bridge", span: "short", material: "steel", supports: "arch", railing: true },
    requirements: [
      { category: "Span Type", correct: "Short Span (20m)", options: ["Short Span (20m)", "Medium Span (50m)", "Long Span (100m)", "Ultra Long (200m)"] },
      { category: "Main Material", correct: "Steel", options: ["Wood", "Rope", "Steel", "Bamboo"] },
      { category: "Support Structure", correct: "Arch Support", options: ["Beam Support", "Arch Support", "Suspension Cables", "Cantilever"] },
      { category: "Safety Feature", correct: "Metal Railings", options: ["No Railings", "Rope Sides", "Metal Railings", "Glass Walls"] },
    ],
    funFact: "Arch bridges are one of the oldest designs — the Romans built stone arch bridges over 2,000 years ago that still stand today!",
  },
  {
    id: 4,
    name: "Water Tower",
    difficulty: "Hard",
    image: { type: "tower", height: "tall", material: "steel", shape: "cylinder", capacity: "large" },
    requirements: [
      { category: "Structure Height", correct: "25 Meters", options: ["10 Meters", "25 Meters", "50 Meters", "100 Meters"] },
      { category: "Tank Material", correct: "Welded Steel", options: ["Plastic", "Welded Steel", "Concrete", "Wood Barrel"] },
      { category: "Tank Shape", correct: "Cylinder", options: ["Cube", "Sphere", "Cylinder", "Cone"] },
      { category: "Support Legs", correct: "4 Steel Legs", options: ["1 Central Pole", "3 Wood Legs", "4 Steel Legs", "Brick Tower"] },
      { category: "Capacity", correct: "500,000 Liters", options: ["10,000 L", "100,000 L", "500,000 L", "1,000,000 L"] },
    ],
    funFact: "Water towers use gravity to create water pressure. The higher the tower, the stronger the water flows through pipes to your home!",
  },
  {
    id: 5,
    name: "Skyscraper Core",
    difficulty: "Hard",
    image: { type: "skyscraper", floors: 40, material: "steel-concrete", core: "central", foundation: "pile" },
    requirements: [
      { category: "Foundation Type", correct: "Pile Foundation", options: ["Surface Slab", "Raft Foundation", "Pile Foundation", "Strip Foundation"] },
      { category: "Structural System", correct: "Steel + Concrete Core", options: ["All Wood", "All Brick", "Steel + Concrete Core", "Pure Glass"] },
      { category: "Core Position", correct: "Central Core", options: ["No Core", "Side Core", "Central Core", "External Frame"] },
      { category: "Floor Count", correct: "40 Floors", options: ["10 Floors", "25 Floors", "40 Floors", "80 Floors"] },
      { category: "Wind Resistance", correct: "Tuned Mass Damper", options: ["Nothing", "Heavy Base", "Tuned Mass Damper", "Guy Wires"] },
      { category: "Elevator Shafts", correct: "8 Elevators", options: ["2 Elevators", "4 Elevators", "8 Elevators", "Stairs Only"] },
    ],
    funFact: "The world's tallest buildings sway in the wind! Engineers add massive pendulums called 'tuned mass dampers' to counteract the movement.",
  },
];

// Simple blueprint drawing
function BlueprintDrawing({ blueprint }) {
  const bp = blueprint.image;
  return (
    <svg viewBox="0 0 300 220" style={{ width: "100%", background: "#1A237E", borderRadius: 12 }}>
      {/* Grid lines */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#283593" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="300" height="220" fill="url(#grid)" />

      {bp.type === "shed" && (
        <g stroke="#64B5F6" fill="none" strokeWidth="1.5">
          <rect x="80" y="120" width="140" height="80" strokeDasharray="4 2" />
          <polygon points="80,120 150,70 220,120" strokeDasharray="4 2" />
          <rect x="100" y="150" width="25" height="30" fill="#64B5F6" opacity="0.15" />
          <rect x="170" y="140" width="30" height="25" fill="#64B5F6" opacity="0.15" />
          <line x1="80" y1="200" x2="80" y2="210" />
          <line x1="220" y1="200" x2="220" y2="210" />
          <line x1="80" y1="208" x2="220" y2="208" />
          <text x="150" y="218" fill="#90CAF9" fontSize="8" textAnchor="middle" fontFamily="monospace">14.0 m</text>
          <text x="60" y="160" fill="#90CAF9" fontSize="8" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,60,160)">8.0 m</text>
          {/* Labels */}
          <text x="150" y="45" fill="#FDD835" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GARDEN SHED — PLAN VIEW</text>
          <text x="112" y="172" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">DOOR</text>
          <text x="185" y="158" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">WIN</text>
          <text x="150" y="96" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">GABLE ROOF</text>
          <text x="150" y="195" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">CONC. FOUNDATION</text>
        </g>
      )}

      {bp.type === "house" && (
        <g stroke="#64B5F6" fill="none" strokeWidth="1.5">
          <rect x="60" y="80" width="180" height="55" strokeDasharray="4 2" />
          <rect x="60" y="135" width="180" height="55" strokeDasharray="4 2" />
          <path d="M55 80 L150 40 L245 80" strokeDasharray="4 2" />
          {[75, 115, 165, 205].map((x) => <rect key={x} x={x} y="90" width="18" height="15" fill="#64B5F6" opacity="0.15" />)}
          {[115, 205].map((x) => <rect key={x} x={x} y="145" width="18" height="15" fill="#64B5F6" opacity="0.15" />)}
          <rect x="140" y="155" width="22" height="35" fill="#64B5F6" opacity="0.15" />
          <text x="150" y="25" fill="#FDD835" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">2-STORY HOUSE — ELEVATION</text>
          <text x="45" y="115" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,45,115)">FL 2</text>
          <text x="45" y="165" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,45,165)">FL 1</text>
          <text x="150" y="200" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">DEEP FOUNDATION — BRICK WALLS</text>
          <text x="150" y="60" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">HIP ROOF</text>
        </g>
      )}

      {bp.type === "bridge" && (
        <g stroke="#64B5F6" fill="none" strokeWidth="1.5">
          <rect x="30" y="120" width="50" height="70" fill="#283593" stroke="#64B5F6" strokeDasharray="4 2" />
          <rect x="220" y="120" width="50" height="70" fill="#283593" stroke="#64B5F6" strokeDasharray="4 2" />
          <line x1="80" y1="125" x2="220" y2="125" strokeWidth="2" />
          <path d="M80 125 Q150 80 220 125" strokeDasharray="4 2" />
          <line x1="80" y1="115" x2="220" y2="115" strokeDasharray="2 3" />
          <text x="150" y="25" fill="#FDD835" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">PEDESTRIAN BRIDGE — SIDE VIEW</text>
          <text x="150" y="145" fill="#90CAF9" fontSize="8" textAnchor="middle" fontFamily="monospace">20.0 m SPAN</text>
          <text x="150" y="100" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">ARCH SUPPORT</text>
          <text x="150" y="110" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">STEEL + RAILINGS</text>
        </g>
      )}

      {bp.type === "tower" && (
        <g stroke="#64B5F6" fill="none" strokeWidth="1.5">
          <ellipse cx="150" cy="80" rx="40" ry="30" strokeDasharray="4 2" />
          <line x1="110" y1="80" x2="90" y2="190" strokeDasharray="4 2" />
          <line x1="190" y1="80" x2="210" y2="190" strokeDasharray="4 2" />
          <line x1="120" y1="80" x2="108" y2="190" strokeDasharray="4 2" />
          <line x1="180" y1="80" x2="192" y2="190" strokeDasharray="4 2" />
          <line x1="90" y1="190" x2="210" y2="190" />
          <text x="150" y="25" fill="#FDD835" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">WATER TOWER — ELEVATION</text>
          <text x="150" y="82" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">CYLINDER TANK</text>
          <text x="150" y="140" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">4 STEEL LEGS</text>
          <text x="260" y="140" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,260,140)">25 m</text>
          <text x="150" y="205" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace">500,000 L CAPACITY</text>
        </g>
      )}

      {bp.type === "skyscraper" && (
        <g stroke="#64B5F6" fill="none" strokeWidth="1.5">
          <rect x="110" y="30" width="80" height="165" strokeDasharray="4 2" />
          <rect x="140" y="35" width="20" height="155" fill="#64B5F6" opacity="0.1" />
          {[50, 70, 90, 110, 130, 150, 170].map((y) => <line key={y} x1="112" y1={y} x2="188" y2={y} stroke="#3949AB" strokeWidth="0.5" />)}
          <rect x="95" y="195" width="110" height="15" strokeDasharray="4 2" />
          <line x1="95" y1="210" x2="85" y2="215" stroke="#64B5F6" strokeWidth="1" />
          <line x1="205" y1="210" x2="215" y2="215" stroke="#64B5F6" strokeWidth="1" />
          <text x="150" y="18" fill="#FDD835" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">SKYSCRAPER — SECTION</text>
          <text x="150" y="108" fill="#90CAF9" fontSize="6" textAnchor="middle" fontFamily="monospace">CENTRAL CORE</text>
          <text x="150" y="203" fill="#90CAF9" fontSize="6" textAnchor="middle" fontFamily="monospace">PILE FOUNDATION</text>
          <text x="80" y="115" fill="#90CAF9" fontSize="7" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,80,115)">40 FLOORS</text>
          <text x="235" y="115" fill="#90CAF9" fontSize="6" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,235,115)">TMD + 8 ELEV</text>
        </g>
      )}

      {/* Compass */}
      <g transform="translate(265, 200)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="#5C6BC0" strokeWidth="0.8" />
        <text x="0" y="-4" fill="#FDD835" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">N</text>
        <line x1="0" y1="-2" x2="0" y2="6" stroke="#5C6BC0" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export default function BlueprintReader() {
  const [phase, setPhase] = useState("intro");
  const [bpIdx, setBpIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const bp = BLUEPRINTS[bpIdx];

  const selectAnswer = (category, answer) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [category]: answer }));
  };

  const submitAnswers = () => {
    let correct = 0;
    bp.requirements.forEach((req) => {
      if (answers[req.category] === req.correct) correct++;
    });
    const pct = Math.round((correct / bp.requirements.length) * 100);
    setScore((s) => s + correct * 20 + (pct === 100 ? 30 : 0));
    setResults((prev) => [...prev, { name: bp.name, correct, total: bp.requirements.length, perfect: pct === 100 }]);
    setSubmitted(true);
  };

  const nextBlueprint = () => {
    if (bpIdx >= BLUEPRINTS.length - 1) {
      setPhase("summary");
    } else {
      setBpIdx((i) => i + 1);
      setAnswers({});
      setSubmitted(false);
    }
  };

  const restart = () => {
    setPhase("intro");
    setBpIdx(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setResults([]);
  };

  const allAnswered = bp ? bp.requirements.every((r) => answers[r.category]) : false;

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.introWrap}>
          <div style={st.introCard}>
            <div style={st.badge}>CONSTRUCTION ENGINEER</div>
            <h1 style={st.title}>📐 Blueprint Reader</h1>
            <p style={st.sub}>Read construction blueprints and pick the right specifications. Real engineers do this every day!</p>
            <div style={st.rules}>
              <div style={st.rule}><span>📘</span><span>Read the blueprint carefully</span></div>
              <div style={st.rule}><span>✅</span><span>Select the correct specs for each category</span></div>
              <div style={st.rule}><span>🏗️</span><span>5 blueprints from easy to hard</span></div>
              <div style={st.rule}><span>🎯</span><span>Perfect matches earn bonus points</span></div>
            </div>
            <button style={st.startBtn} onClick={() => setPhase("play")}>Start Reading →</button>
          </div>
        </div>
      )}

      {phase === "play" && (
        <div style={st.gameWrap}>
          <div style={st.topBar}>
            <div style={st.topInfo}>
              <span style={st.bpNum}>Blueprint {bpIdx + 1}/5</span>
              <span style={{ ...st.diffBadge, color: bp.difficulty === "Easy" ? "#27AE60" : bp.difficulty === "Medium" ? "#F39C12" : "#E74C3C" }}>{bp.difficulty}</span>
            </div>
            <div style={st.scoreChip}>⭐ {score}</div>
          </div>

          <h2 style={st.bpName}>{bp.name}</h2>

          <div style={st.bpDraw}>
            <BlueprintDrawing blueprint={bp} />
          </div>

          <div style={st.reqList}>
            {bp.requirements.map((req) => {
              const answered = answers[req.category];
              const isCorrect = submitted && answered === req.correct;
              const isWrong = submitted && answered && answered !== req.correct;

              return (
                <div key={req.category} style={st.reqItem}>
                  <div style={st.reqLabel}>
                    {req.category}
                    {submitted && (isCorrect ? <span style={st.checkMark}> ✅</span> : isWrong ? <span style={st.checkMark}> ❌</span> : null)}
                  </div>
                  <div style={st.optGrid}>
                    {req.options.map((opt) => {
                      const selected = answered === opt;
                      const showCorrect = submitted && opt === req.correct;
                      return (
                        <button
                          key={opt}
                          onClick={() => selectAnswer(req.category, opt)}
                          style={{
                            ...st.optBtn,
                            borderColor: showCorrect ? "#27AE60" : selected ? (submitted && isWrong ? "#EF4444" : "#1565C0") : "#E5E7EB",
                            background: showCorrect ? "#F0FFF4" : selected ? (submitted && isWrong ? "#FFF1F2" : "#E3F2FD") : "white",
                            fontWeight: selected || showCorrect ? 800 : 600,
                          }}
                          disabled={submitted}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <button style={{ ...st.submitBtn, opacity: allAnswered ? 1 : 0.4 }} onClick={submitAnswers} disabled={!allAnswered}>
              Submit Answers
            </button>
          )}

          {submitted && (
            <div style={st.feedbackCard}>
              <div style={st.feedbackTop}>
                <span style={{ fontSize: 28 }}>{results[results.length - 1]?.perfect ? "🎉" : "👍"}</span>
                <div>
                  <div style={st.feedbackTitle}>
                    {results[results.length - 1]?.correct}/{results[results.length - 1]?.total} Correct
                    {results[results.length - 1]?.perfect && " — Perfect!"}
                  </div>
                </div>
              </div>
              <div style={st.funFact}>💡 <strong>Did you know?</strong> {bp.funFact}</div>
              <button style={st.nextBtn} onClick={nextBlueprint}>
                {bpIdx >= BLUEPRINTS.length - 1 ? "See Final Results" : "Next Blueprint →"}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div style={st.introWrap}>
          <div style={st.introCard}>
            <div style={st.badge}>COMPLETE</div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {"⭐".repeat(results.filter((r) => r.perfect).length >= 4 ? 3 : results.filter((r) => r.perfect).length >= 2 ? 2 : 1)}
            </div>
            <h2 style={st.title}>{score >= 400 ? "Expert Reader! 🏆" : score >= 250 ? "Sharp Eyes! 👏" : "Keep Studying! 📖"}</h2>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#1565C0", margin: "12px 0" }}>{score}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>POINTS EARNED</div>
            {results.map((r, i) => (
              <div key={i} style={st.summRow}>
                <span>{r.perfect ? "🌟" : r.correct > 0 ? "✅" : "❌"}</span>
                <span style={{ flex: 1, fontWeight: 700, color: "#374151" }}>{r.name}</span>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>{r.correct}/{r.total}</span>
              </div>
            ))}
            <div style={{ ...st.funFact, margin: "20px 0" }}>
              <strong>🎓 Career Insight:</strong> Blueprint reading is one of the first skills construction engineers learn. On a real site, everyone — from architects to electricians — needs to read these plans correctly!
            </div>
            <button style={st.startBtn} onClick={restart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #E8EAF6 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  introWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  introCard: { background: "white", borderRadius: 24, padding: "40px 36px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(21,101,192,0.08)", border: "2px solid #E8EAF6", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#E8EAF6", color: "#1565C0", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  rules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 },
  rule: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F8F9FF", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  startBtn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1565C0, #0D47A1)", color: "white", fontSize: 17, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(21,101,192,0.25)" },

  gameWrap: { maxWidth: 680, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  topInfo: { display: "flex", alignItems: "center", gap: 10 },
  bpNum: { fontSize: 14, fontWeight: 800, color: "#374151" },
  diffBadge: { fontSize: 12, fontWeight: 800, padding: "3px 10px", background: "#F9FAFB", borderRadius: 100 },
  scoreChip: { background: "#FFF9E6", border: "1.5px solid #F7DC6F", padding: "6px 14px", borderRadius: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#F39C12" },

  bpName: { fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 },
  bpDraw: { marginBottom: 20, borderRadius: 16, overflow: "hidden", border: "2px solid #283593", boxShadow: "0 4px 16px rgba(26,35,126,0.15)" },

  reqList: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 },
  reqItem: { background: "white", borderRadius: 16, padding: "16px 18px", border: "1.5px solid #F3F4F6" },
  reqLabel: { fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 10 },
  checkMark: { marginLeft: 6 },
  optGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 },
  optBtn: { padding: "10px 12px", borderRadius: 10, border: "2px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s", background: "white" },

  submitBtn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1565C0, #0D47A1)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s", marginBottom: 12 },

  feedbackCard: { background: "white", borderRadius: 18, padding: "20px", border: "1.5px solid #C8E6C9", animation: "fadeInUp 0.4s ease-out" },
  feedbackTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  feedbackTitle: { fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#27AE60" },
  funFact: { padding: "12px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, marginBottom: 14 },
  nextBtn: { width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "#1565C0", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer" },

  summRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: 12, marginBottom: 6, fontSize: 14 },
};
