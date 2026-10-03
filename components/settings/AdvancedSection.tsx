'use client';

import React, { useState } from 'react';
import { Settings2, Bug, Box, Sparkles, CalendarClock, RotateCcw, Eraser } from 'lucide-react';
import { useToast } from '../Toast';
import { DEFAULT_SETTINGS, SETTINGS_KEY, type AppSettings } from '@/lib/settings';
import { Card, CardTitle, GhostButton, Modal, Row, SectionShell, SidePanel, Toggle } from './ui';
import type { SectionProps } from './types';

export const AdvancedSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const a = settings.advanced;
  const [confirm, setConfirm] = useState<null | 'reset' | 'clear'>(null);
  const flip = (k: keyof AppSettings['advanced'], v: boolean) => update((s) => ({ ...s, advanced: { ...s.advanced, [k]: v } }));

  const run = () => {
    if (confirm === 'reset') {
      update(() => DEFAULT_SETTINGS);
      showToast('Settings restored to defaults', 'success');
    } else if (confirm === 'clear') {
      try {
        localStorage.clear();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        /* ignore */
      }
      showToast('Local storage cleared (settings kept)', 'success');
    }
    setConfirm(null);
  };

  return (
    <SectionShell
      title="Advanced Settings"
      subtitle="Access developer options, experimental features and advanced configuration."
      onBack={onBack}
      aside={<SidePanel icon={Settings2} title="Advanced Settings" desc="Use these options only if you know what you're doing." glow="99,102,241" />}
    >
      <Card>
        <CardTitle>Developer Options</CardTitle>
        <Row icon={Bug} title="Enable debug mode" desc="Show developer logs in the browser console" tone="text-slate-300 bg-slate-500/15 border-slate-500/25">
          <Toggle checked={a.debug} onChange={(v) => flip('debug', v)} label="Enable debug mode" />
        </Row>
        <Row icon={Box} title="Show component boundaries" desc="Highlight React component boundaries" tone="text-slate-300 bg-slate-500/15 border-slate-500/25">
          <Toggle checked={a.boundaries} onChange={(v) => flip('boundaries', v)} label="Show component boundaries" />
        </Row>
      </Card>
      <Card>
        <CardTitle>Experimental Features</CardTitle>
        <p className="text-[11px] text-slate-500 -mt-2 mb-1">Try new features before they are released.</p>
        <Row icon={Sparkles} title="AI Suggestions (Beta)" desc="Get AI-powered study suggestions" tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <Toggle checked={a.aiSuggestions} onChange={(v) => flip('aiSuggestions', v)} label="AI Suggestions" />
        </Row>
        <Row icon={CalendarClock} title="Smart Study Plan (Beta)" desc="Automatically create study plans" tone="text-purple-300 bg-purple-500/15 border-purple-500/25">
          <Toggle checked={a.smartPlan} onChange={(v) => flip('smartPlan', v)} label="Smart Study Plan" />
        </Row>
      </Card>
      <Card>
        <CardTitle>Reset & Maintenance</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => setConfirm('reset')} className="rounded-xl border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 p-4 text-center cursor-pointer transition-colors">
            <RotateCcw className="w-4 h-4 mx-auto text-blue-300" />
            <p className="text-sm font-semibold text-blue-200 mt-1.5">Reset Settings</p>
            <p className="text-[10px] text-slate-400">Restore default settings</p>
          </button>
          <button onClick={() => setConfirm('clear')} className="rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 p-4 text-center cursor-pointer transition-colors">
            <Eraser className="w-4 h-4 mx-auto text-rose-300" />
            <p className="text-sm font-semibold text-rose-200 mt-1.5">Clear Local Storage</p>
            <p className="text-[10px] text-slate-400">Remove all local data</p>
          </button>
        </div>
      </Card>

      <Modal open={confirm !== null} title={confirm === 'reset' ? 'Reset all settings?' : 'Clear local storage?'} onClose={() => setConfirm(null)}>
        <p className="text-xs text-slate-300 leading-relaxed">
          {confirm === 'reset'
            ? 'Profile, appearance, notification and privacy preferences go back to their defaults.'
            : 'Notes, tasks and other data saved in this browser will be removed. Your settings are kept. This cannot be undone.'}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <GhostButton onClick={() => setConfirm(null)}>Cancel</GhostButton>
          <button onClick={run} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer">Confirm</button>
        </div>
      </Modal>
    </SectionShell>
  );
};
