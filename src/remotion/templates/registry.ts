import { ASPECT_RATIO_DIMENSIONS } from '@/types';
import type { AspectRatio } from '@/types';
import type { TemplateId, TemplateMetadata } from './types';

// Default content per template — pure data modules, safe for Server Components.
import { productAdDefaultContent } from './ProductAdvertisement/defaults';
import { restaurantDefaultContent } from './RestaurantPromotion/defaults';
import { saleDefaultContent } from './SalePromotion/defaults';
import { documentaryDefaultContent } from './DocumentaryIntro/defaults';

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
 */
export const templateRegistry: Record<TemplateId, TemplateMetadata> = {
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

  'documentary-intro': {
    id: 'documentary-intro',
    name: 'Documentary Intro',
    description:
      'Cinematic 20-second documentary opening: map push-in with a rolling year counter, masked title reveal with lens focus rack, parallax chapter card, kinetic typography, light sweeps, and film grain under letterbox bars.',
    category: 'intro',
    tags: ['documentary', 'cinematic', 'intro', 'title', 'map', 'history'],
    thumbnailUrl: '/templates/documentary-intro.svg',
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    fps: 24,
    durationInFrames: 480, // 20s @ 24fps (cinematic)
    defaultProps: documentaryDefaultContent,
  },
};

/** Default template used when none is specified. */
export const DEFAULT_TEMPLATE_ID: TemplateId = 'product-advertisement';

/** All registered templates in registration order (for UI lists). */
export const templateList: TemplateMetadata[] = Object.values(templateRegistry);

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