import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CompanyData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio?: number;
}

export interface CompanyComparisonProps {
  left: CompanyData;
  right: CompanyData;
  delay?: number;
}

export const CompanyComparison: React.FC<CompanyComparisonProps> = ({
  left,
  right,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rightOpacity = interpolate(frame - delay - 10, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftScale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 100 },
  });

  const rightScale = spring({
    fps,
    frame: frame - delay - 10,
    config: { damping: 14, stiffness: 100 },
  });

  const renderCompany = (company: CompanyData, side: 'left' | 'right') => {
    const isPositive = company.change >= 0;
    const color = isPositive ? '#10B981' : '#EF4444';
    const arrow = isPositive ? '▲' : '▼';
    const opacity = side === 'left' ? leftOpacity : rightOpacity;
    const scale = side === 'left' ? leftScale : rightScale;

    return (
      <div
        style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '32px 36px',
          width: 'clamp(280px, 22vw, 420px)',
          transform: `scale(${scale})`,
          opacity,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            backgroundColor: color,
            opacity: 0.7,
          }}
        />

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            {company.symbol}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            {company.name}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            ${company.price.toFixed(2)}
          </div>
          <div style={{ fontSize: 16, color, fontWeight: 600, marginTop: 4 }}>
            {arrow} ${Math.abs(company.change).toFixed(2)} ({company.changePercent.toFixed(2)}%)
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            padding: '16px 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Market Cap</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{company.marketCap}</div>
          </div>
          {company.peRatio !== undefined && (
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>P/E Ratio</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{company.peRatio.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(16px, 3vw, 48px)',
        pointerEvents: 'none',
      }}
    >
      {renderCompany(left, 'left')}
      {renderCompany(right, 'right')}
    </div>
  );
};
