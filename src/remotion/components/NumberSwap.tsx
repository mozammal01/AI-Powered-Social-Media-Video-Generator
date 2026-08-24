import { Easing, interpolate, useCurrentFrame } from 'remotion';

export interface NumberSwapProps {
  /** Value shown before the transition. */
  fromValue: number | string;
  /** Value shown after the transition. */
  toValue: number | string;
  /** Frame at which the swap starts. */
  startFrame?: number;
  /** Duration of the swap in frames. */
  duration?: number;
  /** Transition style. */
  variant?: 'roll' | 'flip' | 'slide';
  /** Styles for the outer box. */
  style?: React.CSSProperties;
}

/**
 * NumberSwap — transitions between two values with a mechanical roll,
 * a 3D flip, or a horizontal push-slide. Fully frame-driven.
 *
 * Great for countdown hooks ("10 → 1") and stat callouts.
 */
export const NumberSwap: React.FC<NumberSwapProps> = ({
  fromValue,
  toValue,
  startFrame = 0,
  duration = 30,
  variant = 'roll',
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  if (variant === 'roll') {
    return (
      <span
        style={{
          display: 'inline-block',
          height: '1em',
          overflow: 'hidden',
          lineHeight: 1,
          ...style,
        }}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${-progress}em)`,
          }}
        >
          <span style={{ display: 'block', height: '1em' }}>{fromValue}</span>
          <span style={{ display: 'block', height: '1em' }}>{toValue}</span>
        </span>
      </span>
    );
  }

  if (variant === 'flip') {
    return (
      <span
        style={{
          display: 'inline-block',
          transform: `perspective(700px) rotateX(${(1 - progress) * -90}deg)`,
          opacity: interpolate(progress, [0, 0.35], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          ...style,
        }}
      >
        {progress < 0.5 ? fromValue : toValue}
      </span>
    );
  }

  // slide: old value pushes out left while the new one slides in from right.
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          visibility: progress >= 1 ? 'hidden' : 'visible',
          transform: `translateX(${progress * -110}%)`,
        }}
      >
        {fromValue}
      </span>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'inline-flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          transform: `translateX(${(1 - progress) * 110}%)`,
        }}
      >
        {toValue}
      </span>
    </span>
  );
};