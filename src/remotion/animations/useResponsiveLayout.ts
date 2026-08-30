import { useVideoConfig } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AspectRatioMode = 'landscape' | 'square' | 'portrait';

export interface ResponsiveLayout {
  /** Current aspect ratio mode. */
  mode: AspectRatioMode;
  /** Canvas width in pixels. */
  width: number;
  /** Canvas height in pixels. */
  height: number;
  /** Safe margin from edges in pixels (scaled to canvas). */
  safeMargin: number;
  /** Horizontal padding for content. */
  paddingX: number;
  /** Vertical padding for content. */
  paddingY: number;
  /** Maximum width for text blocks. */
  maxTextWidth: number;
  /** Maximum height for text blocks. */
  maxTextHeight: number;
  /** Maximum width for images. */
  maxImageWidth: number;
  /** Maximum height for images. */
  maxImageHeight: number;
  /** Whether to use horizontal (row) layout for side-by-side content. */
  horizontalLayout: boolean;
  /** Base font size scale factor (relative to 16:9). */
  fontScale: number;
  /** Whether the canvas is tall and narrow (9:16). */
  isPortrait: boolean;
  /** Whether the canvas is square (1:1). */
  isSquare: boolean;
  /** Whether the canvas is wide (16:9). */
  isLandscape: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function getAspectRatioMode(width: number, height: number): AspectRatioMode {
  const ratio = width / height;
  if (ratio > 1.2) return 'landscape';
  if (ratio < 0.8) return 'portrait';
  return 'square';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Returns responsive layout metrics derived from the current Remotion
 * composition dimensions. Use this inside any template component to
 * adapt spacing, typography, and layout for 16:9, 1:1, and 9:16.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useVideoConfig();
  const mode = getAspectRatioMode(width, height);

  const isPortrait = mode === 'portrait';
  const isSquare = mode === 'square';
  const isLandscape = mode === 'landscape';

  // Base values are for 1920x1080 (16:9). Scale proportionally.
  const scale = Math.min(width / 1920, height / 1080);
  const baseSafe = 48;
  const safeMargin = clamp(baseSafe * scale * (isPortrait ? 1.4 : isSquare ? 1.1 : 1), 24, 120);
  const paddingX = safeMargin;
  const paddingY = safeMargin;

  const maxTextWidth = clamp(
    isPortrait ? width * 0.88 : isSquare ? width * 0.72 : width * 0.52,
    280,
    width * 0.9
  );
  const maxTextHeight = clamp(
    isPortrait ? height * 0.6 : isSquare ? height * 0.5 : height * 0.55,
    200,
    height * 0.8
  );

  const maxImageWidth = clamp(
    isPortrait ? width * 0.85 : isSquare ? width * 0.55 : width * 0.42,
    240,
    width * 0.9
  );
  const maxImageHeight = clamp(
    isPortrait ? height * 0.35 : isSquare ? height * 0.45 : height * 0.55,
    160,
    height * 0.7
  );

  const horizontalLayout = isLandscape || isSquare;
  const fontScale = clamp(scale * (isPortrait ? 0.85 : isSquare ? 0.9 : 1), 0.6, 1.3);

  return {
    mode,
    width,
    height,
    safeMargin,
    paddingX,
    paddingY,
    maxTextWidth,
    maxTextHeight,
    maxImageWidth,
    maxImageHeight,
    horizontalLayout,
    fontScale,
    isPortrait,
    isSquare,
    isLandscape,
  };
}
