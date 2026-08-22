import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import {
  useSceneOpacity,
  useSpringSlideUp,
} from '../../animations';
import {
  Background,
  BodyText,
  BrandLogo,
  CTAButton,
  FeatureList,
  Price,
  ProductImage,
  ProductTitle,
  SectionLabel,
} from '../../components';
import { productAdScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Brand intro: logo, product name, tagline
// ─────────────────────────────────────────────────────────────────────────────

const IntroScene: React.FC<VideoContentProps> = ({ brand, product, headline }) => {
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
        gap: 48,
      }}
    >
      <BrandLogo
        name={brand.name}
        logoUrl={brand.logoUrl}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={0}
        size={140}
      />
      <ProductTitle
        title={product.name}
        tagline={brand.tagline}
        headline={headline}
        primaryColor={brand.primaryColor}
        enterFrame={8}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Product showcase: image + description
// ─────────────────────────────────────────────────────────────────────────────

const ProductScene: React.FC<VideoContentProps> = ({ brand, product, bodyText }) => {
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
// Scene 3 — Features: three bullet points appearing sequentially
// ─────────────────────────────────────────────────────────────────────────────

const FeaturesScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const features = (product.features ?? []).filter(Boolean).slice(0, 3) as string[];

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
      <SectionLabel label="Key Features" primaryColor={brand.primaryColor} enterFrame={0} />
      <FeatureList
        features={features}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={8}
        staggerFrames={10}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Pricing: original, discount badge, final price
// ─────────────────────────────────────────────────────────────────────────────

const PricingScene: React.FC<VideoContentProps> = ({ brand, product }) => {
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
        gap: 16,
      }}
    >
      <SectionLabel label="Special Offer" primaryColor={brand.primaryColor} enterFrame={0} />
      <Price
        originalPrice={product.originalPrice}
        finalPrice={product.price}
        discount={product.discount}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={6}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — CTA: button, website URL, brand logo
// ─────────────────────────────────────────────────────────────────────────────

const CTAScene: React.FC<VideoContentProps> = ({ brand, cta }) => {
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
        gap: 48,
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
        size={80}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene registry
// ─────────────────────────────────────────────────────────────────────────────

const SCENE_COMPONENTS: Partial<Record<string, React.FC<VideoContentProps>>> = {
  intro: IntroScene,
  product: ProductScene,
  features: FeaturesScene,
  headline: PricingScene,
  cta: CTAScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ProductAdvertisement template.
 *
 * A five-scene vertical product ad: brand intro, product showcase,
 * key features, pricing, and call-to-action. Consumes the shared
 * `VideoContent` data model like every other template.
 */
export const ProductAdvertisement: React.FC<VideoContentProps> = (content) => {
  const { brand, backgroundImageUrl } = content;
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(productAdScenes, durationInFrames);

  return (
    <AbsoluteFill>
      <Background
        brand={brand}
        imageUrl={backgroundImageUrl}
        enterFrame={0}
        variant="dark"
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