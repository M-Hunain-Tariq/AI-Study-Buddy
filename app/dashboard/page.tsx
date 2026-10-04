'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastProvider, useToast } from '@/components/Toast';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { StatCards } from '@/components/StatCards';
import { UpcomingTasks } from '@/components/UpcomingTasks';
import { QuickActions } from '@/components/QuickActions';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { RecentNotes } from '@/components/RecentNotes';
import { RightSidebarWidgets } from '@/components/RightSidebarWidgets';
import { NoteDetailModal } from '@/components/NoteDetailModal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
const AiTutorHero = dynamic(() => import('@/components/ai-tutor/AiTutorHero').then((m) => m.AiTutorHero), { ssr: false });
const AiChatWorkspace = dynamic(() => import('@/components/ai-tutor/AiChatWorkspace').then((m) => m.AiChatWorkspace), { ssr: false });
const AiTutorRightSidebar = dynamic(() => import('@/components/ai-tutor/AiTutorRightSidebar').then((m) => m.AiTutorRightSidebar), { ssr: false });
const StudyPlannerWorkspace = dynamic(() => import('@/components/study-planner/StudyPlannerWorkspace').then((m) => m.StudyPlannerWorkspace), { ssr: false });
const MyNotesWorkspace = dynamic(() => import('@/components/my-notes/MyNotesWorkspace').then((m) => m.MyNotesWorkspace), { ssr: false });
const TasksWorkspace = dynamic(() => import('@/components/tasks/TasksWorkspace').then((m) => m.TasksWorkspace), { ssr: false });
const QuizPracticeWorkspace = dynamic(() => import('@/components/quiz/QuizPracticeWorkspace').then((m) => m.QuizPracticeWorkspace), { ssr: false });
const MyProgressWorkspace = dynamic(() => import('@/components/my-progress/MyProgressWorkspace').then((m) => m.MyProgressWorkspace), { ssr: false });
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Task, NoteItem } from '@/types/dashboard';

