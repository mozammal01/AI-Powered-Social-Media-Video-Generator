import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const NewsTicker: React.FC<{
  headlines: string[];
}> = ({ headlines }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  // Combine into one long string separated by bullet points
  const tickerText = headlines.join('   •   ') + '   •   ' + headlines.join('   •   ');
  
  // Continuous scroll (120 pixels per second)
  const scrollSpeedPerSecond = 120;
  const translateX = -(((frame / fps) * scrollSpeedPerSecond) % 3000); // arbitrary large modulo to loop

  return (
    <div className="absolute bottom-0 left-0 w-full h-12 bg-black z-50 flex items-center border-t border-neutral-800 overflow-hidden">
      <div className="bg-red-600 text-white font-bold px-6 h-full flex items-center z-10 whitespace-nowrap">
        BREAKING NEWS
      </div>
      <div className="relative flex-1 h-full overflow-hidden flex items-center">
        <div 
          className="whitespace-nowrap text-white font-medium text-lg"
          style={{ transform: `translateX(${translateX + width}px)` }}
        >
          {tickerText}
        </div>
      </div>
    </div>
  );
};
