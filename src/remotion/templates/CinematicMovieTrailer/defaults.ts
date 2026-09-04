import type { VideoContentProps } from '@/remotion/schema';

export const cinematicMovieTrailerDefaultContent: VideoContentProps = {
  brand: {
    name: 'Cinematic Movie Trailer',
    tagline: 'A New Era Begins',
    primaryColor: '#D4A853',
    accentColor: '#F0E6D3',
  },
  product: {
    name: 'THE FUTURE IS NOW',
    description: 'Technology is changing the way we imagine tomorrow.',
    imageUrl: '',
  },
  cta: {
    text: 'Watch Trailer',
    subtext: 'Coming Soon',
    url: '',
  },
  headline: 'THE FUTURE IS NOW',
  bodyText: 'Technology is changing the way we imagine tomorrow.',
  title: 'THE FUTURE IS NOW',
  subtitle: 'A NEW ERA BEGINS',
  category: 'ORIGINAL SERIES',
  image: '',
  statistic: 82,
  statisticLabel: 'OF BUSINESSES ARE ADOPTING AI',
  year: '2026',
};

export type CinematicMovieTrailerDefaultContent = typeof cinematicMovieTrailerDefaultContent;
