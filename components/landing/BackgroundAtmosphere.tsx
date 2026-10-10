import React from 'react';

/** Lightweight ambient background: keeps the premium cyan/indigo atmosphere
 * without per-frame React updates, large blurred layers, or dozens of animations. */
export const BackgroundAtmosphere: React.FC = () => (
  <div
    aria-hidden="true"
    className="landing-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
  >
    <div className="landing-atmosphere__base" />
    <div className="landing-atmosphere__glow landing-atmosphere__glow--cyan" />
    <div className="landing-atmosphere__glow landing-atmosphere__glow--violet" />
    <div className="landing-atmosphere__grid" />
    <div className="landing-atmosphere__orb landing-atmosphere__orb--one" />
    <div className="landing-atmosphere__orb landing-atmosphere__orb--two" />
    <span className="landing-atmosphere__star landing-atmosphere__star--one" />
    <span className="landing-atmosphere__star landing-atmosphere__star--two" />
    <span className="landing-atmosphere__star landing-atmosphere__star--three" />
  </div>
);
