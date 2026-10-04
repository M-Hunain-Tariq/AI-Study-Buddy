'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Flag, AlertCircle } from 'lucide-react';
import { StudyGoal } from '@/types/study-planner';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: Omit<StudyGoal, 'id' | 'completed'>) => void;
  defaultSubject?: string;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreateGoal,
  defaultSubject = 'Mathematics',
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [dueDate, setDueDate] = useState(() => new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()));
  const [priority, setPriority] = useState<StudyGoal['priority']>('High');
  const [targetSessions, setTargetSessions] = useState(4);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a goal title.');
      return;
    }
    const target = Number(targetSessions);
    if (!target || target < 1) {
      setErrorMessage('Target study sessions must be at least 1.');
      return;
    }

    onCreateGoal({
      title: title.trim(),
      subject,
      dueDate: dueDate.trim() || 'Next week',
      priority,
      targetSessions: target,
      completedSessions: 0,
    });

    setTitle('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#081028] border border-[#1E335C] p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#142345]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Create Study Goal
              </h3>
              <p className="text-[11px] text-slate-400">
                Set milestones to stay focused
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Friendly Error Banner */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Goal Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. Complete Trigonometry Practice Chapter 4"
              className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Flag className="w-3 h-3 text-amber-400" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StudyGoal['priority'])}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Target Due Date</span>
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Fri, 10 Oct 2026"
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3 text-purple-400" />
                <span>Target Sessions</span>
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={targetSessions}
                onChange={(e) => setTargetSessions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0F1B3D] hover:bg-[#152554] border border-[#1F335C] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
