'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, History, Sparkles, Share2, BarChart3, ShieldHalf } from 'lucide-react';
import { useToast } from '../Toast';
import { Card, CardTitle, GhostButton, Modal, PrimaryButton, Row, SectionShell, SidePanel, Toggle } from './ui';
import type { SectionProps } from './types';

const LOGINS: { device: string; where: string; when: string }[] = [];

export const PrivacySection: React.FC<SectionProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [logOpen, setLogOpen] = useState(false);

  const data: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[] = [
    { icon: Sparkles, title: 'Allow personalized recommendations', desc: 'Recommendation controls are not connected in this build.' },
    { icon: Share2, title: 'Share usage data for improvements', desc: 'No usage-sharing or telemetry service is connected.' },
    { icon: BarChart3, title: 'Allow analytics', desc: 'No analytics provider is connected in this build.' },
  ];

  return (
    <SectionShell
      title="Privacy & Security Settings"
      subtitle="Review the privacy and security features available in this build."
      onBack={onBack}
      aside={<SidePanel icon={ShieldHalf} title="Your Privacy Matters" desc="Account security controls require a connected authentication provider." glow="59,130,246" />}
    >
      <Card>
        <CardTitle>Password</CardTitle>
        <Row icon={KeyRound} title="Change your password" desc="Unavailable until account authentication is connected." tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <PrimaryButton onClick={() => showToast('Password changes are unavailable until account authentication is connected.', 'info')}>Change Password</PrimaryButton>
        </Row>
        <Row icon={ShieldCheck} title="Two-Factor Authentication" desc="Unavailable until account authentication is connected." tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <span className="hidden sm:inline px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">Not connected</span>
          <Toggle checked={false} onChange={() => {}} disabled label="Two-factor authentication unavailable" />
        </Row>
        <Row icon={History} title="Login Activity" desc="View your recent login activity and devices." tone="text-cyan-300 bg-cyan-500/15 border-cyan-500/25">
          <GhostButton onClick={() => setLogOpen(true)}>View Activity</GhostButton>
        </Row>
      </Card>

      <Card>
        <CardTitle>Data Privacy</CardTitle>
        {data.map((d) => (
          <Row key={d.title} icon={d.icon} title={d.title} desc={d.desc} tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
            <Toggle checked={false} onChange={() => {}} disabled label={`${d.title} unavailable`} />
          </Row>
        ))}
      </Card>

      <Modal open={logOpen} title="Recent Login Activity" onClose={() => setLogOpen(false)}>
        {LOGINS.length > 0 ? (
          <ul className="divide-y divide-[#122143]">
            {LOGINS.map((l) => (
              <li key={l.device} className="py-2.5">
                <p className="text-[13px] font-semibold text-slate-100">{l.device}</p>
                <p className="text-[11px] text-slate-400">{l.where} · {l.when}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-[#1A2D54] p-5 text-center">
            <p className="text-sm font-semibold text-slate-200">No login activity yet</p>
            <p className="mt-1 text-[11px] text-slate-400">Actual sessions will appear here when authentication is connected.</p>
          </div>
        )}
      </Modal>
    </SectionShell>
  );
};
