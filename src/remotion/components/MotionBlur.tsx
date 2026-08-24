import { useId } from 'react';

export interface MotionBlurProps {
  /** Horizontal blur radius in px (directional trail). */
  amountX?: number;
  /** Vertical blur radius in px (directional trail). */
  amountY?: number;
  /** Content to blur. */
  children: React.ReactNode;
  /** Optional styles for the wrapper. */
  style?: React.CSSProperties;
}

/**
 * MotionBlur — directional motion blur via an SVG feGaussianBlur filter.
 * Unlike CSS `blur()`, the radius is anisotropic, so fast horizontal moves
 * smear horizontally only.
 *
 * The parent drives the amounts from the current frame (e.g. decaying
 * blur synced to a spring entrance) — this component stays pure.
 */
export const MotionBlur: React.FC<MotionBlurProps> = ({
  amountX = 0,
  amountY = 0,
  children,
  style,
}) => {
  const rawId = useId();
  const filterId = `motion-blur-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`;

  const x = Math.abs(amountX);
  const y = Math.abs(amountY);
  const active = x > 0.05 || y > 0.05;

  return (
    <div
      style={{
        filter: active ? `url(#${filterId})` : undefined,
        willChange: active ? 'filter' : undefined,
        ...style,
      }}
    >
      {active && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={`${x} ${y}`} />
            </filter>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
};