import type { VideoScene } from '@/types';

/**
 * Evenly distributes `durationInFrames` across the given scene layout.
 *
 * Every template defines its scenes with relative ordering only; this helper
 * stretches/shrinks the layout to whatever duration the composition is
 * rendered at (e.g. 10s / 15s / 30s editor presets).
 *
 * @param scenes - Ordered scene layout (startFrame/durationInFrames are ignored).
 * @param durationInFrames - Total composition duration in frames.
 * @returns Scenes with absolute startFrame and durationInFrames assigned.
 */
export function scaleScenesToDuration(
  scenes: VideoScene[],
  durationInFrames: number,
): VideoScene[] {
  const count = scenes.length;
  if (count === 0) return [];

  const sceneLength = Math.floor(durationInFrames / count);

  return scenes.map((scene, index) => {
    const startFrame = index * sceneLength;
    const length =
      index === count - 1 ? durationInFrames - startFrame : sceneLength;

    return {
      ...scene,
      startFrame,
      durationInFrames: length,
    };
  });
}