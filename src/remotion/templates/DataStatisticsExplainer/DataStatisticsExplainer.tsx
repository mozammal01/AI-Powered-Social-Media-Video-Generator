import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { VideoContentProps } from '@/remotion/schema';
import { MaskReveal } from '@/remotion/components';
import { AnimatedCard } from '@/remotion/animations';
import { dataStatisticsExplainerDefaultContent } from './defaults';
import { useResponsiveLayout } from '@/remotion/animations';

const FRAMES_PER_SCENE = 60;
const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
const finite = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const text = (value: unknown, fallback: string, max = 100) => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return (trimmed || fallback).slice(0, max);
};
const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0, notation: 'compact' }).format(value);

type ExplainerProps = VideoContentProps & {
  title?: string;
  subtitle?: string;
  statistic?: number;
  percentage?: number;
  chartData?: number[];
  labels?: string[];
  source?: string;
};

function BackgroundGrid({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, -48], { extrapolateRight: 'clamp' });
  return <>
    <AbsoluteFill style={{ background: '#07111F', overflow: 'hidden' }} />
    <div style={{ position: 'absolute', inset: -120, opacity: 0.22, backgroundImage: `linear-gradient(${accent}26 1px, transparent 1px), linear-gradient(90deg, ${accent}26 1px, transparent 1px)`, backgroundSize: '72px 72px', transform: `translate(${drift}px, ${drift * 0.42}px)` }} />
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 78% 18%, ${accent}35, transparent 30%), radial-gradient(circle at 12% 86%, #8B5CF638, transparent 34%), linear-gradient(120deg, #07111F 0%, #0B1930 55%, #07111F 100%)` }} />
  </>;
}

function SafeCounter({ value, suffix, start }: { value: number; suffix: string; start: number }) {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [start, start + 42], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <span>{compact(finite(count))}{suffix}</span>;
}

