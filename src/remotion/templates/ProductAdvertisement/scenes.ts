import type { VideoScene } from '@/types';

/**
 * ProductAdvertisement scene layout.
 *
 * Frames are relative placeholders — the composition scales this layout to
 * the actual duration via `scaleScenesToDuration()`.
 *
 * Scene order: intro → product → features → pricing → cta
 */
export const productAdScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-product',
    type: 'product',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 15 },
  },
  {
    id: 'scene-features',
    type: 'features',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-pricing',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 60,
    transition: { type: 'zoom', durationInFrames: 15 },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 240,
    durationInFrames: 60,
    transition: { type: 'slide', durationInFrames: 15 },
  },
];