'use client';

import React from 'react';

export const AnimatedBackground: React.FC = () => (
  <div aria-hidden="true" className="fresh-background fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="fresh-glow fresh-glow-a" />
    <div className="fresh-glow fresh-glow-b" />
    <div className="fresh-grid" />
    <div className="fresh-noise" />
  </div>
);
