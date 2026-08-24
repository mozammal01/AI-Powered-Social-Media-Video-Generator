import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SplitScreenTransition: React.FC<{
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  delay?: number;
}> = ({ leftContent, rightContent, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Left panel slides from left
  const leftSlide = spring({
    fps,
    frame: frame - delay,
    config: { damping: 16, stiffness: 100 },
  });
  const leftTranslate = interpolate(leftSlide, [0, 1], [-width / 2, 0]);

  // Right panel slides from right
  const rightSlide = spring({
    fps,
    frame: frame - delay - 5, // slightly staggered
    config: { damping: 16, stiffness: 100 },
  });
  const rightTranslate = interpolate(rightSlide, [0, 1], [width / 2, 0]);

  // Center divider line growing
  const dividerHeight = spring({
    fps,
    frame: frame - delay - 15,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Left */}
      <div 
        className="w-1/2 h-full relative"
        style={{ transform: `translateX(${leftTranslate}px)` }}
      >
        {leftContent}
      </div>

      {/* Right */}
      <div 
        className="w-1/2 h-full relative bg-neutral-900"
        style={{ transform: `translateX(${rightTranslate}px)` }}
      >
        {rightContent}
      </div>

      {/* Divider */}
      <div 
        className="absolute left-1/2 top-1/2 w-2 bg-red-600 -translate-x-1/2 -translate-y-1/2"
        style={{ height: `${dividerHeight * 100}%` }}
      />
    </div>
  );
};
