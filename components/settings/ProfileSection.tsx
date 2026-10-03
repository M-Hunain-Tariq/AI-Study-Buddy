'use client';

import React, { useRef, useState } from 'react';
import { Camera, Pencil, Check } from 'lucide-react';
import { useToast } from '../Toast';
import { Card, CardTitle, Field, GhostButton, PrimaryButton, SectionShell, fieldClass } from './ui';
import type { SectionProps } from './types';

const COUNTRIES = ['Pakistan', 'India', 'United States', 'United Kingdom', 'Canada', 'South Korea', 'Other'];
const LEVELS = ['Middle School', 'High School', 'Undergraduate', 'Graduate', 'Self-learner'];

export const ProfileSection: React.FC<SectionProps> = ({ settings, update, onBack }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(settings.profile);
  const fileRef = useRef<HTMLInputElement>(null);
  const p = editing ? draft : settings.profile;

  const set = (k: keyof typeof draft, v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const startEdit = () => {
    setDraft(settings.profile);
    setEditing(true);
  };

  const save = () => {
    if (!draft.name.trim()) return showToast('Please enter your name.', 'info');
    if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) return showToast('That email address looks invalid.', 'info');
    update((s) => ({ ...s, profile: draft }));
    setEditing(false);
    showToast('Profile updated', 'success');
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) return showToast('Please choose a JPG or PNG image.', 'info');
    if (file.size > 2 * 1024 * 1024) return showToast('Image must be 2MB or smaller.', 'info');
    const reader = new FileReader();
    reader.onload = () => {
      const photo = String(reader.result);
      update((s) => ({ ...s, profile: { ...s.profile, photo } }));
      setDraft((d) => ({ ...d, photo }));
      showToast('Profile photo updated', 'success');
    };
    reader.readAsDataURL(file);
  };

  const avatar = (size: string, text: string) => (
    <div
      className={`${size} rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-[0_0_28px_rgba(147,51,234,0.5)] ring-2 ring-indigo-400/40 shrink-0 ${text}`}
    >
      {settings.profile.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.profile.photo} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        (p.name.trim()[0] || 'M').toUpperCase()
      )}
    </div>
  );

  return (
    <SectionShell
      title="Profile Settings"
      subtitle="Manage your personal information and account details."
      onBack={onBack}
      action={
        editing ? (
          <div className="flex gap-2">
            <GhostButton onClick={() => setEditing(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={save} className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Save
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton onClick={startEdit} className="inline-flex items-center gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </PrimaryButton>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 sm:gap-5 items-start">
        <Card>
          <div className="flex items-center gap-4 pb-4 border-b border-[#122143]">
            {avatar('w-14 h-14', 'text-xl')}
            <div className="min-w-0">
              <p className="text-base font-bold text-white truncate">{settings.profile.name}</p>
              <p className="text-xs text-indigo-300 truncate">{settings.profile.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Student
              </span>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-white mt-4 mb-3">Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name">
              <input className={fieldClass} disabled={!editing} value={p.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Email Address">
              <input type="email" className={fieldClass} disabled={!editing} value={p.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Phone Number">
              <input type="tel" className={fieldClass} disabled={!editing} value={p.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label="Date of Birth">
              <input type="date" className={`${fieldClass} [color-scheme:dark]`} disabled={!editing} value={p.dob} onChange={(e) => set('dob', e.target.value)} />
            </Field>
            <Field label="Country">
              <select className={fieldClass} disabled={!editing} value={p.country} onChange={(e) => set('country', e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Student Level">
              <select className={fieldClass} disabled={!editing} value={p.level} onChange={(e) => set('level', e.target.value)}>
                {LEVELS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <div className="space-y-4 sm:space-y-5">
          <Card>
            <CardTitle>Profile Picture</CardTitle>
            <div className="flex flex-col items-center gap-3 py-2">
              {avatar('w-24 h-24', 'text-4xl')}
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onPhoto} />
              <GhostButton onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Change Photo
              </GhostButton>
              <p className="text-[10px] text-slate-500">JPG, PNG (max 2MB)</p>
            </div>
          </Card>
          <Card>
            <CardTitle>Bio</CardTitle>
            <textarea
              className={`${fieldClass} h-28 resize-none`}
              placeholder="Tell us about yourself..."
              maxLength={200}
              disabled={!editing}
              value={p.bio}
              onChange={(e) => set('bio', e.target.value)}
            />
            <p className="text-right text-[10px] text-slate-500 mt-1">{p.bio.length}/200</p>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
};
