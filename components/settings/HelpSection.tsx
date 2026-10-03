'use client';

import React, { useState } from 'react';
import { ChevronDown, Headphones, MessageCircle, Mail, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../Toast';
import { Card, CardTitle, GhostButton, PrimaryButton, SectionShell, SidePanel } from './ui';
import type { SectionProps } from './types';

const FAQ = [
  { q: 'How to create a new note?', a: 'Open My Notes from the sidebar and choose Create Note. Add a title, subject and content, then save. You can also ask the AI Tutor to turn a chat into a note.' },
  { q: 'How to use AI Tutor?', a: 'Go to AI Tutor, type a question or pick a suggested topic, and the tutor replies step by step. Ask follow-ups to go deeper on anything unclear.' },
  { q: 'How to set up study planner?', a: 'In Study Planner, add tasks and goals for each day, or use the AI plan generator to build a weekly schedule from your subjects and available time.' },
  { q: 'How to export my data?', a: 'Open Settings, then Data & Storage, and choose Export. A JSON backup downloads to your device and can be re-imported later.' },
  { q: 'Account and security questions?', a: 'Manage your password, two-factor authentication and login activity under Privacy & Security. Contact support if you cannot access your account.' },
];

export const HelpSection: React.FC<SectionProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell
      title="Help & Support"
      subtitle="Find answers, get help and contact our support team."
      onBack={onBack}
      aside={
        <SidePanel icon={Headphones} title="We're Here to Help" desc="Get quick answers to your questions or contact our support team." glow="59,130,246" image={
          <div className="relative mt-5 w-full space-y-2">
            <PrimaryButton className="w-full inline-flex items-center justify-center gap-1.5" onClick={() => router.push('/ai-tutor')}>
              <MessageCircle className="w-3.5 h-3.5" /> Live Chat
            </PrimaryButton>
            <p className="flex items-center justify-center gap-1 text-[10px] text-slate-500"><Clock className="w-3 h-3" /> Usually responds in minutes</p>
          </div>
        } />
      }
    >
      <Card>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <ul className="divide-y divide-[#122143]">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <button
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 py-3 text-left text-[13px] text-slate-100 hover:text-white cursor-pointer"
              >
                {f.q}
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="pb-3 text-xs text-slate-400 leading-relaxed">{f.a}</p>}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Contact Support</CardTitle>
        <p className="text-xs text-slate-400 mb-3">Need more help? Our support team is here for you.</p>
        <a href="mailto:support@example.com?subject=AI%20Study%20Buddy%20support" onClick={() => showToast('Opening your email app…', 'info')}>
          <GhostButton className="inline-flex items-center gap-1.5" tabIndex={-1}>
            <Mail className="w-3.5 h-3.5" /> Contact Us
          </GhostButton>
        </a>
      </Card>
    </SectionShell>
  );
};
