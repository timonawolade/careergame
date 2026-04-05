"use client";

import { useState } from "react";

const gd = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #EDE7F6 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(74,20,140,0.08)", border: "2px solid #EDE7F6", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#EDE7F6", color: "#4A148C", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #4A148C, #311B92)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(74,20,140,0.25)" },
  insight: { padding: "14px 16px", background: "#EDE7F6", border: "1.5px solid #D1C4E9", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#4A148C", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
  gameWrap: { maxWidth: 580, margin: "0 auto", padding: "12px 16px 40px" },
};

// ──── LEVEL BUILDER ────
const ELEMENTS = [
  { id: "platform", emoji: "🟫", name: "Platform", color: "#8D6E63" },
  { id: "coin", emoji: "🪙", name: "Coin", color: "#FDD835" },
  { id: "enemy", emoji: "👾", name: "Enemy", color: "#E53935" },
  { id: "spike", emoji: "⬆️", name: "Spike", color: "#F44336" },
  { id: "spring", emoji: "🔵", name: "Spring", color: "#42A5F5" },
  { id: "goal", emoji: "🚩", name: "Goal Flag", color: "#4CAF50" },
  { id: "heart", emoji: "❤️", name: "Health", color: "#E91E63" },
  { id: "key", emoji: "🔑", name: "Key", color: "#FF9800" },
];

