'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, RotateCcw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Sound effects - Simple version to avoid parsing errors
const playSound = (type: 'build' | 'success' | 'fail' | 'music') => {
  if (typeof window === 'undefined') return;
  // Placeholder - you can add actual sound files later
  console.log(`Playing sound: ${type}`);
  // Optional: Add Web Audio API simple beeps here if needed
};

// Types
type Foundation = 'none' | 'concrete' | 'stone';
type Wall = 'none' | 'wood' | 'brick' | 'stone';
type Roof = 'none' | 'flat' | 'pitched' | 'modern';
type Door = 'none' | 'basic' | 'fancy';
type Paint = 'white' | 'yellow' | 'blue' | 'green' | 'red';
type Landscape = 'none' | 'grass' | 'fence' | 'trees' | 'garden';

interface HouseSpec {
  foundation: Foundation;
  walls: Wall;
  roof: Roof;
  door: Door;
  windows: number;
  paint: Paint;
  landscape: Landscape;
}

interface Level {
  id: number;
  name: string;
  budget: number;
  target: HouseSpec;
  description: string;
}

// Levels
const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Starter Home',
    budget: 50000,
    target: {
      foundation: 'concrete',
      walls: 'wood',
      roof: 'pitched',
      door: 'basic',
      windows: 2,
      paint: 'white',
      landscape: 'grass'
    },
    description: 'Build a simple starter home with basic materials.'
  },
  {
    id: 2,
    name: 'Family House',
    budget: 75000,
    target: {
      foundation: 'stone',
      walls: 'brick',
      roof: 'modern',
      door: 'fancy',
      windows: 4,
      paint: 'yellow',
      landscape: 'fence'
    },
    description: 'Build a comfortable family home with quality materials.'
  },
  {
    id: 3,
    name: 'Dream Home',
    budget: 100000,
    target: {
      foundation: 'stone',
      walls: 'stone',
      roof: 'modern',
      door: 'fancy',
      windows: 6,
      paint: 'blue',
      landscape: 'garden'
    },
    description: 'Build your dream home with premium materials!'
  }
];

// Prices
const PRICES = {
  foundation: { concrete: 5000, stone: 8000 },
  walls: { wood: 3000, brick: 5000, stone: 8000 },
  roof: { flat: 2000, pitched: 4000, modern: 6000 },
  door: { basic: 500, fancy: 1000 },
  windows: 300,
  paint: 200,
  landscape: { grass: 500, fence: 1000, trees: 1500, garden: 2000 }
};

