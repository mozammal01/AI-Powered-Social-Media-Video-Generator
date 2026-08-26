import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { CameraMovement, CameraStop } from '../../animations/CameraMovement';
import { HeadlineReveal } from '../../animations/HeadlineReveal';
import { LowerThird } from '../../animations/LowerThird';
import { LiveBadge } from '../../animations/LiveBadge';
import { NewsTicker } from '../../animations/NewsTicker';
import { BroadcastTimeline } from '../../animations/BroadcastTimeline';
import { ChartAnimation } from '../../animations/ChartAnimation';
import { KineticTypography } from '../../components/KineticTypography';
import { GeopoliticalMap } from './components/GeopoliticalMap';
import { NewsCard } from './components/NewsCard';
import {
  newsGeopoliticalExplainerDefaultContent,
  type NewsGeopoliticalExplainerDefaultContent,
} from './defaults';
import { newsGeopoliticalExplainerScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const RED = '#EF4444';
const INDIGO = '#6366F1';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1: Breaking Headline (0 - 6s)
// ─────────────────────────────────────────────────────────────────────────────

const HeadlineScene: React.FC<{ headline: string; subheadline: string }> = ({
  headline,
  subheadline,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <HeadlineReveal text={headline} delay={10} />
      <LowerThird headline={subheadline} subheadline="Live coverage from the scene" delay={40} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2: Map & Timeline (6s - 12s)
// ─────────────────────────────────────────────────────────────────────────────

const MapScene: React.FC<{
  events: readonly { time: string; headline: string; location: string; coordinates?: { x: number; y: number } }[];
  routes: readonly { from: { x: number; y: number }; to: { x: number; y: number }; label?: string }[];
  highlights: readonly { x: number; y: number; label?: string }[];
}> = ({ events, routes, highlights }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', left: 80, top: 80 }}>
        <KineticTypography
          text="Global Impact Map"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: INDIGO,
          }}
        />
      </div>

      <div style={{ position: 'absolute', left: 80, top: 180, width: 1000, height: 500 }}>
        <GeopoliticalMap
          highlights={highlights}
          routes={routes}
          delay={15}
        />
      </div>

      <div style={{ position: 'absolute', right: 80, top: 200 }}>
        <BroadcastTimeline
          delay={30}
          events={events.map((e) => ({ time: e.time, desc: e.headline }))}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3: Statistics & Charts (12s - 18s)
// ─────────────────────────────────────────────────────────────────────────────

const StatsScene: React.FC<{
  statistics: readonly { value: string; label: string }[];
  chartData: readonly number[];
}> = ({ statistics, chartData }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', left: 80, top: 80 }}>
        <KineticTypography
          text="By The Numbers"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: RED,
          }}
        />
      </div>

      <div style={{ position: 'absolute', left: 80, top: 200, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {statistics.map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '24px 32px',
              minWidth: 180,
              textAlign: 'center',
              opacity: interpolate(frame - 20 - i * 10, [0, 18], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              transform: `translateY(${interpolate(frame - 20 - i * 10, [0, 18], [20, 0], {
                extrapolateRight: 'clamp',
              })}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 80, top: 420, width: 800 }}>
        <ChartAnimation data={[...chartData]} delay={40} color="bg-red-500" />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4: News Cards (18s - 24s)
// ─────────────────────────────────────────────────────────────────────────────

const NewsScene: React.FC<{
  cards: readonly { headline: string; source: string; category: string }[];
}> = ({ cards }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const accentColors = [RED, INDIGO, '#A855F7'];

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div style={{ position: 'absolute', left: 80, top: 80 }}>
        <KineticTypography
          text="Latest Coverage"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: '#ffffff',
          }}
        />
      </div>

      <div style={{ position: 'absolute', left: 80, top: 180, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {cards.map((card, i) => (
          <NewsCard
            key={i}
            headline={card.headline}
            source={`${card.source} · ${card.category}`}
            delay={15 + i * 10}
            accentColor={accentColors[i % accentColors.length]}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5: Summary Outro (24s - 30s)
// ─────────────────────────────────────────────────────────────────────────────

const SummaryScene: React.FC<{ headline: string; body: string }> = ({ headline, body }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${INDIGO}22 0%, transparent 60%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <KineticTypography
        text={headline}
        enterFrame={8}
        stagger={4}
        tokenDuration={28}
        variant="rise"
        style={{
          fontSize: 'clamp(36px, 5.5vw, 84px)',
          fontWeight: 800,
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.1,
          color: '#ffffff',
          textShadow: '0 4px 30px rgba(0,0,0,0.6)',
        }}
      />

      <div
        style={{
          maxWidth: '70%',
          textAlign: 'center',
          fontSize: 'clamp(14px, 1.4vw, 22px)',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
        }}
      >
        {body}
      </div>

      <LowerThird
        headline="Stay Informed"
        subheadline="Live updates throughout the day"
        delay={50}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NewsGeopoliticalExplainer — premium 30-second broadcast news explainer.
 *
 * Scene breakdown:
 *  1. Breaking Headline (0 - 6s)
 *  2. Map & Timeline (6s - 12s)
 *  3. Statistics & Charts (12s - 18s)
 *  4. News Cards (18s - 24s)
 *  5. Summary Outro (24s - 30s)
 *
 * Reusable components:
 *  - HeadlineReveal: breaking headline animation
 *  - LowerThird: editorial lower third banner
 *  - LiveBadge: pulsing LIVE indicator
 *  - NewsTicker: scrolling news ticker
 *  - GeopoliticalMap: world map with country highlights and route lines
 *  - CountryHighlight: pulsing country marker
 *  - RouteLine: animated route between locations
 *  - BroadcastTimeline: vertical event timeline
 *  - ChartAnimation: bar chart animation
 *  - KineticTypography: staggered word animation
 *  - NewsCard: glassmorphic news card
 *  - CameraMovement: cinematic camera movement
 *
 * Uses frame-based interpolation and spring physics for editorial pacing.
 * Visual language: dark broadcast palette, clean motion design.
 */
export const NewsGeopoliticalExplainer: React.FC<VideoContentProps> = (props) => {
  const content = props as unknown as NewsGeopoliticalExplainerDefaultContent;

  const scenes = scaleScenesToDuration(newsGeopoliticalExplainerScenes, 900);

  const cameraStops: CameraStop[] = [
    { frame: 0, x: 960, y: 540, scale: 1 },
    { frame: 180, x: 960, y: 540, scale: 1.05 },
    { frame: 360, x: 960, y: 540, scale: 1.1 },
    { frame: 540, x: 960, y: 540, scale: 1.05 },
    { frame: 720, x: 960, y: 540, scale: 1 },
  ];

  const defaultContent = newsGeopoliticalExplainerDefaultContent;

  const renderScene = (sceneId: string) => {
    const c = {
      ...defaultContent,
      ...content,
    };

    switch (sceneId) {
      case 'scene-headline':
        return (
          <HeadlineScene headline={c.headline} subheadline={c.subheadline} />
        );
      case 'scene-map':
        return (
          <MapScene
            events={c.events}
            routes={c.routes}
            highlights={c.events
              .filter((e) => e.coordinates)
              .map((e) => ({
                x: e.coordinates!.x,
                y: e.coordinates!.y,
                label: e.location,
                color: e.impact === 'high' ? '#EF4444' : '#F59E0B',
              }))}
          />
        );
      case 'scene-stats':
        return <StatsScene statistics={[...c.statistics]} chartData={[...c.chartData]} />;
      case 'scene-news':
        return <NewsScene cards={[...c.newsCards]} />;
      case 'scene-summary':
        return <SummaryScene headline={c.summaryHeadline} body={c.summaryBody} />;
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <CameraMovement stops={cameraStops}>
        {scenes.map((scene) => (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            {renderScene(scene.id)}
          </Sequence>
        ))}
      </CameraMovement>

      {/* Persistent overlays */}
      <LiveBadge />
      <NewsTicker headlines={[...defaultContent.tickerHeadlines]} />
    </AbsoluteFill>
  );
};
