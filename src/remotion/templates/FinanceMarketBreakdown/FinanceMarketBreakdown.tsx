import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { CameraMovement, CameraStop } from '../../animations/CameraMovement';
import { KineticTypography } from '../../components/KineticTypography';
import { AnimatedStockChart } from '../../animations/AnimatedStockChart';
import { NumberCounter } from '../../animations/NumberCounter';
import { PercentageAnimation } from '../../animations/PercentageAnimation';
import { Timeline } from '../../animations/Timeline';
import { LowerThird } from './components/LowerThird';
import { MarketCard } from './components/MarketCard';
import { Ticker } from './components/Ticker';
import { CompanyComparison } from './components/CompanyComparison';
import { PriceMovement } from './components/PriceMovement';
import { ChartToChartTransition } from './components/ChartToChartTransition';
import {
  financeMarketBreakdownDefaultContent,
  type CompanyData,
  type MarketData,
  type TickerItem,
  type FinanceMarketBreakdownDefaultContent,
} from './defaults';
import { financeMarketBreakdownScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const INDIGO = '#6366F1';
const PURPLE = '#A855F7';
const GREEN = '#10B981';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1: Hook / Headline Reveal (0 - 6s)
// ─────────────────────────────────────────────────────────────────────────────

const HookScene: React.FC<{ headline: string; subheadline: string }> = ({
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
          fontSize: 'clamp(40px, 6vw, 96px)',
          fontWeight: 800,
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.1,
          color: '#ffffff',
          textShadow: '0 4px 30px rgba(0,0,0,0.6)',
        }}
      />

      <LowerThird
        headline={subheadline}
        delay={40}
        accentColor={INDIGO}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2: Stock Chart (6s - 12s)
// ─────────────────────────────────────────────────────────────────────────────

const ChartScene: React.FC<{ chartData: { frame: number; value: number }[] }> = ({
  chartData,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const currentPrice = chartData[chartData.length - 1]?.value ?? 0;
  const startPrice = chartData[0]?.value ?? 0;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 100 }}>
        <KineticTypography
          text="S&P 500 Performance"
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

      <div style={{ position: 'absolute', left: 80, top: 220 }}>
        <AnimatedStockChart
          data={chartData}
          width={1000}
          height={450}
          delay={15}
          lineColor={INDIGO}
        />
      </div>

      <div style={{ position: 'absolute', right: 120, top: 240 }}>
        <PriceMovement
          fromPrice={startPrice}
          toPrice={currentPrice}
          delay={30}
          size={56}
        />
      </div>

      <div style={{ position: 'absolute', right: 120, top: 340 }}>
        <NumberCounter
          value={currentPrice}
          delay={40}
          color={GREEN}
          size={36}
          prefix="$"
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3: Company Comparison (12s - 18s)
// ─────────────────────────────────────────────────────────────────────────────

const ComparisonScene: React.FC<{ companies: CompanyData[]; chartData: { frame: number; value: number }[] }> = ({
  companies,
  chartData,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const [left, right] = companies;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 100 }}>
        <KineticTypography
          text="Tech Giants Face Off"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: PURPLE,
          }}
        />
      </div>

      <ChartToChartTransition enterFrame={20} duration={30}>
        <div style={{ position: 'absolute', left: 80, top: 220 }}>
          <AnimatedStockChart
            data={chartData}
            width={1000}
            height={350}
            delay={25}
            lineColor={PURPLE}
          />
        </div>
      </ChartToChartTransition>

      <CompanyComparison left={left} right={right} delay={60} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4: Market Overview (18s - 24s)
// ─────────────────────────────────────────────────────────────────────────────

