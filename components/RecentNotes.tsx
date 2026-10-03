'use client';

import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { NoteItem } from '@/types/dashboard';
import { useToast } from './Toast';
import { useRouter } from 'next/navigation';

interface RecentNotesProps {
  onSelectNote: (note: NoteItem) => void;
  onViewAll?: () => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({ onSelectNote, onViewAll }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const notes: NoteItem[] = [
    {
      id: '1',
      title: 'Algebra Formulas',
      subject: 'Mathematics',
      timeAgo: '2 hours ago',
      color: 'teal',
      content:
        'Essential Quadratic & Linear Equations:\n• Slope formula: m = (y₂ - y₁) / (x₂ - x₁)\n• Slope-Intercept: y = mx + b\n• Point-Slope: y - y₁ = m(x - x₁)\n• Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)'
    },
    {
      id: '2',
      title: 'Cell Structure',
      subject: 'Biology',
      timeAgo: '4 hours ago',
      color: 'purple',
      content:
        'Key Organelles & Roles:\n• Nucleus: Houses genetic material (DNA).\n• Mitochondria: Powerhouse of the cell, generates ATP via cellular respiration.\n• Ribosomes: Synthesizes proteins.\n• Endoplasmic Reticulum: Rough & Smooth.'
    },
    {
      id: '3',
      title: 'Essay Outline',
      subject: 'English',
      timeAgo: 'Yesterday',
      color: 'amber',
      content:
        'Macbeth Essay Theme — Ambition & Moral Decay:\nI. Introduction: Thesis on unchecked ambition leading to destruction.\nII. Body Paragraph 1: The Witches prophecies as catalysts.\nIII. Conclusion: Shakespeare warning against hubris.'
    }
  ];

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300 h-full min-h-[300px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center shadow-inner">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Recent Notes
          </h3>
        </div>

        <button
          onClick={() => {
            if (onViewAll) onViewAll();
            else router.push('/my-notes');
          }}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* Note List matching Image 1 */}
      <div className="mt-2 divide-y divide-[#142240] space-y-1">
        {notes.map((note) => {
          const iconColor =
            note.color === 'teal'
              ? 'bg-[#0E3446] text-teal-400 shadow-inner'
              : note.color === 'purple'
              ? 'bg-[#251B48] text-purple-400 shadow-inner'
              : 'bg-[#362610] text-amber-400 shadow-inner';

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="group cursor-pointer flex items-center justify-between py-2.5 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-semibold text-white transition-colors truncate">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {note.subject} • {note.timeAgo}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNote(note);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                aria-label={`Options for note ${note.title}`}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
