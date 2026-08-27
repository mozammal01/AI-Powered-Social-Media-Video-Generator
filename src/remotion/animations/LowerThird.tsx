import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const LowerThird: React.FC<{
  headline: string;
  subheadline: string;
  delay?: number;
}> = ({ headline, subheadline, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from left
  const slideIn = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 120 },
  });

  const translateX = interpolate(slideIn, [0, 1], [-800, 0]);

  // Delay the subheadline slightly
  const subSlideIn = spring({
    fps,
    frame: frame - delay - 10,
    config: { damping: 14, stiffness: 120 },
  });
  
  const subTranslateX = interpolate(subSlideIn, [0, 1], [-800, 0]);

  return (
    <div style={{ position: 'absolute', bottom: 96, left: 64, zIndex: 50, display: 'flex', flexDirection: 'column', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.5))', fontFamily: 'sans-serif' }}>
      <div 
        style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '12px 24px', fontWeight: 900, fontSize: 36, textTransform: 'uppercase', letterSpacing: '0.05em', transform: `translateX(${translateX}px)` }}
      >
        {headline}
      </div>
      <div 
        style={{ backgroundColor: '#FFFFFF', color: '#000000', padding: '8px 24px', fontWeight: 700, fontSize: 24, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '4px solid #EF4444', transform: `translateX(${subTranslateX}px)` }}
      >
        {subheadline}
      </div>
    </div>
  );
};
