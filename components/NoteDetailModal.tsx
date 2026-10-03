'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Clock, BookOpen, Copy, Check } from 'lucide-react';
import { NoteItem } from '@/types/dashboard';
import { useToast } from './Toast';

interface NoteDetailModalProps {
  note: NoteItem | null;
  onClose: () => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ note, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!note) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note, onClose]);

  const handleCopy = () => {
    if (!note) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    }
    setCopied(true);
    showToast('Note copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {note && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#0E1526] border border-[#232F48] rounded-2xl p-4 sm:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{
                  backgroundColor:
                    note.color === 'emerald'
                      ? '#10B981'
                      : note.color === 'purple'
                      ? '#8B5CF6'
                      : note.color === 'cyan'
                      ? '#06B6D4'
                      : '#F59E0B'
                }}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{note.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    {note.subject}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {note.timeAgo}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-5 p-4 rounded-xl bg-[#141B2D] border border-[#232F48]/60 text-slate-200 text-sm leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
            {note.content}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Note'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
