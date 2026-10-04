'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Pin,
  BookOpen,
  Calendar,
  Plus,
  Layers,
  Settings as SettingsIcon,
  Clock,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Lock,
  Tag,
  Zap,
  Bot,
  Brain,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StudyNote, NotePriority } from './types';
import { CreateNoteModal } from './CreateNoteModal';
import { useToast } from '../Toast';

// Initial notes matching image.png exactly
const DEFAULT_NOTES: StudyNote[] = [
  {
    id: 'note-math-algebra',
    title: 'Algebra Formulas & Quadratic Equations',
    subject: 'Mathematics',
    color: 'purple',
    content:
      'Quadratic equations, discriminant analysis (Δ = b² - 4ac), difference of squares and vertex form applications with numerical step-by-step examples.',
    excerpt:
      'Quadratic equations, discriminant analysis (Δ = b² - 4ac), difference of squares and vertex form applications...',
    lastEdited: '2 hours ago',
    lastEditedTimestamp: Date.now() - 2 * 60 * 60 * 1000,
    priority: 'High',
    tags: ['algebra', 'formulas', 'exam'],
    isPrivate: false,
    isPinned: true,
    addToPlanner: true,
  },
  {
    id: 'note-physics-motion',
    title: 'Newton’s Laws of Motion & Momentum',
    subject: 'Physics',
    color: 'blue',
    content:
      'Newton’s three laws, F = ma derivations, momentum conservation and impulse calculations with numerical solutions and vector diagrams.',
    excerpt:
      'Newton’s three laws, F = ma derivations, momentum conservation and impulse calculations with numerical solutions...',
    lastEdited: 'Yesterday',
    lastEditedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    priority: 'High',
    tags: ['physics', 'mechanics', 'laws'],
    isPrivate: false,
    isPinned: true,
    addToPlanner: true,
  },
  {
    id: 'note-chem-periodic',
    title: 'Periodic Table Trends & Chemical Bonding',
    subject: 'Chemistry',
    color: 'emerald',
    content:
      'Atomic radius, electronegativity, ionization energy trends across periods and chemical bond formation with orbital configurations.',
    excerpt:
      'Atomic radius, electronegativity, ionization energy trends across periods and chemical bond formation...',
    lastEdited: '3 days ago',
    lastEditedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    priority: 'Medium',
    tags: ['chemistry', 'periodic-table', 'bonding'],
    isPrivate: false,
    isPinned: true,
    addToPlanner: true,
  },
];

interface MyNotesWorkspaceProps {
  initialOpenCreate?: boolean;
}

