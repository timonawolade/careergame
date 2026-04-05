"use client";

import { useState } from "react";

const MYSTERY_INGREDIENTS = [
  { id: "salmon", name: "Salmon", emoji: "🐟", category: "protein" },
  { id: "chicken", name: "Chicken", emoji: "🍗", category: "protein" },
  { id: "tofu", name: "Tofu", emoji: "🧈", category: "protein" },
  { id: "shrimp", name: "Shrimp", emoji: "🦐", category: "protein" },
];

const PANTRY = [
  { id: "rice", name: "Rice", emoji: "🍚", category: "grain", pairs: ["salmon", "chicken", "tofu", "shrimp"] },
  { id: "pasta", name: "Pasta", emoji: "🍝", category: "grain", pairs: ["chicken", "shrimp"] },
  { id: "bread", name: "Bread", emoji: "🍞", category: "grain", pairs: ["chicken", "tofu"] },
  { id: "noodles", name: "Noodles", emoji: "🍜", category: "grain", pairs: ["chicken", "shrimp", "tofu"] },
  { id: "tomato", name: "Tomato", emoji: "🍅", category: "veggie", pairs: ["chicken", "shrimp", "tofu"] },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", category: "veggie", pairs: ["chicken", "tofu", "salmon"] },
  { id: "mushroom", name: "Mushroom", emoji: "🍄", category: "veggie", pairs: ["chicken", "tofu", "salmon"] },
  { id: "avocado", name: "Avocado", emoji: "🥑", category: "veggie", pairs: ["salmon", "shrimp", "chicken"] },
  { id: "pepper", name: "Bell Pepper", emoji: "🫑", category: "veggie", pairs: ["chicken", "shrimp", "tofu"] },
  { id: "lemon", name: "Lemon", emoji: "🍋", category: "flavor", pairs: ["salmon", "shrimp", "chicken"] },
  { id: "garlic", name: "Garlic", emoji: "🧄", category: "flavor", pairs: ["salmon", "chicken", "shrimp", "tofu"] },
  { id: "ginger", name: "Ginger", emoji: "🫚", category: "flavor", pairs: ["salmon", "shrimp", "tofu"] },
  { id: "soy", name: "Soy Sauce", emoji: "🫗", category: "flavor", pairs: ["salmon", "chicken", "tofu", "shrimp"] },
  { id: "cheese", name: "Cheese", emoji: "🧀", category: "dairy", pairs: ["chicken", "tofu"] },
  { id: "butter", name: "Butter", emoji: "🧈", category: "dairy", pairs: ["salmon", "chicken", "shrimp"] },
  { id: "cream", name: "Cream", emoji: "🥛", category: "dairy", pairs: ["salmon", "chicken", "shrimp"] },
];

const COOKING_METHODS = [
  { id: "grill", name: "Grill", emoji: "🔥", bonus: ["salmon", "chicken"] },
  { id: "stirfry", name: "Stir-Fry", emoji: "🍳", bonus: ["shrimp", "tofu", "chicken"] },
  { id: "bake", name: "Bake", emoji: "♨️", bonus: ["salmon", "chicken"] },
  { id: "steam", name: "Steam", emoji: "💨", bonus: ["shrimp", "tofu", "salmon"] },
  { id: "saute", name: "Sauté", emoji: "🫕", bonus: ["chicken", "shrimp", "tofu"] },
];

const DISH_NAMES_PREFIX = ["Golden", "Crispy", "Savory", "Zesty", "Silky", "Smoky", "Garden", "Royal"];
const DISH_NAMES_SUFFIX = ["Delight", "Fusion", "Bowl", "Plate", "Special", "Creation", "Medley", "Feast"];

const ROUNDS = 3;

function calcScore(mystery, selectedItems, method) {
  let creativity = 0, taste = 0, presentation = 0;
  const categories = new Set(selectedItems.map((i) => i.category));
  creativity += categories.size * 15;
  if (categories.size >= 3) creativity += 20;

  selectedItems.forEach((item) => {
    if (item.pairs && item.pairs.includes(mystery.id)) taste += 18;
    else taste += 5;
  });
  taste = Math.min(taste, 100);

  if (selectedItems.length >= 3 && selectedItems.length <= 5) presentation += 40;
  else if (selectedItems.length >= 2) presentation += 25;
  if (method && method.bonus.includes(mystery.id)) presentation += 30;
  else presentation += 15;
  if (categories.has("flavor")) presentation += 15;

  creativity = Math.min(creativity, 100);
  presentation = Math.min(presentation, 100);
  const total = Math.round((creativity + taste + presentation) / 3);
  return { creativity, taste, presentation, total };
}

