import { useFadeIn, useSpringSlideIn, useSpringSlideUp, useSpringScale } from '../animations';
import { DiscountBadge } from './DiscountBadge';

export interface PriceProps {
  originalPrice?: string;
  finalPrice?: string;
  discount?: string;
  primaryColor?: string;
  accentColor?: string;
  /** Local frame at which pricing animates in. */
  enterFrame?: number;
}

export const Price: React.FC<PriceProps> = ({
  originalPrice,
  finalPrice,
  discount,
  primaryColor = '#6366F1',
  accentColor = '#A855F7',
  enterFrame = 5,
}) => {
  const containerOpacity = useFadeIn({ from: enterFrame, duration: 18 });
  const containerY = useSpringSlideUp({ from: enterFrame, distance: 30, damping: 16, stiffness: 110 });

  const originalOpacity = useFadeIn({ from: enterFrame + 4, duration: 16 });
  const originalX = useSpringSlideIn({
    from: enterFrame + 4,
    distance: 60,
    direction: 'left',
    damping: 16,
    stiffness: 100,
  });

  const finalOpacity = useFadeIn({ from: enterFrame + 12, duration: 18 });
  const finalY = useSpringSlideUp({ from: enterFrame + 12, distance: 24, damping: 14, stiffness: 120 });
  const finalScale = useSpringScale({ from: enterFrame + 12, damping: 14, stiffness: 120 });

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '0 48px',
      }}
    >
      {originalPrice && (
        <p
          style={{
            opacity: originalOpacity,
            transform: `translateX(${originalX}px)`,
            margin: 0,
            fontSize: 36,
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.45)',
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          {originalPrice}
        </p>
      )}

      {finalPrice && (
        <p
          style={{
            opacity: finalOpacity,
            transform: `translateY(${finalY}px) scale(${finalScale})`,
            margin: 0,
            fontSize: 88,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: `0 4px 40px ${primaryColor}88`,
          }}
        >
          {finalPrice}
        </p>
      )}

      {discount && (
        <DiscountBadge
          discount={discount}
          accentColor={accentColor}
          enterFrame={enterFrame + 22}
          size="lg"
        />
      )}
    </div>
  );
};
