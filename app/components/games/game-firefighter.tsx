"use client";

import { useState, useEffect, useRef } from "react";

const ff = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #FFEBEE 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(198,40,40,0.08)", border: "2px solid #FFEBEE", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#FFEBEE", color: "#C62828", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #C62828, #B71C1C)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(198,40,40,0.25)" },
  insight: { padding: "14px 16px", background: "#FFEBEE", border: "1.5px solid #FFCDD2", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#B71C1C", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
  gameWrap: { maxWidth: 580, margin: "0 auto", padding: "12px 16px 40px" },
};

// ──── RESCUE MISSION ────
const BUILDINGS = [
  {
    name: "Apartment Building", floors: 4, emoji: "🏢",
    rooms: [
      { floor: 4, room: "4A", hasPerson: true, hazard: "smoke", person: "👧 Girl with teddy bear" },
      { floor: 3, room: "3B", hasPerson: false, hazard: "fire", person: null },
      { floor: 3, room: "3A", hasPerson: true, hazard: "none", person: "👴 Elderly man" },
      { floor: 2, room: "2A", hasPerson: false, hazard: "smoke", person: null },
      { floor: 2, room: "2B", hasPerson: true, hazard: "smoke", person: "🐕 Family with dog" },
      { floor: 1, room: "1A", hasPerson: false, hazard: "none", person: null },
    ],
  },
  {
    name: "Office Building", floors: 3, emoji: "🏬",
    rooms: [
      { floor: 3, room: "Conference", hasPerson: true, hazard: "fire", person: "👩‍💼 3 workers" },
      { floor: 2, room: "Server Room", hasPerson: false, hazard: "fire", person: null },
      { floor: 2, room: "Office 2B", hasPerson: true, hazard: "smoke", person: "👨‍💼 Manager" },
      { floor: 1, room: "Lobby", hasPerson: true, hazard: "none", person: "👨‍🔧 Security guard" },
    ],
  },
];

