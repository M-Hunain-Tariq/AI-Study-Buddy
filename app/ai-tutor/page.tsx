'use client';

import React, { useRef, useState } from 'react';
import { ToastProvider } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AiTutorHero } from '@/components/ai-tutor/AiTutorHero';
import { AiChatWorkspace } from '@/components/ai-tutor/AiChatWorkspace';
import { AiTutorRightSidebar } from '@/components/ai-tutor/AiTutorRightSidebar';
import { MobileAiTutor } from '@/components/mobile/MobileAiTutor';
import { useIsPhone } from '@/components/mobile/useIsPhone';
import type { SavedChat } from '@/lib/ai/chat-history';

function AiTutorPageContent() {
  const isPhone = useIsPhone();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [selectedChat, setSelectedChat] = useState<SavedChat | null>(null);
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
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[256px] transition-all duration-300">
        {/* Sticky Header matching Dashboard */}
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onNavigateAiTutor={() => {}}
        />

        {/* AI Tutor Main Canvas matching three-zone layout */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto space-y-5 sm:space-y-6">
          {isPhone === null ? null : isPhone ? (
            <MobileAiTutor initialPrompt={selectedPrompt} onClearInitialPrompt={() => setSelectedPrompt(undefined)} />
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Center Main Area (8 cols out of 12) */}
            <div className="lg:col-span-8 flex flex-col space-y-5">
              {/* Premium AI Tutor hero */}
              <AiTutorHero />

              {/* Main chat workspace */}
              <AiChatWorkspace
                initialPrompt={selectedPrompt}
                onClearInitialPrompt={() => setSelectedPrompt(undefined)}
                fileInputRef={uploadInputRef}
                selectedChat={selectedChat}
                onClearSelectedChat={() => setSelectedChat(null)}
              />
            </div>

            {/* Compact workspace utilities */}
            <div className="lg:col-span-4">
              <AiTutorRightSidebar onRequestFileUpload={() => uploadInputRef.current?.click()} onSelectChat={setSelectedChat} />
            </div>
          </div>
          )}
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
