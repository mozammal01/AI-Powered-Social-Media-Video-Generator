import { useCurrentFrame } from 'remotion';

export interface ParallaxLayerConfig {
  /** The layer's rendered content. */
  content: React.ReactNode;
  /**
   * Relative drift speed & direction. Layers with different speeds move
   * at different rates, creating depth. Negative values drift opposite.
   */
  speed?: number;
  /** Static horizontal offset in px. */
  offsetX?: number;
  /** Static vertical offset in px. */
  offsetY?: number;
  /**
   * Base scale for this layer — keep > 1 so the drift never exposes
   * empty edges (default 1.08).
   */
  scale?: number;
}

export interface ParallaxLayersProps {
  /** Ordered back-to-front stack of layers. */
  layers: ParallaxLayerConfig[];
  /** Horizontal drift amplitude in px. */
  amplitude?: number;
  /** Vertical drift amplitude in px. */
  verticalAmplitude?: number;
  /** Length of one full drift cycle in frames. */
  periodFrames?: number;
  /** Phase offset between consecutive layers (radians). */
  phaseStep?: number;
}

/**
 * ParallaxLayers — stacks content in absolutely-positioned planes that
 * drift on independent sine paths. Deterministic and loop-friendly.
 *
 * Give background layers small |speed| and foreground layers larger
 * |speed| for a classic depth illusion.
 */
export const ParallaxLayers: React.FC<ParallaxLayersProps> = ({
  layers,
  amplitude = 24,
  verticalAmplitude = 14,
  periodFrames = 240,
  phaseStep = Math.PI / 3,
}) => {
  const frame = useCurrentFrame();
  const t = (frame / periodFrames) * Math.PI * 2;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {layers.map((layer, index) => {
        const speed = layer.speed ?? 1;
        const phase = index * phaseStep;
        const x = Math.sin(t + phase) * amplitude * speed + (layer.offsetX ?? 0);
        const y = Math.cos(t * 0.8 + phase) * verticalAmplitude * speed + (layer.offsetY ?? 0);
        const scale = layer.scale ?? 1.08;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              willChange: 'transform',
            }}
          >
            {layer.content}
          </div>
        );
      })}
    </div>
  );
};