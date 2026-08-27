import type React from 'react';
import type { TemplateId } from './types';

import { ProductAdvertisement } from './ProductAdvertisement';
import { RestaurantPromotion } from './RestaurantPromotion';
import { SalePromotion } from './SalePromotion';
import { CinematicDocumentary } from './CinematicDocumentary';
import { Top10Countdown } from './Top10Countdown';
import { LuxuryCommercial } from './LuxuryCommercial/LuxuryCommercial';
import { TechBusinessExplainer } from './TechBusinessExplainer/TechBusinessExplainer';
import { FinanceMarketBreakdown } from './FinanceMarketBreakdown/FinanceMarketBreakdown';
import { NewsGeopoliticalExplainer } from './NewsGeopoliticalExplainer/NewsGeopoliticalExplainer';
import { CinematicProductShowcase } from './CinematicProductShowcase';
import { DataStatisticsExplainer } from './DataStatisticsExplainer';
import { BreakingNewsIntro } from './BreakingNewsIntro';

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
  'breaking-news-intro': BreakingNewsIntro,
  'product-advertisement': ProductAdvertisement,
  'restaurant-promotion': RestaurantPromotion,
  'sale-promotion': SalePromotion,
  'cinematic-documentary': CinematicDocumentary,
  'top-10-countdown': Top10Countdown,
  'luxury-commercial': LuxuryCommercial,
  'tech-business-explainer': TechBusinessExplainer,
  'finance-market-breakdown': FinanceMarketBreakdown,
  'news-geopolitical-explainer': NewsGeopoliticalExplainer,
  'cinematic-product-showcase': CinematicProductShowcase,
  'data-statistics-explainer': DataStatisticsExplainer,
};

/** Returns the Remotion composition component for a registered template ID. */
export function getTemplateComponent(
  id: TemplateId,
): React.ComponentType<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return templateComponents[id];
}