function DashboardContent() {
  const { showToast } = useToast();
  // Default to 'Dashboard' on initial load; opens 'My Notes' when clicking 'Add Note'
  const [currentPage, setCurrentPage] = useState<'Dashboard' | 'AI Tutor' | 'Study Planner' | 'My Notes' | 'Tasks' | 'Quiz & Practice' | 'My Progress'>('Dashboard');
  const [dashboardMobileTab, setDashboardMobileTab] = useState<'overview' | 'schedule'>('overview');
  const [aiTutorMobileTab, setAiTutorMobileTab] = useState<'chat' | 'prompts'>('chat');
  const [openCreateModalOnNotes, setOpenCreateModalOnNotes] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedAiPrompt, setSelectedAiPrompt] = useState<string | undefined>(undefined);

  // Initial realistic school tasks matching Image 1
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleToggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextState = !target.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextState } : t))
    );
    showToast(
      nextState
        ? `Task completed: "${target.title}" 🎉`
        : `Task reopened: "${target.title}"`,
      nextState ? 'success' : 'info'
    );
  };

  const handleOpenAiTutor = (prompt?: string) => {
    setCurrentPage('AI Tutor');
    if (prompt) {
      setSelectedAiPrompt(prompt);
    }
    showToast('Switched to AI Tutor Workspace!', 'ai');
  };

  return (
    <div className="fresh-page fresh-app-shell relative min-h-screen bg-[#07101f] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      {/* Background Atmosphere with rich blue/purple lighting matching Image 1 */}
      <AnimatedBackground />

      {/* Sidebar Navigation matching active page state */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          showToast(`Navigated to ${page}`, 'info');
        }}
        onNavigateAiTutor={() => handleOpenAiTutor()}
      />

      {/* Main Viewport Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:pl-[240px] transition-all duration-300">
        {/* Sticky Header */}
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onNavigateAiTutor={() => handleOpenAiTutor()}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1480px] mx-auto space-y-4 sm:space-y-5 pb-24 lg:pb-6">
          {currentPage === 'Dashboard' && (
            /* STEP 1: DASHBOARD PAGE VIEW */
            <div>
              {/* Mobile Tab Switcher to prevent endless scrolling */}
              <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner mb-3">
                <button
                  onClick={() => setDashboardMobileTab('overview')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    dashboardMobileTab === 'overview'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚡ Overview & Stats</span>
                </button>
                <button
                  onClick={() => setDashboardMobileTab('schedule')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    dashboardMobileTab === 'schedule'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📅 Tasks & Schedule</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                {/* Left/Main Column (8 cols out of 12) */}
                <div
                  className={`lg:col-span-8 flex-col space-y-4 sm:space-y-5 ${
                    dashboardMobileTab === 'schedule' ? 'hidden lg:flex' : 'flex'
                  }`}
                >
                  {/* 1. Large Hero Welcome Section with Laptop visual */}
                  <HeroBanner
                    onContinueLearning={() =>
                      showToast('Resuming Algebra: Linear Equations (Lesson 3 of 5)...', 'info')
                    }
                    onAskAiTutor={() => handleOpenAiTutor()}
                  />

                  {/* 2. Key Statistics (4 Cards in compact 2x2 grid on mobile) */}
                  <StatCards completedTasksCount={5} />

                  {/* 3. Balanced 2x2 Grid: [Today's Tasks, Weekly Progress, Recent Notes, Quick Actions] with Identical Heights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                    <div className="h-[310px]">
                      <UpcomingTasks
                        tasks={tasks}
                        onToggleTask={handleToggleTask}
                      />
                    </div>
                    <div className="h-[310px]">
                      <WeeklyProgress />
                    </div>
                    <div className="h-[310px]">
                      <RecentNotes
                        onSelectNote={() => {
                          setCurrentPage('My Notes');
                          showToast('Opened note in My Notes', 'info');
                        }}
                        onViewAll={() => {
                          setCurrentPage('My Notes');
                          showToast('Navigated to My Notes', 'info');
                        }}
                      />
                    </div>
                    <div className="h-[310px]">
                      <QuickActions
                        onAskAiTutor={() => handleOpenAiTutor()}
                        onNavigateStudyPlanner={() => {
                          setCurrentPage('Study Planner');
                          showToast('Navigated to Study Planner', 'info');
                        }}
                        onOpenNote={() => {
                          setOpenCreateModalOnNotes(true);
                          setCurrentPage('My Notes');
                          showToast('Opening Create Note modal...', 'info');
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column (4 cols out of 12) */}
                <div
                  className={`lg:col-span-4 ${
                    dashboardMobileTab === 'overview' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <RightSidebarWidgets />
                </div>
              </div>
            </div>
          )}

          {currentPage === 'AI Tutor' && (
            /* STEP 2: AI TUTOR PAGE VIEW */
            <div>
              {/* Mobile Tab Switcher */}
              <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner mb-3">
                <button
                  onClick={() => setAiTutorMobileTab('chat')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    aiTutorMobileTab === 'chat'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💬 AI Chat Tutor</span>
                </button>
                <button
                  onClick={() => setAiTutorMobileTab('prompts')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    aiTutorMobileTab === 'prompts'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💡 Topics & Prompts</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                {/* Center Main Area (8 cols out of 12) */}
                <div
                  className={`lg:col-span-8 flex-col space-y-4 sm:space-y-5 ${
                    aiTutorMobileTab === 'prompts' ? 'hidden lg:flex' : 'flex'
                  }`}
                >
                  {/* 1. AI Tutor Hero with Mascot & 4 Action Chips */}
                  <AiTutorHero
                    onSelectActionChip={(prompt) => {
                      setSelectedAiPrompt(prompt);
                      setAiTutorMobileTab('chat');
                      showToast('Loaded prompt into AI Tutor chat composer!', 'info');
                    }}
                  />

                  {/* 2. Main AI Chat Workspace with Tabs, Empty State & Composer */}
                  <AiChatWorkspace
                    initialPrompt={selectedAiPrompt}
                    onClearInitialPrompt={() => setSelectedAiPrompt(undefined)}
                  />
                </div>

                {/* Right Utilities Column (4 cols out of 12) */}
                <div
                  className={`lg:col-span-4 ${
                    aiTutorMobileTab === 'chat' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <AiTutorRightSidebar
                    onSelectPrompt={(prompt) => {
                      setSelectedAiPrompt(prompt);
                      setAiTutorMobileTab('chat');
                      showToast('Prompt loaded into chat composer!', 'info');
                    }}
                    onSelectSubject={(subjectName, samplePrompt) => {
                      setSelectedAiPrompt(samplePrompt);
                      setAiTutorMobileTab('chat');
                      showToast(`Loaded ${subjectName} question into chat!`, 'info');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {currentPage === 'Study Planner' && (
            /* STEP 3: STUDY PLANNER PAGE VIEW */
            <StudyPlannerWorkspace
              onNavigateAiTutor={(prompt) => handleOpenAiTutor(prompt)}
              onNavigateProgress={() => {
                setCurrentPage('My Progress');
                showToast('Navigated to My Progress!', 'info');
              }}
            />
          )}

          {currentPage === 'My Notes' && (
            /* STEP 4: MY NOTES PAGE VIEW */
            <MyNotesWorkspace initialOpenCreate={openCreateModalOnNotes} />
          )}

          {currentPage === 'Tasks' && (
            /* STEP 5: TASKS PAGE VIEW */
            <TasksWorkspace />
          )}

          {currentPage === 'Quiz & Practice' && (
            /* STEP 6: QUIZ & PRACTICE PAGE VIEW */
            <QuizPracticeWorkspace />
          )}

          {currentPage === 'My Progress' && (
            /* STEP 7: MY PROGRESS PAGE VIEW */
            <MyProgressWorkspace />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed for quick 1-tap navigation on phone) */}
      <MobileBottomNav
        activeItem={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Note Detail Modal */}
      <NoteDetailModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
