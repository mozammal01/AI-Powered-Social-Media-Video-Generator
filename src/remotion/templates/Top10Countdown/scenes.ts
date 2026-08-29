import type { VideoScene } from '@/types';

/**
 * Top10Countdown scene layout.
 *
 * 10 seconds at 30fps = 300 frames total.
 * 5 scenes, each 2 seconds.
 *
 * Scene order:
 *  1. Opening (0 - 2s)
 *  2. Rank Reveal (2s - 4s)
 *  3. Statistics (4s - 6s)
 *  4. Countdown Transition (6s - 8s)
 *  5. Final / #1 Moment (8s - 10s)
 */
export const top10CountdownScenes: VideoScene[] = [
  {
    id: 'scene-opening',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-rank-reveal',
    type: 'product',
    startFrame: 60,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-statistics',
    type: 'features',
    startFrame: 120,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-transition',
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
