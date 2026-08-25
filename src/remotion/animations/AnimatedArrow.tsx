import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
  color?: string;
  headSize?: number;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  color = 'rgba(255, 255, 255, 0.6)',
  headSize = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const drawFrames = Math.floor(fps * 0.4);
  const progress = interpolate(frame - delay, [0, drawFrames], [0, length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentX = startX + (endX - startX) * (progress / length);
  const currentY = startY + (endY - startY) * (progress / length);

  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <line
          x1={startX}
          y1={startY}
          x2={currentX}
          y2={currentY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {progress > length * 0.1 && (
          <polygon
            points={`0,0 ${-headSize},${-headSize / 2} ${-headSize},${headSize / 2}`}
            fill={color}
            transform={`translate(${currentX}, ${currentY}) rotate(${angle})`}
          />
        )}
      </svg>
    </div>
  );
};
