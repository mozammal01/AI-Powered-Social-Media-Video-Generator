import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ProgressBar: React.FC<{
  color?: string;
  height?: number;
}> = ({ color = 'bg-yellow-400', height = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 50,
      }}
    >
      <div
        className={color}
        style={{
          height: '100%',
          width: `${progress}%`,
        }}
      />
    </div>
  );
};
