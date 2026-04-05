"use client";

import { useState, useEffect } from "react";

// ──── SHARED STYLES ────
const mb = {
  container: { minHeight: "100vh", background: "linear-gradient(170deg, #E0F7FA 0%, #FFF 40%, #F5F5F5 100%)", fontFamily: "'Nunito', sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(0,131,143,0.08)", border: "2px solid #E0F7FA", animation: "fadeInUp 0.6s ease-out" },
  badge: { display: "inline-block", background: "#E0F7FA", color: "#00838F", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 2.5, padding: "5px 16px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 },
  sub: { fontSize: 15, color: "#6B7280", fontWeight: 600, lineHeight: 1.6, marginBottom: 24 },
  btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #00838F, #006064)", color: "white", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(0,131,143,0.25)" },
  rules: { textAlign: "left", display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 },
  rule: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F0FEFF", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#374151" },
  insight: { padding: "14px 16px", background: "#E0F7FA", border: "1.5px solid #B2EBF2", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#006064", lineHeight: 1.6, textAlign: "left", margin: "20px 0" },
  gameWrap: { maxWidth: 580, margin: "0 auto", padding: "12px 16px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  scoreChip: { background: "#FFF9E6", border: "1.5px solid #F7DC6F", padding: "6px 14px", borderRadius: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: "#F39C12" },
};

// ──── REEF EXPLORER ────
const CREATURES = [
  { id: "clownfish", name: "Clownfish", emoji: "🐠", category: "Fish", fact: "Clownfish live in sea anemones that would sting other fish!", habitat: "Coral Reef", hints: ["Orange with white stripes", "Lives in anemones", "Made famous by a movie"] },
  { id: "seahorse", name: "Seahorse", emoji: "🐴", category: "Fish", fact: "Male seahorses carry the babies — they're the only animal where dads get pregnant!", habitat: "Seagrass", hints: ["Shaped like a horse", "Swims upright", "Dad carries the babies"] },
  { id: "octopus", name: "Octopus", emoji: "🐙", category: "Mollusk", fact: "Octopuses have 3 hearts and blue blood!", habitat: "Rocky Reef", hints: ["8 arms", "Can change color", "Very intelligent"] },
  { id: "jellyfish", name: "Jellyfish", emoji: "🪼", category: "Cnidarian", fact: "Jellyfish have been around for over 500 million years — older than dinosaurs!", habitat: "Open Ocean", hints: ["No brain or bones", "Tentacles sting", "95% water"] },
  { id: "turtle", name: "Sea Turtle", emoji: "🐢", category: "Reptile", fact: "Sea turtles can hold their breath for up to 5 hours!", habitat: "Tropical Waters", hints: ["Has a shell", "Returns to same beach to lay eggs", "Can live 100+ years"] },
  { id: "starfish", name: "Starfish", emoji: "⭐", category: "Echinoderm", fact: "Starfish can regrow lost arms — some can even regrow their entire body from one arm!", habitat: "Tide Pools", hints: ["Usually 5 arms", "No blood — uses seawater instead", "Eats with stomach outside body"] },
  { id: "dolphin", name: "Dolphin", emoji: "🐬", category: "Mammal", fact: "Dolphins sleep with one eye open — only half their brain sleeps at a time!", habitat: "Open Ocean", hints: ["Very smart mammal", "Uses echolocation", "Lives in groups called pods"] },
  { id: "whale", name: "Blue Whale", emoji: "🐋", category: "Mammal", fact: "Blue whales are the largest animals EVER — even bigger than the biggest dinosaurs!", habitat: "Deep Ocean", hints: ["Largest animal ever", "Heart is size of a car", "Eats tiny krill"] },
];

function ReefExplorer() {
  const [phase, setPhase] = useState("intro");
  const [creatureIdx, setCreatureIdx] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [guess, setGuess] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const creature = CREATURES[creatureIdx];
  const options = [creature.name, ...CREATURES.filter(c => c.id !== creature.id).sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.name)].sort(() => Math.random() - 0.5);

  const revealHint = () => { if (hintsRevealed < creature.hints.length) setHintsRevealed(h => h + 1); };

  const makeGuess = (name) => {
    setGuess(name);
    const correct = name === creature.name;
    const bonus = 3 - hintsRevealed;
    if (correct) setScore(s => s + 20 + bonus * 10);
    setResults(r => [...r, { name: creature.name, correct }]);
  };

  const next = () => {
    if (creatureIdx >= CREATURES.length - 1) { setPhase("summary"); return; }
    setCreatureIdx(i => i + 1); setHintsRevealed(0); setGuess(null);
  };

  const restart = () => { setPhase("intro"); setCreatureIdx(0); setHintsRevealed(0); setGuess(null); setScore(0); setResults([]); };
  const stars = score >= 140 ? 3 : score >= 80 ? 2 : 1;

  return (
    <div style={mb.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {phase === "intro" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>MARINE BIOLOGIST</div>
          <h1 style={mb.title}>🐠 Reef Explorer</h1>
          <p style={mb.sub}>Identify sea creatures from clues! Reveal hints one by one — fewer hints = more points. Build your field journal!</p>
          <div style={mb.rules}>
            <div style={mb.rule}><span>🔍</span><span>Reveal hints to identify the creature</span></div>
            <div style={mb.rule}><span>🎯</span><span>Guess early for bonus points</span></div>
            <div style={mb.rule}><span>📓</span><span>8 creatures to discover</span></div>
          </div>
          <button style={mb.btn} onClick={() => setPhase("play")}>Dive In →</button>
        </div></div>
      )}

      {phase === "play" && (
        <div style={mb.gameWrap}>
          <div style={mb.topBar}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15 }}>Creature {creatureIdx + 1}/8</span>
            <div style={mb.scoreChip}>⭐ {score}</div>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", border: "1.5px solid #E0F7FA", marginBottom: 14, animation: "fadeInUp 0.4s ease-out" }}>
            <div style={{ textAlign: "center", fontSize: 60, marginBottom: 12 }}>❓</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>Category: {creature.category} | Habitat: {creature.habitat}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {creature.hints.map((hint, i) => (
                <div key={i} style={{ padding: "10px 14px", borderRadius: 12, background: i < hintsRevealed ? "#F0FEFF" : "#F3F4F6", border: `1.5px solid ${i < hintsRevealed ? "#B2EBF2" : "#E5E7EB"}`, fontSize: 14, fontWeight: 600, color: i < hintsRevealed ? "#006064" : "#D1D5DB" }}>
                  {i < hintsRevealed ? `💡 ${hint}` : `Hint ${i + 1} — tap Reveal`}
                </div>
              ))}
            </div>

            {!guess && hintsRevealed < creature.hints.length && (
              <button onClick={revealHint} style={{ ...mb.btn, background: "#00838F", marginBottom: 12 }}>Reveal Next Hint ({3 - hintsRevealed}x bonus)</button>
            )}

            {!guess && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {options.map(name => (
                  <button key={name} onClick={() => makeGuess(name)} style={{ padding: "12px", borderRadius: 12, border: "2px solid #E5E7EB", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: "#374151" }}>{name}</button>
                ))}
              </div>
            )}

            {guess && (
              <div style={{ textAlign: "center", animation: "fadeInUp 0.4s ease-out" }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{creature.emoji}</div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: guess === creature.name ? "#27AE60" : "#E74C3C", marginBottom: 8 }}>
                  {guess === creature.name ? `Yes! It's a ${creature.name}!` : `It was a ${creature.name}`}
                </div>
                <div style={{ padding: "12px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, marginBottom: 14, textAlign: "left" }}>
                  🧠 <strong>Fun fact:</strong> {creature.fact}
                </div>
                <button style={mb.btn} onClick={next}>{creatureIdx >= CREATURES.length - 1 ? "See Results" : "Next Creature →"}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>DIVE COMPLETE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={mb.title}>{stars === 3 ? "Marine Expert! 🏆" : stars === 2 ? "Ocean Explorer! 🌊" : "Beginner Diver! 🐚"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#00838F", margin: "8px 0" }}>{score}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20 }}>POINTS</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 14 }}>
              <span>{r.correct ? "✅" : "❌"}</span><span style={{ fontWeight: 700, color: "#374151" }}>{r.name}</span>
            </div>
          ))}
          <div style={mb.insight}><strong>🎓 Career Insight:</strong> Marine biologists spend years learning to identify thousands of species. Some specialize in just one — like dolphin researchers who can recognize individual dolphins by their dorsal fins!</div>
          <button style={mb.btn} onClick={restart}>Dive Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── OCEAN HEALTH MONITOR ────
const TESTS = [
  { id: "temp", name: "Water Temperature", emoji: "🌡️", unit: "°C", healthy: [20, 26], current: 28, status: "warning", action: "Monitor - slightly warm", fact: "Coral bleaching begins when water stays above 27°C for too long" },
  { id: "ph", name: "pH Level", emoji: "⚗️", unit: "pH", healthy: [7.8, 8.3], current: 7.6, status: "danger", action: "Alert! Ocean acidification detected", fact: "Ocean pH has dropped 0.1 since the Industrial Revolution — that's a 26% increase in acidity" },
  { id: "oxygen", name: "Dissolved Oxygen", emoji: "💨", unit: "mg/L", healthy: [6, 9], current: 7.2, status: "healthy", action: "Normal levels — marine life is thriving", fact: "Fish need dissolved oxygen to breathe, just like we need oxygen in air" },
  { id: "salinity", name: "Salinity", emoji: "🧂", unit: "ppt", healthy: [33, 37], current: 35, status: "healthy", action: "Perfect salinity for reef ecosystems", fact: "Ocean salinity is about 35 parts per thousand — roughly 1 cup of salt per gallon of water" },
  { id: "turbidity", name: "Water Clarity", emoji: "👁️", unit: "NTU", healthy: [0, 10], current: 22, status: "danger", action: "High turbidity — check for runoff pollution", fact: "Murky water blocks sunlight that coral and seagrass need to survive" },
  { id: "nitrate", name: "Nitrate Levels", emoji: "🧪", unit: "mg/L", healthy: [0, 5], current: 3.5, status: "healthy", action: "Within safe range for marine life", fact: "Too many nitrates cause algae blooms that suffocate marine ecosystems" },
];

function OceanHealth() {
  const [phase, setPhase] = useState("intro");
  const [testIdx, setTestIdx] = useState(0);
  const [tested, setTested] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const test = TESTS[testIdx];

  const runTest = () => { setShowResult(true); setTested(t => [...t, test]); };

  const assessStatus = (status) => {
    const correct = status === test.status;
    setAnswers(a => [...a, { name: test.name, correct, actual: test.status }]);
    if (testIdx >= TESTS.length - 1) { setPhase("summary"); return; }
    setTestIdx(i => i + 1); setShowResult(false);
  };

  const restart = () => { setPhase("intro"); setTestIdx(0); setTested([]); setShowResult(false); setAnswers([]); };
  const correct = answers.filter(a => a.correct).length;
  const stars = correct >= 5 ? 3 : correct >= 3 ? 2 : 1;

  return (
    <div style={mb.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {phase === "intro" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>MARINE BIOLOGIST</div>
          <h1 style={mb.title}>🌊 Ocean Health Monitor</h1>
          <p style={mb.sub}>Test water quality at a coral reef site. Run tests, read the results, and assess whether conditions are healthy, warning, or dangerous.</p>
          <div style={mb.rules}>
            <div style={mb.rule}><span>🧪</span><span>Run 6 different water quality tests</span></div>
            <div style={mb.rule}><span>📊</span><span>Read results and compare to healthy ranges</span></div>
            <div style={mb.rule}><span>🚨</span><span>Classify each as Healthy, Warning, or Danger</span></div>
          </div>
          <button style={mb.btn} onClick={() => setPhase("play")}>Start Testing →</button>
        </div></div>
      )}

      {phase === "play" && (
        <div style={mb.gameWrap}>
          <div style={mb.topBar}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}>Test {testIdx + 1}/6</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>{answers.filter(a=>a.correct).length} correct</span>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", border: "1.5px solid #E0F7FA", animation: "fadeInUp 0.4s ease-out" }}>
            <div style={{ textAlign: "center", fontSize: 40, marginBottom: 8 }}>{test.emoji}</div>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 6 }}>{test.name}</h2>
            <div style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 20 }}>Healthy range: {test.healthy[0]}–{test.healthy[1]} {test.unit}</div>

            {!showResult ? (
              <button style={mb.btn} onClick={runTest}>🧪 Run Test</button>
            ) : (
              <div style={{ animation: "fadeInUp 0.3s ease-out" }}>
                <div style={{ textAlign: "center", padding: "20px", background: "#F0FEFF", borderRadius: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 40, fontWeight: 700, color: "#00838F" }}>{test.current} {test.unit}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginTop: 4 }}>Healthy: {test.healthy[0]}–{test.healthy[1]} {test.unit}</div>
                </div>

                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: "#6B7280", marginBottom: 10, textAlign: "center" }}>What's your assessment?</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { status: "healthy", label: "Healthy ✅", color: "#27AE60", bg: "#F0FFF4" },
                    { status: "warning", label: "Warning ⚠️", color: "#F39C12", bg: "#FFF8E1" },
                    { status: "danger", label: "Danger 🚨", color: "#E74C3C", bg: "#FFF1F2" },
                  ].map(s => (
                    <button key={s.status} onClick={() => assessStatus(s.status)} style={{ padding: "14px 8px", borderRadius: 12, border: `2px solid ${s.color}33`, background: s.bg, cursor: "pointer", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 13, color: s.color }}>{s.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ ...mb.insight, marginTop: 14 }}>💡 <strong>Science fact:</strong> {test.fact}</div>
        </div>
      )}

      {phase === "summary" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>MONITORING COMPLETE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={mb.title}>{stars === 3 ? "Expert Monitor! 🏆" : stars === 2 ? "Good Analyst! 📊" : "Keep Learning! 🔬"}</h2>
          {answers.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 14 }}>
              <span>{a.correct ? "✅" : "❌"}</span><span style={{ flex: 1, fontWeight: 700, color: "#374151" }}>{a.name}</span><span style={{ fontSize: 12, color: "#9CA3AF" }}>Was: {a.actual}</span>
            </div>
          ))}
          <div style={mb.insight}><strong>🎓 Career Insight:</strong> Marine biologists regularly monitor water quality at research stations worldwide. The data they collect helps governments decide how to protect ocean ecosystems.</div>
          <button style={mb.btn} onClick={restart}>Monitor Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── CREATURE RESCUE ────
