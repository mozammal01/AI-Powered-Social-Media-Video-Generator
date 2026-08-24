import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

export interface LightSweepProps {
  /** Frame at which the sweep starts. */
  enterFrame?: number;
  /** Duration of the sweep in frames. */
  duration?: number;
  /** Rotation of the light band in degrees. */
  angle?: number;
  /** Color of the light band (any CSS color). */
  color?: string;
  /** Peak intensity of the band, 0–1. */
  intensity?: number;
  /** Width of the band as a percentage of the container width. */
  width?: string;
  /** Soft blur applied to the band edges in px. */
  softness?: number;
}

/**
 * LightSweep — a soft diagonal band of light that glides across the frame
 * and fades at both ends. Great for "glint" moments on titles and
 * scene-transition shimmer.
 *
 * Renders nothing before `enterFrame` or after the sweep completes.
 */
export const LightSweep: React.FC<LightSweepProps> = ({
  enterFrame = 0,
  duration = 30,
  angle = -18,
  color = '#FFFFFF',
  intensity = 0.45,
  width = '32%',
  softness = 8,
}) => {
  const frame = useCurrentFrame();

  if (frame < enterFrame || frame > enterFrame + duration) {
    return null;
  }

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Fade the band in/out at the ends of the sweep.
  const edgeFade = Math.sin(progress * Math.PI);
  const translateX = -130 + progress * 260; // % of container width

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${translateX}%)`,
          mixBlendMode: 'screen',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60%',
            bottom: '-60%',
            left: '30%',
            width,
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
            transform: `rotate(${angle}deg)`,
            filter: `blur(${softness}px)`,
            opacity: intensity * edgeFade,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};