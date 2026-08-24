import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SwipeTransition: React.FC<{
  children: React.ReactNode;
  type?: 'in' | 'out';
  direction?: 'left' | 'right' | 'up' | 'down';
}> = ({ children, type = 'in', direction = 'left' }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 16, stiffness: 140 },
  });

  let x = 0;
  let y = 0;

  if (type === 'in') {
    if (direction === 'left') x = (1 - progress) * width;
    if (direction === 'right') x = -(1 - progress) * width;
    if (direction === 'up') y = (1 - progress) * height;
    if (direction === 'down') y = -(1 - progress) * height;
  } else {
    // type out
    if (direction === 'left') x = -progress * width;
    if (direction === 'right') x = progress * width;
    if (direction === 'up') y = -progress * height;
    if (direction === 'down') y = progress * height;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      {children}
    </div>
  );
};
