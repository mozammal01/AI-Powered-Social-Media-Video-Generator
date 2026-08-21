import { AbsoluteFill, Img } from 'remotion';
import { useBackgroundMovement, useFadeIn } from '../animations';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';
import type { BrandInfo } from '@/types';

export interface BackgroundProps {
  brand: BrandInfo;
  /** Optional background image URL. Falls back to gradient. */
  imageUrl?: string;
  /** Absolute frame at which this background fades in. */
  enterFrame?: number;
  /** 0–1 overlay opacity on top of the image/gradient. */
  overlayOpacity?: number;
  variant?: 'dark' | 'light';
}

export const Background: React.FC<BackgroundProps> = ({
  brand,
  imageUrl,
  enterFrame = 0,
  overlayOpacity = 0.72,
  variant = 'dark',
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 15 });
  const drift = useBackgroundMovement(300, 14);

  const primary = brand.primaryColor ?? '#6366F1';
  const accent = brand.accentColor ?? '#A855F7';
  const resolvedImage = resolveAssetUrl(imageUrl);

  // Build gradient CSS
  const gradient = variant === 'dark'
    ? `linear-gradient(145deg, #0f0f1a 0%, ${primary}33 40%, ${accent}22 70%, #0a0a14 100%)`
    : `linear-gradient(145deg, #f8f8ff 0%, ${primary}18 40%, ${accent}12 70%, #f0f0fa 100%)`;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${drift.scale})`,
      }}
    >
      {/* Base gradient */}
      <AbsoluteFill style={{ background: gradient }} />

      {/* Optional image layer */}
      {resolvedImage && (
        <AbsoluteFill>
          <Img
            src={resolvedImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Dark overlay for text legibility */}
      <AbsoluteFill
        style={{
          background: variant === 'dark'
            ? `rgba(8, 8, 20, ${overlayOpacity})`
            : `rgba(255, 255, 255, ${overlayOpacity})`,
        }}
      />

      {/* Subtle accent glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 20%, ${primary}15 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${accent}15 0%, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};
