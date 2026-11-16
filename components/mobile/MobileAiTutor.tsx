'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUp, Bot, BookOpen, Brain, Check, Copy, FileText, History, Lightbulb,
  MessageCircle, NotebookPen, Paperclip, Plus, Sparkles, Trash2, Wrench, X,
} from 'lucide-react';
import { normalizeSavedChatHistory } from '@/lib/ai/chat-history';
import type { SavedChat } from '@/lib/ai/chat-history';
import { QUICK_PROMPTS, STUDY_TOOLS, SUPPORTED_FILE_ACCEPT, TUTOR_MODES } from '@/lib/ai/tutor-presets';
import type { TutorMode } from '@/lib/ai/tutor-presets';
import { MarkdownText } from '../ai-tutor/MarkdownText';
import { useToast } from '../Toast';
import { Sheet } from './Sheet';

interface Message { id: string; sender: 'user' | 'ai'; text: string; timestamp: string }
interface Attachment { name: string; mimeType: string; data: string; textContent?: string }
interface MobileAiTutorProps { initialPrompt?: string; onClearInitialPrompt?: () => void }
type ActiveSheet = 'history' | 'explore' | null;

const HISTORY_KEY = 'studybuddy_ai_chat_history';
const LANGUAGES = ['English', 'Urdu', 'Roman Urdu', 'Hindi'];
const TEXT_EXT = new Set(['txt', 'md', 'mdx', 'csv', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'xml', 'yaml', 'yml']);

