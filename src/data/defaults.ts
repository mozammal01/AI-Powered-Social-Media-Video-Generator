import type {
  BrandInfo,
  CTA,
  ProductInfo,
  VideoContent,
  VideoProject,
  VideoScene,
  VideoTemplate,
  AspectRatio,
  SupportedFps,
} from '@/types';
import { ASPECT_RATIO_DIMENSIONS } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Demo Brand
// ─────────────────────────────────────────────────────────────────────────────

export const demoBrand: BrandInfo = {
  name: 'NovaSpark',
  tagline: 'Ignite Your Growth',
  logoUrl: '/demo/logo.svg',
  primaryColor: '#6366F1',  // indigo-500
  accentColor: '#A855F7',   // purple-500
  websiteUrl: 'https://novaspark.io',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo Product
// ─────────────────────────────────────────────────────────────────────────────

export const demoProduct: ProductInfo = {
  name: 'NovaSpark Pro',
  description: 'The AI-powered growth suite for modern SaaS teams.',
  originalPrice: '$69 / mo',
  price: '$49 / mo',
  discount: '30% OFF',
  features: [
    'AI-driven campaign automation',
    'Real-time analytics dashboard',
    'One-click social media publishing',
    'Priority 24/7 support',
  ],
  imageUrl: '/demo/product.svg',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo CTA
// ─────────────────────────────────────────────────────────────────────────────

export const demoCta: CTA = {
  text: 'Start Free Trial',
  url: 'https://novaspark.io/signup',
  subtext: 'No credit card required',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo VideoContent
// ─────────────────────────────────────────────────────────────────────────────

export const demoVideoContent: VideoContent = {
  brand: demoBrand,
  product: demoProduct,
  cta: demoCta,
  headline: 'Launch Smarter. Grow Faster.',
  bodyText:
    'NovaSpark Pro handles your campaigns so you can focus on building — not managing.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Advertisement Scenes  (10-second 9:16 @ 30fps = 300 frames)
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCT_AD_FPS = 30 as const;
export const PRODUCT_AD_DURATION = 300 as const; // 10s
export const PRODUCT_AD_SCENE_DURATION = 60 as const; // 2s per scene

export const productAdvertisementScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: PRODUCT_AD_SCENE_DURATION,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-product',
    type: 'product',
    startFrame: 60,
    durationInFrames: PRODUCT_AD_SCENE_DURATION,
    transition: { type: 'slide', durationInFrames: 15 },
  },
  {
    id: 'scene-features',
    type: 'features',
    startFrame: 120,
    durationInFrames: PRODUCT_AD_SCENE_DURATION,
    transition: { type: 'fade', durationInFrames: 12 },
  },
  {
    id: 'scene-pricing',
    type: 'headline',
    startFrame: 180,
    durationInFrames: PRODUCT_AD_SCENE_DURATION,
    transition: { type: 'zoom', durationInFrames: 15 },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 240,
    durationInFrames: PRODUCT_AD_SCENE_DURATION,
    transition: { type: 'slide', durationInFrames: 15 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Demo Scenes  (for a 15-second 9:16 promo @ 30fps = 450 frames)
// ─────────────────────────────────────────────────────────────────────────────

export const demoScenes: VideoScene[] = [
  {
    id: 'scene-intro',
    type: 'intro',
    startFrame: 0,
    durationInFrames: 60, // 2s
    transition: { type: 'fade', durationInFrames: 15 },
    animations: {
      logo: {
        startFrame: 0,
        endFrame: 30,
        easing: 'spring',
        springMass: 1,
        springDamping: 14,
        springStiffness: 120,
      },
    },
  },
  {
    id: 'scene-headline',
    type: 'headline',
    startFrame: 60,
    durationInFrames: 90, // 3s
    transition: { type: 'slide', durationInFrames: 20 },
    animations: {
      headline: {
        startFrame: 60,
        endFrame: 90,
        easing: 'ease-out',
        direction: 'up',
      },
    },
  },
  {
    id: 'scene-features',
    type: 'features',
    startFrame: 150,
    durationInFrames: 120, // 4s
    transition: { type: 'fade', durationInFrames: 15 },
    animations: {
      featureList: {
        startFrame: 150,
        endFrame: 210,
        easing: 'spring',
        springDamping: 16,
        springStiffness: 100,
      },
    },
  },
  {
    id: 'scene-product',
    type: 'product',
    startFrame: 270,
    durationInFrames: 90, // 3s
    transition: { type: 'zoom', durationInFrames: 20 },
    animations: {
      productImage: {
        startFrame: 270,
        endFrame: 310,
        easing: 'spring',
        springMass: 0.8,
        springDamping: 12,
        springStiffness: 140,
      },
    },
  },
  {
    id: 'scene-cta',
    type: 'cta',
    startFrame: 360,
    durationInFrames: 90, // 3s
    transition: { type: 'slide', durationInFrames: 20 },
    animations: {
      ctaButton: {
        startFrame: 380,
        endFrame: 420,
        easing: 'spring',
        direction: 'up',
        springDamping: 14,
        springStiffness: 120,
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Demo Templates
// ─────────────────────────────────────────────────────────────────────────────

export const demoTemplates: VideoTemplate[] = [
  {
    id: 'promo-vertical-v1',
    name: 'Product Promo Story',
    description:
      'Bold vertical format for TikTok, Reels, and Shorts. Intro → Headline → Features → CTA.',
    thumbnailUrl: '/templates/promo-vertical.jpg',
    category: 'ads',
    aspectRatio: '9:16',
    durationInFrames: 450, // 15s @ 30fps
    fps: 30,
    width: 1080,
    height: 1920,
    scenes: demoScenes,
    requiredFields: ['brand.name', 'product.name', 'cta.text'],
    tags: ['tiktok', 'reels', 'shorts', 'product', 'launch', 'vertical'],
  },
  {
    id: 'quote-feed-v1',
    name: 'Minimalist Quote Reel',
    description:
      'Clean typography animation ideal for motivational quotes or brand statements. Square format.',
    thumbnailUrl: '/templates/quote-feed.jpg',
    category: 'social-media',
    aspectRatio: '1:1',
    durationInFrames: 300, // 10s @ 30fps
    fps: 30,
    width: 1080,
    height: 1080,
    scenes: [
      {
        id: 'scene-intro',
        type: 'intro',
        startFrame: 0,
        durationInFrames: 30,
        transition: { type: 'fade', durationInFrames: 10 },
        animations: {},
      },
      {
        id: 'scene-headline',
        type: 'headline',
        startFrame: 30,
        durationInFrames: 210,
        transition: { type: 'fade', durationInFrames: 15 },
        animations: {
          text: { startFrame: 30, endFrame: 75, easing: 'ease-out', direction: 'up' },
        },
      },
      {
        id: 'scene-outro',
        type: 'outro',
        startFrame: 240,
        durationInFrames: 60,
        transition: { type: 'fade', durationInFrames: 15 },
        animations: {},
      },
    ],
    requiredFields: ['brand.name', 'headline'],
    tags: ['quote', 'feed', 'square', 'instagram', 'minimal'],
  },
  {
    id: 'explainer-landscape-v1',
    name: 'Product Explainer',
    description:
      'Landscape format for YouTube and LinkedIn. Walks through features with a strong closing CTA.',
    thumbnailUrl: '/templates/explainer-landscape.jpg',
    category: 'explainer',
    aspectRatio: '16:9',
    durationInFrames: 900, // 30s @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
    scenes: [
      {
        id: 'scene-intro',
        type: 'intro',
        startFrame: 0,
        durationInFrames: 90,
        transition: { type: 'fade', durationInFrames: 20 },
        animations: {},
      },
      {
        id: 'scene-headline',
        type: 'headline',
        startFrame: 90,
        durationInFrames: 150,
        transition: { type: 'slide', durationInFrames: 20 },
        animations: {},
      },
      {
        id: 'scene-features',
        type: 'features',
        startFrame: 240,
        durationInFrames: 360,
        transition: { type: 'slide', durationInFrames: 20 },
        animations: {},
      },
      {
        id: 'scene-cta',
        type: 'cta',
        startFrame: 600,
        durationInFrames: 300,
        transition: { type: 'fade', durationInFrames: 20 },
        animations: {},
      },
    ],
    requiredFields: ['brand.name', 'product.name', 'product.features', 'cta.text'],
    tags: ['explainer', 'youtube', 'linkedin', 'features', 'landscape'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Factory: createDefaultVideoProject
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateProjectOptions {
  /** User-supplied title. */
  title?: string;
  /** Aspect ratio of the output video. Defaults to '9:16'. */
  aspectRatio?: AspectRatio;
  /** Frames per second. Defaults to 30. */
  fps?: SupportedFps;
  /**
   * Template to base the project on.
   * When provided, dimensions, duration, and scenes are inherited from the template.
   */
  template?: VideoTemplate;
  /** Initial video content. Defaults to `demoVideoContent`. */
  content?: Partial<VideoContent>;
}

/**
 * Creates a new VideoProject with sensible defaults.
 *
 * @example
 * const project = createDefaultVideoProject({ title: 'My Launch Video' });
 * const fromTemplate = createDefaultVideoProject({ template: demoTemplates[0] });
 */
export function createDefaultVideoProject(
  options: CreateProjectOptions = {}
): VideoProject {
  const {
    title = 'Untitled Video',
    aspectRatio = '9:16',
    fps = 30,
    template,
    content = {},
  } = options;

  const resolvedAspectRatio: AspectRatio = template?.aspectRatio ?? aspectRatio;
  const resolvedFps: SupportedFps = template?.fps ?? fps;
  const resolvedDuration = template?.durationInFrames ?? 450; // 15s default
  const { width, height } = ASPECT_RATIO_DIMENSIONS[resolvedAspectRatio];
  const resolvedScenes: VideoScene[] = template?.scenes ?? demoScenes;

  const now = new Date().toISOString();

  const project: VideoProject = {
    id: generateProjectId(),
    title,
    aspectRatio: resolvedAspectRatio,
    fps: resolvedFps,
    durationInFrames: resolvedDuration,
    width,
    height,
    content: {
      ...demoVideoContent,
      ...content,
      brand: { ...demoVideoContent.brand, ...(content.brand ?? {}) },
      product: { ...demoVideoContent.product, ...(content.product ?? {}) },
      cta: { ...demoVideoContent.cta, ...(content.cta ?? {}) },
    },
    scenes: resolvedScenes,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };

  if (template) {
    project.template = {
      id: template.id,
      name: template.name,
      aspectRatio: template.aspectRatio,
      category: template.category,
    };
  }

  return project;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Projects  (pre-built VideoProject instances for UI mock data)
// ─────────────────────────────────────────────────────────────────────────────

export const demoProjects: VideoProject[] = [
  {
    id: 'proj-demo-1',
    title: 'SaaS Launch Announcement',
    template: {
      id: 'promo-vertical-v1',
      name: 'Product Promo Story',
      aspectRatio: '9:16',
      category: 'ads',
    },
    aspectRatio: '9:16',
    fps: 30,
    durationInFrames: 450,
    width: 1080,
    height: 1920,
    content: {
      ...demoVideoContent,
      headline: 'Your SaaS. Launched.',
      product: { ...demoProduct, name: 'LaunchPad AI' },
    },
    scenes: demoScenes,
    createdAt: '2026-08-20T14:30:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
    status: 'completed',
    thumbnailUrl: '/demo/thumbs/saas-launch.jpg',
  },
  {
    id: 'proj-demo-2',
    title: 'AI Product Promo Story',
    template: {
      id: 'promo-vertical-v1',
      name: 'Product Promo Story',
      aspectRatio: '9:16',
      category: 'ads',
    },
    aspectRatio: '9:16',
    fps: 30,
    durationInFrames: 450,
    width: 1080,
    height: 1920,
    content: demoVideoContent,
    scenes: demoScenes,
    createdAt: '2026-08-20T12:00:00.000Z',
    updatedAt: '2026-08-20T12:00:00.000Z',
    status: 'rendering',
  },
  {
    id: 'proj-demo-3',
    title: 'Cooking Tips YouTube Short',
    template: {
      id: 'quote-feed-v1',
      name: 'Minimalist Quote Reel',
      aspectRatio: '9:16',
      category: 'social-media',
    },
    aspectRatio: '9:16',
    fps: 30,
    durationInFrames: 900,
    width: 1080,
    height: 1920,
    content: {
      brand: { name: 'ChefAI', primaryColor: '#F59E0B' },
      product: { name: 'ChefAI Meal Planner', description: '7 quick dinner ideas in 60 seconds.' },
      cta: { text: 'Download Free', url: 'https://chefai.app' },
      headline: '7 Dinners. 15 Minutes Each.',
    },
    scenes: demoScenes,
    createdAt: '2026-08-19T09:15:00.000Z',
    updatedAt: '2026-08-19T09:15:00.000Z',
    status: 'completed',
    thumbnailUrl: '/demo/thumbs/cooking-short.jpg',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a short collision-resistant project ID.
 * Not cryptographically secure — sufficient for client-side state.
 */
function generateProjectId(): string {
  return `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
