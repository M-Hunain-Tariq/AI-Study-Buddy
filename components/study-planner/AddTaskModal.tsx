'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Edit2, AlertCircle, Flag } from 'lucide-react';
import { StudyTask } from '@/types/study-planner';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<StudyTask, 'id' | 'completed'>) => void;
  taskToEdit?: StudyTask | null;
  onUpdateTask?: (task: StudyTask) => void;
  defaultDate?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  taskToEdit,
  onUpdateTask,
  defaultDate = '2025-08-26',
}) => {
  const [subject, setSubject] = useState(taskToEdit?.subject || 'Mathematics');
  const [topic, setTopic] = useState(taskToEdit?.topic || '');
  const [durationMinutes, setDurationMinutes] = useState(taskToEdit?.durationMinutes || 45);
  const [time, setTime] = useState(taskToEdit?.time || '10:00 AM');
  const [date, setDate] = useState(taskToEdit?.date || defaultDate);
  const [priority, setPriority] = useState<StudyTask['priority']>(taskToEdit?.priority || 'High');
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
    if (!topic.trim()) {
      setErrorMessage('Please enter a topic or task name to study.');
      return;
    }

    const duration = Number(durationMinutes);
    if (!duration || duration <= 0) {
      setErrorMessage('Duration must be greater than 0 minutes.');
      return;
    }

    const getColorForSubject = (subj: string): StudyTask['color'] => {
      switch (subj.toLowerCase()) {
        case 'mathematics':
        case 'math':
        case 'maths':
          return 'teal';
        case 'physics':
          return 'purple';
        case 'english':
          return 'orange';
        case 'chemistry':
          return 'cyan';
        default:
          return 'blue';
      }
    };

    if (taskToEdit && onUpdateTask) {
      onUpdateTask({
        ...taskToEdit,
        subject,
        topic: topic.trim(),
        durationMinutes: duration,
        time,
        date,
        priority,
        color: getColorForSubject(subject),
      });
    } else {
      onAddTask({
        subject,
        topic: topic.trim(),
        durationMinutes: duration,
        time,
        date,
        priority,
        color: getColorForSubject(subject),
      });
    }

    setTopic('');
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
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              {taskToEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {taskToEdit ? 'Edit Study Task' : 'Add Study Task'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {taskToEdit ? 'Update your study details' : 'Plan your session for today'}
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
              Subject
            </label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Topic or Chapter <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. Algebra — Linear Equations"
              className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Duration</span>
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>Scheduled Time</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Date</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2025-08-26"
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Flag className="w-3 h-3 text-amber-400" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StudyTask['priority'])}
                className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
