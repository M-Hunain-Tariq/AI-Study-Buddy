'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Play, Sparkles, Timer } from 'lucide-react';
import { QuizItem } from '../quiz/types';
import { ALL_QUIZZES, FEATURED_QUIZZES } from '../quiz/quizData';
import { QuizModal } from '../quiz/QuizModal';
import { GenerateQuizModal } from '../quiz/GenerateQuizModal';
import { useToast } from '../Toast';

const HISTORY_KEY = 'study_quiz_history_v1';
const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'];

interface HistoryItem { id: string; title: string; subject: string; score: number; date: string }

/** Phone Quiz & Practice. Same quizzes, history (study_quiz_history_v1) and quiz player / AI generator as the laptop page. */
export const MobileQuiz: React.FC = () => {
  const { showToast } = useToast();
  const [subject, setSubject] = useState('All');
  const [active, setActive] = useState<QuizItem | null>(null);
  const [genOpen, setGenOpen] = useState(false);
  const [timed, setTimed] = useState(false);
  const [custom, setCustom] = useState<QuizItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (Array.isArray(saved)) setHistory(saved);
    } catch { /* ignore corrupt storage */ }
  }, []);

  const average = history.length ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const streak = useMemo(() => {
    const days = new Set(history.map((h) => new Date(h.date).toDateString()));
    let n = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) { n += 1; cursor.setDate(cursor.getDate() - 1); }
    return n;
  }, [history]);

  const quizzes = useMemo(() => {
    const all = [...custom, ...ALL_QUIZZES];
    return subject === 'All' ? all : all.filter((q) => q.subject === subject);
  }, [custom, subject]);
  const featured = subject === 'All' ? FEATURED_QUIZZES : FEATURED_QUIZZES.filter((q) => q.subject === subject);

  const start = (q: QuizItem) => { setActive(q); showToast(`Starting ${q.title}... Good luck! 🎯`, 'info'); };

  return (
    <section className="m-page" aria-label="Quiz & Practice">
      <header className="m-page-head">
        <h1>Quiz &amp; Practice</h1>
        <p>Test yourself and track your scores</p>
      </header>

      <div className="m-stats3">
        <div><strong>{history.length}</strong><span>Completed</span></div>
        <div><strong>{history.length ? `${average}%` : '–'}</strong><span>Average</span></div>
        <div><strong>{streak}</strong><span>Day streak</span></div>
      </div>

      <div className="m-plan-actions">
        <button type="button" className="m-btn m-btn-primary" onClick={() => setGenOpen(true)}><Sparkles size={18} /> Generate with AI</button>
        <button type="button" className={`m-btn m-btn-ghost${timed ? ' is-on' : ''}`} aria-pressed={timed} onClick={() => setTimed((v) => !v)}><Timer size={18} /> {timed ? '10 min on' : 'Timed'}</button>
      </div>

      <div className="m-chips" role="group" aria-label="Filter by subject">
        {SUBJECTS.map((s) => (
          <button key={s} type="button" className={subject === s ? 'is-on' : ''} aria-pressed={subject === s} onClick={() => setSubject(s)}>{s}</button>
        ))}
      </div>

      {featured.length > 0 && (
        <>
          <div className="m-section-head m-tight"><h2>Featured</h2></div>
          <div className="m-feat-row">
            {featured.map((q) => (
              <button key={q.id} type="button" className="m-feat" onClick={() => start(q)} aria-label={`Start ${q.title}`}>
                <span className="m-sym">{q.symbol}</span>
                <strong>{q.title}</strong>
                <small>{q.subject} · {q.difficulty}</small>
                <span className="m-feat-go"><Play size={14} /> Start</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="m-section-head m-tight"><h2>All quizzes</h2><span className="m-count">{quizzes.length}</span></div>
      {quizzes.length === 0 ? (
        <div className="m-card m-empty"><p>No quizzes for this subject yet</p></div>
      ) : (
        <ul className="m-card m-list m-plain">
          {quizzes.map((q) => (
            <li key={q.id} className="m-task">
              <span className="m-sym m-sym-sm" aria-hidden="true">{q.symbol}</span>
              <span className="m-row-main">
                <strong>{q.title}</strong>
                <small>{q.subject} · {q.questionsCount} questions · {q.difficulty}</small>
              </span>
              <button type="button" className="m-start" onClick={() => start(q)} aria-label={`Start ${q.title}`}>Start</button>
            </li>
          ))}
        </ul>
      )}

      <div className="m-section-head m-tight"><h2>Recent results</h2></div>
      {history.length === 0 ? (
        <div className="m-card m-empty"><p>Finish a quiz to see your scores here</p></div>
      ) : (
        <ul className="m-card m-list m-plain">
          {history.slice(0, 5).map((h) => (
            <li key={h.id} className="m-task">
              <span className="m-row-main m-pad"><strong>{h.title}</strong><small>{h.subject} · {h.date}</small></span>
              <span className={`m-score ${h.score >= 70 ? 'good' : h.score >= 40 ? 'mid' : 'low'}`}>{h.score}%</span>
            </li>
          ))}
        </ul>
      )}

      {active && (
        <QuizModal
          quiz={active}
          onClose={() => setActive(null)}
          timeLimitSeconds={timed ? 600 : undefined}
          onComplete={(score) => {
            const entry: HistoryItem = { id: `${active.id}-${Date.now()}`, title: active.title, subject: active.subject, score, date: new Date().toLocaleDateString() };
            setHistory((prev) => {
              const next = [entry, ...prev].slice(0, 20);
              try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
              return next;
            });
            showToast(`Quiz completed with ${score}% score! 🏆`, 'success');
          }}
          onRetryWrong={(wrongQuiz) => { setActive(wrongQuiz); showToast('Retrying your wrong answers.', 'info'); }}
        />
      )}
      <GenerateQuizModal isOpen={genOpen} onClose={() => setGenOpen(false)} onQuizGenerated={(q) => { setCustom((prev) => [q, ...prev]); setActive(q); }} />
    </section>
  );
};
