import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { KineticTypography, MapZoom, MaskReveal, ParallaxLayers, SplitImageReveal } from '@/remotion/components';
import { RouteLine } from '@/remotion/animations';
import { LowerThird } from '@/remotion/animations/LowerThird';
import { breakingNewsIntroDefaultContent } from './defaults';

const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
const RED = '#C61F2B';
const safeText = (value: unknown, fallback: string, max: number) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallback;
const safeNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, notation: Math.abs(value) >= 1000000 ? 'compact' : 'standard' }).format(value);

type BreakingNewsIntroProps = VideoContentProps & {
  category?: string;
  location?: string;
  date?: string;
  image?: string;
  tickerText?: string;
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, 300], [-20, 20], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ overflow: 'hidden', background: '#07101B' }}>
    <ParallaxLayers
      amplitude={14}
      verticalAmplitude={8}
      periodFrames={180}
      layers={[
        { speed: 0.25, content: <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(203,213,225,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.055) 1px, transparent 1px)', backgroundSize: '64px 64px' }} /> },
        { speed: 0.55, content: <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 16% 22%, rgba(198,31,43,0.22), transparent 31%), radial-gradient(circle at 84% 76%, rgba(30,64,175,0.18), transparent 36%)' }} /> },
      ]}
    />
    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${sweep}px)`, background: 'linear-gradient(110deg, transparent 26%, rgba(255,255,255,0.045) 49%, transparent 72%)' }} />
  </AbsoluteFill>;
};

const BreakingBadge: React.FC<{ category: string; compact?: boolean }> = ({ category, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame: frame - 5, config: { damping: 15, stiffness: 180 } });
  return <div style={{ display: 'inline-flex', alignItems: 'center', gap: compact ? 10 : 14, transform: `scale(${scale})`, transformOrigin: 'left center' }}>
    <span style={{ padding: compact ? '8px 12px' : '11px 17px', background: RED, color: '#fff', fontSize: compact ? 15 : 20, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Breaking</span>
    <span style={{ color: 'rgba(248,250,252,0.82)', fontSize: compact ? 15 : 19, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{category}</span>
  </div>;
};

const LiveIndicator: React.FC<{ date: string }> = ({ date }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + (Math.sin((frame / 30) * Math.PI * 2) + 1) * 0.25;
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(248,250,252,0.74)', whiteSpace: 'nowrap' }}>
    <span style={{ width: 10, height: 10, background: '#EF4444', borderRadius: '50%', opacity: pulse, boxShadow: `0 0 0 ${8 * pulse}px rgba(239,68,68,0.13)` }} /> LIVE · {date}
  </div>;
};

const NewsTicker: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const ticker = `${text}     •     ${text}`;
  const x = -((frame * 2.2) % 1550);
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 62, display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#0A111C', borderTop: '1px solid rgba(255,255,255,0.16)' }}>
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '0 30px', background: RED, color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 1, whiteSpace: 'nowrap' }}>Live update</div>
    <div style={{ transform: `translateX(${x}px)`, paddingLeft: 34, whiteSpace: 'nowrap', color: 'rgba(248,250,252,0.88)', fontSize: 20, fontWeight: 600 }}>{ticker}</div>
  </div>;
};

export const BreakingNewsIntro: React.FC<BreakingNewsIntroProps> = (props) => {
  const frame = useCurrentFrame();
  const headline = safeText(props.headline, breakingNewsIntroDefaultContent.headline, 92);
  const category = safeText(props.category, 'News', 24);
  const location = safeText(props.location, 'Global Desk', 36);
  const date = safeText(props.date, 'LIVE UPDATE', 30);
  const source = safeText(props.source, 'Source: Newsroom reporting', 70);
  const tickerText = safeText(props.tickerText, 'Live coverage and verified developments from the newsroom', 140);
  const image = typeof props.image === 'string' && props.image.trim() ? props.image : props.product?.imageUrl;
  const statistic = safeNumber(props.statistic);
  const finalScale = interpolate(frame, [240, 300], [1.04, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const transitionOpacity = interpolate(frame, [232, 245], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return <AbsoluteFill style={{ fontFamily: FONT, color: '#F8FAFC', overflow: 'hidden' }}>
    <Background />

    <Sequence durationInFrames={45}>
      <AbsoluteFill style={{ padding: '105px 130px', justifyContent: 'space-between' }}>
        <div style={{ width: interpolate(frame, [0, 18], [0, 100], { extrapolateRight: 'clamp' }), height: 5, background: RED }} />
        <div><BreakingBadge category={category} /><div style={{ marginTop: 34, fontSize: 54, fontWeight: 850, letterSpacing: '-0.045em' }}>A verified update is developing.</div></div>
        <LiveIndicator date={date} />
      </AbsoluteFill>
    </Sequence>

    <Sequence from={45} durationInFrames={75}>
      <AbsoluteFill style={{ padding: '92px 130px 90px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 68, alignItems: 'center' }}>
        <div style={{ minWidth: 0 }}><BreakingBadge category={category} compact /><MaskReveal direction="up" enterFrame={7} duration={24}><KineticTypography text={headline} enterFrame={9} stagger={2} tokenDuration={22} variant="rise" style={{ marginTop: 26, fontSize: 60, lineHeight: 1.06, fontWeight: 850, letterSpacing: '-0.045em', overflowWrap: 'anywhere' }} /></MaskReveal><div style={{ marginTop: 24, color: 'rgba(226,232,240,0.7)', fontSize: 17, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{source}</div></div>
        <div style={{ height: 500, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 24px 58px rgba(0,0,0,0.3)' }}><div style={{ width: '100%', height: '100%', transform: `scale(${interpolate(frame - 45, [0, 75], [1.1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}><SplitImageReveal src={image} alt={headline} direction="horizontal" enterFrame={8} duration={26} accentColor={RED} borderRadius={0} style={{ width: '100%', height: '100%' }} /></div></div>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={120} durationInFrames={60}>
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'stretch' }}>
        <MapZoom target={{ x: 0.61, y: 0.41 }} zoom={1.22} enterFrame={0} duration={44} coordinates={location.toUpperCase()} color="#E5E7EB" landColor="#1E293B" seaColor="#0B1624"><RouteLine points={[{ x: 290, y: 590 }, { x: 620, y: 400 }, { x: 1050, y: 510 }, { x: 1370, y: 315 }]} delay={12} drawDuration={32} color={RED} width={4} /></MapZoom>
        <div style={{ position: 'absolute', right: 120, top: 210, width: 610 }}><div style={{ fontSize: 17, color: RED, fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>Location update</div><MaskReveal direction="right" enterFrame={6} duration={20}><div style={{ fontSize: 58, fontWeight: 850, lineHeight: 1.05, letterSpacing: '-0.045em', overflowWrap: 'anywhere' }}>{location}</div></MaskReveal><p style={{ margin: '25px 0 0', maxWidth: 500, color: 'rgba(226,232,240,0.78)', fontSize: 22, lineHeight: 1.35 }}>Incoming reports are being verified by the live desk.</p></div>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={180} durationInFrames={60}>
      <AbsoluteFill style={{ padding: '128px 130px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: RED, fontSize: 18, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}><span style={{ width: 38, height: 3, background: RED }} /> At a glance</div>
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'stretch', gap: 30 }}>
          {statistic !== undefined && <div style={{ minWidth: 440, padding: '34px 42px', background: 'rgba(255,255,255,0.06)', borderLeft: `7px solid ${RED}` }}><div style={{ fontSize: 84, lineHeight: 0.95, fontWeight: 900, letterSpacing: '-0.06em' }}>{formatNumber(interpolate(frame - 180, [7, 44], [0, statistic], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }))}</div><div style={{ marginTop: 16, color: 'rgba(226,232,240,0.72)', fontSize: 19, fontWeight: 700 }}>people affected by the update</div></div>}
          <div style={{ flex: 1, padding: '34px 42px', background: 'rgba(2,6,23,0.58)', border: '1px solid rgba(255,255,255,0.14)' }}><div style={{ color: 'rgba(226,232,240,0.56)', fontSize: 16, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Reporting status</div><div style={{ marginTop: 20, fontSize: 31, lineHeight: 1.22, fontWeight: 780 }}>Verified details are arriving from official sources and field teams.</div></div>
        </div>
        <LowerThird headline={location.slice(0, 26)} subheadline={source.slice(0, 48)} delay={22} />
      </AbsoluteFill>
    </Sequence>

    <Sequence from={240} durationInFrames={60}>
      <AbsoluteFill style={{ transform: `scale(${finalScale})`, transformOrigin: 'center center' }}>
        <div style={{ position: 'absolute', inset: '84px 130px 105px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 70, alignItems: 'center' }}><div><BreakingBadge category={category} compact /><KineticTypography text={headline} enterFrame={4} stagger={1} tokenDuration={18} variant="rise" style={{ marginTop: 20, fontSize: 53, lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.045em', overflowWrap: 'anywhere' }} /><div style={{ marginTop: 24 }}><LiveIndicator date={date} /></div></div><div style={{ height: 350, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)' }}><div style={{ width: '100%', height: '100%', transform: 'scale(1.06)' }}><SplitImageReveal src={image} alt={headline} direction="vertical" enterFrame={5} duration={22} accentColor={RED} borderRadius={0} style={{ width: '100%', height: '100%' }} /></div></div></div>
        <NewsTicker text={tickerText} />
      </AbsoluteFill>
    </Sequence>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: transitionOpacity, background: 'linear-gradient(90deg, transparent 0%, rgba(198,31,43,0.18) 50%, transparent 100%)' }} />
  </AbsoluteFill>;
};
