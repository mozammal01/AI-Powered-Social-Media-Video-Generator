import type { VideoScene } from '@/types';

/**
 * Top5Countdown scene layout.
 *
 * 25 seconds at 30fps = 750 frames total.
 * 7 scenes.
 *
 * Scene order:
 *  1. Intro (0 - 3s)
 *  2. #5 Reveal (3s - 7s)
 *  3. #4 Reveal (7s - 11s)
 *  4. #3 Reveal (11s - 15s)
 *  5. #2 Reveal (15s - 19s)
 *  6. #1 Reveal (19s - 23s)
 *  7. Final (23s - 25s)
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
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-4',
    type: 'features',
    startFrame: 210,
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-3',
    type: 'headline',
    startFrame: 330,
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-2',
    type: 'product',
    startFrame: 450,
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-item-1',
    type: 'cta',
    startFrame: 570,
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-final',
    type: 'cta',
    startFrame: 690,
    durationInFrames: 60,
    transition: { type: 'fade', durationInFrames: 12 },
  },
];
