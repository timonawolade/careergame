'use client';

import React from 'react';
import { ArrowLeft, Wrench, Construction, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ConstructionEngineerPage() {
  const miniGames = [
    {
      id: 'bridge-builder',
      name: 'Bridge Builder Pro',
      description: 'Design and test bridges that can handle heavy loads! Learn about materials and structural engineering.',
      icon: Wrench,
      color: 'from-blue-500 to-purple-600',
      path: '/careers/construction-engineer/bridge-builder',
      difficulty: 'Medium',
      skills: ['Structural Engineering', 'Material Science', 'Physics']
    },
    {
      id: 'bungalow-builder',
      name: 'Build Your Home',
      description: 'Build a complete house from foundation to roof! Learn budgeting and construction planning.',
      icon: Construction,
      color: 'from-orange-500 to-red-600',
      path: '/careers/construction-engineer/bungalow-builder',
      difficulty: 'Easy',
      skills: ['Planning', 'Budgeting', 'Construction Process']
    },
    {
      id: 'blueprint-reader',
      name: 'Blueprint Reader',
      description: 'Read construction plans and match the right materials. Can you build exactly as designed?',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      path: '/careers/construction-engineer/blueprint-reader',
      difficulty: 'Medium',
      skills: ['Reading Plans', 'Attention to Detail', 'Problem Solving']
    },
    {
      id: 'safety-inspector',
      name: 'Safety Inspector',
      description: 'Spot safety hazards on construction sites! Keep workers safe by identifying risks.',
      icon: ShieldAlert,
      color: 'from-red-500 to-orange-600',
      path: '#',
      difficulty: 'Easy',
      skills: ['Safety Awareness', 'Critical Thinking', 'Attention to Detail'],
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/careers"
          className="inline-flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Careers
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl">
              <Construction className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Construction Engineer</h1>
              <p className="text-gray-600 text-lg">Build the world around us! 🏗️</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-orange-900 mb-2">What Construction Engineers Do:</h2>
                <p className="text-orange-800 mb-3">
                  Construction engineers design and build amazing structures like bridges, buildings, roads, and tunnels! 
                  They make sure everything is strong, safe, and built to last. From skyscrapers to highways, construction 
                  engineers shape the world we live in!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-orange-900">🏗️ Design Structures</div>
                    <div className="text-sm text-orange-700">Create plans for buildings and bridges</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-orange-900">🔨 Choose Materials</div>
                    <div className="text-sm text-orange-700">Pick the right materials for each job</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-orange-900">✅ Ensure Safety</div>
                    <div className="text-sm text-orange-700">Make sure everything is safe and strong</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Challenge! 🎮</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {miniGames.map((game) => {
              const IconComponent = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.comingSoon ? '#' : game.path}
                  className={`group relative bg-gradient-to-br ${game.color} rounded-2xl p-6 text-white transition-all hover:scale-105 hover:shadow-2xl ${
                    game.comingSoon ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                  }`}
                  onClick={(e) => {
                    if (game.comingSoon) {
                      e.preventDefault();
                    }
                  }}
                >
                  {game.comingSoon && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                      Coming Soon!
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-white/20 backdrop-blur p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                      <p className="text-white/90 text-sm mb-3">{game.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                      {game.difficulty}
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-3">
                    <div className="text-sm font-semibold mb-2">Skills You'll Practice:</div>
                    <div className="flex flex-wrap gap-2">
                      {game.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!game.comingSoon && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                      <span>Play Now</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Career Path</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold text-gray-800 mb-1">Education</div>
              <div className="text-sm text-gray-600">
                Get a degree in Civil or Construction Engineering (4-5 years)
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-bold text-gray-800 mb-1">Salary</div>
              <div className="text-sm text-gray-600">
                $65,000 - $120,000+ per year depending on experience
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
              <div className="text-3xl mb-2">🌟</div>
              <div className="font-bold text-gray-800 mb-1">Work Environment</div>
              <div className="text-sm text-gray-600">
                Mix of office work and construction sites - exciting and varied!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
