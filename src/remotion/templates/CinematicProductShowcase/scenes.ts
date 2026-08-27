import type { VideoScene } from '@/types';

/**
 * CinematicProductShowcase scene layout.
 *
 * 10 seconds at 30fps = 300 frames total.
 * 5 scenes, each 2 seconds.
 *
 * Scene order:
 *  1. Brand Reveal (0 - 2s)
 *  2. Product Reveal (2s - 4s)
 *  3. Key Features (4s - 6s)
 *  4. Pricing & Discount (6s - 8s)
 *  5. CTA (8s - 10s)
 */
export const cinematicProductShowcaseScenes: VideoScene[] = [
  {
    id: 'scene-brand',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-product',
    type: 'product',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-features',
    type: 'features',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-pricing',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 240,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
];
