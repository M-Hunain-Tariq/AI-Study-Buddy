'use client';

import React from 'react';

// Pre-computed particles with fixed coordinates for zero-hydration mismatch & smooth 60fps performance
const PARTICLES = [
  { id: 1, top: '8%', left: '15%', size: 3, color: '#38BDF8', delay: '0s', dur: '7s' },
  { id: 2, top: '14%', left: '82%', size: 2, color: '#A855F7', delay: '1.2s', dur: '9s' },
  { id: 3, top: '22%', left: '45%', size: 4, color: '#60A5FA', delay: '2.5s', dur: '8s' },
  { id: 4, top: '31%', left: '28%', size: 2, color: '#F472B6', delay: '0.8s', dur: '11s' },
  { id: 5, top: '38%', left: '70%', size: 3, color: '#34D399', delay: '3.1s', dur: '6.5s' },
  { id: 6, top: '47%', left: '12%', size: 2, color: '#818CF8', delay: '1.8s', dur: '10s' },
  { id: 7, top: '56%', left: '88%', size: 3, color: '#38BDF8', delay: '0.4s', dur: '8.5s' },
  { id: 8, top: '65%', left: '35%', size: 2.5, color: '#C084FC', delay: '2.2s', dur: '7.8s' },
  { id: 9, top: '74%', left: '62%', size: 3, color: '#60A5FA', delay: '1.5s', dur: '9.2s' },
  { id: 10, top: '83%', left: '20%', size: 2, color: '#FBBF24', delay: '3.6s', dur: '8s' },
  { id: 11, top: '91%', left: '78%', size: 3.5, color: '#38BDF8', delay: '2.0s', dur: '11s' },
  { id: 12, top: '18%', left: '94%', size: 2, color: '#818CF8', delay: '0.7s', dur: '6s' },
  { id: 13, top: '27%', left: '8%', size: 3, color: '#A855F7', delay: '2.9s', dur: '10.5s' },
  { id: 14, top: '52%', left: '52%', size: 2, color: '#34D399', delay: '1.1s', dur: '7.2s' },
  { id: 15, top: '68%', left: '92%', size: 2.5, color: '#60A5FA', delay: '3.4s', dur: '8.8s' },
  { id: 16, top: '86%', left: '44%', size: 3, color: '#F472B6', delay: '0.2s', dur: '9.5s' },
];

