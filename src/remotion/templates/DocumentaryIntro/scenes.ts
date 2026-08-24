import type { VideoScene } from '@/types';

/**
 * DocumentaryIntro scene layout.
 *
 * Frames are relative placeholders — the composition scales this layout to
 * the actual duration via `scaleScenesToDuration()`. At the default 20s /
 * 24fps (480 frames) each scene runs exactly 96 frames (4 seconds).
 *
 * Scene order: map cold-open → title reveal → parallax chapter →
 * kinetic statement → finale lockup.
 */
export const documentaryScenes: VideoScene[] = [
  {
    id: 'scene-map',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 96,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-title',
    type: 'headline',
    startFrame: 96,
    durationInFrames: 96,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-chapter',
    type: 'product',
    startFrame: 192,
    durationInFrames: 96,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-statement',
    type: 'features',
    startFrame: 288,
    durationInFrames: 96,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-finale',
    type: 'outro',
    startFrame: 384,
    durationInFrames: 96,
    transition: { type: 'fade', durationInFrames: 12 },
  },
];