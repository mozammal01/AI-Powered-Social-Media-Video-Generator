import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const CinematicCamera: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Very slow, constant dolly-in effect to simulate a heavy camera rig
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateRight: 'clamp',
  });

  // Extremely subtle pan to give it life
  const translateX = interpolate(frame, [0, durationInFrames], [0, 20]);
  const translateY = interpolate(frame, [0, durationInFrames], [0, -10]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
