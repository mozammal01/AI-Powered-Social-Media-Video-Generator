import type { VideoScene } from '@/types';

/**
 * TechBusinessExplainer scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 5 scenes, each 6 seconds.
 *
 * Scene order:
 *  1. Hook / Title (0 - 6s)
 *  2. Data Collection (6s - 12s)
 *  3. Training & API (12s - 18s)
 *  4. Revenue Streams (18s - 24s)
 *  5. Timeline Outro (24s - 30s)
 */
export const techBusinessExplainerScenes: VideoScene[] = [
  {
    id: 'scene-hook',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 180,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-data',
    type: 'headline',
    startFrame: 180,
    durationInFrames: 180,
    transition: { type: 'slide', durationInFrames: 16 },
  },
  {
    id: 'scene-training',
    type: 'features',
    startFrame: 360,
    durationInFrames: 180,
    transition: { type: 'zoom', durationInFrames: 14 },
  },
  {
    id: 'scene-revenue',
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
