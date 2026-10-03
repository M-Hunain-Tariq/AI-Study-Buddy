'use client';

import React from 'react';
import { Bell, CalendarCheck, BookOpen, TrendingUp, Megaphone, Smartphone, Mail, BellRing } from 'lucide-react';
import { useToast } from '../Toast';
import type { AppSettings } from '@/lib/settings';
import { Card, CardTitle, Row, SectionShell, SidePanel, Toggle } from './ui';
import type { SectionProps } from './types';

type NKey = keyof AppSettings['notifications'];

export const NotificationsSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const n = settings.notifications;
  const flip = (k: NKey, v: boolean) => {
    update((s) => ({ ...s, notifications: { ...s.notifications, [k]: v } }));
    if (k === 'push' && v && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().then((r) => {
        if (r !== 'granted') {
          update((s) => ({ ...s, notifications: { ...s.notifications, push: false } }));
          showToast('Browser notifications were not allowed.', 'info');
        }
      });
    }
  };

  const prefs: { k: NKey; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; tone: string }[] = [
    { k: 'task', icon: CalendarCheck, title: 'Task Reminders', desc: 'Get notified about your upcoming tasks', tone: 'text-blue-300 bg-blue-500/15 border-blue-500/25' },
    { k: 'study', icon: BookOpen, title: 'Study Reminders', desc: 'Daily study schedule and goals', tone: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/25' },
    { k: 'progress', icon: TrendingUp, title: 'Progress Updates', desc: 'Weekly progress and achievements', tone: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/25' },
    { k: 'marketing', icon: Megaphone, title: 'Marketing & Updates', desc: 'Product updates and new features', tone: 'text-purple-300 bg-purple-500/15 border-purple-500/25' },
  ];
  const methods: { k: NKey; icon: React.ComponentType<{ className?: string }>; title: string }[] = [
    { k: 'inApp', icon: Bell, title: 'In-App Notifications' },
    { k: 'email', icon: Mail, title: 'Email Notifications' },
    { k: 'push', icon: Smartphone, title: 'Push Notifications' },
  ];

  return (
    <SectionShell
      title="Notifications Settings"
      subtitle="Choose what you want to be notified about."
      onBack={onBack}
      aside={<SidePanel icon={BellRing} title="Stay Updated" desc="Never miss important updates, reminders and achievements." glow="168,85,247" />}
    >
      <Card>
        <CardTitle>Notification Preferences</CardTitle>
        {prefs.map((p) => (
          <Row key={p.k} icon={p.icon} title={p.title} desc={p.desc} tone={p.tone}>
            <Toggle checked={n[p.k]} onChange={(v) => flip(p.k, v)} label={p.title} />
          </Row>
        ))}
      </Card>
      <Card>
        <CardTitle>Notification Methods</CardTitle>
        {methods.map((m) => (
          <Row key={m.k} icon={m.icon} title={m.title} tone="text-slate-300 bg-slate-500/15 border-slate-500/25">
            <Toggle checked={n[m.k]} onChange={(v) => flip(m.k, v)} label={m.title} />
          </Row>
        ))}
      </Card>
    </SectionShell>
  );
};
