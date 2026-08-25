import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NumberCounterProps {
  value: number;
  delay?: number;
  duration?: number;
  color?: string;
  size?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  delay = 0,
  duration = 40,
  color = '#6366F1',
  size = 48,
  prefix = '',
  suffix = '',
  decimals = 0,
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
      {prefix}
      {displayed.toFixed(decimals)}
      {suffix}
    </span>
  );
};
