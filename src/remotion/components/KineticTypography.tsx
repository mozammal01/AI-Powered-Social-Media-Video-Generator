import { Fragment } from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticTypographyProps {
  /** Text to animate. Lines mode splits on newline characters. */
  text: string;
  /** Frame at which the first token enters. */
  enterFrame?: number;
  /** Frames between consecutive tokens. */
  stagger?: number;
  /** Duration of each token's own animation in frames. */
  tokenDuration?: number;
  /** Token granularity. */
  mode?: 'words' | 'lines' | 'chars';
  /** Animation style per token. */
  variant?: 'rise' | 'pop' | 'blur' | 'slide';
  /**
   * Words rendered in `accentColor` (words mode only).
   * Matching is case-insensitive and ignores punctuation.
   */
  highlightWords?: string[];
  accentColor?: string;
  /** Styles for the outer text block. */
  style?: React.CSSProperties;
}

const NEWLINE = String.fromCharCode(10);

function normalizeWord(word: string): string {
  return word.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

/**
 * KineticTypography — splits text into words, lines, or characters and
 * animates each token in with a staggered entrance.
 *
 * Variants:
 *  - rise: masked slide-up (editorial title cards)
 *  - pop:  bouncy spring scale-in
 *  - blur: focus pull from soft to sharp
 *  - slide: horizontal glide with fade
 */
export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text,
  enterFrame = 0,
  stagger = 3,
  tokenDuration = 24,
  mode = 'words',
  variant = 'rise',
  highlightWords,
  accentColor = '#C9A24B',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlights = new Set((highlightWords ?? []).map(normalizeWord));

  const tokens: string[] =
    mode === 'lines'
      ? text.split(NEWLINE)
      : mode === 'chars'
        ? Array.from(text)
        : text.split(/\s+/).filter(Boolean);

  const renderToken = (token: string, index: number): React.ReactNode => {
    const start = enterFrame + index * stagger;
    const local = frame - start;

    if (mode === 'chars' && token === ' ') {
      return <span key={index}>{'\u00A0'}</span>;
    }

    const isHighlighted = mode !== 'lines' && highlights.has(normalizeWord(token));

    let inner: React.ReactNode;

    switch (variant) {
      case 'rise': {
        const progress = spring({
          frame: local,
          fps,
          config: { damping: 20, stiffness: 160 },
          durationInFrames: tokenDuration,
        });
        inner = (
          <span
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - progress) * 115}%)`,
            }}
          >
            {token}
          </span>
        );
        break;
      }
      case 'pop': {
        const progress = spring({
          frame: local,
          fps,
          config: { damping: 11, stiffness: 200, mass: 0.9 },
          durationInFrames: tokenDuration,
        });
        inner = (
          <span
            style={{
              display: 'inline-block',
              transform: `scale(${0.5 + progress * 0.5})`,
              opacity: Math.min(1, progress * 1.6),
            }}
          >
            {token}
          </span>
        );
        break;
      }
      case 'blur': {
        const blur = interpolate(local, [0, tokenDuration], [10, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(local, [0, tokenDuration * 0.6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        inner = (
          <span style={{ display: 'inline-block', filter: `blur(${blur}px)`, opacity }}>
            {token}
          </span>
        );
        break;
      }
      case 'slide': {
        const x = interpolate(local, [0, tokenDuration], [-48, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(local, [0, tokenDuration * 0.7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        inner = (
          <span style={{ display: 'inline-block', transform: `translateX(${x}px)`, opacity }}>
            {token}
          </span>
        );
        break;
      }
    }

    // Masked rise needs an overflow-hidden wrapper; others render directly.
    if (variant === 'rise') {
      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            color: isHighlighted ? accentColor : undefined,
          }}
        >
          {inner}
        </span>
      );
    }

    return (
      <span key={index} style={{ color: isHighlighted ? accentColor : undefined }}>
        {inner}
      </span>
    );
  };

  if (mode === 'lines') {
    return (
      <div style={style}>
        {tokens.map((line, index) => (
          <div key={index}>{renderToken(line, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={style}>
      {tokens.map((token, index) => (
        <Fragment key={index}>
          {renderToken(token, index)}
          {mode === 'words' && index < tokens.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </div>
  );
};