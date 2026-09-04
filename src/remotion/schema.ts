import { z } from 'zod';

const brandInfoSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  websiteUrl: z.string().optional(),
});

const productInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  originalPrice: z.string().optional(),
  price: z.string().optional(),
  discount: z.string().optional(),
  features: z.array(z.string()).max(4).optional(),
  imageUrl: z.string().optional(),
});

const ctaSchema = z.object({
  text: z.string(),
  url: z.string().optional(),
  subtext: z.string().optional(),
});

/**
 * Shared Zod schema for all Remotion template compositions.
 *
 * Every template consumes the same `VideoContent` data model:
 *   brand, product, cta, backgroundImageUrl, headline, bodyText.
 * Adding a new template does NOT require a new schema — just a
 * new composition that renders this data differently.
 */
export const videoContentSchema = z.object({
  brand: brandInfoSchema,
  product: productInfoSchema,
  cta: ctaSchema,
  backgroundImageUrl: z.string().optional(),
  headline: z.string().optional(),
  bodyText: z.string().optional(),
  /** Optional data-explainer fields. Existing templates safely ignore these. */
  title: z.string().optional(),
  subtitle: z.string().optional(),
  statistic: z.number().finite().optional(),
  percentage: z.number().finite().optional(),
  chartData: z.array(z.number().finite()).optional(),
  labels: z.array(z.string()).optional(),
  source: z.string().optional(),
  /** Optional broadcast-news fields. Existing templates safely ignore these. */
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  image: z.string().optional(),
  tickerText: z.string().optional(),
  /** Optional countdown fields. Existing templates safely ignore these. */
  listTitle: z.string().optional(),
  item1Title: z.string().optional(),
  item1Description: z.string().optional(),
  item1Image: z.string().optional(),
  item1AccentText: z.string().optional(),
  item2Title: z.string().optional(),
  item2Description: z.string().optional(),
  item2Image: z.string().optional(),
  item2AccentText: z.string().optional(),
  item3Title: z.string().optional(),
  item3Description: z.string().optional(),
  item3Image: z.string().optional(),
  item3AccentText: z.string().optional(),
  item4Title: z.string().optional(),
  item4Description: z.string().optional(),
  item4Image: z.string().optional(),
  item4AccentText: z.string().optional(),
  item5Title: z.string().optional(),
  item5Description: z.string().optional(),
  item5Image: z.string().optional(),
  item5AccentText: z.string().optional(),
  /** Optional movie trailer fields. Existing templates safely ignore these. */
  description: z.string().optional(),
  statisticLabel: z.string().optional(),
  year: z.string().optional(),
});

/** Input props type for every template composition. */
export type VideoContentProps = z.infer<typeof videoContentSchema>;