const MarketScene: React.FC<{ cards: MarketData[]; tickerItems: TickerItem[] }> = ({
  cards,
  tickerItems,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 80 }}>
        <KineticTypography
          text="Market Overview"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: '#14B8A6',
          }}
        />
      </div>

      <div style={{ position: 'absolute', left: 80, top: 180, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {cards.map((card, i) => (
          <MarketCard
            key={card.symbol}
            data={card}
            delay={15 + i * 10}
            accentColor={i % 2 === 0 ? INDIGO : PURPLE}
          />
        ))}
      </div>

      <Ticker items={tickerItems} delay={60} speed={80} height={52} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5: Timeline Outro (24s - 30s)
// ─────────────────────────────────────────────────────────────────────────────

const TimelineScene: React.FC<{ steps: readonly { label: string; color: string }[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const activeIndex = Math.min(
    steps.length - 1,
    Math.floor((frame / 30) * steps.length)
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${PURPLE}18 0%, transparent 55%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <KineticTypography
        text="Closing Bell"
        enterFrame={0}
        stagger={3}
        tokenDuration={20}
        variant="pop"
        style={{
          fontSize: 'clamp(32px, 5vw, 72px)',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: 48,
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <NumberCounter value={4820} delay={40} color={GREEN} size={52} prefix="$" />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
            S&P 500 Close
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <PercentageAnimation value={2.4} delay={60} color={INDIGO} size={52} suffix="%" />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
            Daily Gain
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <NumberCounter value={4.2} delay={80} color={PURPLE} size={52} suffix="T" />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
            Total Volume
          </div>
        </div>
      </div>

      <Timeline steps={steps} delay={20} activeIndex={activeIndex} width={900} />

      <LowerThird
        headline="Markets rally on strong earnings"
        subheadline="Tech and healthcare lead S&P 500 higher"
        delay={100}
        accentColor={GREEN}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FinanceMarketBreakdown — premium 30-second financial news explainer.
 *
 * Scene breakdown:
 *  1. Hook / Headline Reveal (0 - 6s)
 *  2. Stock Chart (6s - 12s)
 *  3. Company Comparison (12s - 18s)
 *  4. Market Overview (18s - 24s)
 *  5. Timeline Outro (24s - 30s)
 *
 * Reusable components:
 *  - AnimatedStockChart: SVG line chart with draw animation
 *  - NumberCounter: spring-driven animated number counter
 *  - PercentageAnimation: animated percentage stat
 *  - PriceMovement: animated price change indicator
 *  - MarketCard: premium glassmorphic market data card
 *  - Ticker: scrolling stock ticker
 *  - CompanyComparison: side-by-side company comparison
 *  - ChartToChartTransition: wipe transition between charts
 *  - LowerThird: editorial lower third banner
 *  - CameraMovement: cinematic dolly/pan
 *
 * Uses frame-based interpolation and spring physics for editorial pacing.
 * Visual language: dark premium palette, high-contrast typography.
 */
export const FinanceMarketBreakdown: React.FC<VideoContentProps> = (props) => {
  const content = props as unknown as FinanceMarketBreakdownDefaultContent;

  const scenes = scaleScenesToDuration(financeMarketBreakdownScenes, 900);

  const cameraStops: CameraStop[] = [
    { frame: 0, x: 960, y: 540, scale: 1 },
    { frame: 180, x: 960, y: 540, scale: 1.05 },
    { frame: 360, x: 960, y: 540, scale: 1.1 },
    { frame: 540, x: 960, y: 540, scale: 1.05 },
    { frame: 720, x: 960, y: 540, scale: 1 },
  ];

  const defaultContent = financeMarketBreakdownDefaultContent;

  const renderScene = (sceneId: string) => {
    const c = {
      ...defaultContent,
      ...content,
    };

    switch (sceneId) {
      case 'scene-hook':
        return (
          <HookScene headline={c.headline} subheadline={c.subheadline} />
        );
      case 'scene-chart':
        return <ChartScene chartData={c.chartData} />;
      case 'scene-comparison':
        return (
          <ComparisonScene companies={c.companies} chartData={c.comparisonChartData} />
        );
      case 'scene-market':
        return (
          <MarketScene cards={c.marketCards} tickerItems={c.tickerItems} />
        );
      case 'scene-timeline':
        return <TimelineScene steps={c.timelineSteps} />;
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
    </AbsoluteFill>
  );
};
