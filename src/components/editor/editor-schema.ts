import { z } from "zod";
import { demoVideoContent } from "@/data/defaults";
import {
  DEFAULT_TEMPLATE_ID,
  templateRegistry,
  type TemplateId,
} from "@/remotion/templates";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value.length === 0 || /^https?:\/\/.+/i.test(value),
    "Enter a valid URL (e.g. https://example.com)"
  );

const optionalNumber = z.coerce.number().optional();

/** Registered template IDs as a tuple, so the enum stays in sync with the registry. */
const TEMPLATE_IDS = Object.keys(templateRegistry) as [TemplateId, ...TemplateId[]];

/**
 * Zod schema for the Create Video editor form.
 * UI-only — mapped to composition input props via toVideoContent().
 */

export const editorFormSchema = z.object({
  /** Which registered Remotion template renders the preview/video. */
  templateId: z.enum(TEMPLATE_IDS, {
    error: "Choose a template",
  }),
  brandName: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(60, "Brand name must be 60 characters or fewer"),
  tagline: z.string().max(80, "Tagline must be 80 characters or fewer"),
  websiteUrl: optionalUrl,

  productName: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(60, "Product name must be 60 characters or fewer"),
  description: z
    .string()
    .max(160, "Description must be 160 characters or fewer"),
  price: z.string().max(30, "Price must be 30 characters or fewer"),
  originalPrice: z.string().max(30, "Original price must be 30 characters or fewer"),
  discount: z.string().max(20, "Discount must be 20 characters or fewer"),
  feature1: z.string().max(80, "Feature 1 must be 80 characters or fewer"),
  feature2: z.string().max(80, "Feature 2 must be 80 characters or fewer"),
  feature3: z.string().max(80, "Feature 3 must be 80 characters or fewer"),

  ctaText: z
    .string()
    .trim()
    .min(1, "CTA text is required")
    .max(40, "CTA text must be 40 characters or fewer"),

  brandLogoUrl: z.string(),
  productImageUrl: z.string(),

  aspectRatio: z.enum(["9:16", "1:1", "16:9"], {
    error: "Choose an aspect ratio",
  }),
  duration: z.enum(["10", "15", "30"], {
    error: "Choose a duration",
  }),

  headline: z.string().max(120, "Headline must be 120 characters or fewer"),
  title: z.string().max(120, "Title must be 120 characters or fewer"),
  subtitle: z.string().max(160, "Subtitle must be 160 characters or fewer"),
  statistic: optionalNumber,
  percentage: optionalNumber,
  chartData: z.string().optional(),
  labels: z.string().optional(),
  source: z.string().max(120, "Source must be 120 characters or fewer"),
  category: z.string().max(60, "Category must be 60 characters or fewer"),
  location: z.string().max(120, "Location must be 120 characters or fewer"),
  date: z.string().max(60, "Date must be 60 characters or fewer"),
  tickerText: z.string().max(200, "Ticker text must be 200 characters or fewer"),
  listTitle: z.string().max(120, "List title must be 120 characters or fewer"),
  rank: optionalNumber,
  itemTitle: z.string().max(120, "Item title must be 120 characters or fewer"),
  image: z.string().optional(),
  statisticLabel: z.string().max(120, "Label must be 120 characters or fewer"),
  accentText: z.string().max(60, "Accent text must be 60 characters or fewer"),
  bodyText: z.string().max(200, "Body text must be 200 characters or fewer"),
});

export type EditorFormValues = z.infer<typeof editorFormSchema>;
export type EditorFieldErrors = Partial<Record<keyof EditorFormValues, string>>;

export const DURATION_OPTIONS = [
  { value: "10" as const, label: "10 seconds", frames: 300 },
  { value: "15" as const, label: "15 seconds", frames: 450 },
  { value: "30" as const, label: "30 seconds", frames: 900 },
];

export const FIXED_DURATION_TEMPLATES = [
  'breaking-news-intro',
  'top-10-countdown',
  'cinematic-documentary',
  'cinematic-product-showcase',
] as const;

export const ASPECT_OPTIONS = [
  { value: "16:9" as const, label: "16:9", hint: "Landscape" },
  { value: "1:1" as const, label: "1:1", hint: "Square" },
  { value: "9:16" as const, label: "9:16", hint: "Vertical" },
];

export const defaultEditorValues: EditorFormValues = {
  templateId: DEFAULT_TEMPLATE_ID,
  brandName: demoVideoContent.brand.name,
  tagline: demoVideoContent.brand.tagline ?? "",
  websiteUrl: demoVideoContent.brand.websiteUrl ?? "",
  productName: demoVideoContent.product.name,
  description: demoVideoContent.product.description ?? "",
  price: demoVideoContent.product.price ?? "",
  originalPrice: demoVideoContent.product.originalPrice ?? "",
  discount: demoVideoContent.product.discount ?? "",
  feature1: demoVideoContent.product.features?.[0] ?? "",
  feature2: demoVideoContent.product.features?.[1] ?? "",
  feature3: demoVideoContent.product.features?.[2] ?? "",
  ctaText: demoVideoContent.cta.text,
  brandLogoUrl: demoVideoContent.brand.logoUrl ?? "",
  productImageUrl: demoVideoContent.product.imageUrl ?? "",
  aspectRatio: "9:16",
  duration: "10",
  headline: demoVideoContent.headline ?? "",
  title: demoVideoContent.title ?? "",
  subtitle: demoVideoContent.subtitle ?? "",
  statistic: demoVideoContent.statistic ?? 0,
  percentage: demoVideoContent.percentage ?? 0,
  chartData: (demoVideoContent.chartData ?? []).join(", "),
  labels: (demoVideoContent.labels ?? []).join(", "),
  source: demoVideoContent.source ?? "",
  category: demoVideoContent.category ?? "",
  location: demoVideoContent.location ?? "",
  date: demoVideoContent.date ?? "",
  tickerText: demoVideoContent.tickerText ?? "",
  listTitle: "",
  rank: 10,
  itemTitle: "",
  image: "",
  statisticLabel: "",
  accentText: "",
  bodyText: demoVideoContent.bodyText ?? "",
};

export function parseEditorForm(values: EditorFormValues): {
  success: boolean;
  errors: EditorFieldErrors;
} {
  const result = editorFormSchema.safeParse(values);
  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors: EditorFieldErrors = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as keyof EditorFormValues;
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }
  return { success: false, errors };
}
