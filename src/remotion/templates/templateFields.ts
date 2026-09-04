import type { TemplateId } from './types';
import type { EditorFormValues } from '@/components/editor/editor-schema';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TemplateFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'image'
  | 'url'
  | 'array';

export interface TemplateFieldDefinition {
  /** Key in EditorFormValues. */
  key: keyof EditorFormValues;
  /** Human-readable label shown in the editor. */
  label: string;
  /** Input type. */
  type: TemplateFieldType;
  /** Whether the field is required for this template. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Default value when template is selected. */
  defaultValue?: string | number;
  /** Which editor section this belongs to. */
  section?: string;
  /** Optional hint shown below the field. */
  hint?: string;
  /** For array fields: how many slots to render (1-indexed). */
  arrayCount?: 1 | 2 | 3;
  /** For image fields: the associated label. */
  imageLabel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Field definitions per template
// ─────────────────────────────────────────────────────────────────────────────

const productAdFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g. NovaSpark', section: 'Brand', defaultValue: 'NovaSpark' },
  { key: 'tagline', label: 'Tagline', type: 'text', required: false, placeholder: 'e.g. Ignite Your Growth', section: 'Brand' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', required: false, placeholder: 'https://example.com', section: 'Brand' },
  { key: 'brandLogoUrl', label: 'Brand Logo', type: 'image', required: false, section: 'Brand', imageLabel: 'Brand logo' },
  { key: 'productName', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g. NovaSpark Pro', section: 'Product', defaultValue: 'NovaSpark Pro' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short marketing description (1–2 sentences)', section: 'Product', hint: 'Max 160 characters' },
  { key: 'productImageUrl', label: 'Product Image', type: 'image', required: false, section: 'Product', imageLabel: 'Product image' },
  { key: 'price', label: 'Price', type: 'text', required: false, placeholder: '$49 / mo', section: 'Product' },
  { key: 'discount', label: 'Discount', type: 'text', required: false, placeholder: '30% OFF', section: 'Product' },
  { key: 'feature1', label: 'Feature 1', type: 'text', required: false, placeholder: 'Key selling point', section: 'Key Features' },
  { key: 'feature2', label: 'Feature 2', type: 'text', required: false, placeholder: 'Key selling point', section: 'Key Features' },
  { key: 'feature3', label: 'Feature 3', type: 'text', required: false, placeholder: 'Key selling point', section: 'Key Features' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Start Free Trial', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const restaurantPromotionFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Restaurant Name', type: 'text', required: true, placeholder: 'e.g. Bella Italia', section: 'Brand', defaultValue: 'NovaSpark' },
  { key: 'tagline', label: 'Tagline', type: 'text', required: false, placeholder: 'e.g. Authentic Italian Flavors', section: 'Brand' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', required: false, placeholder: 'https://example.com', section: 'Brand' },
  { key: 'brandLogoUrl', label: 'Brand Logo', type: 'image', required: false, section: 'Brand', imageLabel: 'Brand logo' },
  { key: 'productName', label: 'Signature Dish', type: 'text', required: true, placeholder: 'e.g. Truffle Risotto', section: 'Product', defaultValue: 'NovaSpark Pro' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short description of the dish or offer', section: 'Product', hint: 'Max 160 characters' },
  { key: 'productImageUrl', label: 'Dish Image', type: 'image', required: false, section: 'Product', imageLabel: 'Dish image' },
  { key: 'discount', label: 'Special Offer', type: 'text', required: false, placeholder: 'e.g. 20% OFF', section: 'Product' },
  { key: 'feature1', label: 'Highlight 1', type: 'text', required: false, placeholder: 'e.g. Fresh pasta daily', section: 'Highlights' },
  { key: 'feature2', label: 'Highlight 2', type: 'text', required: false, placeholder: 'e.g. Vegan options', section: 'Highlights' },
  { key: 'feature3', label: 'Highlight 3', type: 'text', required: false, placeholder: 'e.g. Outdoor seating', section: 'Highlights' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Reserve a Table', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const salePromotionFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g. NovaSpark', section: 'Brand', defaultValue: 'NovaSpark' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', required: false, placeholder: 'https://example.com', section: 'Brand' },
  { key: 'productName', label: 'Product / Deal Name', type: 'text', required: true, placeholder: 'e.g. Flash Sale', section: 'Product', defaultValue: 'NovaSpark Pro' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short deal description', section: 'Product', hint: 'Max 160 characters' },
  { key: 'productImageUrl', label: 'Product Image', type: 'image', required: false, section: 'Product', imageLabel: 'Product image' },
  { key: 'price', label: 'Original Price', type: 'text', required: false, placeholder: '$99', section: 'Product' },
  { key: 'discount', label: 'Discount / Deal', type: 'text', required: true, placeholder: '50% OFF', section: 'Product', defaultValue: '30% OFF' },
  { key: 'feature1', label: 'Perk 1', type: 'text', required: false, placeholder: 'e.g. Free shipping', section: 'Deal Perks' },
  { key: 'feature2', label: 'Perk 2', type: 'text', required: false, placeholder: 'e.g. 24h support', section: 'Deal Perks' },
  { key: 'feature3', label: 'Perk 3', type: 'text', required: false, placeholder: 'e.g. Money-back guarantee', section: 'Deal Perks' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Shop Now', section: 'Call to Action', defaultValue: 'Shop Now' },
];

const cinematicDocumentaryFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Documentary Title', type: 'text', required: true, placeholder: 'e.g. The Silent Ocean', section: 'Title', defaultValue: 'NovaSpark' },
  { key: 'tagline', label: 'Subtitle', type: 'text', required: false, placeholder: 'e.g. A Journey Below the Surface', section: 'Title' },
  { key: 'productName', label: 'Location', type: 'text', required: false, placeholder: 'e.g. Pacific Ocean', section: 'Details' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short synopsis or narration', section: 'Details', hint: 'Max 160 characters' },
  { key: 'feature1', label: 'Timeline Event 1', type: 'text', required: false, placeholder: 'e.g. 1982 — First dive', section: 'Timeline' },
  { key: 'feature2', label: 'Timeline Event 2', type: 'text', required: false, placeholder: 'e.g. 1995 — Species discovery', section: 'Timeline' },
  { key: 'feature3', label: 'Timeline Event 3', type: 'text', required: false, placeholder: 'e.g. 2024 — Conservation effort', section: 'Timeline' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Watch Full Documentary', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const luxuryCommercialFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Brand Name', type: 'text', required: false, placeholder: 'e.g. NovaSpark', section: 'Brand', defaultValue: 'NovaSpark' },
  { key: 'productName', label: 'Product Name', type: 'text', required: false, placeholder: 'e.g. NovaSpark Pro', section: 'Product', defaultValue: 'NovaSpark Pro' },
  { key: 'description', label: 'Tagline', type: 'textarea', required: false, placeholder: 'e.g. Elegance Redefined', section: 'Product', hint: 'Max 160 characters' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: false, placeholder: 'e.g. Discover More', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const cinematicProductShowcaseFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g. NovaSpark', section: 'Brand', defaultValue: 'NovaSpark' },
  { key: 'tagline', label: 'Tagline', type: 'text', required: false, placeholder: 'e.g. Ignite Your Growth', section: 'Brand' },
  { key: 'brandLogoUrl', label: 'Brand Logo', type: 'image', required: false, section: 'Brand', imageLabel: 'Brand logo' },
  { key: 'productName', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g. NovaSpark Pro', section: 'Product', defaultValue: 'NovaSpark Pro' },
  { key: 'productImageUrl', label: 'Product Image', type: 'image', required: false, section: 'Product', imageLabel: 'Product image' },
  { key: 'price', label: 'Price', type: 'text', required: false, placeholder: '$49 / mo', section: 'Product' },
  { key: 'originalPrice', label: 'Original Price', type: 'text', required: false, placeholder: '$69 / mo', section: 'Product' },
  { key: 'discount', label: 'Discount', type: 'text', required: false, placeholder: '30% OFF', section: 'Product' },
  { key: 'feature1', label: 'Feature 1', type: 'text', required: false, placeholder: 'Key feature', section: 'Key Features' },
  { key: 'feature2', label: 'Feature 2', type: 'text', required: false, placeholder: 'Key feature', section: 'Key Features' },
  { key: 'feature3', label: 'Feature 3', type: 'text', required: false, placeholder: 'Key feature', section: 'Key Features' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Start Free Trial', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const dataStatisticsExplainerFields: TemplateFieldDefinition[] = [
  { key: 'brandName', label: 'Brand / Author', type: 'text', required: false, placeholder: 'e.g. DataViz Inc.', section: 'Source', defaultValue: 'NovaSpark' },
  { key: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'e.g. Remote Work Trends 2026', section: 'Content', defaultValue: 'Launch Smarter. Grow Faster.' },
  { key: 'title', label: 'Title', type: 'text', required: false, placeholder: 'e.g. Remote Work Trends', section: 'Content' },
  { key: 'subtitle', label: 'Subtitle', type: 'text', required: false, placeholder: 'e.g. A data-driven look at the future', section: 'Content' },
  { key: 'statistic', label: 'Main Statistic', type: 'number', required: true, placeholder: 'e.g. 78', section: 'Statistics', defaultValue: 78 },
  { key: 'percentage', label: 'Percentage', type: 'number', required: false, placeholder: 'e.g. 85', section: 'Statistics' },
  { key: 'chartData', label: 'Chart Data', type: 'array', required: false, placeholder: '10, 25, 45, 70, 90', section: 'Chart', hint: 'Comma-separated numbers', arrayCount: 1 },
  { key: 'labels', label: 'Chart Labels', type: 'array', required: false, placeholder: 'Jan, Feb, Mar, Apr, May', section: 'Chart', hint: 'Comma-separated labels', arrayCount: 1 },
  { key: 'source', label: 'Source', type: 'text', required: false, placeholder: 'e.g. McKinsey Global Institute', section: 'Source' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Read Full Report', section: 'Call to Action', defaultValue: 'Start Free Trial' },
];

const breakingNewsIntroFields: TemplateFieldDefinition[] = [
  { key: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'e.g. GLOBAL CRISIS ESCALATES', section: 'Content', defaultValue: 'GLOBAL CRISIS ESCALATES' },
  { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. WORLD NEWS', section: 'Content', defaultValue: 'WORLD NEWS' },
  { key: 'productName', label: 'Headline Display', type: 'text', required: false, placeholder: 'Alternative headline text', section: 'Content', defaultValue: 'GLOBAL CRISIS ESCALATES' },
  { key: 'productImageUrl', label: 'News Image', type: 'image', required: false, section: 'Media', imageLabel: 'News image' },
  { key: 'location', label: 'Location', type: 'text', required: false, placeholder: 'e.g. Eastern Europe', section: 'Details' },
  { key: 'date', label: 'Date', type: 'text', required: false, placeholder: 'e.g. March 15, 2026', section: 'Details' },
  { key: 'statistic', label: 'Statistic', type: 'number', required: false, placeholder: 'e.g. 2400000', section: 'Statistics' },
  { key: 'bodyText', label: 'Statistic Label', type: 'text', required: false, placeholder: 'e.g. People Affected', section: 'Statistics' },
  { key: 'source', label: 'Source', type: 'text', required: false, placeholder: 'e.g. CNN', section: 'Source' },
  { key: 'tickerText', label: 'Ticker Text', type: 'text', required: false, placeholder: 'e.g. Breaking news updates every minute', section: 'Ticker' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: true, placeholder: 'e.g. Watch Live', section: 'Call to Action', defaultValue: 'Watch Live' },
];

const cinematicMovieTrailerFields: TemplateFieldDefinition[] = [
  { key: 'headline', label: 'Main Title', type: 'text', required: true, placeholder: 'e.g. THE FUTURE IS NOW', section: 'Title', defaultValue: 'THE FUTURE IS NOW' },
  { key: 'subtitle', label: 'Subtitle', type: 'text', required: false, placeholder: 'e.g. A NEW ERA BEGINS', section: 'Title', defaultValue: 'A NEW ERA BEGINS' },
  { key: 'category', label: 'Category', type: 'text', required: false, placeholder: 'e.g. ORIGINAL SERIES', section: 'Title', defaultValue: 'ORIGINAL SERIES' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short cinematic description', section: 'Story', hint: 'Max 160 characters' },
  { key: 'productImageUrl', label: 'Main Visual', type: 'image', required: false, section: 'Visual', imageLabel: 'Main visual image' },
  { key: 'statistic', label: 'Statistic', type: 'number', required: false, placeholder: 'e.g. 82', section: 'Statistics', defaultValue: 82 },
  { key: 'statisticLabel', label: 'Statistic Label', type: 'text', required: false, placeholder: 'e.g. OF BUSINESSES ARE ADOPTING AI', section: 'Statistics', defaultValue: 'OF BUSINESSES ARE ADOPTING AI' },
  { key: 'year', label: 'Year', type: 'text', required: false, placeholder: 'e.g. 2026', section: 'Details', defaultValue: '2026' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: false, placeholder: 'e.g. Watch Trailer', section: 'Call to Action', defaultValue: 'Watch Trailer' },
];

const top10CountdownFields: TemplateFieldDefinition[] = [
  { key: 'headline', label: 'List Title (Header)', type: 'text', required: true, placeholder: 'e.g. TOP 10', section: 'Header', defaultValue: 'TOP 10' },
  { key: 'listTitle', label: 'List Title', type: 'text', required: false, placeholder: 'e.g. This Week\'s Top 10', section: 'Header' },
  { key: 'rank', label: 'Starting Rank', type: 'number', required: false, placeholder: 'e.g. 10', section: 'Ranking', defaultValue: 10 },
  { key: 'itemTitle', label: 'Item Title', type: 'text', required: true, placeholder: 'e.g. The Ultimate Ranking', section: 'Content', defaultValue: 'The Ultimate Ranking' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short description of the ranked item', section: 'Content', hint: 'Max 160 characters' },
  { key: 'image', label: 'Item Image', type: 'image', required: false, section: 'Media', imageLabel: 'Item image' },
  { key: 'statistic', label: 'Statistic', type: 'number', required: false, placeholder: 'e.g. 98', section: 'Statistics', defaultValue: 98 },
  { key: 'statisticLabel', label: 'Statistic Label', type: 'text', required: false, placeholder: 'e.g. Viral Score', section: 'Statistics' },
  { key: 'category', label: 'Category', type: 'text', required: false, placeholder: 'e.g. Trending', section: 'Badge' },
  { key: 'accentText', label: 'Accent Text', type: 'text', required: false, placeholder: 'e.g. #1 Spot', section: 'Badge' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: false, placeholder: 'e.g. Watch Full List', section: 'Call to Action', defaultValue: 'Watch Full List' },
];

const top5CountdownFields: TemplateFieldDefinition[] = [
  { key: 'headline', label: 'List Title (Header)', type: 'text', required: true, placeholder: 'e.g. TOP 5', section: 'Header', defaultValue: 'TOP 5' },
  { key: 'listTitle', label: 'List Title', type: 'text', required: false, placeholder: 'e.g. This Week\'s Top 5', section: 'Header' },
  { key: 'rank', label: 'Starting Rank', type: 'number', required: false, placeholder: 'e.g. 5', section: 'Ranking', defaultValue: 5 },
  { key: 'itemTitle', label: 'Item Title', type: 'text', required: true, placeholder: 'e.g. The Ultimate Ranking', section: 'Content', defaultValue: 'The Ultimate Ranking' },
  { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Short description of the ranked item', section: 'Content', hint: 'Max 160 characters' },
  { key: 'image', label: 'Item Image', type: 'image', required: false, section: 'Media', imageLabel: 'Item image' },
  { key: 'statistic', label: 'Statistic', type: 'number', required: false, placeholder: 'e.g. 99', section: 'Statistics', defaultValue: 99 },
  { key: 'statisticLabel', label: 'Statistic Label', type: 'text', required: false, placeholder: 'e.g. Overall Score', section: 'Statistics' },
  { key: 'category', label: 'Category', type: 'text', required: false, placeholder: 'e.g. Trending', section: 'Badge' },
  { key: 'accentText', label: 'Accent Text', type: 'text', required: false, placeholder: 'e.g. #1 Pick', section: 'Badge' },
  { key: 'ctaText', label: 'CTA Text', type: 'text', required: false, placeholder: 'e.g. Watch Full List', section: 'Call to Action', defaultValue: 'Watch Full List' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const templateFieldConfigs: Record<TemplateId, TemplateFieldDefinition[]> = {
  'product-advertisement': productAdFields,
  'restaurant-promotion': restaurantPromotionFields,
  'sale-promotion': salePromotionFields,
  'cinematic-documentary': cinematicDocumentaryFields,
  'luxury-commercial': luxuryCommercialFields,
  'cinematic-product-showcase': cinematicProductShowcaseFields,
  'data-statistics-explainer': dataStatisticsExplainerFields,
  'breaking-news-intro': breakingNewsIntroFields,
  'top-10-countdown': top10CountdownFields,
  'top-5-countdown': top5CountdownFields,
  'cinematic-movie-trailer': cinematicMovieTrailerFields,
};

/** Returns the field configuration for a template, or an empty array if unknown. */
export function getTemplateFields(templateId: TemplateId): TemplateFieldDefinition[] {
  return templateFieldConfigs[templateId] ?? [];
}
