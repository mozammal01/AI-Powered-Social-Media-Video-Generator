import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const BroadcastTimeline: React.FC<{
  events: { time: string; desc: string }[];
  delay?: number;
}> = ({ events, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="flex flex-col gap-8 absolute left-24 top-48 border-l-4 border-neutral-700 pl-8">
      {events.map((event, i) => {
        const eventDelay = delay + i * 30;
        
        const pop = spring({
          fps,
          frame: frame - eventDelay,
          config: { damping: 12, stiffness: 150 },
        });

        const opacity = interpolate(frame - eventDelay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div key={i} className="relative" style={{ opacity, transform: `scale(${pop})`, transformOrigin: 'left center' }}>
            <div className="absolute -left-[42px] top-1 w-6 h-6 rounded-full bg-red-600 border-4 border-black" />
            <div className="text-red-500 font-bold text-xl">{event.time}</div>
            <div className="text-white font-medium text-2xl">{event.desc}</div>
          </div>
        );
      })}
    </div>
  );
};
