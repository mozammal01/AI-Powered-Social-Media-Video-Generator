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
});

/** Input props type for every template composition. */
export type VideoContentProps = z.infer<typeof videoContentSchema>;