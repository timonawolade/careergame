"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const MATERIALS = [
  { id: "wood", name: "Wood", icon: "🪵", strength: 2, cost: 500, color: "#A0724A", desc: "Cheap but weak" },
  { id: "stone", name: "Stone", icon: "🪨", strength: 4, cost: 900, color: "#8B8680", desc: "Moderate strength" },
  { id: "concrete", name: "Concrete", icon: "🧱", strength: 6, cost: 1400, color: "#9E9E9E", desc: "Strong & reliable" },
  { id: "steel", name: "Steel", icon: "⚙️", strength: 9, cost: 2200, color: "#607D8B", desc: "Maximum strength" },
];

const SHAPES = [
  { id: "flat", name: "Flat Beam", icon: "▬", bonus: 1.0, desc: "No structural bonus" },
  { id: "triangle", name: "Truss", icon: "△", bonus: 1.4, desc: "+40% strength" },
  { id: "arch", name: "Arch", icon: "⌒", bonus: 1.7, desc: "+70% strength" },
  { id: "cable", name: "Cable-Stay", icon: "⋏", bonus: 2.0, desc: "+100% strength" },
];

const LOADS = [
  { id: "pedestrian", name: "Pedestrians", icon: "🚶", weight: 2, emoji: "🚶‍♂️🚶‍♀️" },
  { id: "car", name: "Car", icon: "🚗", weight: 5, emoji: "🚗" },
  { id: "truck", name: "Delivery Truck", icon: "🚚", weight: 9, emoji: "🚚" },
  { id: "semi", name: "Semi Trailer", icon: "🚛", weight: 14, emoji: "🚛" },
  { id: "train", name: "Freight Train", icon: "🚂", weight: 20, emoji: "🚂" },
];

const MAX_SEGMENTS = 8;
const STARTING_BUDGET = 10000;

