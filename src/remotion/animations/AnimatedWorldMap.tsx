import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const AnimatedWorldMap: React.FC<{
  pointsOfInterest?: { x: number; y: number }[];
}> = ({ pointsOfInterest = [{ x: 300, y: 150 }, { x: 700, y: 250 }, { x: 500, y: 100 }] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="relative w-full h-full opacity-30">
      {/* Simplified SVG Map representation using a grid/dots pattern for broadcast look */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)',
        backgroundSize: '20px 20px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
      }} />

      {/* Radar blips */}
      {pointsOfInterest.map((point, i) => {
        // One pulse every 3 seconds, offset by 1.3 seconds per point
        const ringProgress = (frame + i * (fps * 1.3)) % (fps * 3);
        const scale = interpolate(ringProgress, [0, fps * 3], [0, 3]);
        const opacity = interpolate(ringProgress, [0, fps * 3], [1, 0]);

        return (
          <div key={i} style={{ position: 'absolute', left: point.x, top: point.y }}>
            <div className="absolute w-4 h-4 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div 
              className="absolute w-12 h-12 border-2 border-red-600 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
