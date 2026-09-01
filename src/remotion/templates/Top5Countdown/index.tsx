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
  useSpringSlideUp,
  useResponsiveLayout,
} from '../../animations';
import { RankingCounter } from '../../components/RankingCounter';
import { SplitImageReveal } from '../../components/SplitImageReveal';
import { MaskReveal } from '../../components/MaskReveal';
import { KineticTypography } from '../../components/KineticTypography';
import { LightSweep } from '../../components/LightSweep';
import { top5CountdownScenes } from './scenes';

const DARK = '#08080C';
const GOLD = '#FFD60A';
const RED = '#FF3B5C';
const WHITE = '#FFFFFF';

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
  item1AccentText?: string;
  item2Title?: string;
  item2Description?: string;
  item2Image?: string;
  item2AccentText?: string;
  item3Title?: string;
  item3Description?: string;
  item3Image?: string;
  item3AccentText?: string;
  item4Title?: string;
  item4Description?: string;
  item4Image?: string;
  item4AccentText?: string;
  item5Title?: string;
  item5Description?: string;
  item5Image?: string;
  item5AccentText?: string;
}

function getItemFields(content: Top5CountdownProps, rank: number) {
  const prefix = `item${rank}` as 'item1' | 'item2' | 'item3' | 'item4' | 'item5';
  const record = content as unknown as Record<string, unknown>;
  return {
    title: (record[`${prefix}Title`] as string | undefined) ?? content.itemTitle ?? 'Ranked Item',
    description: (record[`${prefix}Description`] as string | undefined) ?? content.description ?? '',
    image: (record[`${prefix}Image`] as string | undefined) ?? content.image ?? undefined,
    accentText: (record[`${prefix}AccentText`] as string | undefined) ?? content.accentText ?? '',
  };
}

const ENTER_DURATION = 40;
const EXIT_START = 110;

interface ItemLayoutProps {
  accentText: string;
  description: string;
  rankAnimation: React.ReactNode;
  imageAnimation: React.ReactNode;
  textAnimation: React.ReactNode;
  exitOpacity: number;
  exitTransform: string;
}

const ItemLayout: React.FC<ItemLayoutProps> = ({
  accentText,
  description,
  rankAnimation,
  imageAnimation,
  textAnimation,
  exitOpacity,
  exitTransform,
}) => {
  const layout = useResponsiveLayout();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: layout.horizontalLayout ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout.horizontalLayout ? 'clamp(24px, 4vw, 48px)' : 'clamp(16px, 2vh, 24px)',
        padding: `0 ${layout.paddingX}px`,
        opacity: exitOpacity,
        transform: exitTransform,
      }}
    >
      <div
        style={{
          flex: layout.horizontalLayout ? '0 0 auto' : '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px, 1.5vh, 16px)',
          maxWidth: Math.min(700, layout.maxTextWidth),
          textAlign: layout.horizontalLayout ? 'left' : 'center',
          alignItems: layout.horizontalLayout ? 'flex-start' : 'center',
        }}
      >
        <div>{rankAnimation}</div>

        {accentText && (
          <div
            style={{
              padding: 'clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 18px)',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${GOLD}, ${RED})`,
              color: DARK,
              fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(10px, 0.8vw, 14px)',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              alignSelf: layout.horizontalLayout ? 'flex-start' : 'center',
            }}
          >
            {accentText}
          </div>
        )}

        <div>{textAnimation}</div>

        {description && (
          <div
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.1vw, 18px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.5,
              maxWidth: layout.horizontalLayout ? 480 : 520,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div
        style={{
          flex: layout.horizontalLayout ? '0 1 auto' : '0 0 auto',
          maxWidth: Math.min(700, layout.maxImageWidth),
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {imageAnimation}
      </div>
    </AbsoluteFill>
  );
};

const OpeningScene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  headline,
  listTitle,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const title = listTitle ?? headline ?? 'TOP 5 TECH INNOVATIONS';

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}12 0%, transparent 55%)`,
          transform: `scale(${bgScale})`,
        }}
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

        <div
          style={{
            opacity: useFadeIn({ from: 6, duration: 12 }),
            transform: `scale(${numberSpring}) rotate(${(1 - numberSpring) * -6}deg)`,
          }}
        >
          <RankingCounter
            rank={5}
            total={5}
            enterFrame={6}
            variant="pop"
            color={GOLD}
            suffixColor="rgba(255,255,255,0.55)"
            size={Math.min(200, 1920 * 0.11)}
          />
        </div>

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

const Item5Scene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  durationInFrames,
  ...content
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const item = getItemFields(content as Top5CountdownProps, 5);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const accentText = item.accentText;

  const rankSpring = spring({
    fps: 30,
    frame: frame,
    config: { damping: 10, stiffness: 150, mass: 0.9 },
    durationInFrames: ENTER_DURATION,
  });

  const imageReveal = interpolate(frame, [8, ENTER_DURATION + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const textSlide = useSpringSlideUp({ from: 20, distance: 30, damping: 18, stiffness: 120 });
  const textOpacity = useFadeIn({ from: 20, duration: 20 });

  const exitProgress = interpolate(frame, [EXIT_START, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = 1 - exitProgress;
  const exitTransform = `translateY(${-exitProgress * 40}px) translateX(${exitProgress * 60}px)`;

  const rankAnimation = (
    <div
      style={{
        opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `translateX(${(1 - rankSpring) * 80}px) scale(${0.5 + rankSpring * 0.5})`,
      }}
    >
      <RankingCounter
        rank={5}
        total={5}
        enterFrame={0}
        variant="pop"
        color={GOLD}
        suffixColor="rgba(255,255,255,0.55)"
        size={Math.min(160, 1920 * 0.08)}
      />
    </div>
  );

  const imageAnimation = (
    <div style={{ opacity: imageReveal, transform: `scale(${1.1 - imageReveal * 0.1})` }}>
      <SplitImageReveal
        src={imageUrl}
        alt={title}
        enterFrame={8}
        duration={24}
        accentColor={GOLD}
        borderRadius={16}
      />
    </div>
  );

  const textAnimation = (
    <MaskReveal direction="up" enterFrame={20} duration={16}>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textSlide}px)`,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 'clamp(28px, 3.2vw, 52px)',
          fontWeight: 700,
          color: WHITE,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
    </MaskReveal>
  );

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)` }} />
      <ItemLayout
        accentText={accentText}
        description={desc}
        rankAnimation={rankAnimation}
        imageAnimation={imageAnimation}
        textAnimation={textAnimation}
        exitOpacity={exitOpacity}
        exitTransform={exitTransform}
      />
    </AbsoluteFill>
  );
};

