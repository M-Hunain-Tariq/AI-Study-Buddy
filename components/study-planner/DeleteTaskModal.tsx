'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
  taskSubject: string;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  taskSubject,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-[#081028] border border-[#23355C] p-4 sm:p-6 shadow-2xl text-slate-100"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Delete Study Task?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete this study task? This action will remove it from your schedule and recalculate your daily progress.
          </p>
          <div className="p-2.5 rounded-xl bg-[#0C1736] border border-[#1B2F57] text-xs">
            <p className="font-semibold text-white truncate">{taskSubject}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{taskTitle}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F1B3D] hover:bg-[#152554] border border-[#1F335C] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
