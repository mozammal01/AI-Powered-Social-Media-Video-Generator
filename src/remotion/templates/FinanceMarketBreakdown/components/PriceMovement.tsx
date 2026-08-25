import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PriceMovementProps {
  fromPrice: number;
  toPrice: number;
  delay?: number;
  duration?: number;
  color?: string;
  size?: number;
}

export const PriceMovement: React.FC<PriceMovementProps> = ({
  fromPrice,
  toPrice,
  delay = 0,
  duration = 30,
  color,
  size = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isUp = toPrice >= fromPrice;
  const resolvedColor = color || (isUp ? '#10B981' : '#EF4444');

  const scale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 120 },
  });

  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentPrice = fromPrice + (toPrice - fromPrice) * progress;
  const arrowY = interpolate(progress, [0, 1], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: `${size}px`,
          fontWeight: 800,
          fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
          color: resolvedColor,
          lineHeight: 1,
          textShadow: `0 0 30px ${resolvedColor}44`,
        }}
      >
        ${currentPrice.toFixed(2)}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          opacity: progress > 0.1 ? 1 : 0,
          transform: `translateY(${arrowY}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <span style={{ fontSize: `${size * 0.5}px`, color: resolvedColor }}>
          {isUp ? '▲' : '▼'}
        </span>
        <span style={{ fontSize: `${size * 0.4}px`, color: resolvedColor, fontWeight: 600 }}>
          {isUp ? '+' : ''}{((toPrice - fromPrice) / fromPrice * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
