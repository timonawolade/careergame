'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Star, Scissors, Clock, Target, Trophy, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type SurgeryType = 'stitch' | 'splinter' | 'bone';

type Surgery = {
  id: string;
  type: SurgeryType;
  name: string;
  patient: string;
  description: string;
  icon: string;
  timeLimit: number;
  instructions: string[];
  tips: string[];
};

type StitchPoint = {
  x: number;
  y: number;
  completed: boolean;
};

export default function SurgerySimulatorGame() {
  const [currentSurgery, setCurrentSurgery] = useState(0);
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'success' | 'fail' | 'complete'>('instructions');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [precision, setPrecision] = useState(100);
  
  // Stitch game state
  const [stitchPoints, setStitchPoints] = useState<StitchPoint[]>([]);
  const [currentStitch, setCurrentStitch] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Splinter game state
  const [splinterPosition, setSplinterPosition] = useState({ x: 50, y: 50 });
  const [tweezersPosition, setTweezersPosition] = useState({ x: 20, y: 20 });
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  
  // Bone game state
  const [boneAngle, setBoneAngle] = useState(45);
  const [targetAngle] = useState(0);
  const [isAligned, setIsAligned] = useState(false);

  const surgeries: Surgery[] = [
    {
      id: 'stitch',
      type: 'stitch',
      name: 'Stitch a Wound',
      patient: 'Alex (Age 15)',
      description: 'Patient has a 3-inch laceration that needs stitching.',
      icon: '🧵',
      timeLimit: 60,
      instructions: [
        'Click on each stitch point in order',
        'Connect all points to close the wound',
        'Work carefully - shaky hands reduce precision!',
        'Complete before time runs out'
      ],
      tips: [
        'Start from one end and work methodically',
        'Steady hands = higher score',
        'Real surgeons practice for years!'
      ]
    },
    {
      id: 'splinter',
      type: 'splinter',
      name: 'Remove Splinter',
      patient: 'Jamie (Age 10)',
      description: 'Patient has a large splinter embedded in their finger.',
      icon: '🪡',
      timeLimit: 45,
      instructions: [
        'Move tweezers to the splinter',
        'Click and hold to extract carefully',
        'Keep tweezers steady during extraction',
        'Any shake will cause pain!'
      ],
      tips: [
        'Line up tweezers perfectly before extracting',
        'Pull straight out, not at an angle',
        'Slow and steady wins the race'
      ]
    },
    {
      id: 'bone',
      type: 'bone',
      name: 'Set Broken Bone',
      patient: 'Taylor (Age 12)',
      description: 'Patient has a fractured arm bone that needs alignment.',
      icon: '🦴',
      timeLimit: 50,
      instructions: [
        'Use arrow keys or slider to rotate bone',
        'Align the bone fragments perfectly (0°)',
        'Green zone = correct alignment',
        'Hold alignment for 3 seconds to set'
      ],
      tips: [
        'Real fractures must be aligned precisely',
        'Misalignment causes improper healing',
        'Take your time to get it right'
      ]
    }
  ];

  const currentSurgeryData = surgeries[currentSurgery];

  // Initialize stitch points
  useEffect(() => {
    if (currentSurgeryData.type === 'stitch' && gameState === 'playing') {
      const points: StitchPoint[] = [
        { x: 150, y: 200, completed: false },
        { x: 200, y: 180, completed: false },
        { x: 250, y: 200, completed: false },
        { x: 300, y: 180, completed: false },
        { x: 350, y: 200, completed: false },
        { x: 400, y: 180, completed: false },
        { x: 450, y: 200, completed: false }
      ];
      setStitchPoints(points);
      setCurrentStitch(0);
    }
  }, [currentSurgeryData.type, gameState]);

  // Draw stitch canvas
  useEffect(() => {
    if (currentSurgeryData.type === 'stitch' && canvasRef.current && gameState === 'playing') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wound
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.quadraticCurveTo(300, 150, 500, 200);
      ctx.stroke();

      // Draw completed stitches
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      for (let i = 0; i < currentStitch; i++) {
        if (i < stitchPoints.length - 1) {
          ctx.beginPath();
          ctx.moveTo(stitchPoints[i].x, stitchPoints[i].y);
          ctx.lineTo(stitchPoints[i + 1].x, stitchPoints[i + 1].y);
          ctx.stroke();
        }
      }

      // Draw stitch points
      stitchPoints.forEach((point, index) => {
        if (index < currentStitch) {
          ctx.fillStyle = '#10b981';
        } else if (index === currentStitch) {
          ctx.fillStyle = '#3b82f6';
        } else {
          ctx.fillStyle = '#9ca3af';
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Number
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), point.x, point.y);
      });
    }
  }, [stitchPoints, currentStitch, currentSurgeryData.type, gameState]);

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

  // Bone alignment checker
  useEffect(() => {
    if (currentSurgeryData.type === 'bone' && gameState === 'playing') {
      const diff = Math.abs(boneAngle - targetAngle);
      if (diff <= 5) {
        if (!isAligned) {
          setIsAligned(true);
          // Hold for 3 seconds
          setTimeout(() => {
            if (Math.abs(boneAngle - targetAngle) <= 5) {
              completeSurgery(95);
            }
          }, 3000);
        }
      } else {
        setIsAligned(false);
      }
    }
  }, [boneAngle, currentSurgeryData.type, gameState, isAligned, targetAngle]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentSurgeryData.type !== 'stitch' || gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentPoint = stitchPoints[currentStitch];
    const distance = Math.sqrt(Math.pow(x - currentPoint.x, 2) + Math.pow(y - currentPoint.y, 2));

    if (distance < 20) {
      // Good precision
      const newPrecision = Math.max(70, precision - Math.floor(distance / 2));
      setPrecision(newPrecision);
      
      const newStitch = currentStitch + 1;
      setCurrentStitch(newStitch);

      if (newStitch >= stitchPoints.length) {
        completeSurgery(newPrecision);
      }
    } else {
      // Missed - reduce precision
      setPrecision(Math.max(50, precision - 10));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentSurgeryData.type === 'splinter' && gameState === 'playing') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTweezersPosition({ x, y });

      // Check if over splinter during extraction
      if (isExtracting) {
        const dx = Math.abs(x - splinterPosition.x);
        const dy = Math.abs(y - splinterPosition.y);
        
        if (dx > 5 || dy > 5) {
          // Moved too much - fail
          setIsExtracting(false);
          setExtractionProgress(0);
          setPrecision(Math.max(50, precision - 15));
        }
      }
    }
  };

  const handleSplinterExtract = () => {
    if (currentSurgeryData.type !== 'splinter' || gameState !== 'playing') return;

    const dx = Math.abs(tweezersPosition.x - splinterPosition.x);
    const dy = Math.abs(tweezersPosition.y - splinterPosition.y);

    if (dx < 5 && dy < 5) {
      setIsExtracting(true);
      
      const interval = setInterval(() => {
        setExtractionProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            completeSurgery(precision);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
  };

  const completeSurgery = (finalPrecision: number) => {
    const points = Math.floor(finalPrecision * 10);
    setScore(score + points);
    
    setTimeout(() => {
      if (currentSurgery < surgeries.length - 1) {
        setGameState('success');
      } else {
        setGameState('complete');
      }
    }, 500);
  };

  const startSurgery = () => {
    setGameState('playing');
    setTimeLeft(currentSurgeryData.timeLimit);
    setPrecision(100);
    setIsAligned(false);
    setBoneAngle(45);
  };

  const nextSurgery = () => {
    setCurrentSurgery(currentSurgery + 1);
    setGameState('instructions');
  };

  const retrySurgery = () => {
    setGameState('instructions');
  };

  const calculateStars = () => {
    if (precision >= 90) return 3;
    if (precision >= 75) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/careers/medical-doctor" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Medical Doctor</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
              💉 Surgery Simulator
            </h1>
            <p className="text-gray-600 text-lg">Surgery {currentSurgery + 1} of {surgeries.length}</p>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex gap-4">
              {/* Timer */}
              <div className={`bg-white rounded-2xl shadow-lg p-4 border-4 ${
                timeLeft < 15 ? 'border-red-300' : 'border-blue-300'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock size={32} className={timeLeft < 15 ? 'text-red-500' : 'text-blue-500'} />
                  <div>
                    <div className={`text-2xl font-black ${timeLeft < 15 ? 'text-red-600' : 'text-blue-600'}`}>
                      {timeLeft}s
                    </div>
                    <div className="text-xs text-gray-600">Time Left</div>
                  </div>
                </div>
              </div>
              
              {/* Precision */}
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-green-300">
                <div className="flex items-center gap-2">
                  <Target size={32} className="text-green-500" />
                  <div>
                    <div className="text-2xl font-black text-green-600">{precision}%</div>
                    <div className="text-xs text-gray-600">Precision</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Screen */}
      {gameState === 'instructions' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{currentSurgeryData.icon}</div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">{currentSurgeryData.name}</h2>
              <p className="text-xl text-gray-600 font-bold">{currentSurgeryData.patient}</p>
            </div>

            <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 mb-6">
              <p className="text-red-800 font-bold text-xl">{currentSurgeryData.description}</p>
            </div>

            <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-blue-900 text-2xl mb-4 flex items-center gap-2">
                <Scissors size={28} />
                How to Perform:
              </h3>
              <ol className="space-y-3">
                {currentSurgeryData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <span className="text-blue-900 font-bold text-lg">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-yellow-900 text-xl mb-3">💡 Surgical Tips:</h3>
              <ul className="space-y-2">
                {currentSurgeryData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
                    <span className="text-yellow-800 font-bold">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={startSurgery}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Begin Surgery! 🏥
            </button>
          </div>
        </div>
      )}

      {/* Stitch Surgery */}
      {gameState === 'playing' && currentSurgeryData.type === 'stitch' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
            <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
              Click on each stitch point in order (1 → 7)
            </h3>
            
            <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onClick={handleCanvasClick}
                className="cursor-crosshair border-4 border-gray-300 rounded-xl bg-pink-50"
              />
            </div>

            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 font-bold text-center">
                Progress: {currentStitch} / {stitchPoints.length} stitches completed
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Splinter Surgery */}
      {gameState === 'playing' && currentSurgeryData.type === 'splinter' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
            <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
              Move tweezers to splinter, then click and hold to extract
            </h3>
            
            <div
              className="relative bg-pink-100 rounded-2xl border-4 border-pink-300 overflow-hidden"
              style={{ height: '400px' }}
              onMouseMove={handleMouseMove}
              onMouseDown={handleSplinterExtract}
              onMouseUp={() => {
                setIsExtracting(false);
                setExtractionProgress(0);
              }}
            >
              {/* Finger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl opacity-50">👆</div>
              </div>

              {/* Splinter */}
              <div
                className="absolute w-16 h-2 bg-amber-800 rounded-full transform -rotate-45"
                style={{
                  left: `${splinterPosition.x}%`,
                  top: `${splinterPosition.y}%`,
                  transform: 'translate(-50%, -50%) rotate(-45deg)'
                }}
              />

              {/* Tweezers */}
              <div
                className="absolute text-4xl transform"
                style={{
                  left: `${tweezersPosition.x}%`,
                  top: `${tweezersPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'none'
                }}
              >
                🔧
              </div>

              {/* Extraction progress */}
              {isExtracting && extractionProgress > 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-full px-6 py-3 shadow-lg border-4 border-green-400">
                    <div className="flex items-center gap-3">
                      <div className="text-green-600 font-black text-xl">Extracting...</div>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${extractionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 font-bold text-center">
                💡 Keep tweezers perfectly still while extracting!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bone Surgery */}
      {gameState === 'playing' && currentSurgeryData.type === 'bone' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
            <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
              Rotate bone to 0° and hold for 3 seconds
            </h3>
            
            <div className="bg-gray-100 rounded-2xl p-8">
              {/* Bone display */}
              <div className="relative h-64 flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Left bone fragment (fixed) */}
                  <div className="absolute left-1/4 text-6xl">🦴</div>
                  
                  {/* Right bone fragment (rotatable) */}
                  <div
                    className="absolute right-1/4 text-6xl transition-transform"
                    style={{
                      transform: `rotate(${boneAngle}deg)`,
                      transformOrigin: 'left center'
                    }}
                  >
                    🦴
                  </div>
                </div>

                {/* Alignment indicator */}
                {isAligned && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-full font-black text-xl animate-pulse">
                      ✓ ALIGNED - Hold Position!
                    </div>
                  </div>
                )}
              </div>

              {/* Angle indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">Current Angle:</span>
                  <span className={`font-black text-2xl ${
                    Math.abs(boneAngle - targetAngle) <= 5 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {boneAngle.toFixed(1)}°
                  </span>
                </div>
                <div className="relative h-8 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full w-12 transition-all ${
                      Math.abs(boneAngle - targetAngle) <= 5 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      left: `${((boneAngle + 90) / 180) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                  {/* Target zone */}
                  <div
                    className="absolute h-full w-16 bg-green-200 opacity-50"
                    style={{
                      left: `${((targetAngle + 90) / 180) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              </div>

              {/* Slider control */}
              <div className="mb-4">
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={boneAngle}
                  onChange={(e) => setBoneAngle(Number(e.target.value))}
                  className="w-full h-4 bg-gray-300 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: Math.abs(boneAngle - targetAngle) <= 5 ? '#10b981' : '#ef4444'
                  }}
                />
              </div>

              {/* Keyboard hint */}
              <div className="text-center text-gray-600 font-bold">
                Use slider or arrow keys ← → to rotate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {gameState === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-green-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl md:text-5xl font-black text-green-600 mb-4">
                Surgery Successful!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                Patient is recovering well!
              </p>
              
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-green-600">{precision}%</div>
                    <div className="text-gray-600 font-bold">Precision</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-blue-600">{Math.floor(precision * 10)}</div>
                    <div className="text-gray-600 font-bold">Points Earned</div>
                  </div>
                </div>
              </div>

              <button
                onClick={nextSurgery}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Next Patient! 🚑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {gameState === 'complete' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-yellow-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="text-4xl md:text-5xl font-black text-yellow-600 mb-4">
                Master Surgeon!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You completed all surgeries! Amazing work!
              </p>
              
              <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-green-600">3</div>
                    <div className="text-gray-600 font-bold">Surgeries Complete</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-yellow-600">{score}</div>
                    <div className="text-gray-600 font-bold">Total Points</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/careers/medical-doctor'}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Back to Medical Doctor 🩺
              </button>
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
                Time's Up!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                The patient needed faster treatment. Practice makes perfect!
              </p>

              <button
                onClick={retrySurgery}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Try Again! 💪
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard controls for bone game */}
      {gameState === 'playing' && currentSurgeryData.type === 'bone' && (
        <div style={{ display: 'none' }}>
          <input
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                setBoneAngle(Math.max(-90, boneAngle - 2));
              } else if (e.key === 'ArrowRight') {
                setBoneAngle(Math.min(90, boneAngle + 2));
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
