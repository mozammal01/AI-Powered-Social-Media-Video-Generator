import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const LiveBadge: React.FC = () => {
  const frame = useCurrentFrame();

  // Pulse effect based on frames
  const opacity = interpolate(
    Math.sin(frame / 10),
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
