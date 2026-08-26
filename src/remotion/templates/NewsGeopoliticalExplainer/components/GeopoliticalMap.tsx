import React from 'react';
import { AnimatedWorldMap } from '../../../animations/AnimatedWorldMap';
import { CountryHighlight } from '../../../animations/CountryHighlight';
import { RouteLine } from '../../../animations/RouteLine';

export interface GeopoliticalMapProps {
  highlights?: readonly { x: number; y: number; label?: string; color?: string }[];
  routes?: readonly { from: { x: number; y: number }; to: { x: number; y: number }; color?: string }[];
  delay?: number;
}

export const GeopoliticalMap: React.FC<GeopoliticalMapProps> = ({
  highlights = [],
  routes = [],
  delay = 0,
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AnimatedWorldMap
        pointsOfInterest={highlights.map((h) => ({ x: h.x, y: h.y }))}
      />
      {highlights.map((highlight, i) => (
        <CountryHighlight
          key={`highlight-${i}`}
          x={highlight.x}
          y={highlight.y}
          label={highlight.label}
          color={highlight.color || '#EF4444'}
          delay={delay + i * 10}
        />
      ))}
      {routes.map((route, i) => (
        <RouteLine
          key={`route-${i}`}
          points={[route.from, route.to]}
          color={route.color || 'rgba(239, 68, 68, 0.8)'}
          delay={delay + highlights.length * 10 + i * 15}
        />
      ))}
    </div>
  );
};
