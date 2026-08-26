import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface RoutePoint {
  x: number;
  y: number;
}

export interface RouteLineProps {
  points: RoutePoint[];
  delay?: number;
  color?: string;
  width?: number;
  animated?: boolean;
  drawDuration?: number;
}

export const RouteLine: React.FC<RouteLineProps> = ({
  points,
  delay = 0,
  color = 'rgba(239, 68, 68, 0.8)',
  width = 3,
  animated = true,
  drawDuration = 60,
}) => {
  const frame = useCurrentFrame();

  if (points.length < 2) return null;

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const pathLength = points.reduce((acc, _, i) => {
    if (i === 0) return 0;
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  const progress = animated
    ? interpolate(frame - delay, [0, drawDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const dashOffset = pathLength * (1 - progress);

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{ willChange: 'stroke-dashoffset' }}
      />
      {progress > 0.9 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={width + 2}
          fill={color}
          opacity={0.8}
        />
      )}
    </svg>
  );
};
