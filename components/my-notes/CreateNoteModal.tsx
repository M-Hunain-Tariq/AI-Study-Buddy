'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Pencil,
  BookOpen,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Undo2,
  Redo2,
  ChevronDown,
  Lock,
  Pin,
  Calendar,
  Save,
  AlertCircle,
  Tag,
  Loader2,
  Atom,
  Calculator,
  FlaskConical,
  BookMarked,
  Laptop,
  GraduationCap,
} from 'lucide-react';
import { StudyNote, NotePriority } from './types';
import { useToast } from '../Toast';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (noteData: {
    id?: string;
    title: string;
    subject: string;
    priority: NotePriority;
    tags: string[];
    content: string;
    isPrivate: boolean;
    isPinned: boolean;
    addToPlanner: boolean;
  }) => void;
  initialNote?: StudyNote | null;
}

const SUBJECT_OPTIONS = [
  { name: 'Mathematics', icon: Calculator, color: 'text-purple-400' },
  { name: 'Physics', icon: Atom, color: 'text-blue-400' },
  { name: 'Chemistry', icon: FlaskConical, color: 'text-emerald-400' },
  { name: 'English', icon: BookMarked, color: 'text-amber-400' },
  { name: 'Computer Science', icon: Laptop, color: 'text-cyan-400' },
  { name: 'General', icon: GraduationCap, color: 'text-indigo-400' },
];

interface DialogContentProps {
  onClose: () => void;
  onSaveNote: CreateNoteModalProps['onSaveNote'];
  initialNote?: StudyNote | null;
}

