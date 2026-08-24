import React from 'react';
import { useCurrentFrame } from 'remotion';

export const TypingEffect: React.FC<{
  text: string;
  delay?: number;
  className?: string;
  charsPerFrame?: number;
}> = ({ text, delay = 0, className = 'font-mono text-green-400', charsPerFrame = 0.5 }) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.max(0, Math.floor((frame - delay) * charsPerFrame));
  const visibleText = text.substring(0, charsToShow);

  const showCursor = frame % 30 < 15;

  return (
    <div className={className}>
      {visibleText}
      {showCursor && <span className="opacity-70">|</span>}
    </div>
  );
};
