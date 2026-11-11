import { QuizItem } from './types';

// 3 Featured Quizzes matching image.png exactly
export const FEATURED_QUIZZES: QuizItem[] = [
  {
    id: 'feat-algebra',
    title: 'Algebra Basics',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '× ÷',
    colorScheme: 'blue',
    featured: true,
  },
  {
    id: 'feat-atoms',
    title: 'Atoms & Molecules',
    subject: 'Chemistry',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '⚛',
    colorScheme: 'blue',
    featured: true,
  },
  {
    id: 'feat-motion',
    title: 'Motion & Forces',
    subject: 'Physics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '∆',
    colorScheme: 'blue',
    featured: true,
  },
];

// 6 All Quizzes matching image.png exactly
export const ALL_QUIZZES: QuizItem[] = [
  {
    id: 'quiz-quadratic',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '√x',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-electricity',
    title: 'Electricity & Circuits',
    subject: 'Physics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '⚡',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-periodic',
    title: 'Periodic Table',
    subject: 'Chemistry',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '⚗',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-grammar',
    title: 'Grammar Basics',
    subject: 'English',
    questionsCount: 10,
    difficulty: 'Easy',
    symbol: '📖',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-python',
    title: 'Python Fundamentals',
    subject: 'Computer Science',
    questionsCount: 10,
    difficulty: 'Medium',
    symbol: '</>',
    colorScheme: 'blue',
  },
  {
    id: 'quiz-trigonometry',
    title: 'Trigonometry',
    subject: 'Mathematics',
    questionsCount: 10,
    difficulty: 'Hard',
    symbol: '∆',
    colorScheme: 'blue',
  },
];

// Recent activity is populated only from quizzes the student actually completes.
