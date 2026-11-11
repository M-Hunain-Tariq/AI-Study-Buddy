'use client';

import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface MobileLandingProps {
  onStart: () => void;
}

const FEATURES = [
  { icon: BookOpen, title: 'AI Study Help', text: 'Clear answers, step by step.' },
  { icon: Brain, title: 'Smart Quizzes', text: 'Practice that adapts to you.' },
  { icon: CalendarDays, title: 'Study Planner', text: 'A plan that keeps you on track.' },
  { icon: TrendingUp, title: 'Track Progress', text: 'See every step forward.' },
];

const STEPS = [
  { title: 'Set a goal', text: 'Choose what to learn' },
  { title: 'Learn with AI', text: 'Get help and practise' },
  { title: 'Make progress', text: 'Stay on track' },
];

/** Compact phone layout that keeps the desktop landing page's visual identity. */
export const MobileLanding: React.FC<MobileLandingProps> = ({ onStart }) => (
  <main className="ml-page lg:hidden">
    <header className="ml-header">
      <a href="/" className="ml-brand" aria-label="StudyBuddy home">
        <span className="ml-brand-mark"><GraduationCap size={19} strokeWidth={2.2} /></span>
        <span className="ml-brand-name">StudyBuddy</span>
      </a>
      <button type="button" className="ml-header-cta" onClick={onStart}>Get started</button>
    </header>

    <section className="ml-hero" aria-labelledby="ml-title">
      <img
        className="ml-hero-image"
        src="/landing/hero_scene_full_1790180757625.jpg"
        alt="Friendly AI study robot ready to help"
        fetchPriority="high"
      />
      <div className="ml-hero-shade" />
      <div className="ml-hero-content">
        <span className="ml-eyebrow"><Sparkles size={13} /> YOUR AI-POWERED STUDY COMPANION</span>
        <h1 id="ml-title">Learn Smarter,<br /><span>Not Harder.</span></h1>
        <p>Study with AI support, smart quizzes and a plan that keeps you moving forward.</p>
        <button type="button" className="ml-primary-cta" onClick={onStart}>
          Start learning free <ArrowRight size={17} />
        </button>
        <div className="ml-hero-proof">
          <span><CheckCircle2 size={14} /> Free to start</span>
          <i aria-hidden="true" />
          <span><CheckCircle2 size={14} /> No card required</span>
        </div>
      </div>
      <div className="ml-hero-orbit" aria-hidden="true"><span /><span /><span /></div>
    </section>

    <section className="ml-features" aria-labelledby="ml-features-title">
      <div className="ml-section-heading">
        <span className="ml-section-kicker">MADE FOR BETTER LEARNING</span>
        <h2 id="ml-features-title">Everything you need to <em>move forward.</em></h2>
      </div>
      <div className="ml-feature-grid">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <article className="ml-feature" key={title}>
            <span className="ml-feature-icon"><Icon size={19} strokeWidth={1.9} /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="ml-flow" aria-labelledby="ml-flow-title">
      <div className="ml-flow-heading">
        <div>
          <span className="ml-section-kicker">SIMPLE BY DESIGN</span>
          <h2 id="ml-flow-title">Your path to progress</h2>
        </div>
        <span className="ml-flow-spark"><Sparkles size={18} /></span>
      </div>
      <div className="ml-step-track">
        {STEPS.map((step, index) => (
          <div className="ml-step" key={step.title}>
            <span className="ml-step-number">0{index + 1}</span>
            <span className="ml-step-line" aria-hidden="true" />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="ml-proof" aria-label="StudyBuddy highlights">
      <div><strong>100K+</strong><span>learners</span></div>
      <i aria-hidden="true" />
      <div><strong>1M+</strong><span>questions answered</span></div>
      <i aria-hidden="true" />
      <div><strong>4.8/5</strong><span>student rating</span></div>
    </section>

    <section className="ml-final" aria-labelledby="ml-final-title">
      <img src="/landing/sunset_mountain_student_1790178300240.jpg" alt="A student looking toward a bright future" loading="lazy" />
      <div className="ml-final-shade" />
      <div className="ml-final-content">
        <span className="ml-section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2 id="ml-final-title">Make every study session count.</h2>
        <p>Build better habits and reach your goals with StudyBuddy.</p>
        <button type="button" className="ml-primary-cta" onClick={onStart}>
          Start for free <ArrowRight size={17} />
        </button>
      </div>
    </section>

    <footer className="ml-footer">
      <a href="/" className="ml-brand" aria-label="StudyBuddy home">
        <span className="ml-brand-mark"><GraduationCap size={17} /></span>
        <span className="ml-brand-name">StudyBuddy</span>
      </a>
      <span>© 2026 StudyBuddy. All rights reserved.</span>
    </footer>
  </main>
);
