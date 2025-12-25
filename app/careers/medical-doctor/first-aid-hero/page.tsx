'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type TreatmentStep = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type Injury = {
  id: string;
  name: string;
  description: string;
  patient: string;
  injuryType: string;
  correctSteps: string[];
  allSteps: TreatmentStep[];
  tips: string[];
};

export default function FirstAidHeroGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'fail'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [shuffledSteps, setShuffledSteps] = useState<TreatmentStep[]>([]);

  // Shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const injuries: Injury[] = [
    {
      id: 'scraped-knee',
      name: 'Scraped Knee',
      description: 'A child fell off their bike and scraped their knee badly!',
      patient: 'Little Emma (Age 8)',
      injuryType: 'Scrape/Abrasion',
      correctSteps: ['wash', 'disinfect', 'bandage'],
      allSteps: [
        { id: 'wash', name: 'Wash with Water', icon: '💧', description: 'Clean the wound with clean water' },
        { id: 'disinfect', name: 'Apply Antiseptic', icon: '🧴', description: 'Disinfect to prevent infection' },
        { id: 'bandage', name: 'Apply Bandage', icon: '🩹', description: 'Cover with sterile bandage' },
        { id: 'ice', name: 'Apply Ice', icon: '🧊', description: 'Wrong for scrapes!' },
        { id: 'ointment', name: 'Pain Cream', icon: '💊', description: 'Not needed for scrapes' },
      ],
      tips: [
        'Always clean wounds first!',
        'Antiseptic prevents infection',
        'Keep it covered and clean'
      ]
    },
    {
      id: 'burn',
      name: 'Minor Burn',
      description: 'Someone touched a hot stove and got a small burn on their hand!',
      patient: 'Michael (Age 12)',
      injuryType: 'First-degree Burn',
      correctSteps: ['cool', 'aloe', 'cover'],
      allSteps: [
        { id: 'cool', name: 'Cool Water', icon: '💧', description: 'Run under cool water for 10-15 minutes' },
        { id: 'aloe', name: 'Aloe Vera Gel', icon: '🌿', description: 'Soothes and heals burns' },
        { id: 'cover', name: 'Loose Bandage', icon: '🩹', description: 'Protect from dirt' },
        { id: 'butter', name: 'Apply Butter', icon: '🧈', description: 'NEVER use butter on burns!' },
        { id: 'ice', name: 'Ice Pack', icon: '🧊', description: 'Too cold - can damage tissue!' },
      ],
      tips: [
        'Never use ice or butter!',
        'Cool water is best',
        'Aloe helps healing'
      ]
    },
    {
      id: 'bee-sting',
      name: 'Bee Sting',
      description: 'A bee stung someone in the park! The stinger is still in the skin.',
      patient: 'Sarah (Age 10)',
      injuryType: 'Insect Sting',
      correctSteps: ['remove', 'ice', 'cream'],
      allSteps: [
        { id: 'remove', name: 'Remove Stinger', icon: '🔪', description: 'Scrape it out gently' },
        { id: 'ice', name: 'Ice Pack', icon: '🧊', description: 'Reduces swelling' },
        { id: 'cream', name: 'Anti-itch Cream', icon: '🧴', description: 'Relieves itching' },
        { id: 'squeeze', name: 'Squeeze Area', icon: '👆', description: 'NO! Spreads venom' },
        { id: 'heat', name: 'Apply Heat', icon: '🔥', description: 'Wrong - makes it worse!' },
      ],
      tips: [
        'Remove stinger first!',
        "Don't squeeze the area",
        'Ice reduces swelling'
      ]
    }
  ];

  const currentInjury = injuries[currentLevel];

  // Shuffle steps when level changes
  useEffect(() => {
    setShuffledSteps(shuffleArray(currentInjury.allSteps));
  }, [currentLevel]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('fail');
    }
  }, [timeLeft, gameState]);

  const handleStepClick = (stepId: string) => {
    if (gameState !== 'playing') return;

    const newSteps = [...selectedSteps, stepId];
    setSelectedSteps(newSteps);

    // Check if this is the correct next step
    const correctNextStep = currentInjury.correctSteps[selectedSteps.length];
    
    if (stepId !== correctNextStep) {
      // Wrong step selected
      setGameState('fail');
      return;
    }

    // Check if all steps completed correctly
    if (newSteps.length === currentInjury.correctSteps.length) {
      const stars = calculateStars();
      setScore(score + stars);
      setGameState('success');
    }
  };

  const calculateStars = () => {
    if (timeLeft > 40) return 3;
    if (timeLeft > 20) return 2;
    return 1;
  };

  const nextLevel = () => {
    if (currentLevel < injuries.length - 1) {
      setCurrentLevel(currentLevel + 1);
      resetLevel();
    }
  };

  const resetLevel = () => {
    setSelectedSteps([]);
    setGameState('playing');
    setTimeLeft(60);
    setShowHint(false);
    setShuffledSteps(shuffleArray(currentInjury.allSteps));
  };

  const retryLevel = () => {
    resetLevel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/careers/medical-doctor" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Medical Doctor</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-2">
              🩹 First Aid Hero
            </h1>
            <p className="text-gray-600 text-lg">Level {currentLevel + 1} of {injuries.length}</p>
          </div>
          
          <div className="flex gap-4">
            {/* Score */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-300">
              <div className="flex items-center gap-2">
                <Star size={32} className="text-yellow-500" fill="currentColor" />
                <div>
                  <div className="text-2xl font-black text-yellow-600">{score}</div>
                  <div className="text-xs text-gray-600">Stars</div>
                </div>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`bg-white rounded-2xl shadow-lg p-4 border-4 ${
              timeLeft < 20 ? 'border-red-300' : 'border-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                <Clock size={32} className={timeLeft < 20 ? 'text-red-500' : 'text-blue-500'} />
                <div>
                  <div className={`text-2xl font-black ${timeLeft < 20 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </div>
                  <div className="text-xs text-gray-600">Time Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Patient & Injury */}
          <div>
            {/* Patient Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart size={32} className="text-red-500" fill="currentColor" />
                <div>
                  <h2 className="text-2xl font-black text-gray-800">{currentInjury.name}</h2>
                  <p className="text-gray-600 font-bold">{currentInjury.patient}</p>
                </div>
              </div>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 font-bold text-lg">{currentInjury.description}</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-bold mb-2">📋 Injury Type:</p>
                <p className="text-blue-900 text-xl font-black">{currentInjury.injuryType}</p>
              </div>
            </div>

            {/* Patient Illustration */}
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl shadow-xl p-8 border-4 border-blue-200">
              <div className="text-center mb-4">
                <div className="text-8xl mb-4">
                  {currentInjury.id === 'scraped-knee' && '🚴'}
                  {currentInjury.id === 'burn' && '🔥'}
                  {currentInjury.id === 'bee-sting' && '🐝'}
                </div>
                <div className="text-6xl">
                  {currentInjury.id === 'scraped-knee' && '🦵'}
                  {currentInjury.id === 'burn' && '✋'}
                  {currentInjury.id === 'bee-sting' && '💪'}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <p className="text-gray-700 font-bold mb-2">Treatment Progress:</p>
                <div className="flex gap-2">
                  {currentInjury.correctSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-4 rounded-full ${
                        index < selectedSteps.length
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hint Button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-4 rounded-2xl shadow-lg transition-all"
            >
              {showHint ? '🙈 Hide' : '💡 Need a Hint?'}
            </button>

            {showHint && (
              <div className="mt-4 bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-6">
                <h3 className="font-black text-yellow-900 text-xl mb-3">💡 First Aid Tips:</h3>
                <ul className="space-y-2">
                  {currentInjury.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
                      <span className="text-yellow-800 font-bold">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Treatment Options */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                🏥 Choose Treatment Steps
              </h3>
              
              <p className="text-gray-600 font-bold mb-6">
                Select the correct steps in the right order!
              </p>

              <div className="space-y-4">
                {shuffledSteps.map((step) => {
                  const isSelected = selectedSteps.includes(step.id);
                  const isCorrectNext = currentInjury.correctSteps[selectedSteps.length] === step.id;
                  const isUsed = selectedSteps.includes(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={isUsed || gameState !== 'playing'}
                      className={`w-full p-6 rounded-2xl border-4 font-bold text-left transition-all transform hover:scale-105 ${
                        isUsed
                          ? 'bg-green-100 border-green-400 cursor-not-allowed opacity-50'
                          : gameState === 'playing'
                          ? 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                          : 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{step.icon}</div>
                        <div className="flex-1">
                          <div className="text-xl font-black text-gray-800 mb-1">
                            {step.name}
                          </div>
                          <div className="text-gray-600">
                            {step.description}
                          </div>
                        </div>
                        {isUsed && (
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

      {/* Success Modal */}
      {gameState === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-green-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl md:text-5xl font-black text-green-600 mb-4">
                Perfect Treatment!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You saved {currentInjury.patient}!
              </p>
              
              {/* Stars */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={64}
                    className={star <= calculateStars() ? 'text-yellow-400' : 'text-gray-300'}
                    fill="currentColor"
                  />
                ))}
              </div>

              <div className="bg-green-50 border-4 border-green-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-green-900 text-xl mb-3">✅ What You Did Right:</h3>
                <ul className="space-y-2">
                  {currentInjury.correctSteps.map((stepId, index) => {
                    const step = currentInjury.allSteps.find(s => s.id === stepId);
                    return (
                      <li key={index} className="flex items-center gap-3 justify-center">
                        <span className="text-3xl">{step?.icon}</span>
                        <span className="text-green-800 font-bold text-lg">{step?.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                {currentLevel < injuries.length - 1 ? (
                  <button
                    onClick={nextLevel}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    Next Patient! 🚀
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.href = '/careers/medical-doctor'}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    Complete! 🏆
                  </button>
                )}
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
                Not Quite Right!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                {timeLeft === 0 
                  ? 'Time ran out! Try to be faster next time.'
                  : 'Wrong treatment step! Remember the correct order.'}
              </p>

              <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-red-900 text-xl mb-3">📚 Remember:</h3>
                <ul className="space-y-2">
                  {currentInjury.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 justify-center">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                      <span className="text-red-800 font-bold">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={retryLevel}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
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
