import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ConnectingLine: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
}> = ({ startX, startY, endX, endY, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  
  // Draw line over ~0.66 seconds
  const drawFrames = Math.floor(fps * (20 / 30));
  const progress = interpolate(frame - delay, [0, drawFrames], [0, length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 1 packet per second
  const dataPacketProgress = interpolate(
    (frame - delay) % fps,
    [0, fps],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  
  const currentX = startX + (endX - startX) * dataPacketProgress;
  const currentY = startY + (endY - startY) * dataPacketProgress;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <svg style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="4"
          strokeDasharray={length}
          strokeDashoffset={length - progress}
        />
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="4"
          strokeDasharray="10 15"
          strokeDashoffset={length - progress}
        />
      </svg>
      {frame > delay + drawFrames && (
        <div 
          className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          style={{
            transform: `translate(${currentX - 8}px, ${currentY - 8}px)`,
          }}
        />
      )}
    </div>
  );
};
