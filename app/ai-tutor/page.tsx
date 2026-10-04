'use client';

import React, { useState } from 'react';
import { ToastProvider, useToast } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AiTutorHero } from '@/components/ai-tutor/AiTutorHero';
import { AiChatWorkspace } from '@/components/ai-tutor/AiChatWorkspace';
import { AiTutorRightSidebar } from '@/components/ai-tutor/AiTutorRightSidebar';

function AiTutorPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('initial_ai_prompt');
        if (stored) {
          sessionStorage.removeItem('initial_ai_prompt');
          return stored;
        }
      } catch {
        // ignore
      }
    }
    return undefined;
  });
  const { showToast } = useToast();

  const handleSelectActionChip = (prompt: string) => {
    setSelectedPrompt(prompt);
    showToast('Loaded prompt into AI Tutor chat composer!', 'info');
  };

  const handleSelectRightPrompt = (promptText: string) => {
    setSelectedPrompt(promptText);
  };

  const handleSelectSubject = (subjectName: string, samplePrompt: string) => {
    setSelectedPrompt(samplePrompt);
  };

  return (
    <div className="fresh-page relative min-h-screen bg-[#07101f] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      {/* Background Atmosphere matching Dashboard & Image 1 */}
      <AnimatedBackground />

      {/* Sidebar Navigation with AI Tutor as the active highlighted page */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="AI Tutor"
      />

      {/* Main Viewport Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[240px] transition-all duration-300">
        {/* Sticky Header matching Dashboard */}
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onNavigateAiTutor={() => {}}
        />

        {/* AI Tutor Main Canvas matching three-zone layout */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1480px] mx-auto space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Center Main Area (8 cols out of 12) */}
            <div className="lg:col-span-8 flex flex-col space-y-5">
              {/* 1. AI Tutor Hero with Mascot & 4 Action Chips */}
              <AiTutorHero onSelectActionChip={handleSelectActionChip} />

              {/* 2. Main AI Chat Workspace with Tabs, Empty State & Composer */}
              <AiChatWorkspace
                initialPrompt={selectedPrompt}
                onClearInitialPrompt={() => setSelectedPrompt(undefined)}
              />
            </div>

            {/* Right Utilities Column (4 cols out of 12) */}
            <div className="lg:col-span-4">
              <AiTutorRightSidebar
                onSelectPrompt={handleSelectRightPrompt}
                onSelectSubject={handleSelectSubject}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AiTutorPage() {
  return (
    <ToastProvider>
      <AiTutorPageContent />
    </ToastProvider>
  );
}
