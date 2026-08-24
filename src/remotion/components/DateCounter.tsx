import { Easing, interpolate, useCurrentFrame } from 'remotion';

export interface DateCounterProps {
  /** Value the counter starts from. */
  from: number;
  /** Value the counter rolls to. */
  to: number;
  /** Frame at which the roll starts. */
  startFrame?: number;
  /** Duration of the roll in frames. */
  durationInFrames?: number;
  /** Static text rendered before the digits (e.g. "EST. "). */
  prefix?: string;
  /** Static text rendered after the digits (e.g. " AD"). */
  suffix?: string;
  /** Insert thousands separators between digit groups. */
  separator?: boolean;
  /** Pad with leading zeros up to this many digits. */
  padToDigits?: number;
  /** Fade + rise the whole counter in at `startFrame`. */
  animateIn?: boolean;
  /** Styles for the outer counter row. */
  style?: React.CSSProperties;
  /** Styles applied to each rolling digit column. */
  digitStyle?: React.CSSProperties;
}

const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // extra 0 for wraparound

function digitCount(n: number): number {
  return Math.max(1, Math.floor(Math.abs(n)).toString().length);
}

/**
 * DateCounter — an odometer-style rolling number counter. Each digit
 * column spins continuously through its values (with smooth fractional
 * carry), like a mechanical year counter in a documentary title card.
 *
 * Deterministic — derived purely from the current frame.
 */
export const DateCounter: React.FC<DateCounterProps> = ({
  from,
  to,
  startFrame = 0,
  durationInFrames = 60,
  prefix,
  suffix,
  separator = false,
  padToDigits,
  animateIn = true,
  style,
  digitStyle,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const value = from + (to - from) * progress;

  const totalDigits = Math.max(digitCount(from), digitCount(to), padToDigits ?? 0);

  const enterOpacity = animateIn
    ? interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  const enterY = animateIn
    ? interpolate(frame, [startFrame, startFrame + 14], [24, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  const columns: React.ReactNode[] = [];

  for (let p = totalDigits - 1; p >= 0; p--) {
    const placeValue = Math.pow(10, p);
    const position = value / placeValue;
    const shown = position % 10; // continuous 0→10 roll for this column

    columns.push(
      <span
        key={`d${p}`}
        style={{
          display: 'inline-block',
          height: '1em',
          overflow: 'hidden',
          ...digitStyle,
        }}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${-shown}em)`,
          }}
        >
          {DIGIT_STRIP.map((digit, i) => (
            <span key={i} style={{ display: 'block', height: '1em', lineHeight: 1 }}>
              {digit}
            </span>
          ))}
        </span>
      </span>,
    );

    // Thousands separator between groups — only visible once that group exists.
    if (separator && p % 3 === 0 && p !== 0) {
      const commaVisible = Math.floor(Math.abs(value)) >= placeValue * 10 ? 1 : 0;
      columns.push(
        <span key={`s${p}`} style={{ opacity: commaVisible }}>
          ,
        </span>,
      );
    }
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        opacity: enterOpacity,
        transform: `translateY(${enterY}px)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {prefix}
      {columns}
      {suffix}
    </span>
  );
};