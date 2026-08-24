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
        ...style
      }}
      className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="bg-neutral-800 px-4 py-2 flex items-center border-b border-neutral-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="mx-auto text-neutral-400 font-medium text-sm">{title}</div>
      </div>
      <div className="p-6 flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};
