'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Brain, Check, Calendar, ArrowRight, Loader2, Bot } from 'lucide-react';
import { StudyTask } from '@/types/study-planner';

interface AiPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlanToSchedule: (tasks: StudyTask[]) => void;
  initialSubject?: string;
}

interface GeneratedDay {
  dayNum: number;
  title: string;
  durationMinutes: number;
  focus: string;
}

export const AiPlanGeneratorModal: React.FC<AiPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddPlanToSchedule,
  initialSubject = 'Mathematics',
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState('Algebra & Quadratic Equations');
  const [examDate, setExamDate] = useState('2025-09-02');
  const [dailyTime, setDailyTime] = useState('60');
  const [totalDays, setTotalDays] = useState('7');

  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');
  const [loadingText, setLoadingText] = useState('Analyzing study topics...');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedDay[]>([]);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timersRef.current.forEach(clearTimeout);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const [errorText, setErrorText] = useState('');

  const handleGenerate = async () => {
    setErrorText('');
    setStep('generating');
    setLoadingText('AI Study Buddy is analyzing your syllabus...');
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    timersRef.current.push(setTimeout(() => setLoadingText('Balancing daily workload & spacing intervals...'), 1500));
    timersRef.current.push(setTimeout(() => setLoadingText('Generating structured day-by-day study roadmap...'), 3500));

    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          examDate,
          dailyMinutes: parseInt(dailyTime) || 60,
          totalDays: parseInt(totalDays) || 7,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'The AI could not build a plan.');
      timersRef.current.forEach(clearTimeout);
      setGeneratedPlan(data.plan as GeneratedDay[]);
      setStep('preview');
    } catch (err) {
      timersRef.current.forEach(clearTimeout);
      setErrorText(err instanceof Error ? err.message : 'The AI could not build a plan.');
      setStep('input');
    }
  };

  const handleApplyPlan = () => {
    const tasksToAdd: StudyTask[] = generatedPlan.map((p, index) => {
      const colors: StudyTask['color'][] = ['teal', 'purple', 'cyan', 'orange', 'blue'];
      return {
        id: `ai-plan-${Date.now()}-${p.dayNum}`,
        subject,
        topic: p.title,
        durationMinutes: p.durationMinutes,
        completed: false,
        time: index === 0 ? '10:00 AM' : '04:00 PM',
        date: `Day ${p.dayNum}`,
        color: colors[index % colors.length],
      };
    });

    onAddPlanToSchedule(tasksToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#081028] border border-[#1E335C] p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#142345]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Create My Study Plan with AI</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                AI Study Buddy customizes a balanced study roadmap for you
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

        {/* Content Body based on Step */}
        <div className="flex-1 overflow-y-auto py-4">
          {step === 'input' && (
            <div className="space-y-4">
              {errorText && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {errorText}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. What subject are you studying?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Mathematics', 'Physics', 'Chemistry', 'English'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        subject === sub
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                          : 'bg-[#0C1736] border-[#1C2F57] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. What specific topic or chapter?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Linear Equations, Motion & Forces..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>3. When is your exam?</span>
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    4. How much time can you study each day?
                  </label>
                  <select
                    value={dailyTime}
                    onChange={(e) => setDailyTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    5. How many days do you have?
                  </label>
                  <select
                    value={totalDays}
                    onChange={(e) => setTotalDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0C1736] border border-[#1F3563] text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(79,70,229,0.7)] animate-pulse">
                  <Brain className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  AI Study Buddy is creating your plan...
                </h4>
                <p className="text-xs text-indigo-300 font-medium animate-pulse">
                  {loadingText}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Your {generatedPlan.length}-Day {subject} Plan
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Topic: {topic} • {dailyTime} min/day
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Ready to add</span>
                </div>
              </div>

              {/* Day by Day Plan List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {generatedPlan.map((d) => (
                  <div
                    key={d.dayNum}
                    className="p-2.5 rounded-xl bg-[#0C1635] border border-[#172A52] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0 border border-blue-500/30">
                        D{d.dayNum}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">
                          {d.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {d.focus}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40 shrink-0">
                      {d.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-3 border-t border-[#142345] flex items-center justify-end gap-2.5">
          {step === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-[0_0_18px_rgba(59,130,246,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate My Plan</span>
              </button>
            </>
          )}

          {step === 'generating' && (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 flex items-center gap-2"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </button>
          )}

          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleApplyPlan}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-[0_0_18px_rgba(20,184,166,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Add to My Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
