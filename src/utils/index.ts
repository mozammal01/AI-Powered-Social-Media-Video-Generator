/**
 * Formats video duration in frames to a standard MM:SS string.
 */
export function formatDuration(frames: number, fps: number): string {
  const totalSeconds = Math.round(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a ISO date string to a human-readable date.
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formats a byte number to a human-readable file size (e.g. MB).
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Project Utilities
// ─────────────────────────────────────────────────────────────────────────────

import type { AspectRatio, AspectRatioDimensions, VideoProject, VideoScene } from '@/types';
import { ASPECT_RATIO_DIMENSIONS } from '@/types';

/**
 * Returns pixel dimensions { width, height } for a given AspectRatio.
 *
 * @example
 * getDimensions('9:16') // → { width: 1080, height: 1920 }
 */
export function getDimensions(ratio: AspectRatio): AspectRatioDimensions {
  return ASPECT_RATIO_DIMENSIONS[ratio];
}

/**
 * Converts a frame count to a human-readable seconds string.
 *
 * @example
 * totalDurationSeconds(450, 30) // → "15.0s"
 */
export function totalDurationSeconds(frames: number, fps: number): string {
  return `${(frames / fps).toFixed(1)}s`;
}

/**
 * Returns a one-line plain-text summary of all scenes in a project.
 * Useful for logging and debugging composition structure.
 *
 * @example
 * sceneSummary(project.scenes)
 * // "intro(0–60) → headline(60–150) → features(150–270)"
 */
export function sceneSummary(scenes: VideoScene[]): string {
  return scenes
    .map((s) => `${s.type}(${s.startFrame}–${s.startFrame + s.durationInFrames})`)
    .join(' → ');
}

/**
 * Returns `true` when a project has the minimum required content
 * to be passed as Remotion inputProps without breaking the composition.
 */
export function isProjectReady(project: VideoProject): boolean {
  const { brand, product, cta } = project.content;
  return (
    Boolean(brand.name) &&
    Boolean(product.name) &&
    Boolean(cta.text) &&
    project.scenes.length > 0 &&
    project.durationInFrames > 0
  );
}

/**
 * Calculates the end frame of a scene (exclusive).
 */
export function sceneEndFrame(scene: VideoScene): number {
  return scene.startFrame + scene.durationInFrames;
}

