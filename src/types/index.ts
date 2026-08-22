// ─────────────────────────────────────────────────────────────────────────────
// Enumerations & Literals
// ─────────────────────────────────────────────────────────────────────────────

/** Supported social-media aspect ratios. Values are "width:height" strings. */
export type AspectRatio = '9:16' | '1:1' | '16:9';

/** Pixel dimensions derived from an AspectRatio at standard resolutions. */
export type AspectRatioDimensions = { width: number; height: number };

/** Map from every AspectRatio to its canonical pixel dimensions. */
export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, AspectRatioDimensions> = {
  '9:16': { width: 1080, height: 1920 }, // TikTok / Reels / Shorts
  '1:1':  { width: 1080, height: 1080 }, // Instagram Feed
  '16:9': { width: 1920, height: 1080 }, // YouTube / LinkedIn
};

/** Lifecycle state of a VideoProject. */
export type ProjectStatus = 'draft' | 'rendering' | 'completed' | 'failed';

/** High-level category for a template. */
export type TemplateCategory = 'social-media' | 'ads' | 'explainer' | 'intro' | 'tutorial';

/** Supported frames-per-second values for Remotion compositions. */
export type SupportedFps = 24 | 30 | 60;

// ─────────────────────────────────────────────────────────────────────────────
// Brand & Product
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Brand identity information used across scenes to maintain visual consistency.
 */
export interface BrandInfo {
  /** Company or brand name displayed in the video. */
  name: string;
  /** Optional tagline or slogan shown alongside the brand name. */
  tagline?: string;
  /** URL or public path to the brand logo image. */
  logoUrl?: string;
  /**
   * Primary brand color in hex format (e.g. "#6366F1").
   * Used to tint backgrounds, overlays, and accent elements.
   */
  primaryColor?: string;
  /**
   * Secondary / accent color in hex format.
   * Used for highlights, CTAs, and contrast elements.
   */
  accentColor?: string;
  /** Website URL shown in CTAs and lower-thirds. */
  websiteUrl?: string;
}

/**
 * Product or service information rendered inside the video.
 */
