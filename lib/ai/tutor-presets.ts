export type TutorMode = 'Ask Anything' | 'Practice' | 'Socratic';

export const TUTOR_MODES: Array<{ value: TutorMode; label: string; description: string }> = [
  { value: 'Ask Anything', label: 'Ask Anything', description: 'Clear, direct explanations for any question.' },
  { value: 'Practice', label: 'Practice', description: 'Learn through short exercises and feedback.' },
  { value: 'Socratic', label: 'Socratic', description: 'Build understanding with hints and guiding questions.' },
];

export const QUICK_PROMPTS = [
  {
    category: 'Mathematics',
    title: 'Quadratic equations',
    description: 'Compare factoring with the quadratic formula.',
    label: 'Solve a maths problem',
    prompt: 'Explain how to solve quadratic equations by factoring versus using the quadratic formula, with two clear examples.',
  },
  {
    category: 'Physics',
    title: "Newton's laws of motion",
    description: 'Understand the three laws with everyday examples.',
    label: 'Explain a science topic',
    prompt: "Explain Newton's three laws of motion using simple real-world examples.",
  },
  {
    category: 'Biology',
    title: 'Photosynthesis',
    description: 'Understand the process and its equation.',
    label: 'Understand a concept',
    prompt: 'Explain photosynthesis in simple language, show its chemical equation, and describe why it matters.',
  },
  {
    category: 'Chemistry',
    title: 'Periodic table trends',
    description: 'Learn atomic radius and electronegativity.',
    label: 'Review chemistry',
    prompt: 'Explain periodic table trends for electronegativity, atomic radius, and ionization energy with memory tips.',
  },
  {
    category: 'Study Skills',
    title: 'Active recall routine',
    description: 'Create a practical revision routine.',
    label: 'Improve study habits',
    prompt: 'Help me build a realistic active-recall and spaced-repetition routine for my subjects.',
  },
  {
    category: 'English',
    title: 'Essay structure',
    description: 'Plan a clear introduction and argument.',
    label: 'Plan an essay',
    prompt: 'Show me how to structure a strong academic essay, including a thesis, body paragraphs, and conclusion.',
  },
] as const;

export const STUDY_TOOLS = [
  {
    category: 'Understand',
    title: 'Concept Simplifier',
    description: 'Turn a difficult topic into plain language.',
    prompt: 'Explain this topic in simple language, define the key terms, and use one everyday analogy: ',
  },
  {
    category: 'Solve',
    title: 'Math Step Solver',
    description: 'Show each step and explain why it works.',
    prompt: 'Solve this problem step by step. Explain the reason for each step and check the final answer: ',
  },
  {
    category: 'Practice',
    title: 'Quiz Generator',
    description: 'Create questions with answer explanations.',
    prompt: 'Create a short practice quiz on this topic. Ask one question at a time, wait for my answer, then give feedback: ',
  },
  {
    category: 'Review',
    title: 'Notes Summarizer',
    description: 'Organize study material into key points.',
    prompt: 'Summarize this study material into clear headings, key points, important terms, and a short recap: ',
  },
  {
    category: 'Remember',
    title: 'Flashcard Builder',
    description: 'Make concise question-and-answer cards.',
    prompt: 'Create concise flashcards from this topic. Put one question on each front and a clear answer on the back: ',
  },
  {
    category: 'Write',
    title: 'Essay Outline Maker',
    description: 'Build a logical outline before writing.',
    prompt: 'Create a balanced essay outline with a thesis, main arguments, supporting evidence to look for, and conclusion: ',
  },
] as const;

export const SUPPORTED_FILE_ACCEPT = 'image/png,image/jpeg,image/webp,application/pdf,text/*,application/json,.md,.mdx,.csv,.json,.js,.jsx,.ts,.tsx,.py,.html,.css,.xml,.yaml,.yml';
export const SUPPORTED_FILE_HELP = 'PNG, JPG, WEBP, PDF, TXT, MD, CSV, JSON and code files · up to 4 MB';
