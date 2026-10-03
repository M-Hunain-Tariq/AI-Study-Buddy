'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSettings } from '@/lib/settings';
import { SettingsHub } from './SettingsHub';
import { ProfileSection } from './ProfileSection';
import { AppearanceSection } from './AppearanceSection';
import { NotificationsSection } from './NotificationsSection';
import { PrivacySection } from './PrivacySection';
import { DataSection } from './DataSection';
import { HelpSection } from './HelpSection';
import { AdvancedSection } from './AdvancedSection';
import type { SectionId, SectionProps } from './types';

const IDS: SectionId[] = ['profile', 'appearance', 'notifications', 'privacy', 'data', 'help', 'advanced'];
const VIEWS: Record<SectionId, React.FC<SectionProps>> = {
  profile: ProfileSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  privacy: PrivacySection,
  data: DataSection,
  help: HelpSection,
  advanced: AdvancedSection,
};

const fromHash = (): SectionId | null => {
  const h = window.location.hash.replace('#', '') as SectionId;
  return IDS.includes(h) ? h : null;
};

export const SettingsWorkspace: React.FC = () => {
  const { settings, update, ready } = useSettings();
  const [section, setSection] = useState<SectionId | null>(null);

  useEffect(() => {
    setSection(fromHash());
    const onHash = () => setSection(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((id: SectionId | null) => {
    window.location.hash = id ?? '';
    if (!id) history.replaceState(null, '', window.location.pathname);
    setSection(id);
    window.scrollTo({ top: 0 });
  }, []);

  if (!ready) return <div className="h-64" aria-busy="true" />;

  if (!section) return <SettingsHub onOpen={navigate} />;
  const View = VIEWS[section];
  return <View settings={settings} update={update} onBack={() => navigate(null)} navigate={navigate} />;
};
