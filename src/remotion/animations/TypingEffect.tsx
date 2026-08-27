import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const TypingEffect: React.FC<{
  text: string;
  delay?: number;
  className?: string;
  charsPerSecond?: number;
}> = ({ text, delay = 0, className = 'font-mono text-green-400', charsPerSecond = 15 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = (frame - delay) / fps;
  const charsToShow = Math.max(0, Math.floor(time * charsPerSecond));
  const visibleText = text.substring(0, charsToShow);

  const showCursor = (frame % fps) < (fps / 2);

  return (
    <div style={{ fontFamily: 'monospace', color: '#10B981', fontSize: 14, lineHeight: 1.5, maxWidth: 800 }}>
      {visibleText}
      {showCursor && <span style={{ opacity: 0.7 }}>|</span>}
    </div>
  );
};
