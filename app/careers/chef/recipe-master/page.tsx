'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Star, Trophy, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import soundManager from '@/lib/soundManager';

type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  used: boolean;
};

export default function RecipeMasterGame() {
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'success' | 'fail'>('instructions');
  const [cookingStage, setCookingStage] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'wrong', message: string } | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [displayIngredients, setDisplayIngredients] = useState<Ingredient[]>([]); // Randomized display order
  
  // Sound management
  const cookingSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Cleanup all sounds on unmount
  useEffect(() => {
    return () => {
      // Stop all sounds when component unmounts
      if (cookingSoundRef.current) {
        soundManager.stop(cookingSoundRef.current);
        cookingSoundRef.current = null;
      }
      soundManager.stopAll();
    };
  }, []);

  const recipes = [
    {
      id: 'scrambled-eggs',
      name: 'Scrambled Eggs',
      emoji: '🍳',
      description: 'A simple and delicious breakfast!',
      ingredients: [
        { id: 'eggs', name: 'Eggs', emoji: '🥚', used: false },
        { id: 'milk', name: 'Milk', emoji: '🥛', used: false },
        { id: 'butter', name: 'Butter', emoji: '🧈', used: false },
        { id: 'salt', name: 'Salt', emoji: '🧂', used: false },
        { id: 'pepper', name: 'Pepper', emoji: '🌶️', used: false },
      ],
      correctOrder: ['eggs', 'milk', 'butter', 'salt', 'pepper']
    },
    {
      id: 'pancakes',
      name: 'Fluffy Pancakes',
      emoji: '🥞',
      description: 'Sweet breakfast treat!',
      ingredients: [
        { id: 'flour', name: 'Flour', emoji: '🌾', used: false },
        { id: 'eggs', name: 'Eggs', emoji: '🥚', used: false },
        { id: 'milk', name: 'Milk', emoji: '🥛', used: false },
        { id: 'sugar', name: 'Sugar', emoji: '🍯', used: false },
        { id: 'butter', name: 'Butter', emoji: '🧈', used: false },
      ],
      correctOrder: ['flour', 'eggs', 'milk', 'sugar', 'butter']
    },
    {
      id: 'fruit-salad',
      name: 'Fresh Fruit Salad',
      emoji: '🥗',
      description: 'Healthy and colorful!',
      ingredients: [
        { id: 'apple', name: 'Apple', emoji: '🍎', used: false },
        { id: 'banana', name: 'Banana', emoji: '🍌', used: false },
        { id: 'orange', name: 'Orange', emoji: '🍊', used: false },
        { id: 'grapes', name: 'Grapes', emoji: '🍇', used: false },
        { id: 'honey', name: 'Honey', emoji: '🍯', used: false },
      ],
      correctOrder: ['apple', 'banana', 'orange', 'grapes', 'honey']
    }
  ];

  const currentRecipeData = recipes[currentRecipe];

  useEffect(() => {
    if (gameState === 'playing') {
      const ingredientsCopy = currentRecipeData.ingredients.map(ing => ({ ...ing, used: false }));
      setIngredients(ingredientsCopy);
      
      // Randomize the display order so kids have to think!
      const shuffled = [...ingredientsCopy].sort(() => Math.random() - 0.5);
      setDisplayIngredients(shuffled);
      
      setCookingStage(0);
      // Start cooking background sound
      cookingSoundRef.current = soundManager.playCooking();
    } else {
      // Stop cooking sound when game ends
      if (cookingSoundRef.current) {
        soundManager.stop(cookingSoundRef.current);
        cookingSoundRef.current = null;
      }
    }
    
    // Cleanup on state change
    return () => {
      if (cookingSoundRef.current) {
        soundManager.stop(cookingSoundRef.current);
        cookingSoundRef.current = null;
      }
    };
  }, [gameState, currentRecipe]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('fail');
    }
  }, [timeLeft, gameState]);

  const handleDragStart = (ingredientId: string) => {
    setDraggedItem(ingredientId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const droppedIngredient = ingredients.find(ing => ing.id === draggedItem);
    if (!droppedIngredient || droppedIngredient.used) return;

    const correctIngredient = currentRecipeData.correctOrder[currentStep];

    if (draggedItem === correctIngredient) {
      // Play correct sound
      soundManager.playCorrect();
      
      setShowFeedback({ type: 'correct', message: 'Perfect! ✨' });
      setScore(score + 100);
      
      setIngredients(prev => prev.map(ing => 
        ing.id === draggedItem ? { ...ing, used: true } : ing
      ));

      setCookingStage(currentStep + 1);

      setTimeout(() => {
        setShowFeedback(null);
        if (currentStep < currentRecipeData.correctOrder.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Recipe complete! Play success sound
          if (cookingSoundRef.current) {
            soundManager.stop(cookingSoundRef.current);
            cookingSoundRef.current = null;
          }
          soundManager.playSuccess();
          setTimeout(() => setGameState('success'), 1500);
        }
      }, 1500);
    } else {
      // Play wrong sound
      soundManager.playWrong();
      
      setShowFeedback({ type: 'wrong', message: 'Not yet! Try something else.' });
      setMistakes(mistakes + 1);
      
      setTimeout(() => setShowFeedback(null), 1500);
    }

    setDraggedItem(null);
  };

  const getCookingVisual = () => {
    if (currentRecipeData.id === 'scrambled-eggs') {
      if (cookingStage === 0) return <div className="text-9xl opacity-30">🥣</div>;
      if (cookingStage === 1) return (
        <div className="relative">
          <div className="text-9xl">🥣</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">🥚🥚</div>
        </div>
      );
      if (cookingStage === 2) return (
        <div className="relative">
          <div className="text-9xl">🥣</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse">🥛</div>
        </div>
      );
      if (cookingStage >= 3) return (
        <div className="relative animate-pulse">
          <div className="text-9xl">🍳</div>
          <div className="absolute top-0 left-0 text-4xl animate-bounce">💨</div>
        </div>
      );
    } else if (currentRecipeData.id === 'pancakes') {
      if (cookingStage < 3) return (
        <div className="relative">
          <div className="text-9xl">🥣</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl animate-pulse">
            {ingredients.filter(i => i.used).map(i => i.emoji).join('')}
          </div>
        </div>
      );
      return (
        <div className="relative animate-pulse">
          <div className="text-9xl">🥞</div>
          <div className="absolute top-0 right-0 text-4xl">💨</div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <div className="text-9xl">🥗</div>
          {ingredients.filter(i => i.used).length > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl animate-bounce">
              {ingredients.filter(i => i.used).map(i => i.emoji).join('')}
            </div>
          )}
        </div>
      );
    }
    return <div className="text-9xl opacity-30">🍽️</div>;
  };

  const startCooking = () => {
    soundManager.playClick();
    setGameState('playing');
    setTimeLeft(90);
    setCurrentStep(0);
    setScore(0);
    setMistakes(0);
    setShowFeedback(null);
    setCookingStage(0);
  };

  const nextRecipe = () => {
    soundManager.playClick();
    if (currentRecipe < recipes.length - 1) {
      setCurrentRecipe(currentRecipe + 1);
      setGameState('instructions');
    } else {
      window.location.href = '/careers/chef';
    }
  };

  const calculateStars = () => {
    if (mistakes === 0 && timeLeft > 45) return 3;
    if (mistakes <= 2 && timeLeft > 30) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/careers/chef" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Chef</span>
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
              👨‍🍳 Recipe Master
            </h1>
            <p className="text-gray-600 text-lg">Recipe {currentRecipe + 1} of {recipes.length}</p>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex gap-4">
              <div className={`bg-white rounded-2xl shadow-lg p-4 border-4 ${
                timeLeft < 20 ? 'border-red-300 animate-pulse' : 'border-blue-300'
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
              
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-300">
                <div className="flex items-center gap-2">
                  <Trophy size={32} className="text-yellow-500" />
                  <div>
                    <div className="text-2xl font-black text-yellow-600">{score}</div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {gameState === 'instructions' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-orange-200">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{currentRecipeData.emoji}</div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">{currentRecipeData.name}</h2>
              <p className="text-xl text-gray-600 font-bold">{currentRecipeData.description}</p>
            </div>

            <div className="bg-orange-50 border-4 border-orange-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-orange-900 text-2xl mb-4">🎮 How to Play:</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <span className="text-orange-900 font-bold text-lg">Look at the ingredients available</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">2</div>
                  <span className="text-orange-900 font-bold text-lg">Think about the cooking order - what goes first?</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <span className="text-orange-900 font-bold text-lg">Drag ingredients in the correct order to make {currentRecipeData.name}!</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-yellow-900 text-xl mb-3">🥘 Ingredients You'll Need:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {currentRecipeData.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-4xl mb-2">{ingredient.emoji}</div>
                    <div className="text-sm font-bold text-gray-700">{ingredient.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startCooking}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Cooking! 👨‍🍳
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
                <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
                  🥘 Ingredients
                </h3>
                <p className="text-gray-600 font-bold text-center mb-4 text-sm">
                  Drag to the cooking area! →
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {displayIngredients.map((ingredient) => {
                    // Find the actual ingredient state (used or not)
                    const actualIngredient = ingredients.find(ing => ing.id === ingredient.id);
                    const isUsed = actualIngredient?.used || false;
                    
                    return (
                      <div
                        key={ingredient.id}
                        draggable={!isUsed}
                        onDragStart={() => handleDragStart(ingredient.id)}
                        className={`p-4 rounded-2xl border-4 text-center transition-all ${
                          isUsed 
                            ? 'border-gray-200 opacity-30 cursor-not-allowed' 
                            : 'border-orange-300 hover:border-orange-500 cursor-move hover:scale-110 shadow-lg'
                        }`}
                      >
                        <div className="text-5xl mb-2">{ingredient.emoji}</div>
                        <div className="text-sm font-bold text-gray-700">{ingredient.name}</div>
                        {isUsed && <div className="text-2xl mt-1">✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div 
                className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl shadow-xl p-8 border-4 border-orange-200 min-h-[500px] flex flex-col items-center justify-center relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-white rounded-xl p-3 shadow-md">
                    <div className="flex justify-between text-sm text-gray-600 font-bold mb-2">
                      <span>Progress</span>
                      <span>{currentStep + 1}/{currentRecipeData.correctOrder.length}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / currentRecipeData.correctOrder.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  {getCookingVisual()}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-orange-300">
                    <p className="text-center text-xl font-black text-orange-900">
                      🎯 What should you add next?
                    </p>
                    <p className="text-center text-sm text-gray-600 font-bold mt-1">
                      Think about making {currentRecipeData.name}!
                    </p>
                  </div>
                </div>

                {showFeedback && (
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl shadow-2xl ${
                    showFeedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
                  } text-white font-black text-2xl text-center animate-bounce z-20`}>
                    {showFeedback.type === 'correct' ? '✓ ' : '✗ '}
                    {showFeedback.message}
                  </div>
                )}

                {mistakes > 0 && (
                  <div className="absolute top-20 right-4">
                    <div className="bg-red-100 border-4 border-red-300 rounded-xl p-3 shadow-lg">
                      <p className="text-red-800 font-black">⚠️ Mistakes: {mistakes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-green-400">
            <div className="text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl md:text-5xl font-black text-green-600 mb-4">
                Delicious!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You cooked {currentRecipeData.name} perfectly!
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-yellow-600">{score}</div>
                    <div className="text-gray-600 font-bold text-sm">Points</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-blue-600">{timeLeft}s</div>
                    <div className="text-gray-600 font-bold text-sm">Time Left</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-red-600">{mistakes}</div>
                    <div className="text-gray-600 font-bold text-sm">Mistakes</div>
                  </div>
                </div>
              </div>

              <button
                onClick={nextRecipe}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                {currentRecipe < recipes.length - 1 ? 'Next Recipe! 🍽️' : 'Back to Chef 👨‍🍳'}
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'fail' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border-8 border-red-400">
            <div className="text-center">
              <div className="text-8xl mb-4">😢</div>
              <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
                Time's Up!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                The food got cold! Try cooking faster next time!
              </p>

              <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-red-900 text-xl mb-3">👨‍🍳 Chef's Tip:</h3>
                <p className="text-red-800 font-bold">
                  Think about the order of cooking! What goes first when making {currentRecipeData.name}?
                </p>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setGameState('instructions');
                }}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto"
              >
                <RotateCcw size={32} />
                Try Again!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
