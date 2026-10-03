'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, History, Sparkles, Share2, BarChart3, ShieldHalf, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../Toast';
import type { AppSettings } from '@/lib/settings';
import { Card, CardTitle, Field, GhostButton, Modal, PrimaryButton, Row, SectionShell, SidePanel, Toggle, fieldClass } from './ui';
import type { SectionProps } from './types';

const LOGINS = [
  { device: 'Chrome on Windows', where: 'Rahim Yar Khan, PK', when: 'Active now' },
  { device: 'Study Buddy app on Android', where: 'Rahim Yar Khan, PK', when: 'Yesterday, 8:14 PM' },
  { device: 'Safari on iPad', where: 'Lahore, PK', when: '3 days ago' },
];

export const PrivacySection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const p = settings.privacy;
  const [pwOpen, setPwOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [pw, setPw] = useState({ cur: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);

  const flip = (k: keyof AppSettings['privacy'], v: boolean, label?: string) => {
    update((s) => ({ ...s, privacy: { ...s.privacy, [k]: v } }));
    if (label) showToast(`${label} ${v ? 'enabled' : 'disabled'}`, 'success');
  };

  const submitPw = () => {
    if (!pw.cur) return showToast('Enter your current password.', 'info');
    if (pw.next.length < 8) return showToast('New password must be at least 8 characters.', 'info');
    if (pw.next !== pw.confirm) return showToast('New passwords do not match.', 'info');
    // Demo app has no auth backend; wire this to your auth provider.
    setPwOpen(false);
    setPw({ cur: '', next: '', confirm: '' });
    showToast('Password changed', 'success');
  };

  const data: { k: keyof AppSettings['privacy']; icon: React.ComponentType<{ className?: string }>; title: string }[] = [
    { k: 'personalized', icon: Sparkles, title: 'Allow personalized recommendations' },
    { k: 'shareUsage', icon: Share2, title: 'Share usage data for improvements' },
    { k: 'analytics', icon: BarChart3, title: 'Allow analytics' },
  ];

  return (
    <SectionShell
      title="Privacy & Security Settings"
      subtitle="Keep your account safe and secure."
      onBack={onBack}
      aside={<SidePanel icon={ShieldHalf} title="Your Privacy Matters" desc="We follow best practices to keep your data safe and secure." glow="59,130,246" />}
    >
      <Card>
        <CardTitle>Password</CardTitle>
        <Row icon={KeyRound} title="Change your password" tone="text-indigo-300 bg-indigo-500/15 border-indigo-500/25">
          <PrimaryButton onClick={() => setPwOpen(true)}>Change Password</PrimaryButton>
        </Row>
        <Row icon={ShieldCheck} title="Two-Factor Authentication" desc="Add an extra layer of security to your account." tone="text-emerald-300 bg-emerald-500/15 border-emerald-500/25">
          <span className="hidden sm:inline px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Recommended</span>
          <Toggle checked={p.twoFactor} onChange={(v) => flip('twoFactor', v, 'Two-factor authentication')} label="Two-factor authentication" />
        </Row>
        <Row icon={History} title="Login Activity" desc="View your recent login activity and devices." tone="text-cyan-300 bg-cyan-500/15 border-cyan-500/25">
          <GhostButton onClick={() => setLogOpen(true)}>View Activity</GhostButton>
        </Row>
      </Card>

      <Card>
        <CardTitle>Data Privacy</CardTitle>
        {data.map((d) => (
          <Row key={d.k} icon={d.icon} title={d.title} tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
            <Toggle checked={p[d.k]} onChange={(v) => flip(d.k, v)} label={d.title} />
          </Row>
        ))}
      </Card>

      <Modal open={pwOpen} title="Change Password" onClose={() => setPwOpen(false)}>
        <div className="space-y-3">
          <Field label="Current password">
            <input type={show ? 'text' : 'password'} className={fieldClass} value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} autoComplete="current-password" />
          </Field>
          <Field label="New password (min 8 characters)">
            <input type={show ? 'text' : 'password'} className={fieldClass} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <input type={show ? 'text' : 'password'} className={fieldClass} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
          </Field>
          <button type="button" onClick={() => setShow(!show)} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white cursor-pointer">
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {show ? 'Hide' : 'Show'} passwords
          </button>
          <div className="flex justify-end gap-2 pt-1">
            <GhostButton onClick={() => setPwOpen(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={submitPw}>Update Password</PrimaryButton>
          </div>
        </div>
      </Modal>

      <Modal open={logOpen} title="Recent Login Activity" onClose={() => setLogOpen(false)}>
        <ul className="divide-y divide-[#122143]">
          {LOGINS.map((l) => (
            <li key={l.device} className="py-2.5">
              <p className="text-[13px] font-semibold text-slate-100">{l.device}</p>
              <p className="text-[11px] text-slate-400">{l.where} · {l.when}</p>
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-slate-500 mt-2">Sample data shown. Connect a real auth provider to list actual sessions.</p>
      </Modal>
    </SectionShell>
  );
};
