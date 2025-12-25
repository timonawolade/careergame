'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Sparkles, Trophy, Clock, Volume2, VolumeX } from 'lucide-react';

type MaterialType = 'wood' | 'steel' | 'concrete' | 'brick' | 'glass';

type BlueprintItem = {
  id: string;
  material: MaterialType;
  quantity: number;
  matched: boolean;
};

type Blueprint = {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  items: BlueprintItem[];
  timeLimit: number;
};

const MATERIALS: { type: MaterialType; name: string; icon: string; color: string }[] = [
  { type: 'wood', name: 'Wood', icon: '🪵', color: 'bg-amber-600' },
  { type: 'steel', name: 'Steel', icon: '⚙️', color: 'bg-blue-600' },
  { type: 'concrete', name: 'Concrete', icon: '🧱', color: 'bg-gray-500' },
  { type: 'brick', name: 'Brick', icon: '🟥', color: 'bg-red-600' },
  { type: 'glass', name: 'Glass', icon: '💎', color: 'bg-cyan-400' },
];

const BLUEPRINTS: Blueprint[] = [
  {
    id: 1,
    name: 'Small House Foundation',
    difficulty: 'Easy',
    timeLimit: 45,
    items: [
      { id: '1', material: 'concrete', quantity: 3, matched: false },
      { id: '2', material: 'wood', quantity: 2, matched: false },
      { id: '3', material: 'brick', quantity: 1, matched: false },
    ]
  },
  {
    id: 2,
    name: 'Office Building Frame',
    difficulty: 'Medium',
    timeLimit: 60,
    items: [
      { id: '1', material: 'steel', quantity: 4, matched: false },
      { id: '2', material: 'concrete', quantity: 3, matched: false },
      { id: '3', material: 'glass', quantity: 2, matched: false },
      { id: '4', material: 'wood', quantity: 1, matched: false },
    ]
  },
  {
    id: 3,
    name: 'Bridge Construction',
    difficulty: 'Hard',
    timeLimit: 90,
    items: [
      { id: '1', material: 'steel', quantity: 5, matched: false },
      { id: '2', material: 'concrete', quantity: 4, matched: false },
      { id: '3', material: 'wood', quantity: 2, matched: false },
      { id: '4', material: 'brick', quantity: 2, matched: false },
      { id: '5', material: 'glass', quantity: 1, matched: false },
    ]
  },
];

