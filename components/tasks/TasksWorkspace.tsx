'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Calendar,
  Check,
  Plus,
  Search,
  MoreVertical,
  X,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckSquare,
  AlertCircle,
  ChevronDown,
  Pencil,
  Copy,
  Trash2,
  Bookmark,
  Target,
  Flame,
  Award,
} from 'lucide-react';
import { StudyTask, TaskPriority, TaskStatus } from './types';
import { useToast } from '../Toast';

// 5 exact tasks matching image.png
const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-math-assign',
    title: 'Complete Mathematics Assignment',
    subject: 'Mathematics',
    priority: 'High',
    status: 'Completed',
    dueDate: 'Today, 10:00 AM',
    description: 'Quadratic equations and algebraic factorization problems.',
  },
  {
    id: 'task-physics-read',
    title: 'Read Chapter 3 - Physics',
    subject: 'Physics',
    priority: 'Medium',
    status: 'Pending',
    dueDate: 'Today, 2:00 PM',
    description: 'Forces, friction, and Newton’s laws of motion exercises.',
  },
  {
    id: 'task-english-essay',
    title: 'Finish English Essay',
    subject: 'English',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: 'Tomorrow, 11:00 AM',
    description: 'Literature analysis and critical commentary drafting.',
  },
  {
    id: 'task-chem-notes',
    title: 'Study Chemistry Notes',
    subject: 'Chemistry',
    priority: 'High',
    status: 'Pending',
    dueDate: 'Tomorrow, 3:00 PM',
    description: 'Periodic table atomic trends and covalent bonding review.',
  },
  {
    id: 'task-cs-quiz',
    title: 'Prepare for Quiz',
    subject: 'Computer Science',
    priority: 'Medium',
    status: 'Pending',
    dueDate: 'May 30, 2025',
    description: 'Data structures, algorithm complexity, and binary search.',
  },
];

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Computer Science',
  'General',
];