export interface ProductInfo {
  /** Display name of the product or service. */
  name: string;
  /** Short marketing description (1–2 sentences). */
  description?: string;
  /** Original price before discount (e.g. "$69.99"). Shown struck-through when present. */
  originalPrice?: string;
  /** Formatted final price string (e.g. "$49.99" or "Free"). */
  price?: string;
  /**
   * Discount or offer label (e.g. "20% OFF" or "Limited Time").
   * Displayed as an overlay badge when present.
   */
  discount?: string;
  /**
   * Up to 4 bullet-point features or selling points.
   * Rendered as a list in the feature scene.
   * Kept as a plain array so it matches the shared Remotion zod schema
   * (`videoContentSchema`) one-to-one.
   */
  features?: string[];
  /** URL or public path to the main product image. */
  imageUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Call To Action
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call-to-action configuration rendered in the final scene(s) of the video.
 */
export interface CTA {
  /** Primary button / overlay text (e.g. "Shop Now", "Learn More"). */
  text: string;
  /** Destination URL the viewer should visit. */
  url?: string;
  /**
   * Secondary line of text below the main CTA
   * (e.g. "Link in bio" or "Swipe up").
   */
  subtext?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Content
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All user-supplied content that drives the dynamic data inside a video.
 * Passed as Remotion composition `inputProps`.
 */
export interface VideoContent {
  /** Brand identity used throughout the composition. */
  brand: BrandInfo;
  /** Product or service being featured. */
  product: ProductInfo;
  /** Call-to-action for the closing scene. */
  cta: CTA;
  /**
   * Optional background image URL or gradient CSS string.
   * Fallbacks to a brand-color gradient if omitted.
   */
  backgroundImageUrl?: string;
  /**
   * Headline copy for the opening scene.
   * Defaults to `product.name` if not provided.
   */
  headline?: string;
  /**
   * Short body copy used in mid-video scenes (max ~120 chars).
   */
  bodyText?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────────────────────────────────────

/** Supported easing presets for Remotion spring/interpolate calls. */
export type EasingPreset =
  | 'spring'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear';

/** Animation direction for slide or wipe effects. */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

/** Transition style between scenes. */
export type TransitionType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'wipe'
  | 'none';

/**
 * Low-level animation descriptor consumed by Remotion interpolation helpers.
 * All frame values are absolute (not relative to scene start).
 */
export interface AnimationConfig {
  /** Frame at which this animation begins. */
  startFrame: number;
  /**
   * Frame at which this animation ends.
   * Duration = endFrame - startFrame.
   */
  endFrame: number;
  /** Easing preset applied to the interpolation. */
  easing: EasingPreset;
  /** For directional animations (slide, wipe). */
  direction?: AnimationDirection;
  /**
   * Spring mass — higher = more inertia.
   * Only relevant when `easing` is "spring".
   */
  springMass?: number;
  /**
   * Spring damping — higher = less oscillation.
   * Only relevant when `easing` is "spring".
   */
  springDamping?: number;
  /**
   * Spring stiffness — higher = faster snap.
   * Only relevant when `easing` is "spring".
   */
  springStiffness?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenes
// ─────────────────────────────────────────────────────────────────────────────

/** The type / role of a scene within the composition. */
export type SceneType =
  | 'intro'       // Brand reveal / logo animation
  | 'headline'    // Main product headline
  | 'features'    // Feature bullet list
  | 'product'     // Product image showcase
  | 'cta'         // Call-to-action closing card
  | 'outro';      // Brand sign-off

/**
 * A single scene within a VideoProject composition.
 *
 * Each scene maps to a Remotion `<Sequence>` with its own
 * from-frame, duration, layout, and animation config.
 */
export interface VideoScene {
  /** Unique identifier for this scene (e.g. "scene-intro"). */
  id: string;
  /** Semantic role of the scene. */
  type: SceneType;
  /**
   * Absolute frame at which this scene begins inside the composition.
   * Passed directly as the `from` prop of a Remotion `<Sequence>`.
   */
  startFrame: number;
  /**
   * Duration of this scene in frames.
   * Passed as the `durationInFrames` prop of a Remotion `<Sequence>`.
   */
  durationInFrames: number;
  /**
   * Optional transition that plays at the start of this scene,
   * overlapping with the previous one.
   */
  transition?: {
    type: TransitionType;
    /** Duration of the transition overlap in frames. */
    durationInFrames: number;
  };
  /** Animation configs for elements inside this scene (keyed by element id). */
  animations?: Record<string, AnimationConfig>;
  /** Arbitrary extra data specific to this scene type. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A video template defines the structure and timing of a composition.
 * Templates are instantiated into VideoProjects.
 */
export interface VideoTemplate {
  /** Unique template identifier (e.g. "promo-vertical-v1"). */
  id: string;
  /** Human-readable template name. */
  name: string;
  /** Short description of the template's visual style and use-case. */
  description: string;
  /** Path or URL to the static preview thumbnail. */
  thumbnailUrl: string;
  /** Template category for filtering in the UI. */
  category: TemplateCategory;
  /** Target aspect ratio of the output video. */
  aspectRatio: AspectRatio;
  /** Total composition duration in frames. */
  durationInFrames: number;
  /** Frames per second for this composition. */
  fps: SupportedFps;
  /** Canonical output width in pixels (derived from aspectRatio). */
  width: number;
  /** Canonical output height in pixels (derived from aspectRatio). */
  height: number;
  /**
   * Ordered scene layout for this template.
   * Defines scene types and default timings — content is injected via VideoContent.
   */
  scenes: VideoScene[];
  /**
   * Content field keys that are required to render this template.
   * Used for form validation in the editor.
   */
  requiredFields: Array<keyof VideoContent | string>;
  /** Human-readable tags for search (e.g. ["product", "launch", "tiktok"]). */
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Project
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A VideoProject is the top-level entity representing one video being built.
 *
 * It binds a VideoTemplate to user-supplied VideoContent and tracks
 * lifecycle status. This object is serializable and safe to use as
 * Remotion composition `inputProps`.
 */
export interface VideoProject {
  /** Unique project identifier (UUID or slug). */
  id: string;
  /** User-visible project title. */
  title: string;
  /**
   * The template this project was instantiated from.
   * `undefined` for blank/custom compositions.
   */
  template?: Pick<VideoTemplate, 'id' | 'name' | 'aspectRatio' | 'category'>;
  /** Aspect ratio of the output video. */
  aspectRatio: AspectRatio;
  /** Frames per second. */
  fps: SupportedFps;
  /** Total composition duration in frames. */
  durationInFrames: number;
  /** Output width in pixels. */
  width: number;
  /** Output height in pixels. */
  height: number;
  /** User-supplied content injected into the composition. */
  content: VideoContent;
  /**
   * Ordered scenes for the composition.
   * May be overridden by the user after instantiation.
   */
  scenes: VideoScene[];
  /** ISO-8601 creation timestamp. */
  createdAt: string;
  /** ISO-8601 last-modified timestamp. */
  updatedAt: string;
  /** Current lifecycle status. */
  status: ProjectStatus;
  /**
   * Optional path / URL to the generated thumbnail.
   * Set after the first render or manual export.
   */
  thumbnailUrl?: string;
  /**
   * Optional path / URL to the rendered video file.
   * Set after a successful render job completes.
   */
  videoUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Composition Config (Remotion registration)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal config object passed to `<Composition>` in the Remotion Root.
 * Decoupled from VideoProject so Remotion doesn't need the full domain model.
 */
export interface CompositionConfig {
  /** Matches the `id` prop of a Remotion `<Composition>`. */
  id: string;
  /** Display title in Remotion Studio. */
  title: string;
  fps: SupportedFps;
  durationInFrames: number;
  width: number;
  height: number;
  /** Default input props supplied to the composition. */
  defaultProps?: VideoContent;
}
