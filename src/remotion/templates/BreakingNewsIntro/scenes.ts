import type { VideoScene } from '@/types';

/**
 * BreakingNewsIntro scene layout.
 *
 * 10 seconds at 30fps = 300 frames total.
 * 5 scenes, each 2 seconds.
 *
 * Scene order:
 *  1. Badge & Live (0 - 2s)
 *  2. Headline & Image (2s - 4s)
 *  3. Location & Map (4s - 6s)
 *  4. Statistic & Info (6s - 8s)
 *  5. Final Composition & Ticker (8s - 10s)
 */
export const breakingNewsIntroScenes: VideoScene[] = [
  {
    id: 'scene-badge',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-headline',
    type: 'product',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-location',
    type: 'features',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-statistic',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-final',
    type: 'cta',
    startFrame: 240,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
];
