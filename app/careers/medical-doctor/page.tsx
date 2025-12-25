'use client';

import React from 'react';
import { ArrowLeft, Stethoscope, Heart, Syringe, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MedicalDoctorPage() {
  const miniGames = [
    {
      id: 'first-aid-hero',
      name: 'First Aid Hero',
      description: 'Learn how to treat common injuries! Help patients with scrapes, burns, and bee stings.',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      path: '/careers/medical-doctor/first-aid-hero',
      difficulty: 'Easy',
      skills: ['First Aid', 'Emergency Care', 'Patient Care'],
      isLive: true
    },
    {
      id: 'diagnosis-detective',
      name: 'Diagnosis Detective',
      description: 'Match symptoms to diseases and become a medical detective!',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      path: '/careers/medical-doctor/diagnosis-detective',
      difficulty: 'Medium',
      skills: ['Critical Thinking', 'Pattern Recognition', 'Medical Knowledge'],
      isLive: true
    },
    {
      id: 'surgery-simulator',
      name: 'Surgery Simulator',
      description: 'Perform simple surgical procedures with steady hands!',
      icon: Syringe,
      color: 'from-green-500 to-emerald-600',
      path: '/careers/medical-doctor/surgery-simulator',
      difficulty: 'Hard',
      skills: ['Precision', 'Hand-Eye Coordination', 'Focus'],
      isLive: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 p-8">
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
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Medical Doctor</h1>
              <p className="text-gray-600 text-lg">Save lives and help people! 🩺</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">What Medical Doctors Do:</h2>
                <p className="text-blue-800 mb-3">
                  Doctors diagnose and treat illnesses, perform surgeries, and help people stay healthy! 
                  They study the human body, medicines, and how to care for patients. From treating a 
                  scraped knee to performing life-saving surgery, doctors are everyday heroes!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-blue-900">🩹 Treat Patients</div>
                    <div className="text-sm text-blue-700">Help people feel better</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-blue-900">🔬 Diagnose Diseases</div>
                    <div className="text-sm text-blue-700">Figure out what's wrong</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="font-bold text-blue-900">💊 Prescribe Medicine</div>
                    <div className="text-sm text-blue-700">Give the right treatment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-white text-center mb-8 drop-shadow-2xl">
            🎮 Choose Your Challenge!
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {miniGames.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.isLive ? game.path : '#'}
                  className={`group bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-white/50 ${
                    !game.isLive ? 'cursor-not-allowed opacity-90' : ''
                  }`}
                  onClick={(e) => {
                    if (!game.isLive) {
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Coming Soon Badge */}
                  {!game.isLive && (
                    <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-black text-sm shadow-lg">
                      Coming Soon!
                    </div>
                  )}

                  {/* Icon Section */}
                  <div className={`bg-gradient-to-br ${game.color} p-8 relative`}>
                    <div className="flex items-center justify-between">
                      <Icon size={64} className="text-white" />
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        game.difficulty === 'Easy' ? 'bg-green-400 text-green-900' :
                        game.difficulty === 'Medium' ? 'bg-yellow-400 text-yellow-900' :
                        'bg-red-400 text-red-900'
                      }`}>
                        {game.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{game.name}</h3>
                    <p className="text-gray-600 font-bold mb-4">{game.description}</p>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 font-bold mb-2">Skills You'll Practice:</p>
                      <div className="flex flex-wrap gap-2">
                        {game.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`${
                      game.isLive 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                        : 'bg-gray-300'
                    } text-white py-3 rounded-xl font-black text-center transform ${
                      game.isLive ? 'group-hover:scale-105' : ''
                    } transition-all`}>
                      {game.isLive ? '▶ Play Now' : '🚧 Coming Soon'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Career Path Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">💡 Career Path</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="font-black text-gray-800 mb-2">Education</h3>
              <p className="text-gray-600 font-bold text-sm">
                College (4 years) + Medical School (4 years) + Residency (3-7 years)
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="font-black text-gray-800 mb-2">Salary</h3>
              <p className="text-gray-600 font-bold text-sm">
                $200,000 - $400,000+ per year depending on specialty
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🏥</div>
              <h3 className="font-black text-gray-800 mb-2">Work Environment</h3>
              <p className="text-gray-600 font-bold text-sm">
                Hospitals, clinics, private practices - helping patients every day!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
