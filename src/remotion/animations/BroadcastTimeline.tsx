import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const BroadcastTimeline: React.FC<{
  events: { time: string; desc: string }[];
  delay?: number;
}> = ({ events, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'absolute', left: 96, top: 192, borderLeft: '4px solid #525252', paddingLeft: 32 }}>
      {events.map((event, i) => {
        const eventDelay = delay + i * 30;
        
        const pop = spring({
          fps,
          frame: frame - eventDelay,
          config: { damping: 12, stiffness: 150 },
        });

        const opacity = interpolate(frame - eventDelay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div key={i} style={{ position: 'relative', opacity, transform: `scale(${pop})`, transformOrigin: 'left center' }}>
            <div style={{ position: 'absolute', left: -42, top: 4, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#EF4444', border: '4px solid #000' }} />
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 20 }}>{event.time}</div>
            <div style={{ color: '#FFFFFF', fontWeight: 500, fontSize: 24 }}>{event.desc}</div>
          </div>
        );
      })}
    </div>
  );
};
