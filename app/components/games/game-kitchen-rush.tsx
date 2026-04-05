"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MENU = [
  { id: "burger", name: "Burger", emoji: "🍔", ingredients: ["🍞", "🥩", "🧀", "🥬"], time: 28, points: 100 },
  { id: "pizza", name: "Pizza", emoji: "🍕", ingredients: ["🫓", "🍅", "🧀", "🍄"], time: 30, points: 120 },
  { id: "salad", name: "Salad", emoji: "🥗", ingredients: ["🥬", "🍅", "🥒", "🫒"], time: 20, points: 80 },
  { id: "pasta", name: "Pasta", emoji: "🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"], time: 25, points: 110 },
  { id: "sushi", name: "Sushi", emoji: "🍣", ingredients: ["🍚", "🐟", "🥑", "🫚"], time: 35, points: 150 },
  { id: "taco", name: "Taco", emoji: "🌮", ingredients: ["🫓", "🥩", "🧀", "🌶️"], time: 22, points: 90 },
  { id: "soup", name: "Soup", emoji: "🍲", ingredients: ["💧", "🥕", "🥔", "🌿"], time: 32, points: 130 },
  { id: "fries", name: "Fries", emoji: "🍟", ingredients: ["🥔", "🧂"], time: 14, points: 50 },
];

