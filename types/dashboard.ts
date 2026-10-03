export interface Task {
  id: string;
  title: string;
  subject: string;
  subjectColor: string; // e.g. 'purple' | 'blue' | 'indigo' | 'amber' | 'emerald'
  deadline: string;
  completed: boolean;
}

export interface StudyPlanItem {
  id: string;
  subject: string;
  duration: string;
  completed: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  timeAgo: string;
  color: string;
  content: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'streak' | 'reminder' | 'tip';
}
