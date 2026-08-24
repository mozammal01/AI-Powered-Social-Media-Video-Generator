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
}> = ({ title, iconName = 'Database', delay = 0, color = 'bg-blue-500' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - delay,
    config: { damping: 12, stiffness: 150 },
  });

  const time = (frame - delay) / fps;
  const pulse = interpolate(
    Math.sin(time * 3), // 3 radians per second
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
      }}
      className="flex flex-col items-center justify-center relative"
    >
      <div 
        className={`absolute rounded-full opacity-30 blur-xl ${color}`}
        style={{
          width: 120,
          height: 120,
          transform: `scale(${pulse * 1.5})`,
          transition: 'transform 0.1s linear',
        }}
      />
      <div className={`w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center border border-white/20 z-10 ${color}`}>
        {Icon && <Icon className="text-white w-12 h-12" />}
      </div>
      <div className="mt-4 font-bold text-white text-xl drop-shadow-md z-10">
        {title}
      </div>
    </div>
  );
};
