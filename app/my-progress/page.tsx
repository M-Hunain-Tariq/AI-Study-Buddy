'use client';

import React, { useState } from 'react';
import { ToastProvider } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { MyProgressWorkspace } from '@/components/my-progress/MyProgressWorkspace';

function MyProgressPageContent() {
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
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[240px] transition-all duration-300">
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1480px] mx-auto space-y-4 sm:space-y-5 pb-24 lg:pb-6">
          <MyProgressWorkspace />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeItem="My Progress" />
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