const RESCUES = [
  { animal: "Sea Turtle", emoji: "🐢", injury: "tangled in fishing net", steps: ["Carefully cut away the net", "Check for injuries on flippers", "Clean any wounds with saline", "Apply waterproof bandage", "Place in recovery pool"], fact: "Over 1 million sea creatures die from ocean plastic and fishing nets every year" },
  { animal: "Dolphin", emoji: "🐬", injury: "stranded on the beach", steps: ["Keep the skin wet with towels", "Check breathing and heart rate", "Shield from direct sunlight", "Clear the blowhole", "Guide back to deep water"], fact: "Dolphins can die from their own weight on land — their bodies are designed to be supported by water" },
  { animal: "Seal Pup", emoji: "🦭", injury: "malnourished and dehydrated", steps: ["Wrap in a warm blanket", "Check body temperature", "Administer rehydration fluids", "Prepare fish formula", "Begin gradual feeding schedule"], fact: "Seal pups are sometimes separated from their mothers during storms. Rescue centers raise them until they can hunt independently" },
  { animal: "Penguin", emoji: "🐧", injury: "covered in oil from a spill", steps: ["Stabilize body temperature first", "Apply cornstarch to absorb excess oil", "Wash gently with diluted dish soap", "Rinse thoroughly with clean water", "Dry and place in warm enclosure"], fact: "During the 2000 oil spill near Cape Town, volunteers saved over 19,000 penguins — the largest animal rescue ever!" },
];

