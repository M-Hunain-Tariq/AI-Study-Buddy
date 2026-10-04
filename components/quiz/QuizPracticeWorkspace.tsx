'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Brain,
  Sparkles,
  Star,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  BookOpen,
  Code,
  FlaskConical,
  Atom,
  Compass,
  FileCheck2,
  BarChart3,
  Flame,
  Clock,
  Layers,
  Plus,
  Activity,
} from 'lucide-react';
import { QuizDifficulty, QuizItem, QuizSubject, RecentActivityItem } from './types';
import { QuizModal } from './QuizModal';
import { GenerateQuizModal } from './GenerateQuizModal';
import { useToast } from '../Toast';

// 3 Featured Quizzes matching image.png exactly
const FEATURED_QUIZZES: QuizItem[] = [
  {
    id: 'feat-algebra',
    title: 'Algebra Basics',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '× ÷',
    colorScheme: 'blue',
    featured: true,
  },
  {
    id: 'feat-atoms',
    title: 'Atoms & Molecules',
    subject: 'Chemistry',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '⚛',
    colorScheme: 'emerald',
    featured: true,
  },
  {
    id: 'feat-motion',
    title: 'Motion & Forces',
    subject: 'Physics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '∆',
    colorScheme: 'purple',
    featured: true,
  },
];

// 6 All Quizzes matching image.png exactly
const ALL_QUIZZES: QuizItem[] = [
  {
    id: 'quiz-quadratic',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '√x',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-electricity',
    title: 'Electricity & Circuits',
    subject: 'Physics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '⚡',
    colorScheme: 'purple',
  },
  {
    id: 'quiz-periodic',
    title: 'Periodic Table',
    subject: 'Chemistry',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '⚗',
    colorScheme: 'emerald',
  },
  {
    id: 'quiz-grammar',
    title: 'Grammar Basics',
    subject: 'English',
    questionsCount: 10,
    difficulty: 'Easy',
    symbol: '📖',
    colorScheme: 'purple',
  },
  {
    id: 'quiz-python',
    title: 'Python Fundamentals',
    subject: 'Computer Science',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '</>',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-trigonometry',
    title: 'Trigonometry',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '∆',
    colorScheme: 'purple',
  },
];

// Recent Activity Items matching image.png exactly
const RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-algebra',
    title: 'Algebra Basics',
    status: 'Completed',
    timeAgo: '2h ago',
    symbol: '× ÷',
    colorScheme: 'blue',
  },
  {
    id: 'act-atoms',
    title: 'Atoms & Molecules',
    status: 'In Progress',
    timeAgo: '4h ago',
    symbol: '⚛',
    colorScheme: 'emerald',
  },
  {
    id: 'act-quadratic',
    title: 'Quadratic Equations',
    status: 'Completed',
    timeAgo: '1d ago',
    symbol: '√x',
    colorScheme: 'blue',
  },
  {
    id: 'act-circuits',
    title: 'Electricity & Circuits',
    status: 'Started',
    timeAgo: '1d ago',
    symbol: '⚡',
    colorScheme: 'purple',
  },
];

