import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ChartAnimation: React.FC<{
  data: number[];
  delay?: number;
  color?: string;
}> = ({ data, delay = 0, color = '#EF4444' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(...data);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', width: '100%', gap: 8 }}>
      {data.map((value, i) => {
        const heightProgress = spring({
          fps,
          frame: frame - delay - i * 5,
          config: { damping: 15, stiffness: 100 },
        });

        const heightPercentage = (value / maxVal) * 100;

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
            <div 
              style={{ width: '100%', borderRadius: '2px 2px 0 0', opacity: 0.8, backgroundColor: color, height: `${heightPercentage * heightProgress}%` }}
            />
          </div>
        );
      })}
    </div>
  );
};
