export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
  time?: string;
  date?: string;
  priority?: 'High' | 'Medium' | 'Normal';
  color: 'teal' | 'purple' | 'orange' | 'cyan' | 'blue';
}

export interface DaySchedule {
  dayName: string;
  dayShort: string;
  dateNum: number;
  dateStr: string;
  fullDate: string; // e.g. '2025-08-26'
  isToday?: boolean;
  sessions: {
    subject: string;
    durationMinutes: number;
    color: string;
    progressPercent: number;
  }[];
  totalMinutes: number;
  targetMinutes: number;
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Normal';
  targetSessions?: number;
  completedSessions?: number;
}

export interface RecommendedItem {
  id: string;
  title: string;
  subject: string;
  meta: string;
  actionText: string;
  buttonColor: string;
  iconName: 'split' | 'brain' | 'fileText' | 'beaker';
}
