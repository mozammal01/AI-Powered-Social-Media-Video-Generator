import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const KineticText: React.FC<{
  text: string;
  style?: React.CSSProperties;
  className?: string;
  delay?: number;
}> = ({ text, style, className = 'text-5xl font-bold text-white', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', ...style }} className={className}>
      {words.map((word, index) => {
        const wordDelay = delay + index * 3;
        
        const scale = spring({
          fps,
          frame: frame - wordDelay,
          config: { damping: 10, stiffness: 200 },
        });

        const y = interpolate(frame - wordDelay, [0, 10], [50, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        
        const blur = interpolate(frame - wordDelay, [0, 8], [15, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `scale(${scale}) translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              opacity: frame >= wordDelay ? 1 : 0,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
