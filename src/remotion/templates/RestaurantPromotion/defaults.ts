import type { VideoContent } from '@/types';

/**
 * Default content for the RestaurantPromotion template.
 * A warm, family-style restaurant demo.
 */
export const restaurantDefaultContent: VideoContent = {
  brand: {
    name: 'Bella Cucina',
    tagline: 'Authentic Italian Kitchen',
    primaryColor: '#F59E0B', // amber-500
    accentColor: '#EF4444', // red-500
    websiteUrl: 'https://bellacucina.example.com',
  },
  product: {
    name: 'Truffle Tagliatelle',
    description:
      'Handmade pasta tossed in black truffle cream, finished with aged parmesan.',
    originalPrice: '$28',
    price: '$19',
    discount: 'Chef Special',
    features: [
      'Wood-fired Margherita Pizza',
      'Slow-braised Beef Ragu',
      'Tiramisu made fresh daily',
      'Curated Italian wine list',
    ],
    imageUrl: '/demo/product.svg',
  },
  cta: {
    text: 'Reserve a Table',
    url: 'https://bellacucina.example.com/reservations',
    subtext: 'Open Tue–Sun · 5pm–11pm',
  },
  headline: "Tonight's Signature",
  bodyText:
    'Every plate is crafted from recipes passed down through three generations.',
};