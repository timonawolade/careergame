'use client';

import React, { useState } from 'react';
import { Hammer, Stethoscope, Plane, Settings, Music, Volume2, VolumeX, Sparkles, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('purple');

  const careers = [
    {
      id: 'construction-engineer',
      name: 'Construction Engineer',
      tagline: '🏗️ Build Amazing Structures!',
      description: 'Design bridges, operate cranes, and create blueprints. Learn how engineers build the world around us!',
      icon: Hammer,
      color: 'from-orange-600 to-red-600',
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      path: '/careers/construction-engineer'
    },
    {
      id: 'medical-doctor',
      name: 'Medical Doctor',
      tagline: '🩺 Save Lives Every Day!',
      description: 'Diagnose patients, perform surgery, and discover cures. Experience what it takes to be a hero in scrubs!',
      icon: Stethoscope,
      color: 'from-blue-600 to-cyan-600',
      heroImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop',
      path: '/careers/medical-doctor'
    },
    {
      id: 'airline-pilot',
      name: 'Airline Pilot',
      tagline: '✈️ Soar Through the Skies!',
      description: 'Fly planes, navigate weather, and explore the world from above. Take the controls and reach new heights!',
      icon: Plane,
      color: 'from-purple-600 to-pink-600',
      heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
      path: '/careers/airline-pilot'
    }
  ];

  const themeColors = {
    purple: 'from-purple-600 via-pink-600 to-orange-500',
    blue: 'from-blue-500 via-cyan-500 to-teal-600',
    green: 'from-emerald-400 via-teal-500 to-cyan-600',
    orange: 'from-orange-400 via-rose-500 to-purple-600'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors[theme as keyof typeof themeColors]} p-6 relative overflow-hidden`}>
      {/* Animated background blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto mb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-all">
              <Sparkles size={48} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-white drop-shadow-2xl">CareerGame</h1>
              <p className="text-white/90 text-xl font-bold mt-1">🎮 Play Your Way to Your Dream Job!</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-3">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="bg-white/90 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"
            >
              {soundEnabled ? (
                <Volume2 size={28} className="text-purple-600" />
              ) : (
                <VolumeX size={28} className="text-gray-400" />
              )}
            </button>
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)} 
              className="bg-white/90 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"
            >
              <Music size={28} className={musicEnabled ? 'text-purple-600' : 'text-gray-400'} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="bg-white/90 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"
            >
              <Settings size={28} className="text-purple-600" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border-4 border-white/50">
            <h3 className="text-2xl font-black text-gray-800 mb-4">🎨 Choose Your Theme</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.keys(themeColors).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${themeColors[t as keyof typeof themeColors]} transform hover:scale-110 transition-all ${
                    theme === t ? 'ring-4 ring-white scale-105' : ''
                  }`}
                >
                  <div className="text-white font-black capitalize">{t}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-yellow-300">
            <div className="flex items-center gap-3">
              <Star size={40} className="text-yellow-500" />
              <div>
                <div className="text-3xl font-black text-yellow-600">0 XP</div>
                <div className="text-gray-600 font-bold">Experience Points</div>
              </div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-purple-300">
            <div className="flex items-center gap-3">
              <Trophy size={40} className="text-purple-500" />
              <div>
                <div className="text-3xl font-black text-purple-600">0</div>
                <div className="text-gray-600 font-bold">Activities Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-green-300">
            <div className="flex items-center gap-3">
              <Sparkles size={40} className="text-green-500" />
              <div>
                <div className="text-3xl font-black text-green-600">Level 1</div>
                <div className="text-gray-600 font-bold">Current Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Cards */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-white text-center mb-8 drop-shadow-2xl">
          🌟 Choose Your Career Adventure!
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {careers.map((career) => {
            const Icon = career.icon;
            return (
              <Link
                key={career.id}
                href={career.path}
                className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-white/50"
              >
                {/* Hero Image */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={career.heroImage} 
                    alt={career.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${career.color} opacity-40 group-hover:opacity-30 transition-all`} />
                  
                  {/* Career Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={28} className="text-purple-600" />
                        <h3 className="text-2xl font-black text-gray-800">{career.name}</h3>
                      </div>
                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {career.tagline}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <p className="text-gray-700 font-bold text-lg mb-4 leading-relaxed">
                    {career.description}
                  </p>
                  <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 rounded-2xl font-black text-xl transform group-hover:scale-105 group-hover:shadow-2xl transition-all text-center">
                    🚀 Start Your Journey →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-white/80 font-bold text-lg">💫 Made with love for future world-changers 💫</p>
      </div>
    </div>
  );
}
