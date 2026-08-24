import { Easing, interpolate, useCurrentFrame } from 'remotion';

export interface BlurFocusProps {
  /** Frame at which the focus-in rack starts. */
  enterFrame?: number;
  /** Duration of the focus-in rack in frames. */
  duration?: number;
  /** Starting blur radius in px (0 disables the focus-in). */
  fromBlur?: number;
  /** Blur radius after focusing in px (usually 0). */
  toBlur?: number;
  /**
   * Optional frame at which a focus-out rack begins
   * (e.g. blurring out before a scene cut).
   */
  exitFrame?: number;
  /** Duration of the focus-out rack in frames. */
  exitDuration?: number;
  /** Final blur radius for the focus-out in px. */
  exitToBlur?: number;
  /** Add a subtle scale settle (1.04 → 1) while racking into focus. */
  settleScale?: boolean;
  /** Content that receives the blur filter. */
  children: React.ReactNode;
  /** Optional styles for the wrapper. */
  style?: React.CSSProperties;
}

/**
 * BlurFocus — racks focus like a cinema lens: children start blurred and
 * pull into sharpness (and optionally blur back out at an exit frame).
 *
 * Wrap any content — images, text blocks, whole scenes.
 */
export const BlurFocus: React.FC<BlurFocusProps> = ({
  enterFrame = 0,
  duration = 24,
  fromBlur = 12,
  toBlur = 0,
  exitFrame,
  exitDuration = 18,
  exitToBlur = 10,
  settleScale = true,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  const focusIn = interpolate(frame, [enterFrame, enterFrame + duration], [fromBlur, toBlur], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const focusOut =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame, exitFrame + exitDuration], [toBlur, exitToBlur], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  const blur = Math.max(focusIn, focusOut);

  const scale = settleScale
    ? interpolate(frame, [enterFrame, enterFrame + duration], [1.04, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      })
    : 1;

  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        willChange: 'filter, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};