function RescueMission() {
  const [phase, setPhase] = useState("intro");
  const [buildingIdx, setBuildingIdx] = useState(0);
  const [rescued, setRescued] = useState([]);
  const [checked, setChecked] = useState([]);
  const [oxygen, setOxygen] = useState(100);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  const building = BUILDINGS[buildingIdx];

  useEffect(() => {
    if (phase !== "play") return;
    timerRef.current = setInterval(() => {
      setOxygen(o => { if (o <= 1) return 0; return o - 0.5; });
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const checkRoom = (room) => {
    if (checked.includes(room.room) || oxygen <= 0) return;
    setChecked(c => [...c, room.room]);
    const oxygenCost = room.hazard === "fire" ? 15 : room.hazard === "smoke" ? 8 : 3;
    setOxygen(o => Math.max(0, o - oxygenCost));
    if (room.hasPerson) {
      setRescued(r => [...r, room.person]);
      setScore(s => s + (room.hazard === "fire" ? 40 : room.hazard === "smoke" ? 25 : 15));
    }
  };

  const finishBuilding = () => {
    if (buildingIdx >= BUILDINGS.length - 1) { setPhase("summary"); return; }
    setBuildingIdx(i => i + 1); setChecked([]); setOxygen(100);
  };

  const restart = () => { setPhase("intro"); setBuildingIdx(0); setRescued([]); setChecked([]); setOxygen(100); setScore(0); };
  const stars = rescued.length >= 5 ? 3 : rescued.length >= 3 ? 2 : 1;
  const allChecked = building ? building.rooms.every(r => checked.includes(r.room)) : false;

  return (
    <div style={ff.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>FIREFIGHTER</div>
          <h1 style={ff.title}>🏢 Rescue Mission</h1>
          <p style={ff.sub}>Search through burning buildings to find trapped people. Watch your oxygen — fire and smoke use it faster!</p>
          <button style={ff.btn} onClick={() => setPhase("play")}>Enter Building →</button>
        </div></div>
      )}
      {phase === "play" && building && (
        <div style={ff.gameWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}>{building.emoji} {building.name}</span>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#C62828" }}>⭐ {score}</span>
          </div>
          {/* Oxygen bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>OXYGEN</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: oxygen > 40 ? "#27AE60" : oxygen > 15 ? "#F39C12" : "#E74C3C" }}>{Math.round(oxygen)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#F3F4F6" }}><div style={{ height: "100%", borderRadius: 4, background: oxygen > 40 ? "#27AE60" : oxygen > 15 ? "#F39C12" : "#E74C3C", width: `${oxygen}%`, transition: "width 0.5s" }} /></div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>Rescued: {rescued.length} people | Tap rooms to search</div>

          {/* Building rooms */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {building.rooms.map(room => {
              const isChecked = checked.includes(room.room);
              const hazardColor = room.hazard === "fire" ? "#E74C3C" : room.hazard === "smoke" ? "#FF9800" : "#E5E7EB";
              return (
                <button key={room.room} onClick={() => checkRoom(room)} disabled={isChecked || oxygen <= 0} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: `2px solid ${isChecked ? (room.hasPerson ? "#27AE60" : "#E5E7EB") : hazardColor}`, background: isChecked ? (room.hasPerson ? "#F0FFF4" : "#F9FAFB") : "white", cursor: isChecked ? "default" : "pointer", fontFamily: "'Nunito', sans-serif", width: "100%", textAlign: "left", opacity: isChecked ? 0.7 : 1, transition: "all 0.2s" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", minWidth: 30 }}>F{room.floor}</span>
                  <span style={{ fontWeight: 800, color: "#374151", flex: 1 }}>{room.room}</span>
                  {!isChecked && room.hazard === "fire" && <span>🔥</span>}
                  {!isChecked && room.hazard === "smoke" && <span>🌫️</span>}
                  {isChecked && room.hasPerson && <span style={{ fontSize: 13 }}>{room.person} ✅</span>}
                  {isChecked && !room.hasPerson && <span style={{ fontSize: 12, color: "#9CA3AF" }}>Empty</span>}
                </button>
              );
            })}
          </div>
          {(allChecked || oxygen <= 0) && (
            <button style={{ ...ff.btn, marginTop: 14 }} onClick={finishBuilding}>
              {buildingIdx >= BUILDINGS.length - 1 ? "See Results" : "Next Building →"}
            </button>
          )}
        </div>
      )}
      {phase === "summary" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>MISSION COMPLETE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={ff.title}>{stars === 3 ? "Hero! 🏆" : stars === 2 ? "Brave! 👏" : "Rookie! 🔥"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 36, fontWeight: 700, color: "#C62828", margin: "8px 0" }}>{rescued.length} rescued</div>
          {rescued.map((p, i) => (
            <div key={i} style={{ padding: "8px 14px", background: "#F0FFF4", borderRadius: 10, marginBottom: 4, fontSize: 14, fontWeight: 600 }}>✅ {p}</div>
          ))}
          <div style={ff.insight}><strong>🎓 Career Insight:</strong> Firefighters train in "SCBA" — Self-Contained Breathing Apparatus. Their air tanks last about 30-45 minutes. Managing oxygen while searching is a real life-or-death skill!</div>
          <button style={ff.btn} onClick={restart}>Play Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── FIRE SAFETY INSPECTOR ────
const ROOMS = [
  { name: "Kitchen", emoji: "🍳", items: [
    { name: "Towel on stove", hazard: true, why: "Towels near heat sources can catch fire" },
    { name: "Fire extinguisher on wall", hazard: false, why: "Extinguishers should be accessible" },
    { name: "Overloaded power strip", hazard: true, why: "Overloaded outlets cause electrical fires" },
    { name: "Smoke detector on ceiling", hazard: false, why: "Working detectors save lives" },
    { name: "Grease-clogged vent", hazard: true, why: "Grease buildup is extremely flammable" },
    { name: "Closed oven door", hazard: false, why: "Normal and safe" },
  ]},
  { name: "Living Room", emoji: "🛋️", items: [
    { name: "Candle near curtains", hazard: true, why: "Open flames near fabric is a major fire risk" },
    { name: "Smoke detector installed", hazard: false, why: "Every room should have one" },
    { name: "Space heater blocked by furniture", hazard: true, why: "Heaters need 3 feet of clearance" },
    { name: "Fireplace screen", hazard: false, why: "Screens prevent sparks from escaping" },
    { name: "Extension cord under rug", hazard: true, why: "Cords under rugs can overheat and start fires" },
    { name: "LED lamp on table", hazard: false, why: "LED lights produce minimal heat" },
  ]},
  { name: "Bedroom", emoji: "🛏️", items: [
    { name: "Phone charging on bed", hazard: true, why: "Batteries can overheat on soft surfaces" },
    { name: "Clear exit path to door", hazard: false, why: "Always keep escape routes clear" },
    { name: "Blocked window (furniture)", hazard: true, why: "Windows are secondary escape routes" },
    { name: "Night light in outlet", hazard: false, why: "Low-power LED night lights are safe" },
    { name: "Pile of clothes on heater", hazard: true, why: "Clothes on heaters can ignite" },
  ]},
];

function FireSafety() {
  const [phase, setPhase] = useState("intro");
  const [roomIdx, setRoomIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const room = ROOMS[roomIdx];

  const toggle = (itemName) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [itemName]: !a[itemName] }));
  };

  const submit = () => {
    let correct = 0;
    room.items.forEach(item => {
      const markedHazard = answers[item.name] || false;
      if (markedHazard === item.hazard) correct++;
    });
    setScore(s => s + correct * 10);
    setResults(r => [...r, { name: room.name, correct, total: room.items.length }]);
    setSubmitted(true);
  };

  const next = () => {
    if (roomIdx >= ROOMS.length - 1) { setPhase("summary"); return; }
    setRoomIdx(i => i + 1); setAnswers({}); setSubmitted(false);
  };

  const restart = () => { setPhase("intro"); setRoomIdx(0); setAnswers({}); setSubmitted(false); setScore(0); setResults([]); };
  const stars = score >= 140 ? 3 : score >= 90 ? 2 : 1;

  return (
    <div style={ff.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>FIREFIGHTER</div>
          <h1 style={ff.title}>🔍 Fire Safety Inspector</h1>
          <p style={ff.sub}>Inspect rooms for fire hazards! Tap items you think are dangerous. Can you spot them all?</p>
          <button style={ff.btn} onClick={() => setPhase("play")}>Start Inspection →</button>
        </div></div>
      )}
      {phase === "play" && room && (
        <div style={ff.gameWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16 }}>{room.emoji} {room.name}</span>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#C62828" }}>⭐ {score}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>Tap items you think are fire hazards:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {room.items.map(item => {
              const marked = answers[item.name] || false;
              const showResult = submitted;
              const isCorrect = showResult && marked === item.hazard;
              const isWrong = showResult && marked !== item.hazard;
              return (
                <button key={item.name} onClick={() => toggle(item.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, border: `2px solid ${showResult ? (isCorrect ? "#27AE60" : "#E74C3C") : marked ? "#C62828" : "#E5E7EB"}`, background: showResult ? (isCorrect ? "#F0FFF4" : "#FFF1F2") : marked ? "#FFF1F2" : "white", cursor: submitted ? "default" : "pointer", fontFamily: "'Nunito', sans-serif", width: "100%", textAlign: "left", transition: "all 0.2s" }}>
                  <span style={{ fontWeight: 800, color: "#374151", flex: 1, fontSize: 14 }}>{item.name}</span>
                  {!showResult && marked && <span>⚠️</span>}
                  {showResult && item.hazard && <span>🔥 Hazard!</span>}
                  {showResult && !item.hazard && <span style={{ color: "#27AE60" }}>✅ Safe</span>}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div style={{ marginBottom: 14 }}>
              {room.items.filter(i => i.hazard).map(item => (
                <div key={item.name} style={{ padding: "8px 14px", background: "#FFF8E1", borderRadius: 10, marginBottom: 4, fontSize: 12, fontWeight: 600, color: "#92400E" }}>
                  ⚠️ <strong>{item.name}:</strong> {item.why}
                </div>
              ))}
            </div>
          )}
          {!submitted && <button style={ff.btn} onClick={submit}>Submit Inspection</button>}
          {submitted && <button style={ff.btn} onClick={next}>{roomIdx >= ROOMS.length - 1 ? "See Results" : "Next Room →"}</button>}
        </div>
      )}
      {phase === "summary" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>INSPECTION COMPLETE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={ff.title}>{stars === 3 ? "Expert Inspector! 🏆" : stars === 2 ? "Sharp Eye! 👏" : "Trainee! 📋"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#C62828", margin: "8px 0" }}>{score}</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 14 }}>
              <span>{r.emoji}</span><span style={{ flex: 1, fontWeight: 700 }}>{r.name}</span><span style={{ fontSize: 13, color: "#9CA3AF" }}>{r.correct}/{r.total}</span>
            </div>
          ))}
          <div style={ff.insight}><strong>🎓 Career Insight:</strong> Fire inspectors visit buildings regularly to check for hazards. Their work prevents thousands of fires every year. Many of the hazards you found are the #1 causes of house fires!</div>
          <button style={ff.btn} onClick={restart}>Inspect Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── EMERGENCY RESPONSE ────
const EMERGENCIES = [
  { type: "House Fire", emoji: "🏠🔥", description: "A two-story house fire reported at 42 Oak Street. Family may be inside.",
    decisions: [
      { q: "What do you dispatch first?", correct: 0, options: ["Engine company + ladder truck", "Just one patrol car", "An ambulance only", "A helicopter"], explain: "House fires need both an engine (water) and a ladder truck (rescue). This is called a 'first alarm assignment'." },
      { q: "Neighbors say a family of 4 lives there. Priority?", correct: 1, options: ["Start spraying water immediately", "Search and rescue first, then fight fire", "Wait for more trucks", "Check if anyone's outside first"], explain: "Life safety always comes first! Search and rescue, then fire suppression, then property protection. That's the firefighter priority order." },
      { q: "The fire is spreading to the neighbor's roof. What now?", correct: 0, options: ["Call for a second alarm — more units needed", "Ignore it, focus on the first house", "Just spray the neighbor's roof with one hose", "Tell the neighbors to handle it"], explain: "When fire spreads beyond the original building, firefighters call for additional alarms — bringing more personnel and equipment." },
    ]},
  { type: "Car Accident", emoji: "🚗💥", description: "Multi-car accident on Highway 101. At least 3 vehicles involved, possible injuries.",
    decisions: [
      { q: "What units do you send?", correct: 2, options: ["Just an ambulance", "Just a fire engine", "Engine, rescue squad, AND ambulance", "A police car"], explain: "Car accidents need multiple units: engines for fire risk, rescue squads for extraction, and ambulances for medical care." },
      { q: "One car has a fuel leak. What's the priority?", correct: 0, options: ["Set up a hazmat perimeter", "Start moving cars immediately", "Ignore it — gasoline doesn't easily ignite", "Pour water on the fuel"], explain: "Fuel leaks create explosion risk. Establishing a safety perimeter protects everyone at the scene." },
      { q: "A patient is trapped in a car. How do you extract them?", correct: 1, options: ["Pull them out by their arms", "Use the Jaws of Life to cut the car", "Break the windshield and pull", "Wait for them to get out themselves"], explain: "The 'Jaws of Life' (hydraulic rescue tools) safely cut through metal to free trapped victims without causing further injury." },
    ]},
];

function EmergencyResponse() {
  const [phase, setPhase] = useState("intro");
  const [emIdx, setEmIdx] = useState(0);
  const [decIdx, setDecIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const em = EMERGENCIES[emIdx];
  const dec = em?.decisions[decIdx];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === dec.correct) setScore(s => s + 25);
    setResults(r => [...r, { correct: i === dec.correct }]);
  };

  const next = () => {
    if (decIdx >= em.decisions.length - 1) {
      if (emIdx >= EMERGENCIES.length - 1) { setPhase("summary"); return; }
      setEmIdx(i => i + 1); setDecIdx(0);
    } else { setDecIdx(i => i + 1); }
    setSelected(null);
  };

  const restart = () => { setPhase("intro"); setEmIdx(0); setDecIdx(0); setSelected(null); setScore(0); setResults([]); };
  const correct = results.filter(r => r.correct).length;
  const stars = correct >= 5 ? 3 : correct >= 3 ? 2 : 1;

  return (
    <div style={ff.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      {phase === "intro" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>FIREFIGHTER</div>
          <h1 style={ff.title}>🚨 Emergency Response</h1>
          <p style={ff.sub}>You're the incident commander! Make critical decisions during real emergencies. Every choice matters.</p>
          <button style={ff.btn} onClick={() => setPhase("play")}>Respond →</button>
        </div></div>
      )}
      {phase === "play" && dec && (
        <div style={ff.gameWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}>Emergency {emIdx + 1}/2</span>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#C62828" }}>⭐ {score}</span>
          </div>
          {decIdx === 0 && (
            <div style={{ background: "#FFF3E0", borderRadius: 16, padding: "20px", marginBottom: 14, border: "1.5px solid #FFE0B2" }}>
              <div style={{ fontSize: 32, marginBottom: 8, textAlign: "center" }}>{em.emoji}</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#E65100", textAlign: "center", marginBottom: 6 }}>{em.type}</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#BF360C", lineHeight: 1.5, textAlign: "center" }}>{em.description}</p>
            </div>
          )}
          <div style={{ background: "white", borderRadius: 18, padding: "22px 20px", border: "1.5px solid #FFCDD2", animation: "fadeInUp 0.4s ease-out" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Decision {decIdx + 1}</div>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>{dec.q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {dec.options.map((opt, i) => (
                <button key={i} onClick={() => answer(i)} disabled={selected !== null} style={{ padding: "12px 16px", borderRadius: 12, border: `2px solid ${selected !== null ? (i === dec.correct ? "#27AE60" : selected === i ? "#E74C3C" : "#E5E7EB") : "#E5E7EB"}`, background: selected !== null ? (i === dec.correct ? "#F0FFF4" : selected === i && i !== dec.correct ? "#FFF1F2" : "white") : "white", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left", fontFamily: "'Nunito', sans-serif", width: "100%" }}>{opt}</button>
              ))}
            </div>
            {selected !== null && (
              <>
                <div style={{ padding: "12px 16px", background: selected === dec.correct ? "#F0FFF4" : "#FFF8F8", border: `1.5px solid ${selected === dec.correct ? "#A5D6A7" : "#FFCDD2"}`, borderRadius: 12, fontSize: 13, fontWeight: 600, lineHeight: 1.6, marginBottom: 12 }}>
                  <strong>{selected === dec.correct ? "✅ Correct!" : "❌ Not quite."}</strong> {dec.explain}
                </div>
                <button style={ff.btn} onClick={next}>{decIdx >= em.decisions.length - 1 && emIdx >= EMERGENCIES.length - 1 ? "See Results" : "Next →"}</button>
              </>
            )}
          </div>
        </div>
      )}
      {phase === "summary" && (
        <div style={ff.center}><div style={ff.card}>
          <div style={ff.badge}>SHIFT OVER</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={ff.title}>{stars === 3 ? "Chief! 🏆" : stars === 2 ? "Captain! 🚒" : "Firefighter! 🔥"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 36, fontWeight: 700, color: "#C62828", margin: "8px 0" }}>{correct}/{results.length} correct</div>
          <div style={ff.insight}><strong>🎓 Career Insight:</strong> Fire chiefs coordinate complex emergencies involving dozens of personnel. They train for years in incident command — the same decision framework used by military and disaster response teams worldwide.</div>
          <button style={ff.btn} onClick={restart}>Respond Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── EXPORT SELECTOR ────
export default function Firefighter() {
  const [game, setGame] = useState(null);
  if (game === "rescue") return <RescueMission />;
  if (game === "safety") return <FireSafety />;
  if (game === "emergency") return <EmergencyResponse />;
  return (
    <div style={ff.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={ff.center}><div style={{ ...ff.card, maxWidth: 520 }}>
        <div style={ff.badge}>FIREFIGHTER</div>
        <h1 style={{ ...ff.title, fontSize: 26 }}>🚒 Firefighter Games</h1>
        <p style={ff.sub}>Choose a game to play:</p>
        {[
          { id: "rescue", name: "Rescue Mission", emoji: "🏢", desc: "Search burning buildings for trapped people" },
          { id: "safety", name: "Fire Safety Inspector", emoji: "🔍", desc: "Spot fire hazards in rooms" },
          { id: "emergency", name: "Emergency Response", emoji: "🚨", desc: "Make critical decisions as incident commander" },
        ].map(g => (
          <button key={g.id} onClick={() => setGame(g.id)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", borderRadius: 16, border: "2px solid #FFEBEE", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", marginBottom: 10, textAlign: "left" }}>
            <span style={{ fontSize: 28 }}>{g.emoji}</span>
            <div><div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>{g.name}</div><div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>{g.desc}</div></div>
          </button>
        ))}
      </div></div>
    </div>
  );
}
