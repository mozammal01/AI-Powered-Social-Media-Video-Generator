import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface CountdownProgressBarProps {
  totalItems?: number;
  currentRank?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  enterFrame?: number;
}

export const CountdownProgressBar: React.FC<CountdownProgressBarProps> = ({
  totalItems = 10,
  currentRank = 10,
  height = 6,
  color = '#FF3B3B',
  backgroundColor = 'rgba(255,255,255,0.12)',
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min(1, (totalItems - currentRank + 1) / totalItems));

  const barWidth = interpolate(frame, [enterFrame, enterFrame + 16], [0, progress * 100], {
    extrapolateRight: 'clamp',
  });

  const glowPulse = 1 + Math.sin((frame - enterFrame) * 0.3) * 0.25;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height,
        backgroundColor,
        zIndex: 50,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${barWidth}%`,
          backgroundColor: color,
          boxShadow: `0 0 ${height * 2}px ${color}${Math.min(255, Math.round(120 * glowPulse)).toString(16).padStart(2, '0')}`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};
