export const cinematicProductShowcaseDefaultContent = {
  brand: {
    name: 'Aether Audio',
    tagline: 'Sound reimagined',
    logoUrl: '',
    primaryColor: '#6366F1',
    accentColor: '#A855F7',
    websiteUrl: 'https://aetheraudio.example',
  },
  product: {
    name: 'Aether One',
    description: 'Premium wireless headphones with spatial audio.',
    originalPrice: '$349',
    price: '$249',
    discount: '29%',
    features: [
      'Spatial Audio',
      '40-Hour Battery',
      'Noise Cancellation',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
  },
  cta: {
    text: 'Shop Now',
    subtext: 'Free shipping worldwide',
    url: 'https://aetheraudio.example/shop',
  },
  headline: 'Aether One',
  bodyText: 'Premium wireless headphones with spatial audio.',
};

export type CinematicProductShowcaseDefaultContent =
  typeof cinematicProductShowcaseDefaultContent;
