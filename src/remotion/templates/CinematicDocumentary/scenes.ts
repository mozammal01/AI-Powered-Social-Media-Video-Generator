import type { VideoScene } from '@/types';

/**
 * CinematicDocumentary scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 6 scenes × 5 seconds = 150 frames each.
 *
 * Scene order: opening title → archival parallax → kinetic statement →
 * map movement → timeline → finale lockup.
 */
export const cinematicDocumentaryScenes: VideoScene[] = [
  {
    id: 'scene-opening',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 150,
    transition: { type: 'wipe', durationInFrames: 18 },
  },
  {
    id: 'scene-parallax',
    type: 'product',
    startFrame: 150,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 14 },
  },
  {
    id: 'scene-statement',
    type: 'features',
    startFrame: 300,
    durationInFrames: 150,
    transition: { type: 'wipe', durationInFrames: 18 },
  },
  {
    id: 'scene-map',
    type: 'headline',
    startFrame: 450,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 14 },
  },
  {
    id: 'scene-timeline',
    type: 'outro',
    startFrame: 600,
    durationInFrames: 150,
    transition: { type: 'wipe', durationInFrames: 18 },
  },
  {
    id: 'scene-finale',
    type: 'cta',
    startFrame: 750,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 20 },
  },
];
