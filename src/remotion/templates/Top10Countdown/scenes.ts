import type { VideoScene } from '@/types';

/**
 * Top10Countdown scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 12 scenes × 2.5 seconds = 75 frames each.
 *
 * Scene order: intro title → #10 through #1 → finale #1 reveal.
 */
export const top10CountdownScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 75,
    transition: { type: 'zoom', durationInFrames: 12 },
  },
  {
    id: 'scene-item-10',
    type: 'product',
    startFrame: 75,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-9',
    type: 'features',
    startFrame: 150,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-8',
    type: 'product',
    startFrame: 225,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-7',
    type: 'features',
    startFrame: 300,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-6',
    type: 'product',
    startFrame: 375,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-5',
    type: 'features',
    startFrame: 450,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-4',
    type: 'product',
    startFrame: 525,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-3',
    type: 'features',
    startFrame: 600,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-2',
    type: 'product',
    startFrame: 675,
    durationInFrames: 75,
    transition: { type: 'slide', durationInFrames: 10 },
  },
  {
    id: 'scene-item-1',
    type: 'headline',
    startFrame: 750,
    durationInFrames: 75,
    transition: { type: 'zoom', durationInFrames: 14 },
  },
  {
    id: 'scene-finale',
    type: 'outro',
    startFrame: 825,
    durationInFrames: 75,
    transition: { type: 'fade', durationInFrames: 16 },
  },
];
