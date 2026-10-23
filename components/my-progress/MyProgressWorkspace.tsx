'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays,
  CheckCircle2, ChevronDown, Clock3, Flame, GraduationCap,
  Play, Sparkles, Target, TrendingUp, Trophy, Zap,
} from 'lucide-react';
import { useToast } from '../Toast';

type Range = '7 days' | '30 days' | '90 days';

const subjectData = [
  { name: 'Mathematics', detail: '12 of 16 lessons', progress: 76, color: '#8B7CFF', tint: 'rgba(139,124,255,.14)', icon: '∑' },
  { name: 'Computer Science', detail: '9 of 12 lessons', progress: 72, color: '#35D6C4', tint: 'rgba(53,214,196,.13)', icon: '</>' },
  { name: 'Physics', detail: '7 of 12 lessons', progress: 58, color: '#61A8FF', tint: 'rgba(97,168,255,.13)', icon: 'ϟ' },
  { name: 'English', detail: '5 of 10 lessons', progress: 50, color: '#F4B860', tint: 'rgba(244,184,96,.13)', icon: 'Aa' },
];

const activityData = [
  { icon: CheckCircle2, color: '#35D6C4', bg: 'rgba(53,214,196,.12)', title: 'Completed Algebra practice', sub: 'Mathematics · 12 questions', time: 'Today, 4:20 PM', score: '+ 25 XP' },
  { icon: BookOpen, color: '#8B7CFF', bg: 'rgba(139,124,255,.13)', title: 'Reviewed chapter notes', sub: 'Computer Science · Data types', time: 'Today, 2:45 PM', score: '+ 15 XP' },
  { icon: GraduationCap, color: '#61A8FF', bg: 'rgba(97,168,255,.13)', title: 'Finished a practice quiz', sub: 'Physics · Motion and forces', time: 'Yesterday', score: '88%' },
];

const chartSets: Record<Range, number[]> = {
  '7 days': [30, 46, 38, 62, 51, 78, 68],
  '30 days': [24, 34, 29, 48, 42, 61, 55, 74, 62, 82, 70, 88],
  '90 days': [18, 27, 22, 35, 31, 45, 40, 56, 48, 66, 59, 78],
};

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-white/[0.075] bg-[#0B1427]/85 shadow-[0_18px_45px_rgba(0,0,0,.16)] backdrop-blur-xl ${className}`}>{children}</section>;
}

function PanelHeading({ eyebrow, title, icon: Icon, action }: { eyebrow?: string; title: string; icon: React.ElementType; action?: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.07] bg-white/[0.035] text-cyan-200"><Icon size={18} /></span><div className="min-w-0">{eyebrow && <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{eyebrow}</p>}<h2 className="truncate text-sm font-bold tracking-tight text-white sm:text-[15px]">{title}</h2></div></div>{action}</div>;
}

