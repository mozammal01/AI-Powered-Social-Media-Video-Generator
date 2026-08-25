import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { useFadeIn, useSceneOpacity, useSpringSlideUp } from '../../animations';
import {
  FilmGrain,
  LightSweep,
  MaskReveal,
  BlurFocus,
  ParallaxLayers,
} from '../../components';
import { ListItem } from './components/ListItem';
import { RankNumber } from './components/RankNumber';
import { Statistic } from './components/Statistic';
import { Transition } from './components/Transition';
import { top10CountdownScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const RED = '#FF3B3B';
const WHITE = '#FFFFFF';
const DARK = '#0A0A0F';

// ─────────────────────────────────────────────────────────────────────────────
// Intro hook: countdown from 10 → 1 with fast cuts, then title reveal
// ─────────────────────────────────────────────────────────────────────────────

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);

  const countdownDuration = 48;
  const countdownProgress = interpolate(frame, [0, countdownDuration], [10, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const displayRank = Math.round(countdownProgress);

  const titleY = useSpringSlideUp({ from: countdownDuration + 8, distance: 50, damping: 18, stiffness: 100 });
  const titleOpacity = useFadeIn({ from: countdownDuration + 8, duration: 18 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: DARK,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vh, 28px)',
        }}
      >
        {/* Countdown number */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'clamp(100px, 22vh, 260px)',
          }}
        >
          {frame < countdownDuration && (
            <RankNumber
              rank={displayRank}
              enterFrame={0}
              size={Math.max(80, 220 - (countdownDuration - frame) * 3)}
              color={WHITE}
              glowColor="rgba(255,59,59,0.5)"
            />
          )}
        </div>

        {/* Title reveal after countdown */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(8px, 1.4vh, 18px)',
          }}
        >
          <MaskReveal direction="up" enterFrame={0} duration={16}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(12px, 1.2vw, 18px)',
                fontWeight: 700,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: RED,
              }}
            >
              Top 10 Countdown
            </div>
          </MaskReveal>

          <MaskReveal direction="right" enterFrame={6} duration={20}>
            <h1
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 'clamp(36px, 5.5vw, 80px)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: WHITE,
                textShadow: '0 6px 36px rgba(0,0,0,0.7)',
              }}
            >
              Nature's Greatest Wonders
            </h1>
          </MaskReveal>

          <div
            style={{
              width: 100,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${RED}, transparent)`,
              margin: '0 auto',
              opacity: useFadeIn({ from: 18, duration: 10 }),
            }}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '6%',
            left: '8%',
            right: '8%',
          }}
        >
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${interpolate(frame, [0, countdownDuration + 20], [0, 8], { extrapolateRight: 'clamp' })}%`,
                background: RED,
                borderRadius: 2,
                boxShadow: `0 0 12px ${RED}66`,
              }}
            />
          </div>
        </div>
      </div>

      <FilmGrain opacity={0.35} blendMode="overlay" vignette vignetteStrength={0.45} flicker={0.03} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Item scene: renders a single ranked entry with image, text, stat
// ─────────────────────────────────────────────────────────────────────────────

const ItemScene: React.FC<{ item: ListItemData; rank: number }> = ({ item, rank }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity }}>
      <ListItem item={item} enterFrame={0} duration={durationInFrames} />

      {/* Rank watermark */}
      <div
        style={{
          position: 'absolute',
          right: '2%',
          top: '4%',
          opacity: interpolate(frame, [20, 36], [0, 0.06], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            fontSize: 'clamp(180px, 28vw, 420px)',
            fontWeight: 900,
            lineHeight: 1,
            color: WHITE,
            WebkitTextStroke: '3px rgba(255,255,255,0.2)',
          }}
        >
          #{rank}
        </div>
      </div>

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${RED}44, transparent)`,
          top: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: 'clamp' })}%`,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      <FilmGrain opacity={0.25} blendMode="overlay" flicker={0.02} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Finale: #1 reveal with full cinematic treatment
// ─────────────────────────────────────────────────────────────────────────────

