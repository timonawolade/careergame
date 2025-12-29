'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Star, Trophy, Users, Zap, ChefHat } from 'lucide-react';
import Link from 'next/link';
import soundManager from '@/lib/soundManager';

type Order = {
  id: string;
  dish: string;
  emoji: string;
  ingredients: string[];
  patience: number;
  maxPatience: number;
};

type Customer = {
  id: number;
  order: Order;
  served: boolean;
};

export default function KitchenRushGame() {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'success' | 'fail'>('instructions');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customersServed, setCustomersServed] = useState(0);
  const [customersFailed, setCustomersFailed] = useState(0);
  const [combo, setCombo] = useState(0);
  
  // Sound management
  const cookingSoundRef = useRef<HTMLAudioElement | null>(null);
  const timerSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Cleanup all sounds on unmount
  useEffect(() => {
    return () => {
      // Stop all sounds when component unmounts (leaving page)
      if (cookingSoundRef.current) {
        soundManager.stop(cookingSoundRef.current);
        cookingSoundRef.current = null;
      }
      if (timerSoundRef.current) {
        soundManager.stop(timerSoundRef.current);
        timerSoundRef.current = null;
      }
      soundManager.stopAll();
    };
  }, []);

  const dishes = [
    {
      id: 'burger',
      dish: 'Burger',
      emoji: '🍔',
      ingredients: ['🍞', '🥩', '🧀', '🥬', '🍅'],
      patience: 30,
      maxPatience: 30
    },
    {
      id: 'pizza',
      dish: 'Pizza',
      emoji: '🍕',
      ingredients: ['🫓', '🍅', '🧀', '🍄'],
      patience: 25,
      maxPatience: 25
    },
    {
      id: 'fries',
      dish: 'Fries',
      emoji: '🍟',
      ingredients: ['🥔', '🧂'],
      patience: 15,
      maxPatience: 15
    },
    {
      id: 'hotdog',
      dish: 'Hot Dog',
      emoji: '🌭',
      ingredients: ['🍞', '🌭', '🧅'],
      patience: 20,
      maxPatience: 20
    },
    {
      id: 'taco',
      dish: 'Taco',
      emoji: '🌮',
      ingredients: ['🫓', '🥩', '🧀', '🥬'],
      patience: 25,
      maxPatience: 25
    },
    {
      id: 'salad',
      dish: 'Salad',
      emoji: '🥗',
      ingredients: ['🥬', '🍅', '🥕', '🥒'],
      patience: 20,
      maxPatience: 20
    }
  ];

  const availableIngredients = ['🍞', '🥩', '🧀', '🥬', '🍅', '🫓', '🍄', '🥔', '🧂', '🌭', '🧅', '🥕', '🥒'];

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState]);

  // Customer patience
  useEffect(() => {
    if (gameState === 'playing') {
      const patienceTimer = setInterval(() => {
        setCustomers(prev => prev.map(customer => {
          if (customer.served) return customer;
          
          const newPatience = customer.order.patience - 1;
          
          if (newPatience <= 0) {
            // Customer left angry!
            setCustomersFailed(f => f + 1);
            setCombo(0);
            return { ...customer, served: true };
          }
          
          return {
            ...customer,
            order: { ...customer.order, patience: newPatience }
          };
        }));
      }, 1000);
      
      return () => clearInterval(patienceTimer);
    }
  }, [gameState]);

  // Spawn customers
  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = Math.max(3000 - (level * 300), 1500);
      
      const spawner = setInterval(() => {
        setCustomers(prev => {
          const activeCustomers = prev.filter(c => !c.served).length;
          if (activeCustomers < 3) {
            const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
            const newCustomer: Customer = {
              id: Date.now(), // Use timestamp for unique ID
              order: { ...randomDish },
              served: false
            };
            return [...prev, newCustomer];
          }
          return prev;
        });
      }, spawnInterval);
      
      return () => clearInterval(spawner);
    }
  }, [gameState, level]);

  const handleIngredientClick = (ingredient: string) => {
    if (!selectedCustomer) {
      // No customer selected - show hint
      return;
    }
    if (selectedIngredients.length < 6) {
      soundManager.playChopping(); // Play chopping sound
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const selectCustomer = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || customer.served) return;
    
    soundManager.playClick(); // Play click sound
    setSelectedCustomer(customerId);
    setSelectedIngredients([]);
  };

  const clearIngredients = () => {
    soundManager.playClick(); // Play click sound
    setSelectedIngredients([]);
  };

  const serveDish = () => {
    if (!selectedCustomer) return;
    
    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer || customer.served) return;

    const orderIngredients = customer.order.ingredients;
    const isCorrect = 
      orderIngredients.length === selectedIngredients.length &&
      orderIngredients.every(ing => selectedIngredients.includes(ing)) &&
      selectedIngredients.every(ing => orderIngredients.includes(ing));

    if (isCorrect) {
      // Correct order! Play success sound
      soundManager.playCorrect();
      
      const basePoints = 100;
      const speedBonus = Math.floor(customer.order.patience * 2);
      const comboBonus = combo * 50;
      const totalPoints = basePoints + speedBonus + comboBonus;
      
      setScore(score + totalPoints);
      setCustomersServed(customersServed + 1);
      setCombo(combo + 1);
      
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer ? { ...c, served: true } : c
      ));
      
      setSelectedCustomer(null);
      setSelectedIngredients([]);
      
      // Level up every 5 customers
      if ((customersServed + 1) % 5 === 0) {
        setLevel(level + 1);
      }
    } else {
      // Wrong order! Play wrong sound
      soundManager.playWrong();
      setCombo(0);
      setSelectedIngredients([]);
    }
  };

  const isOrderComplete = () => {
    if (!selectedCustomer) return false;
    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return false;
    
    const orderIngredients = customer.order.ingredients;
    return orderIngredients.length === selectedIngredients.length &&
           orderIngredients.every(ing => selectedIngredients.includes(ing)) &&
           selectedIngredients.every(ing => orderIngredients.includes(ing));
  };

  const startGame = () => {
    soundManager.playClick();
    setGameState('playing');
    setLevel(1);
    setScore(0);
    setTimeLeft(120);
    setSelectedCustomer(null);
    setSelectedIngredients([]);
    setCustomersServed(0);
    setCustomersFailed(0);
    setCombo(0);
    
    // Start cooking background sound
    cookingSoundRef.current = soundManager.playCooking();
    
    // Start with 2 customers
    setTimeout(() => {
      const randomDish1 = dishes[Math.floor(Math.random() * dishes.length)];
      setCustomers([{
        id: Date.now(),
        order: { ...randomDish1 },
        served: false
      }]);
    }, 500);
    
    setTimeout(() => {
      const randomDish2 = dishes[Math.floor(Math.random() * dishes.length)];
      setCustomers(prev => [...prev, {
        id: Date.now() + 1,
        order: { ...randomDish2 },
        served: false
      }]);
    }, 1500);
  };

  const endGame = () => {
    // Stop cooking sound
    if (cookingSoundRef.current) {
      soundManager.stop(cookingSoundRef.current);
      cookingSoundRef.current = null;
    }
    if (timerSoundRef.current) {
      soundManager.stop(timerSoundRef.current);
      timerSoundRef.current = null;
    }
    
    if (customersServed >= 15) {
      soundManager.playVictory(); // Play victory sound
      setGameState('success');
    } else {
      setGameState('fail');
    }
  };

  const calculateStars = () => {
    if (customersServed >= 25 && customersFailed <= 2) return 3;
    if (customersServed >= 15 && customersFailed <= 5) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <Link href="/careers/chef" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Chef</span>
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2">
              🍔 Kitchen Rush
            </h1>
            <p className="text-gray-600 text-lg">Serve customers quickly!</p>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-blue-300">
                <div className="flex items-center gap-2">
                  <Clock size={28} className="text-blue-500" />
                  <div>
                    <div className="text-2xl font-black text-blue-600">{timeLeft}s</div>
                    <div className="text-xs text-gray-600">Time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-300">
                <div className="flex items-center gap-2">
                  <Trophy size={28} className="text-yellow-500" />
                  <div>
                    <div className="text-2xl font-black text-yellow-600">{score}</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-green-300">
                <div className="flex items-center gap-2">
                  <Users size={28} className="text-green-500" />
                  <div>
                    <div className="text-2xl font-black text-green-600">{customersServed}</div>
                    <div className="text-xs text-gray-600">Served</div>
                  </div>
                </div>
              </div>
              
              {combo > 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-purple-300 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Zap size={28} className="text-purple-500" />
                    <div>
                      <div className="text-2xl font-black text-purple-600">{combo}x</div>
                      <div className="text-xs text-gray-600">Combo!</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {gameState === 'instructions' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-orange-200">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">🍔</div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">Kitchen Rush</h2>
              <p className="text-xl text-gray-600 font-bold">Serve customers before they get angry!</p>
            </div>

            <div className="bg-orange-50 border-4 border-orange-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-orange-900 text-2xl mb-4">🎮 How to Play:</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <span className="text-orange-900 font-bold text-lg">CLICK a customer card to select them (it will glow yellow!)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">2</div>
                  <span className="text-orange-900 font-bold text-lg">Click the ingredients they need from the bottom</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <span className="text-orange-900 font-bold text-lg">When complete, the "SERVE!" button turns GREEN - click it!</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0">4</div>
                  <span className="text-orange-900 font-bold text-lg">Serve fast! Watch patience meters - angry customers leave! 😠</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-yellow-900 text-xl mb-3">🎯 Goal:</h3>
              <p className="text-yellow-800 font-bold text-lg">Serve 15+ customers in 2 minutes!</p>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Serving! 🍔
            </button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState === 'playing' && (
        <div className="max-w-7xl mx-auto">
          {/* Customers */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">👥 Customers Waiting:</h2>
            <p className="text-gray-600 font-bold mb-4">👆 Click a customer to start making their order!</p>
            <div className="grid md:grid-cols-3 gap-4">
              {customers.filter(c => !c.served).slice(0, 3).map((customer) => {
                const patiencePercent = (customer.order.patience / customer.order.maxPatience) * 100;
                const isAngry = patiencePercent < 30;
                const isSelected = selectedCustomer === customer.id;
                
                return (
                  <button
                    key={customer.id}
                    onClick={() => selectCustomer(customer.id)}
                    className={`bg-white rounded-3xl shadow-xl p-6 border-4 transition-all transform hover:scale-105 ${
                      isSelected 
                        ? 'border-yellow-400 shadow-2xl ring-4 ring-yellow-300' 
                        : isAngry 
                          ? 'border-red-400 animate-pulse hover:border-red-500' 
                          : 'border-blue-300 hover:border-blue-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="bg-yellow-400 text-yellow-900 font-black text-sm px-3 py-1 rounded-full mb-3 inline-block animate-pulse">
                        ⭐ MAKING THIS ORDER ⭐
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">
                        {isAngry ? '😠' : patiencePercent < 60 ? '😐' : '😊'}
                      </div>
                      <div className="text-3xl font-black text-gray-800 mb-2">
                        Wants: {customer.order.emoji}
                      </div>
                      <div className="text-lg font-bold text-gray-600">{customer.order.dish}</div>
                    </div>

                    {/* Patience Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 font-bold mb-1">
                        <span>Patience</span>
                        <span>{customer.order.patience}s</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isAngry ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${patiencePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Ingredients Needed */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-600 font-bold mb-2">Needs:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {customer.order.ingredients.map((ing, idx) => (
                          <span key={idx} className="text-2xl">{ing}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Area */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-200">
              <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">🥘 Ingredients</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {availableIngredients.map((ingredient, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleIngredientClick(ingredient)}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl border-4 border-purple-300 hover:border-purple-500 text-4xl transition-all transform hover:scale-110"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Dish */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-200">
              {selectedCustomer ? (
                <>
                  <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <ChefHat size={28} className="text-yellow-600" />
                      <h3 className="text-xl font-black text-yellow-900">
                        Making: {customers.find(c => c.id === selectedCustomer)?.order.emoji} {customers.find(c => c.id === selectedCustomer)?.order.dish}
                      </h3>
                    </div>
                    <p className="text-sm text-yellow-800 font-bold text-center">
                      Click ingredients below to build this order!
                    </p>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">🍳 Your Dish</h3>
                  
                  <div className="bg-orange-50 rounded-2xl p-6 mb-4 min-h-[200px] flex items-center justify-center">
                    {selectedIngredients.length === 0 ? (
                      <p className="text-gray-400 font-bold text-lg text-center">Click ingredients below!</p>
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {selectedIngredients.map((ing, idx) => (
                          <span key={idx} className="text-5xl">{ing}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={clearIngredients}
                      className="flex-1 bg-gray-400 text-white py-4 rounded-xl font-black text-lg hover:bg-gray-500 transition-all"
                    >
                      Clear 🗑️
                    </button>
                    
                    {isOrderComplete() ? (
                      <button
                        onClick={serveDish}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-pulse"
                      >
                        SERVE! 🍽️✨
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 py-4 rounded-xl font-black text-lg cursor-not-allowed"
                      >
                        Keep Adding...
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">🍳 Your Dish</h3>
                  
                  <div className="bg-orange-50 rounded-2xl p-8 mb-4 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👆</div>
                      <p className="text-gray-600 font-bold text-lg">
                        Click a customer above<br/>to start cooking!
                      </p>
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-black text-lg cursor-not-allowed"
                  >
                    Select Customer First
                  </button>
                </>
              )}
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
                Amazing Service!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You're a kitchen superstar!
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
                    <div className="text-3xl font-black text-green-600">{customersServed}</div>
                    <div className="text-gray-600 font-bold text-sm">Served</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-red-600">{customersFailed}</div>
                    <div className="text-gray-600 font-bold text-sm">Failed</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-yellow-600">{score}</div>
                    <div className="text-gray-600 font-bold text-sm">Score</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-black text-blue-600">{level}</div>
                    <div className="text-gray-600 font-bold text-sm">Level</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/careers/chef'}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Back to Chef 👨‍🍳
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
              <div className="text-8xl mb-4">😓</div>
              <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
                Time's Up!
              </h2>
              <p className="text-2xl text-gray-700 font-bold mb-6">
                You served {customersServed} customers - try for 15+!
              </p>

              <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-red-900 text-xl mb-3">👨‍🍳 Chef's Tips:</h3>
                <ul className="space-y-2 text-left">
                  <li className="text-red-800 font-bold">• Serve the angriest customers first!</li>
                  <li className="text-red-800 font-bold">• Build combos for bonus points!</li>
                  <li className="text-red-800 font-bold">• Work fast but stay accurate!</li>
                </ul>
              </div>

              <button
                onClick={startGame}
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
