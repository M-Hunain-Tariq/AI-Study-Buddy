export type NoteColor = 'purple' | 'blue' | 'pink' | 'emerald';
export type NotePriority = 'Low' | 'Medium' | 'High';

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  color: NoteColor;
  content: string;
  excerpt: string;
  lastEdited: string;
  lastEditedTimestamp: number;
  priority?: NotePriority;
  tags?: string[];
  isPrivate?: boolean;
  isPinned?: boolean;
  addToPlanner?: boolean;
}
