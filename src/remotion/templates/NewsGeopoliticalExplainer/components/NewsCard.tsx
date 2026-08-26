import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NewsCardProps {
  headline: string;
  source: string;
  delay?: number;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  headline,
  source,
  delay = 0,
  accentColor = '#EF4444',
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

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: '20px 24px',
        minWidth: 280,
        maxWidth: 420,
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
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {source}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        }}
      >
        {headline}
      </div>
    </div>
  );
};
