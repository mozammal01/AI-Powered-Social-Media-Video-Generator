import { useFadeIn, usePulse, useSpringScale, useSpringSlideUp } from '../animations';

export interface CTAButtonProps {
  text: string;
  subtext?: string;
  websiteUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  /** Local frame at which the CTA animates in. */
  enterFrame?: number;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  subtext,
  websiteUrl,
  primaryColor = '#6366F1',
  accentColor = '#A855F7',
  enterFrame = 8,
}) => {
  const buttonOpacity = useFadeIn({ from: enterFrame, duration: 18 });
  const buttonScale = useSpringScale({ from: enterFrame, damping: 12, stiffness: 130 });
  const buttonY = useSpringSlideUp({ from: enterFrame, distance: 36, damping: 14, stiffness: 120 });
  const pulse = usePulse(70, 0.025);

  const subtextOpacity = useFadeIn({ from: enterFrame + 12, duration: 16 });
  const subtextY = useSpringSlideUp({ from: enterFrame + 12, distance: 20, damping: 16, stiffness: 110 });

  const urlOpacity = useFadeIn({ from: enterFrame + 20, duration: 16 });
  const urlY = useSpringSlideUp({ from: enterFrame + 20, distance: 16, damping: 16, stiffness: 110 });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '0 48px',
      }}
    >
      <div
        style={{
          opacity: buttonOpacity,
          transform: `translateY(${buttonY}px) scale(${buttonScale * pulse})`,
          padding: '28px 64px',
          borderRadius: 999,
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          color: '#ffffff',
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          boxShadow: `0 16px 48px ${primaryColor}66`,
          textAlign: 'center',
        }}
      >
        {text}
      </div>

      {subtext && (
        <p
          style={{
            opacity: subtextOpacity,
            transform: `translateY(${subtextY}px)`,
            margin: 0,
            fontSize: 26,
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          {subtext}
        </p>
      )}

      {websiteUrl && (
        <p
          style={{
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
            margin: 0,
            fontSize: 28,
            fontWeight: 600,
            color: primaryColor,
            letterSpacing: '0.02em',
          }}
        >
          {websiteUrl.replace(/^https?:\/\//, '')}
        </p>
      )}
    </div>
  );
};