function BridgeVisual({ segments, testState, loadIdx, collapsed }) {
  const load = LOADS[loadIdx];
  const segW = segments.length > 0 ? 320 / segments.length : 40;
  const bridgeY = 120;

  return (
    <svg viewBox="0 0 500 220" style={{ width: "100%", borderRadius: 16, background: "linear-gradient(180deg, #87CEEB 0%, #B3E5FC 60%, #81D4FA 100%)" }}>
      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="80" cy="30" rx="28" ry="12" fill="white" />
        <ellipse cx="100" cy="26" rx="20" ry="10" fill="white" />
        <ellipse cx="350" cy="40" rx="24" ry="10" fill="white" />
        <ellipse cx="370" cy="36" rx="18" ry="9" fill="white" />
      </g>

      {/* Sun */}
      <circle cx="440" cy="35" r="22" fill="#FFF9C4" opacity="0.9" />
      <circle cx="440" cy="35" r="16" fill="#FFEE58" />

      {/* Water */}
      <rect x="80" y="170" width="340" height="50" fill="#29B6F6" opacity="0.5" rx="4" />
      <path d="M80 178 Q120 172 160 178 Q200 184 240 178 Q280 172 320 178 Q360 184 400 178 L420 178 L420 220 L80 220Z" fill="#0288D1" opacity="0.3" />

      {/* Left cliff */}
      <rect x="0" y={bridgeY} width="90" height="100" fill="#6D4C41" rx="4" />
      <rect x="0" y={bridgeY - 4} width="90" height="10" fill="#5D4037" rx="3" />
      <rect x="0" y={bridgeY} width="90" height="6" fill="#795548" />
      {/* Grass */}
      <rect x="0" y={bridgeY - 8} width="90" height="6" fill="#66BB6A" rx="2" />

      {/* Right cliff */}
      <rect x="410" y={bridgeY} width="90" height="100" fill="#6D4C41" rx="4" />
      <rect x="410" y={bridgeY - 4} width="90" height="10" fill="#5D4037" rx="3" />
      <rect x="410" y={bridgeY} width="90" height="6" fill="#795548" />
      <rect x="410" y={bridgeY - 8} width="90" height="6" fill="#66BB6A" rx="2" />

      {/* Bridge segments */}
      {segments.map((seg, i) => {
        const x = 90 + i * segW;
        const mat = MATERIALS.find((m) => m.id === seg.material);
        const shape = SHAPES.find((s) => s.id === seg.shape);
        const collapseOffset = collapsed && testState === "fail" ? Math.sin((i + 1) * 0.8) * (30 + i * 8) : 0;
        const segOpacity = collapsed && testState === "fail" ? 0.5 + Math.random() * 0.3 : 1;

        return (
          <g key={i} style={{ transition: "transform 0.5s", transform: `translateY(${collapseOffset}px)`, opacity: segOpacity }}>
            {/* Support structure */}
            {shape.id === "triangle" && (
              <polygon
                points={`${x},${bridgeY} ${x + segW / 2},${bridgeY + 30} ${x + segW},${bridgeY}`}
                fill={mat.color}
                opacity="0.4"
                stroke={mat.color}
                strokeWidth="1.5"
              />
            )}
            {shape.id === "arch" && (
              <path
                d={`M${x} ${bridgeY + 4} Q${x + segW / 2} ${bridgeY + 35} ${x + segW} ${bridgeY + 4}`}
                fill="none"
                stroke={mat.color}
                strokeWidth="3"
                opacity="0.5"
              />
            )}
            {shape.id === "cable" && (
              <>
                <line x1={x + segW / 2} y1={bridgeY - 25} x2={x + 4} y2={bridgeY - 2} stroke={mat.color} strokeWidth="1.5" opacity="0.6" />
                <line x1={x + segW / 2} y1={bridgeY - 25} x2={x + segW - 4} y2={bridgeY - 2} stroke={mat.color} strokeWidth="1.5" opacity="0.6" />
                <rect x={x + segW / 2 - 2} y={bridgeY - 30} width="4" height="28" fill={mat.color} rx="1" />
              </>
            )}

            {/* Road surface */}
            <rect x={x} y={bridgeY - 4} width={segW + 1} height="10" fill={mat.color} rx="2" />
            <rect x={x} y={bridgeY - 4} width={segW + 1} height="4" fill="white" opacity="0.15" rx="2" />

            {/* Stress indicator during test */}
            {testState === "testing" && (
              <rect x={x} y={bridgeY + 6} width={segW} height="3" fill="#FF5722" opacity="0.4" rx="1">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1s" repeatCount="indefinite" />
              </rect>
            )}
          </g>
        );
      })}

      {/* Bridge road line */}
      {segments.length > 0 && !collapsed && (
        <line x1="90" y1={bridgeY - 1} x2={90 + segments.length * segW} y2={bridgeY - 1} stroke="white" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
      )}

      {/* Vehicle / Load */}
      {testState === "testing" && !collapsed && (
        <text
          fontSize="24"
          y={bridgeY - 12}
          style={{ animation: "driveAcross 3s linear forwards" }}
        >
          {load.emoji}
          <animateMotion dur="3s" fill="freeze" path={`M60,0 L${320 + 40},0`} />
        </text>
      )}

      {testState === "success" && (
        <text
          x={90 + (segments.length * segW) / 2}
          y={bridgeY - 20}
          textAnchor="middle"
          fontSize="14"
          fill="#2E7D32"
          fontWeight="bold"
          fontFamily="Fredoka, sans-serif"
        >
          ✅ Bridge held!
        </text>
      )}

      {testState === "fail" && (
        <text
          x="250"
          y={bridgeY + 60}
          textAnchor="middle"
          fontSize="14"
          fill="#C62828"
          fontWeight="bold"
          fontFamily="Fredoka, sans-serif"
        >
          💥 Bridge collapsed!
        </text>
      )}

      {/* Empty state */}
      {segments.length === 0 && (
        <text x="250" y={bridgeY + 30} textAnchor="middle" fontSize="13" fill="#5D4037" fontFamily="Nunito, sans-serif" fontWeight="700" opacity="0.5">
          Add segments to build your bridge
        </text>
      )}
    </svg>
  );
}

