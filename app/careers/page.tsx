'use client';

import React from 'react';
import { Hammer, Stethoscope, Plane, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const careers = [
    {
      id: 'construction-engineer',
      name: 'Construction Engineer',
      tagline: '🏗️ Build Amazing Structures!',
      description: 'Design bridges, operate cranes, and create blueprints. Learn how engineers build the world around us!',
      icon: Hammer,
      color: 'from-orange-600 to-red-600',
      bgGradient: 'from-orange-400 via-red-500 to-pink-600',
      path: '/careers/construction-engineer',
      gamesCount: 3
    },
    {
      id: 'medical-doctor',
      name: 'Medical Doctor',
      tagline: '🩺 Save Lives Every Day!',
      description: 'Diagnose patients, perform surgery, and discover cures. Experience what it takes to be a hero in scrubs!',
      icon: Stethoscope,
      color: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-400 via-cyan-500 to-teal-600',
      path: '/careers/medical-doctor',
      gamesCount: 4,
      comingSoon: true
    },
    {
      id: 'airline-pilot',
      name: 'Airline Pilot',
      tagline: '✈️ Soar Through the Skies!',
      description: 'Fly planes, navigate weather, and explore the world from above. Take the controls and reach new heights!',
      icon: Plane,
      color: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-400 via-pink-500 to-rose-600',
      path: '/careers/airline-pilot',
      gamesCount: 4,
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl font-black text-lg hover:scale-105 transition-all mb-6"
        >
          <ArrowLeft size={24} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              <Sparkles size={48} className="text-purple-600" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-white drop-shadow-2xl mb-4">
            Choose Your Career Path
          </h1>
          <p className="text-white/90 text-2xl font-bold">
            Explore different careers through fun interactive games!
          </p>
        </div>

        {/* Career Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {careers.map((career) => {
            const Icon = career.icon;
            const isDisabled = career.comingSoon;

            if (isDisabled) {
              return (
                <div
                  key={career.id}
                  className="relative bg-white/50 rounded-3xl shadow-xl overflow-hidden border-4 border-white/30 opacity-75"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-lg z-10">
                    🚧 Coming Soon!
                  </div>

                  {/* Gradient Header */}
                  <div className={`relative h-80 bg-gradient-to-br ${career.bgGradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={120} className="text-white/30" />
                    </div>
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
                    <p className="text-gray-600 font-bold text-lg mb-4 leading-relaxed">
                      {career.description}
                    </p>
                    <div className="bg-gray-200 text-gray-600 py-4 rounded-2xl font-black text-xl text-center">
                      Under Development 🛠️
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={career.id}
                href={career.path}
                className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-white/50"
              >
                {/* Gradient Header */}
                <div className={`relative h-80 bg-gradient-to-br ${career.bgGradient} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                    <Icon size={120} className="text-white/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
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
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
                      {career.gamesCount} Mini-Games
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                      ✅ Available Now
                    </div>
                  </div>

                  <div className={`bg-gradient-to-r ${career.color} text-white py-4 rounded-2xl font-black text-xl transform group-hover:scale-105 group-hover:shadow-2xl transition-all text-center`}>
                    🚀 Start Your Journey →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-white/50">
          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              How CareerGame Works 🎮
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl">
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Choose a Career</h3>
                <p className="text-gray-700 font-semibold">
                  Pick a career that interests you and explore what professionals in that field do every day!
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Play Mini-Games</h3>
                <p className="text-gray-700 font-semibold">
                  Complete fun challenges that teach you real skills professionals use in their work!
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl">
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Learn & Grow</h3>
                <p className="text-gray-700 font-semibold">
                  Earn points, unlock achievements, and discover if this career is right for you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
