import { z } from "zod";

/**
 * Shared contract for AI-assisted marketing copy generation.
 * Imported by both client and server — contains no Node-only code.
 */

/** Marketing tones offered in the AI panel. */
export const MARKETING_TONES = [
  "professional",
  "energetic",
  "luxury",
  "friendly",
  "minimal",
] as const;

export const marketingToneSchema = z.enum(MARKETING_TONES);
export type MarketingTone = z.infer<typeof marketingToneSchema>;

export const TONE_LABELS: Record<MarketingTone, string> = {
  professional: "Professional",
  energetic: "Energetic",
  luxury: "Luxury",
  friendly: "Friendly",
  minimal: "Minimal",
};

/** Input sent from the AI panel to /api/generate-copy. */
export const generateCopyRequestSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(60, "Product name must be 60 characters or fewer"),
  productDescription: z
    .string()
    .max(300, "Description must be 300 characters or fewer")
    .optional(),
  targetAudience: z
    .string()
    .max(120, "Target audience must be 120 characters or fewer")
    .optional(),
  tone: marketingToneSchema,
});

export type GenerateCopyRequest = z.infer<typeof generateCopyRequestSchema>;

/**
 * Structured JSON Gemini must return.
 * Validated with Zod before it ever touches the editor form.
 */
export const generatedCopySchema = z.object({
  tagline: z
    .string()
    .trim()
    .min(1)
    .max(80, "Tagline must be 80 characters or fewer"),
  shortDescription: z
    .string()
    .trim()
    .min(1)
    .max(160, "Description must be 160 characters or fewer"),
  features: z
    .array(z.string().trim().min(1).max(80))
    .min(3, "At least 3 features are required")
    .max(4, "At most 4 features are allowed"),
  discountText: z.string().trim().max(20, "Discount text is too long"),
  ctaText: z
    .string()
    .trim()
    .min(1)
    .max(40, "CTA text must be 40 characters or fewer"),
});

export type GeneratedCopy = z.infer<typeof generatedCopySchema>;