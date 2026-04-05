"use client";

import { useState } from "react";

const SCENARIOS = [
  {
    id: "cut", name: "Deep Cut", emoji: "🩹", scene: "Your friend fell and has a deep cut on their knee that's bleeding.",
    steps: [
      { q: "First, what should you do?", correct: 0, options: ["Stay calm and assess the injury", "Run away for help immediately", "Pour water on it", "Ignore it"], explain: "Always stay calm first. Panicking makes everything harder!" },
      { q: "How do you stop the bleeding?", correct: 1, options: ["Blow on it", "Apply firm pressure with a clean cloth", "Put ice directly on the wound", "Shake your friend"], explain: "Direct pressure stops bleeding. Use a clean cloth or bandage and press firmly." },
      { q: "What should you NOT do?", correct: 2, options: ["Keep pressure on it", "Call an adult", "Remove the cloth to check every 10 seconds", "Stay with your friend"], explain: "Don't keep removing the cloth — it disrupts clotting. Keep steady pressure for several minutes." },
      { q: "When should you call 911?", correct: 1, options: ["For any small cut", "If bleeding won't stop after 10 minutes of pressure", "Never for cuts", "Only if there's a bone showing"], explain: "If bleeding doesn't stop with 10 minutes of firm pressure, it may need professional medical attention." },
    ],
  },
  {
    id: "burn", name: "Minor Burn", emoji: "🔥", scene: "Someone touched a hot pan in the kitchen and burned their hand.",
    steps: [
      { q: "What's the first thing to do for a burn?", correct: 0, options: ["Run cool (not cold) water over it for 10-20 min", "Put butter on it", "Put ice directly on it", "Cover it with a towel"], explain: "Cool running water is the best immediate treatment. Never use butter or ice — they can make burns worse!" },
      { q: "What should you NOT put on a burn?", correct: 2, options: ["Aloe vera (after cooling)", "A loose bandage", "Toothpaste or butter", "Nothing — let it air dry after cooling"], explain: "Toothpaste, butter, and oil trap heat in the skin. Only use proper burn treatments." },
      { q: "When is a burn serious enough for the ER?", correct: 1, options: ["Any burn on a finger", "Burns larger than your palm, or on face/hands/joints", "Only if there's fire", "Burns never need the ER"], explain: "Large burns, burns on sensitive areas, or burns that blister badly need professional care." },
    ],
  },
  {
    id: "choking", name: "Choking", emoji: "😰", scene: "A child at lunch is coughing hard and grabbing their throat — they might be choking!",
    steps: [
      { q: "They're coughing hard. What should you do first?", correct: 1, options: ["Hit them on the back immediately", "Encourage them to keep coughing", "Give them water", "Lay them down flat"], explain: "If they CAN cough, let them! A strong cough is the body's best way to clear a blockage." },
      { q: "They stopped coughing and can't breathe. Now what?", correct: 0, options: ["Call 911 and give back blows", "Wait to see if it gets better", "Give them food to push it down", "Tell them to swallow hard"], explain: "If coughing stops and they can't breathe, this is an emergency. Call 911 and begin first aid immediately." },
      { q: "How many back blows should you give?", correct: 2, options: ["1 really hard one", "3 gentle ones", "5 firm blows between the shoulder blades", "10 quick pats"], explain: "Give 5 firm back blows between the shoulder blades, then check. If still choking, give 5 abdominal thrusts." },
    ],
  },
  {
    id: "sprain", name: "Twisted Ankle", emoji: "🦵", scene: "During soccer, your teammate twisted their ankle and it's starting to swell.",
    steps: [
      { q: "What does R.I.C.E. stand for?", correct: 0, options: ["Rest, Ice, Compression, Elevation", "Run, Inspect, Clean, Exercise", "Rest, Ignore, Cover, Eat", "Reduce, Inflate, Cool, Expose"], explain: "R.I.C.E. is the gold standard for treating sprains: Rest, Ice, Compression, Elevation!" },
      { q: "How should you apply ice?", correct: 1, options: ["Directly on skin for 1 hour", "Wrapped in a cloth for 15-20 minutes", "Only at night", "Only if there's bruising"], explain: "Never put ice directly on skin — it can cause frostbite. Wrap in a towel and apply for 15-20 minutes." },
      { q: "What does Elevation mean?", correct: 2, options: ["Stand on the injured foot", "Walk it off", "Raise the injured ankle above heart level", "Keep it hanging down"], explain: "Raising the injury above your heart helps reduce swelling by letting fluid drain away." },
    ],
  },
  {
    id: "nosebleed", name: "Nosebleed", emoji: "🩸", scene: "A classmate suddenly gets a nosebleed during class.",
    steps: [
      { q: "What position should they be in?", correct: 1, options: ["Lying flat on their back", "Sitting up and leaning slightly forward", "Hanging upside down", "Standing and looking up"], explain: "Lean FORWARD, not back! Leaning back makes blood flow into the throat which can cause nausea." },
      { q: "What should they do with their nose?", correct: 0, options: ["Pinch the soft part firmly for 10 minutes", "Stuff tissue up the nostril", "Blow their nose hard", "Put ice inside the nostril"], explain: "Pinch the soft part of the nose (not the bone) firmly. Hold for a full 10 minutes without checking." },
      { q: "When should you seek medical help?", correct: 2, options: ["All nosebleeds need a doctor", "Only if it's the first one ever", "If it doesn't stop after 20 minutes", "Never — nosebleeds always stop on their own"], explain: "Most nosebleeds stop within 15-20 minutes. If it continues, or happens after a head injury, seek medical help." },
    ],
  },
];

