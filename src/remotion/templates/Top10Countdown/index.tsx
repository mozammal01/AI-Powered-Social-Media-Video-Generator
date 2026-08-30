import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import {
  useFadeIn,
  useSceneOpacity,
  useSpringScale,
  useSpringSlideUp,
  useResponsiveLayout,
} from '../../animations';
import { RankingCounter } from '../../components/RankingCounter';
import { NumberCounter } from '../../animations/NumberCounter';
import { ProgressBar } from '../../components/ProgressBar';
import { SplitImageReveal } from '../../components/SplitImageReveal';
import { MaskReveal } from '../../components/MaskReveal';
import { KineticTypography } from '../../components/KineticTypography';
import { ProductImage } from '../../components/ProductImage';
import { FilmGrain } from '../../components/FilmGrain';
import { LightSweep } from '../../components/LightSweep';
import { ParallaxLayers } from '../../components/ParallaxLayers';
import { MotionBlur } from '../../components/MotionBlur';
import { top10CountdownScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const GOLD = '#FFD60A';
const RED = '#FF3B5C';
const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────────────────────────────────────
// Extended props for Top 10 specific fields
// ─────────────────────────────────────────────────────────────────────────────

interface Top10CountdownProps extends VideoContentProps {
  listTitle?: string;
  rank?: number;
  itemTitle?: string;
  description?: string;
  image?: string;
  statistic?: number;
  statisticLabel?: string;
  category?: string;
  accentText?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Opening (0 - 2s)
// Background fade, "TOP 10" mask reveal, title slide, large "10" with spring
// ─────────────────────────────────────────────────────────────────────────────

const OpeningScene: React.FC<Top10CountdownProps & { durationInFrames: number }> = ({
  headline,
  listTitle,
  rank,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const title = listTitle ?? headline ?? 'This Week\'s Top 10';
  const displayRank = typeof rank === 'number' && Number.isFinite(rank) ? rank : 10;

  const bgScale = interpolate(frame, [0, 30], [1.05, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const numberSpring = spring({
    fps: 30,
    frame: frame - 6,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 30,
  });

  const lineWidth = interpolate(frame, [12, 30], [0, 120], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background with scale */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}12 0%, transparent 55%)`,
          transform: `scale(${bgScale})`,
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
          gap: 'clamp(16px, 3vh, 32px)',
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        {/* TOP 10 label with mask reveal */}
        <MaskReveal direction="right" enterFrame={0} duration={18}>
          <div
            style={{
              opacity: useFadeIn({ from: 0, duration: 14 }),
              fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(24px, 3vw, 48px)',
              fontWeight: 900,
              color: GOLD,
              letterSpacing: '0.15em',
              textAlign: 'center',
            }}
          >
            {headline ?? 'TOP 10'}
          </div>
        </MaskReveal>

        {/* Title */}
        <MaskReveal direction="up" enterFrame={10} duration={16}>
          <div
            style={{
              opacity: useFadeIn({ from: 10, duration: 14 }),
              transform: `translateY(${useSpringSlideUp({ from: 10, distance: 20, damping: 16, stiffness: 120 })}px)`,
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 'clamp(28px, 3.5vw, 56px)',
              fontWeight: 400,
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {title}
          </div>
        </MaskReveal>

        {/* Large rank number */}
        <div
          style={{
            opacity: useFadeIn({ from: 6, duration: 12 }),
            transform: `scale(${numberSpring}) rotate(${(1 - numberSpring) * -6}deg)`,
          }}
        >
          <RankingCounter
            rank={displayRank}
            total={10}
            enterFrame={6}
            variant="pop"
            color={GOLD}
            suffixColor="rgba(255,255,255,0.55)"
            size={Math.min(220, 1920 * 0.12)}
          />
        </div>

        {/* Highlight line */}
        <div
          style={{
            width: `${lineWidth}px`,
            height: 3,
            background: `linear-gradient(90deg, ${GOLD}, ${RED})`,
            borderRadius: 2,
            boxShadow: `0 0 12px ${GOLD}66`,
          }}
        />
      </AbsoluteFill>

      <LightSweep enterFrame={8} duration={24} angle={-14} intensity={0.2} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Rank Reveal (2s - 4s)
// Rank number, image reveal, title, description, category badge
// ─────────────────────────────────────────────────────────────────────────────

const RankRevealScene: React.FC<Top10CountdownProps & { durationInFrames: number }> = ({
  rank,
  itemTitle,
  description,
  image,
  category,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const displayRank = typeof rank === 'number' && Number.isFinite(rank) ? rank : 10;
  const title = itemTitle ?? 'Ranked Item';
  const desc = typeof description === 'string' ? description.trim() : '';
  const imageUrl = typeof image === 'string' ? image : undefined;
  const categoryText = typeof category === 'string' && category.trim() ? category.trim() : '';

  const rankSpring = spring({
    fps: 30,
    frame: frame - 0,
    config: { damping: 10, stiffness: 150, mass: 0.9 },
    durationInFrames: 28,
  });

  const imageScale = interpolate(frame, [0, 28], [1.08, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)`,
        }}
      />

      <ParallaxLayers
        amplitude={12}
        verticalAmplitude={7}
        periodFrames={200}
        layers={[
          {
            speed: 0.35,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${RED}06 0%, transparent 45%)`,
                }}
              />
            ),
          },
        ]}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: layout.horizontalLayout ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(24px, 4vw, 48px)',
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        {/* Left: Rank + Text */}
        <div
          style={{
            flex: layout.horizontalLayout ? '0 0 auto' : '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 2vh, 24px)',
            maxWidth: Math.min(700, layout.maxTextWidth),
            textAlign: 'center',
          }}
        >
          {/* Rank number */}
          <div
            style={{
              opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateX(${(1 - rankSpring) * 80}px)`,
            }}
          >
            <RankingCounter
              rank={displayRank}
              total={10}
              enterFrame={0}
              variant="pop"
              color={GOLD}
              suffixColor="rgba(255,255,255,0.55)"
              size={Math.min(160, 1920 * 0.08)}
            />
          </div>

          {/* Category badge */}
          {categoryText && (
            <div
              style={{
                opacity: useFadeIn({ from: 10, duration: 12 }),
                transform: `scale(${useSpringScale({ from: 10, damping: 14, stiffness: 150 })}`,
                alignSelf: 'flex-start',
                padding: 'clamp(6px, 0.8vh, 10px) clamp(14px, 1.6vw, 22px)',
                borderRadius: 999,
                background: `linear-gradient(135deg, ${GOLD}, ${RED})`,
                color: DARK,
                fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
                fontSize: 'clamp(10px, 0.8vw, 13px)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {categoryText}
            </div>
          )}

          {/* Title */}
          <MaskReveal direction="up" enterFrame={14} duration={18}>
            <div
              style={{
                opacity: useFadeIn({ from: 14, duration: 14 }),
                transform: `translateY(${useSpringSlideUp({ from: 14, distance: 16, damping: 18, stiffness: 120 })}px)`,
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: 'clamp(28px, 3.2vw, 52px)',
                fontWeight: 400,
                color: WHITE,
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
          </MaskReveal>

          {/* Description */}
          {desc && (
            <div
              style={{
                opacity: useFadeIn({ from: 22, duration: 14 }),
                transform: `translateY(${useSpringSlideUp({ from: 22, distance: 14, damping: 16, stiffness: 110 })}px)`,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(13px, 1vw, 16px)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.5,
                maxWidth: 520,
              }}
            >
              {desc}
            </div>
          )}
        </div>

        {/* Right: Image */}
        <div
          style={{
            flex: '0 1 auto',
            opacity: useFadeIn({ from: 8, duration: 16 }),
            transform: `scale(${imageScale})`,
            maxWidth: Math.min(700, layout.maxImageWidth),
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <SplitImageReveal
            src={imageUrl}
            alt={title}
            enterFrame={8}
            duration={20}
            accentColor={GOLD}
            borderRadius={16}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.2} blendMode="overlay" flicker={0.02} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Statistics (4s - 6s)
// Animated counter, label, highlight line, supporting text
// ─────────────────────────────────────────────────────────────────────────────

const StatisticsScene: React.FC<Top10CountdownProps & { durationInFrames: number }> = ({
  statistic,
  statisticLabel,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const statValue = typeof statistic === 'number' && Number.isFinite(statistic) ? statistic : 0;
  const label = typeof statisticLabel === 'string' && statisticLabel.trim() ? statisticLabel.trim() : 'Score';

  const lineWidth = interpolate(frame, [8, 28], [0, 160], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)`,
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
                  background: `radial-gradient(circle at 50% 50%, ${RED}06 0%, transparent 40%)`,
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
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        {/* Statistic counter */}
        <div
          style={{
            opacity: useFadeIn({ from: 0, duration: 16 }),
            transform: `scale(${useSpringScale({ from: 0, damping: 14, stiffness: 120 })}`,
            textAlign: 'center',
          }}
        >
          <NumberCounter
            value={statValue}
            delay={0}
            color={GOLD}
            size={Math.min(120, 1920 * 0.06)}
            suffix=""
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
            {label}
          </div>
        </div>

        {/* Highlight line */}
        <div
          style={{
            width: `${lineWidth}px`,
            height: 3,
            background: `linear-gradient(90deg, ${GOLD}, ${RED})`,
            borderRadius: 2,
            boxShadow: `0 0 12px ${GOLD}66`,
          }}
        />

        {/* Supporting text */}
        <div
          style={{
            opacity: useFadeIn({ from: 18, duration: 14 }),
            transform: `translateY(${useSpringSlideUp({ from: 18, distance: 16, damping: 16, stiffness: 110 })}px)`,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(13px, 1vw, 16px)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.65)',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          This score reflects real-time engagement across all platforms.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Countdown Transition (6s - 8s)
// Rank slides out/in, image transitions, progress bar updates
// ─────────────────────────────────────────────────────────────────────────────

const TransitionScene: React.FC<Top10CountdownProps & { durationInFrames: number }> = ({
  rank,
  itemTitle,
  image,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const displayRank = typeof rank === 'number' && Number.isFinite(rank) ? rank : 10;
  const title = itemTitle ?? 'Ranked Item';
  const imageUrl = typeof image === 'string' ? image : undefined;

  const rankOut = interpolate(frame, [0, 24], [0, -120], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const rankIn = interpolate(frame, [12, 36], [120, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const imageSlide = interpolate(frame, [0, 30], [0, -60], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const motionBlurX = Math.max(0, 18 * Math.sin((frame / 30) * Math.PI));

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)`,
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '10%',
          right: '10%',
        }}
      >
        <ProgressBar
          startFrame={0}
          endFrame={60}
          segments={10}
          color={GOLD}
          trackColor="rgba(255,255,255,0.12)"
          height={8}
          showHead={true}
        />
      </div>

      {/* Outgoing rank */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${rankOut}px)`,
          opacity: interpolate(frame, [18, 30], [1, 0], { extrapolateRight: 'clamp' }),
        }}
      >
        <RankingCounter
          rank={displayRank}
          total={10}
          enterFrame={0}
          variant="pop"
          color={GOLD}
          suffixColor="rgba(255,255,255,0.55)"
          size={Math.min(180, 1920 * 0.09)}
        />
      </div>

      {/* Incoming rank + image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vh, 24px)',
          transform: `translateX(${rankIn}px)`,
        }}
      >
        <MotionBlur amountX={motionBlurX}>
          <RankingCounter
            rank={displayRank - 1}
            total={10}
            enterFrame={12}
            variant="pop"
            color={GOLD}
            suffixColor="rgba(255,255,255,0.55)"
            size={Math.min(180, 1920 * 0.09)}
          />
        </MotionBlur>

        <div
          style={{
            opacity: useFadeIn({ from: 16, duration: 14 }),
            transform: `translateX(${imageSlide}px)`,
            maxWidth: Math.min(500, layout.maxImageWidth),
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <SplitImageReveal
            src={imageUrl}
            alt={title}
            enterFrame={16}
            duration={18}
            accentColor={GOLD}
            borderRadius={12}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Final / #1 Moment (8s - 10s)
// Large #1, background zoom, image reveal, title, accent line, settle
// ─────────────────────────────────────────────────────────────────────────────

const FinalScene: React.FC<Top10CountdownProps & { durationInFrames: number }> = ({
  itemTitle,
  description,
  image,
  category,
  statistic,
  statisticLabel,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const title = itemTitle ?? 'The #1 Pick';
  const desc = typeof description === 'string' ? description.trim() : '';
  const imageUrl = typeof image === 'string' ? image : undefined;
  const categoryText = typeof category === 'string' && category.trim() ? category.trim() : '';
  const statValue = typeof statistic === 'number' && Number.isFinite(statistic) ? statistic : 0;
  const label = typeof statisticLabel === 'string' && statisticLabel.trim() ? statisticLabel.trim() : 'Score';

  const bgScale = interpolate(frame, [0, 20], [1, 1.03], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const oneSpring = spring({
    fps: 30,
    frame: frame - 2,
    config: { damping: 10, stiffness: 140, mass: 0.9 },
    durationInFrames: 26,
  });

  const lineWidth = interpolate(frame, [14, 32], [0, 180], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Ambient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}15 0%, transparent 55%)`,
          transform: `scale(${bgScale})`,
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
                  background: `radial-gradient(circle at 50% 50%, ${RED}10 0%, transparent 40%)`,
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
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        {/* #1 Rank */}
        <div
          style={{
            opacity: useFadeIn({ from: 2, duration: 12 }),
            transform: `scale(${oneSpring})`,
          }}
        >
          <RankingCounter
            rank={1}
            total={10}
            enterFrame={2}
            variant="pop"
            color={GOLD}
            suffixColor="rgba(255,255,255,0.55)"
            size={Math.min(200, 1920 * 0.1)}
          />
        </div>

        {/* Category badge */}
        {categoryText && (
          <div
            style={{
              opacity: useFadeIn({ from: 10, duration: 12 }),
              transform: `scale(${useSpringScale({ from: 10, damping: 14, stiffness: 150 })}`,
              padding: 'clamp(6px, 0.8vh, 10px) clamp(14px, 1.6vw, 22px)',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${GOLD}, ${RED})`,
              color: DARK,
              fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(10px, 0.8vw, 13px)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {categoryText}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            opacity: useFadeIn({ from: 12, duration: 14 }),
            transform: `translateY(${useSpringSlideUp({ from: 12, distance: 16, damping: 18, stiffness: 120 })}px)`,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          <KineticTypography
            text={title}
            enterFrame={12}
            stagger={3}
            tokenDuration={14}
            variant="rise"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 52px)',
              fontWeight: 700,
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Description */}
        {desc && (
          <div
            style={{
              opacity: useFadeIn({ from: 20, duration: 14 }),
              transform: `translateY(${useSpringSlideUp({ from: 20, distance: 14, damping: 16, stiffness: 110 })}px)`,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(13px, 1vw, 16px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            {desc}
          </div>
        )}

        {/* Image */}
        <div
          style={{
            opacity: useFadeIn({ from: 16, duration: 14 }),
            transform: `scale(${interpolate(frame, [16, 32], [0.97, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })})`,
            maxWidth: Math.min(500, layout.maxImageWidth),
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <ProductImage
            imageUrl={imageUrl}
            productName={title}
            primaryColor={GOLD}
            accentColor={RED}
            enterFrame={16}
            maxWidth={Math.min(500, layout.maxImageWidth)}
          />
        </div>

        {/* Statistic */}
        {statValue > 0 && (
          <div
            style={{
              opacity: useFadeIn({ from: 22, duration: 12 }),
              textAlign: 'center',
            }}
          >
            <NumberCounter
              value={statValue}
              delay={22}
              color={GOLD}
              size={Math.min(48, 1920 * 0.025)}
              suffix=""
            />
            <div
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(11px, 0.8vw, 13px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {label}
            </div>
          </div>
        )}

        {/* Accent line */}
        <div
          style={{
            width: `${lineWidth}px`,
            height: 3,
            background: `linear-gradient(90deg, ${GOLD}, ${RED})`,
            borderRadius: 2,
            boxShadow: `0 0 12px ${GOLD}66`,
          }}
        />
      </AbsoluteFill>

      <LightSweep enterFrame={18} duration={28} angle={-14} intensity={0.2} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<
  Record<string, React.FC<Top10CountdownProps & { durationInFrames: number }>>
> = {
  intro: OpeningScene,
  product: RankRevealScene,
  features: StatisticsScene,
  headline: TransitionScene,
  cta: FinalScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Top10Countdown — professional high-retention YouTube ranking video.
 *
 * Scene breakdown:
 *  1. Opening (0 - 2s): TOP 10 reveal, title, large rank number, highlight line
 *  2. Rank Reveal (2s - 4s): rank pop, image split reveal, title, description, badge
 *  3. Statistics (4s - 6s): animated counter, label, highlight line, supporting text
 *  4. Countdown Transition (6s - 8s): rank slide, progress bar, motion blur
 *  5. Final / #1 Moment (8s - 10s): #1 reveal, image, title, accent line, settle
 *
 * Fixed duration: 10 seconds (300 frames @ 30fps).
 */
export const Top10Countdown: React.FC<Top10CountdownProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(top10CountdownScenes, durationInFrames);

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
