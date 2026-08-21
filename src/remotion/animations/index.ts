import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FadeConfig {
  /** Absolute frame to start fading in. */
  from: number;
  /** Duration of the fade in frames. */
  duration?: number;
}

export interface SlideConfig {
  /** Absolute frame to start sliding in. */
  from: number;
  /** Distance in pixels to travel. Positive = from below (up), negative = from above. */
  distance?: number;
  /** Duration of the slide in frames. */
  duration?: number;
}

export interface SpringConfig {
  /** Absolute frame to start the spring. */
  from: number;
  /** Spring damping. Higher = less bounce. */
  damping?: number;
  /** Spring stiffness. Higher = faster. */
  stiffness?: number;
  /** Spring mass. Higher = more inertia. */
  mass?: number;
}

export interface ScaleConfig {
  /** Absolute frame to start scaling in. */
  from: number;
  /** Initial scale value (e.g. 0.8). */
  initialScale?: number;
  /** Duration of the scale in frames. */
  duration?: number;
}

export interface RotateConfig {
  /** Absolute frame to start rotating in. */
  from: number;
  /** Starting rotation in degrees. */
  fromDeg?: number;
  /** Ending rotation in degrees. */
  toDeg?: number;
  /** Duration of the rotation in frames. */
  duration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns an opacity value [0→1] starting at `from` over `duration` frames.
 */
export function useFadeIn({ from, duration = 20 }: FadeConfig): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns an opacity value [1→0] starting at `from` over `duration` frames.
 */
export function useFadeOut({ from, duration = 20 }: FadeConfig): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a translateY value that slides from `distance`px → 0 starting at `from`.
 * Default slides up from +40px below.
 */
export function useSlideUp({ from, distance = 40, duration = 24 }: SlideConfig): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a translateX value that slides from `distance`px → 0 starting at `from`.
 * `direction` controls whether it enters from the right (+distance) or left (-distance).
 */
export function useSlideIn({
  from,
  distance = 60,
  duration = 24,
  direction = 'right',
}: SlideConfig & { direction?: 'left' | 'right' }): number {
  const frame = useCurrentFrame();
  const start = direction === 'right' ? distance : -distance;
  return interpolate(frame, [from, from + duration], [start, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a scale value [initialScale→1] starting at `from`.
 */
export function useScaleIn({ from, initialScale = 0.8, duration = 24 }: ScaleConfig): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [initialScale, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a rotation value [fromDeg→toDeg] starting at `from`.
 */
export function useRotateIn({
  from,
  fromDeg = -8,
  toDeg = 0,
  duration = 24,
}: RotateConfig): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [fromDeg, toDeg], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a spring-driven scale value [0→1] starting at `from`.
 * Produces an elastic pop-in effect.
 */
export function usePopIn({
  from,
  damping = 14,
  stiffness = 120,
  mass = 1,
}: SpringConfig): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - from,
    fps,
    config: { damping, stiffness, mass },
    durationInFrames: 40,
  });
}

/**
 * Returns a spring scale value [0→1] starting at `from`.
 * Produces an elastic pop-in effect. Alias for `usePopIn`.
 */
export function useSpringScale({
  from,
  damping = 14,
  stiffness = 120,
  mass = 1,
}: SpringConfig): number {
  return usePopIn({ from, damping, stiffness, mass });
}

/**
 * Returns a spring-driven translateY value [distance→0] starting at `from`.
 */
export function useSpringSlideUp({
  from,
  distance = 50,
  damping = 16,
  stiffness = 100,
  mass = 1,
}: SpringConfig & { distance?: number }): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from,
    fps,
    config: { damping, stiffness, mass },
    durationInFrames: 40,
  });
  return interpolate(progress, [0, 1], [distance, 0]);
}

/**
 * Returns a spring-driven translateX value [distance→0] starting at `from`.
 * `direction` controls whether it enters from the right (+distance) or left (-distance).
 */
export function useSpringSlideIn({
  from,
  distance = 60,
  damping = 16,
  stiffness = 100,
  mass = 1,
  direction = 'right',
}: SpringConfig & { distance?: number; direction?: 'left' | 'right' }): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from,
    fps,
    config: { damping, stiffness, mass },
    durationInFrames: 40,
  });
  const start = direction === 'right' ? distance : -distance;
  return interpolate(progress, [0, 1], [start, 0]);
}

/**
 * Returns a staggered opacity value for list items.
 * Each item `index` starts `stagger` frames after the previous.
 */
export function useStaggerFadeIn(from: number, index: number, stagger = 8, duration = 18): number {
  const frame = useCurrentFrame();
  const start = from + index * stagger;
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a staggered translateY for list items sliding up sequentially.
 */
export function useStaggerSlideUp(
  from: number,
  index: number,
  stagger = 8,
  duration = 18,
  distance = 30,
): number {
  const frame = useCurrentFrame();
  const start = from + index * stagger;
  return interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a staggered spring-driven scale for list items popping in sequentially.
 */
export function useStaggerPopIn(
  from: number,
  index: number,
  stagger = 8,
  damping = 14,
  stiffness = 120,
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - (from + index * stagger),
    fps,
    config: { damping, stiffness },
    durationInFrames: 40,
  });
}

/**
 * Returns a pulsing scale oscillation (1 → 1+amplitude → 1).
 * Useful for "ping" effects on badges or CTAs.
 */
export function usePulse(periodFrames = 60, amplitude = 0.05): number {
  const frame = useCurrentFrame();
  return 1 + Math.sin((frame / periodFrames) * Math.PI * 2) * amplitude;
}

/**
 * Returns a subtle, deterministic background drift (translate + scale).
 * Loops smoothly over `durationInFrames` for a professional "living" backdrop.
 */
export function useBackgroundMovement(
  durationInFrames = 300,
  amplitude = 18,
): { x: number; y: number; scale: number } {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;
  const x = Math.sin(progress * Math.PI * 2) * amplitude;
  const y = Math.cos(progress * Math.PI * 2) * amplitude * 0.6;
  const scale = 1.04 + Math.sin(progress * Math.PI * 2) * 0.015;
  return { x, y, scale };
}

/**
 * Returns opacity for scene enter/exit crossfades (0→1→0).
 * Frame values are relative to the scene (local frame inside a Sequence).
 */
export function useSceneOpacity(
  durationInFrames: number,
  fadeFrames = 12,
): number {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
  return Math.min(fadeIn, fadeOut);
}
