import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export interface StatisticProps {
  value: string;
  label: string;
  enterFrame?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Statistic: React.FC<StatisticProps> = ({
  value,
  label,
  enterFrame = 0,
  color = '#FF3B3B',
  size = 'md',
}) => {
  const frame = useCurrentFrame();
  const local = frame - enterFrame;

  const scale = spring({
    fps: 30,
    frame: local,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 24,
  });

  const y = interpolate(local, [0, 18], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const sizes = {
    sm: { value: 28, label: 11, gap: 6 },
    md: { value: 42, label: 13, gap: 8 },
    lg: { value: 64, label: 15, gap: 10 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: s.gap,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: 'left center',
      }}
    >
      <span
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          fontSize: s.value,
          fontWeight: 900,
          lineHeight: 1,
          color,
          textShadow: `0 0 ${s.value * 0.4}px ${color}88`,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: s.label,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {label}
      </span>
    </div>
  );
};
