import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RankingCounterProps {
  /** The rank to display (e.g. 7 renders "#7"). */
  rank: number;
  /** Optional total shown as a smaller suffix (e.g. "/10"). */
  total?: number;
  /** Prefix before the number. */
  prefix?: string;
  /** Frame at which the counter enters. */
  enterFrame?: number;
  /** Entrance style. */
  variant?: 'pop' | 'slide' | 'blur';
  /** Text color of the number. */
  color?: string;
  /** Color of the smaller total suffix. */
  suffixColor?: string;
  /** Font size (any CSS size). */
  size?: number | string;
  /** Styles for the outer row. */
  style?: React.CSSProperties;
}

/**
 * RankingCounter — a big, punchy listicle rank number ("#7") that slams
 * into frame with a spring pop, masked slide, or motion-blur streak.
 *
 * Pair with MotionBlur in the parent for a decaying speed trail.
 */
export const RankingCounter: React.FC<RankingCounterProps> = ({
  rank,
  total,
  prefix = '#',
  enterFrame = 0,
  variant = 'pop',
  color = '#FFFFFF',
  suffixColor = 'rgba(255,255,255,0.55)',
  size = 160,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - enterFrame;

  let content: React.ReactNode;

  switch (variant) {
    case 'pop': {
      const progress = spring({
        frame: local,
        fps,
        config: { damping: 12, stiffness: 170, mass: 0.9 },
        durationInFrames: 26,
      });
      content = (
        <span
          style={{
            display: 'inline-block',
            transform: `scale(${1.9 - progress * 0.9}) rotate(${(1 - progress) * -8}deg)`,
            opacity: interpolate(local, [0, 5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {prefix}
          {rank}
        </span>
      );
      break;
    }
    case 'slide': {
      const progress = spring({
        frame: local,
        fps,
        config: { damping: 18, stiffness: 150 },
        durationInFrames: 24,
      });
      content = (
        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - progress) * 112}%)`,
            }}
          >
            {prefix}
            {rank}
          </span>
        </span>
      );
      break;
    }
    case 'blur': {
      const progress = spring({
        frame: local,
        fps,
        config: { damping: 16, stiffness: 140 },
        durationInFrames: 24,
      });
      const blur = interpolate(local, [0, 20], [22, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });
      content = (
        <span
          style={{
            display: 'inline-block',
            filter: `blur(${blur}px)`,
            transform: `translateY(${(1 - progress) * -60}px) scale(${0.85 + progress * 0.15})`,
            opacity: interpolate(local, [0, 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {prefix}
          {rank}
        </span>
      );
      break;
    }
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {content}
      {total !== undefined && (
        <span
          style={{
            fontSize: typeof size === 'number' ? size * 0.32 : undefined,
            color: suffixColor,
            marginLeft: '0.08em',
          }}
        >
          /{total}
        </span>
      )}
    </span>
  );
};