export default function BuildYourHome() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [house, setHouse] = useState<HouseSpec>({
    foundation: 'none',
    walls: 'none',
    roof: 'none',
    door: 'none',
    windows: 0,
    paint: 'white',
    landscape: 'none'
  });
  const [budget, setBudget] = useState(LEVELS[0].budget);
  const [spent, setSpent] = useState(0);
  const [score, setScore] = useState<null | { stars: number; message: string }>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate spent
  useEffect(() => {
    let total = 0;
    if (house.foundation !== 'none') total += PRICES.foundation[house.foundation];
    if (house.walls !== 'none') total += PRICES.walls[house.walls];
    if (house.roof !== 'none') total += PRICES.roof[house.roof];
    if (house.door !== 'none') total += PRICES.door[house.door];
    total += house.windows * PRICES.windows;
    if (house.paint !== 'white') total += PRICES.paint;
    if (house.landscape !== 'none') total += PRICES.landscape[house.landscape];
    setSpent(total);
  }, [house]);

  // Build option
  const buildOption = (category: keyof HouseSpec, value: any) => {
    if (category === 'windows') {
      const cost = (value - house.windows) * PRICES.windows;
      if (spent + cost > budget) return;
      setHouse({ ...house, windows: value });
    } else {
      const oldValue = house[category];
      let oldCost = 0;
      let newCost = 0;

      if (category === 'foundation' && oldValue !== 'none') {
        oldCost = PRICES.foundation[oldValue as Exclude<Foundation, 'none'>];
      }
      if (category === 'walls' && oldValue !== 'none') {
        oldCost = PRICES.walls[oldValue as Exclude<Wall, 'none'>];
      }
      if (category === 'roof' && oldValue !== 'none') {
        oldCost = PRICES.roof[oldValue as Exclude<Roof, 'none'>];
      }
      if (category === 'door' && oldValue !== 'none') {
        oldCost = PRICES.door[oldValue as Exclude<Door, 'none'>];
      }
      if (category === 'paint' && oldValue !== 'white') oldCost = PRICES.paint;
      if (category === 'landscape' && oldValue !== 'none') {
        oldCost = PRICES.landscape[oldValue as Exclude<Landscape, 'none'>];
      }

      if (category === 'foundation' && value !== 'none') {
        newCost = PRICES.foundation[value as Exclude<Foundation, 'none'>];
      }
      if (category === 'walls' && value !== 'none') {
        newCost = PRICES.walls[value as Exclude<Wall, 'none'>];
      }
      if (category === 'roof' && value !== 'none') {
        newCost = PRICES.roof[value as Exclude<Roof, 'none'>];
      }
      if (category === 'door' && value !== 'none') {
        newCost = PRICES.door[value as Exclude<Door, 'none'>];
      }
      if (category === 'paint' && value !== 'white') newCost = PRICES.paint;
      if (category === 'landscape' && value !== 'none') {
        newCost = PRICES.landscape[value as Exclude<Landscape, 'none'>];
      }

      const diff = newCost - oldCost;
      if (spent + diff > budget) return;

      setHouse({ ...house, [category]: value });
      playSound('build');
    }
  };

  // Reset
  const reset = () => {
    setHouse({
      foundation: 'none',
      walls: 'none',
      roof: 'none',
      door: 'none',
      windows: 0,
      paint: 'white',
      landscape: 'none'
    });
    setScore(null);
  };

  // Check house
  const checkHouse = () => {
    const target = LEVELS[currentLevel].target;
    let matches = 0;
    if (house.foundation === target.foundation) matches++;
    if (house.walls === target.walls) matches++;
    if (house.roof === target.roof) matches++;
    if (house.door === target.door) matches++;
    if (house.windows === target.windows) matches++;
    if (house.paint === target.paint) matches++;
    if (house.landscape === target.landscape) matches++;

    const accuracy = matches / 7;
    const budgetRatio = 1 - (spent / budget);
    const score = accuracy * 0.7 + budgetRatio * 0.3;

    let stars = 1;
    let message = 'Good try! Keep practicing!';

    if (score >= 0.9) {
      stars = 3;
      message = '⭐⭐⭐ Perfect! You\'re an amazing builder!';
      playSound('success');
    } else if (score >= 0.7) {
      stars = 2;
      message = '⭐⭐ Great job! Almost perfect!';
      playSound('success');
    } else {
      playSound('fail');
    }

    setScore({ stars, message });
  };

  // Draw house on canvas (REALISTIC 2D style)
  const drawHouse = (canvas: HTMLCanvasElement, houseData: HouseSpec, isTarget: boolean = false) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, height * 0.6, width, height * 0.4);

    // Grass texture on ground
    ctx.fillStyle = '#7CB342';
    ctx.fillRect(0, height * 0.6, width, height * 0.05);
    
    // Sun
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.15, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFD700';
    ctx.fill();
    ctx.shadowBlur = 0;

    // House dimensions
    const houseWidth = width * 0.5;
    const houseHeight = height * 0.35;
    const houseX = (width - houseWidth) / 2;
    const houseY = height * 0.45;

    // Foundation with realistic concrete/stone texture
    if (houseData.foundation !== 'none') {
      ctx.fillStyle = houseData.foundation === 'concrete' ? '#666666' : '#8B8B8B';
      ctx.fillRect(houseX - 10, houseY + houseHeight - 20, houseWidth + 20, 20);
      
      // Foundation texture
      ctx.strokeStyle = houseData.foundation === 'concrete' ? '#555555' : '#777777';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(houseX - 10 + (i * (houseWidth + 20) / 5), houseY + houseHeight - 20);
        ctx.lineTo(houseX - 10 + (i * (houseWidth + 20) / 5), houseY + houseHeight);
        ctx.stroke();
      }
      
      // Shadow under foundation
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(houseX - 10, houseY + houseHeight, houseWidth + 20, 5);
    }

    // Walls with realistic textures
    if (houseData.walls !== 'none') {
      let wallColor = '#D2B48C';
      if (houseData.walls === 'brick') wallColor = '#B85C4E';
      if (houseData.walls === 'stone') wallColor = '#808080';

      ctx.fillStyle = wallColor;
      ctx.fillRect(houseX, houseY, houseWidth, houseHeight);

      // Wall texture based on material
      if (houseData.walls === 'brick') {
        // Brick pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        const brickHeight = 15;
        const brickWidth = 40;
        for (let y = 0; y < houseHeight; y += brickHeight) {
          for (let x = 0; x < houseWidth; x += brickWidth) {
            const offset = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
            ctx.strokeRect(houseX + x + offset, houseY + y, brickWidth, brickHeight);
          }
        }
      } else if (houseData.walls === 'wood') {
        // Wood grain
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(houseX + (i * houseWidth / 8), houseY);
          ctx.lineTo(houseX + (i * houseWidth / 8), houseY + houseHeight);
          ctx.stroke();
        }
      } else if (houseData.walls === 'stone') {
        // Stone pattern
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        const stones = 12;
        for (let i = 0; i < stones; i++) {
          const x = houseX + Math.random() * houseWidth;
          const y = houseY + Math.random() * houseHeight;
          const size = 30 + Math.random() * 40;
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Wall shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(houseX + houseWidth - 5, houseY, 5, houseHeight);

      // Paint color overlay
      if (houseData.paint !== 'white') {
        const paintColors = {
          yellow: 'rgba(255, 235, 59, 0.6)',
          blue: 'rgba(33, 150, 243, 0.6)',
          green: 'rgba(76, 175, 80, 0.6)',
          red: 'rgba(244, 67, 54, 0.6)',
          white: 'transparent'
        };
        ctx.fillStyle = paintColors[houseData.paint];
        ctx.fillRect(houseX, houseY, houseWidth, houseHeight);
      }
    }

    // Roof with realistic tiles/shingles
    if (houseData.roof !== 'none') {
      ctx.fillStyle = '#8B4513';
      
      if (houseData.roof === 'pitched') {
        // Pitched roof with triangle
        ctx.beginPath();
        ctx.moveTo(houseX - 20, houseY);
        ctx.lineTo(houseX + houseWidth / 2, houseY - houseHeight * 0.4);
        ctx.lineTo(houseX + houseWidth + 20, houseY);
        ctx.closePath();
        ctx.fill();

        // Roof tiles texture - CLIPPED TO ROOF SHAPE
        ctx.save(); // Save current state
        ctx.beginPath();
        ctx.moveTo(houseX - 20, houseY);
        ctx.lineTo(houseX + houseWidth / 2, houseY - houseHeight * 0.4);
        ctx.lineTo(houseX + houseWidth + 20, houseY);
        ctx.closePath();
        ctx.clip(); // Clip to roof triangle
        
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        for (let y = 0; y < houseHeight * 0.4; y += 15) {
          ctx.beginPath();
          ctx.moveTo(houseX - 20 + (y * 0.5), houseY - y);
          ctx.lineTo(houseX + houseWidth + 20 - (y * 0.5), houseY - y);
          ctx.stroke();
        }
        ctx.restore(); // Restore state (removes clip)

        // Roof shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.moveTo(houseX + houseWidth / 2, houseY - houseHeight * 0.4);
        ctx.lineTo(houseX + houseWidth + 20, houseY);
        ctx.lineTo(houseX + houseWidth + 20, houseY + 10);
        ctx.closePath();
        ctx.fill();
      } else if (houseData.roof === 'flat') {
        // Flat roof
        ctx.fillRect(houseX - 10, houseY - 20, houseWidth + 20, 20);
        
        // Flat roof edge shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(houseX - 10, houseY, houseWidth + 20, 5);
      } else if (houseData.roof === 'modern') {
        // Modern angled roof
        ctx.beginPath();
        ctx.moveTo(houseX - 15, houseY);
        ctx.lineTo(houseX + houseWidth * 0.3, houseY - houseHeight * 0.3);
        ctx.lineTo(houseX + houseWidth + 15, houseY - houseHeight * 0.1);
        ctx.lineTo(houseX + houseWidth + 15, houseY);
        ctx.closePath();
        ctx.fill();

        // Modern roof highlights
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(houseX - 15, houseY);
        ctx.lineTo(houseX + houseWidth * 0.3, houseY - houseHeight * 0.3);
        ctx.lineTo(houseX + houseWidth * 0.3, houseY - houseHeight * 0.25);
        ctx.lineTo(houseX - 15, houseY - 10);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Door with realistic wood texture
    if (houseData.door !== 'none') {
      const doorWidth = houseWidth * 0.15;
      const doorHeight = houseHeight * 0.4;
      const doorX = houseX + houseWidth * 0.15;
      const doorY = houseY + houseHeight - doorHeight;

      if (houseData.door === 'basic') {
        // Basic wooden door
        ctx.fillStyle = '#654321';
        ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

        // Wood grain
        ctx.strokeStyle = '#4B3619';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(doorX, doorY + (i * doorHeight / 4));
          ctx.lineTo(doorX + doorWidth, doorY + (i * doorHeight / 4));
          ctx.stroke();
        }

        // Door knob
        ctx.beginPath();
        ctx.arc(doorX + doorWidth * 0.8, doorY + doorHeight * 0.5, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      } else {
        // Fancy door with window
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

        // Door window
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(doorX + doorWidth * 0.2, doorY + doorHeight * 0.1, doorWidth * 0.6, doorHeight * 0.3);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(doorX + doorWidth * 0.2, doorY + doorHeight * 0.1, doorWidth * 0.6, doorHeight * 0.3);

        // Door panels
        ctx.strokeStyle = '#654321';
        ctx.strokeRect(doorX + doorWidth * 0.1, doorY + doorHeight * 0.5, doorWidth * 0.35, doorHeight * 0.4);
        ctx.strokeRect(doorX + doorWidth * 0.55, doorY + doorHeight * 0.5, doorWidth * 0.35, doorHeight * 0.4);

        // Fancy door knob
        ctx.beginPath();
        ctx.arc(doorX + doorWidth * 0.85, doorY + doorHeight * 0.5, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Door shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(doorX + doorWidth, doorY, 3, doorHeight);
    }

    // Windows with realistic glass reflection
    if (houseData.windows > 0) {
      const windowWidth = houseWidth * 0.12;
      const windowHeight = houseHeight * 0.2;
      const windowY = houseY + houseHeight * 0.3;

      for (let i = 0; i < houseData.windows; i++) {
        const windowX = houseX + houseWidth * 0.5 + (i - houseData.windows / 2) * (windowWidth + 20);

        // Window frame
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(windowX, windowY, windowWidth, windowHeight);

        // Glass with reflection
        const glassGradient = ctx.createLinearGradient(windowX, windowY, windowX, windowY + windowHeight);
        glassGradient.addColorStop(0, '#87CEEB');
        glassGradient.addColorStop(0.3, '#FFFFFF');
        glassGradient.addColorStop(0.7, '#87CEEB');
        glassGradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = glassGradient;
        ctx.fillRect(windowX + 5, windowY + 5, windowWidth - 10, windowHeight - 10);

        // Window cross bars
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(windowX + windowWidth / 2, windowY);
        ctx.lineTo(windowX + windowWidth / 2, windowY + windowHeight);
        ctx.moveTo(windowX, windowY + windowHeight / 2);
        ctx.lineTo(windowX + windowWidth, windowY + windowHeight / 2);
        ctx.stroke();

        // Window shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(windowX + windowWidth, windowY, 2, windowHeight);
      }
    }

    // Landscaping with realistic details
    if (houseData.landscape !== 'none') {
      if (houseData.landscape === 'grass') {
        // Better grass texture - ONLY ON GROUND, NOT ON HOUSE
        ctx.fillStyle = '#4CAF50';
        // Draw grass on left side (before house)
        ctx.fillRect(0, height * 0.6, houseX, height * 0.1);
        // Draw grass on right side (after house)
        ctx.fillRect(houseX + houseWidth, height * 0.6, width - (houseX + houseWidth), height * 0.1);
        
        // Grass blades on left
        for (let i = 0; i < 15; i++) {
          ctx.strokeStyle = '#2E7D32';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const x = i * (houseX / 15);
          ctx.moveTo(x, height * 0.65);
          ctx.lineTo(x + 2, height * 0.63);
          ctx.stroke();
        }
        
        // Grass blades on right
        for (let i = 0; i < 15; i++) {
          ctx.strokeStyle = '#2E7D32';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const x = (houseX + houseWidth) + i * ((width - (houseX + houseWidth)) / 15);
          ctx.moveTo(x, height * 0.65);
          ctx.lineTo(x + 2, height * 0.63);
          ctx.stroke();
        }
      } else if (houseData.landscape === 'fence') {
        // Realistic fence
        ctx.fillStyle = '#8B4513';
        const fenceY = height * 0.62;
        for (let i = 0; i < 10; i++) {
          const x = houseX - 100 + (i * 30);
          ctx.fillRect(x, fenceY, 20, 50);
          ctx.fillRect(x, fenceY + 15, 20, 5);
          ctx.fillRect(x, fenceY + 30, 20, 5);
        }
      } else if (houseData.landscape === 'trees') {
        // Realistic trees
        const drawTree = (x: number, y: number) => {
          // Trunk
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x - 10, y, 20, 60);
          
          // Tree foliage with depth
          ctx.fillStyle = '#2E7D32';
          ctx.beginPath();
          ctx.arc(x, y - 20, 50, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#4CAF50';
          ctx.beginPath();
          ctx.arc(x - 15, y - 30, 40, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(x + 15, y - 30, 40, 0, Math.PI * 2);
          ctx.fill();
        };
        
        drawTree(houseX - 80, height * 0.6);
        drawTree(houseX + houseWidth + 80, height * 0.6);
      } else if (houseData.landscape === 'garden') {
        // Garden with flowers
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(houseX - 60, height * 0.65, 100, 40);
        
        // Flowers with realistic petals
        const drawFlower = (x: number, y: number, color: string) => {
          ctx.fillStyle = color;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(x + Math.cos(i * Math.PI * 2 / 5) * 8, y + Math.sin(i * Math.PI * 2 / 5) * 8, 6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#FFEB3B';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        };
        
        drawFlower(houseX - 40, height * 0.68, '#FF5252');
        drawFlower(houseX - 20, height * 0.67, '#FF4081');
        drawFlower(houseX - 35, height * 0.695, '#9C27B0');
      }
    }

    // Label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isTarget ? '🎯 Target House' : '🏗️ Your House', width / 2, 25);
  };

  // Draw both houses when component mounts
  useEffect(() => {
    const targetCanvas = document.getElementById('target-canvas') as HTMLCanvasElement;
    const yourCanvas = document.getElementById('your-canvas') as HTMLCanvasElement;
    
    if (targetCanvas) drawHouse(targetCanvas, LEVELS[currentLevel].target, true);
    if (yourCanvas) drawHouse(yourCanvas, house);
  }, [currentLevel, house]);

  const level = LEVELS[currentLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link href="/careers/construction-engineer" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
          <ChevronLeft size={20} />
          <span className="font-semibold">Back to Construction Engineer</span>
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          🏠 Build Your Home
        </h1>
        <p className="text-gray-600 text-lg">{level.description}</p>
      </div>

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* LEFT SIDE: Build Menu (30% on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Budget Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">💰 Budget</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="font-bold text-green-600">${budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-bold text-red-600">${spent.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(spent / budget) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className={`font-bold ${budget - spent >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      ${(budget - spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Build Options */}
            <div className="bg-white rounded-2xl p-6 shadow-xl space-y-4 max-h-[600px] overflow-y-auto">
              <h2 className="text-2xl font-bold text-purple-600">🏗️ Build Menu</h2>

              {/* Foundation */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Foundation</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildOption('foundation', 'concrete')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.foundation === 'concrete' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Concrete</span>
                      <span className="text-sm text-gray-600">$5,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('foundation', 'stone')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.foundation === 'stone' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Stone</span>
                      <span className="text-sm text-gray-600">$8,000</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Walls */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Walls</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildOption('walls', 'wood')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.walls === 'wood' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Wood</span>
                      <span className="text-sm text-gray-600">$3,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('walls', 'brick')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.walls === 'brick' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Brick</span>
                      <span className="text-sm text-gray-600">$5,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('walls', 'stone')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.walls === 'stone' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Stone</span>
                      <span className="text-sm text-gray-600">$8,000</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Roof */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Roof</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildOption('roof', 'flat')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.roof === 'flat' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Flat</span>
                      <span className="text-sm text-gray-600">$2,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('roof', 'pitched')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.roof === 'pitched' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Pitched</span>
                      <span className="text-sm text-gray-600">$4,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('roof', 'modern')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.roof === 'modern' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Modern</span>
                      <span className="text-sm text-gray-600">$6,000</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Door */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Door</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildOption('door', 'basic')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.door === 'basic' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Basic</span>
                      <span className="text-sm text-gray-600">$500</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('door', 'fancy')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.door === 'fancy' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Fancy</span>
                      <span className="text-sm text-gray-600">$1,000</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Windows */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Windows ($300 each)</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 2, 4, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => buildOption('windows', num)}
                      className={`p-3 rounded-lg border-2 ${house.windows === num ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paint */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Paint ($200)</h3>
                <div className="grid grid-cols-5 gap-2">
                  {(['white', 'yellow', 'blue', 'green', 'red'] as Paint[]).map(color => (
                    <button
                      key={color}
                      onClick={() => buildOption('paint', color)}
                      className={`p-3 rounded-lg border-2 ${house.paint === color ? 'border-purple-500 border-4' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    >
                    </button>
                  ))}
                </div>
              </div>

              {/* Landscaping */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Landscaping</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildOption('landscape', 'grass')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.landscape === 'grass' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Grass 🌱</span>
                      <span className="text-sm text-gray-600">$500</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('landscape', 'fence')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.landscape === 'fence' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Fence 🚧</span>
                      <span className="text-sm text-gray-600">$1,000</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('landscape', 'trees')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.landscape === 'trees' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Trees 🌳</span>
                      <span className="text-sm text-gray-600">$1,500</span>
                    </div>
                  </button>
                  <button
                    onClick={() => buildOption('landscape', 'garden')}
                    className={`w-full p-3 rounded-lg border-2 text-left ${house.landscape === 'garden' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Garden 🌺</span>
                      <span className="text-sm text-gray-600">$2,000</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Houses Display (70% on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Target House */}
            <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-6 shadow-xl">
              <canvas
                id="target-canvas"
                width={800}
                height={500}
                className="w-full rounded-lg"
              />
            </div>

            {/* Your House */}
            <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-6 shadow-xl">
              <canvas
                id="your-canvas"
                width={800}
                height={500}
                className="w-full rounded-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <RotateCcw size={24} />
                Reset
              </button>
              
              <button
                onClick={checkHouse}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <CheckCircle size={24} />
                Check My House
              </button>
            </div>

            {/* Score Display */}
            {score && (
              <div className={`p-6 rounded-2xl shadow-xl text-center ${score.stars >= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : score.stars >= 2 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-gray-400 to-slate-400'}`}>
                <div className="text-4xl mb-2">{score.message}</div>
                <button
                  onClick={() => {
                    if (score.stars >= 2 && currentLevel < LEVELS.length - 1) {
                      setCurrentLevel(currentLevel + 1);
                      setBudget(LEVELS[currentLevel + 1].budget);
                      reset();
                    }
                  }}
                  className={`px-8 py-3 rounded-xl font-bold text-white ${score.stars >= 2 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={score.stars < 2 || currentLevel >= LEVELS.length - 1}
                >
                  {score.stars >= 2 ? (currentLevel < LEVELS.length - 1 ? 'Next Level →' : '🎉 Completed All Levels!') : 'Try Again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
