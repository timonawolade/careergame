'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  category: 'protein' | 'vegetable' | 'carb' | 'dairy' | 'spice' | 'sweet';
};

export default function IronChefGame() {
  const [gameState, setGameState] = useState<'instructions' | 'selecting' | 'judging' | 'results'>('instructions');
  const [round, setRound] = useState(1);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [dishName, setDishName] = useState('');
  const [judgeScore, setJudgeScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [judgeFeedback, setJudgeFeedback] = useState('');
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const allIngredients: Ingredient[] = [
    // Proteins
    { id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'protein' },
    { id: 'beef', name: 'Beef', emoji: '🥩', category: 'protein' },
    { id: 'fish', name: 'Fish', emoji: '🐟', category: 'protein' },
    { id: 'eggs', name: 'Eggs', emoji: '🥚', category: 'protein' },
    { id: 'bacon', name: 'Bacon', emoji: '🥓', category: 'protein' },
    { id: 'shrimp', name: 'Shrimp', emoji: '🍤', category: 'protein' },
    
    // Vegetables
    { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'vegetable' },
    { id: 'lettuce', name: 'Lettuce', emoji: '🥬', category: 'vegetable' },
    { id: 'mushroom', name: 'Mushroom', emoji: '🍄', category: 'vegetable' },
    { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'vegetable' },
    { id: 'onion', name: 'Onion', emoji: '🧅', category: 'vegetable' },
    { id: 'pepper', name: 'Pepper', emoji: '🌶️', category: 'vegetable' },
    { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'vegetable' },
    
    // Carbs
    { id: 'bread', name: 'Bread', emoji: '🍞', category: 'carb' },
    { id: 'rice', name: 'Rice', emoji: '🍚', category: 'carb' },
    { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'carb' },
    { id: 'potato', name: 'Potato', emoji: '🥔', category: 'carb' },
    
    // Dairy
    { id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'dairy' },
    { id: 'milk', name: 'Milk', emoji: '🥛', category: 'dairy' },
    { id: 'butter', name: 'Butter', emoji: '🧈', category: 'dairy' },
    
    // Spices
    { id: 'salt', name: 'Salt', emoji: '🧂', category: 'spice' },
    { id: 'garlic', name: 'Garlic', emoji: '🧄', category: 'spice' },
    
    // Sweet
    { id: 'chocolate', name: 'Chocolate', emoji: '🍫', category: 'sweet' },
    { id: 'honey', name: 'Honey', emoji: '🍯', category: 'sweet' },
    { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'sweet' },
    { id: 'banana', name: 'Banana', emoji: '🍌', category: 'sweet' },
  ];

  const getRandomIngredients = () => {
    const shuffled = [...allIngredients].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  const startGame = () => {
    setGameState('selecting');
    setRound(1);
    setTotalScore(0);
    setRoundScores([]);
    setAvailableIngredients(getRandomIngredients());
    setSelectedIngredients([]);
    setDishName('');
  };

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.find(i => i.id === ingredient.id)) {
      setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredient.id));
    } else {
      if (selectedIngredients.length < 5) {
        setSelectedIngredients([...selectedIngredients, ingredient]);
      }
    }
  };

  const submitDish = () => {
    if (selectedIngredients.length < 3) {
      alert('Select at least 3 ingredients!');
      return;
    }
    
    if (!dishName.trim()) {
      alert('Give your dish a name!');
      return;
    }
    
    setGameState('judging');
    
    // Calculate score based on ingredient combinations
    setTimeout(() => {
      const score = calculateDishScore();
      setJudgeScore(score);
      setTotalScore(totalScore + score);
      setRoundScores([...roundScores, score]);
      
      setTimeout(() => {
        setGameState('results');
      }, 3000);
    }, 2000);
  };

  const calculateDishScore = () => {
    let score = 5; // Base score
    const feedback: string[] = [];
    
    // Check category diversity
    const categories = selectedIngredients.map(i => i.category);
    const uniqueCategories = new Set(categories).size;
    
    if (uniqueCategories >= 4) {
      score += 3;
      feedback.push('Great variety!');
    } else if (uniqueCategories >= 3) {
      score += 2;
      feedback.push('Nice balance!');
    }
    
    // Check for classic combinations
    const hasProtein = categories.includes('protein');
    const hasVegetable = categories.includes('vegetable');
    const hasCarb = categories.includes('carb');
    
    if (hasProtein && hasVegetable && hasCarb) {
      score += 2;
      feedback.push('Well-rounded meal!');
    }
    
    // Check ingredient count
    if (selectedIngredients.length === 5) {
      score += 1;
      feedback.push('Perfect ingredient count!');
    }
    
    // Creative bonuses for specific combinations
    const ingredientIds = selectedIngredients.map(i => i.id);
    
    // Breakfast combo
    if (ingredientIds.includes('eggs') && ingredientIds.includes('bacon') && ingredientIds.includes('bread')) {
      score += 2;
      feedback.push('Classic breakfast!');
    }
    
    // Italian combo
    if (ingredientIds.includes('pasta') && ingredientIds.includes('tomato') && ingredientIds.includes('cheese')) {
      score += 2;
      feedback.push('Delicious Italian flavors!');
    }
    
    // Asian-inspired
    if (ingredientIds.includes('rice') && ingredientIds.includes('fish') && ingredientIds.includes('garlic')) {
      score += 2;
      feedback.push('Tasty Asian fusion!');
    }
    
    // Dessert combo
    if (ingredientIds.includes('chocolate') && ingredientIds.includes('strawberry')) {
      score += 2;
      feedback.push('Sweet perfection!');
    }
    
    // Sweet + savory (adventurous!)
    if (categories.includes('sweet') && categories.includes('protein')) {
      score += 1;
      feedback.push('Adventurous combo!');
    }
    
    // Generate feedback
    if (score >= 9) {
      setJudgeFeedback('🌟 Incredible! A masterpiece! ' + feedback.join(' '));
    } else if (score >= 7) {
      setJudgeFeedback('😊 Delicious! Great work! ' + feedback.join(' '));
    } else {
      setJudgeFeedback('👍 Good effort! ' + feedback.join(' '));
    }
    
    return Math.min(score, 10);
  };

  const nextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      setGameState('selecting');
      setAvailableIngredients(getRandomIngredients());
      setSelectedIngredients([]);
      setDishName('');
      setJudgeScore(0);
      setJudgeFeedback('');
    } else {
      // Game complete!
      window.location.href = '/careers/chef';
    }
  };

  const calculateFinalStars = () => {
    const avgScore = totalScore / roundScores.length;
    if (avgScore >= 8.5) return 3;
    if (avgScore >= 6.5) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <Link href="/careers/chef" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Chef</span>
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              🏆 Iron Chef Challenge
            </h1>
            <p className="text-gray-600 text-lg">Create your masterpiece!</p>
          </div>
          
          {(gameState === 'selecting' || gameState === 'judging' || gameState === 'results') && (
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-purple-300">
                <div className="flex items-center gap-2">
                  <Award size={28} className="text-purple-500" />
                  <div>
                    <div className="text-2xl font-black text-purple-600">Round {round}/3</div>
                    <div className="text-xs text-gray-600">Challenge</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-300">
                <div className="flex items-center gap-2">
                  <Trophy size={28} className="text-yellow-500" />
                  <div>
                    <div className="text-2xl font-black text-yellow-600">{totalScore}</div>
                    <div className="text-xs text-gray-600">Total Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {gameState === 'instructions' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">Iron Chef Challenge</h2>
              <p className="text-xl text-gray-600 font-bold">Create original recipes and impress the judges!</p>
            </div>

            <div className="bg-purple-50 border-4 border-purple-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-purple-900 text-2xl mb-4">🎮 How to Play:</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <span className="text-purple-900 font-bold text-lg">Choose 3-5 ingredients from what's available</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">2</div>
                  <span className="text-purple-900 font-bold text-lg">Name your creative dish!</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <span className="text-purple-900 font-bold text-lg">The judge rates your creation (1-10 stars)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">4</div>
                  <span className="text-purple-900 font-bold text-lg">Complete 3 rounds - be creative!</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-yellow-900 text-xl mb-3">💡 Tips:</h3>
              <ul className="space-y-2">
                <li className="text-yellow-800 font-bold">• Mix different types of ingredients for variety</li>
                <li className="text-yellow-800 font-bold">• Think about flavors that go well together</li>
                <li className="text-yellow-800 font-bold">• Be creative with your dish names!</li>
                <li className="text-yellow-800 font-bold">• Some combinations give bonus points!</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Challenge! 🏆
            </button>
          </div>
        </div>
      )}

      {/* Selection Screen */}
      {gameState === 'selecting' && (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Available Ingredients */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-200">
              <h2 className="text-2xl font-black text-gray-800 mb-4 text-center">
                🥘 Available Ingredients
              </h2>
              <p className="text-gray-600 font-bold text-center mb-4">
                Choose 3-5 ingredients
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {availableIngredients.map((ingredient) => {
                  const isSelected = selectedIngredients.find(i => i.id === ingredient.id);
                  
                  return (
                    <button
                      key={ingredient.id}
                      onClick={() => toggleIngredient(ingredient)}
                      className={`p-4 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'bg-purple-200 border-purple-500 shadow-lg' 
                          : 'bg-gray-50 border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-4xl mb-2">{ingredient.emoji}</div>
                      <div className="text-sm font-bold text-gray-700">{ingredient.name}</div>
                      {isSelected && <div className="text-xl mt-1">✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Your Creation */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-pink-200">
              <h2 className="text-2xl font-black text-gray-800 mb-4 text-center">
                ✨ Your Creation
              </h2>
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-4 min-h-[200px]">
                {selectedIngredients.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 font-bold text-center">
                      Select ingredients to<br/>create your masterpiece!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {selectedIngredients.map((ing) => (
                      <div key={ing.id} className="text-center">
                        <div className="text-6xl mb-2">{ing.emoji}</div>
                        <div className="text-sm font-bold text-gray-700">{ing.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-black mb-2">
                  Dish Name:
                </label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g., 'Golden Sunrise Delight'"
                  maxLength={40}
                  className="w-full p-4 border-4 border-pink-300 rounded-xl font-bold text-lg focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600 font-bold">
                  {selectedIngredients.length}/5 ingredients selected
                </p>
              </div>

              <button
                onClick={submitDish}
                disabled={selectedIngredients.length < 3 || !dishName.trim()}
                className={`w-full py-6 rounded-2xl font-black text-2xl shadow-xl transition-all ${
                  selectedIngredients.length >= 3 && dishName.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit to Judge! 👨‍🍳
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Judging Screen */}
      {gameState === 'judging' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 border-4 border-yellow-200 text-center">
            <div className="text-8xl mb-6 animate-bounce">👨‍🍳</div>
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              The Judge is Tasting...
            </h2>
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-2xl font-bold text-gray-600 mb-6">
              "{dishName}"
            </p>
            <div className="flex gap-4 justify-center mb-6">
              {selectedIngredients.map((ing) => (
                <span key={ing.id} className="text-5xl">{ing.emoji}</span>
              ))}
            </div>
            <div className="flex gap-2 justify-center animate-pulse">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {gameState === 'results' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-4 border-yellow-200">
            <div className="text-center">
              <div className="text-8xl mb-4">
                {judgeScore >= 9 ? '🌟' : judgeScore >= 7 ? '😊' : '👍'}
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-4">
                Judge's Score: {judgeScore}/10
              </h2>
              <p className="text-xl text-gray-600 font-bold mb-6">
                {judgeFeedback}
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {[...Array(10)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={40}
                    className={idx < judgeScore ? 'text-yellow-400' : 'text-gray-300'}
                    fill="currentColor"
                  />
                ))}
              </div>

              <div className="bg-purple-50 border-4 border-purple-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-purple-900 text-xl mb-3">Your Dish:</h3>
                <p className="text-2xl font-bold text-purple-700 mb-4">"{dishName}"</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {selectedIngredients.map((ing) => (
                    <div key={ing.id} className="text-center">
                      <div className="text-5xl mb-1">{ing.emoji}</div>
                      <div className="text-sm font-bold text-gray-600">{ing.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-4 mb-8">
                <div className="grid grid-cols-3 gap-4">
                  {roundScores.map((score, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3">
                      <div className="text-sm text-gray-600 font-bold">Round {idx + 1}</div>
                      <div className="text-2xl font-black text-yellow-600">{score}/10</div>
                    </div>
                  ))}
                </div>
              </div>

              {round < 3 ? (
                <button
                  onClick={nextRound}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Next Round! 🎯
                </button>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-3xl font-black text-purple-600 mb-2">Challenge Complete!</h3>
                    <p className="text-xl text-gray-600 font-bold">
                      Final Score: {totalScore}/30
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        size={64}
                        className={star <= calculateFinalStars() ? 'text-yellow-400' : 'text-gray-300'}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextRound}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    Back to Chef 👨‍🍳
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
