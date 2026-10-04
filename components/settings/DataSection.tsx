'use client';

import React, { useRef, useState } from 'react';
import { Cloud, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '../Toast';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from '@/lib/settings';
import { Card, CardTitle, GhostButton, Modal, PrimaryButton, Row, SectionShell, SidePanel } from './ui';
import type { SectionProps } from './types';

const TOTAL_GB = 5;

export const DataSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cache, setCache] = useState(0.4);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rows = [
    { label: 'Notes', gb: 1.2, color: '#3B82F6' },
    { label: 'Media Files', gb: 0.6, color: '#8B5CF6' },
    { label: 'Cache', gb: cache, color: '#06B6D4' },
    { label: 'Other', gb: 0.2, color: '#F59E0B' },
  ];
  const used = rows.reduce((a, r) => a + r.gb, 0);

  // Donut segments
  const R = 44;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const segs = rows.map((r) => {
    const len = (r.gb / TOTAL_GB) * C;
    const seg = { ...r, len, offset };
    offset += len;
    return seg;
  });

  const exportData = () => {
    const dump: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) dump[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings, storage: dump }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-buddy-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded', 'success');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object' || !data.settings || typeof data.storage !== 'object' || data.storage === null) throw new Error('bad');
        const storage = data.storage as Record<string, unknown>;
        for (const [key, value] of Object.entries(storage)) {
          if (!key || key.length > 200 || !/^[\w.-]+$/.test(key)) continue;
          if (value === null) localStorage.removeItem(key);
          else if (typeof value === 'string') localStorage.setItem(key, value);
        }
        update(() => ({ ...DEFAULT_SETTINGS, ...data.settings, profile: { ...DEFAULT_SETTINGS.profile, ...data.settings.profile }, notifications: { ...DEFAULT_SETTINGS.notifications, ...data.settings.notifications }, privacy: { ...DEFAULT_SETTINGS.privacy, ...data.settings.privacy }, advanced: { ...DEFAULT_SETTINGS.advanced, ...data.settings.advanced } }));
        showToast('Backup imported. Reloading your saved data...', 'success');
        window.setTimeout(() => window.location.reload(), 250);
      } catch {
        showToast('That file is not a valid Study Buddy backup.', 'info');
      }
    };
    reader.readAsText(file);
  };

  const deleteAll = () => {
    try {
      localStorage.clear();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      /* ignore */
    }
    update(() => DEFAULT_SETTINGS);
    setConfirmDelete(false);
    showToast('All local data deleted', 'success');
  };

  return (
    <SectionShell
      title="Data & Storage Settings"
      subtitle="Manage your data, storage usage and backup options."
      onBack={onBack}
      aside={<SidePanel icon={Cloud} title="Keep Your Data Safe" desc="Backup your data regularly and never lose your progress." glow="56,189,248" />}
    >
      <Card>
        <CardTitle
          right={
            <PrimaryButton
              onClick={() => {
                setCache(0);
                showToast('Cache cleared', 'success');
              }}
              disabled={cache === 0}
            >
              Clear Cache
            </PrimaryButton>
          }
        >
          Storage Usage
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" role="img" aria-label={`${used.toFixed(1)} GB used of ${TOTAL_GB} GB`}>
              <circle cx="50" cy="50" r={R} fill="none" stroke="#132247" strokeWidth="9" />
              {segs.map((s) => (
                <circle key={s.label} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="9" strokeDasharray={`${s.len} ${C - s.len}`} strokeDashoffset={-s.offset} />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{used.toFixed(1)} GB</span>
              <span className="text-[10px] text-slate-400">of {TOTAL_GB} GB</span>
            </div>
          </div>
          <ul className="w-full space-y-2.5">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} /> {r.label}
                </span>
                <span className="text-slate-100 font-semibold">{r.gb.toFixed(1)} GB</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Usage figures are sample values until cloud storage is connected.</p>
      </Card>

      <Card>
        <CardTitle>Data Management</CardTitle>
        <Row icon={Download} title="Export Your Data" desc="Download a copy of your notes and data." tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <PrimaryButton onClick={exportData}>Export</PrimaryButton>
        </Row>
        <Row icon={Upload} title="Import Data" desc="Import data from a backup file." tone="text-indigo-300 bg-indigo-500/15 border-indigo-500/25">
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} />
          <PrimaryButton onClick={() => fileRef.current?.click()}>Import</PrimaryButton>
        </Row>
        <Row icon={Trash2} title="Delete All Data" desc="Permanently delete all your data." tone="text-rose-300 bg-rose-500/15 border-rose-500/25">
          <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 shadow-[0_0_18px_rgba(244,63,94,0.4)] cursor-pointer">
            Delete
          </button>
        </Row>
      </Card>

      <Modal open={confirmDelete} title="Delete all data?" onClose={() => setConfirmDelete(false)}>
        <p className="text-xs text-slate-300 leading-relaxed">
          This permanently removes notes, tasks, settings and everything else stored in this browser. This cannot be undone. Consider exporting a backup first.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <GhostButton onClick={() => setConfirmDelete(false)}>Cancel</GhostButton>
          <button onClick={deleteAll} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer">
            Yes, delete everything
          </button>
        </div>
      </Modal>
    </SectionShell>
  );
};

