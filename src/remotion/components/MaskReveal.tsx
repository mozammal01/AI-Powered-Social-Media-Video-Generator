import { Easing, interpolate, useCurrentFrame } from 'remotion';

export interface MaskRevealProps {
  /**
   * Direction the reveal travels:
   *  - 'right': content appears expanding left → right
   *  - 'left':  content appears expanding right → left
   *  - 'down':  content appears expanding top → bottom
   *  - 'up':    content appears expanding bottom → top
   */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Frame at which the reveal starts. */
  enterFrame?: number;
  /** Duration of the reveal in frames. */
  duration?: number;
  /** Rendered content that gets revealed. */
  children: React.ReactNode;
  /** Optional styles for the clipping wrapper. */
  style?: React.CSSProperties;
}

/**
 * MaskReveal — wipes its children into view with an animated clip-path mask.
 * A hard-edged, editorial reveal that pairs well with serif titles and
 * documentary lower-thirds.
 *
 * Before `enterFrame` the content is fully hidden; after `enterFrame +
 * duration` it is fully visible.
 */
export const MaskReveal: React.FC<MaskRevealProps> = ({
  direction = 'right',
  enterFrame = 0,
  duration = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Remaining inset percentage for the leading edge of the mask.
  const edge = interpolate(progress, [0, 1], [100, 0]);

  const insetFor = (dir: typeof direction): string => {
    switch (dir) {
      case 'right':
        return `inset(0% ${edge}% 0% 0%)`;
      case 'left':
        return `inset(0% 0% 0% ${edge}%)`;
      case 'down':
        return `inset(0% 0% ${edge}% 0%)`;
      case 'up':
        return `inset(${edge}% 0% 0% 0%)`;
    }
  };

  return (
    <div
      style={{
        clipPath: insetFor(direction),
        willChange: 'clip-path',
        ...style,
      }}
    >
      {children}
    </div>
  );
};