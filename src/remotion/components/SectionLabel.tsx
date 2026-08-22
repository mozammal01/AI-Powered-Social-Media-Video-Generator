import { useFadeIn, useSpringSlideUp } from '../animations';

export interface SectionLabelProps {
  label: string;
  primaryColor?: string;
  /** Local frame at which the label animates in. */
  enterFrame?: number;
  /** Horizontal alignment of the label. */
  align?: 'left' | 'center';
}

/**
 * Small uppercase section heading used across templates
 * (e.g. "Key Features", "Special Offer", "Today's Menu").
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  primaryColor = '#6366F1',
  enterFrame = 0,
  align = 'center',
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 16 });
  const translateY = useSpringSlideUp({
    from: enterFrame,
    distance: 22,
    damping: 16,
    stiffness: 110,
  });

  return (
    <p
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        margin: 0,
        fontSize: 26,
        fontWeight: 700,
        color: primaryColor,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        textAlign: align,
        padding: '0 56px',
        width: '100%',
      }}
    >
      {label}
    </p>
  );
};