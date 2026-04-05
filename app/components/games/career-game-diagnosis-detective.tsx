"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// --- GAME DATA ---
const PATIENTS = [
  {
    id: 1,
    name: "Mia Chen",
    age: 8,
    avatar: { skin: "#F5D0A9", hair: "#2C1810", hairStyle: "pigtails", expression: "worried" },
    complaint: "My throat hurts really bad and I feel super hot...",
    vitals: { temp: "102.4°F", heartRate: "98 bpm", bloodPressure: "100/65" },
    symptoms: [
      { text: "Severe sore throat", icon: "🔴", area: "throat" },
      { text: "High fever", icon: "🌡️", area: "head" },
      { text: "Painful swallowing", icon: "😣", area: "throat" },
      { text: "Swollen neck glands", icon: "🫁", area: "neck" },
    ],
    correctDiagnosis: "strep-throat",
    funFact: "Strep throat is caused by Group A Streptococcus bacteria. Doctors use a quick swab test to check for it!",
  },
  {
    id: 2,
    name: "Jake Robinson",
    age: 11,
    avatar: { skin: "#8D5524", hair: "#1A1A1A", hairStyle: "short", expression: "sneezy" },
    complaint: "I keep sneezing and my eyes are so itchy! But I feel fine otherwise.",
    vitals: { temp: "98.6°F", heartRate: "72 bpm", bloodPressure: "105/68" },
    symptoms: [
      { text: "Itchy, watery eyes", icon: "👁️", area: "eyes" },
      { text: "Constant sneezing", icon: "🤧", area: "nose" },
      { text: "Runny nose", icon: "💧", area: "nose" },
      { text: "No fever at all", icon: "✅", area: "head" },
    ],
    correctDiagnosis: "allergies",
    funFact: "Seasonal allergies happen when your immune system overreacts to pollen. About 1 in 5 people have them!",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    age: 9,
    avatar: { skin: "#DEB887", hair: "#4A2C0A", hairStyle: "long", expression: "tired" },
    complaint: "My whole body aches and I'm so tired I can barely stand up...",
    vitals: { temp: "103.1°F", heartRate: "105 bpm", bloodPressure: "95/60" },
    symptoms: [
      { text: "High fever", icon: "🌡️", area: "head" },
      { text: "Body aches everywhere", icon: "💪", area: "body" },
      { text: "Extreme fatigue", icon: "😩", area: "body" },
      { text: "Dry cough", icon: "🫁", area: "chest" },
    ],
    correctDiagnosis: "flu",
    funFact: "The flu virus changes shape every year — that's why you need a new flu shot each season!",
  },
  {
    id: 4,
    name: "Liam O'Brien",
    age: 7,
    avatar: { skin: "#FFDAB9", hair: "#D4760A", hairStyle: "curly", expression: "pain" },
    complaint: "My ear really really hurts and everything sounds muffled...",
    vitals: { temp: "100.8°F", heartRate: "88 bpm", bloodPressure: "98/62" },
    symptoms: [
      { text: "Sharp ear pain", icon: "👂", area: "ear" },
      { text: "Mild fever", icon: "🌡️", area: "head" },
      { text: "Muffled hearing", icon: "🔇", area: "ear" },
      { text: "Fluid draining from ear", icon: "💧", area: "ear" },
    ],
    correctDiagnosis: "ear-infection",
    funFact: "Ear infections are one of the most common reasons kids visit the doctor. The tiny tubes in your ear can get blocked!",
  },
  {
    id: 5,
    name: "Aisha Patel",
    age: 10,
    avatar: { skin: "#C68642", hair: "#0A0A0A", hairStyle: "braid", expression: "nauseous" },
    complaint: "My tummy hurts so much and I keep feeling like I'm going to throw up...",
    vitals: { temp: "99.8°F", heartRate: "92 bpm", bloodPressure: "102/66" },
    symptoms: [
      { text: "Stomach cramps", icon: "🤢", area: "stomach" },
      { text: "Nausea & vomiting", icon: "😵", area: "stomach" },
      { text: "Diarrhea", icon: "⚠️", area: "stomach" },
      { text: "Slight fever", icon: "🌡️", area: "head" },
    ],
    correctDiagnosis: "stomach-bug",
    funFact: "A stomach bug (gastroenteritis) is usually caused by a virus. Staying hydrated is the most important treatment!",
  },
];

