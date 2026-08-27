import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import type { VideoScene } from '@/types';
import { scaleScenesToDuration } from '@/remotion/utils/scenes';
import { CameraMovement, CameraStop } from '../../animations/CameraMovement';
import { KineticTypography } from '../../components/KineticTypography';
import { TypingEffect } from '../../animations/TypingEffect';
import { UIPanel } from '../../animations/UIPanel';
import { AnimatedNode } from '../../animations/AnimatedNode';
import { ConnectingLine } from '../../animations/ConnectingLine';
import { DataFlowAnimation, FlowNode } from '../../animations/DataFlowAnimation';
import { RevenueCard } from './components/RevenueCard';
import { Timeline, TimelineStep } from '../../animations/Timeline';
import { PercentageAnimation } from '../../animations/PercentageAnimation';
import { AnimatedArrow } from '../../animations/AnimatedArrow';
import {
  techBusinessExplainerDefaultContent,
  type RevenueStream,
  type TechBusinessExplainerDefaultContent,
} from './defaults';
import { techBusinessExplainerScenes } from './scenes';

// ─────────────────────────────────────────────────────────────────────────────
// Styling constants
// ─────────────────────────────────────────────────────────────────────────────

const DARK = '#08080C';
const INDIGO = '#6366F1';
const PURPLE = '#A855F7';
const PINK = '#EC4899';
const TEAL = '#14B8A6';

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1: Hook / Title (0 - 6s)
// ─────────────────────────────────────────────────────────────────────────────

