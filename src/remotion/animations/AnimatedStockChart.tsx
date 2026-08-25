import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export interface StockPoint {
  frame: number;
  value: number;
}

export interface AnimatedStockChartProps {
  data: StockPoint[];
  width?: number;
  height?: number;
  delay?: number;
  lineColor?: string;
  fillColor?: string;
  gridColor?: string;
  showArea?: boolean;
  strokeWidth?: number;
}

export const AnimatedStockChart: React.FC<AnimatedStockChartProps> = ({
  data,
  width = 800,
  height = 400,
  delay = 0,
  lineColor = '#6366F1',
  fillColor = 'rgba(99, 102, 241, 0.1)',
  gridColor = 'rgba(255, 255, 255, 0.06)',
  showArea = true,
  strokeWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minVal) / range) * chartHeight,
  }));

  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const areaD = `${pathD} L${points[points.length - 1].x},${padding.top + chartHeight} L${points[0].x},${padding.top + chartHeight} Z`;

  const drawDuration = fps * 1.2;
  const progress = interpolate(frame - delay, [0, drawDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const pathLength = points.reduce((acc, _, i) => {
    if (i === 0) return 0;
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  const dashOffset = pathLength * (1 - progress);

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={padding.left}
        y1={y}
        x2={width - padding.right}
        y2={y}
        stroke={gridColor}
        strokeWidth="1"
      />
    );
    const val = maxVal - (range / 4) * i;
    gridLines.push(
      <text
        key={`label-${i}`}
        x={padding.left - 10}
        y={y + 4}
        fill="rgba(255,255,255,0.4)"
        fontSize="12"
        fontFamily="Inter, sans-serif"
        textAnchor="end"
      >
        {val.toFixed(2)}
      </text>
    );
  }

  const lastPoint = points[points.length - 1];
  const prevPoint = points[points.length - 2] || lastPoint;
  const isUp = lastPoint.y <= prevPoint.y;
  const arrowColor = isUp ? '#10B981' : '#EF4444';

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {gridLines}

      {showArea && (
        <path
          d={areaD}
          fill={fillColor}
          stroke="none"
          style={{
            opacity: progress,
            clipPath: progress < 1 ? `inset(0 ${100 - progress * 100}% 0 0)` : 'none',
          }}
        />
      )}

      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{ willChange: 'stroke-dashoffset' }}
      />

      {progress > 0.9 && (
        <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill={arrowColor} stroke="#fff" strokeWidth="2">
          <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};
