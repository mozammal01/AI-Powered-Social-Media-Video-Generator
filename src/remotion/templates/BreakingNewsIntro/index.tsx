import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { useFadeIn, useSceneOpacity, useSpringScale, useSpringSlideUp, useBackgroundMovement } from '../../animations';
import { LiveBadge } from '../../animations/LiveBadge';
import { NewsTicker } from '../../animations/NewsTicker';
import { HeadlineReveal } from '../../animations/HeadlineReveal';
import { LowerThird } from '../../animations/LowerThird';
import { KineticTypography } from '../../components/KineticTypography';
import { MaskReveal } from '../../components/MaskReveal';
import { BlurFocus } from '../../components/BlurFocus';
import { ParallaxLayers } from '../../components/ParallaxLayers';
import { FilmGrain } from '../../components/FilmGrain';
import { LightSweep } from '../../components/LightSweep';
import { ProductImage } from '../../components/ProductImage';
import { AnimatedWorldMap } from '../../animations/AnimatedWorldMap';
import { CountryHighlight } from '../../animations/CountryHighlight';
import { RouteLine } from '../../animations/RouteLine';
import { NumberCounter } from '../../animations/NumberCounter';
import { breakingNewsIntroScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const RED = '#EF4444';
const INDIGO = '#6366F1';
const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Badge & Live (0 - 2s)
// Category badge, live indicator, fast background transition
// ─────────────────────────────────────────────────────────────────────────────

const BadgeScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  category,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  const badgeScale = useSpringScale({ from: 0, damping: 14, stiffness: 120 });
  const badgeY = useSpringSlideUp({ from: 0, distance: 24, damping: 16, stiffness: 100 });

  const categoryText = category ?? 'BREAKING';

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background motion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${RED}15 0%, transparent 55%)`,
          transform: `scale(${1 + Math.sin((frame / 30) * Math.PI * 2) * 0.02})`,
        }}
      />

      <ParallaxLayers
        amplitude={10}
        verticalAmplitude={6}
        periodFrames={180}
        layers={[
          {
            speed: 0.3,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${INDIGO}10 0%, transparent 40%)`,
                }}
              />
            ),
          },
        ]}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 3vh, 32px)',
        }}
      >
        {/* Category badge */}
        <MaskReveal direction="up" enterFrame={0} duration={14}>
          <div
            style={{
              opacity: useFadeIn({ from: 0, duration: 14 }),
              transform: `translateY(${badgeY}px) scale(${badgeScale})`,
              padding: 'clamp(8px, 1.2vh, 14px) clamp(20px, 3vw, 36px)',
              borderRadius: 8,
              background: RED,
              color: WHITE,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(12px, 1.2vw, 18px)',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.35)',
            }}
          >
            {categoryText}
          </div>
        </MaskReveal>

        {/* Live badge */}
        <div
          style={{
            opacity: useFadeIn({ from: 14, duration: 14 }),
            transform: `translateY(${useSpringSlideUp({ from: 14, distance: 16, damping: 18, stiffness: 120 })}px)`,
          }}
        >
          <LiveBadge />
        </div>
      </AbsoluteFill>

      <LightSweep enterFrame={8} duration={24} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Headline & Image (1.5s - 4s)
// Main headline with kinetic typography, image reveal with zoom/parallax
// ─────────────────────────────────────────────────────────────────────────────

const HeadlineImageScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const bg = useBackgroundMovement(durationInFrames, 12);

  const headline = product?.name ?? 'BREAKING NEWS';
  const imageUrl = product?.imageUrl;

  const imageScale = interpolate(frame, [0, 24], [0.95, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background with subtle motion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${INDIGO}12 0%, transparent 50%)`,
          transform: `translate(${bg.x}px, ${bg.y}px) scale(${bg.scale})`,
        }}
      />

      <ParallaxLayers
        amplitude={14}
        verticalAmplitude={8}
        periodFrames={200}
        layers={[
          {
            speed: 0.35,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 45%, ${RED}08 0%, transparent 45%)`,
                }}
              />
            ),
          },
        ]}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 3vh, 32px)',
          padding: '0 48px',
        }}
      >
        {/* Headline */}
        <BlurFocus fromBlur={8} toBlur={0} enterFrame={0} duration={24}>
          <HeadlineReveal text={headline} delay={0} />
        </BlurFocus>

        {/* Image */}
        <div
          style={{
            opacity: useFadeIn({ from: 18, duration: 18 }),
            transform: `scale(${imageScale})`,
            maxWidth: Math.min(900, width * 0.55),
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <ProductImage
            imageUrl={imageUrl}
            productName={headline}
            primaryColor={INDIGO}
            accentColor={RED}
            enterFrame={18}
            maxWidth={Math.min(900, width * 0.55)}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.2} blendMode="overlay" flicker={0.02} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Location & Map (4s - 6s)
// Animated location indicator, map visual, route animation
// ─────────────────────────────────────────────────────────────────────────────

const LocationScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  location,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  const locationText = location ?? 'Unknown Location';

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${INDIGO}12 0%, transparent 50%)`,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 3vh, 32px)',
          padding: '0 48px',
        }}
      >
        {/* Location label */}
        <MaskReveal direction="up" enterFrame={0} duration={14}>
          <div
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              fontWeight: 700,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: INDIGO,
              opacity: useFadeIn({ from: 0, duration: 14 }),
            }}
          >
            Location
          </div>
        </MaskReveal>

        {/* Location text */}
        <MaskReveal direction="up" enterFrame={10} duration={18}>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 'clamp(28px, 3.5vw, 56px)',
              fontWeight: 400,
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              opacity: useFadeIn({ from: 10, duration: 16 }),
              transform: `translateY(${useSpringSlideUp({ from: 10, distance: 18, damping: 18, stiffness: 120 })}px)`,
            }}
          >
            {locationText}
          </div>
        </MaskReveal>

        {/* Map visual with route line */}
        <div
          style={{
            width: Math.min(800, 1920 * 0.5),
            height: Math.min(400, 1080 * 0.35),
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            opacity: useFadeIn({ from: 28, duration: 16 }),
            transform: `scale(${interpolate(frame, [28, 44], [0.95, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })})`,
            position: 'relative',
          }}
        >
          <AnimatedWorldMap
            pointsOfInterest={[
              { x: 300, y: 150 },
              { x: 700, y: 250 },
              { x: 500, y: 100 },
            ]}
          />
          <svg
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              opacity: interpolate(frame, [36, 50], [0, 0.6], { extrapolateRight: 'clamp' }),
            }}
          >
            <line
              x1={300}
              y1={150}
              x2={700}
              y2={250}
              stroke="rgba(239, 68, 68, 0.6)"
              strokeWidth="3"
              strokeDasharray="500"
              strokeDashoffset={interpolate(frame, [36, 60], [500, 0], { extrapolateRight: 'clamp' })}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Statistic & Info (6s - 8s)
// Statistic counter, supporting info card, lower-third
// ─────────────────────────────────────────────────────────────────────────────

const StatisticScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  const statistic = (product as Record<string, unknown>).statistic as BreakingNewsStatistic | undefined;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${RED}12 0%, transparent 50%)`,
        }}
      />

      <ParallaxLayers
        amplitude={8}
        verticalAmplitude={5}
        periodFrames={140}
        layers={[
          {
            speed: 0.25,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${INDIGO}08 0%, transparent 40%)`,
                }}
              />
            ),
          },
        ]}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 3vh, 32px)',
          padding: '0 48px',
        }}
      >
        {/* Statistic */}
        {statistic && (
          <div
            style={{
              opacity: useFadeIn({ from: 0, duration: 16 }),
              transform: `scale(${useSpringScale({ from: 0, damping: 14, stiffness: 120 })}`,
              textAlign: 'center',
            }}
          >
            <NumberCounter
              value={statistic.value}
              delay={0}
              color={WHITE}
              size={72}
              prefix={statistic.prefix}
              suffix={statistic.suffix}
            />
            <div
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(14px, 1.2vw, 18px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: 8,
              }}
            >
              {statistic.label}
            </div>
          </div>
        )}

        {/* Info card / lower third */}
        <div
          style={{
            opacity: useFadeIn({ from: 22, duration: 14 }),
            transform: `translateY(${useSpringSlideUp({ from: 22, distance: 20, damping: 16, stiffness: 110 })}px)`,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 'clamp(16px, 2vh, 24px) clamp(24px, 3vw, 40px)',
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          <div
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: RED,
              marginBottom: 8,
            }}
          >
            Source: {(product as Record<string, unknown>).source as string ?? 'News Desk'}
          </div>
          <div
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.5,
            }}
          >
            Developing story — updates to follow
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Final Composition & Ticker (8s - 10s)
// Headline + image + live badge settle, animated ticker, final transition
// ─────────────────────────────────────────────────────────────────────────────

const FinalScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  cta,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const headline = product?.name ?? 'BREAKING NEWS';
  const imageUrl = product?.imageUrl;
  const tickerText = (cta?.text ?? (brand as Record<string, unknown>)?.tickerText as string) ?? 'Breaking news updates every minute';

  // Subtle breathing glow
  const glowScale = 1 + Math.sin((frame / 40) * Math.PI * 2) * 0.025;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${INDIGO}12 0%, transparent 55%)`,
          transform: `scale(${glowScale})`,
        }}
      />

      <ParallaxLayers
        amplitude={6}
        verticalAmplitude={4}
        periodFrames={120}
        layers={[
          {
            speed: 0.2,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${RED}08 0%, transparent 40%)`,
                }}
              />
            ),
          },
        ]}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vh, 24px)',
          padding: '0 48px',
        }}
      >
        {/* Live badge */}
        <div
          style={{
            opacity: useFadeIn({ from: 0, duration: 12 }),
            position: 'absolute',
            top: '8%',
          }}
        >
          <LiveBadge />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: useFadeIn({ from: 4, duration: 14 }),
            transform: `translateY(${useSpringSlideUp({ from: 4, distance: 16, damping: 18, stiffness: 120 })}px)`,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          <KineticTypography
            text={headline}
            enterFrame={4}
            stagger={3}
            tokenDuration={14}
            variant="rise"
            style={{
              fontSize: 'clamp(24px, 3.5vw, 56px)',
              fontWeight: 800,
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Image */}
        <div
          style={{
            opacity: useFadeIn({ from: 14, duration: 14 }),
            transform: `scale(${interpolate(frame, [14, 28], [0.97, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })})`,
            maxWidth: Math.min(800, width * 0.5),
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <ProductImage
            imageUrl={imageUrl}
            productName={headline}
            primaryColor={INDIGO}
            accentColor={RED}
            enterFrame={14}
            maxWidth={Math.min(800, width * 0.5)}
          />
        </div>
      </AbsoluteFill>

      {/* Ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          opacity: useFadeIn({ from: 28, duration: 12 }),
        }}
      >
        <NewsTicker headlines={[tickerText]} />
      </div>

      <LightSweep enterFrame={16} duration={28} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps & { durationInFrames: number }>>> = {
  intro: BadgeScene,
  product: HeadlineImageScene,
  features: LocationScene,
  headline: StatisticScene,
  cta: FinalScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BreakingNewsIntro — professional broadcast-style news intro.
 *
 * Scene breakdown:
 *  1. Badge & Live (0 - 2s): category badge, live indicator
 *  2. Headline & Image (2s - 4s): kinetic typography headline, image reveal
 *  3. Location & Map (4s - 6s): location indicator, map visual, route animation
 *  4. Statistic & Info (6s - 8s): animated counter, info card
 *  5. Final Composition & Ticker (8s - 10s): settled headline/image, ticker
 *
 * Fixed duration: 10 seconds (300 frames @ 30fps).
 */
export const BreakingNewsIntro: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(breakingNewsIntroScenes, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.type];

        if (!SceneComponent) return null;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent {...content} durationInFrames={scene.durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
