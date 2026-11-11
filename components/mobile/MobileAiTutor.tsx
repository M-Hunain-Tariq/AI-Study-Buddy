'use client';

import React, { useEffect, useRef, useState } from 'react';
import { normalizeSavedChatHistory } from '@/lib/ai/chat-history';
import { ArrowUp, Bot, Check, Clock, Copy, NotebookPen, Paperclip, Plus, Trash2, X } from 'lucide-react';
import { MarkdownText } from '../ai-tutor/MarkdownText';
import { useToast } from '../Toast';
import { Sheet } from './Sheet';

interface Msg { id: string; sender: 'user' | 'ai'; text: string; timestamp: string }
interface Attachment { name: string; mimeType: string; data: string; textContent?: string }
interface SavedChat { id: string; title: string; updatedAt: string; messages: { sender: 'user' | 'ai'; text: string; timestamp: string }[] }
interface MobileAiTutorProps { initialPrompt?: string; onClearInitialPrompt?: () => void }

const HISTORY_KEY = 'studybuddy_ai_chat_history';
const LANGS = ['English', 'Urdu', 'Roman Urdu', 'Hindi'];
const SUGGESTIONS = [
  { label: 'Explain coding', text: 'What is coding? Explain it for a complete beginner and show a tiny example.' },
  { label: 'Quadratic equations', text: 'Explain how to solve quadratic equations by factoring vs using the quadratic formula with two clear examples.' },
  { label: "Newton's laws", text: "Explain Newton's three laws of motion using easy real-world skateboard examples." },
  { label: 'Periodic trends', text: 'Explain periodic table trends for electronegativity, atomic radius, and ionization energy with memory tricks.' },
];
const TEXT_EXT = new Set(['txt', 'md', 'mdx', 'csv', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'xml', 'yaml', 'yml']);

const readHistory = (): SavedChat[] => {
  try {
    return normalizeSavedChatHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  } catch { return []; }
};