export default function BlueprintReader() {
  const [currentBlueprintIndex, setCurrentBlueprintIndex] = useState(0);
  const [blueprintItems, setBlueprintItems] = useState<BlueprintItem[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: number }>({});
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const failSoundRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);

  const currentBlueprint = BLUEPRINTS[currentBlueprintIndex];

  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicEnabled]);

  useEffect(() => {
    setBlueprintItems(JSON.parse(JSON.stringify(currentBlueprint.items)));
    setSelectedMaterials({});
    setTimeLeft(currentBlueprint.timeLimit);
    setGameState('playing');
    setMistakes(0);
  }, [currentBlueprintIndex]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('failed');
          if (musicEnabled) failSoundRef.current?.play().catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, musicEnabled]);

  const selectMaterial = (material: MaterialType) => {
    if (gameState !== 'playing') return;
    
    setSelectedMaterials(prev => ({
      ...prev,
      [material]: (prev[material] || 0) + 1
    }));
    
    if (musicEnabled) clickSoundRef.current?.play().catch(() => {});
  };

  const removeMaterial = (material: MaterialType) => {
    if (gameState !== 'playing') return;
    
    setSelectedMaterials(prev => {
      const newCount = Math.max(0, (prev[material] || 0) - 1);
      return {
        ...prev,
        [material]: newCount
      };
    });
  };

  const checkBlueprint = () => {
    if (gameState !== 'playing') return;

    let correct = true;
    const updatedItems = blueprintItems.map(item => {
      const selected = selectedMaterials[item.material] || 0;
      const isMatch = selected === item.quantity;
      if (!isMatch) correct = false;
      return { ...item, matched: isMatch };
    });

    setBlueprintItems(updatedItems);

    if (correct) {
      const timeBonus = Math.floor(timeLeft * 10);
      const newScore = score + 1000 + timeBonus;
      setScore(newScore);
      setGameState('success');
      if (musicEnabled) successSoundRef.current?.play().catch(() => {});
    } else {
      setMistakes(prev => prev + 1);
      if (musicEnabled) failSoundRef.current?.play().catch(() => {});
      
      if (mistakes >= 2) {
        setGameState('failed');
      }
    }
  };

  const nextBlueprint = () => {
    if (currentBlueprintIndex < BLUEPRINTS.length - 1) {
      setCurrentBlueprintIndex(prev => prev + 1);
    } else {
      // Won all blueprints!
      setCurrentBlueprintIndex(0);
    }
  };

  const resetGame = () => {
    setCurrentBlueprintIndex(0);
    setScore(0);
    setMistakes(0);
    setGameState('playing');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 p-4">
      <audio ref={bgMusicRef} src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" loop />
      <audio ref={successSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" />
      <audio ref={failSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3" />
      <audio ref={clickSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" />

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Career
        </button>
        
        <button
          onClick={() => setMusicEnabled(!musicEnabled)}
          className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {musicEnabled ? 'Sound On' : 'Sound Off'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Blueprint Reader 📋
            </h1>
            <p className="text-gray-600">Match the right materials to build according to plan!</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold text-cyan-600">{score}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-400 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">{currentBlueprint.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  currentBlueprint.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                  currentBlueprint.difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {currentBlueprint.difficulty}
                </span>
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-5 h-5" />
                  <span className={`font-bold text-lg ${timeLeft < 10 ? 'text-red-600 animate-pulse' : ''}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">Mistakes: {mistakes}/3</div>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-3">📋 Required Materials:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {blueprintItems.map((item) => {
                const material = MATERIALS.find(m => m.type === item.material)!;
                const selected = selectedMaterials[item.material] || 0;
                const isCorrect = selected === item.quantity;
                const isWrong = gameState !== 'playing' && !item.matched;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      isCorrect && gameState === 'success' ? 'border-green-500 bg-green-50' :
                      isWrong ? 'border-red-500 bg-red-50' :
                      'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${material.color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-2xl`}>
                        {material.icon}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{material.name}</div>
                        <div className="text-sm text-gray-600">Needed: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-lg font-bold ${
                        selected === item.quantity ? 'text-green-600' :
                        selected > item.quantity ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {selected}
                      </div>
                      {gameState === 'success' && item.matched && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {isWrong && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm">
              <p className="font-bold text-yellow-900 mb-2">📖 How to Play:</p>
              <ul className="text-yellow-800 space-y-1">
                <li>• Click materials below to select them</li>
                <li>• Match the exact quantities shown in the blueprint</li>
                <li>• Click "Check Blueprint" when ready</li>
                <li>• 3 mistakes and you fail! ⚠️</li>
              </ul>
            </div>
          </div>
        </div>

        {gameState === 'playing' && (
          <>
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">🔧 Select Materials:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {MATERIALS.map((material) => (
                  <div key={material.type} className="text-center">
                    <button
                      onClick={() => selectMaterial(material.type)}
                      className={`${material.color} hover:opacity-80 text-white w-full py-8 rounded-xl font-bold transition-all hover:scale-105 text-4xl`}
                    >
                      {material.icon}
                    </button>
                    <div className="mt-2">
                      <div className="font-bold text-gray-800">{material.name}</div>
                      <div className="text-sm text-gray-600">
                        Selected: {selectedMaterials[material.type] || 0}
                      </div>
                      {(selectedMaterials[material.type] || 0) > 0 && (
                        <button
                          onClick={() => removeMaterial(material.type)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Remove one
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={checkBlueprint}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-6 h-6" />
              Check Blueprint
            </button>
          </>
        )}

        {gameState === 'success' && (
          <div className="text-center">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl font-bold mb-4 text-xl flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8" />
              Perfect Match! Blueprint Complete! 🎉
            </div>
            {currentBlueprintIndex < BLUEPRINTS.length - 1 ? (
              <button
                onClick={nextBlueprint}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Next Blueprint
              </button>
            ) : (
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                You Completed All Blueprints! Play Again?
              </button>
            )}
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-center">
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl font-bold mb-4 text-xl">
              {timeLeft === 0 ? '⏰ Time\'s Up!' : '❌ Too Many Mistakes!'}
            </div>
            <button
              onClick={() => setGameState('playing')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
