import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { productAdvertisementScenes } from '@/data/defaults';
import {
  useFadeIn,
  useSceneOpacity,
  useSpringScale,
  useSpringSlideUp,
} from '../animations';
import {
  Background,
  BrandLogo,
  CTAButton,
  FeatureList,
  Price,
  ProductImage,
  ProductTitle,
} from '../components';
import type { ProductAdvertisementProps } from './schema';
import type { SceneType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Brand intro: logo, product name, tagline
// ─────────────────────────────────────────────────────────────────────────────

const IntroScene: React.FC<ProductAdvertisementProps> = ({ brand, product, headline }) => {
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

const ProductScene: React.FC<ProductAdvertisementProps> = ({ brand, product, bodyText }) => {
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
        <DescriptionText
          text={description}
          enterFrame={14}
          primaryColor={brand.primaryColor}
        />
      )}
    </AbsoluteFill>
  );
};

interface DescriptionTextProps {
  text: string;
  enterFrame: number;
  primaryColor?: string;
}

const DescriptionText: React.FC<DescriptionTextProps> = ({ text, enterFrame, primaryColor }) => {
  const textOpacity = useFadeIn({ from: enterFrame, duration: 20 });
  const textY = useSpringSlideUp({ from: enterFrame, distance: 28, damping: 16, stiffness: 100 });
  const textScale = useSpringScale({ from: enterFrame, damping: 16, stiffness: 110 });

  return (
    <p
      style={{
        opacity: textOpacity,
        transform: `translateY(${textY}px) scale(${textScale})`,
        margin: 0,
        padding: '0 56px',
        fontSize: 32,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.82)',
        lineHeight: 1.45,
        textAlign: 'center',
        borderLeft: primaryColor ? `4px solid ${primaryColor}` : undefined,
      }}
    >
      {text}
    </p>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Features: three bullet points appearing sequentially
// ─────────────────────────────────────────────────────────────────────────────

const FeaturesScene: React.FC<ProductAdvertisementProps> = ({ brand, product }) => {
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

interface SectionLabelProps {
  label: string;
  primaryColor?: string;
  enterFrame: number;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ label, primaryColor, enterFrame }) => {
  const labelOpacity = useFadeIn({ from: enterFrame, duration: 16 });
  const labelY = useSpringSlideUp({ from: enterFrame, distance: 22, damping: 16, stiffness: 110 });

  return (
    <p
      style={{
        opacity: labelOpacity,
        transform: `translateY(${labelY}px)`,
        margin: 0,
        fontSize: 26,
        fontWeight: 700,
        color: primaryColor ?? '#6366F1',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </p>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Pricing: original, discount badge, final price
// ─────────────────────────────────────────────────────────────────────────────

const PricingScene: React.FC<ProductAdvertisementProps> = ({ brand, product }) => {
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

const CTAScene: React.FC<ProductAdvertisementProps> = ({ brand, cta }) => {
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

const SCENE_COMPONENTS: Partial<
  Record<SceneType, React.FC<ProductAdvertisementProps>>
> = {
  intro: IntroScene,
  product: ProductScene,
  features: FeaturesScene,
  headline: PricingScene,
  cta: CTAScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

function scaleScenes(durationInFrames: number) {
  const count = productAdvertisementScenes.length;
  const sceneLength = Math.floor(durationInFrames / count);

  return productAdvertisementScenes.map((scene, index) => {
    const startFrame = index * sceneLength;
    const length =
      index === count - 1 ? durationInFrames - startFrame : sceneLength;

    return {
      ...scene,
      startFrame,
      durationInFrames: length,
    };
  });
}

export const ProductAdvertisement: React.FC<ProductAdvertisementProps> = (content) => {
  const { brand, backgroundImageUrl } = content;
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenes(durationInFrames);

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
