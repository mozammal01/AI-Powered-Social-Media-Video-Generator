import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { MotionBlur } from './MotionBlur';

export interface SwipeTransitionProps {
  /** Frame at which the swipe window opens. */
  enterFrame?: number;
  /** Total duration of cover + reveal in frames. */
  duration?: number;
  /** Axis and direction the panels travel. */
  direction?: 'left' | 'right' | 'up' | 'down';
  /**
   * Panel colors back-to-front — the LAST color leads the wipe.
   * Two or three colors give a layered, comic-panel feel.
   */
  colors?: string[];
  /** Overlap between panel timings (0–1). Higher = tighter stack. */
  overlap?: number;
  /** Peak directional motion blur in px applied to the panels mid-travel. */
  motionBlur?: number;
}

const TRAVEL = 115; // % of viewport each panel travels

/**
 * SwipeTransition — a full-screen multi-panel wipe used to punch between
 * scenes: panels sweep in to cover the frame, then sweep out the opposite
 * side to reveal what comes next.
 *
 * Render it as an overlay spanning a scene boundary; the outgoing scene
 * sits beneath its first half and the incoming scene beneath its second.
 */
export const SwipeTransition: React.FC<SwipeTransitionProps> = ({
  enterFrame = 0,
  duration = 20,
  direction = 'left',
  colors = ['#111118', '#FF3B5C'],
  overlap = 0.4,
  motionBlur = 26,
}) => {
  const frame = useCurrentFrame();

  if (frame < enterFrame || frame > enterFrame + duration) {
    return null;
  }

  const count = Math.max(1, colors.length);
  const isHorizontal = direction === 'left' || direction === 'right';
  const sign = direction === 'left' || direction === 'up' ? -1 : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {colors.map((color, index) => {
        // Front panel (last) leads; back panels trail by `overlap`.
        const lead = count - 1 - index;
        const p = interpolate(
          frame,
          [enterFrame + lead * overlap * duration * 0.5, enterFrame + duration - lead * overlap * duration * 0.5],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.cubic),
          },
        );

        // Cover during the first half, reveal during the second.
        const travel =
          p < 0.5
            ? interpolate(p, [0, 0.5], [-TRAVEL, 0])
            : interpolate(p, [0.5, 1], [0, TRAVEL]);

        // Motion blur peaks at maximum velocity (mid-cover / mid-reveal).
        const speedFactor = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
        const blurX = isHorizontal ? motionBlur * speedFactor : 0;
        const blurY = isHorizontal ? 0 : motionBlur * speedFactor;

        return (
          <MotionBlur key={index} amountX={blurX} amountY={blurY}>
            <div
              style={{
                position: 'absolute',
                inset: '-2%',
                background: color,
                transform: isHorizontal
                  ? `translateX(${sign * travel}%)`
                  : `translateY(${sign * travel}%)`,
              }}
            />
          </MotionBlur>
        );
      })}
    </div>
  );
};