import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedCardProps {
  title: string;
  value?: string;
  description?: string;
  delay?: number;
  color?: string;
  accentColor?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  value,
  description,
  delay = 0,
  color = 'rgba(255, 255, 255, 0.04)',
  accentColor = '#6366F1',
  style,
  icon,
  children,
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
        background: color,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '28px 32px',
        minWidth: 280,
        maxWidth: 380,
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
      {icon && (
        <div style={{ marginBottom: 12, color: accentColor }}>{icon}</div>
      )}
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: 20,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      {value && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: accentColor,
            marginBottom: 6,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
      )}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          {description}
        </p>
      )}
      {children && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
};
