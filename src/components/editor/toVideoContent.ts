import type { ProductAdvertisementProps } from "@/remotion/compositions/schema";
import type { EditorFormValues } from "./editor-schema";

/**
 * Converts the flat editor form values into the nested shape
 * required by the ProductAdvertisement Remotion composition.
 */
export function toVideoContent(
  values: EditorFormValues
): ProductAdvertisementProps {
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