function readHistory(): SavedChat[] {
  try { return normalizeSavedChatHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')); }
  catch { return []; }
}

export const MobileAiTutor: React.FC<MobileAiTutorProps> = ({ initialPrompt, onClearInitialPrompt }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [thinking, setThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [language, setLanguage] = useState('English');
  const [mode, setMode] = useState<TutorMode>('Ask Anything');
  const [exploreTab, setExploreTab] = useState<'prompts' | 'tools'>('prompts');

  const counter = useRef(0);
  const chatId = useRef(`chat-${Date.now()}`);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('studybuddy_ai_language');
      if (saved && LANGUAGES.includes(saved)) setLanguage(saved);
    } catch { /* optional preference */ }
  }, []);

  useEffect(() => { if (initialPrompt) setInput(initialPrompt); }, [initialPrompt]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, [messages, thinking]);

  useEffect(() => {
    const element = areaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 112)}px`;
  }, [input]);

  useEffect(() => {
    if (!messages.length || thinking) return;
    try {
      const firstUser = messages.find((message) => message.sender === 'user')?.text || 'Study conversation';
      const entry: SavedChat = {
        id: chatId.current,
        title: firstUser.replace(/\s+/g, ' ').slice(0, 54),
        updatedAt: new Date().toLocaleString(),
        messages: messages.slice(-14).map(({ sender, text, timestamp }) => ({ sender, text: text.slice(0, 6000), timestamp })),
      };
      const next = normalizeSavedChatHistory([entry, ...readHistory().filter((chat) => chat.id !== entry.id)]);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('studybuddy-chat-history-updated'));
    } catch { /* browser storage may be unavailable */ }
  }, [messages, thinking]);

  const startNewChat = () => {
    if (thinking) return;
    chatId.current = `chat-${Date.now()}`;
    setMessages([]);
    setInput('');
    setAttachment(null);
    setMode('Ask Anything');
    setActiveSheet(null);
    onClearInitialPrompt?.();
  };

  const openHistory = () => { setHistory(readHistory()); setActiveSheet('history'); };
  const openExplore = (tab: 'prompts' | 'tools' = 'prompts') => { setExploreTab(tab); setActiveSheet('explore'); };

  const loadPrompt = (prompt: string) => {
    setInput(prompt);
    setActiveSheet(null);
    onClearInitialPrompt?.();
    window.setTimeout(() => areaRef.current?.focus(), 80);
  };

  const loadChat = (chat: SavedChat) => {
    if (thinking) return;
    chatId.current = chat.id;
    setMessages(chat.messages.map((message) => ({ id: `loaded-${counter.current++}`, ...message })));
    setInput('');
    setAttachment(null);
    setMode('Ask Anything');
    setActiveSheet(null);
    showToast('Conversation opened.', 'success');
  };

  const deleteChat = (id: string) => {
    const next = normalizeSavedChatHistory(readHistory().filter((chat) => chat.id !== id));
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('studybuddy-chat-history-updated'));
    } catch { showToast('Could not update chat history.', 'info'); }
    setHistory(next);
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    try { localStorage.setItem('studybuddy_ai_language', value); } catch { /* optional preference */ }
    showToast(`Response language set to ${value}.`, 'success');
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied answer to clipboard.', 'success');
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch { showToast('Could not copy. Select the text and copy it manually.', 'info'); }
  };

  const saveNote = (index: number) => {
    const answer = messages[index];
    if (!answer || answer.sender !== 'ai') return;
    const question = [...messages.slice(0, index)].reverse().find((message) => message.sender === 'user')?.text.replace(/\n\n📎 .*$/, '') || 'AI answer';
    try {
      const existing = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const now = Date.now();
      const note = {
        id: `note-${now}`, title: `AI: ${question}`.slice(0, 60), subject: 'AI Tutor', color: 'blue', content: answer.text,
        excerpt: answer.text.slice(0, 140) + (answer.text.length > 140 ? '…' : ''), lastEdited: 'Just now', lastEditedTimestamp: now,
        priority: 'Medium', tags: ['AI Tutor'], isPrivate: false, isPinned: false, addToPlanner: false,
      };
      localStorage.setItem('study_notes_v5', JSON.stringify([note, ...(Array.isArray(existing) ? existing : [])]));
      showToast('Answer saved to My Notes.', 'success');
    } catch { showToast('Could not save the note.', 'info'); }
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if ((!text && !attachment) || thinking) return;
    const prompt = text || 'Please analyze the uploaded file and explain its key points.';
    const userMessage: Message = {
      id: `user-${counter.current++}`,
      sender: 'user',
      text: attachment ? `${prompt}\n\n📎 ${attachment.name}` : prompt,
      timestamp: 'Just now',
    };
    const requestMessages = [...messages, userMessage].map((message) => ({
      sender: message.sender,
      text: message.sender === 'user' ? message.text.replace(/\n\n📎 .*$/, '') : message.text,
    }));

    let context = '';
    try {
      const name = localStorage.getItem('studybuddy_user_name') || 'Student';
      const notes = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const tasks = JSON.parse(localStorage.getItem('study_tasks_v4') || '[]');
      const quizzes = JSON.parse(localStorage.getItem('study_quiz_history_v1') || '[]');
      const scores = Array.isArray(quizzes) ? quizzes.slice(0, 5).map((quiz: { subject?: unknown; score?: unknown }) => `${String(quiz?.subject ?? 'Quiz')}: ${Number(quiz?.score) || 0}%`).join(', ') : '';
      context = `Student: ${name}. Recent quiz results: ${scores || 'none'}. Notes available: ${Array.isArray(notes) ? notes.length : 0}. Tasks available: ${Array.isArray(tasks) ? tasks.length : 0}. Assistant mode: ${mode}. Preferred response language: ${language}. Reply in this language unless the student asks otherwise.`;
    } catch { /* optional student context */ }

    const sentAttachment = attachment;
    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setAttachment(null);
    onClearInitialPrompt?.();
    setThinking(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: requestMessages,
          context,
          mode,
          attachment: sentAttachment ? { name: sentAttachment.name, mimeType: sentAttachment.mimeType, data: sentAttachment.data, textContent: sentAttachment.textContent } : undefined,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'The AI could not answer right now.');
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('The AI could not answer right now.');
      const decoder = new TextDecoder();
      const aiId = `ai-${counter.current++}`;
      let received = '';
      let created = false;
      const show = (fullText: string) => {
        if (!created) {
          created = true;
          setMessages((previous) => [...previous, { id: aiId, sender: 'ai', text: fullText, timestamp: 'Just now' }]);
        } else {
          setMessages((previous) => previous.map((message) => message.id === aiId ? { ...message, text: fullText } : message));
        }
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += decoder.decode(value, { stream: true });
        show(received);
      }
      received += decoder.decode();
      if (!received.trim()) throw new Error('The AI returned an empty answer. Please try again.');
      show(received);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The AI could not answer right now.';
      setMessages((previous) => [...previous, { id: `ai-${counter.current++}`, sender: 'ai', text: `⚠️ ${message}`, timestamp: 'Just now' }]);
      showToast('AI Tutor could not answer.', 'info');
    } finally {
      setThinking(false);
    }
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      } catch { showToast('Could not read this text file.', 'info'); }
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
      } else showToast('Could not read this file. Please try again.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const sendFromForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send();
  };

  return (
    <section className="m-chat m-ai-workspace" aria-label="AI Tutor workspace">
      <header className="m-chat-head m-ai-head">
        <div className="m-ai-title-wrap"><span className="m-ai-title-icon"><Bot size={18} /></span><div><h1>AI Tutor</h1><p>Your personal learning companion</p></div></div>
        <div className="m-ai-head-actions">
          <button type="button" className="m-icon-btn" onClick={() => openExplore('prompts')} aria-label="Explore prompts and study tools"><Sparkles size={18} /></button>
          <button type="button" className="m-icon-btn" onClick={openHistory} aria-label="Open chat history"><History size={19} /></button>
          <button type="button" className="m-icon-btn" onClick={startNewChat} aria-label="Start a new chat" disabled={thinking}><Plus size={21} /></button>
        </div>
      </header>

      {messages.length === 0 && (
        <div className="m-ai-hero">
          <div className="m-ai-hero-copy">
            <span className="m-ai-eyebrow"><Sparkles size={12} /> YOUR STUDY COMPANION</span>
            <h2>Let&apos;s learn <span>together.</span></h2>
            <p>Ask questions, explore ideas, and understand more.</p>
          </div>
          <div className="m-ai-hero-image"><Image src="/images/ai_tutor_robot_hero.jpg" alt="StudyBuddy AI robot studying at a laptop" fill priority sizes="120px" className="object-cover object-[72%_center]" /></div>
        </div>
      )}

      <div className="m-ai-mode-wrap">
        <div className="m-ai-mode-switch" role="group" aria-label="Choose tutor mode">
          {TUTOR_MODES.map((item) => (
            <button key={item.value} type="button" aria-pressed={mode === item.value} onClick={() => setMode(item.value)} disabled={thinking} className={mode === item.value ? 'is-active' : ''}>{item.label}</button>
          ))}
        </div>
        <p>{TUTOR_MODES.find((item) => item.value === mode)?.description}</p>
      </div>

      {messages.length === 0 && (
        <div className="m-ai-quick-start">
          <div className="m-ai-quick-head"><span>QUICK START</span><button type="button" onClick={() => openExplore('prompts')}>Explore more <ArrowUp size={12} /></button></div>
          <div className="m-ai-prompt-chips">
            {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => {
              const icons = [Calculator, BookOpen, Brain, Lightbulb];
              const Icon = icons[index] || Sparkles;
              return <button key={prompt.title} type="button" onClick={() => loadPrompt(prompt.prompt)}><Icon size={14} />{prompt.title}</button>;
            })}
          </div>
        </div>
      )}

      <div className="m-chat-body m-ai-chat-body" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="m-ai-first-message"><span className="m-ai-first-icon"><MessageCircle size={18} /></span><div><strong>Your chat starts here</strong><p>Type a question below or attach a study file. You can change the tutor mode at any time.</p></div></div>
        ) : (
          messages.map((message, index) => (
            <article key={message.id} className={`m-msg ${message.sender === 'user' ? 'is-user' : 'is-ai'}`}>
              {message.sender === 'user' ? <p>{message.text}</p> : <div className="m-msg-text"><MarkdownText text={message.text} /></div>}
              {message.sender === 'ai' && !message.text.startsWith('⚠️') && message.text.trim() && (
                <div className="m-msg-actions">
                  <button type="button" onClick={() => void copy(message.id, message.text)}>{copiedId === message.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === message.id ? 'Copied' : 'Copy'}</button>
                  <button type="button" onClick={() => saveNote(index)}><NotebookPen size={14} /> Save note</button>
                  <button type="button" onClick={() => void send('Explain that in simpler words and give me one everyday example.')} disabled={thinking}><Lightbulb size={14} /> Simpler</button>
                  <button type="button" onClick={() => void send('Give me one short practice question to check whether I understood this.')} disabled={thinking}><Wrench size={14} /> Practice</button>
                </div>
              )}
            </article>
          ))
        )}
        {thinking && <div className="m-typing" role="status" aria-label="AI is thinking"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>

      <div className="m-composer m-ai-composer">
        {attachment && <div className="m-attach"><Paperclip size={14} /><span>{attachment.name}</span><button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X size={14} /></button></div>}
        <form className="m-composer-row" onSubmit={sendFromForm}>
          <input ref={fileRef} type="file" hidden accept={SUPPORTED_FILE_ACCEPT} onChange={onFile} />
          <button type="button" className="m-icon-btn" onClick={() => fileRef.current?.click()} aria-label="Attach a file"><Paperclip size={19} /></button>
          <textarea ref={areaRef} rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(); } }} placeholder={attachment ? 'Ask about this file…' : 'Message your AI Tutor…'} aria-label="Message your AI Tutor" />
          <button type="submit" className="m-send" disabled={thinking || (!input.trim() && !attachment)} aria-label="Send message"><ArrowUp size={20} /></button>
        </form>
        <p className="m-ai-composer-note">{mode} mode · AI can make mistakes. Double-check important information.</p>
      </div>

      <Sheet open={activeSheet === 'history'} title="Chat history" onClose={() => setActiveSheet(null)}>
        <label className="m-field"><span>Response language</span><select value={language} onChange={(event) => changeLanguage(event.target.value)}>{LANGUAGES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="m-field"><span>Saved conversations</span>
          {history.length === 0 ? <p className="m-hint">No saved chats yet. Your conversations will appear here.</p> : (
            <ul className="m-plain m-chat-list">
              {history.map((chat) => <li key={chat.id}>
                <button type="button" className="m-row-main" onClick={() => loadChat(chat)}><strong>{chat.title || 'Study conversation'}</strong><small>{chat.updatedAt || 'Saved conversation'} · {chat.messages.length} messages</small></button>
                <button type="button" className="m-icon-btn" onClick={() => deleteChat(chat.id)} aria-label={`Delete chat ${chat.title}`}><Trash2 size={17} /></button>
              </li>)}
            </ul>
          )}
        </div>
      </Sheet>

      <Sheet open={activeSheet === 'explore'} title={exploreTab === 'prompts' ? 'Quick prompts' : 'Study tools'} onClose={() => setActiveSheet(null)}>
        <div className="m-ai-explore-tabs"><button type="button" className={exploreTab === 'prompts' ? 'is-active' : ''} onClick={() => setExploreTab('prompts')}>Quick prompts</button><button type="button" className={exploreTab === 'tools' ? 'is-active' : ''} onClick={() => setExploreTab('tools')}>Study tools</button></div>
        <div className="m-ai-explore-list">
          {exploreTab === 'prompts' ? QUICK_PROMPTS.map((prompt) => <button key={prompt.title} type="button" onClick={() => loadPrompt(prompt.prompt)}><span>{prompt.category}</span><strong>{prompt.title}</strong><small>{prompt.description}</small></button>) : STUDY_TOOLS.map((tool) => <button key={tool.title} type="button" onClick={() => loadPrompt(tool.prompt)}><span>{tool.category}</span><strong>{tool.title}</strong><small>{tool.description}</small></button>)}
        </div>
      </Sheet>
    </section>
  );
};