export const QuizPracticeWorkspace: React.FC = () => {
  const { showToast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<QuizSubject>('All Subjects');
  const [sortBy, setSortBy] = useState<'Newest' | 'Popular' | 'Difficulty'>('Newest');
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [timedExam, setTimedExam] = useState(false);
  const [customQuizzes, setCustomQuizzes] = useState<QuizItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<{id:string; title:string; subject:string; score:number; date:string}[]>([]);
  // Mobile tab toggle to prevent infinite scroll on small screens
  const [mobileTab, setMobileTab] = useState<'quizzes' | 'progress'>('quizzes');

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('study_quiz_history_v1') || '[]');
      if (Array.isArray(saved)) setQuizHistory(saved);
    } catch {}
  }, []);

  const completedCount = quizHistory.length;
  const averageScore = completedCount ? Math.round(quizHistory.reduce((sum, item) => sum + item.score, 0) / completedCount) : 0;
  const streakCount = useMemo(() => {
    const days = new Set(quizHistory.map((item) => new Date(item.date).toDateString()));
    let streak = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  }, [quizHistory]);
  const subjectStats = useMemo(() => {
    return ['Mathematics','Physics','Chemistry'].map((subject) => {
      const items = quizHistory.filter((q) => q.subject === subject);
      return { subject, score: items.length ? Math.round(items.reduce((a,b) => a + b.score, 0) / items.length) : 0 };
    });
  }, [quizHistory]);

  // Subject tabs
  const SUBJECT_TABS: { label: QuizSubject; icon: React.ReactNode }[] = [
    { label: 'All Subjects', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Mathematics', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Physics', icon: <Atom className="w-3.5 h-3.5" /> },
    { label: 'Chemistry', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { label: 'English', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Computer Science', icon: <Code className="w-3.5 h-3.5" /> },
  ];

  // Combine custom generated quizzes with default quizzes
  const allAvailableQuizzes = useMemo(() => {
    return [...customQuizzes, ...ALL_QUIZZES];
  }, [customQuizzes]);

  // Filtered quizzes
  const filteredAllQuizzes = useMemo(() => {
    let result = [...allAvailableQuizzes];
    if (selectedSubject !== 'All Subjects') {
      result = result.filter((q) => q.subject === selectedSubject);
    }
    if (sortBy === 'Popular') {
      result = [...result].reverse();
    } else if (sortBy === 'Difficulty') {
      const diffOrder = { Hard: 1, Medium: 2, Easy: 3 };
      result = [...result].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }
    return result;
  }, [allAvailableQuizzes, selectedSubject, sortBy]);

  const filteredFeatured = useMemo(() => {
    if (selectedSubject === 'All Subjects') return FEATURED_QUIZZES;
    return FEATURED_QUIZZES.filter((q) => q.subject === selectedSubject);
  }, [selectedSubject]);

  const handleStartQuiz = (quiz: QuizItem) => {
    setActiveQuiz(quiz);
    showToast(`Starting ${quiz.title}... Good luck! 🎯`, 'info');
  };

  const handleQuizGenerated = (newQuiz: QuizItem) => {
    setCustomQuizzes((prev) => [newQuiz, ...prev]);
    setActiveQuiz(newQuiz);
  };

  return (
    <div className="w-full max-w-full space-y-3 sm:space-y-5 overflow-x-hidden pb-8 sm:pb-4">
      {/* ========================================================
          1. COMPACT NATIVE MOBILE & DESKTOP HERO BANNER
          On mobile: Compact, sleek, glanceable, no wasted space!
          ======================================================== */}
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-gradient-to-r from-[#060D24] via-[#09153A] to-[#0D1533] border border-[#1E3466]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_15px_40px_rgba(2,6,23,0.85)] p-3.5 sm:p-6 lg:p-7 min-h-[135px] sm:min-h-[220px] flex flex-col justify-between group backdrop-blur-xl">
        {/* Top Specular Rim */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none" />

        {/* 3D Robot Buddy Studying Artwork */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/quiz_hero_robot.jpg"
            alt="3D Glowing cute white robot buddy studying with tablet and books"
            fill
            unoptimized
            priority
            sizes="(max-width: 1536px) 100vw, 1500px"
            className="object-cover object-right opacity-60 sm:opacity-80 transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060D24] via-[#060D24]/90 sm:via-[#060D24]/85 to-transparent pointer-events-none" />
        </div>

        {/* Top Text Content & Generate CTA */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="max-w-xl">
            {/* Badge: Squircle Brain Icon + Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <div className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#18113E]/90 border border-[#7C3AED]/50 text-indigo-200 text-[10px] sm:text-xs font-semibold shadow-[0_0_12px_rgba(124,58,237,0.25)] backdrop-blur-md">
                Quiz & Practice
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-[28px] lg:text-[34px] font-extrabold tracking-tight text-white leading-tight">
              Test Your{' '}
              <span className="bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(129,140,248,0.6)]">
                Knowledge
              </span>
            </h1>

            <p className="text-slate-300 text-[11px] sm:text-[13px] font-normal mt-0.5 sm:mt-1 leading-relaxed line-clamp-1 sm:line-clamp-none">
              Take quizzes, practice questions and strengthen your concepts.
            </p>
          </div>

          {/* Quick AI Quiz Generator CTA Button */}
          <div className="flex w-full sm:w-auto gap-2">
            <button onClick={() => setTimedExam((v) => !v)} className={`shrink-0 px-3 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-all ${timedExam ? 'bg-amber-500/20 text-amber-200 border-amber-400/50' : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-400/30'}`}>⏱ {timedExam ? 'Timed Exam ON' : 'Timed Exam'}</button>
            <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full sm:w-auto shrink-0 px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.6)] border border-purple-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group/btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 group-hover/btn:rotate-12 transition-transform" />
            <span>Generate from Lesson</span>
          </button>
          </div>
        </div>

        {/* 4 Small Feature Cards: Desktop Grid & Mobile Swipeable Strip */}
        <div className="relative z-10 hidden sm:grid grid-cols-4 gap-2 sm:gap-3 mt-4 pt-2">
          {/* 1. Practice Tests */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#071026]/85 border border-[#182C56]/70 backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-blue-600/25 text-blue-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-white truncate">Practice Tests</h4>
              <p className="text-[9px] text-slate-400 truncate">Build confidence</p>
            </div>
          </div>

          {/* 2. Instant Feedback */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#071026]/85 border border-[#182C56]/70 backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/25 text-indigo-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-white truncate">Instant Feedback</h4>
              <p className="text-[9px] text-slate-400 truncate">Know your progress</p>
            </div>
          </div>

          {/* 3. Track Progress */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#071026]/85 border border-[#182C56]/70 backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/25 text-cyan-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-white truncate">Track Progress</h4>
              <p className="text-[9px] text-slate-400 truncate">See improvement</p>
            </div>
          </div>

          {/* 4. Better Results */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#071026]/85 border border-[#182C56]/70 backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-purple-600/25 text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-white truncate">Better Results</h4>
              <p className="text-[9px] text-slate-400 truncate">Achieve your goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW SELECTOR (Quizzes vs Progress)
          On mobile screens (< 1024px), gives student instant switch
          between Quizzes & Progress without a massive 1500px long scroll!
          ======================================================== */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner">
        <button
          onClick={() => setMobileTab('quizzes')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'quizzes'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>All Quizzes ({filteredAllQuizzes.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('progress')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'progress'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Progress & Stats</span>
        </button>
      </div>

      {/* ========================================================
          2. SUBJECT FILTER TABS ROW MATCHING image.png
          Touch swipeable with compact pill styling
          ======================================================== */}
      {(mobileTab === 'quizzes' || typeof window === 'undefined') && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#081026] border border-[#162544] p-2 sm:p-3 rounded-2xl shadow-lg">
          {/* Subject Filter Pills - Smooth touch scroll */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {SUBJECT_TABS.map((tab) => {
              const isActive = selectedSubject === tab.label;

              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setSelectedSubject(tab.label);
                    showToast(`Filtered by ${tab.label}`, 'info');
                  }}
                  className={`px-3 py-1.5 sm:px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#9333EA] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-400/40'
                      : 'bg-[#060D20] border border-[#16274D] text-slate-300 hover:text-white hover:bg-[#0C1A3D]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Paste Lesson Action Button */}
          <div className="flex items-center justify-end shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-purple-300" />
              <span>Paste Lesson & Practice</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MAIN CONTENT: RESPONSIVE 2 COLUMNS
          Desktop: 8-col Quizzes + 4-col Sidebar
          Mobile: Native compact 2-column cards, no giant endless scroll!
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* ========================================================
            LEFT AREA: FEATURED QUIZZES + ALL QUIZZES (lg:col-span-8)
            ======================================================== */}
        <div
          className={`lg:col-span-8 space-y-4 sm:space-y-5 ${
            mobileTab === 'progress' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* SECTION 1: FEATURED QUIZZES */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-white tracking-tight">
                    Featured Quizzes
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Recommended for you</p>
                </div>
              </div>

              <button
                onClick={() => showToast('Showing all featured quizzes', 'info')}
                className="text-[11px] sm:text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile: Horizontal Swipe Carousel | Desktop: 3-column Grid
                Eliminates the vertical wall of giant cards on mobile! */}
            <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 overflow-x-auto snap-x pb-2 sm:pb-0 custom-scrollbar">
              {filteredFeatured.map((quiz) => (
                <div
                  key={quiz.id}
                  className="w-[72vw] max-w-[260px] sm:w-full shrink-0 snap-start rounded-2xl bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#182C56]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_30px_rgba(2,6,23,0.8)] hover:border-blue-500/50 p-3.5 sm:p-4.5 flex flex-col justify-between space-y-3 transition-all duration-300 group"
                >
                  <div className="space-y-2 sm:space-y-3">
                    {/* Top Squircle Icon */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shadow-inner ${
                        quiz.colorScheme === 'blue'
                          ? 'bg-blue-600/25 border border-blue-400/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                          : quiz.colorScheme === 'emerald'
                          ? 'bg-emerald-600/25 border border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : 'bg-purple-600/25 border border-purple-400/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      }`}
                    >
                      {quiz.symbol}
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                        {quiz.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                        {quiz.subject} • {quiz.questionsCount} Qs
                      </p>
                    </div>

                    {/* Difficulty Pill */}
                    <div>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                          quiz.difficulty === 'Hard'
                            ? 'bg-[#3A0F1D] text-rose-300 border-[#851E3E]/40'
                            : quiz.difficulty === 'Easy'
                            ? 'bg-[#0E2A1E] text-emerald-300 border-[#1B6847]/40'
                            : 'bg-[#15234A] text-blue-300 border-[#25418E]/40'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Start Quiz → Button */}
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: ALL QUIZZES - COMPACT 2-COLUMN GRID ON MOBILE */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs sm:text-base font-bold text-white tracking-tight">
                  All Quizzes ({filteredAllQuizzes.length})
                </h3>
              </div>

              {/* Sort by dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#08122C] border border-[#16274D] rounded-xl text-[11px] sm:text-xs text-slate-300 px-2.5 py-1 sm:py-1.5 pr-6 sm:pr-7 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  <option value="Newest">Newest</option>
                  <option value="Popular">Popular</option>
                  <option value="Difficulty">Difficulty</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2-Column Compact Grid on Mobile (sm:grid-cols-2 lg:grid-cols-3)
                Makes 6 cards fit in only 3 short rows without endless scrolling! */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {filteredAllQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 transition-all duration-300 flex flex-col justify-between space-y-2 sm:space-y-3 shadow-lg group bg-gradient-to-br from-[#0B1735] via-[#091126] to-[#060B18] ${quiz.colorScheme === 'blue' ? 'border-blue-500/20 hover:border-blue-400/60' : quiz.colorScheme === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-400/60' : 'border-purple-500/20 hover:border-purple-400/60'}`}
                >
                  <div className={`absolute -top-10 -right-8 w-24 h-24 rounded-full blur-2xl opacity-25 pointer-events-none ${quiz.colorScheme === 'blue' ? 'bg-blue-500' : quiz.colorScheme === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                  <div className="relative z-10 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      {/* Squircle Icon */}
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                          quiz.colorScheme === 'blue'
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                            : quiz.colorScheme === 'emerald'
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-400/30'
                            : 'bg-purple-600/20 text-purple-400 border border-purple-400/30'
                        }`}
                      >
                        {quiz.symbol}
                      </div>

                      {/* Difficulty Pill */}
                      <span
                        className={`text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.2 rounded-full border ${
                          quiz.difficulty === 'Hard'
                            ? 'bg-[#3A0F1D] text-rose-300 border-[#851E3E]/40'
                            : quiz.difficulty === 'Easy'
                            ? 'bg-[#0E2A1E] text-emerald-300 border-[#1B6847]/40'
                            : 'bg-[#15234A] text-blue-300 border-[#25418E]/40'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Title & Meta */}
                    <div className="min-w-0">
                      <h4 className="text-[11px] sm:text-[13px] font-bold text-white group-hover:text-blue-200 transition-colors truncate leading-tight">
                        {quiz.title}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
                        {quiz.subject} • {quiz.questionsCount} Qs
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-slate-400">
                      <span>{quiz.questionsCount} questions</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> ~8 min</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${quiz.colorScheme === 'blue' ? 'bg-blue-400' : quiz.colorScheme === 'emerald' ? 'bg-emerald-400' : 'bg-purple-400'}`} style={{width: `${Math.min(85, 20 + quiz.title.length * 2)}%`}} />
                    </div>
                  </div>

                  {/* Start → Button */}
                  <div className="relative z-10 pt-1">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-1 sm:py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT AREA: SIDEBAR WIDGETS (lg:col-span-4)
            On mobile: Shown when 'Progress & Stats' tab is active, or at bottom
            ======================================================== */}
        <div
          className={`lg:col-span-4 space-y-3.5 sm:space-y-4 ${
            mobileTab === 'quizzes' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* WIDGET 1: YOUR PRACTICE PROGRESS */}
          <div className="rounded-[20px] sm:rounded-[22px] bg-[#081026] border border-[#162544] p-3.5 sm:p-5 shadow-lg space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#142240]">
              <div className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Your Practice Progress
              </h4>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-400/20 px-2 py-1 text-[9px] font-bold text-orange-300">🔥 {streakCount} day streak</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-0.5">
              {/* Circular Donut Ring: 0% Overall Score */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#101D38]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                    strokeDasharray={`${averageScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute text-center">
                  <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    {averageScore}%
                  </span>
                  <p className="text-[8px] sm:text-[9px] text-slate-400">Score</p>
                </div>
              </div>

              {/* Legend matching image.png */}
              <div className="space-y-1.5 text-[11px] sm:text-xs flex-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                    <span>Completed</span>
                  </span>
                  <span className="font-bold text-white">{completedCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.7)]" />
                    <span>In Progress</span>
                  </span>
                  <span className="font-bold text-white">{Math.max(0, filteredAllQuizzes.length - completedCount)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
                    <span>Not Started</span>
                  </span>
                  <span className="font-bold text-white">{Math.max(0, filteredAllQuizzes.length - Math.min(filteredAllQuizzes.length, completedCount) - 1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBJECT ACCURACY */}
          <div className="rounded-[20px] sm:rounded-[22px] bg-[#081026] border border-[#162544] p-3.5 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">Subject Accuracy</h4>
            </div>
            {subjectStats.map((item) => (
              <div key={item.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] sm:text-xs"><span className="text-slate-300">{item.subject}</span><span className="font-bold text-white">{item.score}%</span></div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{width:`${item.score}%`}} /></div>
              </div>
            ))}
          </div>

          {/* WIDGET 2: RECENT ACTIVITY MATCHING image.png */}
          <div className="rounded-[20px] sm:rounded-[22px] bg-[#081026] border border-[#162544] p-3.5 sm:p-5 shadow-lg space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#142240]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Recent Activity
                </h4>
              </div>

              <button
                onClick={() => showToast('Showing all recent activity', 'info')}
                className="text-[10px] sm:text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-0.5">
              {(quizHistory.length ? quizHistory.slice(0, 4).map((h) => ({id:h.id,title:h.title,status:'Completed' as const,timeAgo:h.date,symbol:'✓',colorScheme:'blue' as const})) : RECENT_ACTIVITIES).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#060D1E] border border-[#162544] hover:border-blue-500/40 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      act.colorScheme === 'blue'
                        ? 'bg-blue-600/25 text-blue-300 border border-blue-400/30'
                        : act.colorScheme === 'emerald'
                        ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-400/30'
                        : 'bg-purple-600/25 text-purple-300 border border-purple-400/30'
                    }`}
                  >
                    {act.symbol}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="text-[11px] sm:text-xs font-bold text-white truncate">
                      {act.title}
                    </h5>
                    <p className="text-[9px] text-slate-400">
                      {act.status} • {act.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 3: "PRACTICE TODAY, SCORE TOMORROW!" MATCHING image.png */}
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[22px] bg-gradient-to-r from-[#08122C] to-[#0A1028] border border-[#162544] p-4 sm:p-5 shadow-xl min-h-[140px] sm:min-h-[170px] flex flex-col justify-between group">
            {/* 3D Rocket Space Artwork */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/quiz_rocket_launch.jpg"
                alt="3D Glowing rocket launching over dark mountains"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover object-center opacity-70 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08122C] via-[#08122C]/72 to-[#08122C]/22 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08122C]/65 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-[200px] space-y-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-semibold">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Daily Practice</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
                Practice Today, <br />
                Score Tomorrow!
              </h4>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                Every quiz brings you closer to your goals.
              </p>
            </div>

            <div className="relative z-10 pt-2.5">
              <button
                onClick={() => handleStartQuiz(FEATURED_QUIZZES[0])}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.5)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Start Practicing</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          timeLimitSeconds={timedExam ? 600 : undefined}
          onComplete={(scorePercent) => {
            const entry = { id: `${activeQuiz.id}-${Date.now()}`, title: activeQuiz.title, subject: activeQuiz.subject, score: scorePercent, date: new Date().toLocaleDateString() };
            setQuizHistory((prev) => { const next = [entry, ...prev].slice(0, 20); try { localStorage.setItem('study_quiz_history_v1', JSON.stringify(next)); } catch {} return next; });
            showToast(`Quiz completed with ${scorePercent}% score! 🏆`, 'success');
          }}
          onRetryWrong={(wrongQuiz) => { setActiveQuiz(wrongQuiz); showToast('Retrying your wrong answers.', 'info'); }}
        />
      )}

      {/* AI Generate Quiz from Lesson Modal */}
      <GenerateQuizModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onQuizGenerated={handleQuizGenerated}
      />
    </div>
  );
};
