"use client";

import { useState } from "react";

const SURGERIES = [
  {
    id: "appendix", name: "Appendix Removal", emoji: "🏥", difficulty: "Medium",
    description: "The patient has appendicitis — the appendix is inflamed and needs to be removed safely.",
    steps: [
      { name: "Wash & Sanitize Hands", emoji: "🧼", tip: "Surgeons scrub for 3-5 minutes to kill all germs" },
      { name: "Put on Sterile Gloves", emoji: "🧤", tip: "Double gloving reduces infection risk by 80%" },
      { name: "Administer Anesthesia", emoji: "💉", tip: "Anesthesiologists are doctors who specialize in keeping patients asleep and pain-free" },
      { name: "Sterilize the Surgical Area", emoji: "🧴", tip: "Iodine solution is commonly used to clean the skin before surgery" },
      { name: "Make the Incision", emoji: "🔪", tip: "Modern appendectomies use 3 tiny incisions instead of one big one (laparoscopic surgery)" },
      { name: "Locate the Appendix", emoji: "🔍", tip: "The appendix is a small, finger-shaped pouch attached to the large intestine" },
      { name: "Remove the Appendix", emoji: "✂️", tip: "The appendix is clamped, cut, and carefully removed" },
      { name: "Close the Incision", emoji: "🪡", tip: "Surgeons use stitches, staples, or surgical glue to close wounds" },
      { name: "Apply Bandage", emoji: "🩹", tip: "Sterile dressings protect the wound while it heals" },
      { name: "Move to Recovery", emoji: "🛏️", tip: "Most patients go home the same day after laparoscopic appendectomy!" },
    ],
  },
  {
    id: "fracture", name: "Broken Bone Repair", emoji: "🦴", difficulty: "Easy",
    description: "The patient broke their arm. We need to set the bone properly so it heals straight.",
    steps: [
      { name: "Take an X-Ray", emoji: "📷", tip: "X-rays use electromagnetic radiation to see through soft tissue and show bones" },
      { name: "Wash & Sanitize Hands", emoji: "🧼", tip: "Hand hygiene prevents post-surgical infections" },
      { name: "Administer Pain Relief", emoji: "💊", tip: "Local anesthesia numbs just the injured area" },
      { name: "Align the Bone Fragments", emoji: "🦴", tip: "This is called 'reduction' — setting the bone back in its correct position" },
      { name: "Apply the Cast", emoji: "🩹", tip: "Plaster or fiberglass casts hold bones in place for 4-8 weeks while they heal" },
      { name: "Take Follow-up X-Ray", emoji: "📷", tip: "A second X-ray confirms the bone is properly aligned inside the cast" },
      { name: "Give Recovery Instructions", emoji: "📋", tip: "Patients learn how to care for their cast and when to come back for a check-up" },
    ],
  },
  {
    id: "heart", name: "Heart Valve Repair", emoji: "❤️", difficulty: "Hard",
    description: "A heart valve isn't closing properly. This complex surgery requires extreme precision.",
    steps: [
      { name: "Review Heart Scans", emoji: "🖥️", tip: "Echocardiograms use sound waves to create images of the heart" },
      { name: "Full Surgical Scrub", emoji: "🧼", tip: "Heart surgery scrub protocol takes 5+ minutes" },
      { name: "Connect Heart-Lung Machine", emoji: "⚙️", tip: "This machine temporarily does the heart's job, pumping blood while the heart is stopped" },
      { name: "Administer General Anesthesia", emoji: "💉", tip: "The patient is completely unconscious during open heart surgery" },
      { name: "Make Chest Incision", emoji: "🔪", tip: "A sternotomy opens the chest through the breastbone" },
      { name: "Stop the Heart Temporarily", emoji: "❤️", tip: "A special cold solution stops the heart so surgeons can work on it" },
      { name: "Repair the Valve", emoji: "🪡", tip: "Surgeons may repair the existing valve or replace it with an artificial one" },
      { name: "Restart the Heart", emoji: "⚡", tip: "The heart is gently warmed and electrical impulses restart its beating" },
      { name: "Disconnect Heart-Lung Machine", emoji: "⚙️", tip: "Once the heart beats steadily on its own, the machine is turned off" },
      { name: "Close the Chest", emoji: "🪡", tip: "Steel wires hold the breastbone together while it heals over 6-8 weeks" },
      { name: "Move to ICU", emoji: "🏥", tip: "Heart surgery patients spend 1-3 days in the Intensive Care Unit" },
    ],
  },
];