function CreatureRescue() {
  const [phase, setPhase] = useState("intro");
  const [rescueIdx, setRescueIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const rescue = RESCUES[rescueIdx];

  const startRescue = () => {
    setScrambled([...rescue.steps].sort(() => Math.random() - 0.5));
    setPlaced([]); setStepIdx(0); setPhase("play");
  };

  const selectStep = (step) => {
    if (step === rescue.steps[placed.length]) {
      setPlaced(p => [...p, step]); setScrambled(s => s.filter(x => x !== step)); setScore(s => s + 20);
      if (placed.length + 1 >= rescue.steps.length) setResults(r => [...r, { name: rescue.animal, emoji: rescue.emoji }]);
    }
  };

  const next = () => {
    if (rescueIdx >= RESCUES.length - 1) { setPhase("summary"); return; }
    setRescueIdx(i => i + 1); setTimeout(() => startRescue(), 100);
  };

  const restart = () => { setPhase("intro"); setRescueIdx(0); setScore(0); setResults([]); setPlaced([]); };
  const stars = score >= 70 ? 3 : score >= 40 ? 2 : 1;
  const allDone = placed.length >= (rescue?.steps.length || 0);

  return (
    <div style={mb.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {phase === "intro" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>MARINE BIOLOGIST</div>
          <h1 style={mb.title}>🐢 Creature Rescue</h1>
          <p style={mb.sub}>Injured sea animals need your help! Put the rescue steps in the right order to save them.</p>
          <div style={mb.rules}>
            <div style={mb.rule}><span>🚑</span><span>4 animals need rescuing</span></div>
            <div style={mb.rule}><span>📋</span><span>Put treatment steps in correct order</span></div>
            <div style={mb.rule}><span>❤️</span><span>Learn real wildlife rescue techniques</span></div>
          </div>
          <button style={mb.btn} onClick={startRescue}>Start Rescue →</button>
        </div></div>
      )}

      {phase === "play" && rescue && (
        <div style={mb.gameWrap}>
          <div style={mb.topBar}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15 }}>Rescue {rescueIdx + 1}/4</span>
            <div style={mb.scoreChip}>⭐ {score}</div>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", border: "1.5px solid #E0F7FA", animation: "fadeInUp 0.3s ease-out" }}>
            <div style={{ textAlign: "center", fontSize: 48, marginBottom: 8 }}>{rescue.emoji}</div>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 4 }}>{rescue.animal}</h2>
            <p style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "#E65100", marginBottom: 16 }}>Found {rescue.injury}</p>

            {placed.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F0FFF4", borderRadius: 10, marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: "#27AE60", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                <span style={{ color: "#374151" }}>{s}</span>
              </div>
            ))}

            {!allDone && (
              <>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600, color: "#9CA3AF", margin: "12px 0 8px" }}>What's step {placed.length + 1}?</div>
                {scrambled.map(s => (
                  <button key={s} onClick={() => selectStep(s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 12, border: "2px solid #E5E7EB", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{s}</button>
                ))}
              </>
            )}

            {allDone && (
              <div style={{ marginTop: 16, animation: "fadeInUp 0.4s ease-out" }}>
                <div style={{ textAlign: "center", fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#27AE60", marginBottom: 12 }}>🎉 {rescue.animal} rescued!</div>
                <div style={{ padding: "12px 16px", background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#92400E", lineHeight: 1.6, marginBottom: 14 }}>🌍 {rescue.fact}</div>
                <button style={mb.btn} onClick={next}>{rescueIdx >= RESCUES.length - 1 ? "See Results" : "Next Rescue →"}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "summary" && (
        <div style={mb.center}><div style={mb.card}>
          <div style={mb.badge}>ALL RESCUES DONE</div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <h2 style={mb.title}>{stars === 3 ? "Rescue Hero! 🏆" : stars === 2 ? "Wildlife Helper! 🌊" : "Volunteer! 🐚"}</h2>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 44, fontWeight: 700, color: "#00838F", margin: "8px 0" }}>{score}</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 4, fontSize: 14 }}>
              <span>{r.emoji}</span><span style={{ fontWeight: 700 }}>{r.name} — Rescued! ✅</span>
            </div>
          ))}
          <div style={mb.insight}><strong>🎓 Career Insight:</strong> Marine wildlife veterinarians work at rescue centers around the world. They need to know both veterinary medicine AND marine biology. Some even scuba dive to treat animals in the wild!</div>
          <button style={mb.btn} onClick={restart}>Rescue Again</button>
        </div></div>
      )}
    </div>
  );
}

