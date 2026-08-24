import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ObjectReveal: React.FC<{
  src: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ src, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic slow reveal
  const revealProgress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200, stiffness: 30 },
  });

  const translateY = interpolate(revealProgress, [0, 1], [100, 0]);
  const scale = interpolate(frame - delay, [0, 150], [1.1, 1], { extrapolateRight: 'clamp' });
  const rotateY = interpolate(frame - delay, [0, 300], [-15, 15], { extrapolateRight: 'clamp' });
  
  const opacity = interpolate(frame - delay, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  // Light sweep mask across the object
  const maskPosition = interpolate(frame - delay, [30, 90], [-100, 200], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        perspective: '1000px',
        ...style
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity,
          transform: `translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
          filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8))',
          // Simulate a lighting sweep mask
          WebkitMaskImage: `linear-gradient(110deg, rgba(0,0,0,1) ${maskPosition}%, rgba(0,0,0,0.3) ${maskPosition + 10}%, rgba(0,0,0,1) ${maskPosition + 20}%)`,
          maskImage: `linear-gradient(110deg, rgba(0,0,0,1) ${maskPosition}%, rgba(0,0,0,0.3) ${maskPosition + 10}%, rgba(0,0,0,1) ${maskPosition + 20}%)`,
          willChange: 'transform, opacity, mask-image',
        }}
      />
    </div>
  );
};
