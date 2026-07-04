import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  category: string;
  color: string;
  detailsUrl: string;
  mockupText: string;
}

const PROJECTS: Project[] = [
  { id: 1, name: 'CRM Dashboard', category: 'SaaS Platform', color: 'from-emerald-400 to-teal-500', detailsUrl: '/work', mockupText: 'CRM' },
  { id: 2, name: 'AI Analytics', category: 'Data Intelligence', color: 'from-blue-400 to-indigo-500', detailsUrl: '/work', mockupText: 'AI' },
  { id: 3, name: 'Finance Dashboard', category: 'FinTech', color: 'from-amber-400 to-orange-500', detailsUrl: '/work', mockupText: '$$$' },
  { id: 4, name: 'Healthcare Platform', category: 'HealthTech', color: 'from-rose-400 to-red-500', detailsUrl: '/work', mockupText: 'Med' },
  { id: 5, name: 'E-Commerce Store', category: 'Retail Platform', color: 'from-purple-400 to-pink-500', detailsUrl: '/work', mockupText: 'Cart' },
  { id: 6, name: 'Mobile Banking', category: 'FinTech App', color: 'from-cyan-400 to-blue-500', detailsUrl: '/work', mockupText: 'Bank' },
  { id: 7, name: 'HRMS Portal', category: 'Enterprise HR', color: 'from-teal-400 to-emerald-500', detailsUrl: '/work', mockupText: 'HR' },
  { id: 8, name: 'Inventory System', category: 'Logistics', color: 'from-orange-400 to-amber-500', detailsUrl: '/work', mockupText: 'Stock' },
  { id: 9, name: 'LMS Platform', category: 'EdTech', color: 'from-indigo-400 to-violet-500', detailsUrl: '/work', mockupText: 'Learn' },
  { id: 10, name: 'Restaurant POS', category: 'Hospitality', color: 'from-red-400 to-rose-500', detailsUrl: '/work', mockupText: 'POS' },
  { id: 11, name: 'AI Chatbot', category: 'Automation', color: 'from-fuchsia-400 to-purple-500', detailsUrl: '/work', mockupText: 'Bot' },
  { id: 12, name: 'Admin Dashboard', category: 'SaaS Control', color: 'from-sky-400 to-blue-500', detailsUrl: '/work', mockupText: 'Admin' },
];