function LineChart({ data, labels, accent }: { data: number[]; labels: string[]; accent: string }) {
  const frame = useCurrentFrame();
  const safeData = data.length >= 2 ? data : [0, 0];
  const chart = { x: 146, y: 78, width: 1240, height: 414 };
  const values = safeData.map((item) => finite(item));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max(Math.abs(max - min) * 0.15, Math.abs(max) * 0.08, 1);
  const lower = min - padding;
  const upper = max + padding;
  const range = Math.max(upper - lower, 1);
  const points = values.map((value, index) => ({
    x: chart.x + (index / Math.max(values.length - 1, 1)) * chart.width,
    y: chart.y + chart.height - ((value - lower) / range) * chart.height,
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const pathLength = points.slice(1).reduce((sum, point, index) => sum + Math.hypot(point.x - points[index].x, point.y - points[index].y), 0);
  const progress = interpolate(frame, [8, 51], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const visibleLabels = Math.min(labels.length, 7);
  const labelStep = Math.max(1, Math.ceil(labels.length / Math.max(visibleLabels, 1)));

  return <svg width="1532" height="560" viewBox="0 0 1532 560" aria-label="Animated line chart">
    {[0, 1, 2, 3, 4].map((index) => {
      const y = chart.y + (chart.height / 4) * index;
      return <g key={index}>
        <line x1={chart.x} y1={y} x2={chart.x + chart.width} y2={y} stroke="rgba(191,219,254,0.16)" strokeWidth="1" />
        <text x={chart.x - 22} y={y + 5} textAnchor="end" fill="rgba(226,232,240,0.65)" fontSize="18" fontFamily={FONT}>{compact(upper - ((upper - lower) * index) / 4)}</text>
      </g>;
    })}
    <path d={`${path} L ${points[points.length - 1].x} ${chart.y + chart.height} L ${points[0].x} ${chart.y + chart.height} Z`} fill={`${accent}18`} opacity={progress} />
    <path d={path} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pathLength} strokeDashoffset={pathLength * (1 - progress)} />
    {points.map((point, index) => {
      const pointProgress = spring({ fps: 30, frame: frame - 22 - index * 4, config: { damping: 14, stiffness: 160 } });
      const label = labels[index];
      const showLabel = Boolean(label) && (index % labelStep === 0 || index === points.length - 1);
      return <g key={`${point.x}-${index}`} opacity={interpolate(pointProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' })}>
        <circle cx={point.x} cy={point.y} r={7 * Math.max(0, pointProgress)} fill="#F8FAFC" stroke={accent} strokeWidth="5" />
        {showLabel && <text x={point.x} y="540" textAnchor="middle" fill="rgba(226,232,240,0.72)" fontSize="17" fontWeight="600" fontFamily={FONT}>{text(label, '', 12)}</text>}
      </g>;
    })}
  </svg>;
}

export const DataStatisticsExplainer: React.FC<ExplainerProps> = (rawProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = useResponsiveLayout();
  const props = { ...dataStatisticsExplainerDefaultContent, ...rawProps };
  const accent = text(props.brand?.primaryColor, '#38BDF8', 16);
  const title = text(props.title ?? props.headline, dataStatisticsExplainerDefaultContent.title, 62);
  const subtitle = text(props.subtitle ?? props.bodyText, dataStatisticsExplainerDefaultContent.subtitle, 105);
  const statistic = finite(props.statistic, dataStatisticsExplainerDefaultContent.statistic);
  const percentage = finite(props.percentage, dataStatisticsExplainerDefaultContent.percentage);
  const chartData = Array.isArray(props.chartData) ? props.chartData.filter((value) => typeof value === 'number' && Number.isFinite(value)).slice(0, 12) : [];
  const labels = Array.isArray(props.labels) ? props.labels.map((label) => text(label, '', 12)).slice(0, chartData.length) : [];
  const source = text(props.source, 'Source: Internal analysis', 90);
  const cta = text(props.cta?.text, 'Explore the full report', 40);
  const cameraScale = interpolate(frame, [0, 300], [1, 1.025], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const titleIn = spring({ fps, frame: frame - 8, config: { damping: 16, stiffness: 100 } });
  const scene = Math.min(4, Math.floor(frame / FRAMES_PER_SCENE));
  const sceneOpacity = interpolate(frame % FRAMES_PER_SCENE, [0, 12, 48, 60], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chartPeak = chartData.length ? Math.max(...chartData) : statistic;
  const chartAverage = chartData.length ? chartData.reduce((sum, value) => sum + value, 0) / chartData.length : percentage;
  const cards = [
    { title: 'Peak', value: compact(chartPeak), description: 'Highest recorded value', icon: '↗' },
    { title: 'Average', value: compact(chartAverage), description: 'Across the measured period', icon: '◌' },
    { title: 'Change', value: `${percentage >= 0 ? '+' : ''}${compact(percentage)}%`, description: 'Compared with prior period', icon: '△' },
  ];

  const padX = layout.paddingX;
  const padY = layout.paddingY;
  const maxText = layout.maxTextWidth;
  const fontScale = layout.fontScale;

  return <AbsoluteFill style={{ fontFamily: FONT, color: '#F8FAFC', overflow: 'hidden' }}>
    <BackgroundGrid accent={accent} />
    <AbsoluteFill style={{ transform: `scale(${cameraScale})`, transformOrigin: 'center center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      {scene === 0 && <div style={{ position: 'absolute', inset: 0, padding: `${padY}px ${padX}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: accent, fontSize: Math.round(22 * fontScale), fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: Math.round(26 * fontScale) }}>Data brief</div>
        <MaskReveal direction="right" enterFrame={6} duration={26}><h1 style={{ margin: 0, maxWidth: Math.min(1350, maxText), fontSize: Math.round(92 * fontScale), lineHeight: 1.02, letterSpacing: '-0.055em', transform: `translateY(${(1 - titleIn) * 38}px)`, overflowWrap: 'anywhere' }}>{title}</h1></MaskReveal>
        <p style={{ maxWidth: Math.min(1060, maxText), fontSize: Math.round(31 * fontScale), lineHeight: 1.35, color: 'rgba(226,232,240,0.8)', margin: `${Math.round(30 * fontScale)}px 0 0` }}>{subtitle}</p>
      </div>}
      {scene === 1 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: Math.round(18 * fontScale) }}>
        <div style={{ color: 'rgba(226,232,240,0.65)', fontSize: Math.round(25 * fontScale), fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Headline statistic</div>
        <div style={{ fontSize: Math.round(224 * fontScale), lineHeight: 0.96, fontWeight: 850, letterSpacing: '-0.08em', color: accent, textShadow: `0 0 80px ${accent}55` }}><SafeCounter value={statistic} suffix="" start={5} /></div>
        <div style={{ fontSize: Math.round(42 * fontScale), fontWeight: 700, opacity: interpolate(frame % 60, [9, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}><span style={{ color: percentage >= 0 ? '#34D399' : '#FB7185' }}>{percentage >= 0 ? '+' : ''}<SafeCounter value={percentage} suffix="%" start={10} /></span> versus the prior period</div>
      </div>}
      {scene === 2 && <div style={{ position: 'absolute', inset: 0, padding: `${Math.round(98 * fontScale)}px ${Math.round(190 * fontScale)}px ${Math.round(50 * fontScale)}px`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Math.round(12 * fontScale) }}><div style={{ fontSize: Math.round(42 * fontScale), fontWeight: 800, letterSpacing: '-0.035em' }}>Momentum over time</div><div style={{ fontSize: Math.round(20 * fontScale), color: 'rgba(226,232,240,0.6)' }}>Progressive trend</div></div>
        <LineChart data={chartData} labels={labels} accent={accent} />
      </div>}
      {scene === 3 && <div style={{ position: 'absolute', inset: 0, padding: `${Math.round(160 * fontScale)}px ${Math.round(160 * fontScale)}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: Math.round(31 * fontScale), fontWeight: 800, color: accent, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: Math.round(26 * fontScale) }}>What the data says</div>
        <div style={{ display: 'flex', gap: Math.round(28 * fontScale), width: '100%', justifyContent: 'center' }}>{cards.map((card, index) => <AnimatedCard key={card.title} title={card.title} value={card.value} description={card.description} icon={<span style={{ fontSize: Math.round(28 * fontScale) }}>{card.icon}</span>} delay={5 + index * 12} accentColor={index === 2 ? '#A78BFA' : accent} style={{ flex: 1, minWidth: 0, maxWidth: Math.min(500, maxText), height: Math.round(250 * fontScale) }} />)}</div>
      </div>}
      {scene === 4 && <div style={{ position: 'absolute', inset: 0, padding: `${Math.round(150 * fontScale)}px ${Math.round(190 * fontScale)}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ color: accent, fontSize: Math.round(22 * fontScale), fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: Math.round(20 * fontScale) }}>The key insight</div>
        <MaskReveal direction="up" enterFrame={4} duration={22}><div style={{ maxWidth: Math.min(1350, maxText), fontSize: Math.round(70 * fontScale), fontWeight: 850, letterSpacing: '-0.045em', lineHeight: 1.08 }}>The trend is clear: <span style={{ color: accent }}>{compact(statistic)}</span> is the signal worth acting on.</div></MaskReveal>
        <div style={{ marginTop: Math.round(42 * fontScale), display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: Math.round(19 * fontScale), color: 'rgba(226,232,240,0.64)', maxWidth: Math.min(620, maxText), overflowWrap: 'anywhere' }}>{source}</div><div style={{ padding: `${Math.round(18 * fontScale)}px ${Math.round(30 * fontScale)}px`, borderRadius: 999, background: accent, color: '#06101E', fontSize: Math.round(21 * fontScale), fontWeight: 850, boxShadow: `0 14px 42px ${accent}55`, maxWidth: Math.min(460, maxText), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cta}</div></div>
      </div>}
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.7, background: 'linear-gradient(90deg, rgba(7,17,31,0.35), transparent 20%, transparent 80%, rgba(7,17,31,0.35))' }} />
  </AbsoluteFill>;
};
