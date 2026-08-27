import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { useFadeIn, useSceneOpacity, useSpringScale, useSpringSlideUp, useBackgroundMovement } from '../../animations';
import { BrandLogo } from '../../components/BrandLogo';
import { ProductImage } from '../../components/ProductImage';
import { KineticTypography } from '../../components/KineticTypography';
import { MaskReveal } from '../../components/MaskReveal';
import { BlurFocus } from '../../components/BlurFocus';
import { ParallaxLayers } from '../../components/ParallaxLayers';
import { FilmGrain } from '../../components/FilmGrain';
import { LightSweep } from '../../components/LightSweep';
import { cinematicProductShowcaseScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const INDIGO = '#6366F1';
const PURPLE = '#A855F7';
const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Brand Reveal (0 - 2s)
// Logo, brand name, tagline with cinematic fade/scale/blur
// ─────────────────────────────────────────────────────────────────────────────

const BrandRevealScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  const logoScale = useSpringScale({ from: 4, damping: 14, stiffness: 120 });
  const logoY = useSpringSlideUp({ from: 4, distance: 20, damping: 16, stiffness: 100 });
  const brandOpacity = useFadeIn({ from: 24, duration: 18 });
  const brandY = useSpringSlideUp({ from: 24, distance: 16, damping: 18, stiffness: 120 });
  const taglineOpacity = useFadeIn({ from: 40, duration: 14 });
  const taglineY = useSpringSlideUp({ from: 40, distance: 12, damping: 18, stiffness: 120 });

  const tagline = brand?.tagline ?? '';

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${INDIGO}18 0%, transparent 55%)`,
          transform: `scale(${1 + Math.sin((frame / 30) * Math.PI * 2) * 0.02})`,
        }}
      />

      <ParallaxLayers
        amplitude={12}
        verticalAmplitude={8}
        periodFrames={180}
        layers={[
          {
            speed: 0.4,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${PURPLE}12 0%, transparent 45%)`,
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
          gap: 'clamp(12px, 2vh, 28px)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: useFadeIn({ from: 0, duration: 16 }),
            transform: `translateY(${logoY}px) scale(${logoScale})`,
            filter: `blur(${interpolate(frame, [0, 20], [12, 0], { extrapolateRight: 'clamp' })}px)`,
          }}
        >
          <BrandLogo
            name={brand?.name ?? 'Brand'}
            logoUrl={brand?.logoUrl}
            primaryColor={brand?.primaryColor ?? INDIGO}
            accentColor={brand?.accentColor ?? PURPLE}
            enterFrame={0}
            size={Math.min(140, 1920 * 0.09)}
          />
        </div>

        {/* Brand name */}
        <BlurFocus fromBlur={8} toBlur={0} enterFrame={20} duration={24}>
          <MaskReveal direction="up" enterFrame={24} duration={18}>
            <div
              style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: 'clamp(32px, 4.5vw, 68px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: WHITE,
                textAlign: 'center',
                opacity: brandOpacity,
                transform: `translateY(${brandY}px)`,
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
              }}
            >
              {(brand?.name ?? 'Brand').toUpperCase()}
            </div>
          </MaskReveal>
        </BlurFocus>

        {/* Tagline */}
        {tagline && (
          <MaskReveal direction="up" enterFrame={38} duration={16}>
            <div
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(12px, 1.1vw, 18px)',
                fontWeight: 500,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                textAlign: 'center',
                opacity: taglineOpacity,
                transform: `translateY(${taglineY}px)`,
              }}
            >
              {tagline}
            </div>
          </MaskReveal>
        )}
      </AbsoluteFill>

      <LightSweep enterFrame={10} duration={28} angle={-14} intensity={0.25} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Product Reveal (2s - 4s)
// Large product image with parallax/camera movement and kinetic typography
// ─────────────────────────────────────────────────────────────────────────────

const ProductRevealScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const bg = useBackgroundMovement(durationInFrames, 14);

  const productScale = interpolate(frame, [0, 24], [0.92, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const productOpacity = useFadeIn({ from: 0, duration: 20 });

  const titleOpacity = useFadeIn({ from: 20, duration: 16 });
  const titleY = useSpringSlideUp({ from: 20, distance: 18, damping: 18, stiffness: 120 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background glow with subtle movement */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 48%, ${(brand?.primaryColor ?? INDIGO)}18 0%, transparent 55%)`,
          transform: `translate(${bg.x}px, ${bg.y}px) scale(${bg.scale})`,
        }}
      />

      <ParallaxLayers
        amplitude={16}
        verticalAmplitude={10}
        periodFrames={200}
        layers={[
          {
            speed: 0.35,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 45%, ${(brand?.accentColor ?? PURPLE)}10 0%, transparent 45%)`,
                }}
              />
            ),
          },
        ]}
      />

      {/* Product image */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 48px',
          opacity: productOpacity,
          transform: `scale(${productScale})`,
        }}
      >
        <ProductImage
          imageUrl={product?.imageUrl}
          productName={product?.name ?? 'Product'}
          primaryColor={brand?.primaryColor ?? INDIGO}
          accentColor={brand?.accentColor ?? PURPLE}
          enterFrame={0}
          maxWidth={Math.min(680, width * 0.45)}
        />
      </AbsoluteFill>

      {/* Product name kinetic typography */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <KineticTypography
          text={product?.name ?? 'Product'}
          enterFrame={20}
          stagger={3}
          tokenDuration={16}
          variant="rise"
          style={{
            fontSize: 'clamp(24px, 3vw, 48px)',
            fontWeight: 700,
            color: WHITE,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        />
      </div>

      <FilmGrain opacity={0.25} blendMode="overlay" flicker={0.02} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Key Features (4s - 6s)
// 2–3 features with icon + text, staggered reveal, subtle background motion
// ─────────────────────────────────────────────────────────────────────────────

const FeaturesScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const features = (product?.features ?? []).filter(Boolean).slice(0, 3);

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background motion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${(brand?.primaryColor ?? INDIGO)}12 0%, transparent 50%)`,
          transform: `scale(${1 + Math.sin((useCurrentFrame() / 30) * Math.PI * 2) * 0.015})`,
        }}
      />

      <ParallaxLayers
        amplitude={10}
        verticalAmplitude={6}
        periodFrames={160}
        layers={[
          {
            speed: 0.3,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 0%, ${(brand?.accentColor ?? PURPLE)}08 50%, transparent 100%)`,
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
          gap: 'clamp(16px, 3vh, 40px)',
          padding: '0 48px',
        }}
      >
        {/* Section label */}
        <MaskReveal direction="up" enterFrame={0} duration={14}>
          <div
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              fontWeight: 700,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: (brand?.primaryColor ?? INDIGO),
              marginBottom: 8,
            }}
          >
            Key Features
          </div>
        </MaskReveal>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(10px, 1.8vh, 20px)',
            width: '100%',
            maxWidth: 900,
          }}
        >
          {features.map((feature, i) => {
            const delay = 10 + i * 10;
            const pillOpacity = useFadeIn({ from: delay, duration: 14 });
            const pillY = useSpringSlideUp({ from: delay, distance: 16, damping: 16, stiffness: 120 });
            const iconScale = useSpringScale({ from: delay, damping: 14, stiffness: 140 });

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 1.6vw, 20px)',
                  opacity: pillOpacity,
                  transform: `translateY(${pillY}px)`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16,
                  padding: 'clamp(14px, 1.8vh, 22px) clamp(18px, 2.2vw, 32px)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Icon dot */}
                <div
                  style={{
                    width: 'clamp(28px, 3vw, 40px)',
                    height: 'clamp(28px, 3vw, 40px)',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${brand?.primaryColor ?? INDIGO}, ${brand?.accentColor ?? PURPLE})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(14px, 1.2vw, 18px)',
                    fontWeight: 800,
                    color: WHITE,
                    flexShrink: 0,
                    transform: `scale(${iconScale})`,
                    boxShadow: `0 0 20px ${(brand?.primaryColor ?? INDIGO)}44`,
                  }}
                >
                  {i + 1}
                </div>

                {/* Feature text */}
                <div
                  style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.3vw, 20px)',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {feature}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Pricing & Discount (6s - 8s)
// Price reveal with animated number and discount badge pop
// ─────────────────────────────────────────────────────────────────────────────

const PricingScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);

  const price = product?.price ?? '$0';
  const originalPrice = product?.originalPrice;
  const discount = product?.discount;

  const priceScale = useSpringScale({ from: 20, damping: 14, stiffness: 120 });
  const priceOpacity = useFadeIn({ from: 20, duration: 16 });
  const priceY = useSpringSlideUp({ from: 20, distance: 20, damping: 16, stiffness: 110 });

  const originalOpacity = useFadeIn({ from: 36, duration: 14 });
  const originalY = useSpringSlideUp({ from: 36, distance: 14, damping: 18, stiffness: 120 });

  const badgeScale = useSpringScale({ from: 48, damping: 12, stiffness: 150 });
  const badgeOpacity = useFadeIn({ from: 48, duration: 12 });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${(brand?.primaryColor ?? INDIGO)}15 0%, transparent 50%)`,
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
                  background: `radial-gradient(circle at 50% 50%, ${(brand?.accentColor ?? PURPLE)}10 0%, transparent 40%)`,
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
          gap: 'clamp(12px, 2vh, 28px)',
        }}
      >
        {/* Original price (strikethrough) */}
        {originalPrice && (
          <div
            style={{
              opacity: originalOpacity,
              transform: `translateY(${originalY}px)`,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(18px, 1.8vw, 28px)',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'line-through',
              textDecorationColor: 'rgba(255,255,255,0.5)',
              textDecorationThickness: 2,
            }}
          >
            {originalPrice}
          </div>
        )}

        {/* Current price */}
        <div
          style={{
            opacity: priceOpacity,
            transform: `translateY(${priceY}px) scale(${priceScale})`,
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: 'clamp(56px, 8vw, 120px)',
            fontWeight: 400,
            color: WHITE,
            letterSpacing: '-0.02em',
            textShadow: `0 0 60px ${(brand?.primaryColor ?? INDIGO)}44`,
            lineHeight: 1,
          }}
        >
          {price}
        </div>

        {/* Discount badge */}
        {discount && (
          <div
            style={{
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              padding: 'clamp(8px, 1vh, 12px) clamp(16px, 2vw, 24px)',
              borderRadius: 12,
              background: `linear-gradient(135deg, #EF4444, #F59E0B)`,
              color: WHITE,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.35)',
            }}
          >
            Save {discount}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — CTA (8s - 10s)
