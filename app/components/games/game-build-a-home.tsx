"use client";

import { useState } from "react";

const STAGES = [
  {
    id: "foundation",
    name: "Foundation",
    icon: "🧱",
    question: "What foundation should we lay?",
    tip: "The foundation holds the entire house. Soil type and house size determine the best choice.",
    options: [
      { id: "slab", name: "Concrete Slab", cost: 3000, quality: 3, icon: "⬜", desc: "Most common — poured flat on the ground" },
      { id: "crawl", name: "Crawl Space", cost: 4500, quality: 4, icon: "🏗️", desc: "Raised with access underneath for pipes" },
      { id: "basement", name: "Full Basement", cost: 8000, quality: 5, icon: "🔲", desc: "Expensive but adds usable space below" },
    ],
  },
  {
    id: "framing",
    name: "Wall Framing",
    icon: "🪵",
    question: "What material for the walls?",
    tip: "Wall material affects strength, insulation, and cost. Most homes use wood framing.",
    options: [
      { id: "wood", name: "Wood Frame", cost: 5000, quality: 3, icon: "🪵", desc: "Fast to build, good insulation" },
      { id: "brick", name: "Brick Walls", cost: 8000, quality: 4, icon: "🧱", desc: "Strong and fire-resistant" },
      { id: "concrete", name: "Concrete Block", cost: 7000, quality: 5, icon: "🔳", desc: "Very strong, great for storms" },
    ],
  },
  {
    id: "roof",
    name: "Roof",
    icon: "🏠",
    question: "Choose your roof style and material.",
    tip: "The roof protects from weather. Steeper roofs shed rain better, flat roofs are cheaper.",
    options: [
      { id: "shingle", name: "Asphalt Shingles", cost: 3000, quality: 3, icon: "🔺", desc: "Most popular — affordable and easy to replace" },
      { id: "metal", name: "Metal Roof", cost: 5500, quality: 4, icon: "⚙️", desc: "Lasts 50+ years, very durable" },
      { id: "tile", name: "Clay Tiles", cost: 7000, quality: 5, icon: "🟫", desc: "Beautiful and lasts 100+ years" },
    ],
  },
  {
    id: "windows",
    name: "Windows & Doors",
    icon: "🪟",
    question: "What type of windows?",
    tip: "Windows affect energy efficiency. Double-pane windows keep heat in during winter and out during summer.",
    options: [
      { id: "single", name: "Single Pane", cost: 1500, quality: 2, icon: "🔲", desc: "Cheapest but poor insulation" },
      { id: "double", name: "Double Pane", cost: 3000, quality: 4, icon: "🪟", desc: "Good balance of cost and efficiency" },
      { id: "triple", name: "Triple Pane", cost: 5000, quality: 5, icon: "✨", desc: "Best insulation, saves on heating bills" },
    ],
  },
  {
    id: "interior",
    name: "Interior Finish",
    icon: "🎨",
    question: "Choose interior finishing level.",
    tip: "Interior finishes include flooring, paint, cabinets, and fixtures. This is what makes a house feel like a home!",
    options: [
      { id: "basic", name: "Basic Finish", cost: 4000, quality: 2, icon: "🏷️", desc: "Simple and functional" },
      { id: "standard", name: "Standard Finish", cost: 7000, quality: 4, icon: "🏡", desc: "Nice hardwood floors and modern fixtures" },
      { id: "premium", name: "Premium Finish", cost: 12000, quality: 5, icon: "💎", desc: "Marble counters, custom cabinets" },
    ],
  },
  {
    id: "exterior",
    name: "Exterior & Landscaping",
    icon: "🌳",
    question: "Final touches — exterior finish?",
    tip: "Curb appeal matters! The exterior is the first thing people see. Good landscaping can increase a home's value by 10-15%.",
    options: [
      { id: "minimal", name: "Basic Exterior", cost: 2000, quality: 2, icon: "🏚️", desc: "Simple siding, gravel driveway" },
      { id: "nice", name: "Nice Exterior", cost: 5000, quality: 4, icon: "🏘️", desc: "Painted siding, paved driveway, garden" },
      { id: "luxury", name: "Luxury Exterior", cost: 9000, quality: 5, icon: "🏰", desc: "Stone facade, pool, landscaped garden" },
    ],
  },
];

const BUDGET = 40000;

