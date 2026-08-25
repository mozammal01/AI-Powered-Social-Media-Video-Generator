import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Easing } from 'remotion';

export interface TransitionProps {
  type?: 'slide' | 'zoom' | 'wipe' | 'fade';
  enterFrame?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  color?: string;
}

export const Transition: React.FC<TransitionProps> = ({
  type = 'slide',
  enterFrame = 0,
  duration = 12,
  direction = 'left',
  color = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();

  if (frame < enterFrame || frame > enterFrame + duration) return null;

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const edgeFade = Math.sin(progress * Math.PI);

  switch (type) {
    case 'slide': {
      const x = direction === 'left' || direction === 'up'
        ? interpolate(progress, [0, 1], [-100, 0])
        : interpolate(progress, [0, 1], [100, 0]);
      const y = direction === 'up' || direction === 'down'
        ? interpolate(progress, [0, 1], [-100, 0])
        : 0;
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${color}15 40%, ${color}40 50%, ${color}15 60%, transparent 100%)`,
            transform: `translate(${x}%, ${y}%)`,
            opacity: edgeFade,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      );
    }

    case 'zoom': {
      const scale = interpolate(progress, [0, 0.5, 1], [1.15, 1.02, 1]);
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${color}18 0%, transparent 70%)`,
            transform: `scale(${scale})`,
            opacity: edgeFade,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      );
    }

    case 'wipe': {
      const x = interpolate(progress, [0, 1], [-60, 110]);
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${color}22 30%, ${color}55 50%, ${color}22 70%, transparent 100%)`,
            transform: `translateX(${x}%)`,
            opacity: edgeFade,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      );
    }

    default: {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0,0,0,${0.4 * edgeFade})`,
            opacity: edgeFade,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      );
    }
  }
};