function LevelBuilder() {
  const [phase, setPhase] = useState("intro");
  const [grid, setGrid] = useState(Array(8).fill(null).map(() => Array(12).fill(null)));
  const [selectedTool, setSelectedTool] = useState("platform");
  const [erasing, setErasing] = useState(false);

  const placeElement = (row, col) => {
    setGrid(g => {
      const ng = g.map(r => [...r]);
      ng[row][col] = erasing ? null : selectedTool;
      return ng;
    });
  };

  const clearAll = () => setGrid(Array(8).fill(null).map(() => Array(12).fill(null)));

  const countElements = () => {
    let counts = {};
    grid.forEach(row => row.forEach(cell => { if (cell) counts[cell] = (counts[cell] || 0) + 1; }));
    return counts;
  };

  const evaluate = () => {
    const c = countElements();
    let score = 0, feedback = [];
    if (c.platform >= 5) { score += 20; feedback.push("✅ Good platform layout"); } else feedback.push("⚠️ Add more platforms for playability");
    if (c.coin >= 3) { score += 15; feedback.push("✅ Coins give players goals"); } else feedback.push("⚠️ Add coins for players to collect");
    if (c.enemy >= 1) { score += 15; feedback.push("✅ Enemies add challenge"); } else feedback.push("💡 Try adding enemies for difficulty");
    if (c.goal >= 1) { score += 20; feedback.push("✅ Goal flag placed!"); } else feedback.push("❌ Every level needs a goal!");
    if (Object.keys(c).length >= 4) { score += 15; feedback.push("✅ Good variety of elements"); }
    const total = grid.flat().filter(Boolean).length;
    if (total >= 10 && total <= 30) { score += 15; feedback.push("✅ Good density — not too empty, not too crowded"); }
    return { score, feedback };
  };

  const [result, setResult] = useState(null);

  return (
    <div style={gd.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={gd.center}><div style={gd.card}>
          <div style={gd.badge}>GAME DESIGNER</div>
          <h1 style={gd.title}>🗺️ Level Builder</h1>
          <p style={gd.sub}>Design a platformer level! Place platforms, enemies, coins, and a goal flag. Then get feedback on your design.</p>
          <button style={gd.btn} onClick={() => setPhase("build")}>Start Designing →</button>
        </div></div>
      )}
      {phase === "build" && !result && (
        <div style={gd.gameWrap}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {ELEMENTS.map(el => (
              <button key={el.id} onClick={() => { setSelectedTool(el.id); setErasing(false); }} style={{ padding: "8px 12px", borderRadius: 10, border: `2px solid ${selectedTool === el.id && !erasing ? el.color : "#E5E7EB"}`, background: selectedTool === el.id && !erasing ? `${el.color}15` : "white", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                <span>{el.emoji}</span><span>{el.name}</span>
              </button>
            ))}
            <button onClick={() => setErasing(true)} style={{ padding: "8px 12px", borderRadius: 10, border: `2px solid ${erasing ? "#E74C3C" : "#E5E7EB"}`, background: erasing ? "#FFF1F2" : "white", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>🗑️ Eraser</button>
          </div>

          <div style={{ background: "#1A1A2E", borderRadius: 14, padding: 8, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
              {grid.map((row, r) => row.map((cell, c) => {
                const el = ELEMENTS.find(e => e.id === cell);
                return (
                  <div key={`${r}-${c}`} onClick={() => placeElement(r, c)} style={{ aspectRatio: "1", background: el ? `${el.color}30` : r === 7 ? "#5D4037" : "#2C2C54", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", border: `1px solid ${el ? el.color : "#3A3A60"}40` }}>
                    {el?.emoji || ""}
                  </div>
                );
              }))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...gd.btn, flex: 1 }} onClick={() => setResult(evaluate())}>🎯 Evaluate Level</button>
            <button onClick={clearAll} style={{ padding: "15px 20px", borderRadius: 14, border: "1.5px solid #FECDD2", background: "#FFF1F2", cursor: "pointer", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "#E74C3C", fontSize: 13 }}>Clear</button>
          </div>
        </div>
      )}
      {result && (
        <div style={gd.center}><div style={gd.card}>
          <div style={gd.badge}>LEVEL REVIEW</div>
          <h2 style={gd.title}>Score: {result.score}/100 {result.score >= 80 ? "🌟" : result.score >= 50 ? "👍" : "💪"}</h2>
          <div style={{ textAlign: "left", marginBottom: 20 }}>
            {result.feedback.map((f, i) => (
              <div key={i} style={{ padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 13, fontWeight: 600, color: "#374151" }}>{f}</div>
            ))}
          </div>
          <div style={gd.insight}><strong>🎓 Career Insight:</strong> Game level designers use "playtesting" — watching real people play their levels to find what's fun and what's frustrating. Great design is iterative!</div>
          <button style={gd.btn} onClick={() => { setResult(null); clearAll(); }}>Design Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── PIXEL ART STUDIO ────
function PixelArt() {
  const SIZE = 16;
  const [grid, setGrid] = useState(Array(SIZE).fill(null).map(() => Array(SIZE).fill("#FFFFFF")));
  const [color, setColor] = useState("#E53935");
  const [phase, setPhase] = useState("intro");

  const PALETTE = ["#E53935", "#FF9800", "#FDD835", "#43A047", "#1E88E5", "#5E35B1", "#F48FB1", "#8D6E63", "#000000", "#FFFFFF", "#FFB74D", "#80CBC4", "#9E9E9E", "#FFCC80", "#90CAF9", "#CE93D8"];

  const paint = (r, c) => { setGrid(g => { const n = g.map(row => [...row]); n[r][c] = color; return n; }); };

  return (
    <div style={gd.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={gd.center}><div style={gd.card}>
          <div style={gd.badge}>GAME DESIGNER</div>
          <h1 style={gd.title}>🎨 Pixel Art Studio</h1>
          <p style={gd.sub}>Create game characters and items pixel by pixel! Every game starts with art — design your game's visual style.</p>
          <button style={gd.btn} onClick={() => setPhase("draw")}>Start Drawing →</button>
        </div></div>
      )}
      {phase === "draw" && (
        <div style={gd.gameWrap}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 12 }}>🎨 Draw Your Character</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {PALETTE.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 6, background: c, border: color === c ? "3px solid #1A1A2E" : "2px solid #E5E7EB", cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 14, padding: 6, display: "inline-block", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 1 }}>
              {grid.map((row, r) => row.map((cell, c) => (
                <div key={`${r}-${c}`} onClick={() => paint(r, c)} style={{ width: 22, height: 22, background: cell, border: "1px solid #E5E7EB", cursor: "crosshair" }} />
              )))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setGrid(Array(SIZE).fill(null).map(() => Array(SIZE).fill("#FFFFFF")))} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#6B7280" }}>🗑️ Clear</button>
          </div>
          <div style={{ ...gd.insight, marginTop: 16 }}><strong>🎓 Career Insight:</strong> Many beloved games use pixel art! Indie developers often create all art themselves. Tools like Aseprite and Piskel are used by professional pixel artists.</div>
        </div>
      )}
    </div>
  );
}

// ──── CODE QUEST ────
const PUZZLES = [
  { q: "A character needs to walk 3 steps forward. Which code is correct?", options: ["move(3)", "jump(3)", "turn(3)", "stop(3)"], correct: 0, concept: "Functions", explain: "move(3) tells the character to take 3 steps forward. The number in parentheses is called a 'parameter'." },
  { q: "You want to collect ALL 5 coins. Which loop is right?", options: ["repeat 5 times: collect()", "collect() once", "if coin: collect()", "repeat 3 times: collect()"], correct: 0, concept: "Loops", explain: "A loop repeats code multiple times. 'repeat 5 times' runs the collect action exactly 5 times." },
  { q: "There's a wall ahead. What should the code do?", options: ["Always jump", "if wall_ahead: jump()", "turn_left()", "do nothing"], correct: 1, concept: "Conditionals", explain: "An IF statement checks a condition before acting. 'if wall_ahead' only jumps when there's actually a wall." },
  { q: "To make a character walk in a square, what's the pattern?", options: ["repeat 4 times: move(3), turn_right()", "move(12)", "turn_right(4)", "repeat 2 times: move(6)"], correct: 0, concept: "Patterns", explain: "A square has 4 sides — so repeat 4 times: walk forward then turn right 90 degrees." },
  { q: "How do you make the character keep moving until it reaches the flag?", options: ["move(100)", "while not at_flag: move(1)", "if flag: stop()", "repeat 5: move(1)"], correct: 1, concept: "While Loops", explain: "A WHILE loop keeps running until a condition is met. 'while not at_flag' moves until you reach the goal." },
  { q: "You need to sort items: keys go left, coins go right. What concept is this?", options: ["Looping", "Conditional branching", "Variables", "Functions"], correct: 1, concept: "Branching", explain: "Conditional branching makes different decisions based on what type of item you have — like a sorting machine!" },
];

function CodeQuest() {
  const [phase, setPhase] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const puzzle = PUZZLES[idx];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === puzzle.correct) setScore(s => s + 20);
    setResults(r => [...r, { concept: puzzle.concept, correct: i === puzzle.correct }]);
  };

  const next = () => {
    if (idx >= PUZZLES.length - 1) { setPhase("summary"); return; }
    setIdx(i => i + 1); setSelected(null);
  };

  const restart = () => { setPhase("intro"); setIdx(0); setSelected(null); setScore(0); setResults([]); };
  const stars = score >= 100 ? 3 : score >= 60 ? 2 : 1;

  return (
    <div style={gd.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={gd.center}><div style={gd.card}>
          <div style={gd.badge}>GAME DESIGNER</div>
          <h1 style={gd.title}>💻 Code Quest</h1>
          <p style={gd.sub}>Solve coding puzzles! Learn the building blocks of programming — loops, conditions, and functions.</p>
          <button style={gd.btn} onClick={() => setPhase("play")}>Start Coding →</button>
        </div></div>
      )}
      {phase === "play" && puzzle && (
        <div style={gd.gameWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15 }}>Puzzle {idx + 1}/6</span>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#4A148C" }}>⭐ {score}</span>
          </div>
          <div style={{ background: "#1A1A2E", borderRadius: 16, padding: "20px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7C4DFF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Concept: {puzzle.concept}</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.4 }}>{puzzle.q}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {puzzle.options.map((opt, i) => (
              <button key={i} onClick={() => answer(i)} disabled={selected !== null} style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${selected !== null ? (i === puzzle.correct ? "#27AE60" : selected === i ? "#E74C3C" : "#E5E7EB") : "#E5E7EB"}`, background: selected !== null ? (i === puzzle.correct ? "#F0FFF4" : selected === i ? "#FFF1F2" : "white") : "white", cursor: "pointer", fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 600, color: "#374151", textAlign: "left" }}>
                <code style={{ background: "#F3F4F6", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", fontSize: 14 }}>{opt}</code>
              </button>
            ))}
          </div>
          {selected !== null && (
            <div style={{ padding: "14px 16px", background: selected === puzzle.correct ? "#F0FFF4" : "#FFF8F8", border: `1.5px solid ${selected === puzzle.correct ? "#A5D6A7" : "#FFCDD2"}`, borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#374151", lineHeight: 1.6, marginBottom: 12, animation: "fadeInUp 0.3s ease-out" }}>
              <strong>{selected === puzzle.correct ? "✅ Correct!" : "❌ Not quite."}</strong> {puzzle.explain}
            </div>
          )}
          {selected !== null && <button style={gd.btn} onClick={next}>{idx >= PUZZLES.length - 1 ? "See Results" : "Next Puzzle →"}</button>}
        </div>
      )}
      {phase === "summary" && (
        <div style={gd.center}><div style={gd.card}>
          <div style={gd.badge}>QUEST COMPLETE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={gd.title}>{stars === 3 ? "Code Master! 🏆" : stars === 2 ? "Programmer! 👨‍💻" : "Beginner! 📚"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#4A148C", margin: "8px 0" }}>{score}</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 14 }}>
              <span>{r.correct ? "✅" : "❌"}</span><span style={{ fontWeight: 700, color: "#374151" }}>{r.concept}</span>
            </div>
          ))}
          <div style={gd.insight}><strong>🎓 Career Insight:</strong> Game designers use programming languages like C#, Python, and JavaScript to bring their ideas to life. The concepts you just learned — loops, conditions, functions — are the foundation of ALL programming!</div>
          <button style={gd.btn} onClick={restart}>Play Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── EXPORT SELECTOR ────
export default function GameDesigner() {
  const [game, setGame] = useState(null);
  if (game === "level") return <LevelBuilder />;
  if (game === "pixel") return <PixelArt />;
  if (game === "code") return <CodeQuest />;
  return (
    <div style={gd.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={gd.center}><div style={{ ...gd.card, maxWidth: 520 }}>
        <div style={gd.badge}>GAME DESIGNER</div>
        <h1 style={{ ...gd.title, fontSize: 26 }}>🎮 Game Designer Games</h1>
        <p style={gd.sub}>Choose a game to play:</p>
        {[
          { id: "level", name: "Level Builder", emoji: "🗺️", desc: "Design a platformer level" },
          { id: "pixel", name: "Pixel Art Studio", emoji: "🎨", desc: "Create game characters pixel by pixel" },
          { id: "code", name: "Code Quest", emoji: "💻", desc: "Solve coding logic puzzles" },
        ].map(g => (
          <button key={g.id} onClick={() => setGame(g.id)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", borderRadius: 16, border: "2px solid #EDE7F6", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", marginBottom: 10, textAlign: "left" }}>
            <span style={{ fontSize: 28 }}>{g.emoji}</span>
            <div><div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>{g.name}</div><div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>{g.desc}</div></div>
          </button>
        ))}
      </div></div>
    </div>
  );
}
