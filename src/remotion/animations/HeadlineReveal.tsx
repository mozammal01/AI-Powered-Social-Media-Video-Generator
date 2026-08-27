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
    <div style={{ overflow: 'hidden', padding: 8 }}>
      <div 
        style={{ transform: `translateY(${translateY}%)`, fontSize: 72, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.5))' }}
      >
        {text}
      </div>
    </div>
  );
};