const FinaleScene: React.FC<{ item: ListItemData }> = ({ item }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(durationInFrames);

  const scale = interpolate(frame, [0, 24], [1.08, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const ctaOpacity = useFadeIn({ from: 50, duration: 16 });
  const ctaY = useSpringSlideUp({ from: 50, distance: 20, damping: 18, stiffness: 110 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: DARK,
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 1.8vh, 24px)',
        }}
      >
        {/* Background parallax glow */}
        <ParallaxLayers
          amplitude={18}
          verticalAmplitude={12}
          periodFrames={200}
          layers={[
            {
              speed: 0.4,
              content: (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 45%, ${RED}15 0%, transparent 55%)`,
                  }}
                />
              ),
            },
          ]}
        />

        {/* Rank reveal */}
        <BlurFocus fromBlur={12} toBlur={0} enterFrame={0} duration={24}>
          <div
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              fontSize: 'clamp(60px, 10vw, 160px)',
              fontWeight: 900,
              lineHeight: 1,
              color: WHITE,
              textShadow: `0 0 60px ${RED}66`,
            }}
          >
            #{item.rank}
          </div>
        </BlurFocus>

        <MaskReveal direction="up" enterFrame={16} duration={20}>
          <h2
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 64px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </h2>
        </MaskReveal>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px, 1.3vw, 20px)',
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            maxWidth: '65%',
            lineHeight: 1.5,
            opacity: useFadeIn({ from: 32, duration: 14 }),
          }}
        >
          {item.description}
        </p>

        {item.statistic && (
          <Statistic
            value={item.statistic.value}
            label={item.statistic.label}
            enterFrame={38}
            color={RED}
            size="lg"
          />
        )}

        <div
          style={{
            marginTop: 'clamp(8px, 1.6vh, 20px)',
            padding: 'clamp(10px, 1.2vh, 14px) clamp(28px, 3vw, 48px)',
            border: `2px solid ${RED}`,
            borderRadius: 999,
            fontFamily: SANS,
            fontSize: 'clamp(12px, 1vw, 16px)',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: WHITE,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            boxShadow: `0 0 24px ${RED}33`,
          }}
        >
          Watch The Full Story
        </div>
      </div>

      <LightSweep enterFrame={24} duration={32} angle={-14} intensity={0.35} color="#FFFFFF" />
      <FilmGrain opacity={0.4} blendMode="overlay" vignette vignetteStrength={0.5} flicker={0.03} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

type ListItemData = {
  rank: number;
  title: string;
  description: string;
  imageSrc: string;
  statistic?: { value: string; label: string };
};

const SCENE_COMPONENTS: Record<string, React.FC<{ items: ListItemData[]; item?: ListItemData; rank?: number }>> = {
  intro: () => <IntroScene />,
  product: ({ item, rank }) => item ? <ItemScene item={item} rank={rank ?? item.rank} /> : null,
  features: ({ item, rank }) => item ? <ItemScene item={item} rank={rank ?? item.rank} /> : null,
  headline: ({ item }) => item ? <FinaleScene item={item} /> : null,
  outro: () => null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Top10Countdown — premium 30-second YouTube listicle sequence.
 *
 * Scene breakdown:
 *  1. Intro hook: fast countdown 10→1 with animated rank numbers, title reveal
 *  2-11. Ranked items #10 through #2: image reveal, kinetic typography, statistics
 *  12. Finale: #1 reveal with cinematic treatment, blur focus, light sweep
 *
 * Reusable components:
 *  - RankNumber: spring-driven animated rank with rotation and motion blur
 *  - CountdownProgressBar: overall countdown progress with glow pulse
 *  - ListItem: full item card with split image reveal, slide-in text, statistics
 *  - Statistic: animated stat callout with spring scale-in
 *  - Transition: item-to-item slide/zoom/wipe transitions
 *
 * Uses frame-based interpolation and spring physics for high-retention pacing.
 */
export const Top10Countdown: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const items = (content as unknown as { items?: ListItemData[] }).items ?? [];
  const scenes = scaleScenesToDuration(top10CountdownScenes, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.type];

        if (!SceneComponent) return null;

        const itemIndex = scene.id.startsWith('scene-item-')
          ? parseInt(scene.id.split('-').pop() ?? '0', 10)
          : undefined;
        const rank = itemIndex ? 11 - itemIndex : undefined;
        const item = rank ? items[rank - 1] : undefined;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent
              items={items}
              item={item}
              rank={rank}
            />
            <Transition
              type={scene.transition?.type === 'zoom' ? 'zoom' : scene.transition?.type === 'wipe' ? 'wipe' : 'slide'}
              enterFrame={scene.durationInFrames - (scene.transition?.durationInFrames ?? 10)}
              duration={scene.transition?.durationInFrames ?? 10}
              color={RED}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
