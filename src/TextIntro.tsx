import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring } from 'remotion';
import { useFadeIn, useResponsiveLayout } from './remotion/animations';

const DARK = '#08080C';
const GOLD = '#D4A853';
const CREAM = '#F0E6D3';

const words = ['Build.', 'Animate.', 'Create.'];

const Word: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const startFrame = index * 18;
  const opacity = useFadeIn({ from: startFrame, duration: 16 });
  const y = interpolate(frame, [startFrame, startFrame + 16], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <span
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 'clamp(36px, 7vw, 88px)',
        fontWeight: 700,
        color: CREAM,
        letterSpacing: '-0.02em',
        textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
};

const TextIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useResponsiveLayout();

  const globalScale = spring({
    fps: 30,
    frame: frame - 10,
    config: { damping: 18, stiffness: 100 },
    durationInFrames: 40,
  });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${layout.paddingX}px`,
        transform: `scale(${0.92 + globalScale * 0.08})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, ${GOLD}15 0%, transparent 55%)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(12px, 2vw, 24px)',
          maxWidth: Math.min(800, layout.maxTextWidth),
        }}
      >
        {words.map((word, i) => (
          <Word key={i} text={word} index={i} />
        ))}
      </div>

      <div
        style={{
          width: Math.round(80 * layout.fontScale),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          marginTop: 'clamp(16px, 3vh, 32px)',
          opacity: useFadeIn({ from: 60, duration: 14 }),
        }}
      />
    </AbsoluteFill>
  );
};

export default TextIntro;
