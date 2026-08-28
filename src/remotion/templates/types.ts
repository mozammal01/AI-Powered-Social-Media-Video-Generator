import type React from 'react';
import type { AspectRatio, SupportedFps, TemplateCategory } from '@/types';
import type { VideoContentProps } from '@/remotion/schema';

/** Union of every registered template ID. Add new IDs here when creating a template. */
export type TemplateId =
  | 'product-advertisement'
  | 'restaurant-promotion'
  | 'sale-promotion'
  | 'cinematic-documentary'
  | 'luxury-commercial'
  | 'cinematic-product-showcase'
  | 'data-statistics-explainer'
  | 'breaking-news-intro';

/**
 * Serializable template metadata — everything the app needs to know about a
 * template EXCEPT its React component.
 *
 * Safe to import from Server Components (no Remotion/React runtime imports).
 */
export interface TemplateMetadata {
  /** Unique identifier — also used as the Remotion composition id. */
  id: TemplateId;
  /** Human-readable template name shown on cards and in Remotion Studio. */
  name: string;
  /** Short description of the template's style and intended use-case. */
  description: string;
  /** High-level category for filtering in the UI. */
  category: TemplateCategory;
  /** Search/discovery tags. */
  tags: string[];
  /** Static preview thumbnail displayed on template cards. */
  thumbnailUrl: string;
  /** Every aspect ratio this template can be rendered in. */
  supportedAspectRatios: AspectRatio[];
  /** Aspect ratio selected by default when instantiating this template. */
  defaultAspectRatio: AspectRatio;
  /** Frames per second for this template's composition. */
  fps: SupportedFps;
  /** Default composition duration in frames (at `fps`). */
  durationInFrames: number;
  /** Whether this template appears in the Featured section. */
  featured?: boolean;
  /** Default input props used for previews and new projects. */
  defaultProps: VideoContentProps | Record<string, unknown>;
}

/**
 * Full template definition = metadata + the Remotion composition component.
 *
 * Importing a `TemplateDefinition` pulls the composition (and therefore
 * Remotion) into the bundle — only do this from Client Components or the
 * Remotion Root. Server Components should use `TemplateMetadata`.
 *
 * To add a new template:
 *   1. Create a folder under `remotion/templates/<YourTemplate>/` with the
 *      composition component and its scene layout.
 *   2. Add the template ID to the `TemplateId` union above.
 *   3. Register its metadata in `remotion/templates/registry.ts`.
 *   4. Map its component in `remotion/templates/components.ts`.
 */
export interface TemplateDefinition extends TemplateMetadata {
  /** The Remotion composition component. */
  component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}
