import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MapZoomProps {
  /**
   * Normalized target point (0–1 within the map graphic) the camera
   * pushes into. The target stays pinned near frame center while zooming.
   */
  target?: { x: number; y: number };
  /** Final zoom factor (1 = no zoom). */
  zoom?: number;
  /** Frame at which the push-in starts. */
  enterFrame?: number;
  /** Duration of the push-in in frames. */
  duration?: number;
  /** Show pulsing marker rings + crosshair at the target. */
  showMarker?: boolean;
  /** Coordinate readout text (e.g. "43.85° N — 18.41° E"). */
  coordinates?: string;
  /** Accent color for grid lines, marker, and readout. */
  color?: string;
  /** Landmass fill color. */
  landColor?: string;
  /** Sea / background color. */
  seaColor?: string;
  /** Optional content rendered above the map (labels, titles). */
  children?: React.ReactNode;
}

/**
 * Stylized world landmasses on a 1000×500 equirectangular canvas.
 * Deliberately low-poly — reads as an archival atlas under grain.
 */
const LANDMASSES: string[] = [
  // North America
  'M95,88 L150,68 L215,72 L245,92 L258,118 L246,148 L256,168 L238,200 L218,222 L198,214 L178,232 L162,246 L152,236 L142,212 L116,186 L94,150 L84,116 Z',
  // Greenland
  'M298,52 L332,46 L344,74 L322,92 L300,76 Z',
  // South America
  'M168,258 L198,252 L218,272 L224,304 L208,344 L192,384 L182,412 L172,396 L166,352 L156,310 L154,280 Z',
  // Europe
  'M452,108 L488,94 L522,100 L534,122 L516,138 L494,132 L480,148 L464,142 L450,126 Z',
  // Africa
  'M468,162 L506,154 L538,172 L552,204 L546,244 L526,278 L506,308 L490,332 L478,316 L472,282 L458,242 L454,202 Z',
  // Asia
  'M544,84 L604,64 L684,58 L754,68 L806,90 L824,116 L792,136 L762,130 L742,152 L702,164 L672,152 L652,174 L622,168 L600,142 L570,136 L546,116 Z',
  // Australia
  'M788,302 L832,294 L862,316 L850,346 L814,352 L794,330 Z',
];

/** Overscan factor for the map plane — guarantees no empty edges while drifting/zooming. */
const OVERSCAN = 2.2;

/**
 * MapZoom — cinematic "push into the map" opening: a stylized atlas plane
 * dollies from world view down to a pulsing target marker, complete with
 * graticule grid, radar sweep, and coordinate readout.
 */
export const MapZoom: React.FC<MapZoomProps> = ({
  target = { x: 0.5, y: 0.5 },
  zoom = 3,
  enterFrame = 0,
  duration = 80,
  showMarker = true,
  coordinates,
  color = '#C9A24B',
  landColor = '#2A3648',
  seaColor = '#0A0F1A',
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = interpolate(frame, [enterFrame, enterFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const scale = interpolate(progress, [0, 1], [1, zoom]);

  // Pre-offset the oversized plane so the target sits at frame center,
  // then scale about center — the target stays pinned while the world grows.
  const dx = (0.5 - target.x) * OVERSCAN * width * scale;
  const dy = (0.5 - target.y) * OVERSCAN * height * scale;

  // Marker appears as the push-in completes.
  const markerAppear = enterFrame + duration * 0.72;
  const markerOpacity = interpolate(frame, [markerAppear, markerAppear + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Radar sweep rotation.
  const sweepAngle = frame * 2.5;

  return (
    <AbsoluteFill style={{ background: seaColor, overflow: 'hidden' }}>
      {/* ── Map plane ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${OVERSCAN * 100}%`,
          height: `${OVERSCAN * 100}%`,
          transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Graticule */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={(i + 1) * 100}
              y1={0}
              x2={(i + 1) * 100}
              y2={500}
              stroke={color}
              strokeOpacity={0.12}
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(i + 1) * 100}
              x2={1000}
              y2={(i + 1) * 100}
              stroke={color}
              strokeOpacity={0.12}
              strokeWidth={1}
            />
          ))}
          {/* Equator emphasis */}
          <line x1={0} y1={250} x2={1000} y2={250} stroke={color} strokeOpacity={0.22} strokeWidth={1.5} />

          {/* Landmasses */}
          <g filter="url(#map-soften)">
            {LANDMASSES.map((d, i) => (
              <path key={i} d={d} fill={landColor} fillOpacity={0.9} stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
            ))}
            {/* British Isles + Japan + Indonesia hints */}
            <ellipse cx={436} cy={104} rx={7} ry={11} fill={landColor} stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
            <ellipse cx={856} cy={126} rx={8} ry={20} fill={landColor} stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
            <ellipse cx={772} cy={196} rx={26} ry={8} fill={landColor} stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
            <ellipse cx={818} cy={208} rx={18} ry={6} fill={landColor} stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
          </g>
          <defs>
            <filter id="map-soften" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="1.4" />
            </filter>
          </defs>

          {/* Target marker (lives on the plane so it scales with the zoom) */}
          {showMarker && (
            <g opacity={markerOpacity}>
              {[0, 12, 24].map((delay) => {
                const ringProgress =
                  (((frame - markerAppear - delay) % 36) + 36) % 36 / 36;
                return (
                  <circle
                    key={delay}
                    cx={target.x * 1000}
                    cy={target.y * 500}
                    r={6 + ringProgress * 34}
                    fill="none"
                    stroke={color}
                    strokeOpacity={(1 - ringProgress) * 0.85}
                    strokeWidth={2}
                  />
                );
              })}
              {/* Crosshair */}
              <line x1={target.x * 1000 - 30} y1={target.y * 500} x2={target.x * 1000 + 30} y2={target.y * 500} stroke={color} strokeWidth={2} />
              <line x1={target.x * 1000} y1={target.y * 500 - 30} x2={target.x * 1000} y2={target.y * 500 + 30} stroke={color} strokeWidth={2} />
              <circle cx={target.x * 1000} cy={target.y * 500} r={5} fill={color} />
            </g>
          )}
        </svg>

        {/* Radar sweep around the target */}
        {showMarker && (
          <div
            style={{
              position: 'absolute',
              left: `${target.x * 100}%`,
              top: `${target.y * 100}%`,
              width: 360,
              height: 360,
              marginLeft: -180,
              marginTop: -180,
              borderRadius: '50%',
              background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, ${color}26 40deg, transparent 60deg)`,
              WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
              maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
              opacity: markerOpacity * 0.9,
            }}
          />
        )}
      </div>

      {/* ── Archival grade ── */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Coordinate readout ── */}
      {coordinates && (
        <div
          style={{
            position: 'absolute',
            left: '4%',
            bottom: '6%',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: Math.round(height * 0.022),
            letterSpacing: '0.18em',
            color,
            opacity: interpolate(frame, [enterFrame + 14, enterFrame + 28], [0, 0.95], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {coordinates}
        </div>
      )}

      {children}
    </AbsoluteFill>
  );
};