// Strong CTA with product + logo visible, polished finish
// ─────────────────────────────────────────────────────────────────────────────

const CTAScene: React.FC<VideoContentProps & { durationInFrames: number }> = ({
  brand,
  product,
  cta,
  durationInFrames,
}) => {
  const opacity = useSceneOpacity(durationInFrames);
  const frame = useCurrentFrame();

  const ctaOpacity = useFadeIn({ from: 8, duration: 14 });
  const ctaY = useSpringSlideUp({ from: 8, distance: 24, damping: 16, stiffness: 120 });
  const ctaScale = useSpringScale({ from: 8, damping: 14, stiffness: 130 });

  const logoOpacity = useFadeIn({ from: 28, duration: 14 });
  const logoScale = useSpringScale({ from: 28, damping: 14, stiffness: 120 });

  // Subtle breathing glow
  const glowScale = 1 + Math.sin((frame / 50) * Math.PI * 2) * 0.03;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${(brand?.primaryColor ?? INDIGO)}15 0%, transparent 55%)`,
          transform: `scale(${glowScale})`,
        }}
      />

      <ParallaxLayers
        amplitude={10}
        verticalAmplitude={6}
        periodFrames={160}
        layers={[
          {
            speed: 0.3,
            content: (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${(brand?.accentColor ?? PURPLE)}10 0%, transparent 40%)`,
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
        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
            padding: 'clamp(16px, 2vh, 24px) clamp(32px, 4vw, 64px)',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${brand?.primaryColor ?? INDIGO}, ${brand?.accentColor ?? PURPLE})`,
            color: WHITE,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(16px, 1.6vw, 24px)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textAlign: 'center',
            boxShadow: `0 16px 48px ${(brand?.primaryColor ?? INDIGO)}66`,
            cursor: 'pointer',
          }}
        >
          {cta?.text ?? 'Shop Now'}
        </div>

        {/* CTA subtext */}
        {cta?.subtext && (
          <div
            style={{
              opacity: useFadeIn({ from: 22, duration: 14 }),
              transform: `translateY(${useSpringSlideUp({ from: 22, distance: 14, damping: 16, stiffness: 110 })}px)`,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(12px, 1vw, 16px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              textAlign: 'center',
            }}
          >
            {cta.subtext}
          </div>
        )}

        {/* Brand logo at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <BrandLogo
            name={brand?.name ?? 'Brand'}
            logoUrl={brand?.logoUrl}
            primaryColor={brand?.primaryColor ?? INDIGO}
            accentColor={brand?.accentColor ?? PURPLE}
            enterFrame={28}
            size={Math.min(80, 1920 * 0.05)}
          />
        </div>
      </AbsoluteFill>

      <LightSweep enterFrame={20} duration={32} angle={-14} intensity={0.3} color="#FFFFFF" />
      <FilmGrain opacity={0.3} blendMode="overlay" vignette vignetteStrength={0.4} flicker={0.02} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps & { durationInFrames: number }>>> = {
  intro: BrandRevealScene,
  product: ProductRevealScene,
  features: FeaturesScene,
  headline: PricingScene,
  cta: CTAScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CinematicProductShowcase — premium 10-second product commercial.
 *
 * Scene breakdown:
 *  1. Brand Reveal (0 - 2s): logo, brand name, tagline with fade/scale/blur
 *  2. Product Reveal (2s - 4s): large product image with parallax and kinetic typography
 *  3. Key Features (4s - 6s): 2-3 features with stagger animation
 *  4. Pricing & Discount (6s - 8s): price reveal with discount badge
 *  5. CTA (8s - 10s): strong call-to-action with brand logo
 *
 * Fixed duration: 10 seconds (300 frames @ 30fps).
 */
export const CinematicProductShowcase: React.FC<VideoContentProps> = (content) => {
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(cinematicProductShowcaseScenes, durationInFrames);

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
