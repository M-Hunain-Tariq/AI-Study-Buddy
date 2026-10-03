'use client';

import React from 'react';
import Image from 'next/image';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useToast } from '../Toast';
import { ACCENTS, FONTS, type AppSettings } from '@/lib/settings';
import { Card, CardTitle, SectionShell, fieldClass } from './ui';
import type { SectionProps } from './types';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'auto', label: 'Auto', icon: Monitor },
] as const;

const BGS = [
  { id: 'default', label: 'Default', cls: 'from-[#0B1A45] to-[#060D24]' },
  { id: 'animated', label: 'Animated', cls: 'from-[#1D3FA8] via-[#4B2FA8] to-[#0B1A45]' },
  { id: 'minimal', label: 'Minimal', cls: 'from-[#0A0F1F] to-[#0A0F1F]' },
] as const;

export const AppearanceSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const set = (patch: Partial<AppSettings>) => update((s) => ({ ...s, ...patch }));

  return (
    <SectionShell
      title="Appearance Settings"
      subtitle="Customize the look and feel of AI Study Buddy."
      onBack={onBack}
      aside={
        <div className="relative overflow-hidden rounded-2xl border border-[#162544] min-h-[380px] lg:sticky lg:top-24">
          <Image src="/images/motivation_mountain_exact.jpg" alt="Glowing mountain with a flag on the summit" fill unoptimized sizes="300px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D24] via-transparent to-[#060D24]/40" />
          <p className="absolute left-4 top-4 font-serif italic text-lg font-bold text-cyan-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] leading-tight">
            Learn<br />Grow<br />Succeed
          </p>
        </div>
      }
    >
      <Card>
        <CardTitle>Theme Mode</CardTitle>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme mode">
          {THEMES.map((t) => {
            const active = settings.theme === t.id;
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={active}
                onClick={() => {
                  set({ theme: t.id });
                  if (t.id !== 'dark') showToast(`${t.label} preference saved. The app currently renders in dark mode.`, 'info');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  active
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.35)]'
                    : 'bg-[#081025] border-[#162544] text-slate-400 hover:text-white'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <h3 className="text-sm font-semibold text-white mt-5 mb-3">Accent Color</h3>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color">
          {ACCENTS.map((c) => {
            const active = settings.accent === c;
            return (
              <button
                key={c}
                role="radio"
                aria-checked={active}
                aria-label={`Accent ${c}`}
                onClick={() => set({ accent: c })}
                style={{ background: c, boxShadow: active ? `0 0 16px ${c}` : undefined }}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ring-offset-2 ring-offset-[#0A132C] ${
                  active ? 'ring-2 ring-white' : 'hover:scale-110 transition-transform'
                }`}
              >
                {active && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        <h3 className="text-sm font-semibold text-white mt-5 mb-3">Background Style</h3>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Background style">
          {BGS.map((b) => {
            const active = settings.background === b.id;
            return (
              <button key={b.id} role="radio" aria-checked={active} onClick={() => set({ background: b.id })} className="text-center cursor-pointer group">
                <div
                  className={`h-16 rounded-xl bg-gradient-to-br ${b.cls} border-2 transition-all ${
                    active ? 'border-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.45)]' : 'border-[#162544] group-hover:border-[#2B4580]'
                  }`}
                />
                <span className={`block mt-1.5 text-[11px] ${active ? 'text-white font-semibold' : 'text-slate-400'}`}>{b.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle>Typography</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-[11px] text-slate-400 mb-1">Font Family</span>
            <select className={fieldClass} value={settings.fontFamily} onChange={(e) => set({ fontFamily: e.target.value })}>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-[11px] text-slate-400 mb-1">Text Size</span>
            <select className={fieldClass} value={settings.textSize} onChange={(e) => set({ textSize: e.target.value as AppSettings['textSize'] })}>
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>
      </Card>
    </SectionShell>
  );
};
