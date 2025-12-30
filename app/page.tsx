'use client';

import React, { useState } from 'react';
import { 
  Hammer, Stethoscope, ChefHat, Sparkles, Trophy, Star, Play, 
  ArrowRight, Brain, Heart, Rocket, GamepadIcon, Menu, X
} from 'lucide-react';
import Link from 'next/link';

export default function ProfessionalHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const howItWorks = [
    {
      step: 1,
      title: 'Choose a Career',
      description: 'Pick from exciting careers like Engineer, Doctor, or Chef!',
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
      description: 'Kids explore careers through hands-on games, not just reading!',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Fun & Educational',
      description: 'Engaging gameplay meets real educational value!',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      title: 'Discover Your Passion',
      description: 'Help kids find what they love before choosing a college major!',
      icon: Rocket,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CareerGame
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">Play Your Way to Your Dream Job!</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/careers" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                Careers
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                About
              </Link>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Start Playing! 🎮
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <Link href="/careers" className="block py-2 text-gray-700 hover:text-purple-600 font-semibold">
                Careers
              </Link>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-purple-600 font-semibold">
                About
              </Link>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                Start Playing! 🎮
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-6 sm:mb-8">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm sm:text-base font-bold text-gray-700">The Future of Career Exploration</span>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Discover Your Dream Career
            </span>
            <br />
            <span className="text-gray-800">Through Play!</span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto mb-8 sm:mb-10">
            Kids ages 6-15 explore real careers through fun, interactive mini-games. Learn by doing, not just reading!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/careers"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <GamepadIcon className="w-6 h-6" />
              Start Playing Now!
            </Link>
            <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-purple-200">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-12 sm:mt-16">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                10+
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Career Paths</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                30+
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Mini-Games</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Free to Play</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-4">
              How It Works
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">
              Three simple steps to discovering your dream career!
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-black text-gray-300 mb-2">{item.step}</div>
                <h4 className="text-2xl font-black text-gray-800 mb-3">{item.title}</h4>
                <p className="text-gray-600 font-semibold">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Cards */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Explore Career Paths
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">
              Each career has 3 interactive mini-games!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {careers.map((career) => (
              <Link 
                key={career.id}
                href={career.path}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                  {/* Hero Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img 
                      src={career.heroImage} 
                      alt={career.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-2xl font-black text-white mb-1">{career.name}</h4>
                      <p className="text-white/90 font-bold text-sm">{career.tagline}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 font-semibold mb-4">{career.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-gray-200">
                        🎮 {career.gamesAvailable} Interactive Games
                      </span>
                    </div>

                    <div className={`bg-gradient-to-r ${career.color} text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 group-hover:gap-4 transition-all`}>
                      Start Playing
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Why Kids Love CareerGame
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <benefit.icon className={`w-16 h-16 mx-auto mb-4 ${benefit.color}`} />
                <h4 className="text-xl font-black text-gray-800 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 font-semibold">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl sm:text-7xl mb-6">🚀</div>
          <h3 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Discover Your Future?
          </h3>
          <p className="text-xl sm:text-2xl text-white/90 font-semibold mb-10">
            Join thousands of kids exploring careers through play!
          </p>
          <Link 
            href="/careers"
            className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-black text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
            Start Your Journey Now!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black">CareerGame</span>
          </div>
          <p className="text-gray-400 mb-8">
            Helping kids discover their dream careers through interactive play
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2024 CareerGame. Made with ❤️ for kids everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
