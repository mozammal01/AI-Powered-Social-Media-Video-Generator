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
    <div className="absolute top-12 left-12 z-50 flex items-center bg-red-600 px-4 py-1.5 rounded-sm drop-shadow-lg">
      <div 
        className="w-3 h-3 bg-white rounded-full mr-2"
        style={{ opacity }}
      />
      <span className="text-white font-black text-xl tracking-widest">LIVE</span>
    </div>
  );
};
