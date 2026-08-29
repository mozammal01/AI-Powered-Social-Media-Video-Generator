import { ASPECT_RATIO_DIMENSIONS } from '@/types';
import type { AspectRatio } from '@/types';
import type { TemplateId, TemplateMetadata } from './types';

// Default content per template — pure data modules, safe for Server Components.
import { productAdDefaultContent } from './ProductAdvertisement/defaults';
import { restaurantDefaultContent } from './RestaurantPromotion/defaults';
import { saleDefaultContent } from './SalePromotion/defaults';
import { cinematicDocumentaryDefaultContent } from './CinematicDocumentary/defaults';
import { top10CountdownDefaultContent } from './Top10Countdown/defaults';
import { luxuryCommercialDefaultContent } from './LuxuryCommercial/defaults';
import { cinematicProductShowcaseDefaultContent } from './CinematicProductShowcase/defaults';
import { dataStatisticsExplainerDefaultContent } from './DataStatisticsExplainer/defaults';
import { breakingNewsIntroDefaultContent } from './BreakingNewsIntro/defaults';

/**
 * Template Registry
 * =================
 * Single source of truth mapping template IDs to their metadata:
 * name, description, default data, and the aspect ratios each template
 * supports.
 *
 * This module is intentionally FREE of React/Remotion imports so it can be
 * used from Server Components (dashboard pages) and Client Components alike.
 * The composition components are mapped separately in `components.ts`.
 *
 * The Remotion Root, the editor's template selector, the live preview,
 * and the dashboard gallery all read from this object — adding a new
 * template here automatically makes it available everywhere.
 *
 * Templates are listed in display order: featured templates first,
 * followed by other templates. Set `featured: true` to promote a
 * template to the Featured section in the UI.
 */
