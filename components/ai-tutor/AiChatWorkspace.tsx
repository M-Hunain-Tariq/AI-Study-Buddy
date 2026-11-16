'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  ArrowUp, Bot, BookOpen, Brain, Calculator, Check, ChevronDown, Copy, FileText,
  Lightbulb, MessageSquare, Paperclip, Plus, Sparkles, Wrench, X, Zap,
} from 'lucide-react';
import { normalizeSavedChatHistory } from '@/lib/ai/chat-history';
import type { SavedChat } from '@/lib/ai/chat-history';
import { QUICK_PROMPTS, STUDY_TOOLS, SUPPORTED_FILE_ACCEPT, SUPPORTED_FILE_HELP, TUTOR_MODES } from '@/lib/ai/tutor-presets';
import type { TutorMode } from '@/lib/ai/tutor-presets';
import { useToast } from '../Toast';
import { MarkdownText } from './MarkdownText';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AiChatWorkspaceProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedChat?: SavedChat | null;
  onClearSelectedChat?: () => void;
  showQuickPrompts?: boolean;
}

type Attachment = { name: string; mimeType: string; data: string; textContent?: string };
const HISTORY_KEY = 'studybuddy_ai_chat_history';
const TEXT_EXT = new Set(['txt', 'md', 'mdx', 'csv', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'xml', 'yaml', 'yml']);

function readHistory(): SavedChat[] {
  try {
    return normalizeSavedChatHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  } catch {
    return [];
  }
}

