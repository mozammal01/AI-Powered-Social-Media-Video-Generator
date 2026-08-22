import type { VideoScene } from '@/types';

/**
 * SalePromotion scene layout.
 *
 * Frames are relative placeholders — the composition scales this layout to
 * the actual duration via `scaleScenesToDuration()`.
 *
 * Scene order: hook → discount reveal → product spotlight → deal perks → cta
 */
export const saleScenes: VideoScene[] = [
  {
    id: 'scene-hook',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'zoom', durationInFrames: 12 },
  },
  {
    id: 'scene-discount',
    type: 'headline',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-spotlight',
    type: 'product',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 15 },
  },
  {
    id: 'scene-perks',
    type: 'features',
    startFrame: 180,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 240,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 12 },
  },
];