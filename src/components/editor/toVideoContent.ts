import type { VideoContentProps } from "@/remotion/schema";
import type { EditorFormValues } from "./editor-schema";

/**
 * Converts the flat editor form values into the nested `VideoContent` shape.
 *
 * Every registered template consumes this exact data model, so the same
 * mapping works regardless of which template is selected in the editor.
 */
export function toVideoContent(
  values: EditorFormValues
): VideoContentProps {
  const features = [values.feature1, values.feature2, values.feature3]
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);

  return {
    brand: {
      name: values.brandName.trim() || "Brand",
      tagline: values.tagline.trim() || undefined,
      logoUrl: values.brandLogoUrl || undefined,
      primaryColor: "#6366F1",
      accentColor: "#A855F7",
      websiteUrl: values.websiteUrl.trim() || undefined,
    },
    product: {
      name: values.productName.trim() || "Product",
      description: values.description.trim() || undefined,
      price: values.price.trim() || undefined,
      discount: values.discount.trim() || undefined,
      features: features.length > 0 ? features : undefined,
      imageUrl: values.productImageUrl || undefined,
    },
    cta: {
      text: values.ctaText.trim() || "Learn More",
      url: values.websiteUrl.trim() || undefined,
    },
    headline: values.tagline.trim() || undefined,
    bodyText: values.description.trim() || undefined,
  };
}