const Item4Scene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  durationInFrames,
  ...content
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const item = getItemFields(content as Top5CountdownProps, 4);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const accentText = item.accentText;

  const rankScale = spring({
    fps: 30,
    frame: frame - 5,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: ENTER_DURATION,
  });

  const imageSlide = interpolate(frame, [10, ENTER_DURATION + 5], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const textOpacity = useFadeIn({ from: 18, duration: 22 });
  const textSlide = interpolate(frame, [18, ENTER_DURATION + 10], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [EXIT_START, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = 1 - exitProgress;
  const exitTransform = `translateX(${exitProgress * 100}px)`;

  const rankAnimation = (
    <div
      style={{
        opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${0.3 + rankScale * 0.7})`,
      }}
    >
      <RankingCounter
        rank={4}
        total={5}
        enterFrame={5}
        variant="pop"
        color={GOLD}
        suffixColor="rgba(255,255,255,0.55)"
        size={Math.min(160, 1920 * 0.08)}
      />
    </div>
  );

  const imageAnimation = (
    <div style={{ transform: `translateX(${imageSlide}%)`, opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }) }}>
      <SplitImageReveal
        src={imageUrl}
        alt={title}
        enterFrame={10}
        duration={22}
        accentColor={RED}
        borderRadius={16}
      />
    </div>
  );

  const textAnimation = (
    <MaskReveal direction="left" enterFrame={18} duration={18}>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateX(${textSlide}px)`,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 'clamp(28px, 3.2vw, 52px)',
          fontWeight: 700,
          color: WHITE,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
    </MaskReveal>
  );

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${RED}08 0%, transparent 50%)` }} />
      <ItemLayout
        accentText={accentText}
        description={desc}
        rankAnimation={rankAnimation}
        imageAnimation={imageAnimation}
        textAnimation={textAnimation}
        exitOpacity={exitOpacity}
        exitTransform={exitTransform}
      />
    </AbsoluteFill>
  );
};

const Item3Scene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  durationInFrames,
  ...content
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const item = getItemFields(content as Top5CountdownProps, 3);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const accentText = item.accentText;

  const rankSpring = spring({
    fps: 30,
    frame: frame - 8,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: ENTER_DURATION,
  });

  const imageZoom = interpolate(frame, [12, ENTER_DURATION + 8], [1.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const imageOpacity = interpolate(frame, [12, ENTER_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textOpacity = useFadeIn({ from: 22, duration: 20 });
  const textSlide = useSpringSlideUp({ from: 22, distance: 25, damping: 16, stiffness: 110 });

  const exitProgress = interpolate(frame, [EXIT_START, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = 1 - exitProgress;
  const exitTransform = `scale(${1 + exitProgress * 0.1})`;

  const rankAnimation = (
    <div
      style={{
        opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${0.5 + rankSpring * 0.5}) rotate(${(1 - rankSpring) * -10}deg)`,
      }}
    >
      <RankingCounter
        rank={3}
        total={5}
        enterFrame={8}
        variant="pop"
        color={GOLD}
        suffixColor="rgba(255,255,255,0.55)"
        size={Math.min(160, 1920 * 0.08)}
      />
    </div>
  );

  const imageAnimation = (
    <div style={{ opacity: imageOpacity, transform: `scale(${imageZoom})` }}>
      <SplitImageReveal
        src={imageUrl}
        alt={title}
        enterFrame={12}
        duration={20}
        accentColor={GOLD}
        borderRadius={16}
      />
    </div>
  );

  const textAnimation = (
    <div
      style={{
        opacity: textOpacity,
        transform: `translateY(${textSlide}px)`,
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: 'clamp(28px, 3.2vw, 52px)',
        fontWeight: 700,
        color: WHITE,
        textShadow: '0 4px 24px rgba(0,0,0,0.6)',
        lineHeight: 1.15,
      }}
    >
      {title}
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)` }} />
      <ItemLayout
        accentText={accentText}
        description={desc}
        rankAnimation={rankAnimation}
        imageAnimation={imageAnimation}
        textAnimation={textAnimation}
        exitOpacity={exitOpacity}
        exitTransform={exitTransform}
      />
    </AbsoluteFill>
  );
};

const Item2Scene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  durationInFrames,
  ...content
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const item = getItemFields(content as Top5CountdownProps, 2);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const accentText = item.accentText;

  const rankSpring = spring({
    fps: 30,
    frame: frame - 6,
    config: { damping: 11, stiffness: 155, mass: 0.85 },
    durationInFrames: ENTER_DURATION,
  });

  const imageReveal = interpolate(frame, [10, ENTER_DURATION + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const imageScale = interpolate(frame, [10, ENTER_DURATION + 8], [1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const textOpacity = useFadeIn({ from: 20, duration: 20 });
  const textSlide = interpolate(frame, [20, ENTER_DURATION + 8], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [EXIT_START, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = 1 - exitProgress;
  const exitTransform = `translateY(${exitProgress * 50}px) scale(${1 - exitProgress * 0.05})`;

  const rankAnimation = (
    <div
      style={{
        opacity: interpolate(frame, [6, 16], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${0.4 + rankSpring * 0.6})`,
      }}
    >
      <RankingCounter
        rank={2}
        total={5}
        enterFrame={6}
        variant="pop"
        color={GOLD}
        suffixColor="rgba(255,255,255,0.55)"
        size={Math.min(160, 1920 * 0.08)}
      />
    </div>
  );

  const imageAnimation = (
    <div style={{ opacity: imageReveal, transform: `scale(${imageScale})`, borderRadius: 16, overflow: 'hidden' }}>
      <SplitImageReveal
        src={imageUrl}
        alt={title}
        enterFrame={10}
        duration={22}
        accentColor={RED}
        borderRadius={16}
      />
    </div>
  );

  const textAnimation = (
    <MaskReveal direction="down" enterFrame={20} duration={16}>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textSlide}px)`,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 'clamp(28px, 3.2vw, 52px)',
          fontWeight: 700,
          color: WHITE,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
    </MaskReveal>
  );

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${RED}10 0%, transparent 50%)` }} />
      <ItemLayout
        description={desc}
        accentText={accentText}
        rankAnimation={rankAnimation}
        imageAnimation={imageAnimation}
        textAnimation={textAnimation}
        exitOpacity={exitOpacity}
        exitTransform={exitTransform}
      />
    </AbsoluteFill>
  );
};

