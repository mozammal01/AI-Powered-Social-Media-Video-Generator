import { ASPECT_RATIO_DIMENSIONS } from '@/types';
import type { AspectRatio } from '@/types';
import type { TemplateId, TemplateMetadata } from './types';

// Default content per template — pure data modules, safe for Server Components.
import { productAdDefaultContent } from './ProductAdvertisement/defaults';
import { restaurantDefaultContent } from './RestaurantPromotion/defaults';
import { saleDefaultContent } from './SalePromotion/defaults';
import { documentaryDefaultContent } from './DocumentaryIntro/defaults';
import { top10ListicleDefaultContent } from './Top10Listicle/defaults';
import { techExplainerDefaultContent } from './TechExplainer/defaults';
import { luxuryCommercialDefaultContent } from './LuxuryCommercial/defaults';
import { breakingNewsDefaultContent } from './BreakingNews/defaults';
import { cinematicDocumentaryDefaultContent } from './CinematicDocumentary/defaults';
import { top10CountdownDefaultContent } from './Top10Countdown/defaults';
import { techBusinessExplainerDefaultContent } from './TechBusinessExplainer/defaults';
import { financeMarketBreakdownDefaultContent } from './FinanceMarketBreakdown/defaults';
import { newsGeopoliticalExplainerDefaultContent } from './NewsGeopoliticalExplainer/defaults';

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
  'top-10-listicle': {
    id: 'top-10-listicle',
    name: 'Top 10 Countdown',
    description:
      'Countdown-style listicle with ranked items, swipe transitions, and a progress bar — perfect for viral social ranking videos.',
    category: 'social-media',
    tags: ['countdown', 'ranking', 'listicle', 'viral', 'top-10'],
    thumbnailUrl: '/templates/top-10-listicle.svg',
    supportedAspectRatios: ['9:16', '1:1', '16:9'],
    defaultAspectRatio: '9:16',
    fps: 30,
    durationInFrames: 900, // 10 items × 3s each
    featured: true,
    defaultProps: top10ListicleDefaultContent,
  },

  'tech-explainer': {
    id: 'tech-explainer',
    name: 'Tech / Business Explainer',
    description:
      'Animated workflow walkthrough with cinematic camera moves — ideal for SaaS, product demos, and business concept explainers.',
    category: 'explainer',
    tags: ['tech', 'workflow', 'saas', 'business', 'explainer'],
    thumbnailUrl: '/templates/tech-explainer.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 300, // 10s
    featured: true,
    defaultProps: techExplainerDefaultContent,
  },

  'tech-business-explainer': {
    id: 'tech-business-explainer',
    name: 'Tech / Business Explainer',
    description:
      'Premium 30-second YouTube explainer with animated diagrams, data flow, revenue cards, counters, timeline, and cinematic camera movement — perfect for AI, SaaS, and business deep-dives.',
    category: 'explainer',
    tags: ['tech', 'business', 'explainer', 'youtube', 'ai', 'data', 'revenue'],
    thumbnailUrl: '/templates/tech-business-explainer.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 900, // 30s
    featured: true,
    defaultProps: techBusinessExplainerDefaultContent,
  },

  'finance-market-breakdown': {
    id: 'finance-market-breakdown',
    name: 'Finance / Market Breakdown',
    description:
      'Premium 30-second financial explainer with animated stock charts, company comparisons, market cards, scrolling ticker, counters, and cinematic camera movement — built for finance, market news, and economic breakdowns.',
    category: 'explainer',
    tags: ['finance', 'market', 'stocks', 'news', 'business', 'economics'],
    thumbnailUrl: '/templates/finance-market-breakdown.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 900, // 30s
    featured: true,
    defaultProps: financeMarketBreakdownDefaultContent,
  },

  'news-geopolitical-explainer': {
    id: 'news-geopolitical-explainer',
    name: 'News / Geopolitical Explainer',
    description:
      'Professional 30-second broadcast news explainer with breaking headlines, world map, animated routes, timeline, statistics, news cards, ticker, and live indicator — built for news recaps and geopolitical summaries.',
    category: 'explainer',
    tags: ['news', 'geopolitical', 'broadcast', 'breaking', 'world', 'politics'],
    thumbnailUrl: '/templates/news-geopolitical-explainer.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 900, // 30s
    featured: true,
    defaultProps: newsGeopoliticalExplainerDefaultContent,
  },

   'documentary-intro': {
    id: 'documentary-intro',
    name: 'Cinematic Documentary',
    description:
      'Cinematic 20-second documentary opening: map push-in with a rolling year counter, masked title reveal with lens focus rack, parallax chapter card, kinetic typography, light sweeps, and film grain under letterbox bars.',
    category: 'intro',
    tags: ['documentary', 'cinematic', 'intro', 'title', 'map', 'history'],
    thumbnailUrl: '/templates/documentary-intro.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 24,
    durationInFrames: 480, // 20s @ 24fps (cinematic)
    featured: true,
    defaultProps: documentaryDefaultContent,
  },

  'cinematic-documentary': {
    id: 'cinematic-documentary',
    name: 'Cinematic Documentary',
    description:
      'Premium 30-second documentary sequence: cinematic opening, archival parallax, kinetic statement, map movement, broadcast timeline, and finale lockup with film grain, light sweeps, and cinematic letterbox bars.',
    category: 'intro',
    tags: ['documentary', 'cinematic', 'parallax', 'kinetic', 'timeline', 'premium'],
    thumbnailUrl: '/templates/cinematic-documentary.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 900, // 30s @ 30fps
    defaultProps: cinematicDocumentaryDefaultContent,
  },

  'breaking-news': {
    id: 'breaking-news',
    name: 'News / Geopolitical Explainer',
    description:
      'Broadcast-style news package with live badge, scrolling ticker, and dramatic scene reveals — built for news recaps, geopolitical summaries, and current-events shorts.',
    category: 'explainer',
    tags: ['news', 'broadcast', 'breaking', 'geopolitical', 'ticker'],
    thumbnailUrl: '/templates/breaking-news.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 360, // 12s
    featured: true,
    defaultProps: breakingNewsDefaultContent,
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

  'top-10-countdown': {
    id: 'top-10-countdown',
    name: 'Top 10 Countdown',
    description:
      'High-retention YouTube listicle with animated rank counters, image reveals, progress bar, statistics, and fast item-to-item transitions.',
    category: 'social-media',
    tags: ['countdown', 'ranking', 'listicle', 'youtube', 'top-10', 'viral'],
    thumbnailUrl: '/templates/top-10-countdown.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 30,
    durationInFrames: 900, // 30s
    defaultProps: top10CountdownDefaultContent,
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
