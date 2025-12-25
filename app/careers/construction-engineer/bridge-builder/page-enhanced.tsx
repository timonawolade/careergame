'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Wrench, Play, RotateCcw, Sparkles, Volume2, VolumeX, Trophy, DollarSign, Star, TrendingUp } from 'lucide-react';
import * as THREE from 'three';

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

export default function BridgeBuilderEnhanced() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vehicleRef = useRef<THREE.Group | null>(null);
  const splashRef = useRef<THREE.Group | null>(null);
  const waterRef = useRef<THREE.Mesh | null>(null);
  
  // ========== STATE MANAGEMENT ==========
  const [currentMaterial, setCurrentMaterial] = useState<Material>('wood');
  const [currentShape, setCurrentShape] = useState<Shape>('straight');
  const [currentLoad, setCurrentLoad] = useState<Load>('person');
  const [bridge, setBridge] = useState<BridgeSegment[]>([]);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<'success' | 'failure' | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  // ========== NEW: BUDGET & SCORING STATE ==========
  const [startingBudget] = useState(10000);
  const [currentBudget, setCurrentBudget] = useState(10000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const failSoundRef = useRef<HTMLAudioElement>(null);
  const hammerSoundRef = useRef<HTMLAudioElement>(null);
  const woodBreakRef = useRef<HTMLAudioElement>(null);
  const metalClangRef = useRef<HTMLAudioElement>(null);
  const splashSoundRef = useRef<HTMLAudioElement>(null);

  // ========== MATERIAL DEFINITIONS WITH COSTS ==========
  const materials = [
    { id: 'wood' as Material, name: 'Wood', icon: '🪵', strength: 1, color: 0x8B4513, cost: 500 },
    { id: 'stone' as Material, name: 'Stone', icon: '🪨', strength: 2, color: 0x696969, cost: 800 },
    { id: 'concrete' as Material, name: 'Concrete', icon: '🧱', strength: 3, color: 0xA9A9A9, cost: 1200 },
    { id: 'steel' as Material, name: 'Steel', icon: '⚙️', strength: 4, color: 0x4682B4, cost: 2000 },
  ];

  const shapes = [
    { id: 'straight' as Shape, name: 'Straight', icon: '—', bonus: 0 },
    { id: 'triangle' as Shape, name: 'Triangle', icon: '△', bonus: 1 },
    { id: 'arch' as Shape, name: 'Arch', icon: '⌒', bonus: 1.5 },
    { id: 'ibeam' as Shape, name: 'I-Beam', icon: 'I', bonus: 2 },
  ];

  const loads = [
    { id: 'person' as Load, name: 'Person', icon: '🚶', weight: 1, speed: 0.03 },
    { id: 'car' as Load, name: 'Car', icon: '🚗', weight: 2, speed: 0.04 },
    { id: 'truck' as Load, name: 'Truck', icon: '🚚', weight: 3, speed: 0.035 },
    { id: 'bus' as Load, name: 'Bus', icon: '🚌', weight: 4, speed: 0.025 },
    { id: 'tank' as Load, name: 'Tank', icon: '🪖', weight: 5, speed: 0.02 },
  ];

  // ========== MUSIC CONTROL ==========
  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicEnabled]);

  // ========== CONSTRUCTION SOUNDS ==========
  const playConstructionSound = (materialType: Material) => {
    if (!musicEnabled) return;
    
    if (materialType === 'steel') {
      metalClangRef.current?.play().catch(() => {});
    } else {
      hammerSoundRef.current?.play().catch(() => {});
    }
  };

  // ========== ENHANCED REALISTIC MATERIALS ==========
  const createRealisticMaterial = (materialType: Material) => {
    if (materialType === 'wood') {
      // Enhanced wood with better grain pattern
      const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.85,
        metalness: 0.0,
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      
      // Base wood color with variation
      const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
      gradient.addColorStop(0, '#A0522D');
      gradient.addColorStop(0.5, '#8B4513');
      gradient.addColorStop(1, '#654321');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Wood grain lines
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.6)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        const y = Math.random() * 1024;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          256, y + (Math.random() - 0.5) * 100,
          512, y + (Math.random() - 0.5) * 100,
          768, y + (Math.random() - 0.5) * 100
        );
        ctx.bezierCurveTo(
          900, y + (Math.random() - 0.5) * 50,
          1000, y + (Math.random() - 0.5) * 50,
          1024, y
        );
        ctx.stroke();
      }
      
      // Knots and imperfections
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 30 + 20;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(50, 30, 20, 0.8)');
        gradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      material.map = texture;
      
      return material;
      
    } else if (materialType === 'stone') {
      // Enhanced stone with realistic surface
      const material = new THREE.MeshStandardMaterial({
        color: 0x696969,
        roughness: 0.95,
        metalness: 0.0,
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      
      // Base stone color
      ctx.fillStyle = '#696969';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Stone surface variation
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 15 + 5;
        const shade = Math.floor(Math.random() * 60 - 30);
        ctx.fillStyle = `rgb(${105 + shade}, ${105 + shade}, ${105 + shade})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Cracks and veins
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
        const segments = Math.floor(Math.random() * 5) + 3;
        for (let j = 0; j < segments; j++) {
          ctx.lineTo(
            Math.random() * 1024,
            Math.random() * 1024
          );
        }
        ctx.stroke();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      material.map = texture;
      
      return material;
      
    } else if (materialType === 'concrete') {
      // Enhanced concrete with realistic texture
      const material = new THREE.MeshStandardMaterial({
        color: 0xA9A9A9,
        roughness: 0.8,
        metalness: 0.0,
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      
      // Base concrete color
      const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
      gradient.addColorStop(0, '#BABABA');
      gradient.addColorStop(0.5, '#A9A9A9');
      gradient.addColorStop(1, '#989898');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Concrete aggregate (small stones)
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 4 + 1;
        const shade = Math.floor(Math.random() * 50 - 25);
        ctx.fillStyle = `rgb(${169 + shade}, ${169 + shade}, ${169 + shade})`;
        ctx.fillRect(x, y, size, size);
      }
      
      // Subtle variations
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 40 + 20;
        const shade = Math.floor(Math.random() * 20 - 10);
        ctx.fillStyle = `rgba(${169 + shade}, ${169 + shade}, ${169 + shade}, 0.3)`;
        ctx.fillRect(x, y, size, size);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3);
      material.map = texture;
      
      return material;
      
    } else {
      // Enhanced steel with realistic metallic surface
      const material = new THREE.MeshStandardMaterial({
        color: 0x708090,
        roughness: 0.3,
        metalness: 0.95,
        envMapIntensity: 1.5,
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      
      // Steel base with brushed metal effect
      const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
      gradient.addColorStop(0, '#8B9DC3');
      gradient.addColorStop(0.25, '#708090');
      gradient.addColorStop(0.5, '#5C6D7F');
      gradient.addColorStop(0.75, '#708090');
      gradient.addColorStop(1, '#8B9DC3');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Brushed metal lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 150; i++) {
        const y = i * 7;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y + (Math.random() - 0.5) * 10);
        ctx.stroke();
      }
      
      // Highlight reflections
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const gradient = ctx.createLinearGradient(x, 0, x + 100, 1024);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, 0, 100, 1024);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      material.map = texture;
      
      return material;
    }
  };

  // ========== 3D SCENE SETUP ==========
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 20, 100);
    sceneRef.current = scene;

    // ========== ENHANCED LIGHTING ==========
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light (sun) with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Hemisphere light for realistic sky lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x654321, 0.5);
    scene.add(hemisphereLight);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup with shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== ENHANCED ENVIRONMENT ==========
    
    // Left Cliff (enhanced texture)
    const leftCliffGeometry = new THREE.BoxGeometry(8, 15, 10);
    const cliffMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B7355,
      roughness: 0.9,
      metalness: 0.0,
    });
    
    // Add cliff texture
    const cliffCanvas = document.createElement('canvas');
    cliffCanvas.width = 512;
    cliffCanvas.height = 512;
    const cliffCtx = cliffCanvas.getContext('2d')!;
    cliffCtx.fillStyle = '#8B7355';
    cliffCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 10 + 3;
      const shade = Math.floor(Math.random() * 40 - 20);
      cliffCtx.fillStyle = `rgb(${139 + shade}, ${115 + shade}, ${85 + shade})`;
      cliffCtx.beginPath();
      cliffCtx.arc(x, y, size, 0, Math.PI * 2);
      cliffCtx.fill();
    }
    const cliffTexture = new THREE.CanvasTexture(cliffCanvas);
    cliffTexture.wrapS = THREE.RepeatWrapping;
    cliffTexture.wrapT = THREE.RepeatWrapping;
    cliffTexture.repeat.set(2, 3);
    cliffMaterial.map = cliffTexture;
    
    const leftCliff = new THREE.Mesh(leftCliffGeometry, cliffMaterial);
    leftCliff.position.set(-15, 0, 0);
    leftCliff.castShadow = true;
    leftCliff.receiveShadow = true;
    scene.add(leftCliff);

    // Right Cliff
    const rightCliff = new THREE.Mesh(leftCliffGeometry, cliffMaterial);
    rightCliff.position.set(15, 0, 0);
    rightCliff.castShadow = true;
    rightCliff.receiveShadow = true;
    scene.add(rightCliff);

    // ========== ANIMATED WATER ==========
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E90FF,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.3,
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -10;
    water.receiveShadow = true;
    scene.add(water);
    waterRef.current = water;

    // Ground under cliffs
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -7.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // ========== CLOUDS ==========
    const createCloud = (x: number, y: number, z: number) => {
      const cloud = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(Math.random() * 2 + 1, 16, 16),
          new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF, 
            transparent: true, 
            opacity: 0.7 
          })
        );
        sphere.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        cloud.add(sphere);
      }
      cloud.position.set(x, y, z);
      return cloud;
    };

    const cloud1 = createCloud(-20, 15, -30);
    const cloud2 = createCloud(25, 18, -35);
    const cloud3 = createCloud(0, 20, -40);
    scene.add(cloud1, cloud2, cloud3);

    setModelsLoaded(true);

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate water
      if (waterRef.current) {
        const material = waterRef.current.material as THREE.MeshBasicMaterial;
        if (material.color) {
          material.color.setHSL(
            0.55 + Math.sin(Date.now() * 0.001) * 0.05,
            0.8,
            0.5
          );
        }
      }
      
      // Animate clouds
      cloud1.position.x += 0.01;
      if (cloud1.position.x > 30) cloud1.position.x = -30;
      
      cloud2.position.x -= 0.015;
      if (cloud2.position.x < -30) cloud2.position.x = 30;
      
      cloud3.position.x += 0.008;
      if (cloud3.position.x > 30) cloud3.position.x = -30;
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // ========== UPDATE BRIDGE VISUALIZATION ==========
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old bridge segments
    const oldSegments = sceneRef.current.children.filter(
      (child) => child.userData.isBridgeSegment
    );
    oldSegments.forEach((segment) => sceneRef.current!.remove(segment));

    // Add new bridge segments
    bridge.forEach((segment, index) => {
      const segmentWidth = 20 / Math.max(bridge.length, 1);
      const material = createRealisticMaterial(segment.material);
      
      let geometry: THREE.BufferGeometry;
      
      if (segment.shape === 'straight') {
        geometry = new THREE.BoxGeometry(segmentWidth, 0.5, 3);
      } else if (segment.shape === 'triangle') {
        geometry = new THREE.ConeGeometry(1.5, 3, 3);
      } else if (segment.shape === 'arch') {
        geometry = new THREE.TorusGeometry(2, 0.5, 8, 16, Math.PI);
      } else {
        geometry = new THREE.BoxGeometry(segmentWidth, 1, 0.5);
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = -10 + (index + 0.5) * segmentWidth;
      mesh.position.y = 2;
      mesh.userData.isBridgeSegment = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      if (segment.shape === 'arch') {
        mesh.rotation.z = Math.PI / 2;
        mesh.position.y = 3;
      } else if (segment.shape === 'triangle') {
        mesh.rotation.z = Math.PI;
      }
      
      sceneRef.current!.add(mesh);
    });
  }, [bridge]);

  // ========== ADD SEGMENT WITH BUDGET CHECK ==========
  const addSegment = () => {
    const selectedMaterial = materials.find(m => m.id === currentMaterial)!;
    const segmentCost = selectedMaterial.cost;
    
    // Check if we have enough budget
    if (currentBudget < segmentCost) {
      alert(`Insufficient budget! You need $${segmentCost} but only have $${currentBudget} remaining.`);
      return;
    }
    
    if (bridge.length >= 10) return;
    
    playConstructionSound(currentMaterial);
    
    const newSegment: BridgeSegment = {
      material: currentMaterial,
      shape: currentShape,
      cost: segmentCost,
    };
    
    // Update budget
    setCurrentBudget(prev => prev - segmentCost);
    setTotalSpent(prev => prev + segmentCost);
    setBridge([...bridge, newSegment]);
  };

  // ========== CALCULATE SCORING ==========
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
    
    // Efficiency calculation: Higher score = more budget saved relative to load weight
    const efficiency = (budgetRemaining / startingBudget) * 100;
    
    // Star rating based on efficiency
    let stars = 1;
    if (efficiency >= 70) stars = 3;  // 70%+ budget saved = 3 stars
    else if (efficiency >= 40) stars = 2;  // 40-69% budget saved = 2 stars
    else stars = 1;  // Less than 40% = 1 star
    
    // Bonus star for heavier loads
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

  // ========== TEST BRIDGE ==========
  const testBridge = async () => {
    if (bridge.length === 0 || testing) return;
    
    setTesting(true);
    setResult(null);
    
    const load = loads.find(l => l.id === currentLoad)!;
    const bridgeStrength = bridge.reduce((total, segment) => {
      const mat = materials.find(m => m.id === segment.material)!;
      const shp = shapes.find(s => s.id === segment.shape)!;
      return total + (mat.strength + shp.bonus);
    }, 0);
    
    const requiredStrength = load.weight * bridge.length * 0.8;
    const success = bridgeStrength >= requiredStrength;
    
    // Create and animate vehicle
    if (!sceneRef.current) return;
    
    const vehicleGroup = new THREE.Group();
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: load.id === 'tank' ? 0x4A4A4A : 0xFF6347,
      metalness: 0.4,
      roughness: 0.6,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    vehicleGroup.add(body);
    
    if (load.id !== 'person') {
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      
      [-0.6, 0.6].forEach(x => {
        [-0.8, 0.8].forEach(z => {
          const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, -0.5, z);
          wheel.castShadow = true;
          vehicleGroup.add(wheel);
        });
      });
    }
    
    vehicleGroup.position.set(-17, 5.5, 0);
    sceneRef.current.add(vehicleGroup);
    vehicleRef.current = vehicleGroup;
    
    // Animate vehicle crossing
    await new Promise<void>((resolve) => {
      let position = -17;
      const targetPosition = 17;
      
      const moveVehicle = () => {
        if (!vehicleRef.current) return;
        
        position += load.speed;
        vehicleRef.current.position.x = position;
        
        // Check bridge boundaries
        if (position >= -10 && position <= 10) {
          if (!success && Math.random() > 0.7) {
            // Bridge failure
            vehicleRef.current.rotation.z = Math.PI / 4;
            vehicleRef.current.position.y -= 0.3;
          }
        }
        
        if (position >= targetPosition || (vehicleRef.current.position.y < -5 && !success)) {
          resolve();
          return;
        }
        
        requestAnimationFrame(moveVehicle);
      };
      
      moveVehicle();
    });
    
    // Show result
    if (success) {
      setResult('success');
      successSoundRef.current?.play().catch(() => {});
      
      // Calculate and show score
      const scoreResult = calculateScore(true, currentBudget, load.weight);
      setLevelResult(scoreResult);
      setShowCompletionModal(true);
    } else {
      setResult('failure');
      failSoundRef.current?.play().catch(() => {});
      
      // Vehicle falls
      if (vehicleRef.current) {
        const fallInterval = setInterval(() => {
          if (vehicleRef.current && vehicleRef.current.position.y > -15) {
            vehicleRef.current.position.y -= 0.5;
            vehicleRef.current.rotation.x += 0.1;
            vehicleRef.current.rotation.z += 0.1;
          } else {
            clearInterval(fallInterval);
            splashSoundRef.current?.play().catch(() => {});
            
            // Create splash effect
            if (sceneRef.current && vehicleRef.current) {
              const splash = new THREE.Group();
              for (let i = 0; i < 10; i++) {
                const particle = new THREE.Mesh(
                  new THREE.SphereGeometry(0.3),
                  new THREE.MeshBasicMaterial({ color: 0x1E90FF })
                );
                particle.position.set(
                  vehicleRef.current.position.x + (Math.random() - 0.5) * 2,
                  -10,
                  (Math.random() - 0.5) * 2
                );
                splash.add(particle);
              }
              sceneRef.current.add(splash);
              splashRef.current = splash;
              
              setTimeout(() => {
                if (sceneRef.current && splashRef.current) {
                  sceneRef.current.remove(splashRef.current);
                }
              }, 2000);
            }
          }
        }, 50);
      }
    }
    
    setTesting(false);
  };

  // ========== CLEAR BRIDGE ==========
  const clearBridge = () => {
    setBridge([]);
    setResult(null);
    setCurrentBudget(startingBudget);
    setTotalSpent(0);
    setLevelResult(null);
    setShowCompletionModal(false);
    
    if (sceneRef.current && vehicleRef.current) {
      sceneRef.current.remove(vehicleRef.current);
      vehicleRef.current = null;
    }
    if (sceneRef.current && splashRef.current) {
      sceneRef.current.remove(splashRef.current);
      splashRef.current = null;
    }
  };

  // ========== NEXT LOAD ==========
  const nextLoad = () => {
    const currentIndex = loads.findIndex(l => l.id === currentLoad);
    if (currentIndex < loads.length - 1) {
      setCurrentLoad(loads[currentIndex + 1].id);
      setResult(null);
      setShowCompletionModal(false);
      clearBridge();
    }
  };

  // ========== TRY AGAIN ==========
  const tryAgain = () => {
    clearBridge();
    setShowCompletionModal(false);
  };

  // ========== BUDGET WARNING ==========
  const budgetPercentage = (currentBudget / startingBudget) * 100;
  const budgetColor = budgetPercentage > 50 ? 'text-green-600' : budgetPercentage > 20 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      {/* Audio elements */}
      <audio ref={bgMusicRef} src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" loop />
      <audio ref={successSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" />
      <audio ref={failSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3" />
      <audio ref={hammerSoundRef} src="https://assets.mixkit.co/active_storage/sfx/1667/1667-preview.mp3" />
      <audio ref={woodBreakRef} src="https://assets.mixkit.co/active_storage/sfx/2545/2545-preview.mp3" />
      <audio ref={metalClangRef} src="https://assets.mixkit.co/active_storage/sfx/1213/1213-preview.mp3" />
      <audio ref={splashSoundRef} src="https://assets.mixkit.co/active_storage/sfx/2464/2464-preview.mp3" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Career
        </button>
        
        <button
          onClick={() => setMusicEnabled(!musicEnabled)}
          className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {musicEnabled ? 'Sound On' : 'Sound Off'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bridge Builder Pro 🎮
            </h1>
            <p className="text-gray-600">Design and test bridges that can handle heavy loads!</p>
          </div>
          
          {/* ========== BUDGET DISPLAY ========== */}
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

        {/* Loading indicator */}
        {!modelsLoaded && (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-6 text-center">
            <div className="text-blue-800 font-semibold">Loading game... 🎮</div>
          </div>
        )}

        {/* Budget warning */}
        {budgetPercentage <= 20 && budgetPercentage > 0 && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-red-900">Low Budget Warning!</p>
                <p className="text-red-800 text-sm">You're running low on funds. Choose materials wisely!</p>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm">
              <p className="font-bold text-yellow-900 mb-2">💡 Engineering Tips:</p>
              <ul className="text-yellow-800 space-y-1">
                <li>• <strong>Stronger Materials:</strong> Steel is stronger than wood (but costs more!)  </li>
                <li>• <strong>Better Shapes:</strong> I-Beams and Arches are stronger than straight segments!</li>
                <li>• <strong>Budget Smart:</strong> Save money by using cheaper materials for lighter loads!</li>
                <li>• <strong>Earn Stars:</strong> Use less budget to get more stars! ⭐⭐⭐</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="bg-gradient-to-b from-sky-200 to-sky-100 rounded-2xl mb-6 relative overflow-hidden" style={{ height: '500px' }}>
          {result === 'success' && !showCompletionModal && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-10 animate-bounce">
              <Sparkles className="w-5 h-5" />
              Success! Made it across! 🎉
            </div>
          )}
          
          {result === 'failure' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-10 animate-bounce">
              💥 Bridge Collapsed! 💦
            </div>
          )}

          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* ========== LEVEL COMPLETION MODAL ========== */}
        {showCompletionModal && levelResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-bounce">
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

                {/* Stars */}
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

                {/* Stats */}
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

                {/* Rating Message */}
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

                {/* Buttons */}
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

        {/* Material Selection */}
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
                      Can't afford
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shape Selection */}
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

        {/* Load Selection */}
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
                <div className="text-xs text-gray-500">Weight: {load.weight}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
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
