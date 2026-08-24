import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const FloatingParticles: React.FC<{ count?: number; color?: string }> = ({ 
  count = 50, 
  color = 'rgba(255, 215, 0, 0.4)' // Gold tint by default
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pre-calculate stable random values for each particle so they don't jitter
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      startX: Math.random() * width,
      startY: Math.random() * height,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5 - 0.5, // slightly upwards
      wobbleSpeed: Math.random() * 0.05 + 0.01,
      wobbleAmount: Math.random() * 20 + 5,
    }));
  }, [count, width, height]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {particles.map((p, i) => {
        // Calculate new position based on frame
        const x = p.startX + p.speedX * frame + Math.sin(frame * p.wobbleSpeed) * p.wobbleAmount;
        const y = p.startY + p.speedY * frame;
        
        // Wrap around logic if they go off screen (optional, but good for continuous look)
        const wrappedX = ((x % width) + width) % width;
        const wrappedY = ((y % height) + height) % height;

        const opacity = (Math.sin(frame * p.wobbleSpeed * 2) + 1) / 2 * 0.8 + 0.2;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: wrappedX,
              top: wrappedY,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: '50%',
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
};