export const MyNotesWorkspace: React.FC<MyNotesWorkspaceProps> = ({
  initialOpenCreate = false,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  // Notes persistence
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('study_notes_v5');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_NOTES;
  });

  // Filter & UI State
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);
  const [mobileNotesTab, setMobileNotesTab] = useState<'notes' | 'pinned'>('notes');
  const [plannerTasks, setPlannerTasks] = useState([
    {
      id: 'pt-1',
      title: 'Algebra Formulas & Quadratic Equations',
      subject: 'Mathematics',
      time: '2 hours',
      completed: true,
    },
    {
      id: 'pt-2',
      title: 'Newton’s Laws of Motion',
      subject: 'Physics',
      time: '1.5 hours',
      completed: false,
    },
    {
      id: 'pt-3',
      title: 'Periodic Table Trends',
      subject: 'Chemistry',
      time: '1 hour',
      completed: false,
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [modalNote, setModalNote] = useState<StudyNote | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync initialOpenCreate
  const [prevInitialOpen, setPrevInitialOpen] = useState(initialOpenCreate);
  if (initialOpenCreate !== prevInitialOpen) {
    setPrevInitialOpen(initialOpenCreate);
    if (initialOpenCreate) {
      setIsModalOpen(true);
      setModalNote(null);
    }
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  // Save notes to localStorage
  const saveNotesList = (updated: StudyNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem('study_notes_v5', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Open modal to create a new note
  const handleOpenCreateModal = () => {
    setModalNote(null);
    setIsModalOpen(true);
  };

  // Open modal to edit note
  const handleOpenEditModal = (note: StudyNote) => {
    setModalNote(note);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // Toggle Pin
  const handleTogglePin = (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
    );
    saveNotesList(updated);
    const target = updated.find((n) => n.id === noteId);
    showToast(target?.isPinned ? 'Note pinned to top 📌' : 'Note unpinned', 'info');
    setActiveMenuId(null);
  };

  // Delete Note
  const handleDeleteNote = (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notes.filter((n) => n.id !== noteId);
    saveNotesList(updated);
    showToast('Note deleted successfully', 'info');
    setActiveMenuId(null);
  };

  // Copy Note
  const handleCopyNote = (note: StudyNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      showToast('Note copied to clipboard! 📋', 'success');
    }
    setActiveMenuId(null);
  };

  // Toggle Planner Task
  const handleTogglePlannerTask = (id: string) => {
    setPlannerTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Modal save handler
  const handleSaveNoteFromModal = (noteData: {
    id?: string;
    title: string;
    subject: string;
    priority: NotePriority;
    tags: string[];
    content: string;
    isPrivate: boolean;
    isPinned: boolean;
    addToPlanner: boolean;
  }) => {
    const excerptText = noteData.content.trim()
      ? noteData.content.slice(0, 95) + (noteData.content.length > 95 ? '...' : '')
      : 'Your note content will appear here...';

    const getSubjectColor = (subj: string): StudyNote['color'] => {
      switch (subj.toLowerCase()) {
        case 'mathematics':
          return 'purple';
        case 'physics':
          return 'blue';
        case 'chemistry':
          return 'emerald';
        default:
          return 'pink';
      }
    };

    if (noteData.id) {
      // Update
      const updated = notes.map((n) => {
        if (n.id === noteData.id) {
          return {
            ...n,
            title: noteData.title,
            subject: noteData.subject,
            color: getSubjectColor(noteData.subject),
            content: noteData.content,
            excerpt: excerptText,
            priority: noteData.priority,
            tags: noteData.tags,
            isPrivate: noteData.isPrivate,
            isPinned: noteData.isPinned,
            addToPlanner: noteData.addToPlanner,
            lastEdited: 'Just now',
            lastEditedTimestamp: Date.now(),
          };
        }
        return n;
      });
      saveNotesList(updated);
    } else {
      // Create
      const newNote: StudyNote = {
        id: `note-${Date.now()}`,
        title: noteData.title,
        subject: noteData.subject,
        color: getSubjectColor(noteData.subject),
        content: noteData.content,
        excerpt: excerptText,
        lastEdited: 'Just now',
        lastEditedTimestamp: Date.now(),
        priority: noteData.priority,
        tags: noteData.tags,
        isPrivate: noteData.isPrivate,
        isPinned: noteData.isPinned,
        addToPlanner: noteData.addToPlanner,
      };
      saveNotesList([newNote, ...notes]);
    }
  };

  // Filtered Notes for Recent Notes list
  const recentNotesList = useMemo(() => {
    if (!selectedSubjectFilter) return notes;
    return notes.filter(
      (n) => n.subject.toLowerCase() === selectedSubjectFilter.toLowerCase()
    );
  }, [notes, selectedSubjectFilter]);

  // Pinned Notes list
  const pinnedNotesList = useMemo(() => {
    return notes.filter((n) => n.isPinned);
  }, [notes]);

  // Counts for Subjects
  const mathCount = notes.filter((n) => n.subject.toLowerCase() === 'mathematics').length;
  const physicsCount = notes.filter((n) => n.subject.toLowerCase() === 'physics').length;
  const chemCount = notes.filter((n) => n.subject.toLowerCase() === 'chemistry').length;
  const englishCount = notes.filter((n) => n.subject.toLowerCase() === 'english').length;
  const csCount = notes.filter((n) => n.subject.toLowerCase() === 'computer science').length;

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-5 overflow-x-hidden">
      {/* 2-COLUMN MASTER LAYOUT (12-Col Responsive Grid: 8 Cols Left, 4 Cols Right on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* ========================================================
            LEFT COLUMN (8 COLS ON DESKTOP, FULL WIDTH ON MOBILE/TABLET)
            Contains:
            1. Hero Banner
            2. My Subjects (5 Cards with Responsive Grid)
            3. 2-Col Split: Recent Notes (Left) + Study Planner & Progress (Right)
            ======================================================== */}
        <div className="lg:col-span-8 flex flex-col space-y-4 sm:space-y-5 min-w-0">
          {/* 1. RESPONSIVE HERO BANNER */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070E24] via-[#091536] to-[#0A122E] border border-[#1A2D54] shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_35px_rgba(37,99,235,0.12)] p-4 sm:p-6 lg:p-7 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between group">
            {/* Background sunset mountain artwork with student silhouette */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/notes_mountain_sunset.jpg"
                alt="Epic sunset mountain landscape with student gazing at cosmic sun"
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-right sm:object-[80%_center] opacity-65 transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-y-0 left-0 w-full sm:w-[70%] lg:w-[55%] bg-gradient-to-r from-[#070E24] via-[#070E24]/95 via-45% to-transparent pointer-events-none" />
            </div>

            {/* Top row with badge & handwritten cursive text */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              {/* AI Knowledge Studio Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#111F42]/90 border border-blue-500/30 text-blue-300 text-[11px] sm:text-xs font-semibold shadow-inner shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Knowledge Studio</span>
              </div>

              {/* Handwritten cursive text */}
              <div className="hidden sm:block text-right pr-1">
                <p className="font-serif italic text-white/90 text-xs sm:text-sm tracking-wide drop-shadow-md">
                  Better Notes
                </p>
                <p className="font-serif italic text-white/90 text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center justify-end gap-1">
                  <span>Bigger Dreams</span>
                  <span className="text-white text-xs">↗</span>
                </p>
              </div>
            </div>

            {/* Middle Title & Subtitle */}
            <div className="relative z-10 mt-2.5 sm:mt-2 max-w-xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Your Notes,{' '}
                <span className="bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,140,248,0.5)]">
                  Your Knowledge
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-normal mt-1 leading-relaxed">
                Create, structure, and revise your study notes with AI outlines and organized subject hubs.
              </p>
            </div>

            {/* Bottom Row: Stats Pills + Create Note Button */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-4 pt-2 border-t border-[#142345]/60 sm:border-t-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#0A1430]/90 border border-[#1C325E] text-slate-200">
                  <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{notes.length} Notes</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#0A1430]/90 border border-[#1C325E] text-slate-200">
                  <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{pinnedNotesList.length} Pinned</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#0A1430]/90 border border-[#1C325E] text-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>3 Subjects</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#0A1430]/90 border border-[#1C325E] text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>2 in Planner</span>
                </div>
              </div>

              {/* + Create New Note CTA (Full width on small mobile, compact on tablet/desktop) */}
              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Plus className="w-4 h-4 text-white shrink-0" />
                <span>Create New Note</span>
              </button>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner">
            <button
              onClick={() => setMobileNotesTab('notes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileNotesTab === 'notes'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📝 Notes & Subjects</span>
            </button>
            <button
              onClick={() => setMobileNotesTab('pinned')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileNotesTab === 'pinned'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📌 Pinned & Planner</span>
            </button>
          </div>

          {/* 2. RESPONSIVE "MY SUBJECTS" SECTION */}
          <div className={`space-y-3 ${mobileNotesTab === 'pinned' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    My Subjects
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Explore your subjects and access your notes, formulas and practice materials.
                  </p>
                </div>
              </div>

              <button
                onClick={() => showToast('Subjects are managed through the notes subject filters below.', 'info')}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081026] hover:bg-[#0E1A38] border border-[#162544] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Manage Subjects</span>
              </button>
            </div>

            {/* 5 Subject Cards (Adaptive Grid: 2 cols on mobile with 5th spanning 2 cols, 3 cols on sm, 5 cols on lg) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {/* Mathematics Card */}
              <div
                onClick={() => {
                  setSelectedSubjectFilter(
                    selectedSubjectFilter === 'Mathematics' ? null : 'Mathematics'
                  );
                }}
                className={`group rounded-2xl bg-[#091533] border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-lg min-w-0 ${
                  selectedSubjectFilter === 'Mathematics'
                    ? 'border-blue-400 ring-1 ring-blue-400/50 bg-[#0C1E4A]'
                    : 'border-[#172D5C] hover:border-blue-500/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-serif text-sm font-bold shadow-md shrink-0">
                    π
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      Mathematics
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {mathCount} Notes • 2 Topics
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <span className="text-blue-400 text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>

              {/* Physics Card */}
              <div
                onClick={() => {
                  setSelectedSubjectFilter(
                    selectedSubjectFilter === 'Physics' ? null : 'Physics'
                  );
                }}
                className={`group rounded-2xl bg-[#140F30] border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-lg min-w-0 ${
                  selectedSubjectFilter === 'Physics'
                    ? 'border-purple-400 ring-1 ring-purple-400/50 bg-[#1D144A]'
                    : 'border-[#2E1F63] hover:border-purple-500/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                    ⚛
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      Physics
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {physicsCount} Notes • 2 Topics
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <span className="text-purple-400 text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>

              {/* Chemistry Card */}
              <div
                onClick={() => {
                  setSelectedSubjectFilter(
                    selectedSubjectFilter === 'Chemistry' ? null : 'Chemistry'
                  );
                }}
                className={`group rounded-2xl bg-[#08211E] border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-lg min-w-0 ${
                  selectedSubjectFilter === 'Chemistry'
                    ? 'border-emerald-400 ring-1 ring-emerald-400/50 bg-[#0A2D29]'
                    : 'border-[#13443D] hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                    🧪
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      Chemistry
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {chemCount} Note • 1 Topic
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <span className="text-emerald-400 text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>

              {/* English Card */}
              <div
                onClick={() => {
                  setSelectedSubjectFilter(
                    selectedSubjectFilter === 'English' ? null : 'English'
                  );
                }}
                className={`group rounded-2xl bg-[#21170A] border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-lg min-w-0 ${
                  selectedSubjectFilter === 'English'
                    ? 'border-amber-400 ring-1 ring-amber-400/50 bg-[#2D200C]'
                    : 'border-[#443013] hover:border-amber-500/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                    📖
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      English
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {englishCount} Note • 1 Topic
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <span className="text-amber-400 text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>

              {/* Computer Science Card (Span 2 cols on mobile to balance grid) */}
              <div
                onClick={() => {
                  setSelectedSubjectFilter(
                    selectedSubjectFilter === 'Computer Science' ? null : 'Computer Science'
                  );
                }}
                className={`group col-span-2 sm:col-span-1 rounded-2xl bg-[#230C19] border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-lg min-w-0 ${
                  selectedSubjectFilter === 'Computer Science'
                    ? 'border-pink-400 ring-1 ring-pink-400/50 bg-[#310F22]'
                    : 'border-[#471732] hover:border-pink-500/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#DB2777] text-white flex items-center justify-center font-mono font-bold text-xs shadow-md shrink-0">
                    &lt;/&gt;
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">
                      Computer Science
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {csCount} Notes • 0 Topics
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <span className="text-pink-400 text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MIDDLE 2-COLUMN SPLIT: [Recent Notes] + [Study Planner & Progress] */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            {/* 3A. RECENT NOTES (THE LONG CARDS WITH RESPONSIVE LAYOUT) */}
            <div className={`rounded-2xl bg-[#081026] border border-[#162544] p-4 sm:p-5 shadow-lg flex-col justify-between space-y-3.5 min-w-0 h-full min-h-[460px] ${
              mobileNotesTab === 'pinned' ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#142240]">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                      Recent Notes
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      Continue where you left off.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubjectFilter(null)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0"
                >
                  View All →
                </button>
              </div>

              {/* The Long Horizontal Cards */}
              <div className="space-y-2.5 sm:space-y-3" ref={menuRef}>
                {recentNotesList.map((note) => {
                  let iconBg = 'bg-[#1D4ED8]';
                  let iconSymbol = 'π';
                  let subjectPillClass = 'bg-[#2E1552] text-purple-300 border-[#6824B8]/40';

                  if (note.subject.toLowerCase() === 'physics') {
                    iconBg = 'bg-[#0284C7]';
                    iconSymbol = '⚛';
                    subjectPillClass = 'bg-[#0E2A52] text-blue-300 border-[#1B5CB8]/40';
                  } else if (note.subject.toLowerCase() === 'chemistry') {
                    iconBg = 'bg-[#059669]';
                    iconSymbol = '🧪';
                    subjectPillClass = 'bg-[#0A3029] text-emerald-300 border-[#126B5D]/40';
                  }

                  const wordCount = note.content.split(/\s+/).filter(Boolean).length;

                  return (
                    <div
                      key={note.id}
                      onClick={() => handleOpenEditModal(note)}
                      className="group relative rounded-xl bg-[#060D1E] hover:bg-[#0A1530] border border-[#162544] hover:border-blue-500/60 p-3 sm:p-3.5 transition-all duration-200 cursor-pointer text-left shadow-sm hover:shadow-md min-w-0"
                    >
                      {/* Responsive Flex: Stacks on ultra-small mobile, horizontal on sm+ */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                          {/* Subject Circular Icon */}
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${iconBg} text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shrink-0 mt-0.5`}
                          >
                            {iconSymbol}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-snug group-hover:text-blue-300 transition-colors line-clamp-1">
                              {note.title}
                            </h4>

                            {/* Badges row: Subject + Priority */}
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${subjectPillClass}`}
                              >
                                {note.subject}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                                  note.priority === 'High'
                                    ? 'bg-[#3A0F1D] text-rose-300 border-[#851E3E]/40'
                                    : 'bg-[#2E200C] text-amber-300 border-[#7A4E15]/40'
                                }`}
                              >
                                {note.priority || 'Medium'}
                              </span>
                            </div>

                            {/* Snippet */}
                            <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {note.excerpt || note.content}
                            </p>
                          </div>
                        </div>

                        {/* Right: Timestamp & 3-dots */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#142240] shrink-0 text-right">
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5 text-[10px] text-slate-400">
                            <span>{note.lastEdited}</span>
                            <span className="hidden sm:inline">·</span>
                            <span>{wordCount} words</span>
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === note.id ? null : note.id);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#142348] transition-colors"
                              aria-label="Note options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === note.id && (
                              <div className="absolute right-0 top-6 w-36 bg-[#0B1530] border border-[#1A2D54] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(note);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#12224A] hover:text-white transition-colors"
                                >
                                  <Pencil className="w-3 h-3 text-blue-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => handleCopyNote(note, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#12224A] hover:text-white transition-colors"
                                >
                                  <Copy className="w-3 h-3 text-cyan-400" />
                                  <span>Copy</span>
                                </button>
                                <button
                                  onClick={(e) => handleTogglePin(note.id, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#12224A] hover:text-white transition-colors"
                                >
                                  <Pin className="w-3 h-3 text-purple-400" />
                                  <span>{note.isPinned ? 'Unpin' : 'Pin'}</span>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteNote(note.id, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/20 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3B. STUDY PLANNER & OVERALL PROGRESS CARD */}
            <div className={`rounded-2xl bg-[#081026] border border-[#162544] p-4 sm:p-5 shadow-lg flex-col justify-between space-y-4 min-w-0 h-full min-h-[460px] ${
              mobileNotesTab === 'notes' ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* TOP PART: STUDY PLANNER */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#142240]">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        Study Planner
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        Stay on track with your goals.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/study-planner')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0"
                  >
                    View Calendar →
                  </button>
                </div>

                {/* Subheader: Today & Date pill */}
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="font-semibold text-slate-200">Today</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#111C3A] text-slate-400 border border-[#1B2C58] text-[11px]">
                    Sep 30, 2029
                  </span>
                </div>

                {/* 3 Checklist Items */}
                <div className="space-y-2 mt-1">
                  {plannerTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleTogglePlannerTask(t.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer min-w-0 ${
                        t.completed ? 'bg-[#060D1E]/60' : 'bg-[#060D1E] hover:bg-[#0B1530]'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-blue-400 shrink-0"
                        aria-label="Toggle task"
                      >
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-blue-500 text-slate-900" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium tracking-tight truncate ${
                            t.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {t.subject} • {t.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM PART: OVERALL PROGRESS */}
              <div className="pt-3 border-t border-[#142240]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      Overall Progress
                    </h4>
                    <p className="text-[10px] text-slate-400">Keep going! You’re doing great.</p>
                  </div>
                </div>

                {/* Donut Chart + Bars (Responsive Stack on narrow screens) */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Glowing Circular Donut Chart 0% */}
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#132247]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        strokeDasharray="68, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-white">0%</span>
                  </div>

                  {/* 4 Subject Progress Bars */}
                  <div className="w-full flex-1 space-y-1.5 min-w-0">
                    {/* Math */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-300 pb-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-[9px]">π</span> Mathematics
                        </span>
                        <span className="font-bold">85%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111C3A] overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)] w-[85%]" />
                      </div>
                    </div>

                    {/* Physics */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-300 pb-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-[9px]">⚛</span> Physics
                        </span>
                        <span className="font-bold">60%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111C3A] overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)] w-[60%]" />
                      </div>
                    </div>

                    {/* Chemistry */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-300 pb-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-[9px]">🧪</span> Chemistry
                        </span>
                        <span className="font-bold">45%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111C3A] overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] w-[45%]" />
                      </div>
                    </div>

                    {/* English */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-300 pb-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-[9px]">📖</span> English
                        </span>
                        <span className="font-bold">30%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111C3A] overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)] w-[30%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (4 COLS ON DESKTOP, FULL WIDTH ON MOBILE/TABLET)
            Contains:
            1. Quick Actions (2x2 grid)
            2. Pinned Notes (3 rows with purple pin)
            3. Motivational Quote Card
            ======================================================== */}
        <div className={`lg:col-span-4 flex-col space-y-4 sm:space-y-5 min-w-0 ${
          mobileNotesTab === 'notes' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* WIDGET 1: QUICK ACTIONS */}
          <div className="rounded-2xl bg-[#081026] border border-[#162544] p-4 sm:p-5 shadow-lg space-y-3 sm:space-y-3.5 min-w-0">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#142240]">
              <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-pink-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-tight truncate">Quick Actions</h3>
                <p className="text-[11px] text-slate-400 truncate">Jump into your study tools.</p>
              </div>
            </div>

            {/* 2x2 Grid of Actions */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* AI Tutor */}
              <button
                onClick={() => router.push('/ai-tutor')}
                className="group flex flex-col p-2.5 sm:p-3 rounded-xl bg-[#0E1A3D] hover:bg-[#132454] border border-[#1C3364] hover:border-blue-400/60 transition-all text-left cursor-pointer shadow-sm min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">AI Tutor</h4>
                <p className="text-[10px] text-slate-400 truncate">Ask anything</p>
              </button>

              {/* Take Quiz */}
              <button
                onClick={() => router.push('/quiz-practice')}
                className="group flex flex-col p-2.5 sm:p-3 rounded-xl bg-[#082420] hover:bg-[#0C332D] border border-[#134D44] hover:border-emerald-400/60 transition-all text-left cursor-pointer shadow-sm min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">Take Quiz</h4>
                <p className="text-[10px] text-slate-400 truncate">Test your knowledge</p>
              </button>

              {/* Practice */}
              <button
                onClick={() => router.push('/quiz-practice')}
                className="group flex flex-col p-2.5 sm:p-3 rounded-xl bg-[#26180E] hover:bg-[#382314] border border-[#4E2E18] hover:border-amber-400/60 transition-all text-left cursor-pointer shadow-sm min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">Practice</h4>
                <p className="text-[10px] text-slate-400 truncate">Solve problems</p>
              </button>

              {/* Add Note */}
              <button
                onClick={handleOpenCreateModal}
                className="group flex flex-col p-2.5 sm:p-3 rounded-xl bg-[#290E22] hover:bg-[#3D1433] border border-[#521944] hover:border-pink-400/60 transition-all text-left cursor-pointer shadow-sm min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-600/30 text-pink-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">Add Note</h4>
                <p className="text-[10px] text-slate-400 truncate">Capture your thoughts</p>
              </button>
            </div>
          </div>

          {/* WIDGET 2: PINNED NOTES */}
          <div className="rounded-2xl bg-[#081026] border border-[#162544] p-4 sm:p-5 shadow-lg space-y-3 sm:space-y-3.5 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#142240]">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Pin className="w-4 h-4 fill-purple-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">Pinned Notes</h3>
                  <p className="text-[11px] text-slate-400 truncate">Your important notes, always here.</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0">
                View All →
              </span>
            </div>

            {/* 3 Pinned Note Rows */}
            <div className="space-y-2 sm:space-y-2.5">
              {pinnedNotesList.slice(0, 3).map((note) => {
                let iconBg = 'bg-[#1D4ED8]';
                let iconSymbol = 'π';
                if (note.subject.toLowerCase() === 'physics') {
                  iconBg = 'bg-[#7C3AED]';
                  iconSymbol = '⚛';
                } else if (note.subject.toLowerCase() === 'chemistry') {
                  iconBg = 'bg-[#059669]';
                  iconSymbol = '🧪';
                }

                return (
                  <div
                    key={note.id}
                    onClick={() => handleOpenEditModal(note)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#060D1E] hover:bg-[#0B1530] border border-[#162544] hover:border-purple-500/50 transition-all cursor-pointer group min-w-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg ${iconBg} text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0`}
                      >
                        {iconSymbol}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-blue-200 transition-colors">
                          {note.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {note.subject}
                        </p>
                      </div>
                    </div>

                    <div className="p-1 text-purple-400 shrink-0">
                      <Pin className="w-3.5 h-3.5 fill-purple-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WIDGET 3: MOTIVATIONAL QUOTE CARD WITH SUNSET MOUNTAIN BACKGROUND */}
          <div className="relative overflow-hidden rounded-2xl bg-[#081026] border border-[#162544] p-4 sm:p-6 shadow-xl min-h-[140px] sm:min-h-[160px] flex flex-col justify-between group min-w-0">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/notes_mountain_sunset.jpg"
                alt="Sunset mountain peaks"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-center opacity-40 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081026] via-[#081026]/70 to-transparent" />
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-serif text-white/40 leading-none select-none">
                “
              </span>
              <p className="text-xs sm:text-sm font-medium text-white italic leading-relaxed mt-1">
                Discipline today builds the freedom you want tomorrow.
              </p>
              <span className="block text-right text-2xl sm:text-3xl font-serif text-white/40 leading-none select-none">
                ”
              </span>
            </div>

            <div className="relative z-10 text-right text-[10px] sm:text-[11px] font-semibold text-slate-300">
              — AI Study Buddy
            </div>
          </div>
        </div>
      </div>

      {/* 4. UPGRADED CENTERED "CREATE NEW NOTE" MODAL */}
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalNote(null);
        }}
        onSaveNote={handleSaveNoteFromModal}
        initialNote={modalNote}
      />
    </div>
  );
};
