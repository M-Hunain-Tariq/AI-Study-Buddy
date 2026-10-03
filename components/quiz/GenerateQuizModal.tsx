'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { QuizDifficulty, QuizItem, QuizSubject } from './types';
import { useToast } from '../Toast';

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizGenerated: (quiz: QuizItem) => void;
}

const SAMPLE_LESSONS = [
  {
    title: 'Photosynthesis & Cellular Respiration',
    subject: 'Biology',
    text: `Photosynthesis is the biological process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds like glucose. The process takes place in the chloroplasts, using chlorophyll pigments. The general equation is 6CO2 + 6H2O + light -> C6H12O6 + 6O2. Conversely, cellular respiration occurs in the mitochondria where glucose is broken down to release ATP energy.`,
  },
  {
    title: "Newton's Laws of Motion",
    subject: 'Physics',
    text: `Sir Isaac Newton formulated three fundamental laws of motion. First Law (Law of Inertia): An object at rest remains at rest, and an object in motion continues with constant velocity unless acted upon by an external net force. Second Law: The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass, expressed as F = m·a. Third Law: For every action, there is an equal and opposite reaction. Whenever one object exerts a force on a second object, the second exerts an equal force in the opposite direction on the first.`,
  },
];

export const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizGenerated,
}) => {
  const { showToast } = useToast();
  const [chapterTitle, setChapterTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [lessonContent, setLessonContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePasteSample = (sample: (typeof SAMPLE_LESSONS)[0]) => {
    setChapterTitle(sample.title);
    setSubject(sample.subject);
    setLessonContent(sample.text);
    setErrorMessage('');
    showToast(`Loaded sample lesson for "${sample.title}"`, 'info');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chapterTitle.trim()) {
      setErrorMessage('Please enter a chapter or topic name.');
      return;
    }
    if (!lessonContent.trim() || lessonContent.trim().length < 30) {
      setErrorMessage('Please paste at least 30 characters of lesson content.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setProcessingStep(1);

    // Simulated progress indicators for rich UX
    const timer1 = setTimeout(() => setProcessingStep(2), 700);
    const timer2 = setTimeout(() => setProcessingStep(3), 1500);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: chapterTitle.trim(),
          subject,
          difficulty,
          questionCount,
          lessonContent: lessonContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz.');
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      setProcessingStep(4);

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        onQuizGenerated(data.quiz);
        showToast(`Quiz generated successfully for "${chapterTitle}"! 🎯`, 'success');
      }, 500);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Error connecting to generator. Please try again.');
      showToast('Error generating quiz', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#08122C] border border-[#1A3160] shadow-[0_25px_60px_rgba(2,6,23,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#142345] flex items-start justify-between bg-[#060D22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/25 to-purple-600/25 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Generate Quiz from Lesson</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Powered
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Paste any chapter, notes, or article to create an instant customized quiz!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Processing State Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-[#060D22]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-purple-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base font-bold text-white">Generating Your Custom Quiz...</h4>
              <p className="text-xs text-slate-400">
                {processingStep === 1 && 'Reading and analyzing lesson text & core concepts...'}
                {processingStep === 2 && 'Extracting key formulas, definitions, and theories...'}
                {processingStep === 3 && 'Formulating multiple-choice questions & explanations...'}
                {processingStep === 4 && 'Quiz ready! Launching practice session...'}
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  processingStep >= 1 ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-700'
                }`}
              />
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  processingStep >= 2 ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-700'
                }`}
              />
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  processingStep >= 3 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-700'
                }`}
              />
            </div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleGenerate} className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Quick Sample Selector */}
          <div className="p-2.5 rounded-xl bg-[#060D20] border border-[#16274D] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Try with a quick sample:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SAMPLE_LESSONS.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => handlePasteSample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-[#0E1B38] hover:bg-[#152B58] text-[10px] font-semibold text-blue-300 border border-blue-500/30 transition-colors cursor-pointer"
                >
                  + {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter / Topic Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chapter / Topic Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. Thermodynamics & Heat Transfer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] focus:border-blue-400 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Subject & Difficulty & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#050A1A] border border-[#172A52] text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value={3}>3 Questions (Quick)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (Deep)</option>
              </select>
            </div>
          </div>

          {/* Paste Lesson Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Paste Complete Lesson / Chapter Text <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {lessonContent.length} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              placeholder="Paste any article, textbook chapter, teacher's lecture notes, or study material here. Our AI will analyze it and create practice questions with explanations..."
              className="w-full p-3 rounded-xl bg-[#050A1A] border border-[#172A52] focus:border-blue-400 focus:outline-none text-sm text-white placeholder-slate-500 resize-none transition-colors"
            />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#142345]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] text-white text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Quiz & Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