const DIAGNOSES = [
  { id: "common-cold", name: "Common Cold", icon: "🤧", color: "#5B9BD5" },
  { id: "flu", name: "Influenza", icon: "🤒", color: "#E74C3C" },
  { id: "strep-throat", name: "Strep Throat", icon: "😷", color: "#F39C12" },
  { id: "allergies", name: "Allergies", icon: "🌸", color: "#2ECC71" },
  { id: "stomach-bug", name: "Stomach Bug", icon: "🤢", color: "#9B59B6" },
  { id: "ear-infection", name: "Ear Infection", icon: "👂", color: "#E67E22" },
];

// --- SVG PATIENT AVATAR ---
function PatientAvatar({ avatar, size = 160, animate = false }) {
  const { skin, hair, hairStyle, expression } = avatar;

  const eyeExpressions = {
    worried: { ly: 0, ry: 0, brow: -3 },
    sneezy: { ly: 2, ry: 2, brow: 0 },
    tired: { ly: 3, ry: 3, brow: 2 },
    pain: { ly: -1, ry: 2, brow: -4 },
    nauseous: { ly: 1, ry: 1, brow: 1 },
    happy: { ly: 0, ry: 0, brow: 0 },
  };

  const expr = eyeExpressions[expression] || eyeExpressions.worried;

  return (
    <svg viewBox="0 0 120 140" width={size} height={size * 1.16} style={animate ? { animation: "breathe 3s ease-in-out infinite" } : {}}>
      {/* Body */}
      <ellipse cx="60" cy="130" rx="35" ry="18" fill="#E8F4FD" stroke="#B8D8E8" strokeWidth="1.5" />
      <rect x="30" y="105" width="60" height="30" rx="8" fill="#E8F4FD" stroke="#B8D8E8" strokeWidth="1.5" />

      {/* Neck */}
      <rect x="50" y="95" width="20" height="18" rx="4" fill={skin} />

      {/* Head */}
      <ellipse cx="60" cy="58" rx="38" ry="42" fill={skin} />

      {/* Hair */}
      {hairStyle === "pigtails" && (
        <>
          <ellipse cx="60" cy="24" rx="36" ry="16" fill={hair} />
          <ellipse cx="22" cy="42" rx="12" ry="16" fill={hair} />
          <ellipse cx="98" cy="42" rx="12" ry="16" fill={hair} />
          <path d="M24 20 Q60 8 96 20 Q98 30 96 38 Q60 18 24 38 Q22 30 24 20Z" fill={hair} />
        </>
      )}
      {hairStyle === "short" && (
        <path d="M24 50 Q24 14 60 12 Q96 14 96 50 Q96 32 60 28 Q24 32 24 50Z" fill={hair} />
      )}
      {hairStyle === "long" && (
        <>
          <path d="M22 55 Q22 12 60 10 Q98 12 98 55 Q98 30 60 26 Q22 30 22 55Z" fill={hair} />
          <path d="M22 55 Q18 75 22 100" stroke={hair} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M98 55 Q102 75 98 100" stroke={hair} strokeWidth="12" fill="none" strokeLinecap="round" />
        </>
      )}
      {hairStyle === "curly" && (
        <>
          {[30, 45, 60, 75, 90].map((x, i) => (
            <circle key={i} cx={x} cy={22 + Math.sin(i) * 4} r={12} fill={hair} />
          ))}
          <circle cx="22" cy="38" r="10" fill={hair} />
          <circle cx="98" cy="38" r="10" fill={hair} />
        </>
      )}
      {hairStyle === "braid" && (
        <>
          <path d="M22 50 Q22 12 60 10 Q98 12 98 50 Q98 30 60 26 Q22 30 22 50Z" fill={hair} />
          <path d="M72 30 Q80 50 75 80 Q72 95 78 105" stroke={hair} strokeWidth="8" fill="none" strokeLinecap="round" />
          {[50, 65, 80, 95].map((y, i) => (
            <circle key={i} cx={75 + Math.sin(i * 1.2) * 3} cy={y} r="5" fill={hair} opacity="0.7" />
          ))}
        </>
      )}

      {/* Eyes */}
      <g>
        <ellipse cx="45" cy={55 + expr.ly} rx="5" ry="6" fill="white" />
        <ellipse cx="75" cy={55 + expr.ry} rx="5" ry="6" fill="white" />
        <circle cx="45" cy={56 + expr.ly} r="3" fill="#2C3E50" />
        <circle cx="75" cy={56 + expr.ry} r="3" fill="#2C3E50" />
        <circle cx="46.5" cy={54.5 + expr.ly} r="1" fill="white" />
        <circle cx="76.5" cy={54.5 + expr.ry} r="1" fill="white" />
      </g>

      {/* Eyebrows */}
      <line x1="38" y1={46 + expr.brow} x2="52" y2={44 + expr.brow} stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1={44 + expr.brow} x2="82" y2={46 + expr.brow} stroke={hair} strokeWidth="2.5" strokeLinecap="round" />

      {/* Mouth */}
      {expression === "worried" && <path d="M48 76 Q60 72 72 76" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {expression === "sneezy" && <ellipse cx="60" cy="76" rx="5" ry="4" fill="#C0392B" />}
      {expression === "tired" && <path d="M48 76 Q60 80 72 76" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {expression === "pain" && <ellipse cx="60" cy="77" rx="7" ry="5" fill="#C0392B" />}
      {expression === "nauseous" && <path d="M45 76 Q52 80 60 76 Q68 72 75 76" stroke="#7D8B3E" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {expression === "happy" && <path d="M45 73 Q60 84 75 73" stroke="#C0392B" strokeWidth="2.5" fill="none" strokeLinecap="round" />}

      {/* Cheeks (blush) */}
      <circle cx="32" cy="68" r="7" fill="#FFB6C1" opacity="0.3" />
      <circle cx="88" cy="68" r="7" fill="#FFB6C1" opacity="0.3" />

      {/* Hospital gown neckline */}
      <path d="M38 108 Q60 118 82 108" stroke="#B8D8E8" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// --- STETHOSCOPE ICON ---
function StethoscopeIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v6a4 4 0 0 0 8 0V2" />
      <line x1="6" y1="2" x2="6" y2="2" />
      <line x1="14" y1="2" x2="14" y2="2" />
      <circle cx="18" cy="14" r="2" />
      <path d="M18 16v2a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-4" />
    </svg>
  );
}

// --- ANIMATED HEARTBEAT ---
function Heartbeat() {
  return (
    <svg viewBox="0 0 200 40" style={{ width: "100%", height: 40 }}>
      <polyline
        points="0,20 30,20 40,20 50,5 60,35 70,15 80,25 90,20 200,20"
        fill="none"
        stroke="#E74C3C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "pulse-line 2s linear infinite" }}
      />
    </svg>
  );
}

// --- MAIN GAME COMPONENT ---
export default function DiagnosisDetective() {
  const [gamePhase, setGamePhase] = useState("intro"); // intro, examine, diagnose, result, summary
  const [currentPatientIdx, setCurrentPatientIdx] = useState(0);
  const [revealedSymptoms, setRevealedSymptoms] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [results, setResults] = useState([]);
  const [showVitals, setShowVitals] = useState(false);
  const [examAnimation, setExamAnimation] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

  const patient = PATIENTS[currentPatientIdx];
  const totalPatients = PATIENTS.length;

  // Reveal symptoms one by one
  const examineSymptom = useCallback(
    (idx) => {
      if (revealedSymptoms.includes(idx)) return;
      setExamAnimation(idx);
      setTimeout(() => {
        setRevealedSymptoms((prev) => [...prev, idx]);
        setExamAnimation(null);
      }, 600);
    },
    [revealedSymptoms]
  );

  const makeDiagnosis = (diagId) => {
    setSelectedDiagnosis(diagId);
    const correct = diagId === patient.correctDiagnosis;
    setIsCorrect(correct);

    if (correct) {
      const bonus = revealedSymptoms.length <= 2 ? 50 : 0;
      setScore((s) => s + 100 + bonus + streak * 25);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setLives((l) => l - 1);
    }

    setResults((prev) => [...prev, { patient: patient.name, correct, diagnosis: diagId }]);
    setGamePhase("result");
  };

  const nextPatient = () => {
    if (currentPatientIdx >= totalPatients - 1 || lives <= 0) {
      setGamePhase("summary");
    } else {
      setCurrentPatientIdx((i) => i + 1);
      setRevealedSymptoms([]);
      setSelectedDiagnosis(null);
      setIsCorrect(null);
      setShowVitals(false);
      setTipVisible(false);
      setGamePhase("examine");
    }
  };

  const restart = () => {
    setGamePhase("intro");
    setCurrentPatientIdx(0);
    setRevealedSymptoms([]);
    setSelectedDiagnosis(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setLives(3);
    setResults([]);
    setShowVitals(false);
    setTipVisible(false);
  };

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>

      {/* Ambient background elements */}
      <div style={styles.bgGrid} />
      <div style={styles.bgCross1}>+</div>
      <div style={styles.bgCross2}>+</div>
      <div style={styles.bgCross3}>+</div>

      {gamePhase === "intro" && (
        <div style={styles.introWrap}>
          <div style={styles.introCard}>
            <div style={styles.introBadge}>MEDICAL ACADEMY</div>
            <h1 style={styles.introTitle}>Diagnosis Detective</h1>
            <div style={styles.introSubtitle}>Can you figure out what's wrong with each patient?</div>

            <div style={styles.introAvatar}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="55" fill="#E8F4FD" stroke="#3498DB" strokeWidth="3" />
                <text x="60" y="72" textAnchor="middle" fontSize="50">🩺</text>
              </svg>
            </div>

            <div style={styles.introSteps}>
              <div style={styles.introStep}>
                <div style={styles.stepNum}>1</div>
                <div>
                  <div style={styles.stepTitle}>Examine</div>
                  <div style={styles.stepDesc}>Check your patient's symptoms</div>
                </div>
              </div>
              <div style={styles.introStep}>
                <div style={{ ...styles.stepNum, background: "#9B59B6" }}>2</div>
                <div>
                  <div style={styles.stepTitle}>Think</div>
                  <div style={styles.stepDesc}>Compare clues & review vitals</div>
                </div>
              </div>
              <div style={styles.introStep}>
                <div style={{ ...styles.stepNum, background: "#27AE60" }}>3</div>
                <div>
                  <div style={styles.stepTitle}>Diagnose</div>
                  <div style={styles.stepDesc}>Pick the correct condition</div>
                </div>
              </div>
            </div>

            <button style={styles.startBtn} onClick={() => setGamePhase("examine")}>
              <span>Begin Rounds</span>
              <span style={{ fontSize: 22 }}>→</span>
            </button>

            <div style={styles.introFooter}>5 patients are waiting · 3 lives · Earn up to 750 points</div>
          </div>
        </div>
      )}

      {(gamePhase === "examine" || gamePhase === "diagnose") && (
        <div style={styles.gameWrap}>
          {/* TOP BAR */}
          <div style={styles.topBar}>
            <div style={styles.topBarLeft}>
              <div style={styles.scoreChip}>
                <span style={{ fontSize: 16 }}>⭐</span>
                <span style={styles.scoreNum}>{score}</span>
              </div>
              {streak > 1 && (
                <div style={styles.streakChip}>
                  🔥 {streak}x streak
                </div>
              )}
            </div>
            <div style={styles.topBarCenter}>
              Patient {currentPatientIdx + 1} / {totalPatients}
            </div>
            <div style={styles.topBarRight}>
              {[...Array(3)].map((_, i) => (
                <span key={i} style={{ fontSize: 20, opacity: i < lives ? 1 : 0.2, transition: "opacity 0.3s" }}>
                  ❤️
                </span>
              ))}
            </div>
          </div>

          {/* MAIN GAME AREA */}
          <div style={styles.gameGrid}>
            {/* LEFT: Patient Card */}
            <div style={styles.patientCard}>
              <div style={styles.patientHeader}>
                <div style={styles.patientAvatarWrap}>
                  <PatientAvatar avatar={patient.avatar} size={130} animate />
                </div>
                <div style={styles.patientInfo}>
                  <div style={styles.patientName}>{patient.name}</div>
                  <div style={styles.patientAge}>Age {patient.age}</div>
                  <div style={styles.patientBadge}>
                    <span style={styles.waitingDot} />
                    Waiting for diagnosis
                  </div>
                </div>
              </div>

              <div style={styles.speechBubble}>
                <div style={styles.speechTail} />
                "{patient.complaint}"
              </div>

              {/* Vitals Section */}
              <button style={styles.vitalsToggle} onClick={() => setShowVitals(!showVitals)}>
                <StethoscopeIcon size={18} color="#3498DB" />
                <span>{showVitals ? "Hide" : "Check"} Vitals</span>
                <span style={{ transform: showVitals ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▼</span>
              </button>

              {showVitals && (
                <div style={styles.vitalsPanel}>
                  <Heartbeat />
                  <div style={styles.vitalsGrid}>
                    <div style={styles.vitalItem}>
                      <div style={styles.vitalLabel}>🌡️ Temp</div>
                      <div style={{ ...styles.vitalValue, color: parseFloat(patient.vitals.temp) > 100 ? "#E74C3C" : "#27AE60" }}>
                        {patient.vitals.temp}
                      </div>
                    </div>
                    <div style={styles.vitalItem}>
                      <div style={styles.vitalLabel}>💓 Heart</div>
                      <div style={styles.vitalValue}>{patient.vitals.heartRate}</div>
                    </div>
                    <div style={styles.vitalItem}>
                      <div style={styles.vitalLabel}>🩸 BP</div>
                      <div style={styles.vitalValue}>{patient.vitals.bloodPressure}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Examination / Diagnosis Area */}
            <div style={styles.rightPanel}>
              {gamePhase === "examine" && (
                <>
                  <div style={styles.panelHeader}>
                    <div style={styles.clipboardIcon}>📋</div>
                    <div>
                      <h2 style={styles.panelTitle}>Examine Patient</h2>
                      <p style={styles.panelSub}>Tap each area to check for symptoms</p>
                    </div>
                  </div>

                  <div style={styles.symptomGrid}>
                    {patient.symptoms.map((s, i) => {
                      const revealed = revealedSymptoms.includes(i);
                      const isAnimating = examAnimation === i;
                      return (
                        <button
                          key={i}
                          style={{
                            ...styles.symptomCard,
                            ...(revealed ? styles.symptomRevealed : {}),
                            ...(isAnimating ? styles.symptomAnimating : {}),
                          }}
                          onClick={() => examineSymptom(i)}
                          disabled={revealed}
                        >
                          {revealed ? (
                            <>
                              <span style={styles.symptomIcon}>{s.icon}</span>
                              <span style={styles.symptomText}>{s.text}</span>
                            </>
                          ) : (
                            <>
                              <span style={styles.examIcon}>🔍</span>
                              <span style={styles.examLabel}>Check {s.area}</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tip */}
                  {revealedSymptoms.length >= 2 && !tipVisible && (
                    <div style={styles.tipBar} onClick={() => setTipVisible(true)}>
                      💡 <strong>Pro tip:</strong> You can diagnose early for bonus points! Tap here to learn more.
                    </div>
                  )}
                  {tipVisible && (
                    <div style={styles.tipExpanded}>
                      <strong>🎯 Early Diagnosis Bonus:</strong> If you correctly diagnose with only 1-2 symptoms revealed, you earn +50 bonus points! But be careful — wrong guesses cost a life.
                    </div>
                  )}

                  <button
                    style={{
                      ...styles.diagnoseBtn,
                      opacity: revealedSymptoms.length >= 1 ? 1 : 0.4,
                      pointerEvents: revealedSymptoms.length >= 1 ? "auto" : "none",
                    }}
                    onClick={() => setGamePhase("diagnose")}
                  >
                    <span>🩺</span>
                    <span>Ready to Diagnose</span>
                  </button>
                </>
              )}

              {gamePhase === "diagnose" && (
                <>
                  <div style={styles.panelHeader}>
                    <div style={styles.clipboardIcon}>🏥</div>
                    <div>
                      <h2 style={styles.panelTitle}>Make Your Diagnosis</h2>
                      <p style={styles.panelSub}>What condition does {patient.name} have?</p>
                    </div>
                  </div>

                  {/* Revealed symptoms reminder */}
                  <div style={styles.symptomsReminder}>
                    <div style={styles.reminderLabel}>Symptoms found:</div>
                    <div style={styles.reminderChips}>
                      {revealedSymptoms.map((idx) => (
                        <span key={idx} style={styles.reminderChip}>
                          {patient.symptoms[idx].icon} {patient.symptoms[idx].text}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.diagnosisGrid}>
                    {DIAGNOSES.map((d) => (
                      <button key={d.id} style={styles.diagnosisCard} onClick={() => makeDiagnosis(d.id)}>
                        <span style={{ fontSize: 28 }}>{d.icon}</span>
                        <span style={styles.diagnosisName}>{d.name}</span>
                        <span style={{ ...styles.diagnosisDot, background: d.color }} />
                      </button>
                    ))}
                  </div>

                  <button style={styles.backBtn} onClick={() => setGamePhase("examine")}>
                    ← Back to examination
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {gamePhase === "result" && (
        <div style={styles.resultOverlay}>
          <div style={{ ...styles.resultCard, borderColor: isCorrect ? "#27AE60" : "#E74C3C" }}>
            <div style={styles.resultEmoji}>{isCorrect ? "🎉" : "😔"}</div>
            <h2 style={{ ...styles.resultTitle, color: isCorrect ? "#27AE60" : "#E74C3C" }}>
              {isCorrect ? "Correct Diagnosis!" : "Not Quite Right"}
            </h2>
            <div style={styles.resultDiagnosis}>
              The correct answer was:{" "}
              <strong>{DIAGNOSES.find((d) => d.id === patient.correctDiagnosis)?.name}</strong>
            </div>
            <div style={styles.funFact}>
              <div style={styles.funFactLabel}>🧠 Did You Know?</div>
              {patient.funFact}
            </div>

            {isCorrect && revealedSymptoms.length <= 2 && (
              <div style={styles.bonusBanner}>🎯 Early Diagnosis Bonus: +50 pts!</div>
            )}

            {!isCorrect && lives <= 0 && (
              <div style={styles.gameOverBanner}>💔 No more lives! Let's see your results.</div>
            )}

            <button style={styles.nextBtn} onClick={nextPatient}>
              {currentPatientIdx >= totalPatients - 1 || lives <= 0 ? "See Results" : "Next Patient →"}
            </button>
          </div>
        </div>
      )}

      {gamePhase === "summary" && (
        <div style={styles.resultOverlay}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryBadge}>ROUNDS COMPLETE</div>
            <h2 style={styles.summaryTitle}>
              {score >= 400 ? "Outstanding Doctor! 🌟" : score >= 200 ? "Great Work! 👏" : "Keep Practicing! 💪"}
            </h2>

            <div style={styles.summaryScore}>
              <div style={styles.summaryScoreNum}>{score}</div>
              <div style={styles.summaryScoreLabel}>points earned</div>
            </div>

            <div style={styles.summaryStats}>
              <div style={styles.summaryStat}>
                <div style={styles.summaryStatNum}>{results.filter((r) => r.correct).length}</div>
                <div style={styles.summaryStatLabel}>Correct</div>
              </div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryStat}>
                <div style={styles.summaryStatNum}>{results.length}</div>
                <div style={styles.summaryStatLabel}>Patients</div>
              </div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryStat}>
                <div style={styles.summaryStatNum}>{lives}</div>
                <div style={styles.summaryStatLabel}>Lives Left</div>
              </div>
            </div>

            <div style={styles.summaryResults}>
              {results.map((r, i) => (
                <div key={i} style={styles.summaryRow}>
                  <span>{r.correct ? "✅" : "❌"}</span>
                  <span style={styles.summaryRowName}>{r.patient}</span>
                  <span style={styles.summaryRowDiag}>
                    {DIAGNOSES.find((d) => d.id === r.diagnosis)?.name}
                  </span>
                </div>
              ))}
            </div>

            <div style={styles.summaryFunFact}>
              <strong>🎓 Career Insight:</strong> Real doctors spend 11-16 years in school and training! They examine
              patients just like you did — checking symptoms, reviewing vitals, and making a diagnosis.
            </div>

            <button style={styles.startBtn} onClick={restart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- GLOBAL CSS KEYFRAMES ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');

  @keyframes breathe {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes pulse-line {
    0% { stroke-dashoffset: 300; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(2deg); }
    66% { transform: translateY(4px) rotate(-1deg); }
  }

  @keyframes blink {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0.3; }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// --- STYLE OBJECTS ---
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #F0F7FF 0%, #E8F0FE 30%, #FFF5F5 60%, #F0F7FF 100%)",
    fontFamily: "'Nunito', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage: "radial-gradient(circle, #D5E3F7 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.4,
    pointerEvents: "none",
  },
  bgCross1: { position: "fixed", top: "10%", right: "8%", fontSize: 80, color: "#D5E3F7", fontWeight: 300, opacity: 0.5, pointerEvents: "none", animation: "float 8s ease-in-out infinite" },
  bgCross2: { position: "fixed", bottom: "15%", left: "5%", fontSize: 60, color: "#FADADD", fontWeight: 300, opacity: 0.4, pointerEvents: "none", animation: "float 10s ease-in-out infinite 2s" },
  bgCross3: { position: "fixed", top: "50%", right: "3%", fontSize: 50, color: "#D5F5E3", fontWeight: 300, opacity: 0.3, pointerEvents: "none", animation: "float 12s ease-in-out infinite 4s" },

  // INTRO
  introWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
    zIndex: 1,
  },
  introCard: {
    background: "white",
    borderRadius: 28,
    padding: "48px 40px",
    maxWidth: 480,
    width: "100%",
    boxShadow: "0 20px 60px rgba(52,152,219,0.12), 0 2px 8px rgba(0,0,0,0.04)",
    textAlign: "center",
    animation: "fadeInUp 0.7s ease-out",
    border: "2px solid #E8F4FD",
  },
  introBadge: {
    display: "inline-block",
    background: "#EBF5FB",
    color: "#2980B9",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 2.5,
    padding: "6px 18px",
    borderRadius: 100,
    marginBottom: 16,
  },
  introTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2C3E50",
    lineHeight: 1.1,
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: 600,
    marginBottom: 28,
  },
  introAvatar: {
    margin: "0 auto 28px",
    animation: "float 5s ease-in-out infinite",
  },
  introSteps: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: 32,
    textAlign: "left",
  },
  introStep: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 16px",
    borderRadius: 16,
    background: "#F8FBFF",
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "#3498DB",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  stepTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: "#2C3E50",
  },
  stepDesc: {
    fontSize: 13,
    color: "#95A5A6",
    fontWeight: 600,
  },
  startBtn: {
    width: "100%",
    padding: "16px 32px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
    color: "white",
    fontSize: 18,
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 8px 24px rgba(52,152,219,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  introFooter: {
    marginTop: 16,
    fontSize: 13,
    color: "#BDC3C7",
    fontWeight: 600,
  },

  // GAME
  gameWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "2px solid #E8F4FD",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: 10 },
  topBarCenter: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#7F8C8D",
    letterSpacing: 0.5,
  },
  topBarRight: { display: "flex", gap: 4 },
  scoreChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#FFF9E6",
    border: "2px solid #F7DC6F",
    padding: "6px 14px",
    borderRadius: 100,
  },
  scoreNum: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#F39C12",
  },
  streakChip: {
    background: "#FDEBD0",
    border: "2px solid #F5B041",
    padding: "6px 12px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 700,
    color: "#E67E22",
    animation: "scaleIn 0.3s ease-out",
  },

  gameGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: 0,
    flex: 1,
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
    padding: "24px 20px",
  },

  // PATIENT CARD
  patientCard: {
    background: "white",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    border: "2px solid #E8F4FD",
    animation: "fadeInUp 0.5s ease-out",
    alignSelf: "start",
    position: "sticky",
    top: 80,
  },
  patientHeader: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  patientAvatarWrap: {
    flexShrink: 0,
  },
  patientInfo: {
    paddingTop: 12,
  },
  patientName: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 22,
    color: "#2C3E50",
  },
  patientAge: {
    fontSize: 14,
    color: "#95A5A6",
    fontWeight: 700,
    marginBottom: 8,
  },
  patientBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#FEF9E7",
    border: "1.5px solid #F9E79F",
    padding: "4px 12px",
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 700,
    color: "#D4AC0D",
  },
  waitingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#F1C40F",
    display: "inline-block",
    animation: "blink 2s infinite",
  },
  speechBubble: {
    position: "relative",
    background: "#F8FBFF",
    border: "2px solid #D4E6F6",
    borderRadius: 18,
    padding: "16px 18px",
    fontSize: 15,
    fontWeight: 600,
    color: "#34495E",
    fontStyle: "italic",
    lineHeight: 1.5,
    marginBottom: 16,
  },
  speechTail: {
    position: "absolute",
    top: -10,
    left: 30,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "10px solid #D4E6F6",
  },
  vitalsToggle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    border: "2px solid #D4E6F6",
    background: "white",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#3498DB",
    transition: "background 0.2s",
  },
  vitalsPanel: {
    marginTop: 12,
    padding: 16,
    background: "#F0F9FF",
    borderRadius: 16,
    animation: "fadeInUp 0.3s ease-out",
  },
  vitalsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginTop: 8,
  },
  vitalItem: {
    textAlign: "center",
    padding: "8px 4px",
    background: "white",
    borderRadius: 12,
  },
  vitalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#95A5A6",
    marginBottom: 4,
  },
  vitalValue: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#2C3E50",
  },

  // RIGHT PANEL
  rightPanel: {
    paddingLeft: 24,
    animation: "fadeInUp 0.5s ease-out 0.1s both",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  clipboardIcon: {
    fontSize: 32,
  },
  panelTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "#2C3E50",
  },
  panelSub: {
    fontSize: 14,
    color: "#95A5A6",
    fontWeight: 600,
  },

  // SYMPTOMS
  symptomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20,
  },
  symptomCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 16px",
    borderRadius: 18,
    border: "2.5px dashed #D5DBDB",
    background: "white",
    cursor: "pointer",
    transition: "all 0.3s",
    fontFamily: "'Nunito', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#7F8C8D",
  },
  symptomRevealed: {
    border: "2.5px solid #27AE60",
    background: "#F0FFF4",
    color: "#2C3E50",
    cursor: "default",
    animation: "scaleIn 0.4s ease-out",
  },
  symptomAnimating: {
    transform: "scale(0.95)",
    opacity: 0.6,
  },
  symptomIcon: { fontSize: 22 },
  symptomText: { fontSize: 14, fontWeight: 700 },
  examIcon: { fontSize: 20 },
  examLabel: { fontSize: 13, fontWeight: 700, textTransform: "capitalize" },

  tipBar: {
    padding: "12px 16px",
    borderRadius: 14,
    background: "#FEF9E7",
    border: "1.5px solid #F9E79F",
    fontSize: 13,
    fontWeight: 600,
    color: "#7D6608",
    cursor: "pointer",
    marginBottom: 16,
  },
  tipExpanded: {
    padding: "14px 16px",
    borderRadius: 14,
    background: "#FEF9E7",
    border: "1.5px solid #F9E79F",
    fontSize: 13,
    fontWeight: 600,
    color: "#7D6608",
    marginBottom: 16,
    lineHeight: 1.6,
  },

  diagnoseBtn: {
    width: "100%",
    padding: "16px 24px",
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg, #27AE60 0%, #229954 100%)",
    color: "white",
    fontSize: 17,
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 8px 24px rgba(39,174,96,0.25)",
    transition: "transform 0.2s, opacity 0.3s",
  },

  // DIAGNOSIS CARDS
  symptomsReminder: {
    padding: "14px 18px",
    borderRadius: 16,
    background: "#F0FFF4",
    border: "1.5px solid #A9DFBF",
    marginBottom: 20,
  },
  reminderLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#27AE60",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reminderChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  reminderChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "white",
    border: "1.5px solid #D5F5E3",
    padding: "5px 10px",
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 700,
    color: "#2C3E50",
  },

  diagnosisGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  diagnosisCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "20px 12px",
    borderRadius: 18,
    border: "2.5px solid #E8E8E8",
    background: "white",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Nunito', sans-serif",
  },
  diagnosisName: {
    fontSize: 13,
    fontWeight: 800,
    color: "#2C3E50",
    textAlign: "center",
  },
  diagnosisDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },

  backBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 14,
    border: "2px solid #D5DBDB",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#95A5A6",
    transition: "background 0.2s",
  },

  // RESULT
  resultOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(44,62,80,0.5)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 100,
    animation: "fadeInUp 0.3s ease-out",
  },
  resultCard: {
    background: "white",
    borderRadius: 28,
    padding: "40px 36px",
    maxWidth: 460,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
    borderTop: "5px solid",
    animation: "scaleIn 0.4s ease-out",
  },
  resultEmoji: {
    fontSize: 56,
    marginBottom: 12,
    animation: "float 3s ease-in-out infinite",
  },
  resultTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 12,
  },
  resultDiagnosis: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: 600,
    marginBottom: 20,
  },
  funFact: {
    background: "#F0F9FF",
    borderRadius: 16,
    padding: "16px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#34495E",
    lineHeight: 1.6,
    textAlign: "left",
    marginBottom: 20,
    border: "1.5px solid #D4E6F6",
  },
  funFactLabel: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#3498DB",
    marginBottom: 6,
  },
  bonusBanner: {
    background: "linear-gradient(135deg, #FEF9E7, #FFF8E1)",
    border: "2px solid #F7DC6F",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 800,
    color: "#D4AC0D",
    marginBottom: 16,
  },
  gameOverBanner: {
    background: "#FDEDEC",
    border: "2px solid #F5B7B1",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 800,
    color: "#E74C3C",
    marginBottom: 16,
  },
  nextBtn: {
    width: "100%",
    padding: "16px 32px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
    color: "white",
    fontSize: 17,
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(52,152,219,0.3)",
  },

  // SUMMARY
  summaryCard: {
    background: "white",
    borderRadius: 28,
    padding: "44px 36px",
    maxWidth: 520,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
    animation: "scaleIn 0.5s ease-out",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  summaryBadge: {
    display: "inline-block",
    background: "#EBF5FB",
    color: "#2980B9",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: 2.5,
    padding: "5px 16px",
    borderRadius: 100,
    marginBottom: 14,
  },
  summaryTitle: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 24,
  },
  summaryScore: {
    marginBottom: 24,
  },
  summaryScoreNum: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 56,
    fontWeight: 700,
    background: "linear-gradient(135deg, #F39C12, #E74C3C)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  summaryScoreLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#BDC3C7",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryStats: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginBottom: 24,
    padding: "16px 0",
  },
  summaryStat: {
    textAlign: "center",
  },
  summaryStatNum: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#2C3E50",
  },
  summaryStatLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#95A5A6",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    background: "#E8E8E8",
  },
  summaryResults: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 20,
  },
  summaryRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 12,
    background: "#F8FBFF",
    fontSize: 14,
    fontWeight: 600,
  },
  summaryRowName: {
    flex: 1,
    textAlign: "left",
    color: "#2C3E50",
    fontWeight: 700,
  },
  summaryRowDiag: {
    color: "#95A5A6",
    fontSize: 12,
  },
  summaryFunFact: {
    background: "#F5EEF8",
    borderRadius: 16,
    padding: "16px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#6C3483",
    lineHeight: 1.6,
    textAlign: "left",
    marginBottom: 24,
    border: "1.5px solid #D7BDE2",
  },
};
