import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext.jsx';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Determine colors based on theme
      const gridColor = isDarkMode ? 'rgba(129, 140, 248, 0.05)' : 'rgba(99, 91, 255, 0.03)';
      const particleBaseColor = isDarkMode ? '129, 140, 248' : '99, 91, 255';
      const lineColorOpacityBase = isDarkMode ? 0.25 : 0.15;

      // Draw grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      const offsetX = (performance.now() / 50) % gridSize;
      const offsetY = (performance.now() / 50) % gridSize;

      ctx.beginPath();
      for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = -offsetY; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw particles and lines
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleBaseColor}, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${particleBaseColor}, ${(150 - dist) / 150 * lineColorOpacityBase})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-white dark:bg-surface-950 transition-colors duration-500">
      {/* Canvas for Particles & Grid */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] transition-all duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] bg-primary-200 dark:bg-primary-600 rounded-full animate-card-float" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-100 dark:bg-purple-600 rounded-full animate-card-float delay-300" />
        <div className="absolute -bottom-[20%] left-[30%] w-[60%] h-[40%] bg-blue-50 dark:bg-blue-900 rounded-full animate-card-float delay-500" />
      </div>
    </div>
  );
}
