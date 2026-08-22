import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import {
  useFadeIn,
  useSceneOpacity,
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
  ProductTitle,
  SectionLabel,
} from '../../components';
import { restaurantScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Template-local decoration — thin brand-colored divider line
// ─────────────────────────────────────────────────────────────────────────────

const AccentDivider: React.FC<{ primaryColor?: string; enterFrame?: number }> = ({
  primaryColor = '#F59E0B',
  enterFrame = 0,
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 18 });
  const width = useSpringSlideUp({
    from: enterFrame,
    distance: -160,
    damping: 18,
    stiffness: 90,
  });

  return (
    <div
      style={{
        opacity,
        width: `${Math.max(0, Math.min(100, ((width + 160) / 320) * 100))}%`,
        maxWidth: 320,
        height: 4,
        borderRadius: 999,
        background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Welcome: logo, restaurant name, tagline
// ─────────────────────────────────────────────────────────────────────────────

const WelcomeScene: React.FC<VideoContentProps> = ({ brand, product, headline }) => {
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
      <BrandLogo
        name={brand.name}
        logoUrl={brand.logoUrl}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={0}
        size={130}
      />
      <ProductTitle
        title={brand.name}
        tagline={brand.tagline}
        headline={headline ?? product.name}
        primaryColor={brand.primaryColor}
        enterFrame={8}
      />
      <AccentDivider primaryColor={brand.primaryColor} enterFrame={20} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Signature dish: hero image + description
// ─────────────────────────────────────────────────────────────────────────────

const SignatureDishScene: React.FC<VideoContentProps> = ({ brand, product, bodyText }) => {
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
      <SectionLabel
        label="Signature Dish"
        primaryColor={brand.primaryColor}
        enterFrame={0}
      />
      <ProductImage
        imageUrl={product.imageUrl}
        productName={product.name}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={6}
        maxWidth={620}
      />
      {description && (
        <BodyText
          text={description}
          primaryColor={brand.primaryColor}
          enterFrame={16}
          fontSize={30}
        />
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Menu highlights: dish list revealed sequentially
// ─────────────────────────────────────────────────────────────────────────────

const MenuHighlightsScene: React.FC<VideoContentProps> = ({ brand, product }) => {
  const { durationInFrames } = useVideoConfig();
  const opacity = useSceneOpacity(durationInFrames);
  const dishes = (product.features ?? []).filter(Boolean).slice(0, 3) as string[];

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
      <SectionLabel label="Today's Menu" primaryColor={brand.primaryColor} enterFrame={0} />
      <FeatureList
        features={dishes}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={8}
        staggerFrames={10}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Special offer: discount badge + deal price
// ─────────────────────────────────────────────────────────────────────────────

const OfferScene: React.FC<VideoContentProps> = ({ brand, product }) => {
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
        gap: 24,
      }}
    >
      <SectionLabel label="Dinner Deal" primaryColor={brand.primaryColor} enterFrame={0} />
      {product.discount && (
        <DiscountBadge
          discount={product.discount}
          accentColor={brand.accentColor}
          enterFrame={8}
          size="md"
        />
      )}
      <Price
        originalPrice={product.originalPrice}
        finalPrice={product.price}
        primaryColor={brand.primaryColor}
        accentColor={brand.accentColor}
        enterFrame={14}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Reservation CTA
// ─────────────────────────────────────────────────────────────────────────────

const ReservationScene: React.FC<VideoContentProps> = ({ brand, cta }) => {
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
  intro: WelcomeScene,
  product: SignatureDishScene,
  features: MenuHighlightsScene,
  headline: OfferScene,
  cta: ReservationScene,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * RestaurantPromotion template.
 *
 * A five-scene restaurant promo: welcome, signature dish, menu highlights,
 * dinner deal, and reservation CTA. Consumes the shared `VideoContent`
 * data model like every other template.
 */
export const RestaurantPromotion: React.FC<VideoContentProps> = (content) => {
  const { brand, backgroundImageUrl } = content;
  const { durationInFrames } = useVideoConfig();
  const scenes = scaleScenesToDuration(restaurantScenes, durationInFrames);

  return (
    <AbsoluteFill>
      <Background
        brand={brand}
        imageUrl={backgroundImageUrl}
        enterFrame={0}
        variant="dark"
        overlayOpacity={0.78}
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