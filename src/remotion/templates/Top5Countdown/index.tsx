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
import { SplitImageReveal } from '../../components/SplitImageReveal';
import { MaskReveal } from '../../components/MaskReveal';
import { KineticTypography } from '../../components/KineticTypography';
import { FilmGrain } from '../../components/FilmGrain';
import { LightSweep } from '../../components/LightSweep';
import { ParallaxLayers } from '../../components/ParallaxLayers';
import { top5CountdownScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const GOLD = '#FFD60A';
const RED = '#FF3B5C';
const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────────────────────────────────────
// Extended props for Top 5 specific fields
// ─────────────────────────────────────────────────────────────────────────────

interface Top5CountdownProps extends VideoContentProps {
  listTitle?: string;
  rank?: number;
  itemTitle?: string;
  description?: string;
  image?: string;
  statistic?: number;
  statisticLabel?: string;
  category?: string;
  accentText?: string;
  item1Title?: string;
  item1Description?: string;
  item1Image?: string;
  item1Statistic?: number;
  item1StatisticLabel?: string;
  item1AccentText?: string;
  item2Title?: string;
  item2Description?: string;
  item2Image?: string;
  item2Statistic?: number;
  item2StatisticLabel?: string;
  item2AccentText?: string;
  item3Title?: string;
  item3Description?: string;
  item3Image?: string;
  item3Statistic?: number;
  item3StatisticLabel?: string;
  item3AccentText?: string;
  item4Title?: string;
  item4Description?: string;
  item4Image?: string;
  item4Statistic?: number;
  item4StatisticLabel?: string;
  item4AccentText?: string;
  item5Title?: string;
  item5Description?: string;
  item5Image?: string;
  item5Statistic?: number;
  item5StatisticLabel?: string;
  item5AccentText?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getItemFields(content: Top5CountdownProps, rank: number) {
  const prefix = `item${rank}` as 'item1' | 'item2' | 'item3' | 'item4' | 'item5';
  return {
    title: (content as any)[`${prefix}Title`] ?? content.itemTitle ?? 'Ranked Item',
    description: (content as any)[`${prefix}Description`] ?? content.description ?? '',
    image: (content as any)[`${prefix}Image`] ?? content.image ?? undefined,
    statistic: (content as any)[`${prefix}Statistic`] ?? content.statistic ?? 0,
    statisticLabel: (content as any)[`${prefix}StatisticLabel`] ?? content.statisticLabel ?? 'Score',
    accentText: (content as any)[`${prefix}AccentText`] ?? content.accentText ?? '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Opening (0 - 3s)
// ─────────────────────────────────────────────────────────────────────────────

const OpeningScene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  headline,
  listTitle,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const title = listTitle ?? headline ?? 'This Week\'s Top 5';
  const displayRank = 5;

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
        {/* TOP 5 label with mask reveal */}
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
            {headline ?? 'TOP 5'}
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
            total={5}
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
// Scene 2-6 — Item Reveal (3s - 23s)
// ─────────────────────────────────────────────────────────────────────────────

const ItemRevealScene: React.FC<Top5CountdownProps & { durationInFrames: number; rank?: number }> = ({
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

  const displayRank = typeof rank === 'number' && Number.isFinite(rank) ? rank : 5;
  const item = getItemFields({
    itemTitle,
    description,
    image,
    statistic: 0,
    statisticLabel: '',
    category,
    accentText: '',
    listTitle: '',
    headline: '',
    rank: displayRank,
    item1Title: '', item1Description: '', item1Image: '', item1Statistic: 0, item1StatisticLabel: '', item1AccentText: '',
    item2Title: '', item2Description: '', item2Image: '', item2Statistic: 0, item2StatisticLabel: '', item2AccentText: '',
    item3Title: '', item3Description: '', item3Image: '', item3Statistic: 0, item3StatisticLabel: '', item3AccentText: '',
    item4Title: '', item4Description: '', item4Image: '', item4Statistic: 0, item4StatisticLabel: '', item4AccentText: '',
    item5Title: '', item5Description: '', item5Image: '', item5Statistic: 0, item5StatisticLabel: '', item5AccentText: '',
  } as Top5CountdownProps, displayRank);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
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
              total={5}
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
// Scene 7 — Final / #1 Moment (19s - 25s)
// ─────────────────────────────────────────────────────────────────────────────

const FinalScene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
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

  const item = getItemFields({
    itemTitle,
    description,
    image,
    statistic,
    statisticLabel,
    category,
    accentText: '',
    listTitle: '',
    headline: '',
    rank: 1,
    item1Title: itemTitle ?? '', item1Description: description ?? '', item1Image: image ?? '', item1Statistic: statistic ?? 0, item1StatisticLabel: statisticLabel ?? '', item1AccentText: '',
    item2Title: '', item2Description: '', item2Image: '', item2Statistic: 0, item2StatisticLabel: '', item2AccentText: '',
    item3Title: '', item3Description: '', item3Image: '', item3Statistic: 0, item3StatisticLabel: '', item3AccentText: '',
    item4Title: '', item4Description: '', item4Image: '', item4Statistic: 0, item4StatisticLabel: '', item4AccentText: '',
    item5Title: '', item5Description: '', item5Image: '', item5Statistic: 0, item5StatisticLabel: '', item5AccentText: '',
  } as Top5CountdownProps, 1);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const categoryText = typeof category === 'string' && category.trim() ? category.trim() : '';
  const statValue = typeof item.statistic === 'number' && Number.isFinite(item.statistic) ? item.statistic : 0;
  const label = typeof item.statisticLabel === 'string' && item.statisticLabel.trim() ? item.statisticLabel.trim() : 'Score';

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
            total={5}
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
          <SplitImageReveal
            src={imageUrl}
            alt={title}
            enterFrame={16}
            duration={18}
            accentColor={GOLD}
            borderRadius={12}
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
  Record<string, React.FC<Top5CountdownProps & { durationInFrames: number; rank?: number }>>
> = {
  intro: OpeningScene,
  product: ItemRevealScene,
  features: ItemRevealScene,
  headline: ItemRevealScene,
  cta: FinalScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Top5Countdown — professional high-retention ranking video.
 *
 * Scene breakdown:
 *  1. Opening (0 - 3s): TOP 5 reveal, title, large rank number, highlight line
 *  2. #5 Reveal (3s - 7s): rank pop, image reveal, title, description, badge
 *  3. #4 Reveal (7s - 11s): rank pop, image reveal, title, description, badge
 *  4. #3 Reveal (11s - 15s): rank pop, image reveal, title, description, badge
 *  5. #2 Reveal (15s - 19s): rank pop, image reveal, title, description, badge
 *  6. #1 Reveal (19s - 23s): #1 reveal, image, title, statistic, accent line
 *  7. Final (23s - 25s): final outro
 *
 * Fixed duration: 25 seconds (750 frames @ 30fps).
 */
export const Top5Countdown: React.FC<Top5CountdownProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(top5CountdownScenes, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => {
        const SceneComponent = SCENE_COMPONENTS[scene.type];

        if (!SceneComponent) return null;

        let rank: number | undefined;
        if (scene.id === 'scene-item-5') rank = 5;
        else if (scene.id === 'scene-item-4') rank = 4;
        else if (scene.id === 'scene-item-3') rank = 3;
        else if (scene.id === 'scene-item-2') rank = 2;
        else if (scene.id === 'scene-item-1') rank = 1;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent {...content} durationInFrames={scene.durationInFrames} rank={rank} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
