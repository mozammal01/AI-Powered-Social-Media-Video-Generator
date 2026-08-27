import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SplitImageReveal: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({ src, style }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 28,
  });

  const blur = interpolate(frame, [0, 15], [20, 0], {
    extrapolateRight: 'clamp',
  });

  const offset = interpolate(progress, [0, 1], [width * 0.35, 0]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {/* Left Half */}
      <div
        style={{
          width: '50%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          transform: `translateX(${-offset}px)`,
        }}
      >
        <Img
          src={src}
          style={{
            width: '200%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </div>

      {/* Right Half */}
      <div
        style={{
          width: '50%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          transform: `translateX(${offset}px)`,
        }}
      >
        <Img
          src={src}
          style={{
            width: '200%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        />
      </div>
    </div>
  );
};
