import { useFadeIn, usePulse, useRotateIn, useSpringScale, useSpringSlideUp } from '../animations';

export interface DiscountBadgeProps {
  discount: string;
  accentColor?: string;
  /** Local frame at which the badge animates in. */
  enterFrame?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  discount,
  accentColor = '#A855F7',
  enterFrame = 20,
  size = 'lg',
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 14 });
  const scale = useSpringScale({ from: enterFrame, damping: 10, stiffness: 160, mass: 0.8 });
  const translateY = useSpringSlideUp({ from: enterFrame, distance: 18, damping: 14, stiffness: 130 });
  const rotate = useRotateIn({ from: enterFrame, fromDeg: -6, toDeg: 0, duration: 26 });
  const pulse = usePulse(45, 0.04);

  const dimensions = {
    sm: { padding: '8px 16px', fontSize: 18 },
    md: { padding: '12px 24px', fontSize: 24 },
    lg: { padding: '16px 32px', fontSize: 32 },
  }[size];

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale * pulse})`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: dimensions.padding,
        borderRadius: 999,
        background: accentColor,
        color: '#ffffff',
        fontSize: dimensions.fontSize,
        fontWeight: 800,
        letterSpacing: '0.04em',
        boxShadow: `0 8px 32px ${accentColor}66`,
      }}
    >
      {discount}
    </div>
  );
};
