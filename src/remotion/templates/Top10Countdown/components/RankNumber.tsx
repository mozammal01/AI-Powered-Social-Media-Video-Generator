import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export interface RankNumberProps {
  rank: number;
  enterFrame?: number;
  size?: number;
  color?: string;
  glowColor?: string;
}

export const RankNumber: React.FC<RankNumberProps> = ({
  rank,
  enterFrame = 0,
  size = 140,
  color = '#FFFFFF',
  glowColor = 'rgba(255,255,255,0.4)',
}) => {
  const frame = useCurrentFrame();
  const local = frame - enterFrame;

  const scale = spring({
    fps: 30,
    frame: local,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 28,
  });

  const rotate = interpolate(local, [0, 18], [-25, 0], {
    extrapolateRight: 'clamp',
  });

  const blur = interpolate(local, [0, 12], [16, 0], {
    extrapolateRight: 'clamp',
  });

  const shadow = interpolate(local, [0, 20], [0, 24], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 1.2,
        height: size * 1.2,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px) drop-shadow(0 ${shadow}px ${shadow * 2}px ${glowColor})`,
      }}
    >
      <span
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          fontSize: size * 0.9,
          fontWeight: 900,
          lineHeight: 1,
          color,
          textShadow: `0 0 ${size * 0.3}px ${glowColor}`,
        }}
      >
        #{rank}
      </span>
    </div>
  );
};
