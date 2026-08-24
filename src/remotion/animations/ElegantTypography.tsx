import React from 'react';
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ElegantTypography: React.FC<{
  text: string;
  delay?: number;
  className?: string;
  type?: 'title' | 'subtitle';
}> = ({ text, delay = 0, className = '', type = 'title' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame: frame - delay,
    config: { damping: 100, stiffness: 50 }, // Very slow, luxurious reveal
  });

  const letterSpacing = interpolate(
    entrance,
    [0, 1],
    type === 'title' ? [0.5, 0.2] : [0.2, 0.4], // Title condenses, subtitle expands
    { extrapolateRight: 'clamp' }
  );

  const opacity = interpolate(
    frame - delay,
    [0, 30], // 1 second fade in
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const blur = interpolate(
    frame - delay,
    [0, 30],
    [20, 0],
    { extrapolateRight: 'clamp' }
  );

  const scale = interpolate(
    frame - delay,
    [0, 150], // Slow track in over 5 seconds
    [type === 'title' ? 1.05 : 0.95, 1],
    { extrapolateRight: 'clamp' }
  );

  const baseStyle: React.CSSProperties = {
    fontFamily: type === 'title' ? '"Playfair Display", serif' : '"Inter", sans-serif',
    textTransform: type === 'title' ? 'none' : 'uppercase',
    letterSpacing: `${letterSpacing}em`,
    opacity,
    filter: `blur(${blur}px)`,
    transform: `scale(${scale})`,
    willChange: 'transform, opacity, filter',
    color: 'white',
    textAlign: 'center',
  };

  return (
    <div style={baseStyle} className={className}>
      {text}
    </div>
  );
};
