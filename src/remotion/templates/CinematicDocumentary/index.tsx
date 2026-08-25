import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { useFadeIn, useSceneOpacity, useSpringSlideUp } from '../../animations';
import {
  FilmGrain,
  LightSweep,
  MaskReveal,
  BlurFocus,
  ParallaxLayers,
  MapZoom,
  DateCounter,
  KineticTypography,
} from '../../components';
import { cinematicDocumentaryScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const GOLD = '#D4A853';
const CREAM = '#F0E6D3';
const DARK = '#08080F';

// ─────────────────────────────────────────────────────────────────────────────
// Local hooks & micro-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useSlowCameraPush — returns a scale value that slowly pushes in
 * from `initialScale` to `targetScale` over `duration` frames,
 * starting at `enterFrame`. Uses spring for organic cinematic motion.
 */
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
}): number {
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

/**
 * Documentary-style lower third with accent rule, name, and title.
 */
const DocLowerThird: React.FC<{
  name: string;
  title: string;
  enterFrame?: number;
  accentColor?: string;
}> = ({ name, title, enterFrame = 0, accentColor = GOLD }) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 14 });
  const x = useSpringSlideUp({ from: enterFrame, distance: 40, damping: 18, stiffness: 100 });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '4%',
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 4,
            height: 48,
            background: accentColor,
            borderRadius: 2,
          }}
        />
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(18px, 2.2vw, 38px)',
              fontWeight: 700,
              color: CREAM,
              letterSpacing: '0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(12px, 1.1vw, 18px)',
              fontWeight: 400,
              color: accentColor,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Cinematic wipe transition using a light band.
 */
