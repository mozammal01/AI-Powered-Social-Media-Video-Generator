import React from 'react';
import { AbsoluteFill } from 'remotion';
import { NewsScene } from './NewsScene';
import { LiveBadge } from '../../animations/LiveBadge';
import { NewsTicker } from '../../animations/NewsTicker';

const TICKER_HEADLINES = [
  "President to address nation at 8 PM",
  "Markets see steepest drop since 2008",
  "Flights grounded across eastern seaboard",
  "Emergency services deployed to affected areas",
  "Global leaders pledge support",
  "UN Security Council convenes emergency session"
];

export const BreakingNews: React.FC = () => {
  return (
    <AbsoluteFill className="bg-black font-sans">
      {/* Main Content Area */}
      <div className="absolute top-0 left-0 w-full h-[calc(100%-48px)]">
        <NewsScene />
      </div>

      {/* Persistent Overlays */}
      <LiveBadge />
      
      <NewsTicker headlines={TICKER_HEADLINES} />
      
      {/* Broadcast frame border */}
      <div className="absolute inset-0 border-[16px] border-black pointer-events-none z-[100]" />
    </AbsoluteFill>
  );
};