/** Phone AI Tutor: one full-height chat. Same API (/api/ai/chat), history format and file limits as the laptop chat. */
export const MobileAiTutor: React.FC<MobileAiTutorProps> = ({ initialPrompt, onClearInitialPrompt }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [thinking, setThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatsOpen, setChatsOpen] = useState(false);
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [language, setLanguage] = useState('English');

  const counter = useRef(0);
  const chatId = useRef(`chat-${Date.now()}`);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('studybuddy_ai_language');
      if (saved && LANGS.includes(saved)) setLanguage(saved);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { if (initialPrompt) setInput(initialPrompt); }, [initialPrompt]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, thinking]);

  // grow the text box with its content (max 4 lines)
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  // save this chat (same storage + event as the laptop chat, but a unique id per chat)
  useEffect(() => {
    if (!messages.length || thinking) return;
    try {
      const firstUser = messages.find((m) => m.sender === 'user')?.text || 'Study conversation';
      const entry: SavedChat = {
        id: chatId.current,
        title: firstUser.replace(/\s+/g, ' ').slice(0, 54),
        updatedAt: new Date().toLocaleString(),
        messages: messages.slice(-14).map(({ sender, text, timestamp }) => ({ sender, text: text.slice(0, 6000), timestamp })),
      };
      const next = normalizeSavedChatHistory([entry, ...readHistory().filter((c) => c.id !== entry.id)]);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('studybuddy-chat-history-updated'));
    } catch { /* storage unavailable */ }
  }, [messages, thinking]);

  const newChat = () => {
    if (thinking) return;
    chatId.current = `chat-${Date.now()}`;
    setMessages([]); setInput(''); setAttachment(null); setChatsOpen(false);
  };

  const openChats = () => { setHistory(readHistory()); setChatsOpen(true); };
  const loadChat = (c: SavedChat) => {
    if (thinking) return;
    chatId.current = c.id;
    setMessages(c.messages.map((m) => ({ id: `m-${counter.current++}`, ...m })));
    setChatsOpen(false);
  };
  const deleteChat = (id: string) => {
    const next = normalizeSavedChatHistory(readHistory().filter((c) => c.id !== id));
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('studybuddy-chat-history-updated')); } catch { /* ignore */ }
    setHistory(next);
  };
  const changeLanguage = (value: string) => {
    setLanguage(value);
    try { localStorage.setItem('studybuddy_ai_language', value); } catch { /* ignore */ }
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if ((!text && !attachment) || thinking) return;
    const prompt = text || 'Please analyze the uploaded file and explain its key points.';
    const userMsg: Msg = { id: `user-${counter.current++}`, sender: 'user', text: attachment ? `${prompt}\n\n📎 ${attachment.name}` : prompt, timestamp: 'Just now' };
    const history = [...messages, userMsg].map((m) => ({ sender: m.sender, text: m.sender === 'user' ? m.text.replace(/\n\n📎 .*$/, '') : m.text }));

    let context = '';
    try {
      const name = localStorage.getItem('studybuddy_user_name') || 'Student';
      const notes = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const tasks = JSON.parse(localStorage.getItem('study_tasks_v4') || '[]');
      const quiz = JSON.parse(localStorage.getItem('study_quiz_history_v1') || '[]');
      const lang = localStorage.getItem('studybuddy_ai_language') || 'English';
      const scores = Array.isArray(quiz) ? quiz.slice(0, 5).map((q: { subject: string; score: number }) => `${q.subject}: ${q.score}%`).join(', ') : '';
      context = `Student: ${name}. Recent quiz results: ${scores || 'none'}. Notes available: ${Array.isArray(notes) ? notes.length : 0}. Tasks available: ${Array.isArray(tasks) ? tasks.length : 0}. Preferred response language: ${lang}.`;
    } catch { /* ignore */ }

    const sent = attachment;
    setMessages((prev) => [...prev, userMsg]);
    setInput(''); setAttachment(null); onClearInitialPrompt?.(); setThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history, context, mode: 'Ask Anything',
          attachment: sent ? { name: sent.name, mimeType: sent.mimeType, data: sent.data, textContent: sent.textContent } : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'The AI could not answer right now.');
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('The AI could not answer right now.');
      const decoder = new TextDecoder();
      const aiId = `ai-${counter.current++}`;
      let received = '';
      let created = false;
      const show = (full: string) => {
        if (!created) { created = true; setMessages((prev) => [...prev, { id: aiId, sender: 'ai', text: full, timestamp: 'Just now' }]); }
        else setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, text: full } : m)));
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'The AI could not answer right now.';
      setMessages((prev) => [...prev, { id: `ai-${counter.current++}`, sender: 'ai', text: `⚠️ ${message}`, timestamp: 'Just now' }]);
      showToast('AI Tutor could not answer', 'info');
    } finally {
      setThinking(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
    const isPdf = file.type === 'application/pdf' || ext === 'pdf';
    const isText = file.type.startsWith('text/') || file.type === 'application/json' || TEXT_EXT.has(ext);
    if (!isImage && !isPdf && !isText) { showToast('Supported files: PNG, JPG, WEBP, PDF, TXT, MD, CSV, JSON and code files.', 'info'); return; }
    if (file.size > 4 * 1024 * 1024) { showToast('File is too large. Maximum upload size is 4 MB.', 'info'); return; }
    if (isText) {
      try {
        const content = await file.text();
        if (!content.trim()) { showToast('This file is empty.', 'info'); return; }
        if (content.length > 50000) { showToast('Text file is too long. Maximum supported length is 50,000 characters.', 'info'); return; }
        setAttachment({ name: file.name, mimeType: 'text/plain', data: '', textContent: content });
      } catch { showToast('Could not read this text file.', 'info'); }
      return;
    }
    const guessedImageMime = ext === 'png' ? 'image/png' : ['jpg', 'jpeg'].includes(ext) ? 'image/jpeg' : 'image/webp';
    const mimeType = isPdf ? 'application/pdf' : ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ? file.type : guessedImageMime;
    const reader = new FileReader();
    reader.onerror = () => showToast('Could not read this file. Please try again.', 'info');
    reader.onload = () => {
      const base64 = String(reader.result || '').split(',')[1];
      if (base64) setAttachment({ name: file.name, mimeType, data: base64 });
      else showToast('Could not read this file. Please try again.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied answer to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch { showToast('Could not copy. Select the text and copy it manually.', 'info'); }
  };

  const saveNote = (index: number) => {
    const answer = messages[index];
    const question = [...messages.slice(0, index)].reverse().find((m) => m.sender === 'user')?.text.replace(/\n\n📎 .*$/, '') || 'AI answer';
    try {
      const notes = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      const note = {
        id: `note-${Date.now()}`, title: `AI: ${question}`.slice(0, 60), subject: 'General', color: 'blue', content: answer.text,
        excerpt: answer.text.slice(0, 95) + (answer.text.length > 95 ? '...' : ''), lastEdited: 'Just now', lastEditedTimestamp: Date.now(),
        priority: 'Medium', tags: ['AI Tutor'], isPrivate: false, isPinned: false, addToPlanner: false,
      };
      localStorage.setItem('study_notes_v5', JSON.stringify([note, ...(Array.isArray(notes) ? notes : [])]));
      showToast('Saved to My Notes', 'success');
    } catch { showToast('Could not save the note.', 'info'); }
  };

  return (
    <section className="m-chat" aria-label="AI Tutor">
      <header className="m-chat-head">
        <h1>AI Tutor</h1>
        <div>
          <button type="button" className="m-icon-btn" onClick={openChats} aria-label="Chats and language"><Clock size={20} /></button>
          <button type="button" className="m-icon-btn" onClick={newChat} aria-label="New chat" disabled={thinking || !messages.length}><Plus size={22} /></button>
        </div>
      </header>

      <div className="m-chat-body" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="m-chat-empty">
            <span className="m-chat-bot"><Bot size={30} /></span>
            <h2>How can I help you study?</h2>
            <p>Ask anything, or attach a photo, PDF or notes.</p>
            <div className="m-sugg">
              {SUGGESTIONS.map((s) => (
                <button key={s.label} type="button" onClick={() => send(s.text)}>{s.label}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={m.id} className={`m-msg ${m.sender === 'user' ? 'is-user' : 'is-ai'}`}>
              {m.sender === 'user' ? <p>{m.text}</p> : <div className="m-msg-text"><MarkdownText text={m.text} /></div>}
              {m.sender === 'ai' && !m.text.startsWith('⚠️') && (
                <div className="m-msg-actions">
                  <button type="button" onClick={() => copy(m.id, m.text)}>{copiedId === m.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === m.id ? 'Copied' : 'Copy'}</button>
                  <button type="button" onClick={() => saveNote(i)}><NotebookPen size={14} /> Save note</button>
                </div>
              )}
            </div>
          ))
        )}
        {thinking && <div className="m-typing" role="status" aria-label="AI is thinking"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>

      <div className="m-composer">
        {attachment && (
          <div className="m-attach">
            <Paperclip size={14} /> <span>{attachment.name}</span>
            <button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X size={14} /></button>
          </div>
        )}
        <div className="m-composer-row">
          <input ref={fileRef} type="file" hidden accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.md,.mdx,.csv,.json,.js,.jsx,.ts,.tsx,.py,.html,.css,.xml,.yaml,.yml" onChange={onFile} />
          <button type="button" className="m-icon-btn" onClick={() => fileRef.current?.click()} aria-label="Attach file"><Paperclip size={20} /></button>
          <textarea ref={areaRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your tutor…" aria-label="Message" />
          <button type="button" className="m-send" onClick={() => send()} disabled={thinking || (!input.trim() && !attachment)} aria-label="Send"><ArrowUp size={20} /></button>
        </div>
      </div>

      <Sheet open={chatsOpen} title="Chats" onClose={() => setChatsOpen(false)}>
        <label className="m-field">
          <span>Reply language</span>
          <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <div className="m-field">
          <span>Recent chats</span>
          {history.length === 0 ? (
            <p className="m-hint">No saved chats yet.</p>
          ) : (
            <ul className="m-plain m-chat-list">
              {history.map((c) => (
                <li key={c.id}>
                  <button type="button" className="m-row-main" onClick={() => loadChat(c)}>
                    <strong>{c.title}</strong>
                    <small>{c.updatedAt}</small>
                  </button>
                  <button type="button" className="m-icon-btn" onClick={() => deleteChat(c.id)} aria-label={`Delete chat "${c.title}"`}><Trash2 size={18} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Sheet>
    </section>
  );
};
