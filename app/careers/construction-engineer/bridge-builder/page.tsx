'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Wrench, Play, RotateCcw, Volume2, VolumeX, Trophy, DollarSign, Star, TrendingUp, Sparkles, Music } from 'lucide-react';

type Material = 'wood' | 'stone' | 'concrete' | 'steel';
type Shape = 'straight' | 'triangle' | 'arch' | 'ibeam';
type Load = 'person' | 'car' | 'truck' | 'bus' | 'tank';

interface BridgeSegment {
  material: Material;
  shape: Shape;
  cost: number;
}

interface LevelResult {
  success: boolean;
  stars: number;
  efficiency: number;
  budgetUsed: number;
  budgetRemaining: number;
  loadType: string;
}

interface MusicTrack {
  id: string;
  name: string;
  url: string;
}

export default function BridgeBuilder2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // State management
  const [currentMaterial, setCurrentMaterial] = useState<Material>('wood');
  const [currentShape, setCurrentShape] = useState<Shape>('straight');
  const [currentLoad, setCurrentLoad] = useState<Load>('person');
  const [bridge, setBridge] = useState<BridgeSegment[]>([]);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<'success' | 'failure' | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [selectedTrack, setSelectedTrack] = useState('track1');
  
  // Budget & Scoring
  const [startingBudget] = useState(10000);
  const [currentBudget, setCurrentBudget] = useState(10000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const failSoundRef = useRef<HTMLAudioElement>(null);
  const buildSoundRef = useRef<HTMLAudioElement>(null);
  const applauseRef = useRef<HTMLAudioElement>(null);
  const crashRef = useRef<HTMLAudioElement>(null);

  const vehiclePositionRef = useRef(0);
  const vehicleYRef = useRef(0);
  const walkAnimationRef = useRef(0);
  const isWalkingRef = useRef(false);
  const bridgeCollapsedRef = useRef(false);
  const bridgeSegmentsYRef = useRef<number[]>([]);

  const materials = [
    { id: 'wood' as Material, name: 'Wood', icon: '🪵', strength: 1, color: '#D4A574', cost: 500 },
    { id: 'stone' as Material, name: 'Stone', icon: '🪨', strength: 2, color: '#8B8680', cost: 800 },
    { id: 'concrete' as Material, name: 'Concrete', icon: '🧱', strength: 3, color: '#C0C0C0', cost: 1200 },
    { id: 'steel' as Material, name: 'Steel', icon: '⚙️', strength: 5, color: '#87CEEB', cost: 2000 },
  ];

  const shapes = [
    { id: 'straight' as Shape, name: 'Straight', icon: '—', bonus: 0 },
    { id: 'triangle' as Shape, name: 'Triangle', icon: '△', bonus: 1.5 },
    { id: 'arch' as Shape, name: 'Arch', icon: '⌒', bonus: 2 },
    { id: 'ibeam' as Shape, name: 'I-Beam', icon: 'I', bonus: 3 },
  ];

  const loads = [
    { id: 'person' as Load, name: 'Person', icon: '🚶', weight: 1, speed: 2 },
    { id: 'car' as Load, name: 'Car', icon: '🚗', weight: 3, speed: 3 },
    { id: 'truck' as Load, name: 'Truck', icon: '🚚', weight: 5, speed: 2.5 },
    { id: 'bus' as Load, name: 'Bus', icon: '🚌', weight: 7, speed: 2 },
    { id: 'tank' as Load, name: 'Tank', icon: '🪖', weight: 10, speed: 1.5 },
  ];

  // Fun, kid-friendly music tracks
  const musicTracks: MusicTrack[] = [
    { id: 'track1', name: '🎮 Happy Game', url: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3' },
    { id: 'track2', name: '🎸 Fun Adventure', url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3' },
    { id: 'track3', name: '🎹 Playful Kids', url: 'https://assets.mixkit.co/music/preview/mixkit-happy-bells-386.mp3' },
    { id: 'track4', name: '🎺 Upbeat Fun', url: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3' },
  ];

  useEffect(() => {
    if (bgMusicRef.current) {
      const track = musicTracks.find(t => t.id === selectedTrack);
      if (track) {
        bgMusicRef.current.src = track.url;
      }
      bgMusicRef.current.volume = volume / 100;
      if (musicEnabled) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicEnabled, volume, selectedTrack]);

  useEffect(() => {
    [successSoundRef, failSoundRef, buildSoundRef, applauseRef, crashRef].forEach(ref => {
      if (ref.current) {
        ref.current.volume = volume / 100;
      }
    });
  }, [volume]);

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#6DB4EF');
    skyGradient.addColorStop(1, '#B8E6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    const drawCloud = (x: number, y: number, scale: number) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
      ctx.arc(x + 25 * scale, y - 5 * scale, 25 * scale, 0, Math.PI * 2);
      ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCloud(100, 80, 1);
    drawCloud(400, 60, 0.8);
    drawCloud(650, 90, 1.2);

    ctx.fillStyle = '#5DBE6F';
    ctx.beginPath();
    ctx.moveTo(0, height - 200);
    ctx.quadraticCurveTo(200, height - 280, 400, height - 200);
    ctx.quadraticCurveTo(600, height - 120, 800, height - 200);
    ctx.lineTo(800, height - 100);
    ctx.lineTo(0, height - 100);
    ctx.closePath();
    ctx.fill();

    const drawBush = (x: number, y: number) => {
      ctx.fillStyle = '#4EA85F';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 20, y - 5, 18, 0, Math.PI * 2);
      ctx.arc(x + 40, y, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    drawBush(50, height - 110);
    drawBush(250, height - 110);
    drawBush(500, height - 110);
    drawBush(700, height - 110);
  };

  const drawGround = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundY = height - 100;
    const blockSize = 40;

    for (let x = 0; x < width; x += blockSize) {
      for (let y = groundY; y < height; y += blockSize) {
        if (x >= 300 && x < 500) continue;

        ctx.fillStyle = '#D4A574';
        ctx.fillRect(x, y, blockSize, blockSize);

        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, blockSize, blockSize);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 2, y + 2, blockSize - 4, 8);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(x + 2, y + blockSize - 10, blockSize - 4, 8);
      }
    }

    ctx.fillStyle = '#5DBE6F';
    for (let x = 0; x < width; x += blockSize) {
      if (x >= 300 && x < 500) continue;
      ctx.fillRect(x, groundY - 8, blockSize, 8);
    }
  };

  const drawCliffs = (ctx: CanvasRenderingContext2D, _width: number, height: number) => {
    const groundY = height - 100;

    ctx.fillStyle = '#C19A6B';
    ctx.fillRect(280, groundY, 20, 100);
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.strokeRect(280, groundY, 20, 100);

    ctx.fillRect(500, groundY, 20, 100);
    ctx.strokeRect(500, groundY, 20, 100);

    ctx.fillStyle = 'rgba(139, 105, 20, 0.3)';
    for (let i = 0; i < 5; i++) {
      const y = groundY + i * 20;
      ctx.fillRect(282, y, 16, 2);
      ctx.fillRect(502, y, 16, 2);
    }
  };

  const drawBridge = (ctx: CanvasRenderingContext2D, _width: number, height: number) => {
    const groundY = height - 100;
    const gapWidth = 200;
    const gapStart = 300;
    const segmentWidth = gapWidth / Math.max(bridge.length, 1);

    bridge.forEach((segment, index) => {
      const x = gapStart + index * segmentWidth;
      const segmentY = bridgeSegmentsYRef.current[index] || 0; // Falling offset
      const y = groundY + segmentY;

      const material = materials.find(m => m.id === segment.material);
      if (!material) return;

      // Skip drawing if segment has fallen off screen
      if (segmentY > 150) return;

      ctx.fillStyle = material.color;

      if (segment.shape === 'straight') {
        ctx.fillRect(x, y - 20, segmentWidth, 20);
        
        if (segment.material === 'wood') {
          ctx.strokeStyle = 'rgba(101, 67, 33, 0.4)';
          ctx.lineWidth = 1;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y - 15 + i * 4);
            ctx.lineTo(x + segmentWidth, y - 15 + i * 4);
            ctx.stroke();
          }
        } else if (segment.material === 'steel') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x + 2, y - 18, segmentWidth - 4, 6);
          ctx.fillStyle = material.color;
        }
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - 20, segmentWidth, 20);
        
      } else if (segment.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x + segmentWidth, y - 25);
        ctx.lineTo(x + segmentWidth / 2, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x + segmentWidth / 2, y);
        ctx.moveTo(x + segmentWidth, y - 25);
        ctx.lineTo(x + segmentWidth / 2, y);
        ctx.stroke();
        
      } else if (segment.shape === 'arch') {
        ctx.beginPath();
        ctx.arc(x + segmentWidth / 2, y, segmentWidth / 2, Math.PI, 0, true);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
      } else if (segment.shape === 'ibeam') {
        ctx.fillRect(x, y - 28, segmentWidth, 6);
        ctx.fillRect(x, y - 15, segmentWidth, 4);
        ctx.fillRect(x, y - 6, segmentWidth, 6);
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - 28, segmentWidth, 6);
        ctx.strokeRect(x, y - 15, segmentWidth, 4);
        ctx.strokeRect(x, y - 6, segmentWidth, 6);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        for (let i = 0; i < 3; i++) {
          const rivetX = x + (i + 1) * (segmentWidth / 4);
          ctx.beginPath();
          ctx.arc(rivetX, y - 25, 2, 0, Math.PI * 2);
          ctx.arc(rivetX, y - 15, 2, 0, Math.PI * 2);
          ctx.arc(rivetX, y - 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x, y - 4, 3, 4);
      ctx.fillRect(x + segmentWidth - 3, y - 4, 3, 4);
    });
  };

  const drawDetailedCar = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 30, y + 2, 30, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car body - Sports car style
    ctx.fillStyle = '#FF3333';
    // Lower body
    ctx.fillRect(x + 5, y - 20, 50, 15);
    // Upper cabin
    ctx.fillRect(x + 15, y - 32, 30, 12);
    
    // Windshield
    ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
    ctx.fillRect(x + 17, y - 30, 12, 8);
    ctx.fillRect(x + 31, y - 30, 12, 8);
    
    // Hood stripe
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 8, y - 18, 6, 12);
    
    // Headlights
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(x + 5, y - 15, 4, 3);
    
    // Taillights
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 51, y - 15, 4, 3);
    
    // Spoiler
    ctx.fillStyle = '#990000';
    ctx.fillRect(x + 48, y - 25, 8, 2);
    ctx.fillRect(x + 52, y - 27, 2, 2);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 7, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 5, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Hubcaps
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Door lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 30, y - 20);
    ctx.lineTo(x + 30, y - 5);
    ctx.stroke();
  };

  const drawDetailedTruck = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 35, y + 2, 35, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pickup truck - Cargo bed
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x + 35, y - 25, 35, 20);
    
    // Cargo bed side panels
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 35, y - 25, 35, 20);
    ctx.beginPath();
    ctx.moveTo(x + 35, y - 15);
    ctx.lineTo(x + 70, y - 15);
    ctx.stroke();
    
    // Cabin
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x + 5, y - 25, 30, 20);
    ctx.fillRect(x + 10, y - 38, 20, 13);
    
    // Windows
    ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
    ctx.fillRect(x + 12, y - 36, 8, 10);
    ctx.fillRect(x + 22, y - 36, 6, 10);
    
    // Grille
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 5, y - 20, 3, 12);
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 6, y - 19 + i * 3, 2, 2);
    }
    
    // Headlights
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(x + 5, y - 22, 3, 3);
    
    // Mirrors
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(x + 8, y - 30, 3, 3);
    ctx.fillRect(x + 28, y - 30, 3, 3);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 8, 0, Math.PI * 2);
    ctx.arc(x + 55, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hubcaps
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 55, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDetailedBus = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 40, y + 2, 40, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // School bus body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x, y - 30, 80, 25);
    
    // Black stripe
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y - 32, 80, 2);
    ctx.fillRect(x, y - 18, 80, 2);
    
    // Front
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x, y - 35, 12, 10);
    
    // Windows - multiple
    ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + 8 + i * 14, y - 28, 10, 8);
    }
    
    // Windshield
    ctx.fillRect(x + 2, y - 33, 8, 6);
    
    // Door
    ctx.fillStyle = '#CC9900';
    ctx.fillRect(x + 15, y - 28, 8, 23);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 17, y - 20, 1, 8);
    
    // "SCHOOL BUS" text area
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 25, y - 35, 30, 3);
    
    // Stop sign
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + 75, y - 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 6px Arial';
    ctx.fillText('STOP', x + 68, y - 18);
    
    // Headlights
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(x, y - 25, 3, 3);
    
    // Taillights
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 77, y - 15, 3, 4);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 8, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 5, 8, 0, Math.PI * 2);
    ctx.arc(x + 65, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hubcaps
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(x + 15, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 65, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDetailedTank = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 40, y + 2, 40, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tank tracks
    ctx.fillStyle = '#2F4F2F';
    ctx.fillRect(x, y - 8, 80, 10);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y - 8, 80, 10);
    
    // Track wheels
    ctx.fillStyle = '#1C1C1C';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(x + 10 + i * 12, y - 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Lower hull
    ctx.fillStyle = '#4A5D23';
    ctx.fillRect(x + 5, y - 25, 70, 17);
    
    // Upper hull/turret base
    ctx.fillRect(x + 15, y - 38, 50, 13);
    
    // Turret
    ctx.fillStyle = '#3D4F1C';
    ctx.fillRect(x + 25, y - 48, 30, 15);
    
    // Gun barrel
    ctx.fillStyle = '#2F4F2F';
    ctx.fillRect(x + 55, y - 42, 25, 4);
    
    // Barrel tip
    ctx.fillStyle = '#1C1C1C';
    ctx.fillRect(x + 78, y - 43, 4, 6);
    
    // Hatch
    ctx.fillStyle = '#2F4F2F';
    ctx.beginPath();
    ctx.arc(x + 40, y - 40, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Armor details
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 5, y - 25, 70, 17);
    ctx.strokeRect(x + 15, y - 38, 50, 13);
    ctx.strokeRect(x + 25, y - 48, 30, 15);
    
    // Camouflage spots
    ctx.fillStyle = 'rgba(60, 80, 30, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 20, y - 30, 4, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 35, 5, 0, Math.PI * 2);
    ctx.arc(x + 60, y - 20, 4, 0, Math.PI * 2);
    ctx.arc(x + 35, y - 15, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // View ports
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 30, y - 42, 3, 2);
    ctx.fillRect(x + 47, y - 42, 3, 2);
  };

  const drawCharacter = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const load = loads.find(l => l.id === currentLoad);
    if (!load) return;

    if (load.id === 'person') {
      const walkCycle = Math.floor(walkAnimationRef.current / 10) % 2;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x + 20, y + 2, 15, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#8B4513';
      if (isWalkingRef.current && walkCycle === 0) {
        ctx.fillRect(x + 8, y - 6, 10, 6);
        ctx.fillRect(x + 22, y - 4, 10, 4);
      } else {
        ctx.fillRect(x + 8, y - 4, 10, 4);
        ctx.fillRect(x + 22, y - 6, 10, 6);
      }
      
      ctx.fillStyle = '#A0522D';
      if (isWalkingRef.current && walkCycle === 0) {
        ctx.fillRect(x + 9, y - 5, 4, 2);
        ctx.fillRect(x + 23, y - 3, 4, 2);
      } else {
        ctx.fillRect(x + 9, y - 3, 4, 2);
        ctx.fillRect(x + 23, y - 5, 4, 2);
      }
      
      ctx.fillStyle = '#3B5FD9';
      ctx.fillRect(x + 10, y - 18, 8, 12);
      ctx.fillRect(x + 22, y - 18, 8, 12);
      
      ctx.fillStyle = '#2A4DB8';
      ctx.fillRect(x + 16, y - 18, 2, 12);
      ctx.fillRect(x + 28, y - 18, 2, 12);
      
      ctx.fillStyle = '#E52421';
      ctx.fillRect(x + 8, y - 36, 24, 18);
      
      ctx.fillStyle = '#C41E1B';
      ctx.fillRect(x + 28, y - 36, 4, 18);
      
      ctx.fillStyle = '#3B5FD9';
      ctx.fillRect(x + 12, y - 36, 4, 8);
      ctx.fillRect(x + 24, y - 36, 4, 8);
      
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x + 13, y - 32, 2, 2);
      ctx.fillRect(x + 25, y - 32, 2, 2);
      
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(x + 8, y - 24, 24, 2);
      
      ctx.fillStyle = '#FFCC99';
      if (isWalkingRef.current) {
        if (walkCycle === 0) {
          ctx.fillRect(x + 4, y - 32, 6, 12);
          ctx.fillRect(x + 30, y - 34, 6, 14);
        } else {
          ctx.fillRect(x + 4, y - 34, 6, 14);
          ctx.fillRect(x + 30, y - 32, 6, 12);
        }
      } else {
        ctx.fillRect(x + 4, y - 32, 6, 12);
        ctx.fillRect(x + 30, y - 32, 6, 12);
      }
      
      ctx.fillStyle = '#FFFFFF';
      if (isWalkingRef.current) {
        if (walkCycle === 0) {
          ctx.fillRect(x + 4, y - 20, 6, 4);
          ctx.fillRect(x + 30, y - 20, 6, 4);
        } else {
          ctx.fillRect(x + 4, y - 20, 6, 4);
          ctx.fillRect(x + 30, y - 20, 6, 4);
        }
      } else {
        ctx.fillRect(x + 4, y - 20, 6, 4);
        ctx.fillRect(x + 30, y - 20, 6, 4);
      }
      
      ctx.fillStyle = '#FFCC99';
      ctx.fillRect(x + 16, y - 38, 8, 4);
      
      ctx.fillStyle = '#FFCC99';
      ctx.fillRect(x + 12, y - 52, 16, 14);
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + 10, y - 56, 20, 6);
      ctx.fillRect(x + 12, y - 52, 4, 2);
      ctx.fillRect(x + 24, y - 52, 4, 2);
      
      ctx.fillStyle = '#E52421';
      ctx.fillRect(x + 10, y - 60, 20, 4);
      ctx.fillRect(x + 8, y - 58, 24, 2);
      
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(x + 12, y - 59, 6, 2);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 14, y - 48, 5, 5);
      ctx.fillRect(x + 21, y - 48, 5, 5);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 16, y - 46, 2, 3);
      ctx.fillRect(x + 23, y - 46, 2, 3);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 17, y - 47, 1, 1);
      ctx.fillRect(x + 24, y - 47, 1, 1);
      
      ctx.fillStyle = '#E5A87C';
      ctx.fillRect(x + 19, y - 44, 3, 4);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 16, y - 41, 8, 1);
      ctx.fillRect(x + 15, y - 42, 2, 1);
      ctx.fillRect(x + 23, y - 42, 2, 1);
      
      ctx.fillStyle = '#654321';
      ctx.fillRect(x + 13, y - 43, 6, 2);
      ctx.fillRect(x + 21, y - 43, 6, 2);
      
    } else if (load.id === 'car') {
      drawDetailedCar(ctx, x, y);
    } else if (load.id === 'truck') {
      drawDetailedTruck(ctx, x, y);
    } else if (load.id === 'bus') {
      drawDetailedBus(ctx, x, y);
    } else if (load.id === 'tank') {
      drawDetailedTank(ctx, x, y);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawBackground(ctx, width, height);
      drawGround(ctx, width, height);
      drawCliffs(ctx, width, height);
      drawBridge(ctx, width, height);

      if (testing) {
        drawCharacter(ctx, vehiclePositionRef.current, height - 100 + vehicleYRef.current);
        
        if (isWalkingRef.current) {
          walkAnimationRef.current += 1;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bridge, testing, currentLoad]);

  const addSegment = () => {
    const selectedMaterial = materials.find(m => m.id === currentMaterial)!;
    const segmentCost = selectedMaterial.cost;
    
    if (currentBudget < segmentCost) {
      alert(`Insufficient budget! You need $${segmentCost} but only have $${currentBudget} remaining.`);
      return;
    }
    
    if (bridge.length >= 10) return;
    
    if (musicEnabled) {
      buildSoundRef.current?.play().catch(() => {});
    }
    
    const newSegment: BridgeSegment = {
      material: currentMaterial,
      shape: currentShape,
      cost: segmentCost,
    };
    
    setCurrentBudget(prev => prev - segmentCost);
    setTotalSpent(prev => prev + segmentCost);
    setBridge([...bridge, newSegment]);
  };

  const calculateScore = (success: boolean, budgetRemaining: number, loadWeight: number): LevelResult => {
    if (!success) {
      return {
        success: false,
        stars: 0,
        efficiency: 0,
        budgetUsed: totalSpent,
        budgetRemaining,
        loadType: loads.find(l => l.id === currentLoad)?.name || '',
      };
    }
    
    const efficiency = (budgetRemaining / startingBudget) * 100;
    
    let stars = 1;
    if (efficiency >= 70) stars = 3;
    else if (efficiency >= 40) stars = 2;
    else stars = 1;
    
    if (loadWeight >= 4 && stars < 3) stars += 0.5;
    
    return {
      success: true,
      stars: Math.floor(stars),
      efficiency: Math.round(efficiency),
      budgetUsed: totalSpent,
      budgetRemaining,
      loadType: loads.find(l => l.id === currentLoad)?.name || '',
    };
  };

  const testBridge = async () => {
    if (bridge.length === 0 || testing) return;
    
    setTesting(true);
    setResult(null);
    bridgeCollapsedRef.current = false;
    
    const load = loads.find(l => l.id === currentLoad)!;
    
    // STRICT PHYSICS - 3X HARDER!
    const bridgeStrength = bridge.reduce((total, segment) => {
      const mat = materials.find(m => m.id === segment.material)!;
      const shp = shapes.find(s => s.id === segment.shape)!;
      return total + (mat.strength + shp.bonus);
    }, 0);
    
    // BALANCED PHYSICS - Just right!
    // Multiplier = 1.0 for realistic but fair physics
    const requiredStrength = load.weight * bridge.length * 1.0;
    const willSucceed = bridgeStrength >= requiredStrength;
    
    // DEBUG: Log physics calculations
    console.log('=== PHYSICS DEBUG ===');
    console.log('Bridge Strength:', bridgeStrength);
    console.log('Load:', load.name, 'Weight:', load.weight);
    console.log('Segments:', bridge.length);
    console.log('Required Strength:', requiredStrength);
    console.log('Will Succeed?', willSucceed);
    console.log('===================');
    
    vehiclePositionRef.current = 50;
    vehicleYRef.current = 0;
    isWalkingRef.current = true;
    walkAnimationRef.current = 0;
    
    await new Promise<void>((resolve) => {
      const moveInterval = setInterval(() => {
        vehiclePositionRef.current += load.speed;
        
        const gapStart = 300;
        const gapEnd = 500;
        
        if (vehiclePositionRef.current >= gapStart && vehiclePositionRef.current <= gapEnd && bridge.length > 0) {
          vehicleYRef.current = -20;
          
          // DETERMINISTIC COLLAPSE - NO RANDOMNESS!
          // If bridge is weak, it IMMEDIATELY collapses and STOPS all movement!
          if (!willSucceed && !bridgeCollapsedRef.current) {
            console.log('🚨 BRIDGE COLLAPSING! Too weak!');
            bridgeCollapsedRef.current = true;
            isWalkingRef.current = false;
            
            // Initialize bridge segment positions
            bridgeSegmentsYRef.current = new Array(bridge.length).fill(0);
            
            // CRITICAL: Stop horizontal movement immediately!
            clearInterval(moveInterval);
            
            // Start bridge breaking animation - segments fall!
            const bridgeFallInterval = setInterval(() => {
              bridgeSegmentsYRef.current = bridgeSegmentsYRef.current.map((y, i) => {
                // Each segment falls at slightly different rate for realistic effect
                return y + 3 + (i * 0.5);
              });
              
              // Stop when all segments have fallen
              if (bridgeSegmentsYRef.current.every(y => y > 150)) {
                clearInterval(bridgeFallInterval);
              }
            }, 30);
            
            // Start vehicle fall animation
            const fallInterval = setInterval(() => {
              vehicleYRef.current += 5;
              if (vehicleYRef.current > 200) {
                clearInterval(fallInterval);
                resolve(); // Resolve ONLY after falling
              }
            }, 30);
            return; // Exit this iteration immediately
          }
        } else {
          vehicleYRef.current = 0;
        }
        
        // Only check success if bridge hasn't collapsed
        if (vehiclePositionRef.current >= 550 || (vehicleYRef.current > 200 && bridgeCollapsedRef.current)) {
          clearInterval(moveInterval);
          isWalkingRef.current = false;
          resolve();
        }
      }, 20);
    });
    
    // Check result: Success ONLY if reached other side WITHOUT collapsing
    if (vehiclePositionRef.current >= 550 && !bridgeCollapsedRef.current) {
      console.log('✅ SUCCESS! Vehicle made it across!');
      setResult('success');
      if (musicEnabled) {
        successSoundRef.current?.play().catch(() => {});
        setTimeout(() => {
          applauseRef.current?.play().catch(() => {});
        }, 500);
      }
      
      const scoreResult = calculateScore(true, currentBudget, load.weight);
      setLevelResult(scoreResult);
      setShowCompletionModal(true);
    } else {
      console.log('❌ FAILURE! Bridge collapsed!');
      setResult('failure');
      if (musicEnabled) {
        failSoundRef.current?.play().catch(() => {});
        setTimeout(() => {
          crashRef.current?.play().catch(() => {});
        }, 200);
      }
    }
    
    setTesting(false);
  };

  const clearBridge = () => {
    setBridge([]);
    setResult(null);
    setCurrentBudget(startingBudget);
    setTotalSpent(0);
    setLevelResult(null);
    setShowCompletionModal(false);
    vehiclePositionRef.current = 0;
    vehicleYRef.current = 0;
    isWalkingRef.current = false;
    bridgeSegmentsYRef.current = [];
  };

  const nextLoad = () => {
    const currentIndex = loads.findIndex(l => l.id === currentLoad);
    if (currentIndex < loads.length - 1) {
      setCurrentLoad(loads[currentIndex + 1].id);
      setResult(null);
      setShowCompletionModal(false);
      clearBridge();
    }
  };

  const tryAgain = () => {
    clearBridge();
    setShowCompletionModal(false);
  };

  const budgetPercentage = (currentBudget / startingBudget) * 100;
  const budgetColor = budgetPercentage > 50 ? 'text-green-600' : budgetPercentage > 20 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <audio ref={bgMusicRef} loop />
      <audio ref={successSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3" />
      <audio ref={failSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3" />
      <audio ref={buildSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1667/1667-preview.mp3" />
      <audio ref={applauseRef} src="https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3" />
      <audio ref={crashRef} src="https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3" />
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Career
        </button>
        
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
          <Music className="w-5 h-5 text-white" />
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="bg-white/30 text-white px-3 py-1 rounded border-none outline-none"
          >
            {musicTracks.map(track => (
              <option key={track.id} value={track.id} className="text-gray-800">
                {track.name}
              </option>
            ))}
          </select>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-white text-sm w-10">{volume}%</span>
          
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-1 rounded transition-colors"
          >
            {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bridge Builder Pro 🎮
            </h1>
            <p className="text-gray-600">Build bridges and help loads cross safely!</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-xs text-gray-600 font-semibold">Budget</div>
                <div className={`text-2xl font-bold ${budgetColor}`}>
                  ${currentBudget.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Spent: ${totalSpent.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {budgetPercentage <= 20 && budgetPercentage > 0 && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-red-900">Low Budget Warning!</p>
                <p className="text-red-800 text-sm">You&apos;re running low on funds. Choose materials wisely!</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm">
              <p className="font-bold text-yellow-900 mb-2">💡 Engineering Tips:</p>
              <ul className="text-yellow-800 space-y-1">
                <li>• <strong>Learn by Testing:</strong> Try different materials and see what works!</li>
                <li>• <strong>Stronger Materials:</strong> Steel is much stronger than wood!</li>
                <li>• <strong>Better Shapes:</strong> I-Beams and Arches add extra strength!</li>
                <li>• <strong>Budget Smart:</strong> Use cheaper materials for lighter loads!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl" style={{ height: '400px' }}>
          {result === 'success' && !showCompletionModal && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-10">
              <Sparkles className="w-5 h-5" />
              Success! Made it across! 🎉
            </div>
          )}
          
          {result === 'failure' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-10">
              💥 Bridge Collapsed! 💦
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {showCompletionModal && levelResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center">
                <div className="mb-6">
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Level Complete! 🎉
                  </h2>
                  <p className="text-gray-600">
                    {levelResult.loadType} crossed successfully!
                  </p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      className={`w-12 h-12 ${
                        i <= levelResult.stars
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Efficiency</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {levelResult.efficiency}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Budget Used</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      ${levelResult.budgetUsed.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">Budget Saved</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      ${levelResult.budgetRemaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  {levelResult.stars === 3 && (
                    <p className="text-lg font-bold text-yellow-600">
                      🌟 Outstanding! Master Engineer! 🌟
                    </p>
                  )}
                  {levelResult.stars === 2 && (
                    <p className="text-lg font-bold text-blue-600">
                      Great job! Very efficient design!
                    </p>
                  )}
                  {levelResult.stars === 1 && (
                    <p className="text-lg font-bold text-gray-600">
                      Good work! Try to save more budget next time!
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={tryAgain}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                  
                  {currentLoad !== 'tank' && (
                    <button
                      onClick={nextLoad}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Next Load
                    </button>
                  )}
                  
                  {currentLoad === 'tank' && (
                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      Complete!
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
          <div className="grid grid-cols-4 gap-3">
            {materials.map((material) => {
              const canAfford = currentBudget >= material.cost;
              
              return (
                <button
                  key={material.id}
                  onClick={() => canAfford && setCurrentMaterial(material.id)}
                  disabled={!canAfford}
                  className={`p-4 rounded-xl border-2 transition-all relative ${
                    currentMaterial === material.id
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : canAfford 
                        ? 'border-gray-200 hover:border-blue-300'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-1">{material.icon}</div>
                  <div className="font-bold text-sm text-gray-800">{material.name}</div>
                  <div className={`text-xs font-semibold mt-1 ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    ${material.cost}
                  </div>
                  {!canAfford && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Can&apos;t afford
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
          <div className="grid grid-cols-4 gap-3">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setCurrentShape(shape.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentShape === shape.id
                    ? 'border-purple-500 bg-purple-50 scale-105'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-1">{shape.icon}</div>
                <div className="font-bold text-sm text-purple-600">{shape.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  +{shape.bonus} strength
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Load</label>
          <div className="grid grid-cols-5 gap-2">
            {loads.map((load) => (
              <button
                key={load.id}
                onClick={() => setCurrentLoad(load.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  currentLoad === load.id
                    ? 'border-orange-500 bg-orange-50 scale-105'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-2xl mb-1">{load.icon}</div>
                <div className="font-bold text-xs text-orange-600">{load.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={addSegment}
            disabled={bridge.length >= 10 || testing || currentBudget < materials.find(m => m.id === currentMaterial)!.cost}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Wrench className="w-5 h-5" />
            Add Segment ({bridge.length}/10)
          </button>
          
          <button
            onClick={clearBridge}
            disabled={testing}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Clear
          </button>
        </div>

        <button
          onClick={testBridge}
          disabled={testing || bridge.length === 0}
          className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:from-gray-300 disabled:to-gray-400 px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Test Bridge
        </button>
      </div>
    </div>
  );
}
