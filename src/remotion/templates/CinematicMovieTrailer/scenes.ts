import type { VideoScene } from '@/types';

/**
 * CinematicMovieTrailer scene layout.
 *
 * 30 seconds at 30fps = 900 frames total.
 * 7 scenes.
 *
 * Scene order:
 *  1. Cinematic Opening (0 - 2.5s)
 *  2. Main Title (2.5 - 6s)
 *  3. Main Visual (6 - 11s)
 *  4. Story Beat (11 - 16s)
 *  5. Dramatic Statistic (16 - 21s)
 *  6. Climax (21 - 26s)
 *  7. Final Title (26 - 30s)
 */
export const cinematicMovieTrailerScenes: VideoScene[] = [
  {
    id: 'scene-opening',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 75,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-title',
    type: 'headline',
    startFrame: 75,
    durationInFrames: 105,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-visual',
    type: 'product',
    startFrame: 180,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-story',
    type: 'features',
    startFrame: 330,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-statistic',
    type: 'cta',
    startFrame: 480,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-climax',
    type: 'outro',
    startFrame: 630,
    durationInFrames: 150,
    transition: { type: 'fade', durationInFrames: 10 },
  },
  {
    id: 'scene-final',
    type: 'intro',
    startFrame: 780,
    durationInFrames: 120,
    transition: { type: 'fade', durationInFrames: 10 },
  },
];
