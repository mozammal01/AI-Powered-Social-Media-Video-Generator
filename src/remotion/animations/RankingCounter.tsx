import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const RankingCounter: React.FC<{
  rank: number;
  total: number;
  color?: string;
  size?: number;
}> = ({ rank, total, color = 'text-white', size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for popping in
  const scale = spring({
    fps,
    frame,
    config: {
      damping: 12,
      stiffness: 200,
    },
  });

  // A slight rotation effect
  const rotate = interpolate(frame, [0, 15], [-20, 0], {
    extrapolateRight: 'clamp',
  });

  // Motion blur effect on entry
  const blur = interpolate(frame, [0, 10], [10, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`font-black uppercase italic leading-none drop-shadow-2xl flex items-center ${color}`}
      style={{
        fontSize: `${size}px`,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px)`,
        textShadow: '0 10px 20px rgba(0,0,0,0.5)',
      }}
    >
      <span className="text-4xl mr-2">#</span>
      {rank}
    </div>
  );
};
