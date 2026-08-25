import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';

export interface ChartToChartTransitionProps {
  children: React.ReactNode;
  enterFrame?: number;
  duration?: number;
  direction?: 'horizontal' | 'vertical';
}

export const ChartToChartTransition: React.FC<ChartToChartTransitionProps> = ({
  children,
  enterFrame = 0,
  duration = 24,
  direction = 'horizontal',
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        clipPath: isHorizontal
          ? `inset(0 ${100 - progress * 100}% 0 0)`
          : `inset(${100 - progress * 100}% 0 0 0)`,
        willChange: 'clip-path',
      }}
    >
      {children}
    </div>
  );
};
