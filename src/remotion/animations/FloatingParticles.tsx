import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const FloatingParticles: React.FC<{ count?: number; color?: string }> = ({ 
  count = 50, 
  color = 'rgba(255, 215, 0, 0.4)' // Gold tint by default
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Pre-calculate stable random values for each particle so they don't jitter
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      startX: Math.random() * width,
      startY: Math.random() * height,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 45, // pixels per second
      speedY: (Math.random() - 0.5) * 45 - 15, // slightly upwards
      wobbleSpeed: Math.random() * 1.5 + 0.3, // cycles per second
      wobbleAmount: Math.random() * 20 + 5,
    }));
  }, [count, width, height]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {particles.map((p, i) => {
        // Calculate new position based on time (frame / fps)
        const time = frame / fps;
        const x = p.startX + p.speedX * time + Math.sin(time * p.wobbleSpeed) * p.wobbleAmount;
        const y = p.startY + p.speedY * time;
        
        // Wrap around logic if they go off screen (optional, but good for continuous look)
        const wrappedX = ((x % width) + width) % width;
        const wrappedY = ((y % height) + height) % height;

        const opacity = (Math.sin(time * p.wobbleSpeed * 2) + 1) / 2 * 0.8 + 0.2;

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