const CinematicWipe: React.FC<{ enterFrame?: number; duration?: number; color?: string }> = ({
  enterFrame = 0,
  duration = 18,
  color = GOLD,
}) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame || frame > enterFrame + duration) return null;

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const bandX = interpolate(progress, [0, 0.5, 1], [-40, 0, 110]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${color}22 35%, ${color}66 50%, ${color}22 65%, transparent 100%)`,
          transform: `translateX(${bandX}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Cinematic Opening Title (0 – 5s)
// Slow camera push, masked title reveal, light sweep transition
// ─────────────────────────────────────────────────────────────────────────────

const OpeningScene: React.FC<VideoContentProps> = ({ brand, headline }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const scale = useSlowCameraPush({ duration: 120, targetScale: 1.05 });
  const title = (headline ?? brand.name ?? 'DOCUMENTARY').toUpperCase();

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
        {/* Atmospheric radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 45%, ${brand.primaryColor ?? GOLD}18 0%, transparent 60%)`,
          }}
        />

        {/* Parallax ghost typography */}
        <ParallaxLayers
          amplitude={20}
          verticalAmplitude={12}
          periodFrames={360}
          layers={[
            {
              speed: -0.6,
              content: (
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(80px, 16vw, 260px)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'transparent',
                    WebkitTextStroke: `1px ${brand.primaryColor ?? GOLD}`,
                    opacity: 0.07,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </div>
              ),
            },
          ]}
        />

        {/* Main title lockup */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 1.8vh, 24px)',
          }}
        >
          <MaskReveal direction="up" enterFrame={8} duration={22}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(11px, 1vw, 16px)',
                fontWeight: 600,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: brand.accentColor ?? CREAM,
                opacity: 0.85,
              }}
            >
              A {brand.name.toUpperCase()} PRODUCTION
            </div>
          </MaskReveal>

          <MaskReveal direction="right" enterFrame={18} duration={28}>
            <h1
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 'clamp(48px, 8vw, 130px)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                lineHeight: 1.05,
                textAlign: 'center',
                color: CREAM,
                textShadow: '0 8px 48px rgba(0,0,0,0.75)',
              }}
            >
              {title}
            </h1>
          </MaskReveal>

          <div
            style={{
              width: 120,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${brand.primaryColor ?? GOLD}, transparent)`,
              opacity: useFadeIn({ from: 42, duration: 16 }),
            }}
          />
        </AbsoluteFill>

        {/* Light sweep at end for cinematic transition */}
        <LightSweep enterFrame={110} duration={28} angle={-14} intensity={0.4} color="#FFF8E7" />
      </div>

      <FilmGrain opacity={0.45} blendMode="overlay" vignette vignetteStrength={0.5} flicker={0.04} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Archival Image Parallax (5 – 10s)
// Parallax depth, blur-to-focus, animated date/location
// ─────────────────────────────────────────────────────────────────────────────

const ParallaxScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const episode = product.features?.[0] ?? 'Chapter One';
  const scale = useSlowCameraPush({ enterFrame: 30, duration: 90, targetScale: 1.03 });

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
        {/* Parallax depth layers simulating archival imagery */}
        <BlurFocus fromBlur={10} toBlur={0} enterFrame={0} duration={24}>
          <ParallaxLayers
            amplitude={28}
            verticalAmplitude={16}
            periodFrames={280}
            layers={[
              {
                speed: 0.3,
                content: (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at 50% 40%, ${brand.primaryColor ?? GOLD}15 0%, transparent 50%)`,
                    }}
                  />
                ),
              },
              {
                speed: -0.55,
                content: (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, transparent 0%, ${brand.primaryColor ?? GOLD}08 50%, transparent 100%)`,
                    }}
                  />
                ),
              },
              {
                speed: 1.1,
                content: (
                  <AbsoluteFill
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(10px, 1.6vh, 22px)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(10px, 0.9vw, 14px)',
                        fontWeight: 600,
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        color: brand.accentColor ?? CREAM,
                        opacity: 0.7,
                      }}
                    >
                      {episode}
                    </div>
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(28px, 4vw, 64px)',
                        fontStyle: 'italic',
                        color: brand.accentColor ?? CREAM,
                        textAlign: 'center',
                        opacity: 0.9,
                        maxWidth: '70%',
                        lineHeight: 1.3,
                      }}
                    >
                      {product.description}
                    </div>
                  </AbsoluteFill>
                ),
              },
            ]}
          />
        </BlurFocus>

        {/* Animated date / location */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(10px, 0.9vw, 14px)',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: brand.primaryColor ?? GOLD,
              opacity: useFadeIn({ from: 36, duration: 14 }),
            }}
          >
            Location
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px, 2.2vw, 36px)',
              color: CREAM,
              opacity: useSpringSlideUp({ from: 44, distance: 20, damping: 20, stiffness: 120 }),
            }}
          >
            Sarajevo, Bosnia
          </div>
          <DateCounter
            from={1914}
            to={1914}
            startFrame={60}
            durationInFrames={40}
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(22px, 2.8vw, 44px)',
              color: brand.primaryColor ?? GOLD,
              letterSpacing: '0.06em',
            }}
          />
        </div>
      </div>

      <FilmGrain opacity={0.35} blendMode="overlay" vignette vignetteStrength={0.45} flicker={0.03} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Kinetic Statement (10 – 15s)
// Kinetic typography, lower third, light sweep
// ─────────────────────────────────────────────────────────────────────────────

const StatementScene: React.FC<VideoContentProps> = ({ brand, bodyText }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const statement = bodyText ?? '';

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 50%, #101018 0%, ${DARK} 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8%',
      }}
    >
      {/* Parallax depth behind text */}
      <ParallaxLayers
        amplitude={16}
        verticalAmplitude={10}
        periodFrames={200}
        layers={[
          {
            speed: 0.4,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${brand.primaryColor ?? GOLD}10 0%, transparent 50%)`,
                }}
              />
            ),
          },
        ]}
      />

      <KineticTypography
        text={statement}
        variant="rise"
        mode="words"
        enterFrame={8}
        stagger={3}
        tokenDuration={28}
        accentColor={brand.primaryColor ?? GOLD}
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(28px, 4.2vw, 68px)',
          lineHeight: 1.3,
          textAlign: 'center',
          color: CREAM,
          maxWidth: '78%',
        }}
      />

      <div
        style={{
          width: 80,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brand.primaryColor ?? GOLD}, transparent)`,
          marginTop: 'clamp(14px, 2.4vh, 32px)',
          opacity: useFadeIn({ from: 52, duration: 14 }),
        }}
      />

      <LightSweep enterFrame={66} duration={32} angle={-12} intensity={0.28} color="#FFFFFF" />

      <DocLowerThird
        name={brand.name}
        title={brand.tagline ?? 'Documentary'}
        enterFrame={70}
        accentColor={brand.primaryColor ?? GOLD}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Map Movement (15 – 20s)
// Map zoom, depth/scale, date/location, coordinate readout
// ─────────────────────────────────────────────────────────────────────────────

const MapScene: React.FC<VideoContentProps> = ({ brand }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);

  return (
    <AbsoluteFill style={{ opacity }}>
      <MapZoom
        target={{ x: 0.58, y: 0.38 }}
        zoom={3.2}
        enterFrame={0}
        duration={80}
        color={brand.primaryColor ?? GOLD}
        coordinates={'43.85° N — 18.41° E'}
        showMarker={true}
      />

      {/* Location label */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(10px, 0.9vw, 14px)',
            fontWeight: 600,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: brand.accentColor ?? CREAM,
            opacity: useFadeIn({ from: 10, duration: 14 }),
          }}
        >
          The Journey Begins
        </div>
      </div>

      {/* Date range */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 'clamp(10px, 1.4vw, 22px)',
          fontFamily: SERIF,
          fontSize: 'clamp(24px, 3vw, 52px)',
          color: brand.primaryColor ?? GOLD,
        }}
      >
        <DateCounter from={1914} to={1914} startFrame={24} durationInFrames={28} />
        <span style={{ opacity: 0.6 }}>—</span>
        <DateCounter from={1914} to={1918} startFrame={38} durationInFrames={28} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Timeline Animation (20 – 25s)
// Broadcast timeline with staggered events, parallax depth
// ─────────────────────────────────────────────────────────────────────────────

const TimelineScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const events = product.features?.map((feature, i) => ({
    time: `0${i + 1}:00`,
    desc: feature,
  })) ?? [];

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Depth layer */}
      <ParallaxLayers
        amplitude={14}
        verticalAmplitude={8}
        periodFrames={220}
        layers={[
          {
            speed: 0.35,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 30% 50%, ${brand.primaryColor ?? GOLD}0D 0%, transparent 50%)`,
                }}
              />
            ),
          },
        ]}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: '6%',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(10px, 0.9vw, 14px)',
            fontWeight: 600,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: brand.primaryColor ?? GOLD,
            opacity: useFadeIn({ from: 0, duration: 12 }),
          }}
        >
          Key Moments
        </div>
      </div>

      {/* Timeline events */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '6%',
          right: '6%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(18px, 3vh, 36px)',
        }}
      >
        {events.map((event, i) => {
          const eventDelay = 16 + i * 28;
          const pop = spring({
            fps: 30,
            frame: frame - eventDelay,
            config: { damping: 14, stiffness: 140 },
            durationInFrames: 36,
          });
          const eventOpacity = interpolate(
            frame,
            [eventDelay, eventDelay + 10],
            [0, 1],
            { extrapolateRight: 'clamp' },
          );

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(12px, 1.6vw, 24px)',
                opacity: eventOpacity,
                transform: `scale(${0.7 + pop * 0.3})`,
                transformOrigin: 'left center',
              }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: brand.primaryColor ?? GOLD,
                  boxShadow: `0 0 12px ${brand.primaryColor ?? GOLD}66`,
                  flexShrink: 0,
                }}
              />
              {/* Connector line */}
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: `linear-gradient(90deg, ${brand.primaryColor ?? GOLD}66, transparent)`,
                  flexShrink: 0,
                }}
              />
              {/* Event text */}
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(10px, 0.85vw, 13px)',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    color: brand.primaryColor ?? GOLD,
                  }}
                >
                  {event.time}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(16px, 1.6vw, 26px)',
                    fontWeight: 500,
                    color: CREAM,
                    marginTop: 2,
                  }}
                >
                  {event.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DocLowerThird
        name={brand.name}
        title={brand.tagline ?? 'Documentary Series'}
        enterFrame={70}
        accentColor={brand.primaryColor ?? GOLD}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 6 — Finale Lockup (25 – 30s)
// Final title, blur focus, light sweep, film grain, letterbox bars
// ─────────────────────────────────────────────────────────────────────────────

const FinaleScene: React.FC<VideoContentProps> = ({ brand, product, headline, cta }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(durationInFrames);
  const title = (headline ?? product.name ?? 'DOCUMENTARY').toUpperCase();

  // Slow breathing glow
  const glowScale = 1 + Math.sin((frame / 80) * Math.PI * 2) * 0.03;

  const ctaOpacity = useFadeIn({ from: 90, duration: 16 });
  const ctaY = useSpringSlideUp({ from: 90, distance: 14, damping: 18, stiffness: 120 });

  const subtextOpacity = useFadeIn({ from: 60, duration: 12 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Breathing background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 46%, ${brand.primaryColor ?? GOLD}1A 0%, transparent 55%)`,
          transform: `scale(${glowScale})`,
        }}
      />

      {/* Parallax depth */}
      <ParallaxLayers
        amplitude={12}
        verticalAmplitude={8}
        periodFrames={180}
        layers={[
          {
            speed: -0.5,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${brand.primaryColor ?? GOLD}08 0%, transparent 45%)`,
                }}
              />
            ),
          },
        ]}
      />

      {/* Title lockup */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 1.6vh, 22px)',
        }}
      >
        <MaskReveal direction="up" enterFrame={4} duration={22}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(10px, 0.9vw, 15px)',
              fontWeight: 600,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: brand.accentColor ?? CREAM,
              opacity: 0.8,
            }}
          >
            An {brand.name.toUpperCase()} Documentary
          </div>
        </MaskReveal>

        <BlurFocus fromBlur={8} toBlur={0} enterFrame={12} duration={28}>
          <MaskReveal direction="right" enterFrame={18} duration={32}>
            <h1
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 'clamp(40px, 6vw, 100px)',
                fontWeight: 400,
                letterSpacing: '0.07em',
                color: CREAM,
                textAlign: 'center',
                textShadow: '0 6px 36px rgba(0,0,0,0.7)',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
          </MaskReveal>
        </BlurFocus>

        <div
          style={{
            width: 100,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${brand.primaryColor ?? GOLD}, transparent)`,
            opacity: useFadeIn({ from: 50, duration: 14 }),
          }}
        />

        {cta?.subtext && (
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(12px, 1vw, 16px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: brand.accentColor ?? CREAM,
              opacity: subtextOpacity,
            }}
          >
            {cta.subtext}
          </div>
        )}

        <div
          style={{
            marginTop: 'clamp(8px, 1.2vh, 16px)',
            padding: 'clamp(10px, 1.2vh, 14px) clamp(24px, 2.8vw, 44px)',
            border: `1px solid ${brand.primaryColor ?? GOLD}`,
            borderRadius: 999,
            fontFamily: SANS,
            fontSize: 'clamp(12px, 1vw, 17px)',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: CREAM,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          {cta?.text ?? 'Watch Now'}
        </div>
      </AbsoluteFill>

      {/* Final light sweep */}
      <LightSweep enterFrame={70} duration={34} angle={-14} intensity={0.35} color="#FFF8E7" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps>>> = {
  intro: OpeningScene,
  product: ParallaxScene,
  features: StatementScene,
  headline: MapScene,
  outro: TimelineScene,
  cta: FinaleScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CinematicDocumentary — premium 30-second documentary sequence.
 *
 * Scene breakdown:
 *  1. Cinematic opening title with slow camera push, masked text reveal, light sweep
 *  2. Archival image parallax with depth layers, blur-to-focus, animated date/location
 *  3. Kinetic typography statement with lower third
 *  4. Map movement with zoom, coordinate readout, date counter
 *  5. Broadcast timeline with staggered events
 *  6. Finale lockup with blur focus, light sweep, CTA
 *
 * Uses frame-based interpolation and spring physics for organic motion.
 * All animation components are reusable; scene data is dynamic.
 */
export const CinematicDocumentary: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(cinematicDocumentaryScenes, durationInFrames);

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
            <SceneComponent {...content} />
            {/* Cinematic wipe transition overlay */}
            {scene.transition?.type === 'wipe' && (
              <CinematicWipe
                enterFrame={scene.durationInFrames - scene.transition.durationInFrames}
                duration={scene.transition.durationInFrames}
              />
            )}
          </Sequence>
        );
      })}

      {/* Cinematic letterbox bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5.5%',
          background: '#000',
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '5.5%',
          background: '#000',
          zIndex: 40,
        }}
      />

      {/* Global film grade */}
      <FilmGrain
        opacity={0.4}
        blendMode="overlay"
        vignette
        vignetteStrength={0.5}
        flicker={0.03}
      />
    </AbsoluteFill>
  );
};