export default function ProjectGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6.4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- Lighting ---
    // Key directional light representing the sun (illuminates front right)
    const dirLight = new THREE.DirectionalLight('#ffffff', 3.0);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Soft ambient light to prevent pitch-black shadows
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.55);
    scene.add(ambientLight);

    // Subtle blue backlight to create a gorgeous atmospheric edge glow (corona effect)
    const backLight = new THREE.DirectionalLight('#0ea5e9', 1.8);
    backLight.position.set(-5, -2, -5);
    scene.add(backLight);

    // --- Globe Properties ---
    const R_globe = 1.65;
    const R_clouds = 1.68;
    const R_cards = 2.45; // Increased card distance to spread them out and prevent clutter

    // --- Fallback Texture Generation (Online/Offline Resilience) ---
    const createFallbackTexture = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1024;
      tempCanvas.height = 512;
      const ctx = tempCanvas.getContext('2d')!;

      // Deep Ocean Blue
      ctx.fillStyle = '#0f274a';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      ctx.save();
      ctx.scale(tempCanvas.width / 100, tempCanvas.height / 100);
      
      // Draw land (emerald green)
      ctx.fillStyle = '#10b981';
      
      // North America
      ctx.beginPath();
      let p = new Path2D("M15,22 C18,20 22,18 26,19 C28,21 32,24 35,22 C36,25 38,27 35,30 C32,32 30,28 27,29 C24,31 22,34 18,33 C15,31 12,28 15,22 Z");
      ctx.fill(p);
      
      // South America
      ctx.beginPath();
      p = new Path2D("M22,38 C25,37 28,40 29,43 C28,47 26,52 24,57 C22,62 23,68 20,72 C18,70 17,65 17,60 C18,55 16,50 15,45 C15,41 18,39 22,38 Z");
      ctx.fill(p);
      
      // Africa
      ctx.beginPath();
      p = new Path2D("M42,40 C46,38 52,36 56,40 C58,42 62,45 61,48 C59,51 55,54 53,58 C51,62 48,65 45,69 C43,67 43,62 45,58 C47,54 44,50 42,46 C41,43 41,41 42,40 Z");
      ctx.fill(p);
      
      // Europe & Asia
      ctx.beginPath();
      p = new Path2D("M44,22 C48,20 54,19 60,21 C65,22 70,18 75,21 C78,23 82,21 85,24 C83,28 78,30 75,32 C74,35 70,38 67,36 C64,38 60,35 56,36 C52,38 48,35 45,37 C43,35 42,28 44,22 Z");
      ctx.fill(p);
      
      // Southeast Asia & Australia
      ctx.beginPath();
      p = new Path2D("M72,42 C74,40 76,43 78,45 C75,47 73,45 72,42 Z");
      ctx.fill(p);
      ctx.beginPath();
      p = new Path2D("M78,55 C82,53 86,55 88,58 C86,61 82,63 78,61 C76,59 76,57 78,55 Z");
      ctx.fill(p);
      
      ctx.restore();
      return new THREE.CanvasTexture(tempCanvas);
    };

    // --- Texture Loading ---
    const textureLoader = new THREE.TextureLoader();
    
    // Create Earth Material
    const earthMat = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.1,
    });

    // Try loading realistic Earth texture from unpkg CDN
    textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = texture;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback texture on error / offline
        earthMat.map = createFallbackTexture();
        earthMat.needsUpdate = true;
      }
    );

    // Create Earth Mesh
    const earthGeo = new THREE.SphereGeometry(R_globe, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // --- Clouds Layer ---
    const cloudsMat = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-clouds.png',
      (texture) => {
        cloudsMat.map = texture;
        cloudsMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback: simple procedural clouds or transparent
        cloudsMat.visible = false;
      }
    );

    const cloudsGeo = new THREE.SphereGeometry(R_clouds, 64, 64);
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);

    // --- Distribute Project Cards Evenly using Fibonacci Sphere ---
    interface ProjectNode {
      id: number;
      localPos: THREE.Vector3;
    }
    
    const projectNodes: ProjectNode[] = [];
    const N = PROJECTS.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // range 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = 2 * Math.PI * i / goldenRatio;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      const localPos = new THREE.Vector3(x * R_cards, y * R_cards, z * R_cards);
      projectNodes.push({ id: PROJECTS[i].id, localPos });
    }

    // --- Interactive Drag Handling ---
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let baseRotationY = 0;
    let baseRotationX = 0;

    let targetRotY = 0;
    let targetRotX = 0.15; // default tilted view
    let currentRotY = 0;
    let currentRotX = 0.15;

    let lastDragTime = 0;
    let lastRotationVelocityY = 0.002; // initial slow rotation speed

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      baseRotationY = targetRotY;
      baseRotationX = targetRotX;
      lastDragTime = performance.now();
      lastRotationVelocityY = 0;
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startPointerX;
      const deltaY = e.clientY - startPointerY;

      // Map drag distance in pixels to radians
      targetRotY = baseRotationY + deltaX * 0.005;
      targetRotX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, baseRotationX + deltaY * 0.004));

      const now = performance.now();
      const dt = now - lastDragTime;
      if (dt > 0) {
        lastRotationVelocityY = (deltaX * 0.005) / dt;
      }
      lastDragTime = now;
    };

    const onPointerUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // --- Animation Loop ---
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();

      // Auto-rotation when not dragging or hovering a card (pauses on card hover for readability)
      const isCardHovered = hoveredCardId !== null;
      if (!isDragging && !isCardHovered) {
        const timeSinceDrag = performance.now() - lastDragTime;
        
        // Wait 2.2 seconds after drag to resume auto-rotation
        if (timeSinceDrag > 2200) {
          const acceleration = Math.min((timeSinceDrag - 2200) / 1500, 1);
          targetRotY += 0.0016 * acceleration;
        } else {
          // Decay drag speed slightly (inertia)
          targetRotY += lastRotationVelocityY * 16;
          lastRotationVelocityY *= 0.92;
        }
      }

      // Smooth interpolation for both axes
      const lerpSpeed = isDragging ? 0.22 : 0.07;
      currentRotY += (targetRotY - currentRotY) * lerpSpeed;
      currentRotX += (targetRotX - currentRotX) * lerpSpeed;

      // Apply rotations to Earth & Clouds (clouds rotate slightly faster for realism!)
      earthMesh.rotation.y = currentRotY;
      earthMesh.rotation.x = currentRotX;

      cloudsMesh.rotation.y = currentRotY * 1.08 + time * 0.002;
      cloudsMesh.rotation.x = currentRotX;

      // Project the 12 floating project cards onto screen coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;

      const euler = new THREE.Euler(currentRotX, currentRotY, 0, 'YXZ');
      const quaternion = new THREE.Quaternion().setFromEuler(euler);

      projectNodes.forEach((node, idx) => {
        const cardEl = cardsRef.current[idx];
        if (!cardEl) return;

        // Apply global rotation to the local card position
        const rotatedPos = node.localPos.clone().applyQuaternion(quaternion);

        // Floating parallax animation
        const floatOffset = Math.sin(time * 1.5 + idx * 0.7) * 0.10;
        rotatedPos.addScaledVector(rotatedPos.clone().normalize(), floatOffset);

        // Project 3D vector to Normalized Device Coordinates (NDC)
        const projected = rotatedPos.clone().project(camera);

        // Convert NDC to client pixels relative to the container element
        const xScreen = (projected.x * halfWidth) + halfWidth;
        const yScreen = (-(projected.y) * halfHeight) + halfHeight;

        const isHovered = hoveredCardId === node.id;
        const zRatio = rotatedPos.z / R_cards; // -1 (backmost) to 1 (frontmost)

        let opacity = 0;
        let scale = 1;

        // Spread / hide occluded cards strictly (showing only cards in the frontmost area)
        // If zRatio > 0.45, card is fully visible. If between 0.15 and 0.45, it fades. Else, hidden.
        if (zRatio > 0.45) {
          opacity = 1;
          scale = 1;
        } else if (zRatio > 0.15) {
          const t = (zRatio - 0.15) / 0.30;
          opacity = t;
          scale = 0.8 + t * 0.2;
        } else {
          opacity = 0;
          scale = 0.8;
        }

        // Hover scale booster
        if (isHovered && opacity > 0.1) {
          scale *= 1.15;
        }

        // Depth sorting
        const depthSortIndex = Math.round((rotatedPos.z + R_cards) * 150);

        // Apply styles directly for high-performance 60fps rendering
        cardEl.style.transform = `translate(-50%, -50%) translate3d(${xScreen}px, ${yScreen}px, 0) scale(${scale})`;
        cardEl.style.opacity = `${opacity}`;
        cardEl.style.zIndex = `${isHovered ? 9999 : depthSortIndex}`;
        cardEl.style.pointerEvents = opacity > 0.45 ? 'auto' : 'none';
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Window Resize Handling ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
    };
  }, [hoveredCardId]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] select-none cursor-grab active:cursor-grabbing"
    >
      {/* Light Radial Glow behind globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-[70px] -mr-8" />
        <div className="w-[200px] h-[200px] rounded-full bg-emerald-400/5 blur-[50px] -mr-8 mt-8 animate-pulse" />
      </div>

      {/* WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />

      {/* 12 Floating HTML Glassmorphism Cards Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onPointerOver={() => setHoveredCardId(project.id)}
            onPointerOut={() => setHoveredCardId(null)}
            className={`absolute left-0 top-0 pointer-events-auto w-[130px] sm:w-[145px] rounded-xl border border-white/60 bg-white/80 backdrop-blur-[8px] p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] hover:border-emerald-500/30 transition-all duration-300 ease-out flex flex-col gap-2`}
            style={{
              transform: 'translate(-50%, -50%) translate3d(0,0,0) scale(0.8)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {/* Custom mini dashboard mockup for premium feel */}
            <div className="w-full h-[40px] sm:h-[48px] rounded-lg bg-zinc-50 border border-zinc-100/60 flex items-center justify-center overflow-hidden relative">
              {/* Mini Top bar */}
              <div className="absolute top-1 left-1.5 flex gap-1">
                <span className="w-1 h-1 rounded-full bg-zinc-200" />
                <span className="w-1 h-1 rounded-full bg-zinc-200" />
                <span className="w-1 h-1 rounded-full bg-zinc-200" />
              </div>
              
              {/* Small abstract layout shape */}
              <div className="flex flex-col gap-1 w-[80%] items-center mt-1">
                <div className="w-full h-1 bg-zinc-200/60 rounded" />
                <div className="flex gap-1.5 w-full">
                  <div className="w-1/2 h-4 rounded bg-zinc-100 border border-zinc-200/50 flex items-center justify-center text-[7px] font-bold text-zinc-400">
                    {project.mockupText}
                  </div>
                  <div className="w-1/2 flex flex-col gap-0.5 justify-center">
                    <div className="w-full h-1.5 rounded-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20" />
                    <div className="w-[70%] h-1 rounded-sm bg-zinc-200/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black text-emerald-600/90 uppercase tracking-widest leading-none">
                {project.category}
              </span>
              <h4 className="text-[10.5px] font-bold text-slate-800 tracking-tight mt-1 truncate">
                {project.name}
              </h4>
            </div>

            {/* View Link */}
            <a 
              href={project.detailsUrl}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-[8.5px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-0.5 transition-colors self-start mt-0.5"
            >
              Details <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