export const MyProgressWorkspace: React.FC = () => {
  const [range, setRange] = useState<Range>('7 days');
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [completedGoals, setCompletedGoals] = useState<string[]>(['g1']);
  const { showToast } = useToast();
  const chartValues = chartSets[range];
  const chartPoints = useMemo(() => chartValues.map((value, index) => `${24 + index * (552 / (chartValues.length - 1))},${158 - value * 1.28}`).join(' '), [chartValues]);
  const chartArea = `24,158 ${chartPoints} 576,158`;

  const toggleGoal = (id: string) => {
    setCompletedGoals((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showToast(completedGoals.includes(id) ? 'Goal moved back to in progress.' : 'Nice work — goal marked complete!', completedGoals.includes(id) ? 'info' : 'success');
  };

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-5 pb-2 sm:space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-semibold text-cyan-200"><Sparkles size={13} /> YOUR LEARNING, AT A GLANCE</div>
          <h1 className="text-[27px] font-extrabold tracking-[-.045em] text-white sm:text-3xl lg:text-[36px]">My <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">Progress</span></h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">Every focused session counts. Here’s how your learning journey is moving forward.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2.5 text-xs font-medium text-slate-300"><CalendarDays size={15} className="text-slate-400" /> This week <ChevronDown size={14} className="text-slate-500" /></div>
          <button onClick={() => showToast('Your progress report is being prepared.', 'success')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-2.5 text-xs font-bold text-[#06111f] shadow-[0_6px_24px_rgba(56,189,248,.16)] transition hover:brightness-110"><TrendingUp size={15} /> Progress report</button>
        </div>
      </div>

      {/* Hero insight */}
      <div className="relative isolate overflow-hidden rounded-[26px] border border-cyan-300/15 bg-[linear-gradient(115deg,#10233b_0%,#111b35_52%,#20183a_100%)] p-5 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[20%] -z-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-[11px] font-semibold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.8)]" /> You’re building momentum</div>
            <h2 className="mt-4 max-w-lg text-2xl font-extrabold leading-tight tracking-[-.035em] text-white sm:text-[32px]">Small steps today.<br /><span className="text-cyan-200">Big results tomorrow.</span></h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300/80">You’ve been showing up for your goals. Keep your streak alive and turn your effort into lasting progress.</p>
            <button onClick={() => showToast('Opening your study plan…', 'info')} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/[0.12]">Continue learning <ArrowRight size={15} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.09] bg-[#071326]/45 p-4 sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Zap size={18} /></span><p className="mt-4 text-2xl font-extrabold tracking-tight text-white">68<span className="text-base text-slate-400">%</span></p><p className="mt-1 text-[11px] text-slate-400">Overall progress</p><p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-300"><ArrowUpRight size={12} /> +8% this week</p></div>
            <div className="rounded-2xl border border-white/[0.09] bg-[#071326]/45 p-4 sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-300/10 text-orange-200"><Flame size={18} /></span><p className="mt-4 text-2xl font-extrabold tracking-tight text-white">5 <span className="text-base font-semibold text-slate-400">days</span></p><p className="mt-1 text-[11px] text-slate-400">Current study streak</p><p className="mt-2 text-[10px] font-semibold text-orange-200">Your best is 9 days</p></div>
            <div className="rounded-2xl border border-white/[0.09] bg-[#071326]/45 p-4 sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200"><Clock3 size={18} /></span><p className="mt-4 text-2xl font-extrabold tracking-tight text-white">12.5 <span className="text-base font-semibold text-slate-400">h</span></p><p className="mt-1 text-[11px] text-slate-400">Focused study time</p><p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-300"><ArrowUpRight size={12} /> +2.5 h this week</p></div>
            <div className="rounded-2xl border border-white/[0.09] bg-[#071326]/45 p-4 sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200"><Trophy size={18} /></span><p className="mt-4 text-2xl font-extrabold tracking-tight text-white">3<span className="text-base text-slate-400">/5</span></p><p className="mt-1 text-[11px] text-slate-400">Goals completed</p><p className="mt-2 text-[10px] font-semibold text-amber-200">2 more to go</p></div>
          </div>
        </div>
      </div>

      {/* Chart + weekly target */}
      <div className="grid gap-5 xl:grid-cols-[1.55fr_.8fr]">
        <Panel className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><PanelHeading eyebrow="YOUR CONSISTENCY" title="Study activity" icon={TrendingUp} /><div className="flex rounded-xl border border-white/[0.07] bg-black/20 p-1">{(['7 days', '30 days', '90 days'] as Range[]).map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition sm:px-3 ${range === item ? 'bg-cyan-300 text-[#071321]' : 'text-slate-400 hover:text-white'}`}>{item}</button>)}</div></div>
          <div className="mt-5 flex items-end gap-3"><span className="text-3xl font-extrabold tracking-tight text-white">12h 30m</span><span className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300"><ArrowUpRight size={13} /> 18.6%</span><span className="mb-1 text-[11px] text-slate-500">vs. previous period</span></div>
          <div className="mt-4 h-[190px] w-full overflow-hidden"><svg viewBox="0 0 600 180" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label={`Study activity chart for ${range}`}><defs><linearGradient id="progressArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4DD9D0" stopOpacity=".24"/><stop offset="100%" stopColor="#4DD9D0" stopOpacity="0"/></linearGradient><linearGradient id="progressLine" x1="0" x2="1"><stop offset="0%" stopColor="#42D7D0"/><stop offset="100%" stopColor="#7D8CFF"/></linearGradient></defs>{[28,65,102,139].map(y=><line key={y} x1="24" x2="576" y1={y} y2={y} stroke="rgba(148,163,184,.12)" strokeDasharray="3 6"/>)}<polygon points={chartArea} fill="url(#progressArea)"/><polyline points={chartPoints} fill="none" stroke="url(#progressLine)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>{chartValues.map((v,i)=><circle key={`${v}-${i}`} cx={24+i*(552/(chartValues.length-1))} cy={158-v*1.28} r="3.5" fill="#0B1427" stroke="#70DDD8" strokeWidth="2"/> )}</svg></div>
          <div className="mt-1 flex justify-between px-1 text-[10px] font-medium text-slate-500">{(range === '7 days' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : range === '30 days' ? ['Week 1','','Week 2','','Week 3','','Week 4','',''] : ['Month 1','','','','Month 2','','','','Month 3','','','']).map((label,i)=><span key={`${label}-${i}`}>{label}</span>)}</div>
        </Panel>

        <Panel className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
          <PanelHeading eyebrow="WEEKLY TARGET" title="You’re on your way" icon={Target} />
          <div className="mt-6 flex items-center gap-5"><div className="relative flex h-28 w-28 shrink-0 items-center justify-center"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="49" fill="none" stroke="rgba(148,163,184,.12)" strokeWidth="10"/><circle cx="60" cy="60" r="49" fill="none" stroke="#55D9D0" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2*Math.PI*49*.72} ${2*Math.PI*49}`} className="drop-shadow-[0_0_7px_rgba(85,217,208,.28)]"/></svg><div className="absolute text-center"><p className="text-2xl font-extrabold text-white">72%</p><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">complete</p></div></div><div><p className="text-sm font-bold text-white">3h 36m <span className="font-medium text-slate-500">/ 5h</span></p><p className="mt-1.5 text-xs leading-5 text-slate-400">Just 1h 24m left to hit your weekly study goal.</p></div></div>
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-300">Daily consistency</span><span className="text-[10px] text-cyan-200">5 of 7 days</span></div><div className="mt-3 grid grid-cols-7 gap-2">{['M','T','W','T','F','S','S'].map((day,i)=><div key={`${day}-${i}`} className="flex flex-col items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-lg ${i<5?'bg-cyan-300/15 text-cyan-200':'bg-white/[0.045] text-slate-600'}`}>{i<5?<CheckCircle2 size={14}/>:<span className="text-[10px]">·</span>}</span><span className="text-[9px] text-slate-500">{day}</span></div>)}</div></div>
        </Panel>
      </div>

      {/* Subject and goals */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><PanelHeading eyebrow="SKILL BUILDING" title="Progress by subject" icon={BookOpen}/><button onClick={() => showToast('Your full subject breakdown is coming up next.', 'info')} className="shrink-0 text-xs font-semibold text-cyan-200 hover:text-cyan-100">View details <ArrowRight size={13} className="ml-1 inline"/></button></div><div className="mt-5 space-y-5">{subjectData.map((subject) => <div key={subject.name}><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold" style={{ background: subject.tint, color: subject.color }}>{subject.icon}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold text-slate-100 sm:text-sm">{subject.name}</p><p className="text-xs font-bold tabular-nums text-white">{subject.progress}%</p></div><p className="mt-1 text-[10px] text-slate-500">{subject.detail}</p></div></div><div className="ml-[52px] mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${subject.progress}%`, background: `linear-gradient(90deg, ${subject.color}aa, ${subject.color})` }}/></div></div>)}</div></Panel>

        <Panel className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><PanelHeading eyebrow="KEEP MOVING FORWARD" title="Learning goals" icon={Target}/><span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-300">{completedGoals.length}/3 complete</span></div><div className="mt-5 space-y-3">{[{id:'g1',title:'Finish the Mathematics syllabus',sub:'13 of 20 lessons',percent:65,color:'#8B7CFF'},{id:'g2',title:'Practice coding every week',sub:'3 of 5 sessions',percent:60,color:'#35D6C4'},{id:'g3',title:'Reach 90% in mock tests',sub:'Current average: 82%',percent:82,color:'#F4B860'}].map(goal=>{const done=completedGoals.includes(goal.id);return <button key={goal.id} onClick={()=>toggleGoal(goal.id)} className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] p-3.5 text-left transition hover:border-white/[0.12] hover:bg-white/[0.04]"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${done?'border-emerald-300/20 bg-emerald-300/10 text-emerald-200':'border-white/[0.08] bg-white/[0.035] text-slate-400'}`}>{done?<CheckCircle2 size={17}/>:<Target size={17}/>}</span><span className="min-w-0 flex-1"><span className={`block truncate text-xs font-bold ${done?'text-emerald-100':'text-slate-100'}`}>{goal.title}</span><span className="mt-1 block text-[10px] text-slate-500">{done?'Marked complete':goal.sub}</span><span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/[0.07]"><span className="block h-full rounded-full" style={{width:`${goal.percent}%`,background:goal.color}}/></span></span><span className="text-[11px] font-bold tabular-nums text-slate-300">{goal.percent}%</span></button>})}</div><p className="mt-3 text-[10px] text-slate-500">Tip: tap a goal to mark it complete or move it back to progress.</p></Panel>
      </div>

      {/* Activity and achievements */}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Panel className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><PanelHeading eyebrow="YOUR RECENT WINS" title="Recent activity" icon={Clock3}/><button onClick={()=>setShowAllActivity((value)=>!value)} className="text-xs font-semibold text-cyan-200 hover:text-cyan-100">{showAllActivity?'Show less':'See all'} <ArrowRight size={13} className="ml-1 inline"/></button></div><div className="mt-4 divide-y divide-white/[0.06]">{(showAllActivity?[...activityData,...activityData.slice(0,2)]:activityData).map((item,index)=>{const Icon=item.icon;return <div key={`${item.title}-${index}`} className="flex items-center gap-3 py-4 first:pt-1 last:pb-1"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{background:item.bg,color:item.color}}><Icon size={18}/></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-100">{item.title}</p><p className="mt-1 truncate text-[10px] text-slate-500">{item.sub}</p><p className="mt-1 text-[10px] text-slate-600">{item.time}</p></div><span className="shrink-0 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.06] px-2 py-1.5 text-[10px] font-bold text-emerald-200">{item.score}</span></div>})}</div></Panel>

        <Panel className="relative overflow-hidden p-5 sm:p-6"><div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-400/[0.08] blur-3xl"/><PanelHeading eyebrow="MILESTONES" title="Achievements unlocked" icon={Award}/><div className="mt-5 grid grid-cols-3 gap-2.5">{[{icon:Flame,title:'On fire',desc:'5-day streak',color:'#F4B860'},{icon:Zap,title:'Quick learner',desc:'10 lessons',color:'#61A8FF'},{icon:Trophy,title:'Quiz whiz',desc:'80%+ score',color:'#C4A5FF'}].map((badge)=><div key={badge.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-2 py-4 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04]" style={{color:badge.color}}><badge.icon size={21}/></span><p className="mt-3 text-[10px] font-bold text-white">{badge.title}</p><p className="mt-1 text-[9px] leading-4 text-slate-500">{badge.desc}</p></div>)}</div><div className="mt-4 rounded-2xl border border-violet-300/10 bg-violet-300/[0.045] p-4"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200"><Sparkles size={17}/></span><div><p className="text-xs font-bold text-white">You’re closer than you think</p><p className="mt-1 text-[10px] leading-5 text-slate-400">One more focused session today keeps your streak going. Make it count.</p></div></div><button onClick={()=>showToast('Let’s make your next study session count!', 'success')} className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-violet-200 hover:text-violet-100"><Play size={12}/> Start a study session <ArrowRight size={12}/></button></div></Panel>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-4 text-center sm:flex-row sm:text-left"><p className="text-[10px] text-slate-600">Your progress is a journey, not a race. Keep showing up.</p><p className="inline-flex items-center gap-1.5 text-[10px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> Sample progress data · Connect your study activity for personalized insights</p></div>
    </div>
  );
};
