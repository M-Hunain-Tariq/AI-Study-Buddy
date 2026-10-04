import React, { useEffect, useState } from 'react';

export const BackgroundAtmosphere: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smooth percentage calculation
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none reference-canvas">
      {/* Shared reference atmosphere: same cinematic cyan/violet lighting language */}
      <div className="absolute inset-0 reference-horizon" />
      <div className="absolute top-[3%] right-[10%] w-[390px] h-[390px] rounded-full reference-orb opacity-55 animate-pulse-glow" />
      <div className="absolute -top-[18%] left-[20%] w-[115%] h-[85%] reference-ray reference-ray-animated" />
      <div className="absolute -bottom-[10%] inset-x-[-10%] h-[50%] reference-floor opacity-60" />
      <div className="absolute top-[14%] left-[14%] w-1 h-1 rounded-full reference-star" />
      <div className="absolute top-[26%] right-[28%] w-1.5 h-1.5 rounded-full reference-star" style={{animationDelay:'1.1s'}} />
      <div className="absolute top-[42%] left-[67%] w-1 h-1 rounded-full reference-star" style={{animationDelay:'2.2s'}} />
      {/* 1. Base Midnight Void (Matches deep dark space) */}
      <div className="fixed inset-0 bg-[#020717] -z-30" />

      {/* 2. Reactive Interactive Ambient Cosmic Pointer Glow */}
      <div 
        className="fixed inset-0 pointer-events-none -z-25 transition-transform duration-700 ease-out opacity-40"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.06) 45%, transparent 70%)`
        }}
      />

      {/* 3. Soft Organic Radial Vignettes for Deep Cosmic Depth */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.14),transparent_70%)] -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_25%,rgba(99,102,241,0.12),transparent_70%)] -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_65%,rgba(168,85,247,0.08),transparent_70%)] -z-20" />

      {/* 4. Ambient Animated Cosmic Grid Mesh */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:64px_64px] animate-grid-breathe -z-20 pointer-events-none" />

      {/* 5. Deep Space Celestial Orbital Ring 1 (Rotating in background) */}
      <div className="fixed top-12 -right-32 w-[650px] h-[650px] pointer-events-none -z-22 opacity-25">
        <svg viewBox="0 0 500 500" className="w-full h-full animate-celestial-spin">
          <circle cx="250" cy="250" r="230" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="6 12" fill="none" />
          <circle cx="250" cy="250" r="190" stroke="rgba(129,140,248,0.2)" strokeWidth="1" strokeDasharray="3 8" fill="none" />
          <circle cx="250" cy="250" r="140" stroke="rgba(192,132,252,0.25)" strokeWidth="1" strokeDasharray="14 14" fill="none" />
          {/* Small orbital node markers */}
          <circle cx="250" cy="20" r="4" fill="#38bdf8" className="drop-shadow-[0_0_8px_#38bdf8]" />
          <circle cx="440" cy="250" r="3" fill="#818cf8" className="drop-shadow-[0_0_6px_#818cf8]" />
          <circle cx="110" cy="250" r="3.5" fill="#c084fc" className="drop-shadow-[0_0_6px_#c084fc]" />
        </svg>
      </div>

      {/* Deep Space Celestial Orbital Ring 2 (Counter-rotating lower left) */}
      <div className="fixed -bottom-40 -left-32 w-[550px] h-[550px] pointer-events-none -z-22 opacity-20">
        <svg viewBox="0 0 500 500" className="w-full h-full animate-celestial-spin-rev">
          <circle cx="250" cy="250" r="220" stroke="rgba(147,51,234,0.3)" strokeWidth="1" strokeDasharray="8 16" fill="none" />
          <circle cx="250" cy="250" r="170" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 10" fill="none" />
          <circle cx="250" cy="30" r="3.5" fill="#a855f7" className="drop-shadow-[0_0_8px_#a855f7]" />
          <circle cx="420" cy="250" r="4" fill="#38bdf8" className="drop-shadow-[0_0_8px_#38bdf8]" />
        </svg>
      </div>

      {/* 6. Animated Diagonal Celestial Light Beams */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden opacity-60">
        <div className="absolute -top-40 -left-20 w-[600px] h-[1200px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform -rotate-45 blur-3xl animate-light-beam" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[1000px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent transform -rotate-40 blur-3xl animate-light-beam" style={{ animationDelay: '5s' }} />
        <div className="absolute top-2/3 -left-32 w-[550px] h-[900px] bg-gradient-to-r from-transparent via-purple-500/8 to-transparent transform -rotate-35 blur-3xl animate-light-beam" style={{ animationDelay: '8s' }} />
      </div>

      {/* 7. Shooting Stars Streaking through the Cosmic Sky */}
      <div className="fixed inset-0 pointer-events-none -z-15 overflow-hidden">
        {/* Shooting Star 1 */}
        <div className="absolute top-[12%] left-[18%] w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-white shadow-[0_0_14px_#38bdf8] origin-left animate-shooting-star-1 pointer-events-none" />
        {/* Shooting Star 2 */}
        <div className="absolute top-[28%] left-[45%] w-40 h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-white shadow-[0_0_16px_#818cf8] origin-left animate-shooting-star-2 pointer-events-none" />
        {/* Shooting Star 3 */}
        <div className="absolute top-[54%] left-[10%] w-36 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_14px_#7dd3fc] origin-left animate-shooting-star-3 pointer-events-none" />
        {/* Shooting Star 4 (Purple/Cyan burst) */}
        <div className="absolute top-[72%] left-[35%] w-36 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-cyan-100 shadow-[0_0_14px_#c084fc] origin-left animate-shooting-star-2 pointer-events-none" style={{ animationDelay: '8.5s' }} />
      </div>

      {/* 8. Floating Cosmic Stardust & Light Motes Rising Softly */}
      <div className="fixed inset-0 pointer-events-none -z-15 overflow-hidden">
        <div className="absolute bottom-20 left-[15%] w-2 h-2 rounded-full bg-cyan-400/70 blur-[1px] shadow-[0_0_10px_#22d3ee] animate-particle-1" />
        <div className="absolute bottom-40 left-[35%] w-1.5 h-1.5 rounded-full bg-indigo-400/60 blur-[1px] shadow-[0_0_8px_#818cf8] animate-particle-2" />
        <div className="absolute bottom-32 right-[25%] w-2 h-2 rounded-full bg-sky-300/70 blur-[1px] shadow-[0_0_10px_#38bdf8] animate-particle-3" />
        <div className="absolute bottom-60 right-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/60 blur-[1px] shadow-[0_0_8px_#c084fc] animate-particle-4" />
        <div className="absolute bottom-10 left-[55%] w-2 h-2 rounded-full bg-teal-300/60 blur-[1px] shadow-[0_0_10px_#2dd4bf] animate-particle-5" />
        <div className="absolute bottom-72 left-[8%] w-1 h-1 rounded-full bg-blue-300/70 blur-[0.5px] shadow-[0_0_6px_#93c5fd] animate-stardust-1" />
        <div className="absolute bottom-28 right-[42%] w-1.5 h-1.5 rounded-full bg-cyan-300/70 blur-[0.5px] shadow-[0_0_8px_#67e8f9] animate-stardust-2" />
        <div className="absolute bottom-80 right-[8%] w-1 h-1 rounded-full bg-purple-300/60 blur-[0.5px] shadow-[0_0_6px_#d8b4fe] animate-stardust-3" />
      </div>

      {/* 9. Faint Constellation Network (SVG Constellation Geometry) */}
      <div className="fixed top-24 left-[8%] w-[240px] h-[160px] pointer-events-none -z-18 opacity-40 animate-constellation">
        <svg viewBox="0 0 240 160" className="w-full h-full">
          <line x1="20" y1="30" x2="90" y2="20" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="90" y1="20" x2="160" y2="70" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="160" y1="70" x2="210" y2="50" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="90" y1="20" x2="110" y2="120" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="2 3" />
          {/* Nodes */}
          <circle cx="20" cy="30" r="2.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
          <circle cx="90" cy="20" r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#fff]" />
          <circle cx="160" cy="70" r="2.5" fill="#818cf8" className="drop-shadow-[0_0_6px_#818cf8]" />
          <circle cx="210" cy="50" r="3" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
          <circle cx="110" cy="120" r="2" fill="#c084fc" className="drop-shadow-[0_0_4px_#c084fc]" />
        </svg>
      </div>

      {/* Constellation Network 2 (Right side) */}
      <div className="fixed top-[45%] right-[5%] w-[220px] h-[180px] pointer-events-none -z-18 opacity-35 animate-constellation" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 220 180" className="w-full h-full">
          <line x1="40" y1="40" x2="110" y2="60" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="110" y1="60" x2="180" y2="30" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="110" y1="60" x2="140" y2="130" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          {/* Nodes */}
          <circle cx="40" cy="40" r="2.5" fill="#c084fc" className="drop-shadow-[0_0_6px_#c084fc]" />
          <circle cx="110" cy="60" r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#fff]" />
          <circle cx="180" cy="30" r="2.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
          <circle cx="140" cy="130" r="2.5" fill="#818cf8" className="drop-shadow-[0_0_6px_#818cf8]" />
        </svg>
      </div>

      {/* 10. Global Natural Twinkling Diamond Stars */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-80">
        {/* Soft 4-Point Diamond Stars */}
        <div className="absolute top-16 left-[14%] w-3.5 h-3.5 text-cyan-300/85 twinkle-1 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>
        <div className="absolute top-28 right-[24%] w-4 h-4 text-purple-300/75 twinkle-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.9)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>
        <div className="absolute top-52 right-[8%] w-3 h-3 text-sky-200/85 twinkle-3 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>
        <div className="absolute top-[38%] left-[7%] w-3.5 h-3.5 text-cyan-200/75 twinkle-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>
        <div className="absolute top-[62%] right-[11%] w-3.5 h-3.5 text-indigo-300/85 twinkle-1 drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>
        <div className="absolute top-[80%] left-[20%] w-3 h-3 text-cyan-300/75 twinkle-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>

        {/* Delicate Stardust Pinpoints */}
        <div className="absolute top-24 left-[32%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff] twinkle-1" />
        <div className="absolute top-44 right-[36%] w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_#38bdf8] twinkle-3" />
        <div className="absolute top-[28%] right-[15%] w-1.5 h-1.5 bg-blue-200 rounded-full shadow-[0_0_6px_#93c5fd] twinkle-2" />
        <div className="absolute top-[48%] left-[22%] w-1 h-1 bg-purple-300 rounded-full shadow-[0_0_6px_#c084fc] twinkle-1" />
        <div className="absolute top-[70%] right-[25%] w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_6px_#38bdf8] twinkle-2" />
        <div className="absolute top-[18%] left-[0%] w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff] twinkle-3" />
        <div className="absolute top-[86%] right-[38%] w-1.5 h-1.5 bg-sky-200 rounded-full shadow-[0_0_6px_#7dd3fc] twinkle-1" />
      </div>

      {/* 11. Global Volumetric Auroras for Deep Ambient Atmosphere */}
      <div className="absolute top-0 left-0 right-0 h-[880px] overflow-hidden pointer-events-none">
        {/* Soft Volumetric Cyan Aura behind Robot Desk */}
        <div className="absolute -top-10 right-0 w-[750px] h-[750px] bg-gradient-to-bl from-cyan-500/22 via-blue-600/18 to-transparent rounded-full blur-[140px] animate-aurora-1" />
        {/* Soft Violet Backlight */}
        <div className="absolute top-20 right-[20%] w-[520px] h-[520px] bg-indigo-600/18 rounded-full blur-[120px] animate-aurora-2" />
        {/* Left Typography Wash */}
        <div className="absolute top-10 left-[5%] w-[480px] h-[480px] bg-blue-900/14 rounded-full blur-[130px] animate-aurora-3" />
      </div>

      {/* Mid-Page Ambient Drifting Aurora Glows */}
      <div className="absolute top-[35%] inset-x-0 h-[700px] overflow-hidden pointer-events-none -z-20">
        <div className="absolute -left-20 top-1/4 w-[600px] h-[600px] bg-cyan-600/12 rounded-full blur-[160px] animate-aurora-2" />
        <div className="absolute -right-20 top-1/3 w-[650px] h-[650px] bg-purple-600/12 rounded-full blur-[170px] animate-aurora-1" />
      </div>

      {/* Lower-Page Ambient Cosmic Glows */}
      <div className="absolute top-[65%] inset-x-0 h-[800px] overflow-hidden pointer-events-none -z-20">
        <div className="absolute left-1/3 top-10 w-[700px] h-[500px] bg-indigo-600/12 rounded-full blur-[180px] animate-aurora-3" />
      </div>

      {/* Bottom Separator Fade into Footer */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#020717] to-transparent pointer-events-none" />
    </div>
  );
};
