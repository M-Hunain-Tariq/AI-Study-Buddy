'use client';

import { useCallback, useEffect, useState } from 'react';

export interface AppSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    country: string;
    level: string;
    bio: string;
    photo: string;
  };
  theme: 'light' | 'dark' | 'auto';
  accent: string;
  background: 'default' | 'animated' | 'minimal';
  fontFamily: string;
  textSize: 'small' | 'normal' | 'large';
  notifications: {
    task: boolean;
    study: boolean;
    progress: boolean;
    marketing: boolean;
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  privacy: {
    twoFactor: boolean;
    personalized: boolean;
    shareUsage: boolean;
    analytics: boolean;
  };
  advanced: {
    debug: boolean;
    boundaries: boolean;
    aiSuggestions: boolean;
    smartPlan: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    name: 'Muhammad',
    email: 'muhammad@example.com',
    phone: '+82 300 1234567',
    dob: '',
    country: 'Pakistan',
    level: 'High School',
    bio: '',
    photo: '',
  },
  theme: 'dark',
  accent: '#6366F1',
  background: 'animated',
  fontFamily: 'system',
  textSize: 'normal',
  notifications: {
    task: true,
    study: true,
    progress: true,
    marketing: false,
    inApp: true,
    email: true,
    push: false,
  },
  privacy: { twoFactor: false, personalized: true, shareUsage: false, analytics: true },
  advanced: { debug: false, boundaries: false, aiSuggestions: true, smartPlan: false },
};

export const ACCENTS = ['#7C3AED', '#6366F1', '#A855F7', '#06B6D4', '#14B8A6', '#F59E0B'];

export const FONTS: { id: string; label: string; stack: string }[] = [
  { id: 'system', label: 'System (Default)', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: 'serif', label: 'Serif', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', label: 'Monospace', stack: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  { id: 'rounded', label: 'Rounded', stack: "ui-rounded, 'Nunito', 'Segoe UI', sans-serif" },
];

export const SETTINGS_KEY = 'studybuddy-settings-v1';

function merge(base: AppSettings, saved: Partial<AppSettings>): AppSettings {
  return {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile ?? {}) },
    notifications: { ...base.notifications, ...(saved.notifications ?? {}) },
    privacy: { ...base.privacy, ...(saved.privacy ?? {}) },
    advanced: { ...base.advanced, ...(saved.advanced ?? {}) },
  };
}

export function applySettingsToDocument(s: AppSettings) {
  const root = document.documentElement;
  const size = s.textSize === 'small' ? '14px' : s.textSize === 'large' ? '18px' : '16px';
  root.style.fontSize = size;
  root.style.setProperty('--accent', s.accent);
  root.dataset.bg = s.background;
  const resolvedTheme = s.theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s.theme;
  root.dataset.theme = resolvedTheme;
  const font = FONTS.find((f) => f.id === s.fontFamily) ?? FONTS[0];
  document.body.style.fontFamily = font.stack;
}

/** Loads + persists settings in localStorage and applies them to the document. */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings(merge(DEFAULT_SETTINGS, JSON.parse(raw)));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applySettingsToDocument(settings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* storage full / blocked */
    }
  }, [settings, ready]);

  const update = useCallback((fn: (prev: AppSettings) => AppSettings) => setSettings(fn), []);
  const replace = useCallback((next: Partial<AppSettings>) => setSettings(merge(DEFAULT_SETTINGS, next)), []);
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return { settings, update, replace, reset, ready };
}
