import type { VideoContent } from '@/types';

/**
 * Default content for the DocumentaryIntro template.
 * A prestige historical docuseries opening.
 */
export const documentaryDefaultContent: VideoContent = {
  brand: {
    name: 'Meridian Pictures',
    tagline: 'True stories, told deeply',
    primaryColor: '#C9A24B', // archival gold
    accentColor: '#EAE3D2',  // aged cream
    websiteUrl: 'https://meridianpictures.example',
  },
  product: {
    name: 'The Long Shadow',
    description: 'How one summer in 1914 redrew the map of the world.',
    features: [
      'Episode One — The Gathering Storm',
      'Episode Two — The Breaking Point',
      'Episode Three — The New World',
    ],
  },
  cta: {
    text: 'Stream All Episodes',
    url: 'https://meridianpictures.example/the-long-shadow',
    subtext: 'Premieres December 14',
  },
  headline: 'The Long Shadow',
  bodyText: 'Some events never truly end. They only wait.',
};