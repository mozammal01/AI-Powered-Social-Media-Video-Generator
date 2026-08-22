import type { VideoScene } from '@/types';

/**
 * RestaurantPromotion scene layout.
 *
 * Frames are relative placeholders — the composition scales this layout to
 * the actual duration via `scaleScenesToDuration()`.
 *
 * Scene order: intro → signature dish → menu highlights → offer → cta
 */
export const restaurantScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-signature-dish',
    type: 'product',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'zoom', durationInFrames: 15 },
  },
  {
    id: 'scene-menu',
    type: 'features',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 15 },
  },
  {
    id: 'scene-offer',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 240,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 15 },
  },
];