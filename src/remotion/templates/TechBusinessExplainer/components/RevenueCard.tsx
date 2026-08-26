import React from 'react';
import { AnimatedCard } from '../../../animations/AnimatedCard';
import { ChartAnimation } from '../../../animations/ChartAnimation';
import { AnimatedArrow } from '../../../animations/AnimatedArrow';
import { useFadeIn } from '../../../animations';

export interface RevenueStreamData {
  id: string;
  label: string;
  percentage: number;
  color: string;
  description: string;
}

export interface RevenueCardProps {
  stream: RevenueStreamData;
  index: number;
  baseDelay: number;
  showArrow?: boolean;
  arrowTargetX?: number;
  arrowTargetY?: number;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  stream,
  index,
  baseDelay,
  showArrow = false,
  arrowTargetX = 0,
  arrowTargetY = 0,
}) => {
  const delay = baseDelay;
  const opacity = useFadeIn({ from: delay, duration: 18 });

  const cardX = index % 2 === 0 ? 160 : 980;
  const cardY = 160 + Math.floor(index / 2) * 280;

  const chartData = Array.from({ length: 8 }, (_, i) => {
    const base = 30 + stream.percentage * 0.4;
    return Math.max(10, base + Math.sin(i * 1.2 + index) * 25);
  });

  return (
    <div style={{ position: 'absolute', left: cardX, top: cardY, opacity }}>
      <AnimatedCard
        title={stream.label}
        value={`${stream.percentage}%`}
        description={stream.description}
        delay={delay}
        accentColor={stream.color}
      >
        <div
          style={{
            marginTop: 16,
            height: 80,
            width: '100%',
          }}
        >
          <ChartAnimation
            data={chartData}
            delay={delay + 8}
            color={stream.color}
          />
        </div>
      </AnimatedCard>

      {showArrow && (
        <AnimatedArrow
          startX={cardX + 340}
          startY={cardY + 60}
          endX={arrowTargetX}
          endY={arrowTargetY}
          delay={delay + 15}
          color={stream.color}
        />
      )}
    </div>
  );
};
