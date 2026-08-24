import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ChartAnimation: React.FC<{
  data: number[];
  delay?: number;
  color?: string;
}> = ({ data, delay = 0, color = 'bg-cyan-500' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(...data);

  return (
    <div className="flex items-end justify-between h-full w-full gap-2">
      {data.map((value, i) => {
        const heightProgress = spring({
          fps,
          frame: frame - delay - i * 5,
          config: { damping: 15, stiffness: 100 },
        });

        const heightPercentage = (value / maxVal) * 100;

        return (
          <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
            <div 
              className={`w-full rounded-t-sm opacity-80 ${color}`}
              style={{
                height: `${heightPercentage * heightProgress}%`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
