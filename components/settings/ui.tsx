'use client';

import React from 'react';
import { ChevronLeft, X } from 'lucide-react';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(2,6,23,0.85)] ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex items-center justify-between gap-3 mb-3">
    <h3 className="text-sm font-semibold text-white">{children}</h3>
    {right}
  </div>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    style={{ background: checked ? 'var(--accent, #6366F1)' : '#1B2A4E' }}
    className="relative w-11 h-6 rounded-full shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

export const Row: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  tone?: string;
  children?: React.ReactNode;
}> = ({ icon: Icon, title, desc, tone = 'text-blue-300 bg-blue-500/15 border-blue-500/25', children }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#122143] last:border-0">
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-slate-100">{title}</p>
      {desc && <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">{desc}</p>}
    </div>
    {children}
  </div>
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...p }) => (
  <button
    {...p}
    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-[0_0_18px_rgba(79,70,229,0.45)] hover:shadow-[0_0_26px_rgba(79,70,229,0.7)] transition-shadow cursor-pointer disabled:opacity-50 ${className}`}
  />
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...p }) => (
  <button
    {...p}
    className={`px-4 py-2 rounded-xl text-xs font-semibold text-slate-100 bg-[#0E1B3D] border border-[#22386B] hover:border-blue-500/60 hover:bg-[#12224A] transition-colors cursor-pointer ${className}`}
  />
);

/** Page shell for every settings sub-page: back link, title, main column and illustrated side panel. */
export const SectionShell: React.FC<{
  title: string;
  subtitle: string;
  onBack: () => void;
  action?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, onBack, action, aside, children }) => (
  <div className="space-y-4 sm:space-y-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-2 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> All settings
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs sm:text-[13px] text-slate-400 mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
    <div className={`grid grid-cols-1 gap-4 sm:gap-5 ${aside ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''} items-start`}>
      <div className="space-y-4 sm:space-y-5 min-w-0">{children}</div>
      {aside}
    </div>
  </div>
);

/** Right-hand illustrated panel (icon orb + copy) used on most sub-pages. */
export const SidePanel: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  glow?: string;
  image?: React.ReactNode;
}> = ({ icon: Icon, title, desc, glow = '59,130,246', image }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0A132C] to-[#07102A] border border-[#162544] p-6 flex flex-col items-center text-center min-h-[300px] justify-center lg:sticky lg:top-24">
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(circle at 50% 75%, rgba(${glow},0.28), transparent 60%)` }}
    />
    <div className="relative">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 bg-white/[0.04]"
        style={{ boxShadow: `0 0 50px rgba(${glow},0.45)` }}
      >
        <Icon className="w-9 h-9 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
      </div>
    </div>
    <h3 className="relative mt-5 text-lg font-bold text-white">{title}</h3>
    <p className="relative mt-2 text-xs text-slate-400 max-w-[220px] leading-relaxed">{desc}</p>
    {image}
  </div>
);

export const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[#0A132C] border border-[#22386B] p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const fieldClass =
  'w-full bg-[#081025] border border-[#162544] focus:border-blue-500 rounded-lg px-3 py-2 text-[13px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed';

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-[11px] text-slate-400 mb-1">{label}</span>
    {children}
  </label>
);