export default function FirstAidHero() {
  const [phase, setPhase] = useState("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [scenarioScore, setScenarioScore] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const step = scenario?.steps[stepIdx];

  const answer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === step.correct) {
      setScore((s) => s + 20);
      setScenarioScore((s) => s + 1);
    }
  };

  const nextStep = () => {
    if (stepIdx >= scenario.steps.length - 1) {
      setResults((r) => [...r, { name: scenario.name, emoji: scenario.emoji, correct: scenarioScore + (selected === step.correct ? 0 : 0), total: scenario.steps.length, score: scenarioScore }]);
      if (scenarioIdx >= SCENARIOS.length - 1) { setPhase("summary"); return; }
      setScenarioIdx((i) => i + 1);
      setStepIdx(0);
      setScenarioScore(0);
    } else {
      setStepIdx((i) => i + 1);
    }
    setSelected(null);
  };

  const restart = () => { setPhase("intro"); setScenarioIdx(0); setStepIdx(0); setSelected(null); setScore(0); setResults([]); setScenarioScore(0); };
  const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;

  return (
    <div style={st.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {phase === "intro" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>MEDICAL DOCTOR</div>
            <h1 style={st.title}>🏥 First Aid Hero</h1>
            <p style={st.sub}>Learn real first aid skills! Handle emergencies correctly and you could save a real life someday.</p>
            <div style={st.rules}>
              <div style={st.rule}><span>🚨</span><span>5 emergency scenarios</span></div>
              <div style={st.rule}><span>💡</span><span>Learn the right response for each situation</span></div>
              <div style={st.rule}><span>🩺</span><span>Real medical knowledge you can actually use</span></div>
            </div>
            <button style={st.btn} onClick={() => setPhase("play")}>Start Training →</button>
          </div>
        </div>
      )}

      {phase === "play" && step && (
        <div style={st.gameWrap}>
          <div style={st.topBar}>
            <div style={st.scenarioChip}>{scenario.emoji} Scenario {scenarioIdx + 1}/{SCENARIOS.length}</div>
            <div style={st.scoreChip}>⭐ {score}</div>
          </div>

          {stepIdx === 0 && (
            <div style={st.sceneCard}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{scenario.emoji}</div>
              <h2 style={st.sceneName}>{scenario.name}</h2>
              <p style={st.sceneDesc}>{scenario.scene}</p>
            </div>
          )}

          <div style={st.questionCard}>
            <div style={st.qNum}>Question {stepIdx + 1} of {scenario.steps.length}</div>
            <h3 style={st.qText}>{step.q}</h3>

            <div style={st.optList}>
              {step.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === step.correct;
                const showResult = selected !== null;
                return (
                  <button key={i} onClick={() => answer(i)} disabled={selected !== null} style={{
                    ...st.optBtn,
                    borderColor: showResult ? (isCorrect ? "#27AE60" : isSelected ? "#E74C3C" : "#E5E7EB") : isSelected ? "#1565C0" : "#E5E7EB",
                    background: showResult ? (isCorrect ? "#F0FFF4" : isSelected && !isCorrect ? "#FFF1F2" : "white") : "white",
                  }}>
                    <span style={st.optLetter}>{String.fromCharCode(65 + i)}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {showResult && isCorrect && <span>✅</span>}
                    {showResult && isSelected && !isCorrect && <span>❌</span>}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div style={{ ...st.explainBox, borderColor: selected === step.correct ? "#A5D6A7" : "#FFCDD2", background: selected === step.correct ? "#F0FFF4" : "#FFF8F8" }}>
                <strong>{selected === step.correct ? "✅ Correct!" : "❌ Not quite."}</strong> {step.explain}
              </div>
            )}

            {selected !== null && (
              <button style={st.btn} onClick={nextStep}>
                {stepIdx >= scenario.steps.length - 1 ? (scenarioIdx >= SCENARIOS.length - 1 ? "See Results" : "Next Scenario →") : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>TRAINING COMPLETE</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>{stars === 3 ? "First Aid Expert! 🏆" : stars === 2 ? "Quick Responder! 👏" : "Keep Learning! 📚"}</h2>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#1565C0", margin: "8px 0" }}>{score}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>POINTS EARNED</div>
            {results.map((r, i) => (
              <div key={i} style={st.summRow}><span>{r.emoji}</span><span style={{ flex: 1, fontWeight: 700, color: "#374151" }}>{r.name}</span><span style={{ fontSize: 13, color: "#9CA3AF" }}>{r.score}/{r.total}</span></div>
            ))}
            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> Doctors and paramedics train for years in emergency medicine. But basic first aid can be learned by anyone — and it saves thousands of lives every year. Consider taking a first aid course at your local Red Cross!
            </div>
            <button style={st.btn} onClick={restart}>Train Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #E3F2FD 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(21,101,192,0.08)", border: "2px solid #E3F2FD", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#E3F2FD", color: "#1565C0", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  rules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 },
  rule: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F8FBFF", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1565C0, #0D47A1)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(21,101,192,0.25)", marginTop: 12 },

  gameWrap: { maxWidth: 580, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  scenarioChip: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#374151" },
  scoreChip: { background: "#FFF9E6", border: "1.5px solid #F7DC6F", padding: "6px 14px", borderRadius: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#F39C12" },

  sceneCard: { background: "#FFF3E0", borderRadius: 18, padding: "24px 20px", textAlign: "center", marginBottom: 14, border: "1.5px solid #FFE0B2" },
  sceneName: { fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#E65100", marginBottom: 6 },
  sceneDesc: { fontSize: 14, fontWeight: 600, color: "#BF360C", lineHeight: 1.5 },

  questionCard: { background: "white", borderRadius: 18, padding: "24px 20px", border: "1.5px solid #E3F2FD", animation: "fadeInUp 0.4s ease-out" },
  qNum: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  qText: { fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 16, lineHeight: 1.3 },

  optList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  optBtn: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, border: "2px solid", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600, color: "#374151", transition: "all 0.2s", textAlign: "left", background: "white", width: "100%" },
  optLetter: { width: 28, height: 28, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 13, color: "#6B7280", flexShrink: 0 },

  explainBox: { padding: "14px 16px", borderRadius: 14, border: "1.5px solid", fontSize: 13, fontWeight: 600, color: "#374151", lineHeight: 1.6, marginBottom: 8 },

  summRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: 12, marginBottom: 6, fontSize: 14 },
  insight: { padding: "14px 16px", background: "#E3F2FD", border: "1.5px solid #BBDEFB", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#0D47A1", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
};
