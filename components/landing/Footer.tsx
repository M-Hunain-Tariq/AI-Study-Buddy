import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  return (
    <footer className="landing-footer relative z-20 border-t border-slate-800/80 bg-[#020716] py-12 px-6">
      <ScrollReveal animation="fade-up" delay={50} className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left spacing to balance layout */}
        <div className="hidden md:block w-36" />

        {/* Center: Brand & Copyright */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 mb-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1.5px] shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              <div className="w-full h-full bg-[#040d24] rounded-[6px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-cyan-400 fill-current">
                  <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>
            </div>
            <span className="font-heading text-lg font-bold text-white tracking-tight">
              StudyBuddy
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © 2025 StudyBuddy. All rights reserved.
          </p>
        </div>

        {/* Right: Legal & Links */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-cyan-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-cyan-300 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-cyan-300 transition-colors">
            Contact
          </a>
        </div>
      </ScrollReveal>
    </footer>
  );
};

