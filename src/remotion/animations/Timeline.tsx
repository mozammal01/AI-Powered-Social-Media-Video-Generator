import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TimelineStep {
  label: string;
  color?: string;
}

export interface TimelineProps {
  steps: readonly TimelineStep[];
  delay?: number;
  activeIndex?: number;
  width?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  delay = 0,
  activeIndex,
  width = 800,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepCount = steps.length;
  const stepWidth = width / stepCount;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: 80,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Base line */}
      <div
        style={{
          position: 'absolute',
          left: stepWidth / 2,
          right: stepWidth / 2,
          height: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        }}
      />

      {/* Progress line */}
      {activeIndex !== undefined && (
        <div
          style={{
            position: 'absolute',
            left: stepWidth / 2,
            height: 2,
            width: `${(activeIndex / (stepCount - 1)) * (width - stepWidth)}px`,
            backgroundColor: '#6366F1',
            transition: 'width 0.3s ease',
          }}
        />
      )}

      {steps.map((step, i) => {
        const stepDelay = delay + i * 6;
        const dotScale = spring({
          fps,
          frame: frame - stepDelay,
          config: { damping: 12, stiffness: 200 },
        });

        const isActive = activeIndex === undefined || i <= activeIndex;
        const opacity = interpolate(frame - stepDelay, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'relative',
              width: stepWidth,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              opacity,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: isActive
                  ? step.color || '#6366F1'
                  : 'rgba(255, 255, 255, 0.2)',
                transform: `scale(${dotScale})`,
                boxShadow: isActive
                  ? `0 0 16px ${step.color || '#6366F1'}66`
                  : 'none',
                transition: 'background-color 0.3s ease',
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isActive
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
