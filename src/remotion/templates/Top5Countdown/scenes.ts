import type { VideoScene } from '@/types';

/**
 * Top5Countdown scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 7 scenes.
 *
 * Scene order:
 *  1. Intro (0 - 3s)
 *  2. #5 Reveal (3 - 8s)
 *  3. #4 Reveal (8 - 13s)
 *  4. #3 Reveal (13 - 18s)
 *  5. #2 Reveal (18 - 23s)
 *  6. #1 Reveal (23 - 28s)
 *  7. Final (28 - 30s)
 */
export const top5CountdownScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 90,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-5',
    type: 'product',
    startFrame: 90,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-4',
    type: 'features',
    startFrame: 240,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-3',
    type: 'headline',
    startFrame: 390,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-2',
    type: 'product',
    startFrame: 540,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-1',
    type: 'cta',
    startFrame: 690,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-final',
    type: 'outro',
    startFrame: 840,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
];
