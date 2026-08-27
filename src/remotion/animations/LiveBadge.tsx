import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const LiveBadge: React.FC = () => {
  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  // Pulse effect based on time (frame / fps)
  const time = frame / fps;
  const opacity = interpolate(
    Math.sin(time * 3), // 3 radians per second
    [-1, 1],
    [0.4, 1]
  );

  return (
    <div style={{ position: 'absolute', top: 48, left: 48, zIndex: 50, display: 'flex', alignItems: 'center', backgroundColor: '#DC2626', padding: '6px 16px', filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))' }}>
      <div 
        style={{ width: 12, height: 12, backgroundColor: '#FFFFFF', borderRadius: '50%', marginRight: 8, opacity }}
      />
      <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 20, letterSpacing: '0.1em' }}>LIVE</span>
    </div>
  );
};
