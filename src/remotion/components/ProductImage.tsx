import { Img } from 'remotion';
import { useFadeIn, useRotateIn, useSpringScale } from '../animations';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';

export interface ProductImageProps {
  imageUrl?: string;
  productName: string;
  primaryColor?: string;
  accentColor?: string;
  /** Local frame at which the image animates in. */
  enterFrame?: number;
  maxWidth?: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  productName,
  primaryColor = '#6366F1',
  accentColor = '#A855F7',
  enterFrame = 0,
  maxWidth = 680,
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 22 });
  const scale = useSpringScale({ from: enterFrame, damping: 12, stiffness: 100, mass: 0.9 });
  const rotate = useRotateIn({ from: enterFrame, fromDeg: -4, toDeg: 0, duration: 30 });
  const resolvedImage = resolveAssetUrl(imageUrl);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 48px',
      }}
    >
      {resolvedImage ? (
        <Img
          src={resolvedImage}
          style={{
            width: '100%',
            maxWidth,
            height: 'auto',
            borderRadius: 24,
            boxShadow: `0 24px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px ${primaryColor}33`,
          }}
        />
      ) : (
        <div
          style={{
            width: maxWidth,
            height: maxWidth * 0.65,
            borderRadius: 24,
            background: `linear-gradient(145deg, ${primaryColor}44, ${accentColor}33)`,
            border: `2px solid ${primaryColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 24px 80px rgba(0, 0, 0, 0.45)`,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              padding: '0 32px',
            }}
          >
            {productName}
          </span>
        </div>
      )}
    </div>
  );
};
