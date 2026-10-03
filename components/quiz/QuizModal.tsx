'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { QuizItem, QuizQuestion } from './types';

interface QuizModalProps {
  quiz: QuizItem | null;
  onClose: () => void;
  onComplete?: (score: number) => void;
}

const SAMPLE_QUESTIONS_BY_SUBJECT: Record<
  string,
  { question: string; options: string[]; correctAnswer: number; explanation: string }[]
> = {
  Mathematics: [
    {
      question: 'What is the solution to the equation 2x + 6 = 14?',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 8'],
      correctAnswer: 1,
      explanation: 'Subtract 6 from both sides: 2x = 8, then divide by 2: x = 4.',
    },
    {
      question: 'What is the discriminant of quadratic equation ax² + bx + c = 0?',
      options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', '-b ± √d'],
      correctAnswer: 0,
      explanation: 'The discriminant Δ is defined as b² - 4ac.',
    },
    {
      question: 'In a right triangle, what is sin(30°)?',
      options: ['1', '√3/2', '1/2', '1/√2'],
      correctAnswer: 2,
      explanation: 'sin(30°) = 0.5 or 1/2.',
    },
  ],
  Chemistry: [
    {
      question: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Gd'],
      correctAnswer: 1,
      explanation: 'Au comes from the Latin word "Aurum".',
    },
    {
      question: 'Which of the following is a noble gas?',
      options: ['Oxygen', 'Nitrogen', 'Helium', 'Chlorine'],
      correctAnswer: 2,
      explanation: 'Helium (He) has a full valence shell and is chemically inert.',
    },
  ],
  Physics: [
    {
      question: "According to Newton's Second Law, Force equals:",
      options: ['Mass × Acceleration', 'Mass / Velocity', 'Work × Time', 'Energy / Speed'],
      correctAnswer: 0,
      explanation: 'F = m · a (Force = Mass × Acceleration).',
    },
    {
      question: 'What is the SI unit of electrical resistance?',
      options: ['Volt', 'Ampere', 'Ohm (Ω)', 'Watt'],
      correctAnswer: 2,
      explanation: 'Resistance is measured in Ohms (Ω), named after Georg Ohm.',
    },
  ],
  English: [
    {
      question: 'Which of the following is a metaphor?',
      options: [
        'He was as brave as a lion.',
        'Time is a thief.',
        'The wind whispered through the trees.',
        'She sells seashells.',
      ],
      correctAnswer: 1,
      explanation: '"Time is a thief" directly equates time to a thief without using "like" or "as".',
    },
  ],
  'Computer Science': [
    {
      question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'A balanced BST divides search space in half at each step, yielding O(log n).',
    },
  ],
};

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const questions: QuizQuestion[] =
    quiz?.questions?.length
      ? quiz.questions
      : (SAMPLE_QUESTIONS_BY_SUBJECT[quiz?.subject ?? ''] || SAMPLE_QUESTIONS_BY_SUBJECT['Mathematics']).map(
          (question, index) => ({ ...question, id: `sample-${index + 1}` })
        );

  // Reset the quiz session whenever a different quiz is opened.
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setTimerSeconds(0);
  }, [quiz?.id]);

  // Timer
  useEffect(() => {
    if (!quiz || isFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz, isFinished]);

  if (!quiz) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete(Math.round(((score + (selectedOption === currentQ.correctAnswer ? 1 : 0)) / questions.length) * 100));
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setTimerSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#08122C] border border-[#1A3160] shadow-[0_25px_60px_rgba(2,6,23,0.95)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#142345] flex items-center justify-between bg-[#060D22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/25 border border-blue-400/40 text-blue-300 flex items-center justify-center text-sm font-bold shadow-inner">
              {quiz.symbol}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{quiz.title}</h3>
              <p className="text-[11px] text-slate-400">{quiz.subject} • Practice Session</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0A1635] px-2.5 py-1 rounded-lg border border-[#182A52]">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{formatTime(timerSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {!isFinished ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}% Completed</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0D1A36] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="pt-2">
                <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, idx) => {
                  let optStyle =
                    'border-[#16274D] bg-[#060D20] text-slate-200 hover:border-blue-500/50 hover:bg-[#0A1636]';

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      optStyle =
                        'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.3)]';
                    } else if (idx === selectedOption) {
                      optStyle =
                        'border-rose-500 bg-rose-950/40 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
                    } else {
                      optStyle = 'border-[#142340] bg-[#050A1A] text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Note when Answered */}
              {isAnswered && (
                <div className="p-3 rounded-xl bg-[#091535] border border-blue-500/30 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Explanation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-400/40 text-blue-300 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(99,102,241,0.4)]">
                <Award className="w-8 h-8 text-blue-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored <span className="text-emerald-400 font-bold">{score}</span> out of{' '}
                  <span className="text-white font-bold">{questions.length}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#060D20] border border-[#16274D] max-w-xs mx-auto text-xs text-slate-300 flex items-center justify-around">
                <div>
                  <span className="text-slate-400 block text-[10px]">Time Taken</span>
                  <span className="font-bold text-white">{formatTime(timerSeconds)}</span>
                </div>
                <div className="w-px h-6 bg-[#16274D]" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-bold text-emerald-400">
                    {Math.round((score / questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#142345] bg-[#060D22] flex items-center justify-end gap-2.5">
          {!isFinished ? (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAnswered
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] active:scale-95'
                  : 'bg-[#101D38] text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#12224A] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.5)] cursor-pointer active:scale-95"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
