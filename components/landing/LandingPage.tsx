'use client';

import React, { useState } from 'react';
import { BackgroundAtmosphere } from './BackgroundAtmosphere';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { WhyStudyBuddy } from './WhyStudyBuddy';
import { HowItWorks } from './HowItWorks';
import { SeeItInAction } from './SeeItInAction';
import { TrustSection } from './TrustSection';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { SignupModal } from './SignupModal';

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSignup = () => {
    setIsModalOpen(true);
  };

  const handleCloseSignup = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="landing-page relative min-h-screen bg-[#020817] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-clip">
      {/* Cinematic Multi-layered Atmospheric Background */}
      <BackgroundAtmosphere />

      {/* Main Page Content Flow */}
      <div className="relative z-10">
        {/* Navigation - Only Logo */}
        <Navbar />

        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Why StudyBuddy */}
        <WhyStudyBuddy />

        {/* 3. How It Works */}
        <HowItWorks />

        {/* 4. See It In Action */}
        <SeeItInAction />

        {/* 5. Trusted By Learners Worldwide */}
        <TrustSection />

        {/* 6. Final CTA */}
        <FinalCTA onStartFree={handleOpenSignup} />

        {/* 7. Footer */}
        <Footer />
      </div>

      {/* Interactive Signup / Onboarding Modal */}
      <SignupModal isOpen={isModalOpen} onClose={handleCloseSignup} />
    </div>
  );
}