const CreateNoteModalDialog: React.FC<DialogContentProps> = ({
  onClose,
  onSaveNote,
  initialNote,
}) => {
  const { showToast } = useToast();

  // Form states cleanly initialized from initialNote
  const [title, setTitle] = useState(initialNote?.title || '');
  const [subject, setSubject] = useState(initialNote?.subject || 'Mathematics');
  const [priority, setPriority] = useState<NotePriority>(initialNote?.priority || 'Medium');
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState(initialNote?.content || '');
  const [isPrivate, setIsPrivate] = useState(initialNote?.isPrivate ?? false);
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned ?? false);
  const [addToPlanner, setAddToPlanner] = useState(initialNote?.addToPlanner ?? false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<{
    title?: string;
    subject?: string;
    content?: string;
  }>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key & scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Add tag handler
  const handleAddTag = (val: string) => {
    const trimmed = val.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    const newTags = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));

    if (newTags.length > 0) {
      setTags((prev) => [...prev, ...newTags]);
    }
    setTagInput('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Rich text formatting handler
  const handleFormat = (type: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';

    let formatted = selectedText;
    switch (type) {
      case 'bold':
        formatted = `**${selectedText}**`;
        break;
      case 'italic':
        formatted = `*${selectedText}*`;
        break;
      case 'underline':
        formatted = `<u>${selectedText}</u>`;
        break;
      case 'h1':
        formatted = `\n# ${selectedText}\n`;
        break;
      case 'h2':
        formatted = `\n## ${selectedText}\n`;
        break;
      case 'bullet':
        formatted = `\n• ${selectedText}\n`;
        break;
      case 'number':
        formatted = `\n1. ${selectedText}\n`;
        break;
      case 'link':
        formatted = `[${selectedText}](https://)`;
        break;
      case 'image':
        formatted = `![${selectedText}](image-url)`;
        break;
      case 'undo':
      case 'redo':
        showToast(`${type} action registered`, 'info');
        return;
    }

    const newContent = content.substring(0, start) + formatted + content.substring(end);
    setContent(newContent);
    showToast(`Applied ${type} format`, 'info');

    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  // AI Study Outline Generator
  const handleGenerateAiOutline = () => {
    const subjectPrefix = subject ? `${subject} ` : '';
    const titleContext = title.trim() ? `for "${title.trim()}"` : 'Template';

    const outlineTemplate = `📌 Key Concepts (${subjectPrefix}${titleContext}):
• Core principle: 
• Fundamental definitions & laws: 
• Scope & applications: 

📐 Important Formulas & Rules:
• Equation 1: 
• Derivation / Key step: 
• Crucial assumptions & constraints: 

💡 Practical Examples:
• Example Problem: 
• Step-by-step Solution: 
• Key takeaway from solution: 

⚡ Quick Revision & Exam Pitfalls:
• High-yield summary points: 
• Common student mistakes to avoid: 
• Expected question types: `;

    if (content.trim()) {
      setContent((prev) => `${prev.trim()}\n\n---\n${outlineTemplate}`);
    } else {
      setContent(outlineTemplate);
    }

    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }

    showToast('AI Study Outline inserted successfully! ✨', 'ai');
  };

  // Form submission & validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      title?: string;
      subject?: string;
      content?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a note title.';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Please select a subject.';
    }

    if (!content.trim()) {
      newErrors.content = 'Please write your note.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in all required fields.', 'info');
      return;
    }

    let finalTags = [...tags];
    if (tagInput.trim()) {
      const extraTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !finalTags.includes(t));
      finalTags = [...finalTags, ...extraTags];
    }

    setIsSaving(true);

    setTimeout(() => {
      onSaveNote({
        id: initialNote?.id,
        title: title.trim(),
        subject,
        priority,
        tags: finalTags,
        content: content.trim(),
        isPrivate,
        isPinned,
        addToPlanner,
      });

      setIsSaving(false);
      onClose();
      showToast(
        initialNote ? 'Note updated successfully!' : 'New note created successfully!',
        'success'
      );
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[94vw] sm:max-w-[88vw] md:max-w-2xl lg:max-w-[700px] max-h-[92vh] flex flex-col rounded-2xl bg-[#091124] border border-[#1E335C] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(59,130,246,0.18)] overflow-hidden text-slate-100 transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Glow Accent Ambient Top Bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent opacity-80" />

        {/* ========================================================
            HEADER
            ======================================================== */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#142240] bg-[#0A132C]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/25 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.45)] shrink-0">
              <FileText className="w-5 h-5 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{initialNote ? 'Edit Study Note' : 'Create New Note'}</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Save and organize key study knowledge
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142348] border border-transparent hover:border-[#1E325C] transition-all cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            SCROLLABLE BODY
            ======================================================== */}
        <form
          id="create-note-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-4.5 space-y-4 custom-scrollbar"
        >
          {/* 1. NOTE TITLE */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Note Title</span>
                <span className="text-rose-400">*</span>
              </label>
              <span
                className={`text-[11px] font-mono font-medium ${
                  title.length >= 95 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {title.length}/100
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Pencil className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Enter note title..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#060D1E] border text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-inner ${
                  errors.title
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-[#162544] hover:border-[#223862] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* 2 & 3. SUBJECT & PRIORITY ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. SUBJECT DROPDOWN */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Subject</span>
                  <span className="text-rose-400">*</span>
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#060D1E] border text-xs sm:text-sm text-white appearance-none cursor-pointer transition-all duration-200 shadow-inner focus:outline-none ${
                    errors.subject
                      ? 'border-rose-500/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-[#162544] hover:border-[#223862] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub.name} value={sub.name} className="bg-[#091124] text-white">
                      {sub.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.subject && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            {/* 3. PRIORITY SELECTABLE PILLS */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Low', 'Medium', 'High'] as NotePriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_0_14px_rgba(124,58,237,0.45)] border border-blue-400/50 scale-[1.02]'
                          : 'bg-[#060D1E] border border-[#162544] text-slate-400 hover:text-slate-200 hover:bg-[#0E1A38]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. TAGS (WITH ROUNDED CHIPS & REMOVE X) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span>Tags (optional)</span>
              </span>
            </label>

            <div className="rounded-xl bg-[#060D1E] border border-[#162544] p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 shadow-inner space-y-2">
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#132247] text-blue-300 border border-blue-500/40 shadow-sm animate-in fade-in zoom-in-90"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white p-0.5 rounded-full hover:bg-blue-600/30 transition-colors cursor-pointer"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={() => {
                    if (tagInput.trim()) handleAddTag(tagInput);
                  }}
                  placeholder={
                    tags.length === 0
                      ? 'Add tags (e.g. algebra, exam, revision...) — press Enter or comma'
                      : 'Type more tags & press Enter...'
                  }
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1"
                />
              </div>
            </div>
          </div>

          {/* 5 & 6. NOTE CONTENT & AI STUDY OUTLINE BUTTON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Note Content</span>
                <span className="text-rose-400">*</span>
              </label>

              {/* 6. AI STUDY OUTLINE BUTTON */}
              <button
                type="button"
                onClick={handleGenerateAiOutline}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] transition-all cursor-pointer active:scale-95"
                title="Generate high-yield study outline template"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>AI Study Outline</span>
              </button>
            </div>

            {/* Rich Text Editor Container */}
            <div
              className={`rounded-xl border bg-[#060D1E] overflow-hidden transition-all duration-200 shadow-inner ${
                errors.content
                  ? 'border-rose-500/80 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'border-[#162544] hover:border-[#223862] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
              }`}
            >
              <div className="flex flex-wrap items-center gap-0.5 p-1.5 sm:p-2 bg-[#091124] border-b border-[#142345] select-none">
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('underline')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-[#1A2C52] mx-1" />

                <button
                  type="button"
                  onClick={() => handleFormat('h1')}
                  className="px-1.5 py-1 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('h2')}
                  className="px-1.5 py-1 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Heading 2"
                >
                  H2
                </button>

                <div className="w-[1px] h-4 bg-[#1A2C52] mx-1" />

                <button
                  type="button"
                  onClick={() => handleFormat('bullet')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('number')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('link')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Insert Link"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('image')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Insert Image"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-[#1A2C52] mx-1" />

                <button
                  type="button"
                  onClick={() => handleFormat('undo')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Undo"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('redo')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12224A] transition-colors"
                  title="Redo"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Textarea */}
              <div className="relative p-3">
                <textarea
                  ref={textareaRef}
                  rows={7}
                  maxLength={2000}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                  }}
                  placeholder="Write your notes here..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed font-sans"
                />
                <div className="flex items-center justify-end text-[11px] text-slate-400 pt-1 font-mono">
                  <span className={content.length >= 1950 ? 'text-amber-400 font-bold' : ''}>
                    {content.length}/2000
                  </span>
                </div>
              </div>
            </div>
            {errors.content && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.content}</span>
              </p>
            )}
          </div>

          {/* 7. ADVANCED OPTIONS (COLLAPSED BY DEFAULT) */}
          <div className="border border-[#142345] rounded-xl bg-[#070E20] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Advanced Options</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Privacy, Pin & Study Planner)
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isAdvancedOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>

            {isAdvancedOpen && (
              <div className="p-3.5 pt-0 border-t border-[#121E38] space-y-3 mt-2 animate-in fade-in slide-in-from-top-2">
                {/* 1. Make this note private */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#091124] border border-[#162544]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Make this note private</p>
                      <p className="text-[10px] text-slate-400">Only you can view this note</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      isPrivate
                        ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                        : 'bg-[#121B35] border border-[#1D2B52]'
                    }`}
                    aria-label="Toggle private note"
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isPrivate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Pin to top */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#091124] border border-[#162544]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
                      <Pin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Pin to top</p>
                      <p className="text-[10px] text-slate-400">Keep this note at the top</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      isPinned
                        ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                        : 'bg-[#121B35] border border-[#1D2B52]'
                    }`}
                    aria-label="Toggle pin to top"
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isPinned ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Add to study planner */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#091124] border border-[#162544]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Add to study planner</p>
                      <p className="text-[10px] text-slate-400">
                        Sync with your weekly study schedule
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAddToPlanner(!addToPlanner)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      addToPlanner
                        ? 'bg-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                        : 'bg-[#121B35] border border-[#1D2B52]'
                    }`}
                    aria-label="Toggle add to planner"
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        addToPlanner ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* ========================================================
            8. FOOTER
            ======================================================== */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-[#142240] bg-[#0A132C]/90 backdrop-blur-sm shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#091124] hover:bg-[#12224A] border border-[#1A2D54] text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-note-form"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving Note...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
  initialNote,
}) => {
  if (!isOpen) return null;

  return (
    <CreateNoteModalDialog
      key={initialNote ? initialNote.id : 'new-note'}
      initialNote={initialNote}
      onClose={onClose}
      onSaveNote={onSaveNote}
    />
  );
};
