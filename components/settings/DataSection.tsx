'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Cloud, Download, RefreshCw, Upload, Trash2 } from 'lucide-react';
import { useToast } from '../Toast';
import { DEFAULT_SETTINGS, sanitizeSettings, SETTINGS_KEY } from '@/lib/settings';
import { isStudyBuddyStorageKey, removeStudyBuddyStorage } from '@/lib/storage';
import { Card, CardTitle, GhostButton, Modal, PrimaryButton, Row, SectionShell, SidePanel } from './ui';
import type { SectionProps } from './types';

type Usage = { notes: number; media: number; cache: number; other: number; total: number; entries: number };

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const DataSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const refreshUsage = useCallback(() => {
    const next: Usage = { notes: 0, media: 0, cache: 0, other: 0, total: 0, entries: 0 };
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !isStudyBuddyStorageKey(key)) continue;
        const value = localStorage.getItem(key) ?? '';
        const bytes = new Blob([key, value]).size;
        next.total += bytes;
        next.entries += 1;
        if (key === 'study_notes_v5') next.notes += bytes;
        else if (/media|attachment|file/i.test(key)) next.media += bytes;
        else if (/cache/i.test(key)) next.cache += bytes;
        else next.other += bytes;
      }
    } catch {
      // Storage may be disabled; show the last measured value when available.
      return;
    }
    setUsage(next);
  }, []);

  useEffect(() => {
    refreshUsage();
    window.addEventListener('storage', refreshUsage);
    return () => window.removeEventListener('storage', refreshUsage);
  }, [refreshUsage]);

  const rows = [
    { label: 'Notes', bytes: usage?.notes ?? 0, color: '#3B82F6' },
    { label: 'Media Files', bytes: usage?.media ?? 0, color: '#2563EB' },
    { label: 'Cache', bytes: usage?.cache ?? 0, color: '#38BDF8' },
    { label: 'Other', bytes: usage?.other ?? 0, color: '#60A5FA' },
  ];
  const usedBytes = usage?.total ?? 0;
  const chartTotal = usedBytes || 1;

  // Donut segments are proportional to the actual StudyBuddy localStorage footprint.
  const R = 44;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const segs = rows.map((r) => {
    const len = (r.bytes / chartTotal) * C;
    const seg = { ...r, len, offset };
    offset += len;
    return seg;
  });

  const exportData = () => {
    const dump: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && isStudyBuddyStorageKey(k)) dump[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings, storage: dump }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-buddy-backup.json';
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Backup downloaded', 'success');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Backup file is too large. Maximum supported size is 10 MB.', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object' || Array.isArray(data) || !data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings) || typeof data.storage !== 'object' || data.storage === null || Array.isArray(data.storage)) throw new Error('bad');
        const storage = data.storage as Record<string, unknown>;
        for (const [key, value] of Object.entries(storage)) {
          if (!key || key.length > 200 || !isStudyBuddyStorageKey(key) || !/^[\w.-]+$/.test(key)) continue;
          if (value === null) localStorage.removeItem(key);
          else if (typeof value === 'string' && new Blob([value]).size <= 2 * 1024 * 1024) localStorage.setItem(key, value);
        }
        update(() => sanitizeSettings(data.settings));
        refreshUsage();
        showToast('Backup imported. Reloading your saved data...', 'success');
        window.setTimeout(() => window.location.reload(), 250);
      } catch {
        showToast('That file is not a valid Study Buddy backup.', 'info');
      }
    };
    reader.onerror = () => showToast('Could not read this backup file.', 'info');
    reader.readAsText(file);
  };

  const deleteAll = () => {
    try {
      // Remove only this app's keys; localStorage is shared by the whole origin.
      removeStudyBuddyStorage(localStorage);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      /* ignore */
    }
    update(() => DEFAULT_SETTINGS);
    refreshUsage();
    setConfirmDelete(false);
    showToast('All StudyBuddy data deleted', 'success');
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
            <PrimaryButton onClick={refreshUsage}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
            </PrimaryButton>
          }
        >
          Storage Usage
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" role="img" aria-label={`${formatBytes(usedBytes)} of StudyBuddy data stored in this browser`}>
              <circle cx="50" cy="50" r={R} fill="none" stroke="#132247" strokeWidth="9" />
              {segs.map((segment) => (
                <circle key={segment.label} cx="50" cy="50" r={R} fill="none" stroke={segment.color} strokeWidth="9" strokeDasharray={`${segment.len} ${C - segment.len}`} strokeDashoffset={-segment.offset} />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{formatBytes(usedBytes)}</span>
              <span className="text-[10px] text-slate-400">local data</span>
            </div>
          </div>
          <ul className="w-full space-y-2.5">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: row.color }} /> {row.label}
                </span>
                <span className="text-slate-100 font-semibold">{formatBytes(row.bytes)}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Measured from StudyBuddy data stored in this browser ({usage?.entries ?? 0} items). This is not a cloud-storage quota.</p>
      </Card>

      <Card>
        <CardTitle>Data Management</CardTitle>
        <Row icon={Download} title="Export Your Data" desc="Download a copy of your notes and data." tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <PrimaryButton onClick={exportData}>Export</PrimaryButton>
        </Row>
        <Row icon={Upload} title="Import Data" desc="Import data from a backup file." tone="text-blue-300 bg-blue-500/15 border-blue-500/25">
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} />
          <PrimaryButton onClick={() => fileRef.current?.click()}>Import</PrimaryButton>
        </Row>
        <Row icon={Trash2} title="Delete All Data" desc="Permanently delete all your data." tone="text-rose-300 bg-rose-500/15 border-rose-500/25">
          <button onClick={() => setConfirmDelete(true)} className="st-btn px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-blue-600 shadow-[0_0_18px_rgba(244,63,94,0.4)] cursor-pointer">
            Delete
          </button>
        </Row>
      </Card>

      <Modal open={confirmDelete} title="Delete all StudyBuddy data?" onClose={() => setConfirmDelete(false)}>
        <p className="text-xs text-slate-300 leading-relaxed">
          This permanently removes StudyBuddy notes, tasks, plans, settings and saved data from this browser. Data belonging to other websites is not affected. This cannot be undone. Consider exporting a backup first.
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

