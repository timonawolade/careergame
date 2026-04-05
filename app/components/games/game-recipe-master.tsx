"use client";

import { useState, useEffect, useRef } from "react";

const RECIPES = [
  {
    id: "pancakes", name: "Fluffy Pancakes", emoji: "🥞", difficulty: "Easy", servings: 4,
    steps: [
      { instruction: "Add flour to the bowl", ingredient: "🌾 Flour", amount: "2 cups", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Add sugar", ingredient: "🍬 Sugar", amount: "2 tbsp", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Crack eggs into the bowl", ingredient: "🥚 Eggs", amount: "2 eggs", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Pour in milk", ingredient: "🥛 Milk", amount: "1.5 cups", action: "measure", target: 3, tolerance: 1 },
      { instruction: "Mix everything together", ingredient: "🥄 Mix", amount: "Mix well", action: "mix", target: 8, tolerance: 2 },
      { instruction: "Cook on the griddle", ingredient: "🍳 Cook", amount: "2 min each side", action: "timer", target: 4, tolerance: 1 },
    ],
    funFact: "The world's largest pancake was 49 feet wide and weighed 6,614 pounds!",
  },
  {
    id: "smoothie", name: "Berry Smoothie", emoji: "🫐", difficulty: "Easy", servings: 2,
    steps: [
      { instruction: "Add frozen berries", ingredient: "🫐 Berries", amount: "1 cup", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Add banana slices", ingredient: "🍌 Banana", amount: "1 banana", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Pour in yogurt", ingredient: "🥛 Yogurt", amount: "½ cup", action: "measure", target: 1, tolerance: 0 },
      { instruction: "Add honey", ingredient: "🍯 Honey", amount: "1 tbsp", action: "measure", target: 1, tolerance: 0 },
      { instruction: "Blend until smooth", ingredient: "⚡ Blend", amount: "30 seconds", action: "mix", target: 6, tolerance: 2 },
    ],
    funFact: "Smoothies became popular in the 1960s when health food stores started popping up across America!",
  },
  {
    id: "pasta", name: "Tomato Pasta", emoji: "🍝", difficulty: "Medium", servings: 4,
    steps: [
      { instruction: "Boil water in a large pot", ingredient: "💧 Water", amount: "Fill pot", action: "measure", target: 4, tolerance: 1 },
      { instruction: "Add a pinch of salt", ingredient: "🧂 Salt", amount: "1 tsp", action: "measure", target: 1, tolerance: 0 },
      { instruction: "Add pasta to boiling water", ingredient: "🍝 Pasta", amount: "400g", action: "measure", target: 4, tolerance: 0 },
      { instruction: "Cook pasta (stir occasionally)", ingredient: "⏱️ Cook", amount: "10 min", action: "timer", target: 5, tolerance: 1 },
      { instruction: "Dice the tomatoes", ingredient: "🍅 Tomatoes", amount: "4 tomatoes", action: "measure", target: 4, tolerance: 0 },
      { instruction: "Sauté garlic in olive oil", ingredient: "🧄 Garlic", amount: "3 cloves", action: "measure", target: 3, tolerance: 0 },
      { instruction: "Simmer the sauce", ingredient: "🫕 Simmer", amount: "5 min", action: "timer", target: 5, tolerance: 1 },
      { instruction: "Mix pasta and sauce together", ingredient: "🥄 Combine", amount: "Toss well", action: "mix", target: 6, tolerance: 2 },
    ],
    funFact: "Italy produces about 3.5 million tons of pasta per year — that's enough to fill over 1,000 Olympic swimming pools!",
  },
  {
    id: "sushi", name: "Sushi Rolls", emoji: "🍣", difficulty: "Hard", servings: 6,
    steps: [
      { instruction: "Wash the sushi rice", ingredient: "🍚 Rice", amount: "2 cups", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Cook the rice", ingredient: "⏱️ Cook Rice", amount: "15 min", action: "timer", target: 5, tolerance: 1 },
      { instruction: "Season with rice vinegar", ingredient: "🫗 Vinegar", amount: "3 tbsp", action: "measure", target: 3, tolerance: 0 },
      { instruction: "Slice the fish thinly", ingredient: "🐟 Fish", amount: "200g", action: "measure", target: 4, tolerance: 1 },
      { instruction: "Cut avocado into strips", ingredient: "🥑 Avocado", amount: "1 avocado", action: "measure", target: 2, tolerance: 0 },
      { instruction: "Lay nori sheet and spread rice", ingredient: "🫘 Nori + Rice", amount: "Spread evenly", action: "mix", target: 8, tolerance: 2 },
      { instruction: "Add fillings and roll tightly", ingredient: "🌀 Roll", amount: "Roll tight", action: "mix", target: 10, tolerance: 2 },
      { instruction: "Cut into 6 pieces", ingredient: "🔪 Cut", amount: "6 pieces", action: "measure", target: 6, tolerance: 0 },
    ],
    funFact: "It takes 10 years of training to become a sushi master in Japan. The first few years are spent just learning to cook rice perfectly!",
  },
];

export default function RecipeMaster() {
  const [phase, setPhase] = useState("intro");
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [stepScore, setStepScore] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState([]);
  const [mixAngle, setMixAngle] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const intervalRef = useRef(null);

  const recipe = RECIPES[recipeIdx];
  const step = recipe?.steps[stepIdx];

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimerCount((c) => c + 1);
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  const handleAction = () => {
    if (!step || stepDone) return;
    if (step.action === "measure") {
      const newCount = count + 1;
      setCount(newCount);
      if (newCount >= step.target) finishStep(newCount);
    } else if (step.action === "mix") {
      const newCount = count + 1;
      setCount(newCount);
      setMixAngle((a) => a + 45);
      if (newCount >= step.target) finishStep(newCount);
    } else if (step.action === "timer") {
      if (!timerActive) {
        setTimerActive(true);
        setTimerCount(0);
      } else {
        clearInterval(intervalRef.current);
        setTimerActive(false);
        finishStep(timerCount);
      }
    }
  };

  const finishStep = (finalCount) => {
    const diff = Math.abs(finalCount - step.target);
    const sc = diff <= step.tolerance ? 100 : diff <= step.tolerance + 1 ? 70 : 40;
    setStepScore(sc);
    setStepDone(true);
    setTotalScore((s) => s + sc);
    setTimerActive(false);
    clearInterval(intervalRef.current);
  };

  const nextStep = () => {
    if (stepIdx >= recipe.steps.length - 1) {
      const avgScore = Math.round(totalScore / recipe.steps.length);
      setResults((r) => [...r, { name: recipe.name, emoji: recipe.emoji, score: avgScore }]);
      if (recipeIdx >= RECIPES.length - 1) {
        setPhase("summary");
      } else {
        setRecipeIdx((i) => i + 1);
        setStepIdx(0);
        setCount(0);
        setStepDone(false);
        setStepScore(null);
        setTotalScore(0);
      }
    } else {
      setStepIdx((i) => i + 1);
      setCount(0);
      setStepDone(false);
      setStepScore(null);
      setTimerCount(0);
    }
  };

  const restart = () => {
    setPhase("intro"); setRecipeIdx(0); setStepIdx(0); setCount(0);
    setStepDone(false); setStepScore(null); setTotalScore(0);
    setResults([]); setTimerActive(false); setTimerCount(0);
  };

  const overallAvg = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  const stars = overallAvg >= 85 ? 3 : overallAvg >= 60 ? 2 : 1;

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>CHEF & COOK</div>
            <h1 style={st.title}>📖 Recipe Master</h1>
            <p style={st.sub}>Follow recipes step by step. Measure ingredients precisely, time your cooking perfectly, and mix with care!</p>
            <div style={st.rules}>
              <div style={st.rule}><span>📏</span><span>Tap to measure — hit the exact amount</span></div>
              <div style={st.rule}><span>🥄</span><span>Tap to mix — get the right number of stirs</span></div>
              <div style={st.rule}><span>⏱️</span><span>Start & stop timers at the right moment</span></div>
              <div style={st.rule}><span>🍽️</span><span>4 recipes from easy to hard</span></div>
            </div>
            <button style={st.btn} onClick={() => setPhase("play")}>Start Cooking →</button>
          </div>
        </div>
      )}

      {phase === "play" && step && (
        <div style={st.gameWrap}>
          <div style={st.topBar}>
            <div style={st.recipeChip}>{recipe.emoji} {recipe.name}</div>
            <div style={st.diffChip}>{recipe.difficulty}</div>
          </div>

          {/* Step progress */}
          <div style={st.stepProgress}>
            {recipe.steps.map((_, i) => (
              <div key={i} style={{ ...st.stepDot, background: i < stepIdx ? "#27AE60" : i === stepIdx ? "#E65100" : "#E5E7EB" }} />
            ))}
          </div>

          <div style={st.stepCard}>
            <div style={st.stepNum}>Step {stepIdx + 1} of {recipe.steps.length}</div>
            <h2 style={st.stepInstruction}>{step.instruction}</h2>
            <div style={st.stepDetail}>{step.ingredient} — {step.amount}</div>

            {/* Action area */}
            <div style={st.actionArea}>
              {step.action === "measure" && (
                <>
                  <div style={st.counterDisplay}>
                    <span style={st.counterNum}>{count}</span>
                    <span style={st.counterTarget}>/ {step.target}</span>
                  </div>
                  <div style={st.progressBarOuter}>
                    <div style={{ ...st.progressBarInner, width: `${Math.min(100, (count / step.target) * 100)}%` }} />
                  </div>
                </>
              )}
              {step.action === "mix" && (
                <>
                  <div style={{ ...st.mixBowl, transform: `rotate(${mixAngle}deg)` }}>🥣</div>
                  <div style={st.counterDisplay}>
                    <span style={st.counterNum}>{count}</span>
                    <span style={st.counterTarget}>/ {step.target} stirs</span>
                  </div>
                </>
              )}
              {step.action === "timer" && (
                <>
                  <div style={st.timerDisplay}>
                    <span style={{ fontSize: 40 }}>{timerActive ? "🔥" : "⏱️"}</span>
                    <span style={{ ...st.timerNum, color: timerActive ? "#E74C3C" : "#374151" }}>{timerCount}</span>
                    <span style={st.counterTarget}>target: {step.target}</span>
                  </div>
                </>
              )}

              {!stepDone ? (
                <button style={st.actionBtn} onClick={handleAction}>
                  {step.action === "measure" ? `Add ${step.ingredient.split(" ")[0]}` :
                   step.action === "mix" ? "Stir! 🥄" :
                   timerActive ? "Stop Timer ⏹️" : "Start Timer ▶️"}
                </button>
              ) : (
                <div style={st.stepResult}>
                  <div style={{ ...st.stepResultEmoji, animation: "bounce 0.5s ease-out" }}>
                    {stepScore >= 90 ? "🌟" : stepScore >= 60 ? "👍" : "😅"}
                  </div>
                  <div style={st.stepResultText}>
                    {stepScore >= 90 ? "Perfect!" : stepScore >= 60 ? "Good enough!" : "A bit off..."}
                  </div>
                  <div style={st.stepScoreNum}>+{stepScore} pts</div>
                  <button style={st.btn} onClick={nextStep}>
                    {stepIdx >= recipe.steps.length - 1 ? "Finish Recipe →" : "Next Step →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>ALL RECIPES DONE</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>{stars === 3 ? "Recipe Master! 🏆" : stars === 2 ? "Good Cook! 👏" : "Keep Practicing! 📖"}</h2>
            <div style={st.resultsList}>
              {results.map((r, i) => (
                <div key={i} style={st.resultRow}>
                  <span style={{ fontSize: 22 }}>{r.emoji}</span>
                  <span style={{ flex: 1, fontWeight: 700, color: "#374151" }}>{r.name}</span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: r.score >= 85 ? "#27AE60" : r.score >= 60 ? "#F39C12" : "#E74C3C" }}>{r.score}%</span>
                </div>
              ))}
            </div>
            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> Professional chefs must follow recipes precisely — especially in baking, where small measurement errors can ruin an entire batch. Pastry chefs weigh ingredients to the gram!
            </div>
            <button style={st.btn} onClick={restart}>Cook Again</button>
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
  btn: { width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #E65100, #BF360C)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(230,81,0,0.2)" },

  gameWrap: { maxWidth: 520, margin: "0 auto", padding: "16px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  recipeChip: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#374151" },
  diffChip: { fontSize: 12, fontWeight: 800, color: "#6B7280", background: "#F3F4F6", padding: "4px 12px", borderRadius: 100 },

  stepProgress: { display: "flex", gap: 4, marginBottom: 16 },
  stepDot: { flex: 1, height: 5, borderRadius: 3, transition: "background 0.3s" },

  stepCard: { background: "white", borderRadius: 20, padding: "28px 24px", border: "1.5px solid #F3F4F6", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", animation: "fadeInUp 0.4s ease-out" },
  stepNum: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  stepInstruction: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 },
  stepDetail: { fontSize: 14, fontWeight: 600, color: "#E65100", marginBottom: 24 },

  actionArea: { textAlign: "center" },
  counterDisplay: { marginBottom: 12 },
  counterNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700, color: "#1A1A2E" },
  counterTarget: { fontSize: 18, fontWeight: 600, color: "#9CA3AF", marginLeft: 4 },
  progressBarOuter: { height: 8, borderRadius: 4, background: "#F3F4F6", marginBottom: 20 },
  progressBarInner: { height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #E65100, #FF8A65)", transition: "width 0.3s" },

  mixBowl: { fontSize: 56, marginBottom: 8, transition: "transform 0.2s ease-out", display: "inline-block" },

  timerDisplay: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 16 },
  timerNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700 },

  actionBtn: { width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "#E65100", color: "white", fontSize: 18, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 16px rgba(230,81,0,0.25)" },

  stepResult: { textAlign: "center" },
  stepResultEmoji: { fontSize: 48, marginBottom: 8 },
  stepResultText: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#27AE60", marginBottom: 4 },
  stepScoreNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#F39C12", marginBottom: 16 },

  resultsList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 },
  resultRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: 12 },

  insight: { padding: "14px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, textAlign: "left", marginBottom: 20 },
};
