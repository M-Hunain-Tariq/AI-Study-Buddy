export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuizSubject =
  | 'All Subjects'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'English'
  | 'Computer Science';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  difficulty: QuizDifficulty;
  symbol: string;
  colorScheme: 'blue' | 'emerald' | 'purple' | 'rose' | 'amber';
  featured?: boolean;
  questions?: QuizQuestion[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Started';
  timeAgo: string;
  symbol: string;
  colorScheme: 'blue' | 'emerald' | 'purple';
}