const ALL_INGREDIENTS = ["🍞", "🥩", "🧀", "🥬", "🫓", "🍅", "🍄", "🥒", "🫒", "🍝", "🌿", "🍚", "🐟", "🥑", "🫚", "🌶️", "💧", "🥕", "🥔", "🧂"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let orderIdCounter = 0;
function createOrder(wave) {
  const available = wave === 1 ? MENU.slice(0, 4) : wave === 2 ? MENU.slice(0, 6) : MENU;
  const dish = available[Math.floor(Math.random() * available.length)];
  const timeMultiplier = wave === 1 ? 1.3 : wave === 2 ? 1.0 : 0.8;
  return {
    id: ++orderIdCounter,
    dish: dish,
    timeLeft: Math.round(dish.time * timeMultiplier),
    maxTime: Math.round(dish.time * timeMultiplier),
    status: "waiting",
  };
}

export default function KitchenRush() {
  const [phase, setPhase] = useState("intro");
  const [wave, setWave] = useState(1);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [served, setServed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [gameTime, setGameTime] = useState(90);
  const [shuffledIngredients, setShuffledIngredients] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  const startGame = () => {
    orderIdCounter = 0;
    setPhase("play");
    setWave(1);
    setOrders([createOrder(1), createOrder(1)]);
    setSelectedOrder(null);
    setSelectedIngredients([]);
    setScore(0);
    setCombo(0);
    setServed(0);
    setFailed(0);
    setGameTime(90);
    setShuffledIngredients(shuffleArray(ALL_INGREDIENTS));
    setFeedback(null);
  };

  // Game tick
  useEffect(() => {
    if (phase !== "play") return;
    timerRef.current = setInterval(() => {
      setGameTime((t) => {
        if (t <= 1) {
          setPhase("summary");
          return 0;
        }
        return t - 1;
      });

      setOrders((prev) => {
        let newFailed = 0;
        const updated = prev.map((o) => {
          if (o.status !== "waiting") return o;
          const newTime = o.timeLeft - 1;
          if (newTime <= 0) {
            newFailed++;
            return { ...o, timeLeft: 0, status: "expired" };
          }
          return { ...o, timeLeft: newTime };
        });
        if (newFailed > 0) {
          setFailed((f) => f + newFailed);
          setCombo(0);
        }
        return updated.filter((o) => o.status !== "expired");
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Spawn new orders
  useEffect(() => {
    if (phase !== "play") return;
    const interval = setInterval(() => {
      setOrders((prev) => {
        if (prev.filter((o) => o.status === "waiting").length >= 4) return prev;
        const currentWave = gameTime > 60 ? 1 : gameTime > 30 ? 2 : 3;
        setWave(currentWave);
        return [...prev, createOrder(currentWave)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [phase, gameTime]);

  const selectIngredient = (ing) => {
    if (!selectedOrder) return;
    const order = orders.find((o) => o.id === selectedOrder);
    if (!order) return;
    setSelectedIngredients((prev) => [...prev, ing]);
  };

  const serveDish = () => {
    const order = orders.find((o) => o.id === selectedOrder);
    if (!order) return;

    const required = order.dish.ingredients;
    const isCorrect = required.length === selectedIngredients.length &&
      required.every((ing) => selectedIngredients.includes(ing));

    if (isCorrect) {
      const timeBonus = Math.round((order.timeLeft / order.maxTime) * 50);
      const comboBonus = combo * 15;
      const total = order.dish.points + timeBonus + comboBonus;
      setScore((s) => s + total);
      setCombo((c) => c + 1);
      setServed((s) => s + 1);
      setFeedback({ type: "success", text: `+${total} pts!`, emoji: order.dish.emoji });
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder));
    } else {
      setCombo(0);
      setFeedback({ type: "fail", text: "Wrong ingredients!", emoji: "❌" });
    }

    setSelectedOrder(null);
    setSelectedIngredients([]);
    setTimeout(() => setFeedback(null), 1500);
  };

  const cancelSelection = () => {
    setSelectedOrder(null);
    setSelectedIngredients([]);
  };

  const activeOrders = orders.filter((o) => o.status === "waiting");
  const selectedOrderObj = orders.find((o) => o.id === selectedOrder);
  const stars = served >= 12 ? 3 : served >= 7 ? 2 : served >= 3 ? 1 : 0;

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>CHEF & COOK</div>
            <h1 style={st.title}>⏱️ Kitchen Rush</h1>
            <p style={st.sub}>Customers are waiting! Read their orders, pick the right ingredients, and serve fast. Don't let anyone walk out!</p>
            <div style={st.rules}>
              <div style={st.rule}><span>📋</span><span>Tap an order to start cooking it</span></div>
              <div style={st.rule}><span>🥘</span><span>Select the correct ingredients</span></div>
              <div style={st.rule}><span>⚡</span><span>Serve before the patience timer runs out</span></div>
              <div style={st.rule}><span>🔥</span><span>Build combos for bonus points</span></div>
            </div>
            <button style={st.btn} onClick={startGame}>Open Kitchen →</button>
          </div>
        </div>
      )}

      {phase === "play" && (
        <div style={st.gameWrap}>
          {/* Top bar */}
          <div style={st.topBar}>
            <div style={st.timerChip}>
              <span>⏱️</span>
              <span style={{ ...st.timerNum, color: gameTime <= 15 ? "#E74C3C" : "#374151" }}>{gameTime}s</span>
            </div>
            <div style={st.waveChip}>Wave {wave}/3</div>
            <div style={st.scoreChip}>⭐ {score}</div>
          </div>

          {/* Stats row */}
          <div style={st.statsRow}>
            <span style={st.stat}>✅ {served} served</span>
            <span style={st.stat}>❌ {failed} lost</span>
            {combo > 1 && <span style={{ ...st.stat, color: "#E65100", fontWeight: 800, animation: "popIn 0.3s ease-out" }}>🔥 {combo}x combo</span>}
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{ ...st.feedbackPop, background: feedback.type === "success" ? "#F0FFF4" : "#FFF1F2", borderColor: feedback.type === "success" ? "#A5D6A7" : "#FECDD2", animation: feedback.type === "success" ? "popIn 0.3s ease-out" : "shake 0.3s" }}>
              <span style={{ fontSize: 24 }}>{feedback.emoji}</span>
              <span style={{ fontWeight: 800, color: feedback.type === "success" ? "#27AE60" : "#E74C3C" }}>{feedback.text}</span>
            </div>
          )}

          {/* Orders */}
          <div style={st.sectionLabel}>Orders</div>
          <div style={st.ordersRow}>
            {activeOrders.map((order) => {
              const pct = (order.timeLeft / order.maxTime) * 100;
              const isSelected = selectedOrder === order.id;
              return (
                <button
                  key={order.id}
                  onClick={() => { setSelectedOrder(order.id); setSelectedIngredients([]); }}
                  style={{
                    ...st.orderCard,
                    borderColor: isSelected ? "#E65100" : pct < 30 ? "#FECDD2" : "#E5E7EB",
                    background: isSelected ? "#FFF3E0" : pct < 30 ? "#FFF5F5" : "white",
                    animation: pct < 20 ? "shake 0.5s infinite" : "none",
                  }}
                >
                  <div style={{ fontSize: 28 }}>{order.dish.emoji}</div>
                  <div style={st.orderName}>{order.dish.name}</div>
                  <div style={st.patienceBar}><div style={{ ...st.patienceFill, width: `${pct}%`, background: pct > 50 ? "#27AE60" : pct > 25 ? "#F39C12" : "#E74C3C" }} /></div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: pct > 25 ? "#9CA3AF" : "#E74C3C" }}>{order.timeLeft}s</div>
                </button>
              );
            })}
            {activeOrders.length === 0 && (
              <div style={st.emptyOrders}>No orders right now... enjoy the calm! 😌</div>
            )}
          </div>

          {/* Cooking area */}
          {selectedOrderObj && (
            <div style={st.cookingArea}>
              <div style={st.sectionLabel}>
                Cooking: {selectedOrderObj.dish.emoji} {selectedOrderObj.dish.name}
              </div>

              {/* Required ingredients */}
              <div style={st.recipeRow}>
                <span style={st.recipeLabel}>Need:</span>
                {selectedOrderObj.dish.ingredients.map((ing, i) => (
                  <span key={i} style={{ ...st.recipeDot, background: selectedIngredients.includes(ing) ? "#C8E6C9" : "#F3F4F6" }}>
                    {ing}
                  </span>
                ))}
              </div>

              {/* Selected */}
              <div style={st.selectedRow}>
                <span style={st.recipeLabel}>Your picks:</span>
                {selectedIngredients.length === 0 ? (
                  <span style={st.emptyPicks}>Tap ingredients below</span>
                ) : (
                  selectedIngredients.map((ing, i) => <span key={i} style={st.pickedDot}>{ing}</span>)
                )}
              </div>

              {/* Ingredient grid */}
              <div style={st.ingredientGrid}>
                {shuffledIngredients.map((ing, i) => (
                  <button key={i} onClick={() => selectIngredient(ing)} style={st.ingredientBtn}>
                    {ing}
                  </button>
                ))}
              </div>

              <div style={st.cookActions}>
                <button
                  style={{ ...st.serveBtn, opacity: selectedIngredients.length > 0 ? 1 : 0.4 }}
                  onClick={serveDish}
                  disabled={selectedIngredients.length === 0}
                >
                  🍽️ Serve Dish
                </button>
                <button style={st.cancelBtn} onClick={cancelSelection}>Cancel</button>
              </div>
            </div>
          )}

          {!selectedOrderObj && activeOrders.length > 0 && (
            <div style={st.hintBox}>👆 Tap an order above to start cooking!</div>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>SHIFT OVER</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>
              {stars === 3 ? "Master Chef! 🏆" : stars === 2 ? "Great Cook! 👏" : stars >= 1 ? "Line Cook! 🍳" : "Keep Practicing! 🔪"}
            </h2>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 48, fontWeight: 700, color: "#E65100", margin: "8px 0" }}>{score}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>POINTS EARNED</div>
            <div style={st.summaryStats}>
              <div style={st.summStat}><div style={st.summStatNum}>{served}</div><div style={st.summStatLabel}>Served</div></div>
              <div style={{ width: 1, height: 36, background: "#E5E7EB" }} />
              <div style={st.summStat}><div style={st.summStatNum}>{failed}</div><div style={st.summStatLabel}>Lost</div></div>
            </div>
            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> Professional kitchen chefs work in a "brigade system" — each person has a specific role. The head chef coordinates everything, just like you managed all those orders at once!
            </div>
            <button style={st.btn} onClick={startGame}>Play Again</button>
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

  gameWrap: { maxWidth: 600, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  timerChip: { display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #E5E7EB", padding: "6px 14px", borderRadius: 100 },
  timerNum: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16 },
  waveChip: { fontSize: 13, fontWeight: 800, color: "#6B7280", background: "#F9FAFB", padding: "6px 12px", borderRadius: 100 },
  scoreChip: { background: "#FFF9E6", border: "1.5px solid #F7DC6F", padding: "6px 14px", borderRadius: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#F39C12" },

  statsRow: { display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" },
  stat: { fontSize: 13, fontWeight: 700, color: "#6B7280" },

  feedbackPop: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px", borderRadius: 12, border: "1.5px solid", marginBottom: 10, fontSize: 15, fontFamily: "'Fredoka', sans-serif" },

  sectionLabel: { fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 },

  ordersRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 },
  orderCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 6px", borderRadius: 14, border: "2px solid", cursor: "pointer", background: "white", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s" },
  orderName: { fontSize: 11, fontWeight: 800, color: "#374151" },
  patienceBar: { width: "100%", height: 4, borderRadius: 2, background: "#F3F4F6" },
  patienceFill: { height: "100%", borderRadius: 2, transition: "width 1s linear" },
  emptyOrders: { gridColumn: "1/-1", textAlign: "center", padding: 20, fontSize: 14, fontWeight: 600, color: "#9CA3AF" },

  cookingArea: { background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #FFE0B2", animation: "fadeInUp 0.3s ease-out" },
  recipeRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" },
  recipeLabel: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", marginRight: 4 },
  recipeDot: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1.5px solid #E5E7EB" },
  selectedRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 14, flexWrap: "wrap" },
  emptyPicks: { fontSize: 12, fontWeight: 600, color: "#D1D5DB", fontStyle: "italic" },
  pickedDot: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: "#FFF3E0", border: "1.5px solid #FFE0B2" },

  ingredientGrid: { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5, marginBottom: 14 },
  ingredientBtn: { width: "100%", aspectRatio: "1", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s" },

  cookActions: { display: "flex", gap: 8 },
  serveBtn: { flex: 1, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #27AE60, #1B8A4A)", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "opacity 0.2s" },
  cancelBtn: { padding: "13px 20px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#6B7280", cursor: "pointer" },

  hintBox: { textAlign: "center", padding: 24, fontSize: 15, fontWeight: 600, color: "#9CA3AF" },

  summaryStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 20 },
  summStat: { textAlign: "center" },
  summStatNum: { fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A1A2E" },
  summStatLabel: { fontSize: 11, fontWeight: 700, color: "#9CA3AF" },
  insight: { padding: "14px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, textAlign: "left", marginBottom: 20 },
};
