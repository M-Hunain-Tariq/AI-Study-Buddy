import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Target, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface StatItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, iconBg, iconColor, value, label }) => {
  return (
    <div className="bg-[#05112e]/90 p-6 rounded-2xl border border-blue-500/20 hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-2.5 hover:shadow-[0_20px_45px_rgba(6,182,212,0.3)] flex flex-col items-center text-center group cursor-pointer relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
      <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3 group-hover:scale-120 group-hover:rotate-6 group-hover:shadow-[0_0_28px_currentColor] transition-all duration-300 shadow-lg`}>
        {icon}
      </div>
      <div className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums mb-1 group-hover:text-cyan-200 transition-colors">
        {value}
      </div>
      <div className="text-xs text-slate-300 font-medium">
        {label}
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  avatarUrl: string;
  name: string;
  role: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ avatarUrl, name, role, quote }) => {
  return (
    <div className="bg-[#05112e]/90 p-7 rounded-2xl border border-blue-500/20 hover:border-cyan-400/80 flex flex-col justify-between group transition-all duration-300 transform hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(6,182,212,0.25)] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
      <div>
        {/* Real Student Avatar at top with ring hover */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] mb-4 flex-shrink-0 group-hover:scale-115 group-hover:border-cyan-300 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.85)] transition-all">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Testimonial Quote */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div>
        {/* Author Name & Role */}
        <h4 className="font-heading text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-slate-400 mb-2">
          {role}
        </p>

        {/* 5 Golden Stars with subtle glow */}
        <div className="flex items-center gap-1 text-amber-400 group-hover:scale-105 transition-transform origin-left">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrustSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({ students: 0, completion: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let frame = 0;
          const totalFrames = 30;
          const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            setCounts({
              students: Math.round(100 * progress),
              completion: Math.round(95 * progress),
            });
            if (frame >= totalFrames) clearInterval(timer);
          }, 25);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="reviews" ref={sectionRef} className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-3 block animate-pulse">
              ✦ REAL STUDENTS. REAL RESULTS.
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white animate-text-shimmer">
                Trusted by Learners Worldwide
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Join thousands of students who are already achieving their goals with AI StudyBuddy.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <ScrollReveal animation="fade-up" delay={100} className="h-full">
            <StatItem
              icon={<Users className="w-6 h-6" />}
              iconBg="bg-blue-600/20"
              iconColor="text-blue-400"
              value={`${hasAnimated ? counts.students : 100}K+`}
              label="Active Students"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200} className="h-full">
            <StatItem
              icon={<MessageSquare className="w-6 h-6" />}
              iconBg="bg-purple-600/20"
              iconColor="text-purple-400"
              value="1M+"
              label="Questions Answered"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={300} className="h-full">
            <StatItem
              icon={<Target className="w-6 h-6" />}
              iconBg="bg-cyan-600/20"
              iconColor="text-cyan-400"
              value={`${hasAnimated ? counts.completion : 95}%`}
              label="Goal Completion Rate"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={400} className="h-full">
            <StatItem
              icon={<Star className="w-6 h-6 fill-amber-400 text-amber-400" />}
              iconBg="bg-amber-600/20"
              iconColor="text-amber-400"
              value="4.8/5"
              label="Average Rating"
            />
          </ScrollReveal>
        </div>

        {/* 3 Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal animation="fade-up" delay={150} className="h-full">
            <TestimonialCard
              avatarUrl="/landing/avatar_ayesha_1790173584033.jpg"
              name="Ayesha Khan"
              role="Computer Science Student"
              quote="StudyBuddy made learning so much easier! The AI assistant is amazing and the quizzes really help me remember what I learn."
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300} className="h-full">
            <TestimonialCard
              avatarUrl="/landing/avatar_usman_1790173602592.jpg"
              name="Usman Raza"
              role="Engineering Student"
              quote="I love the study planner feature. It keeps me organized and helps me stay consistent. I've improved a lot since using this app!"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={450} className="h-full">
            <TestimonialCard
              avatarUrl="/landing/avatar_sara_1790173616158.jpg"
              name="Sara Ali"
              role="Medical Student"
              quote="The best learning app I've ever used. Simple, powerful and super helpful. Highly recommended!"
            />
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
