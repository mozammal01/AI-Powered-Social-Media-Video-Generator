import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  intensity?: number;
}> = ({ children, style, intensity = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Create a subtle moving reflection sweep
  const reflectionProgress = interpolate(
    (frame % (durationInFrames / 2)), 
    [0, durationInFrames / 2], 
    [-100, 200]
  );

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: `blur(${intensity}px)`,
        WebkitBackdropFilter: `blur(${intensity}px)`, // For safari support
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Moving reflection element */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)',
          transform: `translateX(${reflectionProgress}%)`,
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};