export default function SurgerySimulator() {
  const [phase, setPhase] = useState("intro");
  const [surgIdx, setSurgIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const surgery = SURGERIES[surgIdx];

  const startSurgery = () => {
    const shuffled = [...surgery.steps].sort(() => Math.random() - 0.5);
    setScrambled(shuffled);
    setPlaced([]);
    setStepIdx(0);
    setShowTip(false);
    setPhase("play");
  };

  const selectStep = (step) => {
    const correctStep = surgery.steps[placed.length];
    if (step.name === correctStep.name) {
      setPlaced((p) => [...p, step]);
      setScrambled((s) => s.filter((x) => x.name !== step.name));
      setScore((s) => s + 15);
      setShowTip(true);
      if (placed.length + 1 >= surgery.steps.length) {
        setResults((r) => [...r, { name: surgery.name, emoji: surgery.emoji, perfect: true }]);
      }
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
  };

  const nextAction = () => {
    setShowTip(false);
    if (placed.length >= surgery.steps.length) {
      if (surgIdx >= SURGERIES.length - 1) {
        setPhase("summary");
      } else {
        setSurgIdx((i) => i + 1);
        setTimeout(() => startSurgery(), 100);
      }
    }
  };

  const restart = () => { setPhase("intro"); setSurgIdx(0); setScore(0); setResults([]); setPlaced([]); };
  const stars = score >= 120 ? 3 : score >= 70 ? 2 : 1;
  const progress = surgery ? (placed.length / surgery.steps.length) * 100 : 0;

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
            <h1 style={st.title}>🔬 Surgery Simulator</h1>
            <p style={st.sub}>Put surgical steps in the correct order. One wrong move could be dangerous — precision is everything!</p>
            <div style={st.rules}>
              <div style={st.rule}><span>📋</span><span>Steps are scrambled — put them in order</span></div>
              <div style={st.rule}><span>✅</span><span>Correct order = points. Wrong picks lose points</span></div>
              <div style={st.rule}><span>💡</span><span>Learn a real medical fact at each step</span></div>
              <div style={st.rule}><span>🏥</span><span>3 procedures: Easy → Medium → Hard</span></div>
            </div>
            <button style={st.btn} onClick={startSurgery}>Scrub In →</button>
          </div>
        </div>
      )}

      {phase === "play" && surgery && (
        <div style={st.gameWrap}>
          <div style={st.topBar}>
            <div style={st.surgChip}>{surgery.emoji} {surgery.name}</div>
            <div style={st.scoreChip}>⭐ {score}</div>
          </div>

          <div style={st.progressOuter}><div style={{ ...st.progressInner, width: `${progress}%` }} /></div>

          <p style={st.surgDesc}>{surgery.description}</p>

          {/* Placed steps */}
          <div style={st.sectionLabel}>Completed Steps</div>
          <div style={st.placedList}>
            {placed.map((s, i) => (
              <div key={i} style={st.placedStep}>
                <span style={st.placedNum}>{i + 1}</span>
                <span style={st.placedEmoji}>{s.emoji}</span>
                <span style={st.placedName}>{s.name}</span>
                <span style={{ color: "#27AE60" }}>✓</span>
              </div>
            ))}
          </div>

          {/* Current tip */}
          {showTip && placed.length > 0 && (
            <div style={st.tipBox}>
              💡 <strong>Did you know?</strong> {placed[placed.length - 1].tip}
              <button style={st.tipBtn} onClick={nextAction}>
                {placed.length >= surgery.steps.length ? (surgIdx >= SURGERIES.length - 1 ? "See Results" : "Next Surgery →") : "Continue"}
              </button>
            </div>
          )}

          {/* Available steps to pick from */}
          {!showTip && scrambled.length > 0 && (
            <>
              <div style={st.sectionLabel}>What's the next step?</div>
              <div style={st.scrambledList}>
                {scrambled.map((s) => (
                  <button key={s.name} onClick={() => selectStep(s)} style={st.scrambledBtn}>
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <span style={st.scrambledName}>{s.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div style={st.center}>
          <div style={st.card}>
            <div style={st.badge}>SURGERIES COMPLETE</div>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <h2 style={st.title}>{stars === 3 ? "Chief Surgeon! 🏆" : stars === 2 ? "Resident! 👨‍⚕️" : "Intern! 📚"}</h2>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#1565C0", margin: "8px 0" }}>{score}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>POINTS</div>
            {results.map((r, i) => (
              <div key={i} style={st.summRow}><span>{r.emoji}</span><span style={{ flex: 1, fontWeight: 700 }}>{r.name}</span><span>✅</span></div>
            ))}
            <div style={st.insight}>
              <strong>🎓 Career Insight:</strong> Surgeons train for 13-16 years after high school! They start with 4 years of college, 4 years of medical school, and then 5-8 years of surgical residency. It's one of the longest training paths of any career.
            </div>
            <button style={st.btn} onClick={restart}>Play Again</button>
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
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1565C0, #0D47A1)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer" },

  gameWrap: { maxWidth: 580, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  surgChip: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#374151" },
  scoreChip: { background: "#FFF9E6", border: "1.5px solid #F7DC6F", padding: "6px 14px", borderRadius: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#F39C12" },

  progressOuter: { height: 6, borderRadius: 3, background: "#E3F2FD", marginBottom: 14 },
  progressInner: { height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #1565C0, #42A5F5)", transition: "width 0.5s" },

  surgDesc: { fontSize: 14, fontWeight: 600, color: "#6B7280", lineHeight: 1.5, marginBottom: 16, padding: "0 4px" },
  sectionLabel: { fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 8, marginTop: 12 },

  placedList: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 },
  placedStep: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F0FFF4", borderRadius: 10, fontSize: 13, fontWeight: 600 },
  placedNum: { width: 22, height: 22, borderRadius: 6, background: "#27AE60", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 },
  placedEmoji: { fontSize: 16 },
  placedName: { flex: 1, color: "#374151" },

  tipBox: { padding: "16px 18px", background: "#E3F2FD", border: "1.5px solid #BBDEFB", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#0D47A1", lineHeight: 1.6, marginBottom: 8 },
  tipBtn: { display: "block", width: "100%", marginTop: 12, padding: "11px", borderRadius: 10, border: "none", background: "#1565C0", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" },

  scrambledList: { display: "flex", flexDirection: "column", gap: 6 },
  scrambledBtn: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 14, border: "2px solid #E5E7EB", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all 0.2s", width: "100%", textAlign: "left" },
  scrambledName: { fontSize: 14, fontWeight: 700, color: "#374151" },

  summRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: 12, marginBottom: 6, fontSize: 14 },
  insight: { padding: "14px 16px", background: "#E3F2FD", border: "1.5px solid #BBDEFB", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#0D47A1", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
};
