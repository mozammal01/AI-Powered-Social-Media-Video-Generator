import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PercentageAnimationProps {
  value: number;
  delay?: number;
  duration?: number;
  color?: string;
  size?: number;
  suffix?: string;
}

export const PercentageAnimation: React.FC<PercentageAnimationProps> = ({
  value,
  delay = 0,
  duration = 30,
  color = '#6366F1',
  size = 48,
  suffix = '%',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 120 },
  });

  const displayed = interpolate(frame - delay, [0, duration], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontSize: `${size}px`,
        fontWeight: 800,
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color,
        transform: `scale(${scale})`,
        lineHeight: 1,
        textShadow: `0 0 30px ${color}44`,
      }}
    >
      {Math.round(displayed)}
      <span style={{ fontSize: `${size * 0.5}px`, marginLeft: 2, opacity: 0.7 }}>
        {suffix}
      </span>
    </span>
  );
};
