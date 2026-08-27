import React, { useMemo } from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export interface DataFlowAnimationProps {
  nodes: readonly FlowNode[];
  connections: readonly { from: string; to: string }[];
  particleColor?: string;
  lineColor?: string;
  particleCount?: number;
  delay?: number;
  width?: number;
  height?: number;
}

export const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({
  nodes,
  connections,
  particleColor = 'rgba(99, 102, 241, 0.9)',
  lineColor = 'rgba(255, 255, 255, 0.15)',
  particleCount = 6,
  delay = 0,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolvedNodes = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      x: (n.x / 100) * width,
      y: (n.y / 100) * height,
    }));
  }, [nodes, width, height]);

  const particles = useMemo(() => {
    const result: Array<{
      id: number;
      from: string;
      to: string;
      offset: number;
      speed: number;
    }> = [];
    connections.forEach((conn, ci) => {
      for (let i = 0; i < particleCount; i++) {
        result.push({
          id: ci * particleCount + i,
          from: conn.from,
          to: conn.to,
          offset: i / particleCount,
          speed: 0.4 + random(`speed-${ci}-${i}`) * 0.6,
        });
      }
    });
    return result;
  }, [connections, particleCount]);

  const drawDuration = fps * 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {connections.map((conn, i) => {
          const from = resolvedNodes.find((n) => n.id === conn.from);
          const to = resolvedNodes.find((n) => n.id === conn.to);
          if (!from || !to) return null;

          const length = Math.sqrt(
            Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
          );

          const lineDelay = delay + i * 8;
          const progress = Math.max(
            0,
            Math.min(1, (frame - lineDelay) / drawDuration)
          );

          return (
            <line
              key={`line-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={lineColor}
              strokeWidth="3"
              strokeDasharray={length}
              strokeDashoffset={length * (1 - progress)}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {particles.map((p) => {
        const from = resolvedNodes.find((n) => n.id === p.from);
        const to = resolvedNodes.find((n) => n.id === p.to);
        if (!from || !to) return null;

        const cycleDuration = fps * (1.2 / p.speed);
        const t = ((frame - delay) / cycleDuration + p.offset) % 1;

        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: particleColor,
              boxShadow: `0 0 12px ${particleColor}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {resolvedNodes.map((node) => {
        const nodeDelay = delay + 20;
        const scale = interpolate(
          frame - nodeDelay,
          [0, 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: `2px solid ${node.color || 'rgba(255,255,255,0.4)'}`,
                width: 72,
                height: 72,
                backgroundColor: 'rgba(15, 15, 20, 0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  padding: '0 8px',
                  color: node.color || 'rgba(255,255,255,0.9)',
                }}
              >
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
