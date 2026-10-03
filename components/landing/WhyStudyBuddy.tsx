import React from 'react';
import { Globe, HelpCircle, Calendar, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, iconBg, iconColor, title, description }) => {
  return (
    <div className="group relative rounded-2xl bg-[#05112e]/90 p-7 flex flex-col items-start cursor-pointer border border-blue-500/20 hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-2.5 hover:shadow-[0_20px_45px_rgba(6,182,212,0.3)] overflow-hidden">
      {/* Animated Top Gradient Accent Bar with sweep */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />

      {/* Subtle Inner Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Radial Card Corner Light Flare */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon Container with smooth spring scale and glow */}
      <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-5 border border-white/10 shadow-lg group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_28px_currentColor] transition-all duration-300 relative z-10`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors relative z-10">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed font-normal relative z-10">
        {description}
      </p>
    </div>
  );
};

export const WhyStudyBuddy: React.FC = () => {
  return (
    <section id="why-studybuddy" className="relative py-20 px-6 overflow-hidden">
      {/* 3D Crystal Origami Facets matching image.png */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Central Violet/Azure Aurora Bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-r from-blue-700/18 via-purple-700/22 to-cyan-700/18 rounded-full blur-[150px] animate-pulse-glow" />

        {/* LEFT 3D METALLIC BLUE CRYSTAL ORIGAMI SHARD */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 sm:-left-4 lg:-left-2 w-[160px] sm:w-[220px] lg:w-[280px] h-[380px] opacity-90 drop-shadow-[0_15px_35px_rgba(30,58,138,0.7)] animate-crystal-shift">
          {/* Shimmer sweep overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-crystal-sweep" />
          </div>
          <svg viewBox="0 0 280 380" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="s2-c-left-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="s2-c-left-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#2563eb" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="s2-c-left-3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0.98" />
              </linearGradient>
            </defs>
            {/* Facet 1: Main Angled Crystal Face */}
            <polygon points="0,60 180,110 240,240 60,310 0,260" fill="url(#s2-c-left-1)" />
            {/* Facet 2: Upper Reflective Crystal Bevel */}
            <polygon points="0,60 140,20 220,70 180,110" fill="url(#s2-c-left-2)" />
            {/* Facet 3: Lower Dark Facet */}
            <polygon points="60,310 240,240 210,340 40,370" fill="url(#s2-c-left-3)" />
            {/* Crisp Crystal Specular Ridge Lines */}
            <line x1="0" y1="60" x2="180" y2="110" stroke="#93c5fd" strokeWidth="1.8" strokeOpacity="0.8" />
            <line x1="180" y1="110" x2="240" y2="240" stroke="#60a5fa" strokeWidth="1.8" strokeOpacity="0.8" />
            <line x1="180" y1="110" x2="220" y2="70" stroke="#bfdbfe" strokeWidth="1.2" strokeOpacity="0.7" />
          </svg>
        </div>

        {/* RIGHT 3D METALLIC PURPLE CRYSTAL ORIGAMI SHARD */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-10 sm:-right-4 lg:-right-2 w-[160px] sm:w-[220px] lg:w-[280px] h-[380px] opacity-90 drop-shadow-[0_15px_35px_rgba(109,40,217,0.7)] animate-crystal-shift">
          {/* Shimmer sweep overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-crystal-sweep" style={{ animationDelay: '2.5s' }} />
          </div>
          <svg viewBox="0 0 280 380" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="s2-c-right-1" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#4c1d95" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="s2-c-right-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#6d28d9" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="s2-c-right-3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#5b21b6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0.98" />
              </linearGradient>
            </defs>
            {/* Facet 1: Main Angled Crystal Face */}
            <polygon points="280,60 100,110 40,240 220,310 280,260" fill="url(#s2-c-right-1)" />
            {/* Facet 2: Upper Reflective Bevel */}
            <polygon points="280,60 140,20 60,70 100,110" fill="url(#s2-c-right-2)" />
            {/* Facet 3: Lower Dark Facet */}
            <polygon points="220,310 40,240 70,340 240,370" fill="url(#s2-c-right-3)" />
            {/* Crisp Specular Ridge Lines */}
            <line x1="280" y1="60" x2="100" y2="110" stroke="#c4b5fd" strokeWidth="1.8" strokeOpacity="0.8" />
            <line x1="100" y1="110" x2="40" y2="240" stroke="#a78bfa" strokeWidth="1.8" strokeOpacity="0.8" />
            <line x1="100" y1="110" x2="60" y2="70" stroke="#ddd6fe" strokeWidth="1.2" strokeOpacity="0.7" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] mb-3 block animate-pulse">
              ✦ WHY STUDYBUDDY
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white animate-text-shimmer">
                Everything You Need
              </span> <br />
              for Better Learning
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              From personalized study plans to AI-powered assistance, we give you all the tools to learn, grow and succeed.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal animation="fade-up" delay={100} className="h-full">
            <FeatureCard
              icon={<Globe className="w-5 h-5" />}
              iconBg="bg-blue-600/20"
              iconColor="text-blue-400"
              title="AI Powered Help"
              description="Get instant answers, explanations and step-by-step support, anytime."
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={220} className="h-full">
            <FeatureCard
              icon={<HelpCircle className="w-5 h-5" />}
              iconBg="bg-purple-600/20"
              iconColor="text-purple-400"
              title="Smart Quizzes"
              description="Test your knowledge with personalized quizzes and practice tests."
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={340} className="h-full">
            <FeatureCard
              icon={<Calendar className="w-5 h-5" />}
              iconBg="bg-cyan-600/20"
              iconColor="text-cyan-400"
              title="Study Planning"
              description="Create custom study plans and stay on track with your goals."
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={460} className="h-full">
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-emerald-600/20"
              iconColor="text-emerald-400"
              title="Track Progress"
              description="See your progress, build better habits and achieve more."
            />
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
