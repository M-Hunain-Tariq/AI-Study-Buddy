'use client';

import React, { useState } from 'react';
import { ToastProvider } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { MyProgressWorkspace } from '@/components/my-progress/MyProgressWorkspace';
import { MobileProgress } from '@/components/mobile/MobileProgress';
import { useIsPhone } from '@/components/mobile/useIsPhone';

function MyProgressPageContent() {
  const isPhone = useIsPhone();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fresh-page relative min-h-screen bg-[#07101f] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      <AnimatedBackground />

      {/* Sidebar with active Item 'My Progress' */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="My Progress"
      />

      {/* Main Viewport */}
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[256px] transition-all duration-300">
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto space-y-5 sm:space-y-6 pb-6">
          {isPhone === null ? null : isPhone ? <MobileProgress /> : <MyProgressWorkspace />}
        </main>
      </div>

    </div>
  );
}

export default function MyProgressPage() {
  return (
    <ToastProvider>
      <MyProgressPageContent />
    </ToastProvider>
  );
}