const FACTS = [
  "A typical home takes 7-12 months to build from start to finish.",
  "The foundation must cure for at least 7 days before walls go up.",
  "About 13,000 board feet of lumber go into an average new home.",
  "Roofing is the most dangerous construction job — safety harnesses are required!",
  "Energy-efficient windows can save homeowners up to $500/year on heating.",
  "Interior finishing is usually 30-40% of the total construction cost.",
];

function HouseVisual({ choices, currentStage }) {
  const stageIdx = STAGES.findIndex((s) => s.id === currentStage);
  const hasFoundation = choices.foundation;
  const hasWalls = choices.framing;
  const hasRoof = choices.roof;
  const hasWindows = choices.windows;
  const hasInterior = choices.interior;
  const hasExterior = choices.exterior;

  const wallColor = choices.framing === "brick" ? "#C0392B" : choices.framing === "concrete" ? "#95A5A6" : "#DEB887";
  const roofColor = choices.roof === "metal" ? "#78909C" : choices.roof === "tile" ? "#BF360C" : "#5D4037";
  const extColor = choices.exterior === "luxury" ? "#8D6E63" : choices.exterior === "nice" ? "#FFCC80" : "#D7CCC8";

  return (
    <svg viewBox="0 0 400 250" style={{ width: "100%", borderRadius: 14, background: "linear-gradient(180deg, #87CEEB 0%, #B3E5FC 70%, #A5D6A7 90%, #66BB6A 100%)" }}>
      {/* Sun */}
      <circle cx="350" cy="40" r="24" fill="#FFF9C4" />
      <circle cx="350" cy="40" r="18" fill="#FFEE58" />
      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="80" cy="35" rx="30" ry="12" fill="white" />
        <ellipse cx="105" cy="30" rx="22" ry="10" fill="white" />
        <ellipse cx="260" cy="45" rx="25" ry="10" fill="white" />
      </g>

      {/* Ground */}
      <rect x="0" y="200" width="400" height="50" fill="#4CAF50" />

      {/* Foundation */}
      {hasFoundation && (
        <g style={{ animation: "fadeInUp 0.5s ease-out" }}>
          <rect x="100" y="185" width="200" height="18" fill="#9E9E9E" rx="3" />
          <rect x="98" y="197" width="204" height="6" fill="#757575" rx="2" />
          {choices.foundation === "basement" && <rect x="102" y="188" width="196" height="12" fill="#616161" rx="2" />}
          {choices.foundation === "crawl" && (
            <>
              <rect x="120" y="192" width="8" height="12" fill="#757575" />
              <rect x="200" y="192" width="8" height="12" fill="#757575" />
              <rect x="280" y="192" width="8" height="12" fill="#757575" />
            </>
          )}
        </g>
      )}

      {/* Walls */}
      {hasWalls && (
        <g style={{ animation: "fadeInUp 0.5s ease-out" }}>
          <rect x="110" y="105" width="180" height="82" fill={hasExterior ? extColor : wallColor} rx="2" />
          {choices.framing === "brick" && !hasExterior && (
            <g opacity="0.3">
              {[0, 1, 2, 3, 4, 5, 6].map((row) =>
                [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                  <rect key={`${row}-${col}`} x={112 + col * 20 + (row % 2) * 10} y={107 + row * 11} width="18" height="9" rx="1" stroke={wallColor} strokeWidth="0.5" fill="none" />
                ))
              )}
            </g>
          )}
          {/* Door */}
          <rect x="180" y="148" width="26" height="38" fill="#5D4037" rx="3" />
          <circle cx="201" cy="168" r="2" fill="#FDD835" />
        </g>
      )}

      {/* Roof */}
      {hasRoof && (
        <g style={{ animation: "fadeInUp 0.5s ease-out" }}>
          <polygon points="100,108 200,55 300,108" fill={roofColor} />
          <polygon points="100,108 200,55 200,108" fill="white" opacity="0.08" />
          {choices.roof === "tile" && (
            <g opacity="0.3">
              {[0, 1, 2, 3].map((row) => (
                <line key={row} x1={115 + row * 8} y1={102 - row * 10} x2={285 - row * 8} y2={102 - row * 10} stroke="white" strokeWidth="1" />
              ))}
            </g>
          )}
        </g>
      )}

      {/* Windows */}
      {hasWindows && hasWalls && (
        <g style={{ animation: "fadeInUp 0.4s ease-out" }}>
          <rect x="125" y="120" width="28" height="24" fill="#B3E5FC" rx="2" stroke="white" strokeWidth="2" />
          <line x1="139" y1="120" x2="139" y2="144" stroke="white" strokeWidth="1.5" />
          <line x1="125" y1="132" x2="153" y2="132" stroke="white" strokeWidth="1.5" />

          <rect x="245" y="120" width="28" height="24" fill="#B3E5FC" rx="2" stroke="white" strokeWidth="2" />
          <line x1="259" y1="120" x2="259" y2="144" stroke="white" strokeWidth="1.5" />
          <line x1="245" y1="132" x2="273" y2="132" stroke="white" strokeWidth="1.5" />

          {choices.windows === "triple" && (
            <>
              <rect x="123" y="118" width="32" height="28" fill="none" stroke="#42A5F5" strokeWidth="1" rx="3" />
              <rect x="243" y="118" width="32" height="28" fill="none" stroke="#42A5F5" strokeWidth="1" rx="3" />
            </>
          )}
        </g>
      )}

      {/* Interior glow */}
      {hasInterior && hasWindows && (
        <g>
          <rect x="126" y="121" width="26" height="22" fill="#FFF9C4" opacity="0.4" rx="1" />
          <rect x="246" y="121" width="26" height="22" fill="#FFF9C4" opacity="0.4" rx="1" />
        </g>
      )}

      {/* Exterior additions */}
      {hasExterior && (
        <g style={{ animation: "fadeInUp 0.4s ease-out" }}>
          {/* Path */}
          <rect x="185" y="200" width="18" height="20" fill="#BDBDBD" rx="2" />
          {choices.exterior !== "minimal" && (
            <>
              {/* Bushes */}
              <circle cx="120" cy="195" r="10" fill="#388E3C" />
              <circle cx="132" cy="192" r="8" fill="#43A047" />
              <circle cx="280" cy="195" r="10" fill="#388E3C" />
              <circle cx="268" cy="192" r="8" fill="#43A047" />
            </>
          )}
          {choices.exterior === "luxury" && (
            <>
              {/* Fence */}
              <rect x="70" y="190" width="25" height="14" fill="white" rx="1" />
              <rect x="305" y="190" width="25" height="14" fill="white" rx="1" />
              {/* Chimney */}
              <rect x="240" y="60" width="16" height="30" fill="#795548" />
            </>
          )}
        </g>
      )}

      {/* Empty state */}
      {!hasFoundation && (
        <g>
          <text x="200" y="160" textAnchor="middle" fill="#5D4037" fontSize="14" fontFamily="Fredoka, sans-serif" fontWeight="600" opacity="0.4">
            Start building your home!
          </text>
          {/* Dirt patch */}
          <rect x="100" y="192" width="200" height="12" fill="#A1887F" rx="4" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}

export default function BuildAHome() {
  const [phase, setPhase] = useState("intro");
  const [stageIdx, setStageIdx] = useState(0);
  const [choices, setChoices] = useState({});
  const [budget, setBudget] = useState(BUDGET);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalQuality, setTotalQuality] = useState(0);
  const [showFact, setShowFact] = useState(false);

  const stage = STAGES[stageIdx];
  const isComplete = stageIdx >= STAGES.length;

  const selectOption = (opt) => {
    if (budget < opt.cost) return;
    setChoices((prev) => ({ ...prev, [stage.id]: opt.id }));
    setBudget((b) => b - opt.cost);
    setTotalSpent((s) => s + opt.cost);
    setTotalQuality((q) => q + opt.quality);
    setShowFact(true);
  };

  const nextStage = () => {
    setShowFact(false);
    if (stageIdx >= STAGES.length - 1) {
      setPhase("summary");
    } else {
      setStageIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setPhase("intro");
    setStageIdx(0);
    setChoices({});
    setBudget(BUDGET);
    setTotalSpent(0);
    setTotalQuality(0);
    setShowFact(false);
  };

  const qualityPct = Math.round((totalQuality / (STAGES.length * 5)) * 100);
  const stars = qualityPct >= 80 && budget >= 0 ? 3 : qualityPct >= 55 ? 2 : 1;
  const budgetPct = Math.round((budget / BUDGET) * 100);

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>CONSTRUCTION ENGINEER</div>
            <h1 style={st.title}>🏠 Build a Home</h1>
            <p style={st.sub}>Build a house step by step — from foundation to landscaping. Stay on budget and make smart choices!</p>
            <div style={st.rules}>
              <div style={st.rule}><span>💰</span><span>Budget: <strong>${BUDGET.toLocaleString()}</strong></span></div>
              <div style={st.rule}><span>🔨</span><span>6 construction stages</span></div>
              <div style={st.rule}><span>⭐</span><span>Balance cost vs. quality for the best rating</span></div>
            </div>
            <button style={st.btn} onClick={() => setPhase("build")}>Start Building →</button>
          </div>
        </div>
      )}

      {phase === "build" && (
        <div style={st.gameWrap}>
          {/* Progress bar */}
          <div style={st.progressBar}>
            {STAGES.map((s, i) => (
              <div key={s.id} style={{ ...st.progressStep, opacity: i <= stageIdx ? 1 : 0.3 }}>
                <div style={{ ...st.progressDot, background: i < stageIdx ? "#27AE60" : i === stageIdx ? "#E65100" : "#D1D5DB" }}>
                  {i < stageIdx ? "✓" : s.icon}
                </div>
                <span style={st.progressLabel}>{s.name}</span>
              </div>
            ))}
          </div>

          {/* House visualization */}
          <div style={st.vizWrap}>
            <HouseVisual choices={choices} currentStage={stage.id} />
          </div>

          {/* Budget bar */}
          <div style={st.budgetRow}>
            <div style={st.budgetInfo}>
              <span style={st.budgetLabel}>Budget Remaining</span>
              <span style={{ ...st.budgetValue, color: budget > 10000 ? "#27AE60" : budget > 3000 ? "#F39C12" : "#E74C3C" }}>
                ${budget.toLocaleString()}
              </span>
            </div>
            <div style={st.budgetBarOuter}>
              <div style={{ ...st.budgetBarInner, width: `${budgetPct}%`, background: budget > 10000 ? "#27AE60" : budget > 3000 ? "#F39C12" : "#E74C3C" }} />
            </div>
          </div>

          {!showFact ? (
            <>
              {/* Stage question */}
              <div style={st.stageHeader}>
                <span style={{ fontSize: 28 }}>{stage.icon}</span>
                <div>
                  <h2 style={st.stageName}>Stage {stageIdx + 1}: {stage.name}</h2>
                  <p style={st.stageQ}>{stage.question}</p>
                </div>
              </div>

              <div style={st.tipBox}>💡 {stage.tip}</div>

              {/* Options */}
              <div style={st.optionsList}>
                {stage.options.map((opt) => {
                  const tooExpensive = budget < opt.cost;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectOption(opt)}
                      disabled={tooExpensive}
                      style={{ ...st.optCard, opacity: tooExpensive ? 0.45 : 1 }}
                    >
                      <div style={st.optTop}>
                        <span style={{ fontSize: 24 }}>{opt.icon}</span>
                        <div style={st.optInfo}>
                          <div style={st.optName}>{opt.name}</div>
                          <div style={st.optDesc}>{opt.desc}</div>
                        </div>
                      </div>
                      <div style={st.optBottom}>
                        <span style={st.optCost}>${opt.cost.toLocaleString()}</span>
                        <span style={st.optQuality}>{"★".repeat(opt.quality)}{"☆".repeat(5 - opt.quality)}</span>
                        {tooExpensive && <span style={st.cantAfford}>Can't afford</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={st.factCard}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <div style={st.factTitle}>
                {stage.name} complete!
              </div>
              <div style={st.factText}>🏗️ {FACTS[stageIdx]}</div>
              <button style={st.btn} onClick={nextStage}>
                {stageIdx >= STAGES.length - 1 ? "See Your Home →" : `Next: ${STAGES[stageIdx + 1]?.name} →`}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={{ ...st.card, maxWidth: 520 }}>
            <div style={st.badge}>HOME COMPLETE</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>
              {stars === 3 ? "Dream Home! 🏆" : stars === 2 ? "Solid Build! 👏" : "Starter Home! 🔧"}
            </h2>

            <div style={st.vizWrap}>
              <HouseVisual choices={choices} currentStage="done" />
            </div>

            <div style={st.summaryStats}>
              <div style={st.summStat}>
                <div style={st.summStatNum}>${totalSpent.toLocaleString()}</div>
                <div style={st.summStatLabel}>Total Cost</div>
              </div>
              <div style={{ width: 1, height: 40, background: "#E5E7EB" }} />
              <div style={st.summStat}>
                <div style={st.summStatNum}>${budget.toLocaleString()}</div>
                <div style={st.summStatLabel}>Under Budget</div>
              </div>
              <div style={{ width: 1, height: 40, background: "#E5E7EB" }} />
              <div style={st.summStat}>
                <div style={st.summStatNum}>{qualityPct}%</div>
                <div style={st.summStatLabel}>Quality</div>
              </div>
            </div>

            <div style={st.choiceList}>
              {STAGES.map((s) => {
                const opt = s.options.find((o) => o.id === choices[s.id]);
                return opt ? (
                  <div key={s.id} style={st.choiceRow}>
                    <span>{s.icon}</span>
                    <span style={{ flex: 1, fontWeight: 700, color: "#374151" }}>{s.name}</span>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{opt.name}</span>
                  </div>
                ) : null;
              })}
            </div>

            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> Real construction project managers juggle budget, quality, and timeline every day. The best ones find creative ways to get high quality within budget — just like you did!
            </div>

            <button style={st.btn} onClick={restart}>Build Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #FFF3E0 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(230,81,0,0.08)", border: "2px solid #FFF3E0", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#FFF3E0", color: "#E65100", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  rules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 },
  rule: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#FFFBF5", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #E65100, #BF360C)", color: "white", fontSize: 17, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(230,81,0,0.25)" },

  gameWrap: { maxWidth: 640, margin: "0 auto", padding: "16px 16px 40px" },
  progressBar: { display: "flex", justifyContent: "space-between", marginBottom: 16, padding: "0 4px" },
  progressStep: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "opacity 0.3s" },
  progressDot: { width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "white", fontWeight: 700, fontFamily: "'Fredoka', sans-serif" },
  progressLabel: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 },

  vizWrap: { marginBottom: 14, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" },

  budgetRow: { background: "white", borderRadius: 14, padding: "14px 18px", border: "1.5px solid #F3F4F6", marginBottom: 14 },
  budgetInfo: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  budgetLabel: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
  budgetValue: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700 },
  budgetBarOuter: { height: 6, borderRadius: 3, background: "#F3F4F6" },
  budgetBarInner: { height: "100%", borderRadius: 3, transition: "width 0.5s, background 0.3s" },

  stageHeader: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12 },
  stageName: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E" },
  stageQ: { fontSize: 14, fontWeight: 600, color: "#9CA3AF" },
  tipBox: { padding: "10px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.5, marginBottom: 14 },

  optionsList: { display: "flex", flexDirection: "column", gap: 10 },
  optCard: { display: "block", width: "100%", textAlign: "left", padding: "16px 18px", borderRadius: 16, border: "2px solid #E5E7EB", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s" },
  optTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  optInfo: {},
  optName: { fontFamily: "'Fredoka', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1A2E" },
  optDesc: { fontSize: 12, fontWeight: 600, color: "#9CA3AF" },
  optBottom: { display: "flex", alignItems: "center", gap: 12 },
  optCost: { fontFamily: "'Fredoka', sans-serif", fontSize: 16, fontWeight: 700, color: "#E65100" },
  optQuality: { fontSize: 13, color: "#F39C12", letterSpacing: 1 },
  cantAfford: { fontSize: 11, fontWeight: 800, color: "#EF4444", marginLeft: "auto" },

  factCard: { background: "white", borderRadius: 18, padding: "28px 24px", border: "1.5px solid #C8E6C9", textAlign: "center", animation: "fadeInUp 0.4s ease-out" },
  factTitle: { fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#27AE60", marginBottom: 14 },
  factText: { padding: "12px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, marginBottom: 20 },

  summaryStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 20, padding: "14px 0" },
  summStat: { textAlign: "center" },
  summStatNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E" },
  summStatLabel: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" },

  choiceList: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 },
  choiceRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, fontSize: 14 },

  insight: { padding: "14px 16px", background: "#FFF3E0", border: "1.5px solid #FFE0B2", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#E65100", lineHeight: 1.6, textAlign: "left", marginBottom: 20 },
};
