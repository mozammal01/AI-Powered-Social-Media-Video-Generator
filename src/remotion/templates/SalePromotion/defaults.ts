import type { VideoContent } from '@/types';

/**
 * Default content for the SalePromotion template.
 * A high-energy flash-sale demo.
 */
export const saleDefaultContent: VideoContent = {
  brand: {
    name: 'VoltGear',
    tagline: 'Flash Sale · 48 Hours Only',
    primaryColor: '#EC4899', // pink-500
    accentColor: '#F97316', // orange-500
    websiteUrl: 'https://voltgear.example.com',
  },
  product: {
    name: 'Volt X1 Wireless Headphones',
    description:
      'Studio-grade sound, 40-hour battery, and active noise cancelling — now at their lowest price ever.',
    originalPrice: '$199',
    price: '$99',
    discount: '50% OFF',
    features: [
      'Free express shipping',
      'Extra 10% off with code VOLT10',
      '30-day money-back guarantee',
      'Extended 2-year warranty included',
    ],
    imageUrl: '/demo/product.svg',
  },
  cta: {
    text: 'Shop the Sale',
    url: 'https://voltgear.example.com/sale',
    subtext: 'Ends Sunday midnight — while stock lasts',
  },
  headline: 'Mega Sale',
  bodyText:
    'Our biggest drop of the season. Once the timer hits zero, prices go back up.',
};