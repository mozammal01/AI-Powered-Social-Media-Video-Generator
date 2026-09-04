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
import {
  FilmGrain,
  LightSweep,
  MaskReveal,
  BlurFocus,
  ParallaxLayers,
  KineticTypography,
  SplitImageReveal,
} from '../../components';
import { NumberCounter } from '../../animations/NumberCounter';
import { cinematicMovieTrailerScenes } from './scenes';

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const GOLD = '#D4A853';
const CREAM = '#F0E6D3';
const DARK = '#08080F';

function useSlowCameraPush({
  enterFrame = 0,
  duration = 120,
  initialScale = 1.0,
  targetScale = 1.06,
  damping = 22,
  stiffness = 40,
}: {
  enterFrame?: number;
  duration?: number;
  initialScale?: number;
  targetScale?: number;
  damping?: number;
  stiffness?: number;
} = {}): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping, stiffness },
    durationInFrames: duration,
  });
  return interpolate(progress, [0, 1], [initialScale, targetScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

const OpeningScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  headline,
  subtitle,
  category,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const layout = useResponsiveLayout();
  const title = headline ?? 'THE FUTURE IS NOW';
  const sub = subtitle ?? 'A NEW ERA BEGINS';
  const cat = category ?? 'ORIGINAL SERIES';

  const scale = useSlowCameraPush({ duration: 75, targetScale: 1.04 });

  const textOpacity = useFadeIn({ from: 20, duration: 18 });
  const textY = useSpringSlideUp({ from: 20, distance: 24, damping: 18, stiffness: 110 });
  const catOpacity = useFadeIn({ from: 8, duration: 14 });
  const lineOpacity = useFadeIn({ from: 38, duration: 14 });
  const subOpacity = useFadeIn({ from: 42, duration: 14 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: DARK,
          transform: `scale(${scale})`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 45%, ${GOLD}15 0%, transparent 60%)`,
          }}
        />

        <ParallaxLayers
          amplitude={14}
          verticalAmplitude={8}
          periodFrames={240}
          layers={[
            {
              speed: 0.25,
              content: (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${CREAM}08 0%, transparent 40%)`,
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
            gap: 'clamp(10px, 1.8vh, 22px)',
            padding: `0 ${layout.paddingX}px`,
          }}
        >
          {cat && (
            <div
              style={{
                opacity: catOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(10px, 0.9vw, 14px)',
                fontWeight: 600,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: GOLD,
              }}
            >
              {cat}
            </div>
          )}

          <MaskReveal direction="up" enterFrame={16} duration={22}>
            <div
              style={{
                opacity: textOpacity,
                transform: `translateY(${textY}px)`,
                fontFamily: SERIF,
                fontSize: 'clamp(36px, 6vw, 96px)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                textAlign: 'center',
                color: CREAM,
                textShadow: '0 8px 48px rgba(0,0,0,0.75)',
              }}
            >
              {title}
            </div>
          </MaskReveal>

          <div
            style={{
              width: Math.round(100 * layout.fontScale),
              height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: lineOpacity,
            }}
          />

          {sub && (
            <div
              style={{
                opacity: subOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(14px, 1.4vw, 22px)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: CREAM,
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {sub}
            </div>
          )}
        </AbsoluteFill>
      </div>

      <FilmGrain opacity={0.35} blendMode="overlay" vignette vignetteStrength={0.4} flicker={0.03} />
      <LightSweep enterFrame={55} duration={24} angle={-14} intensity={0.3} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const MainTitleScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  headline,
  subtitle,
  year,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const title = headline ?? 'THE FUTURE IS NOW';
  const sub = subtitle ?? 'A NEW ERA BEGINS';

  const titleScale = useSpringScale({ from: 0, damping: 16, stiffness: 100 });
  const titleY = useSpringSlideUp({ from: 8, distance: 30, damping: 16, stiffness: 100 });
  const titleOpacity = useFadeIn({ from: 8, duration: 20 });

  const blur = interpolate(frame, [4, 24], [6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const lineWidth = interpolate(frame, [18, 36], [0, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const subOpacity = useFadeIn({ from: 30, duration: 18 });
  const yearOpacity = useFadeIn({ from: 42, duration: 14 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, ${GOLD}12 0%, transparent 55%)`,
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
                  background: `linear-gradient(180deg, transparent 0%, ${GOLD}06 50%, transparent 100%)`,
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
        <BlurFocus fromBlur={blur} toBlur={0} enterFrame={4} duration={20}>
          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${0.85 + titleScale * 0.15}) translateY(${titleY}px)`,
              fontFamily: SERIF,
              fontSize: 'clamp(42px, 7vw, 110px)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              lineHeight: 1.05,
              textAlign: 'center',
              color: CREAM,
              textShadow: '0 8px 48px rgba(0,0,0,0.75)',
            }}
          >
            {title}
          </div>
        </BlurFocus>

        <div
          style={{
            width: `${lineWidth}px`,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            borderRadius: 1,
          }}
        />

        {sub && (
          <div
            style={{
              opacity: subOpacity,
              fontFamily: SANS,
              fontSize: 'clamp(16px, 1.8vw, 28px)',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: CREAM,
              textAlign: 'center',
              maxWidth: '75%',
            }}
          >
            {sub}
          </div>
        )}

        {year && (
          <div
            style={{
              opacity: yearOpacity,
              fontFamily: SANS,
              fontSize: 'clamp(14px, 1.2vw, 20px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: GOLD,
            }}
          >
            {year}
          </div>
        )}
      </AbsoluteFill>

      <LightSweep enterFrame={30} duration={28} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const MainVisualScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  image,
  headline,
  category,
  description,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const imageUrl = typeof image === 'string' ? image : undefined;
  const title = headline ?? 'THE FUTURE IS NOW';
  const cat = category ?? 'ORIGINAL SERIES';
  const desc = typeof description === 'string' ? description.trim() : '';

  const imageScale = interpolate(frame, [0, 30], [1.12, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const imageReveal = interpolate(frame, [8, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const parallaxX = interpolate(frame, [0, 150], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const textOpacity = useFadeIn({ from: 20, duration: 22 });
  const textY = useSpringSlideUp({ from: 20, distance: 28, damping: 18, stiffness: 110 });
  const catOpacity = useFadeIn({ from: 12, duration: 14 });
  const descOpacity = useFadeIn({ from: 36, duration: 18 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${GOLD}10 0%, transparent 50%)` }} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: layout.horizontalLayout ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontalLayout ? 'clamp(24px, 4vw, 48px)' : 'clamp(16px, 2vh, 24px)',
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        <div
          style={{
            flex: layout.horizontalLayout ? '0 0 auto' : '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(8px, 1.5vh, 16px)',
            maxWidth: Math.min(600, layout.maxTextWidth),
            textAlign: layout.horizontalLayout ? 'left' : 'center',
            alignItems: layout.horizontalLayout ? 'flex-start' : 'center',
          }}
        >
          {cat && (
            <div
              style={{
                opacity: catOpacity,
                padding: 'clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 18px)',
                borderRadius: 999,
                background: `linear-gradient(135deg, ${GOLD}, ${CREAM})`,
                color: DARK,
                fontFamily: SANS,
                fontSize: 'clamp(10px, 0.8vw, 14px)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {cat}
            </div>
          )}

          <MaskReveal direction="up" enterFrame={20} duration={18}>
            <div
              style={{
                opacity: textOpacity,
                transform: `translateY(${textY}px)`,
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 3.5vw, 56px)',
                fontWeight: 700,
                color: CREAM,
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
          </MaskReveal>

          {desc && (
            <div
              style={{
                opacity: descOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                fontWeight: 500,
                color: 'rgba(240,230,211,0.7)',
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              {desc}
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 1 auto',
            maxWidth: Math.min(700, layout.maxImageWidth),
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            opacity: imageReveal,
            transform: `scale(${imageScale}) translateX(${parallaxX}px)`,
          }}
        >
          <SplitImageReveal
            src={imageUrl}
            alt={title}
            enterFrame={8}
            duration={24}
            accentColor={GOLD}
            borderRadius={16}
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 60%, rgba(8,8,15,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

const StoryBeatScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  headline,
  description,
  image,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const imageUrl = typeof image === 'string' ? image : undefined;
  const title = headline ?? 'THE FUTURE IS NOW';
  const desc = typeof description === 'string' ? description.trim() : '';

  const revealProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const lineProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${GOLD}10 0%, transparent 45%)` }} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: layout.horizontalLayout ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(20px, 3vw, 40px)',
          padding: `0 ${layout.paddingX}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: Math.min(600, layout.maxTextWidth),
            transform: `translateX(${(1 - revealProgress) * -60}px)`,
            opacity: revealProgress,
          }}
        >
          <KineticTypography
            text={title}
            mode="words"
            enterFrame={16}
            stagger={3}
            tokenDuration={20}
            variant="rise"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 3.5vw, 56px)',
              fontWeight: 700,
              color: CREAM,
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              lineHeight: 1.2,
            }}
          />

          <div
            style={{
              width: `${lineProgress * 120}px`,
              height: 2,
              background: `linear-gradient(90deg, ${GOLD}, transparent)`,
              marginTop: 'clamp(12px, 1.5vh, 20px)',
            }}
          />

          {desc && (
            <div
              style={{
                marginTop: 'clamp(8px, 1vh, 14px)',
                fontFamily: SANS,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                fontWeight: 500,
                color: 'rgba(240,230,211,0.7)',
                lineHeight: 1.5,
              }}
            >
              {desc}
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 1 auto',
            maxWidth: Math.min(500, layout.maxImageWidth),
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            transform: `translateX(${(1 - revealProgress) * 60}px)`,
            opacity: revealProgress,
          }}
        >
          <SplitImageReveal
            src={imageUrl}
            alt={title}
            enterFrame={10}
            duration={22}
            accentColor={GOLD}
            borderRadius={12}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StatisticScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  statistic,
  statisticLabel,
  headline,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const value = typeof statistic === 'number' && Number.isFinite(statistic) ? statistic : 82;
  const label = typeof statisticLabel === 'string' && statisticLabel.trim() ? statisticLabel : 'OF BUSINESSES ARE ADOPTING AI';
  const title = headline ?? 'THE FUTURE IS NOW';

  const counterScale = spring({
    fps: 30,
    frame: frame - 8,
    config: { damping: 10, stiffness: 140, mass: 0.9 },
    durationInFrames: 30,
  });

  const lineWidth = interpolate(frame, [20, 50], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const titleOpacity = useFadeIn({ from: 8, duration: 18 });
  const labelOpacity = useFadeIn({ from: 28, duration: 18 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${GOLD}12 0%, transparent 50%)` }} />

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
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: SANS,
            fontSize: 'clamp(12px, 1vw, 16px)',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: GOLD,
            marginBottom: 'clamp(8px, 1vh, 14px)',
          }}
        >
          {title}
        </div>

        <div
          style={{
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `scale(${0.6 + counterScale * 0.4})`,
            fontFamily: SERIF,
            fontSize: 'clamp(64px, 12vw, 180px)',
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1,
            textShadow: '0 8px 48px rgba(0,0,0,0.7)',
          }}
        >
          <NumberCounter value={value} delay={8} duration={30} color={GOLD} size={Math.min(120, 1920 * 0.06)} suffix="%" />
        </div>

        <div
          style={{
            opacity: labelOpacity,
            fontFamily: SANS,
            fontSize: 'clamp(14px, 1.2vw, 20px)',
            fontWeight: 500,
            color: 'rgba(240,230,211,0.75)',
            textAlign: 'center',
            maxWidth: '70%',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </div>

        <div
          style={{
            width: `${lineWidth}px`,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            borderRadius: 2,
            marginTop: 'clamp(8px, 1vh, 14px)',
          }}
        />
      </AbsoluteFill>

      <FilmGrain opacity={0.25} blendMode="overlay" flicker={0.02} />
    </AbsoluteFill>
  );
};

const ClimaxScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  headline,
  subtitle,
  category,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const layout = useResponsiveLayout();
  const title = headline ?? 'THE FUTURE IS NOW';
  const sub = subtitle ?? 'A NEW ERA BEGINS';
  const cat = category ?? 'ORIGINAL SERIES';

  const scale = useSlowCameraPush({ duration: 120, targetScale: 1.05, damping: 18, stiffness: 50 });

  const catOpacity = useFadeIn({ from: 6, duration: 14 });
  const titleOpacity = useFadeIn({ from: 10, duration: 20 });
  const titleY = useSpringSlideUp({ from: 10, distance: 20, damping: 16, stiffness: 110 });
  const subOpacity = useFadeIn({ from: 30, duration: 18 });
  const lineOpacity = useFadeIn({ from: 40, duration: 14 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: DARK,
          transform: `scale(${scale})`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 45%, ${GOLD}18 0%, transparent 55%)`,
          }}
        />

        <ParallaxLayers
          amplitude={18}
          verticalAmplitude={12}
          periodFrames={200}
          layers={[
            {
              speed: -0.4,
              content: (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${CREAM}08 0%, transparent 40%)`,
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
            gap: 'clamp(10px, 1.6vh, 20px)',
            padding: `0 ${layout.paddingX}px`,
          }}
        >
          {cat && (
            <div
              style={{
                opacity: catOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(10px, 0.9vw, 14px)',
                fontWeight: 600,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: GOLD,
              }}
            >
              {cat}
            </div>
          )}

          <MaskReveal direction="up" enterFrame={10} duration={24}>
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                fontFamily: SERIF,
                fontSize: 'clamp(48px, 8vw, 120px)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                textAlign: 'center',
                color: CREAM,
                textShadow: '0 8px 48px rgba(0,0,0,0.8)',
              }}
            >
              {title}
            </div>
          </MaskReveal>

          {sub && (
            <div
              style={{
                opacity: subOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(18px, 2.2vw, 36px)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: CREAM,
                textAlign: 'center',
                maxWidth: '75%',
              }}
            >
              {sub}
            </div>
          )}

          <div
            style={{
              width: Math.round(120 * layout.fontScale),
              height: 3,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: lineOpacity,
            }}
          />
        </AbsoluteFill>
      </div>

      <FilmGrain opacity={0.4} blendMode="overlay" vignette vignetteStrength={0.45} flicker={0.03} />
      <LightSweep enterFrame={50} duration={30} angle={-14} intensity={0.3} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const FinalTitleScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  headline,
  subtitle,
  year,
  cta,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();
  const title = headline ?? 'THE FUTURE IS NOW';
  const sub = subtitle ?? 'A NEW ERA BEGINS';

  const scale = useSlowCameraPush({ enterFrame: 0, duration: 60, targetScale: 1.02, damping: 24, stiffness: 30 });

  const lineWidth = interpolate(frame, [20, 60], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const titleOpacity = useFadeIn({ from: 8, duration: 20 });
  const titleY = useSpringSlideUp({ from: 8, distance: 20, damping: 18, stiffness: 110 });
  const subOpacity = useFadeIn({ from: 28, duration: 16 });
  const yearOpacity = useFadeIn({ from: 38, duration: 14 });
  const ctaOpacity = useFadeIn({ from: 48, duration: 14 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: DARK,
          transform: `scale(${scale})`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 46%, ${GOLD}12 0%, transparent 55%)`,
          }}
        />

        <ParallaxLayers
          amplitude={8}
          verticalAmplitude={5}
          periodFrames={160}
          layers={[
            {
              speed: 0.2,
              content: (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${CREAM}06 0%, transparent 40%)`,
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
            gap: 'clamp(10px, 1.6vh, 20px)',
            padding: `0 ${layout.paddingX}px`,
          }}
        >
          <MaskReveal direction="up" enterFrame={8} duration={22}>
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                fontFamily: SERIF,
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 400,
                letterSpacing: '0.05em',
                lineHeight: 1.1,
                textAlign: 'center',
                color: CREAM,
                textShadow: '0 8px 48px rgba(0,0,0,0.75)',
              }}
            >
              {title}
            </div>
          </MaskReveal>

          <div
            style={{
              width: `${lineWidth}px`,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              borderRadius: 1,
            }}
          />

          {sub && (
            <div
              style={{
                opacity: subOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(16px, 1.6vw, 24px)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: CREAM,
                textAlign: 'center',
                maxWidth: '75%',
              }}
            >
              {sub}
            </div>
          )}

          {year && (
            <div
              style={{
                opacity: yearOpacity,
                fontFamily: SANS,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: GOLD,
                marginTop: 'clamp(4px, 0.8vh, 10px)',
              }}
            >
              {year}
            </div>
          )}

          {cta?.text && (
            <div
              style={{
                opacity: ctaOpacity,
                marginTop: 'clamp(8px, 1.2vh, 16px)',
                padding: 'clamp(8px, 1vh, 12px) clamp(20px, 2.4vw, 36px)',
                border: `1px solid ${GOLD}`,
                borderRadius: 999,
                fontFamily: SANS,
                fontSize: 'clamp(12px, 1vw, 16px)',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: CREAM,
              }}
            >
              {cta.text}
            </div>
          )}
        </AbsoluteFill>
      </div>

      <FilmGrain opacity={0.3} blendMode="overlay" vignette vignetteStrength={0.4} flicker={0.02} />
      <LightSweep enterFrame={60} duration={32} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const SCENE_COMPONENTS: Record<string, React.FC<VideoContentProps & { durationInFrames: number }>> = {
  'scene-opening': OpeningScene,
  'scene-title': MainTitleScene,
  'scene-visual': MainVisualScene,
  'scene-story': StoryBeatScene,
  'scene-statistic': StatisticScene,
  'scene-climax': ClimaxScene,
  'scene-final': FinalTitleScene,
};

export const CinematicMovieTrailer: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(cinematicMovieTrailerScenes, durationInFrames);

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
