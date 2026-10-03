'use client';

import React from 'react';
import Image from 'next/image';
import { User, Palette, Bell, ShieldCheck, Database, Headphones, Settings, ChevronRight } from 'lucide-react';
import type { SectionId } from './types';

const CARDS: { id: SectionId; title: string; desc: string; icon: React.ComponentType<{ className?: string }>; grad: string }[] = [
  { id: 'profile', title: 'Profile', desc: 'Manage your personal information and account details.', icon: User, grad: 'from-blue-500 to-indigo-600' },
  { id: 'appearance', title: 'Appearance', desc: 'Customize the look and feel of the app.', icon: Palette, grad: 'from-purple-500 to-fuchsia-600' },
  { id: 'notifications', title: 'Notifications', desc: 'Control your notifications and alerts.', icon: Bell, grad: 'from-violet-500 to-purple-700' },
  { id: 'privacy', title: 'Privacy & Security', desc: 'Keep your account safe and secure.', icon: ShieldCheck, grad: 'from-teal-400 to-emerald-600' },
  { id: 'data', title: 'Data & Storage', desc: 'Manage your data and storage usage.', icon: Database, grad: 'from-sky-400 to-blue-600' },
  { id: 'help', title: 'Help & Support', desc: 'Get help, find answers and contact us.', icon: Headphones, grad: 'from-blue-500 to-cyan-500' },
];

export const SettingsHub: React.FC<{ onOpen: (id: SectionId) => void }> = ({ onOpen }) => (
  <div className="space-y-4 sm:space-y-5">
    <div className="relative overflow-hidden rounded-[24px] bg-[#070F28] border border-[#1A2C59] min-h-[170px] flex items-center">
      <Image src="/images/ai_tutor_robot_hero.jpg" alt="" fill unoptimized priority sizes="1400px" className="object-cover object-[85%_center] opacity-85" />
      <div className="absolute inset-y-0 left-0 w-full sm:w-[70%] bg-gradient-to-r from-[#070F28] via-[#070F28]/92 to-transparent" />
      <div className="relative z-10 p-5 sm:p-7 max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-xs sm:text-[13px] text-slate-300 mt-1.5">Manage your account, customize your experience and get the most out of AI Study Buddy.</p>
      </div>
      <p className="hidden md:block absolute top-5 right-48 z-10 font-serif italic text-sm font-bold text-cyan-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] rotate-3 leading-tight">
        Better Learning,<br />Brighter Future!
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {CARDS.map((c) => (
        <button
          key={c.id}
          onClick={() => onOpen(c.id)}
          className="card-surface group flex items-center gap-4 text-left rounded-2xl p-4 sm:p-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.4)]`}>
            <c.icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white">{c.title}</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">{c.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      ))}
    </div>

    <div className="card-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#12224A] border border-[#22386B] flex items-center justify-center shrink-0">
        <Settings className="w-5 h-5 text-blue-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">Advanced Settings</p>
        <p className="text-[11.5px] text-slate-400">Access developer options, advanced features and experimental settings.</p>
      </div>
      <button
        onClick={() => onOpen('advanced')}
        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-[0_0_18px_rgba(79,70,229,0.45)] hover:shadow-[0_0_26px_rgba(79,70,229,0.7)] cursor-pointer"
      >
        Show Advanced Settings →
      </button>
    </div>
  </div>
);
