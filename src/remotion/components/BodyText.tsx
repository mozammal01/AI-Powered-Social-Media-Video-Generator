import { useFadeIn, useSpringScale, useSpringSlideUp } from '../animations';

export interface BodyTextProps {
  text: string;
  primaryColor?: string;
  /** Local frame at which the text animates in. */
  enterFrame?: number;
  /** Font size in px (scales for different aspect ratios). */
  fontSize?: number;
}

/**
 * Centered body/description paragraph with a brand-colored accent border.
 * Shared by all templates for mid-video descriptive copy.
 */
export const BodyText: React.FC<BodyTextProps> = ({
  text,
  primaryColor = '#6366F1',
  enterFrame = 14,
  fontSize = 32,
}) => {
  const opacity = useFadeIn({ from: enterFrame, duration: 20 });
  const translateY = useSpringSlideUp({
    from: enterFrame,
    distance: 28,
    damping: 16,
    stiffness: 100,
  });
  const scale = useSpringScale({
    from: enterFrame,
    damping: 16,
    stiffness: 110,
  });

  return (
    <p
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        margin: 0,
        padding: '0 56px',
        fontSize,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.82)',
        lineHeight: 1.45,
        textAlign: 'center',
        borderLeft: `4px solid ${primaryColor}`,
      }}
    >
      {text}
    </p>
  );
};