import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <div className="absolute top-6 left-6 lg:left-12 z-50">
      {/* Brand Logo Lockup positioned on the left side */}
      <a href="#" className="inline-flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(56,189,248,0.5)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.9)] transition-all group-hover:scale-105">
          <div className="w-full h-full bg-[#040d24] rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-cyan-400 fill-current drop-shadow-[0_0_8px_rgba(6,182,212,0.9)] group-hover:rotate-12 transition-transform">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] group-hover:text-cyan-200 transition-colors">
            StudyBuddy
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 group-hover:border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            AI POWERED
          </span>
        </div>
      </a>
    </div>
  );
};
