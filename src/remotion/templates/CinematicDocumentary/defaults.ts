import type { VideoContent } from '@/types';

export const cinematicDocumentaryDefaultContent: VideoContent = {
  brand: {
    name: 'Aether Films',
    tagline: 'Stories that shaped the world',
    primaryColor: '#D4A853',
    accentColor: '#F0E6D3',
    websiteUrl: 'https://aetherfilms.example',
  },
  product: {
    name: 'The Turning Point',
    description: 'How one decision changed the course of history forever.',
    features: [
      'Episode One — The Decision',
      'Episode Two — The Aftermath',
      'Episode Three — The Legacy',
    ],
  },
  cta: {
    text: 'Stream Now',
    url: 'https://aetherfilms.example/the-turning-point',
    subtext: 'Available on all platforms',
  },
  headline: 'The Turning Point',
  bodyText: 'History is not made by grand gestures alone. It is forged in the quiet moments when courage meets consequence.',
};
