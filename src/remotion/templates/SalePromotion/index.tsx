import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import {
  useFadeIn,
  usePulse,
  useSceneOpacity,
  useSpringScale,
  useSpringSlideUp,
} from '../../animations';
import {
  Background,
  BodyText,
  BrandLogo,
  CTAButton,
  DiscountBadge,
  FeatureList,
  Price,
  ProductImage,
  SectionLabel,
} from '../../components';
import { saleScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Template-local element — oversized pulsing sale headline
// ─────────────────────────────────────────────────────────────────────────────

const GiantHeadline: React.FC<{
  text: string;
  primaryColor?: string;
  accentColor?: string;
}> = ({ text, primaryColor = '#EC4899', accentColor = '#F97316' }) => {
  const scale = useSpringScale({ from: 0, damping: 10, stiffness: 140, mass: 0.8 });
  const translateY = useSpringSlideUp({ from: 0, distance: 60, damping: 14, stiffness: 120 });
  const pulse = usePulse(50, 0.03);

  return (
    <h1
      style={{
        opacity: 1,
        transform: `translateY(${translateY}px) scale(${scale * pulse})`,
        margin: 0,
        fontSize: 132,
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        textAlign: 'center',
        textTransform: 'uppercase',
        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        filter: `drop-shadow(0 12px 48px ${primaryColor}66)`,
        padding: '0 40px',
      }}
    >
      {text}
    </h1>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Hook: brand + giant sale headline
// ─────────────────────────────────────────────────────────────────────────────

const HookScene: React.FC<VideoContentProps> = ({ brand, product, headline }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const brandOpacity = useFadeIn({ from: 16, duration: 18 });
  const brandY = useSpringSlideUp({ from: 16, distance: 24, damping: 16, stiffness: 110 });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 44,
      }}
    >
      <BrandLogo
        name={brand.name}
        logoUrl={brand.logoUrl}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={0}
        size={96}
      />
      <GiantHeadline
        text={headline ?? 'Mega Sale'}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
      />
      <p
        style={{
          opacity: brandOpacity,
          transform: `translateY(${brandY}px)`,
          margin: 0,
          fontSize: 34,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.85)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {product.name}
      </p>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Discount reveal: badge + slashed price teaser
// ─────────────────────────────────────────────────────────────────────────────

const DiscountRevealScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
      }}
    >
      {product.discount && (
        <DiscountBadge
          discount={product.discount}
          accentColor={brand.accentColor}
          enterFrame={0}
          size="lg"
        />
      )}
      <Price
        originalPrice={product.originalPrice}
        finalPrice={product.price}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={10}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Product spotlight: hero image + copy
// ─────────────────────────────────────────────────────────────────────────────

const SpotlightScene: React.FC<VideoContentProps> = ({ brand, product, bodyText }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const description = bodyText ?? product.description;

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <ProductImage
        imageUrl={product.imageUrl}
        productName={product.name}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={0}
      />
      {description && (
        <BodyText
          text={description}
          primaryColor={brand.primaryColor}
          enterFrame={14}
        />
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Deal perks: offer stack revealed sequentially
// ─────────────────────────────────────────────────────────────────────────────

const DealPerksScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const perks = (product.features ?? []).filter(Boolean).slice(0, 3) as string[];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <SectionLabel label="Deal Perks" primaryColor={brand.primaryColor} enterFrame={0} />
      <FeatureList
        features={perks}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={8}
        staggerFrames={9}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Urgency CTA
// ─────────────────────────────────────────────────────────────────────────────

const UrgencyCTAScene: React.FC<VideoContentProps> = ({ brand, cta }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const websiteUrl = cta.url ?? brand.websiteUrl;
  const sceneY = useSpringSlideUp({ from: 4, distance: 20, damping: 16, stiffness: 100 });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${sceneY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 44,
      }}
    >
      <CTAButton
        text={cta.text}
        subtext={cta.subtext}
        websiteUrl={websiteUrl}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={0}
      />
      <BrandLogo
        name={brand.name}
        logoUrl={brand.logoUrl}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={18}
        size={72}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps>>> = {
  intro: HookScene,
  headline: DiscountRevealScene,
  product: SpotlightScene,
  features: DealPerksScene,
  cta: UrgencyCTAScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SalePromotion template.
 *
 * A high-energy five-scene flash-sale promo: hook, discount reveal,
 * product spotlight, deal perks, and urgency CTA. Consumes the shared
 * `VideoContent` data model like every other template.
 */
export const SalePromotion: React.FC<VideoContentProps> = (content) => {
  const { brand, backgroundImageUrl } = content;
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(saleScenes, durationInFrames);

  return (
    <AbsoluteFill>
      <Background
        brand={brand}
        imageUrl={backgroundImageUrl}
        enterFrame={0}
        variant="dark"
        overlayOpacity={0.68}
      />

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
    </AbsoluteFill>
  );
};