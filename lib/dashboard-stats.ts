export interface DashboardStats {
  completedStudyMinutes: number;
  savedAiQuestions: number;
  recentQuizAccuracy: number | null;
  quizCount: number;
}

export interface WeeklyActivityDay {
  key: string;
  label: string;
  minutes: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? value.trim()
    : null;
}

export function calculateDashboardStats(
  plannerTasks: unknown,
  savedChats: unknown,
  quizHistory: unknown,
): DashboardStats {
  const completedStudyMinutes = asList(plannerTasks).reduce<number>((total, item) => {
    const task = asRecord(item);
    if (!task || task.completed !== true) return total;
    const duration = Number(task.durationMinutes);
    return total + (Number.isFinite(duration) ? Math.min(1440, Math.max(0, duration)) : 0);
  }, 0);

  const savedAiQuestions = asList(savedChats).reduce<number>((total, item) => {
    const chat = asRecord(item);
    return total + asList(chat?.messages).filter((message) => asRecord(message)?.sender === 'user').length;
  }, 0);

  const scores = asList(quizHistory)
    .map((item) => Number(asRecord(item)?.score))
    .filter((score) => Number.isFinite(score) && score >= 0 && score <= 100);

  return {
    completedStudyMinutes,
    savedAiQuestions,
    recentQuizAccuracy: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
    quizCount: scores.length,
  };
}

/** Returns completed, scheduled study minutes for the current day and previous six local days. */
export function calculateWeeklyActivity(plannerTasks: unknown, now = new Date()): WeeklyActivityDay[] {
  const minutesByDate = new Map<string, number>();
  for (const item of asList(plannerTasks)) {
    const task = asRecord(item);
    if (!task || task.completed !== true) continue;
    const key = parseDateKey(task.date);
    if (!key) continue;
    const duration = Number(task.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) continue;
    minutesByDate.set(key, (minutesByDate.get(key) || 0) + Math.min(1440, duration));
  }

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
    const key = localDateKey(date);
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      minutes: minutesByDate.get(key) || 0,
    };
  });
}
