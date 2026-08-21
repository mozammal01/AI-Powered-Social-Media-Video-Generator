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

/** Zod schema for ProductAdvertisement composition input props. */
export const productAdvertisementSchema = z.object({
  brand: brandInfoSchema,
  product: productInfoSchema,
  cta: ctaSchema,
  backgroundImageUrl: z.string().optional(),
  headline: z.string().optional(),
  bodyText: z.string().optional(),
});

export type ProductAdvertisementProps = z.infer<typeof productAdvertisementSchema>;
