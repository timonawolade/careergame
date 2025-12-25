'use client';

import React, { useState } from 'react';
import { 
  Hammer, Stethoscope, ChefHat, Settings, Music, Volume2, VolumeX, 
  Sparkles, Trophy, Star, Play, ArrowRight, CheckCircle, Zap, 
  Heart, Brain, Rocket, GamepadIcon
} from 'lucide-react';
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
      path: '/careers/construction-engineer',
      gamesAvailable: 3,
      isLive: true
    },
    {
      id: 'medical-doctor',
      name: 'Medical Doctor',
      tagline: '🩺 Save Lives Every Day!',
      description: 'Diagnose patients, perform surgery, and discover cures. Experience what it takes to be a hero in scrubs!',
      icon: Stethoscope,
      color: 'from-blue-600 to-cyan-600',
      heroImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop',
      path: '/careers/medical-doctor',
      gamesAvailable: 3,
      isLive: true
    },
    {
      id: 'chef',
      name: 'Chef / Cook',
      tagline: '👨‍🍳 Create Delicious Dishes!',
      description: 'Follow recipes, serve customers, and invent amazing meals. Become a master chef and feed the world!',
      icon: ChefHat,
      color: 'from-orange-600 to-red-600',
      heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
      path: '/careers/chef',
      gamesAvailable: 3,
      isLive: true
    }
  ];

  const themeColors = {
    purple: 'from-purple-600 via-pink-600 to-orange-500',
    blue: 'from-blue-500 via-cyan-500 to-teal-600',
    green: 'from-emerald-400 via-teal-500 to-cyan-600',
    orange: 'from-orange-400 via-rose-500 to-purple-600'
  };

  const howItWorks = [
    {
      step: 1,
      title: 'Choose a Career',
      description: 'Pick from exciting careers like Engineer, Doctor, or Pilot!',
      icon: GamepadIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Play & Learn',
      description: 'Play fun mini-games that teach real job skills!',
      icon: Play,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      title: 'Level Up!',
      description: 'Earn XP, unlock achievements, and become a pro!',
      icon: Trophy,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    {
      title: 'Learn by Doing',
      description: 'Kids explore careers through hands-on games, not just reading about them!',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Fun & Educational',
      description: 'Subway Surfers quality graphics meet real educational value!',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      title: 'Build Real Skills',
      description: 'From budgeting to physics, kids learn practical skills through play!',
      icon: Zap,
      color: 'text-orange-600'
    },
    {
      title: 'Safe & Age-Appropriate',
      description: 'Designed specifically for kids ages 6-15. No ads, no in-app purchases!',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors[theme as keyof typeof themeColors]} relative overflow-hidden`}>
      {/* Animated background blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-all">
              <Sparkles size={48} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">CareerGame</h1>
              <p className="text-white/90 text-lg md:text-xl font-bold mt-1">🎮 Play Your Way to Your Dream Job!</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="bg-white/90 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"
              title="Toggle Sound"
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
              title="Toggle Music"
            >
              <Music size={28} className={musicEnabled ? 'text-purple-600' : 'text-gray-400'} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="bg-white/90 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"
              title="Settings"
            >
              <Settings size={28} className="text-purple-600" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border-4 border-white/50">
            <h3 className="text-2xl font-black text-gray-800 mb-4">🎨 Choose Your Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <p className="text-white font-bold text-lg">✨ The Future of Career Exploration ✨</p>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            Discover Your Dream Career<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
              Through Play!
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 font-bold max-w-3xl mx-auto mb-8 leading-relaxed">
            Kids ages 6-15 explore real careers through fun, interactive mini-games. 
            Learn by doing, not just reading!
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/careers/construction-engineer"
              className="group bg-white text-purple-600 px-8 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all inline-flex items-center gap-3 justify-center"
            >
              <Rocket size={28} />
              <span>Start Playing Now!</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/20 backdrop-blur-sm text-white border-4 border-white/50 px-8 py-5 rounded-2xl font-black text-xl hover:bg-white/30 transition-all"
            >
              Learn More 👇
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-yellow-300 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-3">
              <Star size={40} className="text-yellow-500" />
              <div>
                <div className="text-3xl font-black text-yellow-600">0 XP</div>
                <div className="text-gray-600 font-bold">Experience Points</div>
              </div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-purple-300 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-3">
              <Trophy size={40} className="text-purple-500" />
              <div>
                <div className="text-3xl font-black text-purple-600">0</div>
                <div className="text-gray-600 font-bold">Activities Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-green-300 transform hover:scale-105 transition-all">
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

      {/* HOW IT WORKS SECTION */}
      <div id="how-it-works" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
              🎯 How It Works
            </h2>
            <p className="text-xl text-gray-600 font-bold max-w-2xl mx-auto">
              Three simple steps to discovering your dream career!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border-4 border-gray-100 transform hover:scale-105 transition-all"
                >
                  <div className="absolute -top-6 left-8">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 mt-4`}>
                    <Icon size={40} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-bold text-lg leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CAREER CARDS SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-4 drop-shadow-2xl">
          🌟 Choose Your Career Adventure!
        </h2>
        <p className="text-xl text-white/90 text-center font-bold mb-12">
          Start with Construction Engineer - More careers coming soon!
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {careers.map((career) => {
            const Icon = career.icon;
            return (
              <Link
                key={career.id}
                href={career.isLive ? career.path : '#'}
                className={`group relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-white/50 ${
                  !career.isLive ? 'cursor-not-allowed opacity-90' : ''
                }`}
                onClick={(e) => {
                  if (!career.isLive) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Coming Soon Badge */}
                {!career.isLive && (
                  <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm shadow-lg animate-bounce">
                    🚧 Coming Soon!
                  </div>
                )}

                {/* LIVE Badge */}
                {career.isLive && (
                  <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    PLAY NOW!
                  </div>
                )}
                
                {/* Hero Image */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={career.heroImage} 
                    alt={career.name}
                    className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 ${
                      !career.isLive ? 'grayscale' : ''
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${career.color} ${
                    career.isLive ? 'opacity-40 group-hover:opacity-30' : 'opacity-60'
                  } transition-all`} />
                  
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
                  
                  {career.isLive && (
                    <div className="bg-green-100 border-2 border-green-300 rounded-xl p-3 mb-4">
                      <p className="text-green-800 font-black text-sm">
                        ✅ {career.gamesAvailable} Games Available Now!
                      </p>
                    </div>
                  )}

                  <div className={`${
                    career.isLive 
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500' 
                      : 'bg-gray-300'
                  } text-white py-4 rounded-2xl font-black text-xl transform ${
                    career.isLive ? 'group-hover:scale-105 group-hover:shadow-2xl' : ''
                  } transition-all text-center`}>
                    {career.isLive ? '🚀 Start Your Journey →' : '🚧 Coming Soon'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className="bg-white/10 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">
              💡 Why CareerGame?
            </h2>
            <p className="text-xl text-white/90 font-bold max-w-2xl mx-auto">
              The perfect blend of education and entertainment!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Icon size={48} className={benefit.color} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 font-bold text-lg leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center border-8 border-white/30">
          <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Ready to Explore Your Future? 🚀
          </h2>
          <p className="text-xl text-gray-600 font-bold mb-8 max-w-2xl mx-auto">
            Join thousands of kids discovering their dream careers through play!
          </p>
          <Link
            href="/careers/construction-engineer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-10 py-6 rounded-2xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            <Play size={32} />
            <span>Start Playing Free!</span>
            <ArrowRight size={28} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 pb-12 text-center">
        <p className="text-white/80 font-bold text-lg">💫 Made with love for future world-changers 💫</p>
      </div>
    </div>
  );
}
