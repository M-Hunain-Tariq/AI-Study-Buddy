import { toLocalDateString } from './date';

export const STUDY_STREAK_STATE_KEY = 'study_streak_state_v1';
export const LEGACY_STUDY_STREAK_KEY = 'study_streak_days';

interface StudyStreakState {
  count: number;
  lastStudyDate: string;
}

function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && toLocalDateString(parsed) === value;
}

function readState(): StudyStreakState | null {
  try {
    const raw = localStorage.getItem(STUDY_STREAK_STATE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const state = value as Partial<StudyStreakState>;
    if (!Number.isSafeInteger(state.count) || (state.count ?? 0) < 1 || !isValidDateString(state.lastStudyDate)) return null;
    return { count: state.count as number, lastStudyDate: state.lastStudyDate };
  } catch {
    return null;
  }
}

function yesterdayOf(date: string): string {
  const yesterday = new Date(`${date}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  return toLocalDateString(yesterday);
}

/** Returns the active streak. It expires after a full day without study activity. */
export function getCurrentStudyStreak(now = new Date()): number {
  if (typeof window === 'undefined') return 0;
  const state = readState();
  if (!state) return 0;
  const today = toLocalDateString(now);
  return state.lastStudyDate === today || state.lastStudyDate === yesterdayOf(today) ? state.count : 0;
}

/** Records at most one streak day per local calendar day, shared by desktop and mobile. */
export function recordStudyDay(now = new Date()): number {
  const today = toLocalDateString(now);
  const previous = typeof window === 'undefined' ? null : readState();
  let count = 1;

  if (previous?.lastStudyDate === today) count = previous.count;
  else if (previous?.lastStudyDate === yesterdayOf(today)) count = previous.count + 1;

  if (typeof window !== 'undefined') {
    const state: StudyStreakState = { count, lastStudyDate: today };
    try {
      localStorage.setItem(STUDY_STREAK_STATE_KEY, JSON.stringify(state));
      // Keep the previous key for compatibility with older app builds/backups.
      localStorage.setItem(LEGACY_STUDY_STREAK_KEY, String(count));
    } catch {
      // The UI still reflects today's activity when browser storage is unavailable.
    }
  }
  return count;
}
