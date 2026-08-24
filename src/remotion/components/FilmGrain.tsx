import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface FilmGrainProps {
  /** 0–1 strength of the grain overlay. */
  opacity?: number;
  /** Blend mode used for the grain layer. */
  blendMode?: 'overlay' | 'soft-light' | 'screen' | 'multiply';
  /** Render a cinematic vignette on top of the grain. */
  vignette?: boolean;
  /** Vignette darkness 0–1. */
  vignetteStrength?: number;
  /** Grain sprite re-seeds every N frames — lower = more aggressive flicker. */
  seedInterval?: number;
  /** Subtle exposure flicker amplitude 0–1 (0 disables). */
  flicker?: number;
}

/**
 * Builds a small tiled SVG noise sprite as a data URI.
 * Deterministic per seed — safe for Remotion rendering.
 */
function grainDataUri(seed: number): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>` +
    `<filter id='g'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch' seed='${seed}'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.55 0.55 0.55 0 0'/>` +
    `</filter>` +
    `<rect width='240' height='240' filter='url(#g)'/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * FilmGrain — animated photographic grain overlay with optional vignette
 * and exposure flicker. Deterministic (seed derives from the frame number),
 * so renders are reproducible.
 *
 * Place it as the TOPMOST layer of a composition to grade everything below it.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.4,
  blendMode = 'overlay',
  vignette = false,
  vignetteStrength = 0.5,
  seedInterval = 2,
  flicker = 0.06,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / seedInterval) % 8;
  const flickerFactor = 1 - flicker / 2 + flicker * Math.abs(Math.sin(frame * 1.7));
  const grainOpacity = opacity * flickerFactor;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{
          backgroundImage: grainDataUri(seed),
          backgroundRepeat: 'repeat',
          mixBlendMode: blendMode,
          opacity: grainOpacity,
        }}
      />
      {vignette && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 52%, rgba(0, 0, 0, ${vignetteStrength}) 100%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};