export const TasksWorkspace: React.FC = () => {
  const { showToast } = useToast();

  // Tasks persistence
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('study_tasks_v4');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_TASKS;
  });

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Mathematics');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [formErrors, setFormErrors] = useState<{ title?: string; subject?: string }>({});
  const [mobileActiveTab, setMobileActiveTab] = useState<'tasks' | 'editor' | 'analytics'>('tasks');

  const menuRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
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

  // Save tasks to localStorage
  const saveTasksList = (updated: StudyTask[]) => {
    setTasks(updated);
    try {
      localStorage.setItem('study_tasks_v4', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Toggle Task Completion
  const handleToggleTask = (task: StudyTask) => {
    const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    saveTasksList(updated);
    showToast(
      newStatus === 'Completed'
        ? `Task "${task.title}" completed! 🎉`
        : `Task "${task.title}" set to pending`,
      newStatus === 'Completed' ? 'success' : 'info'
    );
  };

  // Set Task Status directly
  const handleSetStatus = (taskId: string, status: TaskStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    saveTasksList(updated);
    showToast(`Status updated to ${status}`, 'info');
    setActiveMenuId(null);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasksList(updated);
    if (editingTaskId === taskId) {
      handleResetForm();
    }
    showToast('Task removed', 'info');
    setActiveMenuId(null);
  };

  // Edit Task
  const handleStartEdit = (task: StudyTask) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskSubject(task.subject);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate);
    setTaskDesc(task.description || '');
    setFormErrors({});
    setActiveMenuId(null);
    setMobileActiveTab('editor');

    if (window.innerWidth < 1024 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Editing "${task.title}"`, 'info');
  };

  // Reset Form
  const handleResetForm = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskSubject('Mathematics');
    setTaskPriority('Medium');
    setTaskDueDate('');
    setTaskDesc('');
    setFormErrors({});
  };

  // Form Submit (Create or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const errs: { title?: string; subject?: string } = {};
    if (!taskTitle.trim()) {
      errs.title = 'Please enter a task title.';
    }
    if (!taskSubject.trim()) {
      errs.subject = 'Please select a subject.';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      showToast('Please fill in required fields', 'info');
      return;
    }

    const formattedDate = taskDueDate.trim() || 'Today, 5:00 PM';

    if (editingTaskId) {
      // Update
      const updated = tasks.map((t) => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            title: taskTitle.trim(),
            subject: taskSubject,
            priority: taskPriority,
            dueDate: formattedDate,
            description: taskDesc.trim(),
          };
        }
        return t;
      });
      saveTasksList(updated);
      showToast('Task updated successfully!', 'success');
    } else {
      // Create
      const newTask: StudyTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        subject: taskSubject,
        priority: taskPriority,
        status: 'Pending',
        dueDate: formattedDate,
        description: taskDesc.trim(),
      };
      saveTasksList([newTask, ...tasks]);
      showToast('New task added!', 'success');
    }

    handleResetForm();
    setMobileActiveTab('tasks');
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.dueDate.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tasks, statusFilter, searchQuery]);

  // Metrics
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High').length;
  const mediumPriorityCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'Low').length;

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-5 overflow-x-hidden">
      {/* ========================================================
          1. ULTRA-PREMIUM HERO BANNER
          ======================================================== */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#060D24] via-[#09153A] to-[#0D1533] border border-[#1E3466]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_50px_rgba(2,6,23,0.9),0_0_40px_rgba(37,99,235,0.15)] p-5 sm:p-6 lg:p-7 min-h-[165px] sm:min-h-[180px] flex flex-col justify-center group backdrop-blur-xl">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none" />

        {/* 3D Glowing Cyber Desk Artwork with Seamless Depth Blend */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/tasks_hero_neon_desk.jpg"
            alt="3D Glowing neon digital clipboard on futuristic desk"
            fill
            unoptimized
            priority
            sizes="(max-width: 1536px) 100vw, 1500px"
            className="object-cover object-right sm:object-[82%_center] opacity-75 transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[50%] bg-gradient-to-r from-[#060D24] via-[#060D24]/95 via-50% to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          {/* Badge: Squircle Cap Icon + Tasks Pill */}
          <div className="inline-flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="px-3.5 py-1 rounded-full bg-[#18113E]/90 border border-[#7C3AED]/50 text-indigo-200 text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.25)] backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Tasks</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight text-white leading-tight">
            Plan Today,{' '}
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(129,140,248,0.6)]">
              Achieve Tomorrow
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-[13px] font-normal mt-1.5 leading-relaxed">
            Stay organized, track your tasks and make progress every day.
          </p>
        </div>
      </div>

      {/* ========================================================
          2. ULTRA-PREMIUM FILTER & SEARCH BAR
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-b from-[#08122C]/90 to-[#060D20]/95 border border-[#1A2E5A]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_30px_rgba(2,6,23,0.7)] p-2.5 sm:p-3 rounded-[20px] backdrop-blur-xl">
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {/* All Tasks (5) */}
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] border border-blue-400/40'
                : 'bg-[#060D20]/80 border border-[#16274D] text-slate-300 hover:text-white hover:bg-[#0B1530]'
            }`}
          >
            <span>All Tasks ({tasks.length})</span>
          </button>

          {/* Pending (3) */}
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] border border-blue-400/40'
                : 'bg-[#060D20]/80 border border-[#16274D] text-slate-300 hover:text-white hover:bg-[#0B1530]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            <span>Pending ({pendingCount})</span>
          </button>

          {/* In Progress (1) */}
          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'In Progress'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] border border-blue-400/40'
                : 'bg-[#060D20]/80 border border-[#16274D] text-slate-300 hover:text-white hover:bg-[#0B1530]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span>In Progress ({inProgressCount})</span>
          </button>

          {/* Completed (1) */}
          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Completed'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] border border-blue-400/40'
                : 'bg-[#060D20]/80 border border-[#16274D] text-slate-300 hover:text-white hover:bg-[#0B1530]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

        {/* Right: Search & + Add Task CTA */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#050A1A] border border-[#182C56] focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:outline-none text-xs text-white placeholder-slate-400 transition-all shadow-inner"
            />
          </div>

          <button
            onClick={() => {
              handleResetForm();
              setMobileActiveTab('editor');
              if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner">
        <button
          onClick={() => setMobileActiveTab('tasks')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'tasks'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Tasks ({tasks.length})</span>
        </button>
        <button
          onClick={() => setMobileActiveTab('editor')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'editor'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>{editingTaskId ? 'Edit' : 'Add Task'}</span>
        </button>
        <button
          onClick={() => setMobileActiveTab('analytics')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'analytics'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Stats</span>
        </button>
      </div>

      {/* ========================================================
          3. BALANCED 3-COLUMN ULTRA-PREMIUM GRID
          Equal Widths (1fr : 1fr : 1fr) with identical heights & luxury glass sheen
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* ========================================================
            CARD 1: "TASKS DIRECTORY" (LUXURY GLASS CONTAINER)
            ======================================================== */}
        <div className={`rounded-[24px] bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#1C3364]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_rgba(2,6,23,0.85)] hover:border-blue-500/40 p-5 sm:p-5.5 flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
          mobileActiveTab === 'tasks' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#142345]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shadow-inner">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Tasks Directory
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} in view
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0D1D3D] text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                {completedCount}/{tasks.length} Done
              </span>
            </div>

            {/* Task Rows */}
            <div className="mt-3.5 space-y-2.5" ref={menuRef}>
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <CheckSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs">No tasks found matching your filter.</p>
                  <button
                    onClick={() => {
                      setStatusFilter('All');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-xs text-blue-400 font-semibold cursor-pointer"
                  >
                    Reset filter
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';

                  return (
                    <div
                      key={task.id}
                      className={`group relative rounded-xl p-3 border transition-all duration-200 text-left min-h-[66px] flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'border-[#182C56] bg-gradient-to-r from-[#070E24] to-[#091535]/70'
                          : 'border-[#15274E] bg-gradient-to-r from-[#070E24]/90 to-[#0A1638]/60 hover:border-blue-400/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.15)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Rounded Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task)}
                          className="shrink-0 cursor-pointer"
                          aria-label="Toggle task completion"
                        >
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white shadow-[0_0_12px_rgba(37,99,235,0.8)] border border-blue-300/40">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-lg border-2 border-slate-500 hover:border-blue-400 transition-colors shadow-inner" />
                          )}
                        </button>

                        {/* Title & Subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => handleStartEdit(task)}
                              className={`text-xs sm:text-[13px] font-bold tracking-tight cursor-pointer truncate ${
                                isCompleted
                                  ? 'line-through text-slate-400'
                                  : 'text-white group-hover:text-blue-200 transition-colors'
                              }`}
                            >
                              {task.title}
                            </h4>

                            {/* Priority Pill Capsule */}
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.2 rounded-full border shrink-0 ${
                                task.priority === 'High'
                                  ? 'bg-[#3B125C] text-purple-200 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                  : task.priority === 'Low'
                                  ? 'bg-[#0E2A1E] text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                  : 'bg-[#0F2B5C] text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{task.subject}</span>
                            <span>•</span>
                            <span>Due: {task.dueDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* 3-dots Menu Button */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === task.id ? null : task.id);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-[#12224A] transition-colors cursor-pointer"
                          aria-label="Task options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === task.id && (
                          <div className="absolute right-0 top-6 w-36 bg-[#0B1530] border border-[#1A2D54] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => handleStartEdit(task)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#12224A] hover:text-white transition-colors"
                            >
                              <Pencil className="w-3 h-3 text-blue-400" />
                              <span>Edit Task</span>
                            </button>
                            <button
                              onClick={() =>
                                handleSetStatus(
                                  task.id,
                                  task.status === 'In Progress' ? 'Pending' : 'In Progress'
                                )
                              }
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#12224A] hover:text-white transition-colors"
                            >
                              <Clock className="w-3 h-3 text-purple-400" />
                              <span>
                                {task.status === 'In Progress' ? 'Mark Pending' : 'In Progress'}
                              </span>
                            </button>
                            <div className="my-1 border-t border-[#142340]" />
                            <button
                              onClick={(e) => handleDeleteTask(task.id, e)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="pt-3.5 mt-3 border-t border-[#142345] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span>Study Planner Integration</span>
            </span>
            <span className="text-slate-300 font-semibold">{tasks.length} Total</span>
          </div>
        </div>

        {/* ========================================================
            CARD 2: "ADD NEW TASK" (EQUAL PROPORTION LUXURY FORM)
            ======================================================== */}
        <div
          ref={formRef}
          className={`rounded-[24px] bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#1C3364]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_rgba(2,6,23,0.85)] hover:border-blue-500/40 p-5 sm:p-5.5 flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
            mobileActiveTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-[#142345]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/25 to-purple-600/25 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {editingTaskId ? 'Edit Task' : 'Add New Task'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Stay organized and turn your goals into actions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors cursor-pointer"
              aria-label="Reset form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmitForm} className="space-y-3.5 my-auto py-2">
            {/* Task Title * */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {taskTitle.length}/100
                </span>
              </div>
              <input
                type="text"
                maxLength={100}
                value={taskTitle}
                onChange={(e) => {
                  setTaskTitle(e.target.value);
                  if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Enter task title..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#050A1A] border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all shadow-inner ${
                  formErrors.title ? 'border-rose-500' : 'border-[#172A52]'
                }`}
              />
              {formErrors.title && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{formErrors.title}</span>
                </p>
              )}
            </div>

            {/* Subject * and Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#050A1A] border border-[#172A52] text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-400 transition-colors shadow-inner"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub} className="bg-[#081026] text-white">
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => {
                    const isSelected = taskPriority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskPriority(p)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)] border border-blue-400/40'
                            : p === 'Low'
                            ? 'bg-[#050A1A] border border-[#172A52] text-emerald-400 hover:text-white'
                            : 'bg-[#050A1A] border border-[#172A52] text-rose-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  placeholder="Select date (e.g. Today, 5:00 PM)"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] focus:border-blue-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors shadow-inner"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Description (optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Description (optional)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {taskDesc.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Add more details about your task..."
                className="w-full p-3 rounded-xl bg-[#050A1A] border border-[#172A52] focus:border-blue-400 focus:outline-none text-xs text-white placeholder-slate-500 resize-none transition-colors shadow-inner"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>{editingTaskId ? 'Update Task' : 'Add Task'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================
            CARD 3: "ANALYTICS & MOTIVATION" (EQUAL PROPORTION LUXURY WIDGETS)
            ======================================================== */}
        <div className={`flex-col justify-between space-y-4 ${
          mobileActiveTab === 'analytics' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Card 3A: Task Progress with Glowing Donut Ring */}
          <div className="rounded-[24px] bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#1C3364]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_rgba(2,6,23,0.85)] hover:border-blue-500/40 p-5 space-y-3 transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#142240]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner">
                <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Task Progress
                </h4>
                <p className="text-[10px] text-slate-400">Live completion analytics</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              {/* Circular Donut Ring with Neon Glow */}
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#101D38]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                    strokeDasharray={`${(completedCount / Math.max(tasks.length, 1)) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                    strokeDasharray={`${(inProgressCount / Math.max(tasks.length, 1)) * 100}, 100`}
                    strokeDashoffset={`-${(completedCount / Math.max(tasks.length, 1)) * 100}`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute text-center">
                  <span className="text-base font-extrabold text-white tracking-tight drop-shadow-md">
                    {completedCount}/{tasks.length}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Completed</p>
                </div>
              </div>

              {/* Legend with Neon Indicators */}
              <div className="space-y-2 text-xs flex-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>Completed</span>
                  </span>
                  <span className="font-bold text-white">{completedCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    <span>Pending</span>
                  </span>
                  <span className="font-bold text-white">{pendingCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span>In Progress</span>
                  </span>
                  <span className="font-bold text-white">{inProgressCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3B: Priority Overview */}
          <div className="rounded-[24px] bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#1C3364]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_rgba(2,6,23,0.85)] hover:border-blue-500/40 p-4.5 space-y-2.5 transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#142240]">
              <div className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Bookmark className="w-3.5 h-3.5 fill-purple-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Priority Overview
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-center hover:border-rose-500/40 transition-colors shadow-inner">
                <span className="text-[10px] text-rose-300 font-semibold block">High</span>
                <span className="text-sm font-bold text-white">{highPriorityCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-center hover:border-blue-500/40 transition-colors shadow-inner">
                <span className="text-[10px] text-blue-300 font-semibold block">Medium</span>
                <span className="text-sm font-bold text-white">{mediumPriorityCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-center hover:border-emerald-500/40 transition-colors shadow-inner">
                <span className="text-[10px] text-emerald-300 font-semibold block">Low</span>
                <span className="text-sm font-bold text-white">{lowPriorityCount}</span>
              </div>
            </div>
          </div>

          {/* Card 3C: Stay Consistent! with Mountain Flag Artwork */}
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#08132F]/95 via-[#060D22]/98 to-[#040816] border border-[#1C3364]/70 hover:border-purple-500/40 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_rgba(2,6,23,0.85)] min-h-[135px] flex items-center justify-between group transition-all duration-300 backdrop-blur-xl">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/stay_consistent_flag.jpg"
                alt="3D Glowing neon purple mountain peak with illuminated flag"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-right opacity-70 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060D22] via-[#060D22]/85 to-transparent" />
            </div>

            <div className="relative z-10 max-w-[210px]">
              <div className="flex items-center gap-1.5 mb-1 text-amber-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Daily Motivation</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Stay Consistent!</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed italic">
                “Small steps every day lead to big results.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
