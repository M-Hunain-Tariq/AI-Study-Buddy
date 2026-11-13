'use client';

import React, { useRef, useState } from 'react';
import {
  ChevronUp,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Globe,
  HelpCircle,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { SeeItInAction } from '../landing/SeeItInAction';

interface MobileLandingProps {
  onStart: () => void;
}

const FEATURES = [
  {
    icon: Globe,
    title: 'AI Powered Help',
    text: 'Get instant answers, explanations and step-by-step support, anytime.',
    tone: 'cyan',
  },
  {
    icon: HelpCircle,
    title: 'Smart Quizzes',
    text: 'Test your knowledge with personalized quizzes and practice tests.',
    tone: 'blue',
  },
  {
    icon: CalendarDays,
    title: 'Study Planning',
    text: 'Create custom study plans and stay on track with your goals.',
    tone: 'cyan',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    text: 'See your progress, build better habits and achieve more.',
    tone: 'violet',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Choose Your Goal',
    text: 'Set your learning goals and pick your subjects.',
  },
  {
    number: '02',
    title: 'Learn with AI',
    text: 'Ask questions, get explanations, create quizzes and more.',
  },
  {
    number: '03',
    title: 'Track & Achieve',
    text: 'Monitor your progress and reach your goals faster.',
  },
];

const STATS = [
  { value: '100K+', label: 'Active students' },
  { value: '1M+', label: 'Questions answered' },
  { value: '95%', label: 'Goal completion rate' },
  { value: '4.8/5', label: 'Average rating' },
];

const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    role: 'Computer Science Student',
    avatar: '/landing/avatar_ayesha_1790173584033.jpg',
    quote:
      'StudyBuddy made learning so much easier! The AI assistant is amazing and the quizzes really help me remember what I learn.',
  },
  {
    name: 'Usman Raza',
    role: 'Engineering Student',
    avatar: '/landing/avatar_usman_1790173602592.jpg',
    quote:
      "I love the study planner feature. It keeps me organized and helps me stay consistent. I've improved a lot since using this app!",
  },
  {
    name: 'Sara Ali',
    role: 'Medical Student',
    avatar: '/landing/avatar_sara_1790173616158.jpg',
    quote: 'The best learning app I\'ve ever used. Simple, powerful and super helpful. Highly recommended!',
  },
];

/**
 * Phone/tablet landing experience. The desktop landing page remains untouched;
 * this layout keeps the desktop brand, illustrations, copy and working demo,
 * with spacing and composition tuned for narrow viewports.
 */