export default function IronChef() {
  const [phase, setPhase] = useState("intro");
  const [round, setRound] = useState(0);
  const [mystery, setMystery] = useState(null);
  const [selected, setSelected] = useState([]);
  const [method, setMethod] = useState(null);
  const [dishName, setDishName] = useState("");
  const [roundScores, setRoundScores] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);

  const startRound = () => {
    const m = MYSTERY_INGREDIENTS[Math.floor(Math.random() * MYSTERY_INGREDIENTS.length)];
    setMystery(m);
    setSelected([]);
    setMethod(null);
    setDishName("");
    setShowResult(false);
    setCurrentScore(null);
    setPhase("reveal");
    setTimeout(() => setPhase("cook"), 2000);
  };

  const startGame = () => { setRound(0); setRoundScores([]); startRound(); };

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.find((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : prev.length < 6 ? [...prev, item] : prev
    );
  };

  const submitDish = () => {
    const name = dishName || `${DISH_NAMES_PREFIX[Math.floor(Math.random() * DISH_NAMES_PREFIX.length)]} ${mystery.name} ${DISH_NAMES_SUFFIX[Math.floor(Math.random() * DISH_NAMES_SUFFIX.length)]}`;
    const sc = calcScore(mystery, selected, method);
    setCurrentScore({ ...sc, name });
    setRoundScores((prev) => [...prev, { ...sc, name, mystery: mystery.name }]);
    setShowResult(true);
  };

  const nextRound = () => {
    if (round >= ROUNDS - 1) {
      setPhase("summary");
    } else {
      setRound((r) => r + 1);
      startRound();
    }
  };

  const restart = () => { setPhase("intro"); setRound(0); setRoundScores([]); };

  const overallAvg = roundScores.length > 0 ? Math.round(roundScores.reduce((s, r) => s + r.total, 0) / roundScores.length) : 0;
  const stars = overallAvg >= 80 ? 3 : overallAvg >= 55 ? 2 : 1;
  const canSubmit = selected.length >= 2 && method;

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes reveal { from{transform:scale(0) rotate(-180deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>CHEF & COOK</div>
            <h1 style={st.title}>🏆 Iron Chef Challenge</h1>
            <p style={st.sub}>A mystery ingredient is revealed! Build a dish using pantry items and a cooking method. Judges score creativity, taste, and presentation.</p>
            <div style={st.rules}>
              <div style={st.rule}><span>❓</span><span>A mystery protein is revealed each round</span></div>
              <div style={st.rule}><span>🥘</span><span>Pick 2-6 pantry items that pair well with it</span></div>
              <div style={st.rule}><span>🔥</span><span>Choose a cooking method</span></div>
              <div style={st.rule}><span>⭐</span><span>3 rounds — impress the judges!</span></div>
            </div>
            <button style={st.btn} onClick={startGame}>Accept the Challenge →</button>
          </div>
        </div>
      )}

      {phase === "reveal" && mystery && (
        <div style={st.center}>
          <div style={{ textAlign: "center", animation: "reveal 0.8s ease-out" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Round {round + 1} Mystery Ingredient</div>
            <div style={{ fontSize: 80, marginBottom: 12 }}>{mystery.emoji}</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 36, fontWeight: 700, color: "#1A1A2E" }}>{mystery.name}</div>
          </div>
        </div>
      )}

      {phase === "cook" && mystery && !showResult && (
        <div style={st.gameWrap}>
          <div style={st.topBar}>
            <div style={st.roundChip}>Round {round + 1}/{ROUNDS}</div>
            <div style={st.mysteryChip}>{mystery.emoji} {mystery.name}</div>
          </div>

          <div style={st.sectionLabel}>Select Ingredients (2-6)</div>
          <div style={st.pantryGrid}>
            {PANTRY.map((item) => {
              const sel = selected.find((i) => i.id === item.id);
              const pairs = item.pairs?.includes(mystery.id);
              return (
                <button key={item.id} onClick={() => toggleItem(item)} style={{
                  ...st.pantryBtn,
                  borderColor: sel ? "#27AE60" : "#E5E7EB",
                  background: sel ? "#F0FFF4" : "white",
                }}>
                  <span style={{ fontSize: 22 }}>{item.emoji}</span>
                  <span style={st.pantryName}>{item.name}</span>
                  {pairs && <span style={st.pairDot}>♥</span>}
                </button>
              );
            })}
          </div>

          <div style={st.sectionLabel}>Cooking Method</div>
          <div style={st.methodRow}>
            {COOKING_METHODS.map((m) => (
              <button key={m.id} onClick={() => setMethod(m)} style={{
                ...st.methodBtn,
                borderColor: method?.id === m.id ? "#E65100" : "#E5E7EB",
                background: method?.id === m.id ? "#FFF3E0" : "white",
              }}>
                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                <span style={st.methodName}>{m.name}</span>
              </button>
            ))}
          </div>

          <div style={st.sectionLabel}>Name Your Dish (optional)</div>
          <input
            style={st.nameInput}
            placeholder={`e.g. Golden ${mystery.name} Delight`}
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />

          <button style={{ ...st.btn, opacity: canSubmit ? 1 : 0.4, marginTop: 16 }} onClick={submitDish} disabled={!canSubmit}>
            🍽️ Present to Judges
          </button>
        </div>
      )}

      {phase === "cook" && showResult && currentScore && (
        <div style={st.center}>
          <div style={st.resultCard}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Judges' Scores</div>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{currentScore.name}</h2>
            <div style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 600, marginBottom: 20 }}>with {mystery.emoji} {mystery.name}</div>

            <div style={st.scoresGrid}>
              {[
                { label: "Creativity", val: currentScore.creativity, emoji: "🎨" },
                { label: "Taste", val: currentScore.taste, emoji: "👅" },
                { label: "Presentation", val: currentScore.presentation, emoji: "✨" },
              ].map((s) => (
                <div key={s.label} style={st.scoreItem}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <div style={{ ...st.scoreVal, color: s.val >= 70 ? "#27AE60" : s.val >= 45 ? "#F39C12" : "#E74C3C" }}>{s.val}</div>
                  <div style={st.scoreLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={st.totalScore}>
              <span style={st.totalNum}>{currentScore.total}</span>
              <span style={st.totalLabel}>/ 100</span>
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: currentScore.total >= 75 ? "#27AE60" : "#F39C12", marginBottom: 20 }}>
              {currentScore.total >= 85 ? "Outstanding! 🌟" : currentScore.total >= 70 ? "Impressive! 👏" : currentScore.total >= 50 ? "Good effort! 👍" : "Needs work 💪"}
            </div>

            <button style={st.btn} onClick={nextRound}>
              {round >= ROUNDS - 1 ? "See Final Results" : "Next Round →"}
            </button>
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>CHALLENGE COMPLETE</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>{stars === 3 ? "Iron Chef! 🏆" : stars === 2 ? "Sous Chef! 👨‍🍳" : "Apprentice! 🔪"}</h2>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#E65100", margin: "8px 0" }}>{overallAvg}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>AVERAGE SCORE</div>
            {roundScores.map((r, i) => (
              <div key={i} style={st.summRow}>
                <span>{r.total >= 75 ? "🌟" : "👍"}</span>
                <span style={{ flex: 1, fontWeight: 700, color: "#374151", fontSize: 14 }}>{r.name}</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#E65100" }}>{r.total}/100</span>
              </div>
            ))}
            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> On the TV show Iron Chef, real chefs get just 60 minutes to create multiple dishes with a mystery ingredient. The best chefs know which flavors pair well together — that's called "flavor profiling"!
            </div>
            <button style={st.btn} onClick={restart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #FFF8E1 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(230,81,0,0.08)", border: "2px solid #FFF3E0", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#FFF3E0", color: "#E65100", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  rules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 },
  rule: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#FFFBF5", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #E65100, #BF360C)", color: "white", fontSize: 17, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(230,81,0,0.25)" },

  gameWrap: { maxWidth: 600, margin: "0 auto", padding: "16px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  roundChip: { fontSize: 13, fontWeight: 800, color: "#6B7280" },
  mysteryChip: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#E65100", background: "#FFF3E0", padding: "6px 16px", borderRadius: 100 },

  sectionLabel: { fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#9CA3AF", marginBottom: 8, marginTop: 16 },
  pantryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 },
  pantryBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 4px", borderRadius: 12, border: "2px solid", cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s", position: "relative" },
  pantryName: { fontSize: 10, fontWeight: 700, color: "#374151" },
  pairDot: { position: "absolute", top: 2, right: 4, fontSize: 8, color: "#E74C3C" },

  methodRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 },
  methodBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 4px", borderRadius: 12, border: "2px solid", cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s" },
  methodName: { fontSize: 10, fontWeight: 800, color: "#374151" },

  nameInput: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #E5E7EB", fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" },

  resultCard: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.08)", animation: "fadeInUp 0.5s ease-out" },
  scoresGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 },
  scoreItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 8px", background: "#F9FAFB", borderRadius: 14 },
  scoreVal: { fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700 },
  scoreLabel: { fontSize: 11, fontWeight: 700, color: "#9CA3AF" },
  totalScore: { marginBottom: 8 },
  totalNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700, color: "#1A1A2E" },
  totalLabel: { fontSize: 20, fontWeight: 600, color: "#9CA3AF" },

  summRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: 12, marginBottom: 6 },
  insight: { padding: "14px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
};
