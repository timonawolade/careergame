'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, Brain, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import Link from 'next/link';

type Symptom = {
  text: string;
  severity: 'mild' | 'moderate' | 'severe';
};

type Disease = {
  id: string;
  name: string;
  commonSymptoms: string[];
  icon: string;
};

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: Symptom[];
  correctDiagnosis: string;
  hint: string;
};

type Level = {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patients: Patient[];
  availableDiseases: Disease[];
  patientsToSolve: number;
};

export default function DiagnosisDetectiveGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentPatient, setCurrentPatient] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'fail' | 'complete'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const diseases: Disease[] = [
    {
      id: 'common-cold',
      name: 'Common Cold',
      commonSymptoms: ['Runny nose', 'Sneezing', 'Sore throat', 'Mild cough'],
      icon: '🤧'
    },
    {
      id: 'flu',
      name: 'Influenza (Flu)',
      commonSymptoms: ['High fever', 'Body aches', 'Fatigue', 'Dry cough'],
      icon: '🤒'
    },
    {
      id: 'strep-throat',
      name: 'Strep Throat',
      commonSymptoms: ['Severe sore throat', 'Painful swallowing', 'Fever', 'Swollen lymph nodes'],
      icon: '😷'
    },
    {
      id: 'allergies',
      name: 'Seasonal Allergies',
      commonSymptoms: ['Itchy eyes', 'Sneezing', 'Runny nose', 'No fever'],
      icon: '🌸'
    },
    {
      id: 'stomach-bug',
      name: 'Stomach Bug',
      commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach cramps'],
      icon: '🤢'
    },
    {
      id: 'migraine',
      name: 'Migraine',
      commonSymptoms: ['Severe headache', 'Light sensitivity', 'Nausea', 'Throbbing pain'],
      icon: '🤕'
    },
    {
      id: 'ear-infection',
      name: 'Ear Infection',
      commonSymptoms: ['Ear pain', 'Fever', 'Difficulty hearing', 'Fluid drainage'],
      icon: '👂'
    },
    {
      id: 'pink-eye',
      name: 'Pink Eye',
      commonSymptoms: ['Red eyes', 'Itchy eyes', 'Watery discharge', 'Crusty eyelids'],
      icon: '👁️'
    },
    {
      id: 'sprained-ankle',
      name: 'Sprained Ankle',
      commonSymptoms: ['Ankle pain', 'Swelling', 'Difficulty walking', 'Bruising'],
      icon: '🦶'
    },
    {
      id: 'asthma',
      name: 'Asthma Attack',
      commonSymptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
      icon: '🫁'
    }
  ];

  const levels: Level[] = [
    {
      id: 1,
      name: 'Medical Student',
      difficulty: 'Easy',
      patientsToSolve: 3,
      availableDiseases: diseases.slice(0, 4),
      patients: [
        {
          id: 'p1',
          name: 'Tommy',
          age: 8,
          gender: 'male',
          symptoms: [
            { text: 'Runny nose', severity: 'mild' },
            { text: 'Sneezing a lot', severity: 'mild' },
            { text: 'Sore throat', severity: 'mild' },
            { text: 'Mild cough', severity: 'mild' }
          ],
          correctDiagnosis: 'common-cold',
          hint: 'This is very common, especially in winter. No high fever!'
        },
        {
          id: 'p2',
          name: 'Sarah',
          age: 12,
          gender: 'female',
          symptoms: [
            { text: 'High fever (102°F)', severity: 'severe' },
            { text: 'Whole body aches', severity: 'moderate' },
            { text: 'Very tired', severity: 'moderate' },
            { text: 'Dry cough', severity: 'moderate' }
          ],
          correctDiagnosis: 'flu',
          hint: 'Much worse than a cold. High fever and body aches are key!'
        },
        {
          id: 'p3',
          name: 'Emma',
          age: 10,
          gender: 'female',
          symptoms: [
            { text: 'Very itchy eyes', severity: 'moderate' },
            { text: 'Sneezing fits', severity: 'mild' },
            { text: 'Clear runny nose', severity: 'mild' },
            { text: 'No fever at all', severity: 'mild' }
          ],
          correctDiagnosis: 'allergies',
          hint: 'Happens in spring/summer. No fever is a big clue!'
        }
      ]
    },
    {
      id: 2,
      name: 'Junior Doctor',
      difficulty: 'Medium',
      patientsToSolve: 4,
      availableDiseases: diseases.slice(0, 7),
      patients: [
        {
          id: 'p4',
          name: 'Jake',
          age: 9,
          gender: 'male',
          symptoms: [
            { text: 'Severe sore throat', severity: 'severe' },
            { text: 'Painful to swallow', severity: 'severe' },
            { text: 'Fever (101°F)', severity: 'moderate' },
            { text: 'Swollen neck glands', severity: 'moderate' }
          ],
          correctDiagnosis: 'strep-throat',
          hint: 'Throat pain is the main problem. Needs antibiotics!'
        },
        {
          id: 'p5',
          name: 'Mia',
          age: 7,
          gender: 'female',
          symptoms: [
            { text: 'Nausea and vomiting', severity: 'severe' },
            { text: 'Diarrhea', severity: 'moderate' },
            { text: 'Stomach cramps', severity: 'moderate' },
            { text: 'No appetite', severity: 'mild' }
          ],
          correctDiagnosis: 'stomach-bug',
          hint: 'Tummy troubles! Usually goes away in 1-2 days.'
        },
        {
          id: 'p6',
          name: 'Olivia',
          age: 14,
          gender: 'female',
          symptoms: [
            { text: 'Severe pounding headache', severity: 'severe' },
            { text: 'Light hurts eyes', severity: 'moderate' },
            { text: 'Feeling nauseous', severity: 'moderate' },
            { text: 'Throbbing on one side', severity: 'severe' }
          ],
          correctDiagnosis: 'migraine',
          hint: 'Bad headache that can last hours. Light makes it worse!'
        },
        {
          id: 'p7',
          name: 'Lucas',
          age: 6,
          gender: 'male',
          symptoms: [
            { text: 'Ear pain', severity: 'severe' },
            { text: 'Fever (100°F)', severity: 'mild' },
            { text: 'Hard to hear', severity: 'moderate' },
            { text: 'Fluid from ear', severity: 'moderate' }
          ],
          correctDiagnosis: 'ear-infection',
          hint: 'Common in young kids. Ear is the main problem!'
        }
      ]
    },
    {
      id: 3,
      name: 'Expert Diagnostician',
      difficulty: 'Hard',
      patientsToSolve: 5,
      availableDiseases: diseases,
      patients: [
        {
          id: 'p8',
          name: 'Sophia',
          age: 11,
          gender: 'female',
          symptoms: [
            { text: 'Red, bloodshot eyes', severity: 'moderate' },
            { text: 'Very itchy eyes', severity: 'moderate' },
            { text: 'Yellow discharge', severity: 'mild' },
            { text: 'Crusty eyelids in morning', severity: 'mild' }
          ],
          correctDiagnosis: 'pink-eye',
          hint: 'Very contagious! Eyes are red and crusty.'
        },
        {
          id: 'p9',
          name: 'Mason',
          age: 13,
          gender: 'male',
          symptoms: [
            { text: 'Ankle hurts a lot', severity: 'severe' },
            { text: 'Swollen ankle', severity: 'moderate' },
            { text: 'Hard to walk', severity: 'severe' },
            { text: 'Purple bruising', severity: 'moderate' }
          ],
          correctDiagnosis: 'sprained-ankle',
          hint: 'Injury, not illness! Twisted during sports.'
        },
        {
          id: 'p10',
          name: 'Ava',
          age: 9,
          gender: 'female',
          symptoms: [
            { text: 'Wheezing sounds', severity: 'severe' },
            { text: 'Short of breath', severity: 'severe' },
            { text: 'Chest feels tight', severity: 'moderate' },
            { text: 'Coughing fits', severity: 'moderate' }
          ],
          correctDiagnosis: 'asthma',
          hint: 'Breathing problem. Needs inhaler!'
        },
        {
          id: 'p11',
          name: 'Ethan',
          age: 8,
          gender: 'male',
          symptoms: [
            { text: 'High fever (103°F)', severity: 'severe' },
            { text: 'Severe body aches', severity: 'severe' },
            { text: 'Extreme fatigue', severity: 'severe' },
            { text: 'Chills and sweating', severity: 'moderate' }
          ],
          correctDiagnosis: 'flu',
          hint: 'Very high fever! Worse than a cold.'
        },
        {
          id: 'p12',
          name: 'Isabella',
          age: 10,
          gender: 'female',
          symptoms: [
            { text: 'Throat extremely sore', severity: 'severe' },
            { text: 'White patches in throat', severity: 'moderate' },
            { text: 'Fever (102°F)', severity: 'moderate' },
            { text: 'Swollen tonsils', severity: 'severe' }
          ],
          correctDiagnosis: 'strep-throat',
          hint: 'White patches are a key sign! Bacterial infection.'
        }
      ]
    }
  ];

  const currentLevelData = levels[currentLevel];
  const currentPatientData = currentLevelData.patients[currentPatient];

  const handleDiagnosisSelect = (diagnosisId: string) => {
    setSelectedDiagnosis(diagnosisId);
    
    if (diagnosisId === currentPatientData.correctDiagnosis) {
      setFeedback('correct');
      setScore(score + 100);
      
      setTimeout(() => {
        if (currentPatient < currentLevelData.patientsToSolve - 1) {
          // More patients in this level
          setCurrentPatient(currentPatient + 1);
          resetPatient();
        } else if (currentLevel < levels.length - 1) {
          // Level complete, more levels available
          setGameState('success');
        } else {
          // All levels complete!
          setGameState('complete');
        }
      }, 2000);
    } else {
      setFeedback('incorrect');
      setLives(lives - 1);
      
      if (lives - 1 <= 0) {
        setTimeout(() => {
          setGameState('fail');
        }, 2000);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setSelectedDiagnosis(null);
        }, 2000);
      }
    }
  };

  const resetPatient = () => {
    setSelectedDiagnosis(null);
    setFeedback(null);
    setShowHint(false);
  };

  const nextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setCurrentPatient(0);
    setLives(3);
    setGameState('playing');
    resetPatient();
  };

  const retryLevel = () => {
    setCurrentPatient(0);
    setLives(3);
    setGameState('playing');
    resetPatient();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/careers/medical-doctor" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Medical Doctor</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
              🔍 Diagnosis Detective
            </h1>
            <p className="text-gray-600 text-lg">
              Level {currentLevel + 1}: {currentLevelData.name} - Patient {currentPatient + 1}/{currentLevelData.patientsToSolve}
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Lives */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-red-300">
              <div className="flex items-center gap-2">
                <Heart size={32} className="text-red-500" fill={lives > 0 ? 'currentColor' : 'none'} />
                <div>
                  <div className="text-2xl font-black text-red-600">×{lives}</div>
                  <div className="text-xs text-gray-600">Lives</div>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-300">
              <div className="flex items-center gap-2">
                <Star size={32} className="text-yellow-500" fill="currentColor" />
                <div>
                  <div className="text-2xl font-black text-yellow-600">{score}</div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Patient Info */}
          <div>
            {/* Patient Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">
                  {currentPatientData.gender === 'male' ? '👦' : '👧'}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">{currentPatientData.name}</h2>
                  <p className="text-gray-600 font-bold text-lg">Age: {currentPatientData.age} • {currentPatientData.gender === 'male' ? 'Male' : 'Female'}</p>
                </div>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                <h3 className="font-black text-purple-900 text-xl mb-3 flex items-center gap-2">
                  <AlertTriangle size={24} />
                  Symptoms:
                </h3>
                <div className="space-y-2">
                  {currentPatientData.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        symptom.severity === 'severe' ? 'bg-red-100 border-2 border-red-300' :
                        symptom.severity === 'moderate' ? 'bg-yellow-100 border-2 border-yellow-300' :
                        'bg-blue-100 border-2 border-blue-300'
                      }`}
                    >
                      <div className="text-2xl">
                        {symptom.severity === 'severe' ? '🔴' : symptom.severity === 'moderate' ? '🟡' : '🔵'}
                      </div>
                      <span className={`font-bold text-lg ${
                        symptom.severity === 'severe' ? 'text-red-900' :
                        symptom.severity === 'moderate' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {symptom.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-bold text-lg">
                  💭 <span className="italic">"{currentPatientData.name} is waiting for your diagnosis..."</span>
                </p>
              </div>
            </div>

            {/* Hint Button */}
            <button
              onClick={() => setShowHint(!showHint)}
              disabled={feedback !== null}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showHint ? '🙈 Hide Hint' : '💡 Need a Hint?'}
            </button>

            {showHint && (
              <div className="mt-4 bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-6">
                <h3 className="font-black text-yellow-900 text-xl mb-3">💡 Doctor's Hint:</h3>
                <p className="text-yellow-800 font-bold text-lg">
                  {currentPatientData.hint}
                </p>
              </div>
            )}
          </div>

          {/* Right: Diagnosis Options */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200">
              <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Brain size={32} className="text-purple-600" />
                What's Your Diagnosis?
              </h3>
              
              <p className="text-gray-600 font-bold mb-6">
                Choose the correct diagnosis based on the symptoms:
              </p>

              <div className="space-y-4">
                {currentLevelData.availableDiseases.map((disease) => {
                  const isSelected = selectedDiagnosis === disease.id;
                  const isCorrect = disease.id === currentPatientData.correctDiagnosis;
                  
                  let bgColor = 'bg-white border-gray-300';
                  if (feedback && isSelected) {
                    bgColor = feedback === 'correct' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
                  } else if (feedback === 'incorrect' && isCorrect) {
                    bgColor = 'bg-green-100 border-green-400';
                  }
                  
                  return (
                    <button
                      key={disease.id}
                      onClick={() => handleDiagnosisSelect(disease.id)}
                      disabled={feedback !== null}
                      className={`w-full p-6 rounded-2xl border-4 font-bold text-left transition-all transform hover:scale-105 ${bgColor} ${
                        feedback === null ? 'hover:border-purple-400 hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{disease.icon}</div>
                        <div className="flex-1">
                          <div className="text-xl font-black text-gray-800">
                            {disease.name}
                          </div>
                        </div>
                        {feedback && isSelected && (
                          feedback === 'correct' ? (
                            <CheckCircle size={32} className="text-green-500" />
                          ) : (
                            <XCircle size={32} className="text-red-500" />
                          )
                        )}
                        {feedback === 'incorrect' && isCorrect && (
                          <CheckCircle size={32} className="text-green-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Level Complete */}
      {gameState === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-green-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl md:text-5xl font-black text-green-600 mb-4">
                Level Complete!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You diagnosed all {currentLevelData.patientsToSolve} patients correctly!
              </p>
              
              <div className="bg-green-50 border-4 border-green-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-green-900 text-xl mb-3">🏆 Level Stats:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-green-600">{currentLevelData.patientsToSolve}</div>
                    <div className="text-gray-600 font-bold">Patients Saved</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-yellow-600">{score}</div>
                    <div className="text-gray-600 font-bold">Total Points</div>
                  </div>
                </div>
              </div>

              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Next Level! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal - All Levels Done */}
      {gameState === 'complete' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-yellow-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="text-4xl md:text-5xl font-black text-yellow-600 mb-4">
                Expert Diagnostician!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You completed ALL levels! You're a medical genius!
              </p>
              
              <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-yellow-900 text-xl mb-3">🌟 Final Stats:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-green-600">12</div>
                    <div className="text-gray-600 font-bold text-sm">Patients Saved</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-yellow-600">{score}</div>
                    <div className="text-gray-600 font-bold text-sm">Total Points</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-purple-600">3</div>
                    <div className="text-gray-600 font-bold text-sm">Levels Mastered</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/careers/medical-doctor'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Back to Medical Doctor 🩺
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fail Modal */}
      {gameState === 'fail' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-red-400">
            <div className="text-center">
              <div className="text-8xl mb-4">😢</div>
              <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
                Out of Lives!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                The patient needed help faster. Study the symptoms and try again!
              </p>

              <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-red-900 text-xl mb-3">📚 Study Tip:</h3>
                <p className="text-red-800 font-bold">
                  Pay attention to ALL the symptoms! Sometimes one key symptom helps identify the disease.
                </p>
              </div>

              <button
                onClick={retryLevel}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Try Again! 💪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
