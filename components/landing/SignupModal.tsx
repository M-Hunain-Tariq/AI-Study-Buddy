'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, X } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    router.prefetch('/dashboard');
    if (!isOpen) {
      setIsSubmitting(false);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      inputRef.current?.focus();
      return;
    }

    if (isSubmitting) return;

    window.localStorage.setItem('studybuddy_user_name', trimmedName);
    setIsSubmitting(true);
    // Keep the centered welcome dialog visible while the dashboard route starts loading.
    router.push('/dashboard');
  };

  return (
    <div
      className="signup-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-xl animate-fadeIn"
      aria-hidden="false"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute left-[15%] top-[20%] h-40 w-40 rounded-full bg-violet-600/10 blur-[80px]" />
        <div className="absolute right-[15%] bottom-[15%] h-44 w-44 rounded-full bg-blue-500/10 blur-[90px]" />
      </div>

      <div className="signup-dialog relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/15 bg-[#071329]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65),0_0_45px_rgba(34,211,238,0.12)]" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-busy={isSubmitting}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-7 pb-8 pt-9 sm:px-9 sm:pb-9 sm:pt-10">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-xl" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-violet-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <Sparkles className="h-6 w-6 text-cyan-200" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">Welcome to AI StudyBuddy</p>
            <h2 id="welcome-title" className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-[34px]">
              Let&apos;s get started.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              What should we call you? Just your name — no email or account required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <label htmlFor="studybuddy-name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Your name
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-violet-500/0 opacity-0 blur-sm transition duration-300 group-focus-within:from-cyan-400/40 group-focus-within:via-blue-500/20 group-focus-within:to-violet-500/40 group-focus-within:opacity-100" />
              <input
                ref={inputRef}
                id="studybuddy-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your name"
                className="relative w-full rounded-2xl border border-white/10 bg-[#030b1c]/80 px-5 py-4 text-base font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-[#030b1c] focus:ring-4 focus:ring-cyan-400/10"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-5 py-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(99,102,241,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(34,211,238,0.28)] active:translate-y-0 disabled:cursor-wait disabled:opacity-80"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{isSubmitting ? 'Opening your workspace…' : 'Enter StudyBuddy'}</span>
              {isSubmitting ? (
                <span aria-hidden="true" className="relative h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : (
                <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              {isSubmitting ? 'Getting your study space ready…' : <>Press <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-slate-400">Enter ↵</span> to continue</>}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