export const AnimatedBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="sb-animated-bg fixed inset-0 pointer-events-none overflow-hidden z-0 select-none reference-canvas"
    >
      {/* Shared reference atmosphere: same cinematic cyan/violet lighting language */}
      <div className="absolute inset-0 reference-horizon" />
      <div className="absolute top-[3%] right-[10%] w-[390px] h-[390px] rounded-full reference-orb opacity-55 animate-pulse-glow" />
      <div className="absolute -top-[18%] left-[20%] w-[115%] h-[85%] reference-ray reference-ray-animated" />
      <div className="absolute -bottom-[10%] inset-x-[-10%] h-[50%] reference-floor opacity-60" />
      <div className="absolute top-[14%] left-[14%] w-1 h-1 rounded-full reference-star" />
      <div className="absolute top-[26%] right-[28%] w-1.5 h-1.5 rounded-full reference-star" style={{animationDelay:'1.1s'}} />
      <div className="absolute top-[42%] left-[67%] w-1 h-1 rounded-full reference-star" style={{animationDelay:'2.2s'}} />
      {/* 1. BASE CANVAS: Deep midnight navy */}
      <div className="absolute inset-0 bg-[#04091A]" />

      {/* 2. LAYERED ORGANIC NEBULAE: Slow-breathing atmospheric light */}
      {/* Top Left: Electric Royal Blue */}
      <div className="absolute -top-[12%] left-[5%] w-[1000px] h-[750px] rounded-full bg-blue-600/22 blur-[140px] animate-pulse-glow" />

      {/* Top Right: Cosmic Violet / Purple */}
      <div
        className="absolute -top-[5%] right-[0%] w-[900px] h-[800px] rounded-full bg-purple-600/20 blur-[150px] animate-drift"
        style={{ animationDuration: '20s' }}
      />

      {/* Mid Left: Glowing Cyan */}
      <div
        className="absolute top-[40%] -left-[6%] w-[750px] h-[650px] rounded-full bg-cyan-500/16 blur-[130px] animate-float-slow"
        style={{ animationDuration: '14s' }}
      />

      {/* Bottom Center-Right: Royal Indigo */}
      <div className="absolute -bottom-[15%] right-[10%] w-[950px] h-[700px] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse-glow" />

      {/* 3. DUAL PRECISION TECHNICAL GRID: Clean academic cyber aesthetic */}
      {/* Micro dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #60A5FA 1.2px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Fine architectural coordinate grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #818CF8 1px, transparent 1px), linear-gradient(to bottom, #818CF8 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)',
        }}
      />

      {/* 4. HOLOGRAPHIC ORBITAL AI RINGS (TOP RIGHT): Rotating concentric technical circles */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] opacity-25">
        {/* Outer dashed ring */}
        <svg className="w-full h-full animate-spin-slow" viewBox="0 0 400 400" fill="none">
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="url(#ringGrad1)"
            strokeWidth="1.5"
            strokeDasharray="10 14"
          />
          <circle cx="200" cy="20" r="3" fill="#60A5FA" className="animate-twinkle" />
          <circle cx="380" cy="200" r="2.5" fill="#C084FC" className="animate-twinkle" />
          <defs>
            <linearGradient id="ringGrad1" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#A855F7" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner reverse rotating ring */}
        <svg className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] animate-spin-reverse-slow" viewBox="0 0 300 300" fill="none">
          <circle
            cx="150"
            cy="150"
            r="130"
            stroke="url(#ringGrad2)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
          <circle cx="150" cy="20" r="2.5" fill="#38BDF8" />
          <defs>
            <linearGradient id="ringGrad2" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. HOLOGRAPHIC NEURAL RING (BOTTOM LEFT): Counter-rotating subtle orbital ring */}
      <div className="absolute -bottom-28 -left-28 w-[420px] h-[420px] opacity-20">
        <svg className="w-full h-full animate-spin-reverse-slow" viewBox="0 0 400 400" fill="none">
          <circle
            cx="200"
            cy="200"
            r="170"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="12 18"
          />
          <circle cx="200" cy="30" r="3" fill="#38BDF8" />
          <circle cx="30" cy="200" r="2" fill="#818CF8" />
        </svg>
      </div>

      {/* 6. NEURAL CONSTELLATION GRAPH (Subtle interconnected study knowledge network) */}
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#60A5FA" strokeWidth="0.75" strokeDasharray="3 4">
          <line x1="15%" y1="12%" x2="28%" y2="24%" />
          <line x1="28%" y1="24%" x2="42%" y2="18%" />
          <line x1="72%" y1="15%" x2="85%" y2="28%" />
          <line x1="85%" y1="28%" x2="78%" y2="45%" />
          <line x1="22%" y1="70%" x2="36%" y2="82%" />
          <line x1="68%" y1="65%" x2="82%" y2="78%" />
        </g>
        <g fill="#93C5FD">
          <circle cx="15%" cy="12%" r="2" />
          <circle cx="28%" cy="24%" r="2.5" />
          <circle cx="42%" cy="18%" r="2" />
          <circle cx="72%" cy="15%" r="2.5" />
          <circle cx="85%" cy="28%" r="2" />
          <circle cx="78%" cy="45%" r="2.5" />
          <circle cx="22%" cy="70%" r="2" />
          <circle cx="36%" cy="82%" r="2.5" />
          <circle cx="68%" cy="65%" r="2" />
          <circle cx="82%" cy="78%" r="2.5" />
        </g>
      </svg>

      {/* 7. FLOATING GLOWING PARTICLES: Smooth organic floating & twinkling */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}

      {/* 8. DIAGONAL AURORA LIGHT SWEEP: Subtle periodic light shimmer */}
      <div className="absolute -inset-x-[50%] -top-[50%] h-[200%] w-[200%] bg-gradient-to-r from-transparent via-cyan-400/[0.03] to-transparent animate-aurora-sweep pointer-events-none" />
    </div>
  );
};
