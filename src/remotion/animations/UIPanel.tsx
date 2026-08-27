import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const UIPanel: React.FC<{
  title: string;
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ title, children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 120 },
  });

  const yOffset = interpolate(translateY, [0, 1], [50, 0]);
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `translateY(${yOffset}px)`,
        opacity,
        backgroundColor: '#18181b',
        border: '1px solid #3f3f46',
        borderRadius: 12,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <div style={{ backgroundColor: '#27272a', padding: '8px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #3f3f46' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EAB308' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22C55E' }} />
        </div>
        <div style={{ marginLeft: 'auto', marginRight: 'auto', color: '#a1a1aa', fontWeight: 500, fontSize: 14 }}>{title}</div>
      </div>
      <div style={{ padding: 24, flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};