export const templateRegistry: Record<TemplateId, TemplateMetadata> = {
  'breaking-news-intro': {
    id: 'breaking-news-intro',
    name: 'Breaking News Intro',
    description:
      'Professional 10-second broadcast news intro with a breaking badge, kinetic headline, location map, animated route, statistic lower third, and final live ticker.',
    category: 'intro',
    tags: ['breaking-news', 'broadcast', 'news', 'live', 'editorial', 'youtube'],
    thumbnailUrl: '/templates/breaking-news.svg',
    supportedAspectRatios: ['16:9'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 300, // Fixed: 10s @ 30fps
    featured: true,
    defaultProps: breakingNewsIntroDefaultContent,
  },

  'top-10-countdown': {
    id: 'top-10-countdown',
    name: 'Top 10 Countdown',
    description:
      'High-retention YouTube listicle with animated rank counters, image reveals, progress bar, statistics, and fast item-to-item transitions.',
    category: 'social-media',
    tags: ['countdown', 'ranking', 'listicle', 'youtube', 'top-10', 'viral'],
    thumbnailUrl: '/templates/top-10-countdown.svg',
    supportedAspectRatios: ['16:9'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 300, // Fixed: 10s @ 30fps
    featured: true,
    defaultProps: top10CountdownDefaultContent,
  },

  'cinematic-documentary': {
    id: 'cinematic-documentary',
    name: 'Cinematic Documentary',
    description:
      'Premium 20-second documentary sequence: cinematic opening, archival parallax, kinetic statement, map movement, broadcast timeline, and finale lockup with film grain, light sweeps, and cinematic letterbox bars.',
    category: 'intro',
    tags: ['documentary', 'cinematic', 'parallax', 'kinetic', 'timeline', 'premium'],
    thumbnailUrl: '/templates/cinematic-documentary.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 600, // 20s @ 30fps
    featured: true,
    defaultProps: cinematicDocumentaryDefaultContent,
  },

  'product-advertisement': {
    id: 'product-advertisement',
    name: 'Product Advertisement',
    description:
      'Classic five-scene product ad: brand intro, product showcase, key features, pricing, and call-to-action.',
    category: 'ads',
    tags: ['product', 'launch', 'saas', 'features', 'pricing'],
    thumbnailUrl: '/templates/product-advertisement.svg',
    supportedAspectRatios: ['9:16', '1:1', '16:9'],
    defaultAspectRatio: '9:16',
    fps: 30,
    durationInFrames: 300, // 10s default
    defaultProps: productAdDefaultContent,
  },

  'restaurant-promotion': {
    id: 'restaurant-promotion',
    name: 'Restaurant Promotion',
    description:
      'Warm, appetite-driven promo for restaurants and cafés: welcome, signature dish, menu highlights, dinner deal, and reservation CTA.',
    category: 'social-media',
    tags: ['restaurant', 'food', 'menu', 'cafe', 'reservation'],
    thumbnailUrl: '/templates/restaurant-promotion.svg',
    supportedAspectRatios: ['9:16', '1:1'],
    defaultAspectRatio: '9:16',
    fps: 30,
    durationInFrames: 300, // 10s default
    defaultProps: restaurantDefaultContent,
  },

  'sale-promotion': {
    id: 'sale-promotion',
    name: 'Sale Promotion',
    description:
      'High-energy flash-sale promo: giant hook headline, discount reveal, product spotlight, deal perks, and urgency CTA.',
    category: 'ads',
    tags: ['sale', 'discount', 'flash-sale', 'ecommerce', 'urgency'],
    thumbnailUrl: '/templates/sale-promotion.svg',
    supportedAspectRatios: ['9:16', '1:1', '16:9'],
    defaultAspectRatio: '9:16',
    fps: 30,
    durationInFrames: 300, // 10s default
    defaultProps: saleDefaultContent,
  },

  'luxury-commercial': {
    id: 'luxury-commercial',
    name: 'Luxury Commercial',
    description:
      'Premium brand film with cinematic camera moves, floating particles, and glassmorphism — built for high-end product launches and luxury storytelling.',
    category: 'ads',
    tags: ['luxury', 'premium', 'cinematic', 'brand', 'product'],
    thumbnailUrl: '/templates/luxury-commercial.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 600, // 20s
    defaultProps: luxuryCommercialDefaultContent,
  },

  'cinematic-product-showcase': {
    id: 'cinematic-product-showcase',
    name: 'Cinematic Product Showcase',
    description:
      'Premium 10-second product commercial with cinematic brand reveal, product showcase, key features, pricing, and CTA — built for social/video marketing.',
    category: 'ads',
    tags: ['product', 'cinematic', 'premium', 'launch', 'social', 'marketing'],
    thumbnailUrl: '/templates/cinematic-product-showcase.svg',
    supportedAspectRatios: ['16:9'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 300, // 10s
    featured: false,
    defaultProps: cinematicProductShowcaseDefaultContent,
  },

  'data-statistics-explainer': {
    id: 'data-statistics-explainer',
    name: 'Data & Statistics Explainer',
    description:
      'Professional 10-second data explainer with a headline reveal, animated number, progressive SVG chart, key statistics, and a concise sourced conclusion.',
    category: 'explainer',
    tags: ['data', 'statistics', 'chart', 'business', 'education', 'youtube'],
    thumbnailUrl: '/templates/data-statistics-explainer.svg',
    supportedAspectRatios: ['16:9'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 300, // Fixed: 10s @ 30fps
    featured: false,
    defaultProps: dataStatisticsExplainerDefaultContent,
  },
};

/** Default template used when none is specified. */
export const DEFAULT_TEMPLATE_ID: TemplateId = 'product-advertisement';

/** All registered templates in registration order (for UI lists). */
export const templateList: TemplateMetadata[] = Object.values(templateRegistry);

/** Featured templates in registry order. */
export const featuredTemplates: TemplateMetadata[] = templateList.filter(
  (t) => t.featured,
);

/** Non-featured (other) templates in registry order. */
export const otherTemplates: TemplateMetadata[] = templateList.filter(
  (t) => !t.featured,
);

/** Type guard — narrows an arbitrary string to a registered TemplateId. */
export function isTemplateId(value: string): value is TemplateId {
  return Object.prototype.hasOwnProperty.call(templateRegistry, value);
}

/**
 * Looks up a template by ID.
 * Accepts any string so callers can safely validate user/query-param input;
 * returns `undefined` for unknown IDs.
 */
export function getTemplateDefinition(id: string): TemplateMetadata | undefined {
  return isTemplateId(id) ? templateRegistry[id] : undefined;
}

/** Resolves a template ID to its metadata, falling back to the default template. */
export function resolveTemplateOrDefault(id: string | undefined): TemplateMetadata {
  if (id && isTemplateId(id)) return templateRegistry[id];
  return templateRegistry[DEFAULT_TEMPLATE_ID];
}

/** Pixel dimensions for a template at a given (supported) aspect ratio. */
export function getTemplateDimensions(
  template: TemplateMetadata,
  aspectRatio: AspectRatio = template.defaultAspectRatio,
): { width: number; height: number } {
  return ASPECT_RATIO_DIMENSIONS[aspectRatio];
}
