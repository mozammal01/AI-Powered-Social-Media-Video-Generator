import { interpolate, useCurrentFrame } from 'remotion';

export interface ProgressBarProps {
  /** Frame at which the fill starts (usually 0). */
  startFrame?: number;
  /** Frame at which the fill completes. */
  endFrame?: number;
  /** Fill color. */
  color?: string;
  /** Track color behind the fill. */
  trackColor?: string;
  /** Bar thickness in px. */
  height?: number;
  /**
   * Number of equal segments to tick off (e.g. 10 for a top-10 countdown).
   * 0 or undefined renders a continuous bar.
   */
  segments?: number;
  /** Render a glowing dot at the leading edge of the fill. */
  showHead?: boolean;
  /** Fully rounded ends. */
  rounded?: boolean;
  /** Styles for the outer track container. */
  style?: React.CSSProperties;
}

/**
 * ProgressBar — a linear progress bar that fills between two frames.
 * Optional segment ticks turn it into a countdown tracker, and an
 * optional glow head rides the leading edge.
 *
 * Deterministic: progress is a pure function of the current frame.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  startFrame = 0,
  endFrame = 300,
  color = '#FFD60A',
  trackColor = 'rgba(255,255,255,0.14)',
  height = 8,
  segments,
  showHead = true,
  rounded = true,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        background: trackColor,
        borderRadius: rounded ? height / 2 : 0,
        overflow: 'visible',
        ...style,
      }}
    >
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${progress * 100}%`,
          background: color,
          borderRadius: rounded ? height / 2 : 0,
        }}
      />

      {/* Segment ticks */}
      {segments !== undefined && segments > 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: `0 ${height / 4}px`,
          }}
        >
          {Array.from({ length: segments - 1 }, (_, i) => (
            <div
              key={i}
              style={{
                width: Math.max(2, height * 0.22),
                alignSelf: 'stretch',
                margin: `${height * 0.18}px 0`,
                background: 'rgba(0,0,0,0.55)',
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow head */}
      {showHead && progress > 0.001 && progress < 0.999 && (
        <div
          style={{
            position: 'absolute',
            left: `${progress * 100}%`,
            top: '50%',
            width: height * 1.6,
            height: height * 1.6,
            marginLeft: -height * 0.8,
            marginTop: -height * 0.8,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: `0 0 ${height}px ${color}, 0 0 ${height * 2.5}px ${color}`,
          }}
        />
      )}
    </div>
  );
};