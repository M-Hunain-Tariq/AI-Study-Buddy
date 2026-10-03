'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Paperclip,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Zap,
  Wrench,
  BookOpen,
  HelpCircle,
  FileText,
  Brain,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '../Toast';
import { MarkdownText } from './MarkdownText';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  steps?: string[];
  keyTakeaway?: string;
}

interface AiChatWorkspaceProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiChatWorkspace: React.FC<AiChatWorkspaceProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quick-prompts' | 'study-tools'>('chat');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ name: string; mimeType: string; data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(1);

  // Initial messages start empty so the student sees the exact empty state from the reference image
  const [messages, setMessages] = useState<Message[]>([]);

  // Adjust state when external prompt arrives (Official React pattern for adjusting state from props)
  const [prevPrompt, setPrevPrompt] = useState(initialPrompt);
  if (initialPrompt !== prevPrompt) {
    setPrevPrompt(initialPrompt);
    setInputQuestion(initialPrompt || '');
    setActiveTab('chat');
  }

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: isAiThinking ? 'auto' : 'smooth' });
    }
  }, [messages, isAiThinking]);

  const handleCopy = (id: string, text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied answer to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuestion).trim();
    if (!text || isAiThinking) return;

    const count = messageCounterRef.current++;
    const userMsg: Message = {
      id: `user-${count}`,
      sender: 'user',
      text: attachment ? `${text}\n\n📎 ${attachment.name}` : text,
      timestamp: 'Just now',
    };

    const history = [...messages, userMsg].map((m) => ({
      sender: m.sender,
      text: m.sender === 'user' ? m.text.replace(/\n\n📎 .*$/, '') : m.text,
      steps: m.steps,
    }));
    const sentAttachment = attachment;

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setAttachment(null);
    onClearInitialPrompt?.();
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          attachment: sentAttachment ? { mimeType: sentAttachment.mimeType, data: sentAttachment.data } : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'The AI could not answer right now.');
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('The AI could not answer right now.');

      // The answer streams in word by word, like ChatGPT.
      const decoder = new TextDecoder();
      const aiId = `ai-${messageCounterRef.current++}`;
      let full = '';
      let created = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const snapshot = full;
        if (!created) {
          created = true;
          setMessages((prev) => [...prev, { id: aiId, sender: 'ai', text: snapshot, timestamp: 'Just now' }]);
        } else {
          setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, text: snapshot } : m)));
        }
      }
      if (!full.trim()) throw new Error('The AI returned an empty answer. Please try again.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'The AI could not answer right now.';
      const aiCount = messageCounterRef.current++;
      setMessages((prev) => [
        ...prev,
        { id: `ai-${aiCount}`, sender: 'ai', text: `⚠️ ${message}`, timestamp: 'Just now' },
      ]);
      showToast('AI Tutor could not answer', 'info');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      showToast('Please attach a PNG, JPG or WEBP image.', 'info');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image is too large (max 4 MB).', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.split(',')[1];
      if (base64) setAttachment({ name: file.name, mimeType: file.type, data: base64 });
    };
    reader.readAsDataURL(file);
  };

  const suggestedPrompts = [
    {
      title: 'Explain this topic',
      sub: 'in simple words',
      icon: Lightbulb,
      color: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      text: 'Explain the concept of gravity and orbital motion in simple words.',
    },
    {
      title: 'Solve this question',
      sub: 'step by step',
      icon: Calculator,
      color: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      text: 'Solve this question step by step: Find the roots of x² - 7x + 10 = 0.',
    },
    {
      title: 'Give me a study plan',
      sub: 'plan for this topic',
      icon: BookOpen,
      color: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      text: 'Give me a 3-day study plan to master high school Chemistry Periodic Table trends.',
    },
    {
      title: 'Create a quiz',
      sub: 'on this topic',
      icon: HelpCircle,
      color: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      text: 'Create a 3-question practice quiz on Cell Mitosis vs Meiosis with answers.',
    },
  ];

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] shadow-xl flex flex-col transition-all duration-300 overflow-hidden">
      {/* Top Tabs matching reference image exactly */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {/* Tab 1: Chat (Active: Solid blue pill) */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'chat'
                ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          {/* Tab 2: Quick Prompts (Inactive: transparent) */}
          <button
            onClick={() => setActiveTab('quick-prompts')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-0 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer shrink-0 ${
              activeTab === 'quick-prompts'
                ? 'bg-[#2563EB] text-white px-3 sm:px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Quick Prompts</span>
          </button>

          {/* Tab 3: Study Tools (Inactive: transparent) */}
          <button
            onClick={() => setActiveTab('study-tools')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-0 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer shrink-0 ${
              activeTab === 'study-tools'
                ? 'bg-[#2563EB] text-white px-3 sm:px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Study Tools</span>
          </button>
        </div>

        {/* Clear chat / new session button */}
        {messages.length > 0 && activeTab === 'chat' && (
          <button
            onClick={() => {
              setMessages([]);
              showToast('Chat history cleared. Back to home state.', 'info');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#101C38] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="p-4 sm:p-6 min-h-[430px] flex flex-col justify-between">
        {/* TAB 1: CHAT WORKSPACE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Case A: Empty Chat State matching reference image */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8 max-w-2xl mx-auto space-y-6">
                {/* Glowing AI Chat icon in rounded square matching Image */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                  <MessageSquare className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>

                {/* Headings */}
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Hi Muhammad! 👋
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal">
                    I&apos;m your AI tutor. Ask me anything about your studies.
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
                    I&apos;m here to help you learn, understand and do better!
                  </p>
                </div>

                {/* 4 Suggested Prompts matching Image in one single row on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full pt-1">
                  {suggestedPrompts.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.title}
                        onClick={() => handleSendMessage(p.text)}
                        className="group flex flex-col items-start p-3 sm:p-3.5 rounded-xl bg-[#0D1838] hover:bg-[#14234C] border border-[#1B2C52] hover:border-indigo-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(99,102,241,0.25)] hover:-translate-y-0.5"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 border ${p.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {p.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Case B: Active Chat Messages list */
              <div className="flex-1 space-y-4 max-h-[480px] overflow-y-auto pr-1 pb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-md transition-all ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#6366F1] text-white rounded-tr-none shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                          : 'bg-[#0E1B3D] border border-[#1D3260] text-slate-100 rounded-tl-none shadow-[0_0_20px_rgba(15,23,42,0.6)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 opacity-80 text-[10px] sm:text-xs">
                        {msg.sender === 'ai' ? (
                          <>
                            <Bot className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="font-semibold text-indigo-300">AI Study Tutor</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5 text-white" />
                            <span className="font-semibold text-white">You</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="tabular-nums">{msg.timestamp}</span>
                      </div>

                      {/* Main Message Body */}
                      {msg.sender === 'ai' && !msg.steps ? (
                        <MarkdownText text={msg.text} />
                      ) : (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Step by step list if present */}
                      {msg.steps && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                          {msg.steps.map((st, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                              <span className="w-5 h-5 rounded-full bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{st}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key takeaway note if present */}
                      {msg.keyTakeaway && (
                        <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-[11px] sm:text-xs text-indigo-200 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{msg.keyTakeaway}</span>
                        </div>
                      )}

                      {/* Quick action buttons on AI responses */}
                      {msg.sender === 'ai' && (
                        <div className="mt-3 pt-2 border-t border-[#1C325E] flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, `${msg.text}\n\n${msg.steps?.join('\n') || ''}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#14234C] hover:bg-[#1A2E63] text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleSendMessage(`Can you explain that simpler with an everyday metaphor?`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#14234C] hover:bg-[#1A2E63] text-[11px] text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                          >
                            <Lightbulb className="w-3 h-3 text-amber-400" />
                            <span>Explain Simpler</span>
                          </button>

                          <button
                            onClick={() => handleSendMessage(`Give me 1 practice question to test if I understood this.`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#14234C] hover:bg-[#1A2E63] text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                          >
                            <HelpCircle className="w-3 h-3 text-cyan-400" />
                            <span>Practice Question</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI Thinking Animation Indicator */}
                {isAiThinking && messages[messages.length - 1]?.sender === 'user' && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E1B3D] border border-[#1D3260] w-fit shadow-md">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-indigo-300 font-medium">
                        AI Study Buddy is thinking...
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}

            {/* Bottom Message Input Composer matching Image */}
            <div className="mt-4 pt-2 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFilePicked}
              />
              {attachment && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-[#1A2C52] bg-[#0D1836] px-3 py-1.5 text-xs text-slate-200">
                  <span className="truncate">📎 {attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-[#0D1836] border border-[#1A2C52] rounded-xl px-2 py-1.5 shadow-inner"
              >
                {/* Paperclip attachment icon button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#132349] transition-colors cursor-pointer"
                  aria-label="Attach homework image or notes"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Main Text Input */}
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />

                {/* Circular Send Button with gradient and paper-plane icon matching Image */}
                <button
                  type="submit"
                  disabled={!inputQuestion.trim() || isAiThinking}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    inputQuestion.trim() && !isAiThinking
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_0_18px_rgba(79,70,229,0.55)] hover:scale-105 active:scale-95'
                      : 'bg-[#1D2B52] text-slate-300 hover:text-white'
                  }`}
                  aria-label="Send question to AI Tutor"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Subtitle caption matching Image exactly: "✨ AI Tutor will be available in the next step." */}
              <div className="flex items-center justify-center text-[11px] text-slate-400 gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Tutor can make mistakes. Double-check important answers.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUICK PROMPTS BROWSER */}
        {activeTab === 'quick-prompts' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Curated High School Prompts
              </h4>
              <p className="text-xs text-slate-400">
                Click any prompt to instantly run it with your AI tutor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  cat: 'Mathematics',
                  title: 'Quadratic Equations Made Easy',
                  desc: 'Explain factoring vs. the quadratic formula with real numbers.',
                  query: 'Explain how to solve quadratic equations by factoring vs using the quadratic formula with two clear examples.',
                },
                {
                  cat: 'Physics',
                  title: 'Newton\'s 3 Laws of Motion',
                  desc: 'Understand inertia, F=ma, and action-reaction with skateboard analogies.',
                  query: 'Explain Newton\'s three laws of motion using easy real-world skateboard examples.',
                },
                {
                  cat: 'Biology',
                  title: 'Cellular Respiration vs Photosynthesis',
                  desc: 'Compare chemical formulas and where they take place in plant and animal cells.',
                  query: 'What is the relationship between photosynthesis and cellular respiration? Show formulas.',
                },
                {
                  cat: 'English Literature',
                  title: 'Macbeth Essay Thesis Generator',
                  desc: 'Generate strong thesis arguments exploring the theme of guilt and ambition.',
                  query: 'Give me 3 strong thesis statements analyzing how guilt manifests in Shakespeare\'s Macbeth.',
                },
                {
                  cat: 'Chemistry',
                  title: 'Periodic Table Trends',
                  desc: 'Electronegativity, ionization energy, and atomic radius explained simply.',
                  query: 'Explain periodic table trends for electronegativity, atomic radius, and ionization energy with memory tricks.',
                },
                {
                  cat: 'Study Skills',
                  title: 'Active Recall & Spaced Repetition',
                  desc: 'How to structure a 20-minute daily review session for high test scores.',
                  query: 'How can I set up an active recall and spaced repetition study routine for my high school classes?',
                },
              ].map((p) => (
                <div
                  key={`curated-prompt-${p.title}`}
                  onClick={() => {
                    handleSendMessage(p.query);
                    setActiveTab('chat');
                  }}
                  className="group cursor-pointer p-4 rounded-xl bg-[#0D1838] hover:bg-[#14234C] border border-[#1B2C52] hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {p.cat}
                    </span>
                    <h5 className="text-xs sm:text-sm font-semibold text-white mt-2 group-hover:text-indigo-200 transition-colors">
                      {p.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-medium text-indigo-400">
                    <span>Ask this prompt</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDY TOOLS */}
        {activeTab === 'study-tools' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                AI Interactive Study Tools
              </h4>
              <p className="text-xs text-slate-400">
                Choose a specialized study tool to generate customized study aids.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: Brain,
                  title: 'Concept Simplifier',
                  desc: 'Break down complex textbook jargon into 5th-grade plain English.',
                  prompt: 'Simplify this complex topic: The theory of relativity and time dilation.',
                  color: 'text-purple-400 bg-purple-500/20',
                },
                {
                  icon: Calculator,
                  title: 'Math Step Solver',
                  desc: 'Get line-by-line working with explanations for every algebraic transformation.',
                  prompt: 'Show step-by-step working for: Solve for x in 3(x - 4) = 2x + 11.',
                  color: 'text-blue-400 bg-blue-500/20',
                },
                {
                  icon: HelpCircle,
                  title: 'Quiz Generator',
                  desc: 'Instant practice quizzes with multiple choice, true/false, and explanations.',
                  prompt: 'Generate a 5-question practice quiz on high school Chemistry acids and bases.',
                  color: 'text-pink-400 bg-pink-500/20',
                },
                {
                  icon: FileText,
                  title: 'Notes Summarizer',
                  desc: 'Turn messy notebook pages into neat bullet points and recall cheat sheets.',
                  prompt: 'Summarize the causes and consequences of World War I into concise key bullet points.',
                  color: 'text-teal-400 bg-teal-500/20',
                },
                {
                  icon: Zap,
                  title: 'Flashcard Builder',
                  desc: 'Create front-and-back flashcard Q&A pairs ready for revision.',
                  prompt: 'Create 6 flashcard Q&A pairs for high school Biology cell organelles.',
                  color: 'text-amber-400 bg-amber-500/20',
                },
                {
                  icon: Sparkles,
                  title: 'Essay Outline Maker',
                  desc: 'Structure your introduction, body paragraphs, and strong conclusion.',
                  prompt: 'Generate an essay outline for: To what extent does technology benefit student learning?',
                  color: 'text-cyan-400 bg-cyan-500/20',
                },
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={`tool-${tool.title}`}
                    onClick={() => {
                      handleSendMessage(tool.prompt);
                      setActiveTab('chat');
                    }}
                    className="group p-4 rounded-xl bg-[#0D1838] hover:bg-[#14234C] border border-[#1B2C52] hover:border-indigo-500/50 transition-all text-left flex flex-col justify-between shadow-sm hover:shadow-[0_0_18px_rgba(99,102,241,0.2)] cursor-pointer"
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">
                        {tool.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
