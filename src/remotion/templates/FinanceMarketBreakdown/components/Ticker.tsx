import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface TickerProps {
  items: TickerItem[];
  delay?: number;
  speed?: number;
  height?: number;
}

export const Ticker: React.FC<TickerProps> = ({
  items,
  delay = 0,
  speed = 80,
  height = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemWidth = 220;
  const singleWidth = items.length * itemWidth;
  const scrollDuration = singleWidth / speed;

  const loopFrame = frame - delay;
  const loopedFrame = ((loopFrame % Math.ceil(fps * scrollDuration)) + Math.ceil(fps * scrollDuration)) % Math.ceil(fps * scrollDuration);
  const scrollX = interpolate(loopedFrame, [0, fps * scrollDuration], [0, -singleWidth], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(loopFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height,
        background: 'rgba(8, 8, 12, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(${scrollX}px)`,
          willChange: 'transform',
        }}
      >
        {[...items, ...items].map((item, i) => {
          const isPositive = item.change >= 0;
          const color = isPositive ? '#10B981' : '#EF4444';
          const arrow = isPositive ? '▲' : '▼';

          return (
            <div
              key={i}
              style={{
                width: itemWidth,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                gap: 16,
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', minWidth: 60 }}>
                {item.symbol}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', minWidth: 80, textAlign: 'right' }}>
                ${item.price.toFixed(2)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 80, textAlign: 'right' }}>
                {arrow} {Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