// ──── EXPORT SELECTOR ────
export default function MarineBiologist() {
  const [game, setGame] = useState(null);

  if (game === "reef") return <ReefExplorer />;
  if (game === "ocean") return <OceanHealth />;
  if (game === "rescue") return <CreatureRescue />;

  return (
    <div style={mb.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={mb.center}>
        <div style={{ ...mb.card, maxWidth: 520 }}>
          <div style={mb.badge}>MARINE BIOLOGIST</div>
          <h1 style={{ ...mb.title, fontSize: 26 }}>🐙 Marine Biologist Games</h1>
          <p style={mb.sub}>Choose a game to play:</p>
          {[
            { id: "reef", name: "Reef Explorer", emoji: "🐠", desc: "Identify sea creatures from clues" },
            { id: "ocean", name: "Ocean Health Monitor", emoji: "🌊", desc: "Test water quality & protect reefs" },
            { id: "rescue", name: "Creature Rescue", emoji: "🐢", desc: "Save injured marine animals" },
          ].map(g => (
            <button key={g.id} onClick={() => setGame(g.id)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", borderRadius: 16, border: "2px solid #E0F7FA", background: "white", cursor: "pointer", fontFamily: "'Nunito', sans-serif", marginBottom: 10, textAlign: "left", transition: "all 0.2s" }}>
              <span style={{ fontSize: 28 }}>{g.emoji}</span>
              <div><div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>{g.name}</div><div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>{g.desc}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
