import type { AppSettings } from '@/lib/settings';

export interface SectionProps {
  settings: AppSettings;
  update: (fn: (prev: AppSettings) => AppSettings) => void;
  onBack: () => void;
  navigate: (id: SectionId) => void;
}

export type SectionId =
  | 'profile'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'data'
  | 'help'
  | 'advanced';
