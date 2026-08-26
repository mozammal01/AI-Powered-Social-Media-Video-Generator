import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface CountryHighlightProps {
  x: number;
  y: number;
  delay?: number;
  color?: string;
  label?: string;
  size?: number;
}

export const CountryHighlight: React.FC<CountryHighlightProps> = ({
  x,
  y,
  delay = 0,
  color = '#EF4444',
  label,
  size = 8,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: size * 3,
          height: size * 3,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          opacity: 0.6 * scale,
          transform: `scale(${scale})`,
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -(size * 1.5),
          marginTop: -(size * 1.5),
        }}
      />
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: scale,
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      {label && (
        <div
          style={{
            position: 'absolute',
            top: -(size * 2),
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            opacity: scale,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
