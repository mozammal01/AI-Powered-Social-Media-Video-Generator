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
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 48, backgroundColor: '#000000', zIndex: 50, display: 'flex', alignItems: 'center', borderTop: '1px solid #262626', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 700, padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10, whiteSpace: 'nowrap' }}>
        BREAKING NEWS
      </div>
      <div style={{ position: 'relative', flex: 1, height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div 
          style={{ whiteSpace: 'nowrap', color: '#FFFFFF', fontWeight: 500, fontSize: 18, transform: `translateX(${translateX + width}px)` }}
        >
          {tickerText}
        </div>
      </div>
    </div>
  );
};
