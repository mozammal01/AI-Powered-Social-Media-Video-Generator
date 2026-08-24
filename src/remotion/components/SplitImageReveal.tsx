import { Easing, Img, interpolate, useCurrentFrame } from 'remotion';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';

export interface SplitImageRevealProps {
  /** Image URL (falls back to a gradient + initial letter when omitted). */
  src?: string;
  /** Alt text / fallback label — its first letter fills the placeholder. */
  alt?: string;
  /** Axis the two halves travel along. */
  direction?: 'horizontal' | 'vertical';
  /** Frame at which the halves start sliding in. */
  enterFrame?: number;
  /** Duration of the slide-in in frames. */
  duration?: number;
  /** Accent color for the seam flash line and fallback gradient. */
  accentColor?: string;
  /** Corner radius of the frame. */
  borderRadius?: number;
  /** Styles for the outer frame. */
  style?: React.CSSProperties;
}

/**
 * SplitImageReveal — an image frame whose two halves slide in from
 * opposite edges and lock together, with a quick seam-flash accent.
 *
 * Without a src it renders a bold gradient placeholder with the first
 * letter of `alt`, so layouts stay presentable with missing assets.
 */
export const SplitImageReveal: React.FC<SplitImageRevealProps> = ({
  src,
  alt = '',
  direction = 'vertical',
  enterFrame = 0,
  duration = 22,
  accentColor = '#FFD60A',
  borderRadius = 18,
  style,
}) => {
  const frame = useCurrentFrame();
  const resolved = resolveAssetUrl(src);

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const offset = (1 - progress) * 103; // % each half travels

  const isVertical = direction === 'vertical';
  const firstHalfStyle: React.CSSProperties = isVertical
    ? { top: 0, height: '50%', transform: `translateY(${-offset}%)` }
    : { left: 0, width: '50%', transform: `translateX(${-offset}%)` };
  const secondHalfStyle: React.CSSProperties = isVertical
    ? { bottom: 0, height: '50%', transform: `translateY(${offset}%)` }
    : { right: 0, width: '50%', transform: `translateX(${offset}%)` };

  // Full-bleed image inside a clipping half-window.
  const innerImageStyle: React.CSSProperties = isVertical
    ? { position: 'absolute', left: 0, top: 0, width: '100%', height: '200%', objectFit: 'cover' }
    : { position: 'absolute', top: 0, left: 0, height: '100%', width: '200%', objectFit: 'cover' };

  const seamProgress = interpolate(
    frame,
    [enterFrame + duration - 4, enterFrame + duration + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const initial = (alt.trim()[0] ?? '#').toUpperCase();

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius,
        background: '#15151d',
        ...style,
      }}
    >
      {/* First half */}
      <div style={{ position: 'absolute', overflow: 'hidden', ...firstHalfStyle }}>
        {resolved ? (
          <Img src={resolved} alt={alt} style={innerImageStyle} />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: isVertical ? '0 0 -100% 0' : '0 -100% 0 0',
              background: `linear-gradient(135deg, ${accentColor}33 0%, #1b1b26 60%, #101018 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: '"Arial Black", Arial, sans-serif',
                fontWeight: 900,
                fontSize: '9em',
                color: accentColor,
                opacity: 0.85,
              }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Second half */}
      <div style={{ position: 'absolute', overflow: 'hidden', ...secondHalfStyle }}>
        {resolved ? (
          <Img
            src={resolved}
            alt=""
            style={
              isVertical
                ? { ...innerImageStyle, top: '-100%' }
                : { ...innerImageStyle, left: '-100%' }
            }
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: isVertical ? '-100% 0 0 0' : '0 0 0 -100%',
              background: `linear-gradient(315deg, ${accentColor}33 0%, #1b1b26 60%, #101018 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: '"Arial Black", Arial, sans-serif',
                fontWeight: 900,
                fontSize: '9em',
                color: accentColor,
                opacity: 0.85,
              }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Seam flash */}
      <div
        style={{
          position: 'absolute',
          ...(isVertical
            ? { left: 0, right: 0, top: '50%', height: 3, marginTop: -1.5 }
            : { top: 0, bottom: 0, left: '50%', width: 3, marginLeft: -1.5 }),
          background: accentColor,
          boxShadow: `0 0 18px ${accentColor}`,
          opacity: seamProgress,
          transform: isVertical ? `scaleX(${progress})` : `scaleY(${progress})`,
        }}
      />
    </div>
  );
};