const HookScene: React.FC<{ headline: string; subheadline: string }> = ({
  headline,
  subheadline,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
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
          width: Math.min(900, width * 0.6),
          height: Math.min(900, height * 0.6),
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

      <KineticTypography
        text={subheadline}
        enterFrame={60}
        stagger={3}
        tokenDuration={20}
        variant="blur"
        style={{
          fontSize: 'clamp(14px, 1.4vw, 22px)',
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '70%',
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.02em',
        }}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2: Data Collection (6s - 12s)
// ─────────────────────────────────────────────────────────────────────────────

const DataScene: React.FC<{ nodes: FlowNode[]; connections: { from: string; to: string }[] }> = ({
  nodes,
  connections,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 120 }}>
        <KineticTypography
          text="Step 1: Data Collection"
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

      <DataFlowAnimation
        nodes={nodes}
        connections={connections}
        delay={20}
        particleColor="rgba(99, 102, 241, 0.9)"
        width={width}
        height={height}
      />

      <div style={{ position: 'absolute', left: 80, bottom: 120 }}>
        <TypingEffect
          text="// Every query, click, and interaction becomes training signal"
          delay={40}
          charsPerSecond={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3: Training & API (12s - 18s)
// ─────────────────────────────────────────────────────────────────────────────

const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const startY = height * 0.32;
  const codeTop = height * 0.65;
  const arrowY = height * 0.42;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 120 }}>
        <KineticTypography
          text="Step 2: Training & Inference"
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

      <div style={{ position: 'absolute', left: width * 0.18, top: startY }}>
        <AnimatedNode
          title="Foundation Model"
          iconName="Brain"
          delay={20}
          color="#A855F7"
        />
      </div>

      <ConnectingLine startX={width * 0.32} startY={arrowY} endX={width * 0.44} endY={arrowY} delay={50} />
      <ConnectingLine startX={width * 0.44} startY={arrowY} endX={width * 0.56} endY={arrowY} delay={80} />

      <div style={{ position: 'absolute', left: width * 0.44, top: startY }}>
        <AnimatedNode
          title="Fine-Tune"
          iconName="Settings"
          delay={60}
          color="#EC4899"
        />
      </div>

      <div style={{ position: 'absolute', left: width * 0.56, top: startY }}>
        <AnimatedNode
          title="API Endpoint"
          iconName="Network"
          delay={90}
          color="#14B8A6"
        />
      </div>

      <div style={{ position: 'absolute', left: width * 0.22, top: codeTop, width: Math.min(1100, width * 0.55) }}>
        <UIPanel title="inference.py" delay={70}>
          <TypingEffect
            text="response = client.chat.completions.create(\n    model='gpt-5',\n    messages=[{'role':'user','content':prompt}]\n)"
            delay={80}
            charsPerSecond={18}
          />
        </UIPanel>
      </div>

      <div style={{ position: 'absolute', right: 80, top: 200 }}>
        <PercentageAnimation
          value={92}
          delay={60}
          color={TEAL}
          size={64}
        />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
          Uptime SLA
        </div>
      </div>

      <AnimatedArrow
        startX={width * 0.72}
        startY={arrowY}
        endX={width * 0.85}
        endY={arrowY - 80}
        delay={110}
        color={TEAL}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4: Revenue Streams (18s - 24s)
// ─────────────────────────────────────────────────────────────────────────────

const RevenueScene: React.FC<{ streams: RevenueStream[] }> = ({ streams }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const baseDelay = 15;
  const cardYStart = 160;
  const cardYGap = 280;

  return (
    <AbsoluteFill style={{ opacity, background: DARK }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div style={{ position: 'absolute', left: 80, top: 60 }}>
        <KineticTypography
          text="Step 3: Revenue Streams"
          enterFrame={0}
          stagger={3}
          tokenDuration={18}
          variant="rise"
          style={{
            fontSize: 'clamp(20px, 2vw, 32px)',
            fontWeight: 700,
            color: PINK,
          }}
        />
      </div>

      {streams.map((stream, i) => {
        const cardX = i % 2 === 0 ? 80 : width * 0.52;
        const cardY = cardYStart + Math.floor(i / 2) * cardYGap;
        const arrowTargetX = i % 2 === 0 ? width * 0.42 : width * 0.88;
        const arrowTargetY = cardY + 140;

        return (
          <RevenueCard
            key={stream.id}
            stream={{
              ...stream,
              description: stream.description,
            }}
            index={i}
            baseDelay={baseDelay + i * 12}
            showArrow={i < streams.length - 1}
            arrowTargetX={arrowTargetX}
            arrowTargetY={arrowTargetY}
            cardX={cardX}
            cardY={cardY}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5: Timeline Outro (24s - 30s)
// ─────────────────────────────────────────────────────────────────────────────

const TimelineScene: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const activeIndex = Math.min(
    steps.length - 1,
    Math.floor((frame / 30) * steps.length)
  );

  const timelineWidth = Math.min(900, width * 0.7);

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
          width: Math.min(1000, width * 0.6),
          height: Math.min(600, height * 0.5),
          borderRadius: '50%',
          background: `radial-gradient(circle, ${PURPLE}18 0%, transparent 55%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <KineticTypography
        text="The AI Money Loop"
        enterFrame={0}
        stagger={3}
        tokenDuration={20}
        variant="pop"
        style={{
          fontSize: 'clamp(28px, 4vw, 56px)',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />

      <Timeline steps={steps} delay={20} activeIndex={activeIndex} width={timelineWidth} />

      <div
        style={{
          display: 'flex',
          gap: 48,
          marginTop: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <PercentageAnimation value={84} delay={60} color={INDIGO} size={52} />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
            of Fortune 500 adopting AI
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <PercentageAnimation value={196} delay={80} color={PURPLE} size={52} suffix="B" />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
            Global AI market by 2027
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────────────────────

export const TechBusinessExplainer: React.FC<VideoContentProps> = (props) => {
  const { width, height } = useVideoConfig();
  const content = props as unknown as TechBusinessExplainerDefaultContent;

  const scenes = scaleScenesToDuration(techBusinessExplainerScenes, 900);

  const cameraStops: CameraStop[] = [
    { frame: 0, x: width * 0.5, y: height * 0.5, scale: 1 },
    { frame: 180, x: width * 0.35, y: height * 0.5, scale: 1.05 },
    { frame: 360, x: width * 0.5, y: height * 0.5, scale: 1.08 },
    { frame: 540, x: width * 0.65, y: height * 0.5, scale: 1.05 },
    { frame: 720, x: width * 0.5, y: height * 0.5, scale: 1 },
  ];

  const defaultContent = techBusinessExplainerDefaultContent;

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
      case 'scene-data':
        return (
          <DataScene
            nodes={c.flowNodes}
            connections={c.flowConnections}
          />
        );
      case 'scene-training':
        return <TrainingScene />;
      case 'scene-revenue':
        return <RevenueScene streams={c.revenueStreams} />;
      case 'scene-timeline':
        return <TimelineScene steps={c.timelineSteps} />;
      default:
        return null;
    }
  };

  const renderTransition = (scene: VideoScene) => {
    if (!scene.transition) return null;
    const enterFrame = scene.durationInFrames - scene.transition.durationInFrames;
    switch (scene.transition.type) {
      case 'fade':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              opacity: interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
              pointerEvents: 'none',
              zIndex: 40,
            }}
          />
        );
      case 'slide':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, ${INDIGO}15 40%, ${INDIGO}40 50%, ${INDIGO}15 60%, transparent 100%)`,
              transform: `translateX(${interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [-100, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
              )}%)`,
              opacity: interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
              pointerEvents: 'none',
              zIndex: 40,
            }}
          />
        );
      case 'zoom':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${INDIGO}18 0%, transparent 70%)`,
              transform: `scale(${interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [1.15, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
              )})`,
              opacity: interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
              pointerEvents: 'none',
              zIndex: 40,
            }}
          />
        );
      case 'wipe':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, ${INDIGO}22 30%, ${INDIGO}55 50%, ${INDIGO}22 70%, transparent 100%)`,
              transform: `translateX(${interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [-60, 110],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
              )}%)`,
              opacity: interpolate(
                useCurrentFrame() - scene.startFrame - enterFrame,
                [0, scene.transition.durationInFrames],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
              pointerEvents: 'none',
              zIndex: 40,
            }}
          />
        );
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: interpolate(
                  useCurrentFrame() - scene.startFrame,
                  [0, 12, scene.durationInFrames - 12, scene.durationInFrames],
                  [0, 1, 1, 0],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            >
              {renderScene(scene.id)}
            </div>
            {renderTransition(scene)}
          </Sequence>
        ))}
      </CameraMovement>
    </AbsoluteFill>
  );
};
