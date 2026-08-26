import type { VideoScene } from '@/types';

/**
 * NewsGeopoliticalExplainer scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 5 scenes, each 6 seconds.
 *
 * Scene order:
 *  1. Breaking Headline (0 - 6s)
 *  2. Map & Timeline (6s - 12s)
 *  3. Statistics & Charts (12s - 18s)
 *  4. News Cards (18s - 24s)
 *  5. Summary Outro (24s - 30s)
 */
export const newsGeopoliticalExplainerScenes: VideoScene[] = [
  {
    id: 'scene-headline',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 180,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-map',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 180,
    transition: { type: 'slide', durationInFrames: 16 },
  },
  {
    id: 'scene-stats',
    type: 'features',
    startFrame: 360,
    durationInFrames: 180,
    transition: { type: 'zoom', durationInFrames: 14 },
  },
  {
    id: 'scene-news',
    type: 'product',
    startFrame: 540,
    durationInFrames: 180,
    transition: { type: 'wipe', durationInFrames: 16 },
  },
  {
    id: 'scene-summary',
    type: 'outro',
    startFrame: 720,
    durationInFrames: 180,
    transition: { type: 'fade', durationInFrames: 18 },
  },
];
