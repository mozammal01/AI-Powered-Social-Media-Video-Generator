import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { useFadeIn, useSceneOpacity, useSpringSlideUp } from '../../animations';
import {
  BlurFocus,
  DateCounter,
  FilmGrain,
  KineticTypography,
  LightSweep,
  MapZoom,
  MaskReveal,
  ParallaxLayers,
} from '../../components';
import { documentaryScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Shared styling constants & micro-components
// ─────────────────────────────────────────────────────────────────────────────

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const DEFAULT_GOLD = '#C9A24B';
const DEFAULT_CREAM = '#EAE3D2';

/** Small-caps documentary kicker label with a soft rise-in. */
const Eyebrow: React.FC<{
  text: string;
  color?: string;
  enterFrame?: number;
  style?: React.CSSProperties;
}> = ({ text, color = DEFAULT_CREAM, enterFrame = 0, style }) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 14 });
  const y = useSpringSlideUp({ from: enterFrame, distance: 18, damping: 18, stiffness: 120 });

  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 'clamp(13px, 1.15vw, 22px)',
        fontWeight: 600,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color,
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Thin gold editorial rule revealed left-to-right through a mask. */
const GoldRule: React.FC<{
  color?: string;
  width?: number | string;
  enterFrame?: number;
  style?: React.CSSProperties;
}> = ({ color = DEFAULT_GOLD, width = 180, enterFrame = 0, style }) => (
  <MaskReveal direction="right" enterFrame={enterFrame} duration={20} style={style}>
    <div style={{ width, height: 2, background: color }} />
  </MaskReveal>
);

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Cold open: map push-in + rolling year counter
// ─────────────────────────────────────────────────────────────────────────────

