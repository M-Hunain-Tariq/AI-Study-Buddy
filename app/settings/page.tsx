'use client';

import React, { useState } from 'react';
import { ToastProvider } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SettingsWorkspace } from '@/components/settings/SettingsWorkspace';

function SettingsPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fresh-page relative min-h-screen bg-[#07101f] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      <AnimatedBackground />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeItem="Settings" />
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[256px] transition-all duration-300">
        <Header onOpenMobileMenu={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">
          <SettingsWorkspace />
        </main>
      </div>
      <MobileBottomNav activeItem="Settings" />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsPageContent />
    </ToastProvider>
  );
}
