'use client';

import React from 'react';
import { Bell, CalendarCheck, BookOpen, TrendingUp, Megaphone, Smartphone, Mail, BellRing } from 'lucide-react';
import { Card, CardTitle, Row, SectionShell, SidePanel, Toggle } from './ui';
import type { SectionProps } from './types';

export const NotificationsSection: React.FC<SectionProps> = ({ onBack }) => {
  const prefs: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; tone: string }[] = [
    { icon: CalendarCheck, title: 'Task Reminders', desc: 'Delivery service is not connected in this build.', tone: 'text-blue-300 bg-blue-500/15 border-blue-500/25' },
    { icon: BookOpen, title: 'Study Reminders', desc: 'Delivery service is not connected in this build.', tone: 'text-blue-300 bg-blue-500/15 border-blue-500/25' },
    { icon: TrendingUp, title: 'Progress Updates', desc: 'Delivery service is not connected in this build.', tone: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/25' },
    { icon: Megaphone, title: 'Marketing & Updates', desc: 'Delivery service is not connected in this build.', tone: 'text-blue-300 bg-blue-500/15 border-blue-500/25' },
  ];
  const methods: { icon: React.ComponentType<{ className?: string }>; title: string }[] = [
    { icon: Bell, title: 'In-App Notifications' },
    { icon: Mail, title: 'Email Notifications' },
    { icon: Smartphone, title: 'Push Notifications' },
  ];

  return (
    <SectionShell
      title="Notifications Settings"
      subtitle="Notification delivery is not connected in this build."
      onBack={onBack}
      aside={<SidePanel icon={BellRing} title="Stay Updated" desc="Notification delivery will be available after a provider is configured." glow="168,85,247" />}
    >
      <Card>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-[11px] text-slate-500 -mt-2 mb-1">These settings are shown for reference; no reminder or delivery service is currently connected.</p>
        {prefs.map((p) => (
          <Row key={p.title} icon={p.icon} title={p.title} desc={p.desc} tone={p.tone}>
            <Toggle checked={false} onChange={() => {}} disabled label={`${p.title} unavailable`} />
          </Row>
        ))}
      </Card>
      <Card>
        <CardTitle>Notification Methods</CardTitle>
        <p className="text-[11px] text-slate-500 -mt-2 mb-1">Email, in-app and push delivery will become available after a notification provider is configured.</p>
        {methods.map((m) => (
          <Row key={m.title} icon={m.icon} title={m.title} tone="text-slate-300 bg-slate-500/15 border-slate-500/25">
            <Toggle checked={false} onChange={() => {}} disabled label={`${m.title} unavailable`} />
          </Row>
        ))}
      </Card>
    </SectionShell>
  );
};
