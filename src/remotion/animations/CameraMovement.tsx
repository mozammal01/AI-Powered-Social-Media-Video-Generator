import React from 'react';
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CameraStop {
  frame: number;
  x: number;
  y: number;
  scale: number;
}

export const CameraMovement: React.FC<{
  children: React.ReactNode;
  stops: CameraStop[];
}> = ({ children, stops }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let currentX = stops[0].x;
  let currentY = stops[0].y;
  let currentScale = stops[0].scale;

  for (let i = 1; i < stops.length; i++) {
    const prevStop = stops[i - 1];
    const nextStop = stops[i];

    if (frame >= prevStop.frame) {
      const progress = spring({
        fps,
        frame: frame - prevStop.frame,
        config: { damping: 14, stiffness: 60 },
      });

      // We only interpolate if we haven't reached the next stop's start frame
      // Actually, spring naturally settles. We just map progress (0 to 1) to the delta.
      const mappedProgress = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: 'clamp'
      });

      if (frame < nextStop.frame || i === stops.length - 1) {
          currentX = interpolate(mappedProgress, [0, 1], [prevStop.x, nextStop.x]);
          currentY = interpolate(mappedProgress, [0, 1], [prevStop.y, nextStop.y]);
          currentScale = interpolate(mappedProgress, [0, 1], [prevStop.scale, nextStop.scale]);
      }
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        transformOrigin: 'top left',
        transform: `scale(${currentScale}) translate(${-currentX}px, ${-currentY}px)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