export const AiChatWorkspace: React.FC<AiChatWorkspaceProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  fileInputRef,
  selectedChat,
  onClearSelectedChat,
  showQuickPrompts = true,
}) => {
  const [tutorMode, setTutorMode] = useState<TutorMode>('Ask Anything');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreTab, setExploreTab] = useState<'prompts' | 'tools'>('prompts');
  const { showToast } = useToast();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(1);
  const chatIdRef = useRef(`chat-${Date.now()}`);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPrompt) setInputQuestion(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (!selectedChat) return;
    chatIdRef.current = selectedChat.id;
    setMessages(selectedChat.messages.map((message) => ({
      id: `loaded-${messageCounterRef.current++}`,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp || 'Previous conversation',
    })));
    setInputQuestion('');
    setAttachment(null);
    setTutorMode('Ask Anything');
    setExploreOpen(false);
    onClearSelectedChat?.();
    showToast('Conversation opened.', 'success');
  }, [selectedChat, onClearSelectedChat, showToast]);

  useEffect(() => {
    if (messages.length > 0) chatBottomRef.current?.scrollIntoView({ behavior: isAiThinking ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isAiThinking]);

  useEffect(() => {
    if (!messages.length || isAiThinking) return;
    try {
      const firstUserMessage = messages.find((message) => message.sender === 'user')?.text || 'Study conversation';
      const entry: SavedChat = {
        id: chatIdRef.current,
        title: firstUserMessage.replace(/\s+/g, ' ').slice(0, 54),
        updatedAt: new Date().toLocaleString(),
        messages: messages.slice(-14).map(({ sender, text, timestamp }) => ({ sender, text: text.slice(0, 6000), timestamp })),
      };
      const next = normalizeSavedChatHistory([entry, ...readHistory().filter((chat) => chat.id !== entry.id)]);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('studybuddy-chat-history-updated'));
    } catch { /* local storage may be unavailable */ }
  }, [messages, isAiThinking]);

  const startNewChat = () => {
    if (isAiThinking) return;
    chatIdRef.current = `chat-${Date.now()}`;
    setMessages([]);
    setInputQuestion('');
    setAttachment(null);
    setTutorMode('Ask Anything');
    setExploreOpen(false);
    onClearInitialPrompt?.();
  };

  const loadPrompt = (prompt: string) => {
    setInputQuestion(prompt);
    setExploreOpen(false);
    onClearInitialPrompt?.();
    window.setTimeout(() => inputRef.current?.focus(), 60);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied answer to clipboard.', 'success');
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      showToast('Could not copy. Select the text and copy it manually.', 'info');
    }
  };

  const saveNote = (messageIndex: number) => {
    const answer = messages[messageIndex];
    if (!answer || answer.sender !== 'ai' || !answer.text.trim()) return;
    const question = [...messages.slice(0, messageIndex)].reverse().find((message) => message.sender === 'user')?.text.replace(/\n\n📎 .*$/, '') || 'AI answer';
    try {
      const existing = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const now = Date.now();
      const note = {
        id: `ai-note-${now}`,
        title: `AI: ${question}`.slice(0, 60),
        subject: 'AI Tutor',
        color: 'blue',
        content: answer.text,
        excerpt: answer.text.slice(0, 140) + (answer.text.length > 140 ? '…' : ''),
        lastEdited: 'Just now',
        lastEditedTimestamp: now,
        priority: 'Medium',
        tags: ['AI Tutor'],
        isPrivate: false,
        isPinned: false,
        addToPlanner: false,
      };
      localStorage.setItem('study_notes_v5', JSON.stringify([note, ...(Array.isArray(existing) ? existing : [])]));
      showToast('Answer saved to My Notes.', 'success');
    } catch {
      showToast('Could not save this answer.', 'info');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputQuestion).trim();
    if ((!text && !attachment) || isAiThinking) return;
    const promptText = text || 'Please analyze the uploaded file and explain its key points.';
    const userMessage: Message = {
      id: `user-${messageCounterRef.current++}`,
      sender: 'user',
      text: attachment ? `${promptText}\n\n📎 ${attachment.name}` : promptText,
      timestamp: 'Just now',
    };
    const history = [...messages, userMessage].map((message) => ({
      sender: message.sender,
      text: message.sender === 'user' ? message.text.replace(/\n\n📎 .*$/, '') : message.text,
    }));

    let learningContext = '';
    try {
      const name = localStorage.getItem('studybuddy_user_name') || 'Student';
      const notes = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const tasks = JSON.parse(localStorage.getItem('study_tasks_v4') || '[]');
      const quizHistory = JSON.parse(localStorage.getItem('study_quiz_history_v1') || '[]');
      const preferredLanguage = localStorage.getItem('studybuddy_ai_language') || 'English';
      const recentScores = Array.isArray(quizHistory)
        ? quizHistory.slice(0, 5).map((quiz: { subject?: unknown; score?: unknown }) => `${String(quiz?.subject ?? 'Quiz')}: ${Number(quiz?.score) || 0}%`).join(', ')
        : '';
      learningContext = `Student: ${name}. Recent quiz results: ${recentScores || 'none'}. Notes available: ${Array.isArray(notes) ? notes.length : 0}. Tasks available: ${Array.isArray(tasks) ? tasks.length : 0}. Assistant mode: ${tutorMode}. Preferred response language: ${preferredLanguage}. Reply in this language unless the student asks otherwise.`;
    } catch { /* optional student context */ }

    const sentAttachment = attachment;
    setMessages((previous) => [...previous, userMessage]);
    setInputQuestion('');
    setAttachment(null);
    onClearInitialPrompt?.();
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          context: learningContext,
          mode: tutorMode,
          attachment: sentAttachment ? {
            name: sentAttachment.name,
            mimeType: sentAttachment.mimeType,
            data: sentAttachment.data,
            textContent: sentAttachment.textContent,
          } : undefined,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'The AI could not answer right now.');
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('The AI could not answer right now.');
      const decoder = new TextDecoder();
      const aiId = `ai-${messageCounterRef.current++}`;
      let received = '';
      let displayed = '';
      let created = false;
      const reveal = async (incoming: string) => {
        if (!incoming) return;
        const pieces = incoming.match(/\S+\s*|\s+/g) || [incoming];
        for (const piece of pieces) {
          displayed += piece;
          if (!created) {
            created = true;
            setMessages((previous) => [...previous, { id: aiId, sender: 'ai', text: displayed, timestamp: 'Just now' }]);
          } else {
            const snapshot = displayed;
            setMessages((previous) => previous.map((message) => message.id === aiId ? { ...message, text: snapshot } : message));
          }
          await new Promise<void>((resolve) => window.setTimeout(resolve, 9));
        }
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        received += chunk;
        await reveal(chunk);
      }
      const remainder = decoder.decode();
      if (remainder) {
        received += remainder;
        await reveal(remainder);
      }
      if (!received.trim()) throw new Error('The AI returned an empty answer. Please try again.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The AI could not answer right now.';
      setMessages((previous) => [...previous, { id: `ai-${messageCounterRef.current++}`, sender: 'ai', text: `⚠️ ${message}`, timestamp: 'Just now' }]);
      showToast('AI Tutor could not answer.', 'info');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleFilePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const isImage = imageTypes.includes(file.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(extension);
    const isPdf = file.type === 'application/pdf' || extension === 'pdf';
    const isText = file.type.startsWith('text/') || file.type === 'application/json' || TEXT_EXT.has(extension);
    if (!isImage && !isPdf && !isText) {
      showToast('Supported files: PNG, JPG, WEBP, PDF, TXT, MD, CSV, JSON and code files.', 'info');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast('File is too large. Maximum upload size is 4 MB.', 'info');
      return;
    }
    if (isText) {
      try {
        const content = await file.text();
        if (!content.trim()) return showToast('This file is empty.', 'info');
        if (content.length > 50000) return showToast('Text files must be under 50,000 characters.', 'info');
        setAttachment({ name: file.name, mimeType: 'text/plain', data: '', textContent: content });
        showToast('File attached. Add a question or send it for a summary.', 'success');
      } catch {
        showToast('Could not read this text file.', 'info');
      }
      return;
    }
    const fallbackMime = extension === 'png' ? 'image/png' : ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' : 'image/webp';
    const mimeType = isPdf ? 'application/pdf' : imageTypes.includes(file.type) ? file.type : fallbackMime;
    const reader = new FileReader();
    reader.onerror = () => showToast('Could not read this file. Please try again.', 'info');
    reader.onload = () => {
      const base64 = String(reader.result || '').split(',')[1];
      if (base64) {
        setAttachment({ name: file.name, mimeType, data: base64 });
        showToast('File attached. Add a question or send it for a summary.', 'success');
      } else {
        showToast('Could not read this file. Please try again.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSendMessage();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[24px] border border-[#1D3154] bg-[linear-gradient(160deg,rgba(10,22,43,0.98),rgba(6,15,31,0.99))] shadow-[0_22px_55px_rgba(0,0,0,0.28)]" aria-label="AI Tutor chat workspace">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-cyan-200">
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white sm:text-[15px]">Study conversation</h2>
            <p className="mt-0.5 text-[10px] text-slate-400">Ask, explore, and learn in one place</p>
          </div>
          <span className="ml-1 hidden items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-medium text-emerald-200 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Ready
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => { setExploreTab('prompts'); setExploreOpen(true); }} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-blue-300/15 bg-blue-500/[0.07] px-3 text-[11px] font-semibold text-blue-100 transition hover:border-blue-300/35 hover:bg-blue-500/[0.13]">
            <Sparkles className="h-3.5 w-3.5" /> Explore
          </button>
          <button type="button" onClick={startNewChat} disabled={isAiThinking} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-[11px] font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40">
            <Plus className="h-3.5 w-3.5" /> New chat
          </button>
        </div>
      </header>

      <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-grid grid-cols-3 rounded-xl border border-white/[0.08] bg-[#061226] p-1" role="group" aria-label="Choose AI tutor mode">
            {TUTOR_MODES.map((mode) => (
              <button key={mode.value} type="button" disabled={isAiThinking} aria-pressed={tutorMode === mode.value} onClick={() => setTutorMode(mode.value)} className={`min-h-9 rounded-lg px-3 text-[10px] font-semibold transition sm:px-4 sm:text-[11px] ${tutorMode === mode.value ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_16px_rgba(37,99,235,0.28)]' : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'}`}>
                {mode.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500 sm:max-w-[260px] sm:text-right">{TUTOR_MODES.find((mode) => mode.value === tutorMode)?.description}</p>
        </div>
      </div>

      <div className="flex min-h-[340px] flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <div className="min-h-[300px] flex-1">
          {messages.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-1 py-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/20 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">What would you like to learn?</h3>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">Ask a question, attach your study material, or start with one of these ideas.</p>
              {showQuickPrompts && (
                <>
                  <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
                    {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => {
                      const icons = [Calculator, BookOpen, Brain, Lightbulb];
                      const Icon = icons[index] || Sparkles;
                      return (
                        <button key={prompt.title} type="button" onClick={() => loadPrompt(prompt.prompt)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-300/15 bg-[#0B1B35] px-3.5 py-2 text-[11px] font-medium text-slate-200 transition hover:border-blue-300/35 hover:bg-blue-500/10 hover:text-white">
                          <Icon className="h-3.5 w-3.5 text-cyan-300" /> {prompt.title}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => { setExploreTab('prompts'); setExploreOpen(true); }} className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 transition hover:text-cyan-200">
                    Explore prompts and study tools <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="max-h-[520px] space-y-5 overflow-y-auto overscroll-contain pr-1 pb-3" role="log" aria-live="polite">
              {messages.map((message, index) => (
                <article key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/10 text-blue-200"><Bot className="h-4 w-4" /></span>}
                  <div className={`min-w-0 max-w-[88%] rounded-2xl px-4 py-3.5 shadow-lg sm:max-w-[84%] ${message.sender === 'user' ? 'rounded-tr-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-950/30' : 'rounded-tl-md border border-[#20385D] bg-[#0C1B33] text-slate-100 shadow-black/10'}`}>
                    <div className={`mb-2 flex items-center gap-2 text-[10px] font-semibold ${message.sender === 'user' ? 'text-blue-100/80' : 'text-cyan-200/85'}`}>
                      {message.sender === 'user' ? 'You' : 'StudyBuddy AI'}
                      <span className="font-normal opacity-60">· {message.timestamp}</span>
                    </div>
                    {message.sender === 'ai' ? <MarkdownText text={message.text} /> : <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-white sm:text-sm">{message.text}</p>}
                    {message.sender === 'ai' && !message.text.startsWith('⚠️') && message.text.trim() && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.07] pt-2.5">
                        <button type="button" onClick={() => void handleCopy(message.id, message.text)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white">
                          {copiedId === message.id ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />} {copiedId === message.id ? 'Copied' : 'Copy'}
                        </button>
                        <button type="button" onClick={() => saveNote(index)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white"><FileText className="h-3.5 w-3.5" /> Save note</button>
                        <button type="button" onClick={() => void handleSendMessage('Explain that in simpler words and give me one everyday example.')} disabled={isAiThinking} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-blue-300 transition hover:bg-blue-500/10 hover:text-blue-100 disabled:opacity-40"><Lightbulb className="h-3.5 w-3.5" /> Simpler</button>
                        <button type="button" onClick={() => void handleSendMessage('Give me one short practice question to check whether I understood this.')} disabled={isAiThinking} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-cyan-300 transition hover:bg-cyan-500/10 hover:text-cyan-100 disabled:opacity-40"><Wrench className="h-3.5 w-3.5" /> Practice</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {isAiThinking && (
                <div className="flex items-center gap-3 pl-1 text-xs text-blue-200" role="status">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/10"><Bot className="h-4 w-4 animate-pulse" /></span>
                  <span className="flex items-center gap-1.5">Thinking<span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:300ms]" /></span></span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-white/[0.07] pt-3">
          {attachment && (
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-400/[0.06] px-3 py-2 text-xs text-slate-200">
              <FileText className="h-4 w-4 shrink-0 text-cyan-300" />
              <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] uppercase text-cyan-200">{attachment.mimeType === 'application/pdf' ? 'PDF' : attachment.textContent ? 'Text' : 'File'}</span>
              <button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment" className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept={SUPPORTED_FILE_ACCEPT} className="hidden" onChange={handleFilePicked} />
          <form onSubmit={submit} className="rounded-2xl border border-[#284267] bg-[#07152A] p-2 shadow-inner transition focus-within:border-blue-400/60 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]">
            <textarea
              ref={inputRef}
              value={inputQuestion}
              onChange={(event) => setInputQuestion(event.target.value)}
              onKeyDown={handleInputKeyDown}
              rows={2}
              placeholder={attachment ? 'Ask something about this file…' : 'Message your AI Tutor…'}
              aria-label="Message your AI Tutor"
              className="max-h-36 min-h-[48px] w-full resize-y bg-transparent px-3 py-2 text-[13px] leading-relaxed text-slate-100 outline-none placeholder:text-slate-500 sm:text-sm"
            />
            <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-1 pt-2">
              <div className="flex min-w-0 items-center gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-cyan-200" aria-label="Attach a file"><Paperclip className="h-4 w-4" /> Attach</button>
                <span className="hidden truncate text-[9px] text-slate-600 sm:inline">{SUPPORTED_FILE_HELP}</span>
                <span className="hidden text-[9px] text-slate-600 md:inline">Enter to send · Shift + Enter for a new line</span>
              </div>
              <button type="submit" disabled={(!inputQuestion.trim() && !attachment) || isAiThinking} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)] transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50">
                <span>Send</span><ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-[9px] text-slate-600">AI can make mistakes. Double-check important information.</p>
        </div>
      </div>

      {exploreOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020817]/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setExploreOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="ai-explore-title" className="flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-blue-300/20 bg-[#08172D] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
            <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div><h2 id="ai-explore-title" className="text-base font-semibold text-white">Explore learning prompts</h2><p className="mt-1 text-[11px] text-slate-400">Choose one to load it into your message.</p></div>
              <button type="button" onClick={() => setExploreOpen(false)} aria-label="Close explore panel" className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            </header>
            <div className="flex gap-2 border-b border-white/[0.07] px-5 py-3">
              <button type="button" onClick={() => setExploreTab('prompts')} className={`rounded-xl px-4 py-2 text-xs font-semibold ${exploreTab === 'prompts' ? 'bg-blue-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}><BookOpen className="mr-1.5 inline h-3.5 w-3.5" /> Quick prompts</button>
              <button type="button" onClick={() => setExploreTab('tools')} className={`rounded-xl px-4 py-2 text-xs font-semibold ${exploreTab === 'tools' ? 'bg-blue-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}><Zap className="mr-1.5 inline h-3.5 w-3.5" /> Study tools</button>
            </div>
            <div className="grid min-h-0 grid-cols-1 gap-2 overflow-y-auto p-4 sm:grid-cols-2 sm:p-5">
              {exploreTab === 'prompts' ? QUICK_PROMPTS.map((prompt) => (
                <button key={prompt.title} type="button" onClick={() => loadPrompt(prompt.prompt)} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition hover:border-blue-300/30 hover:bg-blue-500/[0.07]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-300">{prompt.category}</span>
                  <span className="mt-1 block text-sm font-semibold text-white group-hover:text-blue-100">{prompt.title}</span>
                  <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-400">{prompt.description}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-300">Use prompt <ArrowUp className="h-3 w-3 rotate-45" /></span>
                </button>
              )) : STUDY_TOOLS.map((tool, index) => (
                <button key={tool.title} type="button" onClick={() => loadPrompt(tool.prompt)} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition hover:border-blue-300/30 hover:bg-blue-500/[0.07]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-300">{tool.category}</span>
                  <span className="mt-1 block text-sm font-semibold text-white group-hover:text-blue-100">{tool.title}</span>
                  <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-400">{tool.description}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-300">Use tool <ArrowUp className="h-3 w-3 rotate-45" /></span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
};
