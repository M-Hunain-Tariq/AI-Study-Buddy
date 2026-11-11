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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedString(value: unknown, fallback: string, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : fallback;
}

function readBooleans<T extends object>(defaults: T, value: unknown): T {
  const input = isRecord(value) ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key,
    typeof input[key] === 'boolean' ? input[key] : fallback,
  ])) as T;
}

/** Validate persisted/imported settings instead of trusting arbitrary localStorage JSON. */
export function sanitizeSettings(saved: unknown): AppSettings {
  const value = isRecord(saved) ? saved : {};
  const profile = isRecord(value.profile) ? value.profile : {};
  const theme = value.theme === 'light' || value.theme === 'dark' || value.theme === 'auto' ? value.theme : DEFAULT_SETTINGS.theme;
  const background = value.background === 'default' || value.background === 'animated' || value.background === 'minimal' ? value.background : DEFAULT_SETTINGS.background;
  const textSize = value.textSize === 'small' || value.textSize === 'normal' || value.textSize === 'large' ? value.textSize : DEFAULT_SETTINGS.textSize;
  const accent = typeof value.accent === 'string' && ACCENTS.includes(value.accent) ? value.accent : DEFAULT_SETTINGS.accent;
  const fontFamily = typeof value.fontFamily === 'string' && FONTS.some((font) => font.id === value.fontFamily) ? value.fontFamily : DEFAULT_SETTINGS.fontFamily;

  return {
    theme,
    accent,
    background,
    fontFamily,
    textSize,
    profile: {
      name: boundedString(profile.name, DEFAULT_SETTINGS.profile.name, 80),
      email: boundedString(profile.email, DEFAULT_SETTINGS.profile.email, 254),
      phone: boundedString(profile.phone, DEFAULT_SETTINGS.profile.phone, 40),
      dob: boundedString(profile.dob, DEFAULT_SETTINGS.profile.dob, 20),
      country: boundedString(profile.country, DEFAULT_SETTINGS.profile.country, 80),
      level: boundedString(profile.level, DEFAULT_SETTINGS.profile.level, 80),
      bio: boundedString(profile.bio, DEFAULT_SETTINGS.profile.bio, 1000),
      photo: boundedString(profile.photo, DEFAULT_SETTINGS.profile.photo, 2_000_000),
    },
    notifications: readBooleans(DEFAULT_SETTINGS.notifications, value.notifications),
    privacy: readBooleans(DEFAULT_SETTINGS.privacy, value.privacy),
    advanced: readBooleans(DEFAULT_SETTINGS.advanced, value.advanced),
  };
}

function merge(_base: AppSettings, saved: unknown): AppSettings {
  return sanitizeSettings(saved);
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