export const MobileLanding: React.FC<MobileLandingProps> = ({ onStart }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const testimonial = TESTIMONIALS[activeTestimonial];

  const showPreviousTestimonial = () => {
    setActiveTestimonial((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const showNextTestimonial = () => {
    setActiveTestimonial((current) => (current + 1) % TESTIMONIALS.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(delta) > 42) {
      if (delta < 0) showNextTestimonial();
      else showPreviousTestimonial();
    }
    touchStartX.current = null;
  };

  return (
    <main className="ml-page lg:hidden">
      <header className="ml-header">
        <a href="/" className="ml-brand" aria-label="StudyBuddy home">
          <span className="ml-brand-mark"><GraduationCap size={19} strokeWidth={2.1} /></span>
          <span className="ml-brand-name">StudyBuddy</span>
        </a>
      </header>

      <section className="ml-hero" aria-labelledby="ml-title">
        <div className="ml-hero-scene" aria-hidden="true">
          <picture className="ml-hero-picture">
            <source
              media="(min-width: 540px)"
              srcSet="/landing/hero_scene_full_1790180757625.jpg"
            />
            <img
              src="/landing/hero_scene_mobile_focus.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="ml-hero-scene-shade" />
          <span className="ml-scene-glow ml-scene-glow-one" />
          <span className="ml-scene-glow ml-scene-glow-two" />
        </div>

        <div className="ml-hero-content">
          <span className="ml-eyebrow"><Sparkles size={13} /> YOUR AI-POWERED STUDY COMPANION</span>
          <h1 id="ml-title">Learn Smarter,<br /><span>Not Harder.</span></h1>
          <p>
            Learn faster, stay organized, and achieve your goals with personalized learning,
            smart quizzes, and 24/7 support.
          </p>
          <div className="ml-hero-actions">
            <button type="button" className="ml-primary-cta" onClick={onStart}>
              Start Learning Free <ArrowRight size={17} />
            </button>
            <span className="ml-hero-note"><CheckCircle2 size={14} /> No credit card required</span>
          </div>
          <div className="ml-hero-proof" aria-label="StudyBuddy benefits">
            <span><CheckCircle2 size={14} /> Free forever plan</span>
            <i aria-hidden="true" />
            <span><CheckCircle2 size={14} /> Loved by 100K+ students</span>
          </div>
        </div>
      </section>

      <section id="ml-features" className="ml-section ml-features" aria-labelledby="ml-features-title">
        <div className="ml-section-heading">
          <span className="ml-section-kicker">✦ WHY STUDYBUDDY</span>
          <h2 id="ml-features-title">Everything You Need <em>for Better Learning</em></h2>
          <p>All the tools you need to learn, grow and succeed — in one place.</p>
        </div>

        <div className="ml-feature-grid">
          {FEATURES.map(({ icon: Icon, title, text, tone }) => (
            <article className={`ml-feature ml-feature-${tone}`} key={title}>
              <span className="ml-feature-icon"><Icon size={19} strokeWidth={1.9} /></span>
              <div className="ml-feature-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span className="ml-feature-corner" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section id="ml-how-it-works" className="ml-section ml-process" aria-labelledby="ml-process-title">
        <div className="ml-section-heading ml-section-heading-process">
          <span className="ml-section-kicker">✦ SIMPLE BY DESIGN</span>
          <h2 id="ml-process-title">Three Steps to <em>Progress</em></h2>
          <p>A clear path from setting a goal to seeing how far you have come.</p>
        </div>

        <div className="ml-step-track">
          <span className="ml-step-connector" aria-hidden="true" />
          {STEPS.map((step) => (
            <article className="ml-step" key={step.number}>
              <span className="ml-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="ml-see-it-in-action" className="ml-showcase">
        <SeeItInAction />
      </div>

      <section id="ml-reviews" className="ml-section ml-trust" aria-labelledby="ml-trust-title">
        <div className="ml-section-heading ml-section-heading-trust">
          <span className="ml-section-kicker">✦ REAL STUDENTS. REAL RESULTS.</span>
          <h2 id="ml-trust-title">Trusted by Learners <em>Worldwide</em></h2>
          <p>Join students who are working toward their goals with AI StudyBuddy.</p>
        </div>

        <div className="ml-stats" aria-label="StudyBuddy highlights">
          {STATS.map((stat) => (
            <div className="ml-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="ml-testimonial-heading">
          <div>
            <span className="ml-section-kicker">STUDENT STORIES</span>
            <h3>What learners say</h3>
          </div>
          <div className="ml-testimonial-controls">
            <button type="button" onClick={showPreviousTestimonial} aria-label="Previous testimonial">
              <ChevronLeft size={17} />
            </button>
            <button type="button" onClick={showNextTestimonial} aria-label="Next testimonial">
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div
          className="ml-testimonial"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-live="polite"
        >
          <div className="ml-testimonial-topline">
            <span className="ml-quote-mark" aria-hidden="true">“</span>
            <div className="ml-stars" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}
            </div>
          </div>
          <p className="ml-testimonial-quote">{testimonial.quote}</p>
          <div className="ml-testimonial-person">
            <img src={testimonial.avatar} alt={testimonial.name} loading="lazy" />
            <div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
            <span className="ml-testimonial-index">0{activeTestimonial + 1} / 03</span>
          </div>
        </div>

        <div className="ml-testimonial-dots" aria-label="Choose testimonial">
          {TESTIMONIALS.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={index === activeTestimonial ? 'is-active' : ''}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`Show testimonial ${index + 1} from ${item.name}`}
              aria-current={index === activeTestimonial ? 'true' : undefined}
            />
          ))}
        </div>
      </section>

      <section className="ml-final" aria-labelledby="ml-final-title">
        <img
          src="/landing/sunset_mountain_student_1790178300240.jpg"
          alt="A student looking toward the horizon at sunset"
          loading="lazy"
        />
        <div className="ml-final-shade" />
        <div className="ml-final-content">
          <span className="ml-section-kicker">✦ READY TO GET STARTED?</span>
          <h2 id="ml-final-title">Your Future Self<br /><em>Will Thank You.</em></h2>
          <p>Start your free learning journey today and unlock your full potential with AI StudyBuddy.</p>
          <button type="button" className="ml-primary-cta" onClick={onStart}>
            Start Learning Free <ArrowRight size={17} />
          </button>
          <div className="ml-final-proof">
            <span><CheckCircle2 size={13} /> Free forever</span>
            <span><CheckCircle2 size={13} /> No credit card required</span>
          </div>
        </div>
      </section>

      <footer className="ml-footer">
        <a href="/" className="ml-brand" aria-label="StudyBuddy home">
          <span className="ml-brand-mark"><GraduationCap size={17} /></span>
          <span className="ml-brand-name">StudyBuddy</span>
        </a>
        <nav className="ml-footer-links" aria-label="Footer links">
          <a href="#ml-features">Features</a>
          <a href="#ml-how-it-works">How it works</a>
          <a href="#ml-reviews">Reviews</a>
        </nav>
        <span className="ml-copyright">© 2025 StudyBuddy. All rights reserved.</span>
        <a href="#ml-title" className="ml-back-to-top"><ChevronUp size={13} /> Back to top</a>
      </footer>
    </main>
  );
};
