'use client';

import { useEffect, useState } from 'react';

/** Same subject list the laptop Tasks/Notes forms offer. */
export const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'General'];

/** Reads a list from localStorage, dropping the old demo items (same cleanup the laptop screens do). */
export function readStored<T extends { id: string }>(key: string, demoIds: string[]): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter((item: T) => item && typeof item.id === 'string' && !demoIds.includes(item.id));
    if (clean.length !== parsed.length) localStorage.setItem(key, JSON.stringify(clean));
    return clean;
  } catch {
    return [];
  }
}

/** Writes to localStorage; the optional database mirror watches this key where enabled. */
export function writeStored<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

/** Name entered on the signup screen (falls back to "Student"). */
export function useUserName(): string {
  const [name, setName] = useState('Student');
  useEffect(() => {
    try {
      const stored = localStorage.getItem('studybuddy_user_name');
      if (stored && stored.trim()) setName(stored.trim());
    } catch {
      /* ignore */
    }
  }, []);
  return name;
}
