import { Img } from 'remotion';
import { useFadeIn, useSpringScale, useSpringSlideUp } from '../animations';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';

export interface BrandLogoProps {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  /** Local frame at which the logo animates in. */
  enterFrame?: number;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  logoUrl,
  primaryColor = '#6366F1',
  accentColor = '#A855F7',
  enterFrame = 0,
  size = 120,
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 18 });
  const scale = useSpringScale({ from: enterFrame, damping: 14, stiffness: 120 });
  const translateY = useSpringSlideUp({ from: enterFrame, distance: 24, damping: 16, stiffness: 100 });

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const resolvedLogo = resolveAssetUrl(logoUrl);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {resolvedLogo ? (
        <Img
          src={resolvedLogo}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            borderRadius: size * 0.2,
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size * 0.22,
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.38,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            boxShadow: `0 12px 40px ${primaryColor}55`,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