const Item1Scene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  durationInFrames,
  ...content
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const item = getItemFields(content as Top5CountdownProps, 1);

  const title = item.title;
  const desc = typeof item.description === 'string' ? item.description.trim() : '';
  const imageUrl = typeof item.image === 'string' ? item.image : undefined;
  const accentText = item.accentText;

  const oneSpring = spring({
    fps: 30,
    frame: frame - 4,
    config: { damping: 10, stiffness: 130, mass: 0.9 },
    durationInFrames: ENTER_DURATION + 5,
  });

  const imageReveal = interpolate(frame, [12, ENTER_DURATION + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const imageScale = interpolate(frame, [12, ENTER_DURATION + 10], [1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const bgScale = interpolate(frame, [0, ENTER_DURATION], [1.05, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [EXIT_START, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const accentOpacity = useFadeIn({ from: 14, duration: 14 });
  const descOpacity = useFadeIn({ from: 24, duration: 16 });
  const titleOpacity = useFadeIn({ from: 16, duration: 16 });
  const exitOpacity = 1 - exitProgress;
  const exitTransform = `scale(${1 + exitProgress * 0.05})`;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}18 0%, transparent 55%)`,
          transform: `scale(${bgScale})`,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vh, 20px)',
          padding: `0 ${layout.paddingX}px`,
          opacity: exitOpacity,
          transform: exitTransform,
        }}
      >
        <div
          style={{
            opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `scale(${0.4 + oneSpring * 0.6})`,
          }}
        >
          <RankingCounter
            rank={1}
            total={5}
            enterFrame={4}
            variant="pop"
            color={GOLD}
            suffixColor="rgba(255,255,255,0.55)"
            size={Math.min(200, 1920 * 0.1)}
          />
        </div>

        {accentText && (
          <div
            style={{
              opacity: accentOpacity,
              padding: 'clamp(6px, 0.8vh, 10px) clamp(14px, 1.6vw, 22px)',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${GOLD}, ${RED})`,
              color: DARK,
              fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(12px, 1vw, 16px)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {accentText}
          </div>
        )}

        <div
          style={{
            opacity: titleOpacity,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          <KineticTypography
            text={title}
            enterFrame={16}
            stagger={3}
            tokenDuration={14}
            variant="rise"
            style={{
              fontSize: 'clamp(32px, 4vw, 64px)',
              fontWeight: 700,
              color: WHITE,
              textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {desc && (
          <div
            style={{
              opacity: descOpacity,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.2vw, 20px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            {desc}
          </div>
        )}

        <div
          style={{
            opacity: imageReveal,
            transform: `scale(${imageScale})`,
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
            enterFrame={12}
            duration={20}
            accentColor={GOLD}
            borderRadius={12}
          />
        </div>
      </AbsoluteFill>

      <LightSweep enterFrame={14} duration={28} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const FinalScene: React.FC<Top5CountdownProps & { durationInFrames: number }> = ({
  listTitle,
  headline,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const title = listTitle ?? headline ?? 'TOP 5 TECH INNOVATIONS';

  const bgScale = interpolate(frame, [0, 20], [1.03, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const lineWidth = interpolate(frame, [8, 24], [0, 140], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${GOLD}12 0%, transparent 55%)`,
          transform: `scale(${bgScale})`,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vh, 20px)',
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        <div
          style={{
            opacity: useFadeIn({ from: 0, duration: 14 }),
            fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
            fontSize: 'clamp(20px, 2.5vw, 40px)',
            fontWeight: 900,
            color: GOLD,
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}
        >
          THANK YOU FOR WATCHING
        </div>

        <div
          style={{
            opacity: useFadeIn({ from: 8, duration: 14 }),
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: 'clamp(24px, 3vw, 48px)',
            fontWeight: 400,
            color: WHITE,
            textAlign: 'center',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {title}
        </div>

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

      <LightSweep enterFrame={6} duration={20} angle={-14} intensity={0.2} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const SCENE_COMPONENTS: Record<string, React.FC<Top5CountdownProps & { durationInFrames: number }>> = {
  'scene-intro': OpeningScene,
  'scene-item-5': Item5Scene,
  'scene-item-4': Item4Scene,
  'scene-item-3': Item3Scene,
  'scene-item-2': Item2Scene,
  'scene-item-1': Item1Scene,
  'scene-final': FinalScene,
};

export const Top5Countdown: React.FC<Top5CountdownProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(top5CountdownScenes, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.id];

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
