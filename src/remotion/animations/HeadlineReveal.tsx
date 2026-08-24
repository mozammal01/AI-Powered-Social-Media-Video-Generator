import React from 'react';
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const HeadlineReveal: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 100 },
  });

  const translateY = interpolate(reveal, [0, 1], [100, 0]);

  return (
    <div className="overflow-hidden p-2">
      <div 
        style={{ transform: `translateY(${translateY}%)` }}
        className="text-8xl font-black text-white uppercase drop-shadow-2xl"
      >
        {text}
      </div>
    </div>
  );
};
