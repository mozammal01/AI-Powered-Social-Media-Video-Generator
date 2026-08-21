import { useStaggerFadeIn, useStaggerPopIn, useStaggerSlideUp } from '../animations';

export interface FeatureListProps {
  features: string[];
  primaryColor?: string;
  accentColor?: string;
  /** Local frame at which the first feature animates in. */
  enterFrame?: number;
  staggerFrames?: number;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  primaryColor = '#6366F1',
  accentColor = '#A855F7',
  enterFrame = 5,
  staggerFrames = 10,
}) => {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: '0 56px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        width: '100%',
      }}
    >
      {features.map((feature, index) => (
        <FeatureItem
          key={`${index}-${feature}`}
          feature={feature}
          index={index}
          enterFrame={enterFrame}
          staggerFrames={staggerFrames}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      ))}
    </ul>
  );
};

interface FeatureItemProps {
  feature: string;
  index: number;
  enterFrame: number;
  staggerFrames: number;
  primaryColor: string;
  accentColor: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  index,
  enterFrame,
  staggerFrames,
  primaryColor,
  accentColor,
}) => {
  const opacity = useStaggerFadeIn(enterFrame, index, staggerFrames, 16);
  const translateY = useStaggerSlideUp(enterFrame, index, staggerFrames, 16, 36);
  const scale = useStaggerPopIn(enterFrame, index, staggerFrames, 16, 110);

  return (
    <li
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 800,
          color: '#ffffff',
        }}
      >
        {index + 1}
      </span>
      <span
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: '#ffffff',
          lineHeight: 1.3,
        }}
      >
        {feature}
      </span>
    </li>
  );
};
