import type React from 'react';
import type { TemplateId } from './types';

import { ProductAdvertisement } from './ProductAdvertisement';
import { RestaurantPromotion } from './RestaurantPromotion';
import { SalePromotion } from './SalePromotion';
import { DocumentaryIntro } from './DocumentaryIntro';
import { CinematicDocumentary } from './CinematicDocumentary';
import { Top10Listicle } from './Top10Listicle/Top10Listicle';
import { Top10Countdown } from './Top10Countdown';
import { TechExplainer } from './TechExplainer/TechExplainer';
import { LuxuryCommercial } from './LuxuryCommercial/LuxuryCommercial';
import { BreakingNews } from './BreakingNews/BreakingNews';
import { TechBusinessExplainer } from './TechBusinessExplainer/TechBusinessExplainer';

/**
 * Maps template IDs to their Remotion composition components.
 *
 * ⚠️ Client-side only: importing this module pulls every composition (and
 * therefore Remotion) into the bundle. Server Components must use the
 * metadata-only registry (`registry.ts`) instead.
 *
 * Kept separate from the metadata registry so Next.js Server Components can
 * list templates without evaluating Remotion code.
 */
export const templateComponents: Record<
  TemplateId,
  React.ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  'product-advertisement': ProductAdvertisement,
  'restaurant-promotion': RestaurantPromotion,
  'sale-promotion': SalePromotion,
  'documentary-intro': DocumentaryIntro,
  'cinematic-documentary': CinematicDocumentary,
  'top-10-listicle': Top10Listicle,
  'top-10-countdown': Top10Countdown,
  'tech-explainer': TechExplainer,
  'luxury-commercial': LuxuryCommercial,
  'breaking-news': BreakingNews,
  'tech-business-explainer': TechBusinessExplainer,
};

/** Returns the Remotion composition component for a registered template ID. */
export function getTemplateComponent(
  id: TemplateId,
): React.ComponentType<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return templateComponents[id];
}
