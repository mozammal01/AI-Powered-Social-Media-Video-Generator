import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { SplitImageReveal } from '../../../animations/SplitImageReveal';
import { MotionBlur } from '../../../components/MotionBlur';

export interface ListItemProps {
  item: {
    rank: number;
    title: string;
    description: string;
    imageSrc: string;
    statistic?: { value: string; label: string };
  };
  enterFrame?: number;
  duration?: number;
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const local = frame - enterFrame;

  const slideX = spring({
    fps: 30,
    frame: local,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 24,
  });

  const contentOpacity = interpolate(slideX, [0, 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const imageScale = interpolate(local, [0, 20], [1.15, 1], {
    extrapolateRight: 'clamp',
  });

  const statDelay = 18;
  const statScale = spring({
    fps: 30,
    frame: local - statDelay,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 22,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Background image with reveal */}
      <MotionBlur amountX={interpolate(local, [0, 12], [40, 0], { extrapolateRight: 'clamp' })}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${imageScale})`,
          }}
        >
          <SplitImageReveal src={item.imageSrc} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>
      </MotionBlur>

      {/* Rank number */}
      <div
        style={{
          position: 'absolute',
          left: '4%',
          top: '50%',
          transform: `translateY(-50%) translateX(${interpolate(local, [0, 20], [-80, 0], { extrapolateRight: 'clamp' })}px)`,
          opacity: interpolate(local, [0, 16], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            fontSize: 'clamp(80px, 12vw, 180px)',
            fontWeight: 900,
            lineHeight: 1,
            color: 'rgba(255,255,255,0.18)',
            textShadow: '0 0 40px rgba(255,255,255,0.15)',
            WebkitTextStroke: '2px rgba(255,255,255,0.25)',
          }}
        >
          {item.rank}
        </div>
      </div>

      {/* Content card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) translateY(-50%)`,
          opacity: contentOpacity,
          maxWidth: '62%',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(8px, 1.2vh, 16px)',
          }}
        >
          <div
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              fontSize: 'clamp(48px, 7vw, 110px)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#FFFFFF',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            #{item.rank}
          </div>

          <h3
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(22px, 2.8vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FFFFFF',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.4vw, 20px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '100%',
            }}
          >
            {item.description}
          </p>

          {item.statistic && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 10,
                marginTop: 6,
                transform: `scale(${Math.max(0, statScale)})`,
                transformOrigin: 'left center',
              }}
            >
              <span
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  fontWeight: 900,
                  color: '#FF3B3B',
                  textShadow: '0 0 20px rgba(255,59,59,0.5)',
                }}
              >
                {item.statistic.value}
              </span>
              <span
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(12px, 1vw, 15px)',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {item.statistic.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
