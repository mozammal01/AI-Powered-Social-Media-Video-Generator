import React from 'react';
import { AnimatedWorldMap } from '../../../animations/AnimatedWorldMap';
import { CountryHighlight } from '../../../animations/CountryHighlight';
import { RouteLine } from '../../../animations/RouteLine';

export interface GeopoliticalMapProps {
  highlights?: readonly { x: number; y: number; label?: string; color?: string }[];
  routes?: readonly { from: { x: number; y: number }; to: { x: number; y: number }; color?: string }[];
  delay?: number;
  width?: number;
  height?: number;
}

export const GeopoliticalMap: React.FC<GeopoliticalMapProps> = ({
  highlights = [],
  routes = [],
  delay = 0,
  width = 1920,
  height = 1080,
}) => {
  const toAbsolute = (x: number, y: number) => ({
    x: (x / 100) * width,
    y: (y / 100) * height,
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AnimatedWorldMap
        pointsOfInterest={highlights.map((h) => toAbsolute(h.x, h.y))}
      />
      {highlights.map((highlight, i) => {
        const abs = toAbsolute(highlight.x, highlight.y);
        return (
          <CountryHighlight
            key={`highlight-${i}`}
            x={abs.x}
            y={abs.y}
            label={highlight.label}
            color={highlight.color || '#EF4444'}
            delay={delay + i * 10}
          />
        );
      })}
      {routes.map((route, i) => {
        const fromAbs = toAbsolute(route.from.x, route.from.y);
        const toAbs = toAbsolute(route.to.x, route.to.y);
        return (
          <RouteLine
            key={`route-${i}`}
            points={[fromAbs, toAbs]}
            color={route.color || 'rgba(239, 68, 68, 0.8)'}
            delay={delay + highlights.length * 10 + i * 15}
          />
        );
      })}
    </div>
  );
};
