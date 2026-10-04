'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider, useToast } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { TasksWorkspace } from '@/components/tasks/TasksWorkspace';

function TasksPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigateAiTutor = (prompt?: string) => {
    if (prompt) {
      try {
        sessionStorage.setItem('initial_ai_prompt', prompt);
      } catch {
        // ignore
      }
    }
    router.push('/ai-tutor');
    showToast('Switched to AI Tutor Workspace!', 'ai');
  };

  return (
    <div className="fresh-page relative min-h-screen bg-[#07101f] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      {/* Background Atmosphere */}
      <AnimatedBackground />

      {/* Sidebar Navigation with Tasks active */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="Tasks"
        onNavigateAiTutor={() => handleNavigateAiTutor()}
      />

      {/* Main Viewport Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[256px] transition-all duration-300">
        {/* Sticky Header */}
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onNavigateAiTutor={() => handleNavigateAiTutor()}
        />

        {/* Tasks Main Canvas matching image.png */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto space-y-5 sm:space-y-6">
          <TasksWorkspace />
        </main>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <ToastProvider>
      <TasksPageContent />
    </ToastProvider>
  );
}
