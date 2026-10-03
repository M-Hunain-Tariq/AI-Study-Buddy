export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  description?: string;
  completedAt?: number;
}
