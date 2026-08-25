import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LowerThirdProps {
  headline: string;
  subheadline?: string;
  delay?: number;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  headline,
  subheadline,
  delay = 0,
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideX = spring({
    fps,
    frame: frame - delay,
    config: { damping: 16, stiffness: 100 },
  });

  const translateX = interpolate(slideX, [0, 1], [-120, 0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 60,
        maxWidth: 700,
        opacity,
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'rgba(8, 8, 12, 0.9)',
          borderLeft: `4px solid ${accentColor}`,
          padding: '20px 28px',
          borderRadius: '0 12px 12px 0',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            marginBottom: subheadline ? 8 : 0,
          }}
        >
          {headline}
        </div>
        {subheadline && (
          <div
            style={{
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 500,
            }}
          >
            {subheadline}
          </div>
        )}
      </div>
    </div>
  );
};
