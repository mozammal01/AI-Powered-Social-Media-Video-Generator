import type { VideoScene } from '@/types';

/**
 * FinanceMarketBreakdown scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 5 scenes, each 6 seconds.
 *
 * Scene order:
 *  1. Hook / Headline Reveal (0 - 6s)
 *  2. Stock Chart (6s - 12s)
 *  3. Company Comparison (12s - 18s)
 *  4. Market Overview (18s - 24s)
 *  5. Timeline Outro (24s - 30s)
 */
export const financeMarketBreakdownScenes: VideoScene[] = [
  {
    id: 'scene-hook',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 180,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-chart',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 180,
    transition: { type: 'slide', durationInFrames: 16 },
  },
  {
    id: 'scene-comparison',
    type: 'features',
    startFrame: 360,
    durationInFrames: 180,
    transition: { type: 'zoom', durationInFrames: 14 },
  },
  {
    id: 'scene-market',
    type: 'product',
    startFrame: 540,
    durationInFrames: 180,
    transition: { type: 'wipe', durationInFrames: 16 },
  },
  {
    id: 'scene-timeline',
    type: 'outro',
    startFrame: 720,
    durationInFrames: 180,
    transition: { type: 'fade', durationInFrames: 18 },
  },
];
