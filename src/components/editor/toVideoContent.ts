import type { VideoContentProps } from "@/remotion/schema";
import type { EditorFormValues } from "./editor-schema";
import type { TemplateId } from "@/remotion/templates";

/**
 * Converts the flat editor form values into the nested `VideoContent` shape.
 *
 * Mapping is template-aware: fields that are template-specific are routed
 * into the correct nested property so every composition receives the data
 * it expects, while unrelated fields are safely ignored.
 */
export function toVideoContent(
  values: EditorFormValues
): VideoContentProps {
  const features = [values.feature1, values.feature2, values.feature3]
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);

  const chartData = values.chartData
    ? values.chartData.split(",").map((item) => Number(item.trim())).filter((num) => Number.isFinite(num))
    : undefined;

  const labels = values.labels
    ? values.labels.split(",").map((item) => item.trim()).filter((item) => item.length > 0)
    : undefined;

  const templateId = values.templateId as TemplateId;

  // Base shared content
  const content: VideoContentProps = {
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
      originalPrice: values.originalPrice.trim() || undefined,
      discount: values.discount.trim() || undefined,
      features: features.length > 0 ? features : undefined,
      imageUrl: values.productImageUrl || undefined,
    },
    cta: {
      text: values.ctaText.trim() || "Learn More",
      url: values.websiteUrl.trim() || undefined,
      subtext: undefined,
    },
    headline: values.headline.trim() || values.tagline.trim() || undefined,
    bodyText: values.bodyText.trim() || values.description.trim() || undefined,
    title: values.title.trim() || undefined,
    subtitle: values.subtitle.trim() || undefined,
    statistic: typeof values.statistic === "number" && Number.isFinite(values.statistic) ? values.statistic : undefined,
    percentage: typeof values.percentage === "number" && Number.isFinite(values.percentage) ? values.percentage : undefined,
    chartData,
    labels,
    source: values.source.trim() || undefined,
    category: values.category.trim() || undefined,
    location: values.location.trim() || undefined,
    date: values.date.trim() || undefined,
    tickerText: values.tickerText.trim() || undefined,
    image: values.image || undefined,
    backgroundImageUrl: values.productImageUrl || undefined,
  };

  // Template-specific overrides / additions
  switch (templateId) {
    case 'top-5-countdown':
    case 'top-10-countdown': {
      const rankValue = typeof values.rank === 'number' && Number.isFinite(values.rank) ? values.rank : (templateId === 'top-5-countdown' ? 5 : 10);
      void rankValue;
      return {
        ...content,
        headline: values.headline.trim() || (templateId === 'top-5-countdown' ? 'TOP 5' : 'TOP 10'),
        product: {
          ...content.product,
          name: values.itemTitle.trim() || values.productName.trim() || 'Ranked Item',
          description: values.description.trim() || undefined,
          imageUrl: values.image || values.productImageUrl || undefined,
        },
        statistic: typeof values.statistic === 'number' && Number.isFinite(values.statistic) ? values.statistic : undefined,
        category: values.category.trim() || undefined,
        bodyText: values.statisticLabel.trim() || undefined,
      };
    }
    case 'breaking-news-intro': {
      return {
        ...content,
        product: {
          ...content.product,
          name: values.productName.trim() || 'BREAKING NEWS',
          imageUrl: values.productImageUrl || undefined,
        },
        headline: values.headline.trim() || undefined,
        category: values.category.trim() || undefined,
        location: values.location.trim() || undefined,
        date: values.date.trim() || undefined,
        statistic: typeof values.statistic === 'number' && Number.isFinite(values.statistic) ? values.statistic : undefined,
        source: values.source.trim() || undefined,
        tickerText: values.tickerText.trim() || undefined,
        bodyText: values.bodyText.trim() || values.statisticLabel.trim() || undefined,
      };
    }
    case 'data-statistics-explainer': {
      return {
        ...content,
        headline: values.headline.trim() || undefined,
        title: values.title.trim() || values.headline.trim() || undefined,
        subtitle: values.subtitle.trim() || undefined,
        statistic: typeof values.statistic === 'number' && Number.isFinite(values.statistic) ? values.statistic : undefined,
        percentage: typeof values.percentage === 'number' && Number.isFinite(values.percentage) ? values.percentage : undefined,
        source: values.source.trim() || undefined,
        bodyText: values.bodyText.trim() || values.description.trim() || undefined,
      };
    }
    case 'cinematic-documentary': {
      return {
        ...content,
        headline: values.brandName.trim() || content.headline || 'Documentary',
        bodyText: values.description.trim() || undefined,
        product: {
          ...content.product,
          name: values.productName.trim() || content.product.name || 'Untitled',
          description: values.description.trim() || undefined,
        },
      };
    }
    case 'luxury-commercial': {
      return {
        ...content,
        brand: {
          ...content.brand,
          name: values.brandName.trim() || content.brand.name || 'Luxury Brand',
        },
        product: {
          ...content.product,
          name: values.productName.trim() || content.product.name || 'Luxury Product',
          description: values.description.trim() || undefined,
        },
      };
    }
    default:
      return content;
  }
}