const MapScene: React.FC<VideoContentProps> = ({ brand }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const gold = brand.primaryColor ?? DEFAULT_GOLD;

  return (
    <AbsoluteFill style={{ opacity }}>
      <MapZoom
        target={{ x: 0.63, y: 0.4 }}
        zoom={3.4}
        enterFrame={0}
        duration={78}
        color={gold}
        coordinates={'43.85° N — 18.41° E'}
      />

      {/* Series kicker */}
      <Eyebrow
        text={`A ${brand.name.toUpperCase()} DOCUMENTARY`}
        color={brand.accentColor ?? DEFAULT_CREAM}
        enterFrame={6}
        style={{ position: 'absolute', top: '12%', left: 0, right: 0, textAlign: 'center' }}
      />

      {/* Rolling year counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Eyebrow text="The Year" color={gold} enterFrame={18} />
        <DateCounter
          from={1900}
          to={1914}
          startFrame={24}
          durationInFrames={54}
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(64px, 9vw, 150px)',
            color: brand.accentColor ?? DEFAULT_CREAM,
            letterSpacing: '0.04em',
            textShadow: '0 4px 30px rgba(0,0,0,0.65)',
          }}
        />
      </div>

      {/* Transition shimmer out of the cold open */}
      <LightSweep enterFrame={64} duration={28} angle={-16} intensity={0.32} color={gold} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Main title: mask reveal + focus rack + light sweep over parallax
// ─────────────────────────────────────────────────────────────────────────────

const TitleScene: React.FC<VideoContentProps> = ({ brand, product, headline }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const gold = brand.primaryColor ?? DEFAULT_GOLD;
  const cream = brand.accentColor ?? DEFAULT_CREAM;
  const title = (headline ?? product.name).toUpperCase();

  return (
    <AbsoluteFill style={{ opacity, background: '#07070C' }}>
      {/* Parallax backdrop: glow field + ghost typography */}
      <ParallaxLayers
        amplitude={30}
        verticalAmplitude={18}
        periodFrames={300}
        layers={[
          {
            speed: 0.45,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 42%, ${gold}26 0%, transparent 55%)`,
                }}
              />
            ),
          },
          {
            speed: -0.85,
            content: (
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(90px, 17vw, 280px)',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  color: 'transparent',
                  WebkitTextStroke: `1px ${gold}`,
                  opacity: 0.08,
                }}
              >
                {title}
              </div>
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
          gap: 'clamp(14px, 2vh, 28px)',
        }}
      >
        <MaskReveal direction="up" enterFrame={4} duration={18}>
          <Eyebrow text={`${brand.name.toUpperCase()} PRESENTS`} color={cream} enterFrame={99} />
        </MaskReveal>

        <BlurFocus fromBlur={16} toBlur={0} enterFrame={8} duration={26}>
          <MaskReveal direction="right" enterFrame={10} duration={32}>
            <h1
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 'clamp(56px, 9vw, 150px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                lineHeight: 1.05,
                textAlign: 'center',
                color: cream,
                textShadow: '0 6px 40px rgba(0,0,0,0.7)',
              }}
            >
              {title}
            </h1>
          </MaskReveal>
        </BlurFocus>

        <GoldRule enterFrame={38} width={220} />

        {brand.tagline && (
          <Eyebrow text={brand.tagline.toUpperCase()} color={gold} enterFrame={46} />
        )}
      </AbsoluteFill>

      {/* Glint across the freshly revealed title */}
      <LightSweep enterFrame={48} duration={30} angle={-14} intensity={0.5} color="#FFF6DC" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Chapter card: three-plane parallax with blur-focus pull
// ─────────────────────────────────────────────────────────────────────────────

const ChapterScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const gold = brand.primaryColor ?? DEFAULT_GOLD;
  const cream = brand.accentColor ?? DEFAULT_CREAM;
  const episode = product.features?.[0] ?? product.name;

  return (
    <AbsoluteFill style={{ opacity, background: '#08080E' }}>
      <BlurFocus fromBlur={12} toBlur={0} enterFrame={0} duration={24}>
        <ParallaxLayers
          amplitude={36}
          verticalAmplitude={20}
          periodFrames={260}
          layers={[
            {
              speed: 0.35,
              content: (
                <div style={{ position: 'relative', width: '72vmin', height: '72vmin' }}>
                  {[1, 0.78, 0.56].map((r, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        inset: `${(1 - r) * 50}%`,
                        borderRadius: '50%',
                        border: `1px solid ${gold}`,
                        opacity: 0.14 - i * 0.03,
                      }}
                    />
                  ))}
                </div>
              ),
            },
            {
              speed: -0.7,
              content: (
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(80px, 15vw, 240px)',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    color: 'transparent',
                    WebkitTextStroke: `1px ${cream}`,
                    opacity: 0.06,
                  }}
                >
                  CHAPTER ONE
                </div>
              ),
            },
            {
              speed: 1.15,
              content: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'clamp(12px, 2vh, 24px)',
                  }}
                >
                  <Eyebrow text="Chapter One" color={gold} enterFrame={8} />
                  <MaskReveal direction="right" enterFrame={16} duration={28}>
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(34px, 4.6vw, 76px)',
                        fontStyle: 'italic',
                        color: cream,
                        textAlign: 'center',
                      }}
                    >
                      {episode}
                    </div>
                  </MaskReveal>
                  <GoldRule enterFrame={34} width={160} />
                </div>
              ),
            },
          ]}
        />
      </BlurFocus>

      <LightSweep enterFrame={50} duration={30} angle={-20} intensity={0.3} color={gold} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Statement: kinetic typography over archival darkness
// ─────────────────────────────────────────────────────────────────────────────

const StatementScene: React.FC<VideoContentProps> = ({ brand, product, bodyText }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const gold = brand.primaryColor ?? DEFAULT_GOLD;
  const cream = brand.accentColor ?? DEFAULT_CREAM;
  const statement = bodyText ?? product.description ?? '';

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: 'radial-gradient(circle at 50% 50%, #101018 0%, #06060B 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(18px, 3vh, 36px)',
        padding: '0 10%',
      }}
    >
      {brand.tagline && <Eyebrow text={brand.tagline.toUpperCase()} color={gold} enterFrame={2} />}

      <KineticTypography
        text={statement}
        variant="rise"
        mode="words"
        enterFrame={10}
        stagger={2.4}
        tokenDuration={26}
        accentColor={gold}
        highlightWords={['never', 'wait']}
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(34px, 5vw, 84px)',
          lineHeight: 1.25,
          textAlign: 'center',
          color: cream,
          maxWidth: '82%',
        }}
      />

      <GoldRule enterFrame={46} width={200} />

      <LightSweep enterFrame={58} duration={30} angle={-12} intensity={0.26} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Finale: title lockup, rolling date range, premiere card
// ─────────────────────────────────────────────────────────────────────────────

const FinaleScene: React.FC<VideoContentProps> = ({ brand, product, headline, cta }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(durationInFrames);
  const gold = brand.primaryColor ?? DEFAULT_GOLD;
  const cream = brand.accentColor ?? DEFAULT_CREAM;
  const title = (headline ?? product.name).toUpperCase();

  // Slow breathing glow.
  const glowScale = 1 + Math.sin((frame / 96) * Math.PI * 2) * 0.04;

  const ctaOpacity = useFadeIn({ from: 66, duration: 14 });
  const ctaY = useSpringSlideUp({ from: 66, distance: 16, damping: 18, stiffness: 120 });
  const subtextOpacity = useFadeIn({ from: 60, duration: 12 });

  return (
    <AbsoluteFill style={{ opacity, background: '#06060B' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 46%, ${gold}1F 0%, transparent 58%)`,
          transform: `scale(${glowScale})`,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(14px, 2.4vh, 30px)',
        }}
      >
        <Eyebrow text="An Original Documentary Series" color={cream} enterFrame={4} />

        <MaskReveal direction="up" enterFrame={12} duration={24}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(44px, 6.4vw, 104px)',
              letterSpacing: '0.08em',
              color: cream,
              textAlign: 'center',
              textShadow: '0 6px 40px rgba(0,0,0,0.7)',
            }}
          >
            {title}
          </div>
        </MaskReveal>

        {/* Rolling date range: two odometers meeting on an em dash */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'clamp(12px, 1.6vw, 26px)',
            fontFamily: SERIF,
            fontSize: 'clamp(30px, 3.6vw, 60px)',
            color: gold,
          }}
        >
          <DateCounter from={1900} to={1914} startFrame={30} durationInFrames={24} />
          <span style={{ opacity: 0.7 }}>—</span>
          <DateCounter from={1900} to={1918} startFrame={40} durationInFrames={24} />
        </div>

        <GoldRule enterFrame={52} width={180} />

        <Eyebrow text={brand.name.toUpperCase()} color={gold} enterFrame={56} />

        {cta.subtext && (
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(14px, 1.3vw, 24px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: cream,
              opacity: subtextOpacity,
            }}
          >
            {cta.subtext}
          </div>
        )}

        <div
          style={{
            marginTop: 'clamp(6px, 1.4vh, 18px)',
            padding: 'clamp(10px, 1.4vh, 16px) clamp(28px, 3vw, 52px)',
            border: `1px solid ${gold}`,
            borderRadius: 999,
            fontFamily: SANS,
            fontSize: 'clamp(13px, 1.15vw, 21px)',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: cream,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          {cta.text}
        </div>
      </AbsoluteFill>

      <LightSweep enterFrame={40} duration={30} angle={-14} intensity={0.4} color="#FFF6DC" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps>>> = {
  intro: MapScene,
  headline: TitleScene,
  product: ChapterScene,
  features: StatementScene,
  outro: FinaleScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DocumentaryIntro template.
 *
 * A cinematic 20-second opening sequence: map push-in with a rolling year
 * counter, masked title reveal with lens focus rack, three-plane parallax
 * chapter card, kinetic-typography statement, and a finale lockup with a
 * rolling date range — all graded with film grain, vignette, and light
 * sweeps under cinematic letterbox bars.
 *
 * Consumes the shared `VideoContent` data model like every other template.
 */
export const DocumentaryIntro: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(documentaryScenes, durationInFrames);

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
          </Sequence>
        );
      })}

      {/* Cinematic letterbox bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6%', background: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6%', background: '#000' }} />

      {/* Global film grade: grain + vignette over everything */}
      <FilmGrain opacity={0.5} blendMode="overlay" vignette vignetteStrength={0.55} flicker={0.05} />
    </AbsoluteFill>
  );
};