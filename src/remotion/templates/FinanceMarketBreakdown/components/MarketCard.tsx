import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MarketData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
}

export interface MarketCardProps {
  data: MarketData;
  delay?: number;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  data,
  delay = 0,
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 100 },
  });

  const translateY = interpolate(scale, [0, 1], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isPositive = data.change >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: '24px 28px',
        minWidth: 260,
        maxWidth: 340,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          backgroundColor: accentColor,
          opacity: 0.7,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            {data.symbol}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {data.company}
          </div>
        </div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: changeColor,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {arrow} {Math.abs(data.changePercent).toFixed(2)}%
        </div>
      </div>

      <div style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
        ${data.price.toFixed(2)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: changeColor, fontWeight: 600 }}>
          {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
        </span>
        {data.volume && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Vol: {data.volume}
          </span>
        )}
      </div>
    </div>
  );
};
