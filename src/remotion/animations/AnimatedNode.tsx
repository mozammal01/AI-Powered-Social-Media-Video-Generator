import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Network, Database, Cpu, Brain, type LucideIcon } from 'lucide-react';

export const ICONS: Record<string, LucideIcon> = {
  Network,
  Database,
  Cpu,
  Brain,
};

export const AnimatedNode: React.FC<{
  title: string;
  iconName?: keyof typeof ICONS;
  delay?: number;
  color?: string;
}> = ({ title, iconName = 'Database', delay = 0, color = '#6366F1' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 12, stiffness: 150 },
  });

  const time = (frame - delay) / fps;
  const pulse = interpolate(
    Math.sin(time * 3),
    [-1, 1],
    [0.5, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const Icon = ICONS[iconName];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: frame >= delay ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          borderRadius: '50%',
          opacity: 0.3,
          filter: 'blur(48px)',
          width: 120,
          height: 120,
          backgroundColor: color,
          transform: `scale(${pulse * 1.5})`,
          transition: 'transform 0.1s linear',
        }}
      />
      <div style={{
        width: 96,
        height: 96,
        borderRadius: 16,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 10,
        backgroundColor: 'rgba(15, 15, 20, 0.85)',
      }}>
        {Icon && <Icon style={{ width: 48, height: 48, color: '#FFFFFF' }} />}
      </div>
      <div style={{ marginTop: 16, fontWeight: 700, color: '#FFFFFF', fontSize: 20, textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 10 }}>
        {title}
      </div>
    </div>
  );
};
