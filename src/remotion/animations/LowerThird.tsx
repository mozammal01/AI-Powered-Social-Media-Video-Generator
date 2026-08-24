import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const LowerThird: React.FC<{
  headline: string;
  subheadline: string;
  delay?: number;
}> = ({ headline, subheadline, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from left
  const slideIn = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 120 },
  });

  const translateX = interpolate(slideIn, [0, 1], [-800, 0]);

  // Delay the subheadline slightly
  const subSlideIn = spring({
    fps,
    frame: frame - delay - 10,
    config: { damping: 14, stiffness: 120 },
  });
  
  const subTranslateX = interpolate(subSlideIn, [0, 1], [-800, 0]);

  return (
    <div className="absolute bottom-24 left-16 z-50 flex flex-col drop-shadow-2xl font-sans">
      <div 
        className="bg-red-600 text-white px-6 py-3 font-black text-4xl uppercase tracking-wider"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {headline}
      </div>
      <div 
        className="bg-white text-black px-6 py-2 font-bold text-2xl uppercase tracking-wide border-b-4 border-red-600"
        style={{ transform: `translateX(${subTranslateX}px)` }}
      >
        {subheadline}
      </div>
    </div>
  );
};
