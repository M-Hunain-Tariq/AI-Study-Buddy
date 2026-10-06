'use client';

import React from 'react';

export const AnimatedBackground: React.FC = () => (
  <div aria-hidden="true" className="fresh-background fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="fresh-glow fresh-glow-a" />
    <div className="fresh-glow fresh-glow-b" />
    <div className="fresh-grid" />
    <div className="fresh-noise" />
    <div className="fresh-aurora fresh-aurora-a" />
    <div className="fresh-aurora fresh-aurora-b" />
    <div className="fresh-orbit fresh-orbit-a" />
    <div className="fresh-orbit fresh-orbit-b" />
    <span className="fresh-star fresh-star-1" /><span className="fresh-star fresh-star-2" /><span className="fresh-star fresh-star-3" />
    <span className="fresh-star fresh-star-4" /><span className="fresh-star fresh-star-5" /><span className="fresh-star fresh-star-6" />
  </div>
);