export default function BridgeBuilder() {
  const [segments, setSegments] = useState([]);
  const [selMaterial, setSelMaterial] = useState("wood");
  const [selShape, setSelShape] = useState("flat");
  const [budget, setBudget] = useState(STARTING_BUDGET);
  const [currentLoad, setCurrentLoad] = useState(0);
  const [testState, setTestState] = useState("idle"); // idle, testing, success, fail
  const [collapsed, setCollapsed] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro, build, result, summary
  const [completedLoads, setCompletedLoads] = useState([]);
  const [stars, setStars] = useState(0);
  const timerRef = useRef(null);

  const mat = MATERIALS.find((m) => m.id === selMaterial);
  const shape = SHAPES.find((s) => s.id === selShape);
  const canAfford = budget >= mat.cost;
  const canAdd = segments.length < MAX_SEGMENTS && canAfford;

  const bridgeStrength = segments.reduce((sum, seg) => {
    const m = MATERIALS.find((x) => x.id === seg.material);
    const sh = SHAPES.find((x) => x.id === seg.shape);
    return sum + m.strength * sh.bonus;
  }, 0);

  const addSegment = () => {
    if (!canAdd) return;
    setSegments((prev) => [...prev, { material: selMaterial, shape: selShape }]);
    setBudget((b) => b - mat.cost);
  };

  const removeLastSegment = () => {
    if (segments.length === 0) return;
    const last = segments[segments.length - 1];
    const lastMat = MATERIALS.find((m) => m.id === last.material);
    setSegments((prev) => prev.slice(0, -1));
    setBudget((b) => b + lastMat.cost);
  };

  const testBridge = () => {
    if (segments.length === 0 || testState === "testing") return;
    const load = LOADS[currentLoad];
    setTestState("testing");
    setCollapsed(false);

    timerRef.current = setTimeout(() => {
      if (bridgeStrength >= load.weight) {
        setTestState("success");
        const efficiency = Math.round((budget / STARTING_BUDGET) * 100);
        const loadBonus = (currentLoad + 1) * 50;
        setScore((s) => s + loadBonus + efficiency);
        setCompletedLoads((prev) => [...prev, { load: load.name, success: true }]);
      } else {
        setTestState("fail");
        setCollapsed(true);
        setCompletedLoads((prev) => [...prev, { load: load.name, success: false }]);
      }
    }, 3200);
  };

  const nextLoad = () => {
    if (currentLoad >= LOADS.length - 1) {
      // Calculate final stars
      const successCount = completedLoads.filter((l) => l.success).length + (testState === "success" ? 0 : 0);
      const s = successCount >= 5 ? 3 : successCount >= 3 ? 2 : successCount >= 1 ? 1 : 0;
      setStars(s);
      setPhase("summary");
    } else {
      setCurrentLoad((c) => c + 1);
      setTestState("idle");
      setCollapsed(false);
    }
  };

  const resetBridge = () => {
    setSegments([]);
    setBudget(STARTING_BUDGET);
    setTestState("idle");
    setCollapsed(false);
  };

  const fullRestart = () => {
    resetBridge();
    setCurrentLoad(0);
    setScore(0);
    setCompletedLoads([]);
    setStars(0);
    setPhase("intro");
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const budgetPct = (budget / STARTING_BUDGET) * 100;
  const budgetColor = budgetPct > 50 ? "#27AE60" : budgetPct > 20 ? "#F39C12" : "#E74C3C";

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.introWrap}>
          <div style={st.introCard}>
            <div style={st.introBadge}>CONSTRUCTION ENGINEER</div>
            <h1 style={st.introTitle}>🌉 Bridge Builder</h1>
            <p style={st.introSub}>Design a bridge that can hold increasingly heavy loads. Choose your materials wisely — stronger costs more!</p>
            <div style={st.introRules}>
              <div style={st.ruleRow}><span style={st.ruleIcon}>💰</span><span>You have a <strong>$10,000</strong> budget</span></div>
              <div style={st.ruleRow}><span style={st.ruleIcon}>🧱</span><span>Pick materials and structural shapes</span></div>
              <div style={st.ruleRow}><span style={st.ruleIcon}>🚛</span><span>Test against 5 increasingly heavy loads</span></div>
              <div style={st.ruleRow}><span style={st.ruleIcon}>⭐</span><span>Pass more loads = more stars</span></div>
            </div>
            <button style={st.startBtn} onClick={() => setPhase("build")}>Start Building →</button>
          </div>
        </div>
      )}

      {phase === "build" && (
        <div style={st.gameWrap}>
          {/* Top bar */}
          <div style={st.topBar}>
            <div style={st.topLeft}>
              <span style={st.topLabel}>Load {currentLoad + 1}/5:</span>
              <span style={st.topLoad}>{LOADS[currentLoad].icon} {LOADS[currentLoad].name}</span>
              <span style={st.topWeight}>(Weight: {LOADS[currentLoad].weight})</span>
            </div>
            <div style={st.topRight}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <span style={st.scoreNum}>{score}</span>
            </div>
          </div>

          {/* Bridge visualization */}
          <div style={st.vizWrap}>
            <BridgeVisual segments={segments} testState={testState} loadIdx={currentLoad} collapsed={collapsed} />
          </div>

          {/* Stats bar */}
          <div style={st.statsBar}>
            <div style={st.statItem}>
              <div style={st.statLabel}>Budget</div>
              <div style={{ ...st.statValue, color: budgetColor }}>${budget.toLocaleString()}</div>
              <div style={st.budgetBarOuter}><div style={{ ...st.budgetBarInner, width: `${budgetPct}%`, background: budgetColor }} /></div>
            </div>
            <div style={st.statItem}>
              <div style={st.statLabel}>Segments</div>
              <div style={st.statValue}>{segments.length}/{MAX_SEGMENTS}</div>
            </div>
            <div style={st.statItem}>
              <div style={st.statLabel}>Strength</div>
              <div style={{ ...st.statValue, color: bridgeStrength >= LOADS[currentLoad].weight ? "#27AE60" : "#E74C3C" }}>
                {bridgeStrength.toFixed(1)} / {LOADS[currentLoad].weight}
              </div>
            </div>
          </div>

          {/* Build controls */}
          {testState === "idle" && (
            <div style={st.controls}>
              <div style={st.controlSection}>
                <div style={st.controlLabel}>Material</div>
                <div style={st.optionRow}>
                  {MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelMaterial(m.id)}
                      style={{
                        ...st.optionBtn,
                        borderColor: selMaterial === m.id ? m.color : "#E5E7EB",
                        background: selMaterial === m.id ? `${m.color}12` : "white",
                      }}
                    >
                      <span style={st.optEmoji}>{m.icon}</span>
                      <span style={st.optName}>{m.name}</span>
                      <span style={{ ...st.optCost, color: budget >= m.cost ? "#6B7280" : "#EF4444" }}>${m.cost}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={st.controlSection}>
                <div style={st.controlLabel}>Structure</div>
                <div style={st.optionRow}>
                  {SHAPES.map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => setSelShape(sh.id)}
                      style={{
                        ...st.optionBtn,
                        borderColor: selShape === sh.id ? "#E65100" : "#E5E7EB",
                        background: selShape === sh.id ? "#FFF3E0" : "white",
                      }}
                    >
                      <span style={st.optEmoji}>{sh.icon}</span>
                      <span style={st.optName}>{sh.name}</span>
                      <span style={st.optBonus}>{sh.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={st.actionRow}>
                <button style={{ ...st.addBtn, opacity: canAdd ? 1 : 0.4 }} onClick={addSegment} disabled={!canAdd}>
                  + Add Segment (${mat.cost})
                </button>
                <button style={st.undoBtn} onClick={removeLastSegment} disabled={segments.length === 0}>
                  ↩ Undo
                </button>
                <button style={st.clearBtn} onClick={resetBridge}>
                  🗑 Clear All
                </button>
              </div>

              <button
                style={{ ...st.testBtn, opacity: segments.length > 0 ? 1 : 0.4 }}
                onClick={testBridge}
                disabled={segments.length === 0}
              >
                🚦 Test Bridge with {LOADS[currentLoad].icon} {LOADS[currentLoad].name}
              </button>
            </div>
          )}

          {testState === "testing" && (
            <div style={st.testingBanner}>
              <div style={st.testingDot} />
              Testing bridge strength...
            </div>
          )}

          {(testState === "success" || testState === "fail") && (
            <div style={{ ...st.resultBanner, borderColor: testState === "success" ? "#27AE60" : "#E74C3C" }}>
              <div style={st.resultEmoji}>{testState === "success" ? "🎉" : "💥"}</div>
              <div>
                <div style={{ ...st.resultTitle, color: testState === "success" ? "#27AE60" : "#E74C3C" }}>
                  {testState === "success" ? "Bridge held!" : "Bridge collapsed!"}
                </div>
                <div style={st.resultSub}>
                  {testState === "success"
                    ? `Strength ${bridgeStrength.toFixed(1)} vs Weight ${LOADS[currentLoad].weight} — well built!`
                    : `Needed ${LOADS[currentLoad].weight} strength but only had ${bridgeStrength.toFixed(1)}`}
                </div>
              </div>
              <button style={st.nextBtn} onClick={nextLoad}>
                {currentLoad >= LOADS.length - 1 ? "See Results" : "Next Load →"}
              </button>
            </div>
          )}

          {/* Fun fact */}
          <div style={st.funFact}>
            💡 <strong>Engineering Fact:</strong> Real bridge engineers use the same thinking — balancing cost, materials, and structural shapes to handle expected loads safely.
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={st.introWrap}>
          <div style={st.summaryCard}>
            <div style={st.introBadge}>BUILD COMPLETE</div>
            <div style={st.summaryStars}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.introTitle}>
              {stars === 3 ? "Master Engineer! 🏆" : stars === 2 ? "Great Builder! 👏" : stars === 1 ? "Good Start! 🔧" : "Keep Practicing! 💪"}
            </h2>
            <div style={st.summaryScore}>
              <span style={st.summaryScoreNum}>{score}</span>
              <span style={st.summaryScoreLabel}>points</span>
            </div>
            <div style={st.summaryResults}>
              {completedLoads.map((l, i) => (
                <div key={i} style={st.summaryRow}>
                  <span>{l.success ? "✅" : "❌"}</span>
                  <span style={st.summaryRowName}>{l.load}</span>
                </div>
              ))}
            </div>
            <div style={st.careerInsight}>
              <strong>🎓 Career Insight:</strong> Civil engineers earn about $95,000/year and design structures that keep millions of people safe every day. The math you used — balancing strength vs. cost — is exactly what they do!
            </div>
            <button style={st.startBtn} onClick={fullRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #FFF3E0 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  introWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  introCard: { background: "white", borderRadius: 24, padding: "44px 36px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(230,81,0,0.08)", border: "2px solid #FFF3E0", animation: "fadeInUp 0.6s ease-out" },
  introBadge: { display: "inline-block", background: "#FFF3E0", color: "#E65100", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  introTitle: { fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  introSub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  introRules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 },
  ruleRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#FFFBF5", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  ruleIcon: { fontSize: 18, flexShrink: 0 },
  startBtn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #E65100, #BF360C)", color: "white", fontSize: 17, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(230,81,0,0.25)" },

  gameWrap: { maxWidth: 720, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "white", borderRadius: 14, border: "1.5px solid #F3F4F6", marginBottom: 12 },
  topLeft: { display: "flex", alignItems: "center", gap: 8 },
  topLabel: { fontSize: 13, fontWeight: 700, color: "#9CA3AF" },
  topLoad: { fontSize: 15, fontWeight: 800, color: "#1A1A2E" },
  topWeight: { fontSize: 12, fontWeight: 600, color: "#9CA3AF" },
  topRight: { display: "flex", alignItems: "center", gap: 6, background: "#FFF9E6", padding: "6px 14px", borderRadius: 100, border: "1.5px solid #F7DC6F" },
  scoreNum: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#F39C12" },

  vizWrap: { marginBottom: 12, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "2px solid #E3F2FD" },

  statsBar: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },
  statItem: { background: "white", borderRadius: 14, padding: "12px 14px", border: "1.5px solid #F3F4F6", textAlign: "center" },
  statLabel: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  statValue: { fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E" },
  budgetBarOuter: { marginTop: 6, height: 4, borderRadius: 2, background: "#F3F4F6" },
  budgetBarInner: { height: "100%", borderRadius: 2, transition: "width 0.3s, background 0.3s" },

  controls: { background: "white", borderRadius: 18, padding: "20px 18px", border: "1.5px solid #F3F4F6", marginBottom: 12 },
  controlSection: { marginBottom: 16 },
  controlLabel: { fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#6B7280", marginBottom: 8 },
  optionRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  optionBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 6px", borderRadius: 14, border: "2px solid", cursor: "pointer", background: "white", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s" },
  optEmoji: { fontSize: 20 },
  optName: { fontSize: 11, fontWeight: 800, color: "#374151" },
  optCost: { fontSize: 10, fontWeight: 700 },
  optBonus: { fontSize: 9, fontWeight: 700, color: "#9CA3AF" },

  actionRow: { display: "flex", gap: 8, marginBottom: 12 },
  addBtn: { flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "#E65100", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "opacity 0.2s" },
  undoBtn: { padding: "11px 16px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: "#6B7280", cursor: "pointer" },
  clearBtn: { padding: "11px 16px", borderRadius: 12, border: "1.5px solid #FECDD3", background: "#FFF1F2", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: "#EF4444", cursor: "pointer" },

  testBtn: { width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #2E7D32, #1B5E20)", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 16px rgba(46,125,50,0.25)", transition: "opacity 0.2s" },

  testingBanner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 14, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: "#F57F17", marginBottom: 12 },
  testingDot: { width: 10, height: 10, borderRadius: "50%", background: "#F57F17", animation: "pulse 1s infinite" },

  resultBanner: { display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "white", borderRadius: 16, border: "2px solid", marginBottom: 12, animation: "fadeInUp 0.4s ease-out" },
  resultEmoji: { fontSize: 36 },
  resultTitle: { fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 2 },
  resultSub: { fontSize: 13, fontWeight: 600, color: "#6B7280" },
  nextBtn: { marginLeft: "auto", padding: "10px 20px", borderRadius: 12, border: "none", background: "#1565C0", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" },

  funFact: { padding: "14px 18px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6 },

  summaryCard: { background: "white", borderRadius: 24, padding: "44px 36px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.08)", animation: "fadeInUp 0.6s ease-out" },
  summaryStars: { fontSize: 40, marginBottom: 12, letterSpacing: 8 },
  summaryScore: { marginBottom: 24 },
  summaryScoreNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700, background: "linear-gradient(135deg, #E65100, #BF360C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  summaryScoreLabel: { display: "block", fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
  summaryResults: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 },
  summaryRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#F9FAFB", fontSize: 14, fontWeight: 700 },
  summaryRowName: { color: "#374151" },
  careerInsight: { padding: "16px 18px", background: "#FFF3E0", border: "1.5px solid #FFE0B2", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#E65100", lineHeight: 1.6, textAlign: "left", marginBottom: 24 },
};
