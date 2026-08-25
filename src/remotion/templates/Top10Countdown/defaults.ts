export interface ListItemData {
  rank: number;
  title: string;
  description: string;
  imageSrc: string;
  statistic?: {
    value: string;
    label: string;
  };
}

export const top10CountdownDefaultContent = {
  items: [
    {
      rank: 10,
      title: 'Deep Ocean Trenches',
      description: 'The Mariana Trench reaches 36,000 feet — deeper than Mount Everest is tall.',
      imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '36,070', label: 'Feet Deep' },
    },
    {
      rank: 9,
      title: 'Ancient Sequoia Forests',
      description: 'Some trees have stood for over 3,000 years, witnessing the rise of civilizations.',
      imageSrc: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '3,000+', label: 'Years Old' },
    },
    {
      rank: 8,
      title: 'Volcanic Lightning Storms',
      description: 'When ash collides with ice in eruption columns, nature creates its own fireworks.',
      imageSrc: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '10,000', label: 'Volcanoes Active' },
    },
    {
      rank: 7,
      title: 'Bioluminescent Bays',
      description: 'Tiny organisms light up the water when disturbed, turning waves into liquid stars.',
      imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '720K', label: 'Organisms per Liter' },
    },
    {
      rank: 6,
      title: 'Singing Sand Dunes',
      description: 'In deserts worldwide, sand avalanches produce a low-frequency hum audible for miles.',
      imageSrc: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '105', label: 'Decibels at Peak' },
    },
    {
      rank: 5,
      title: 'Cave of Crystals',
      description: 'Mexico\'s Cave of Crystals houses selenite columns up to 39 feet long.',
      imageSrc: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '39 ft', label: 'Longest Crystal' },
    },
    {
      rank: 4,
      title: 'Aurora Borealis',
      description: 'Solar winds collide with Earth\'s atmosphere to paint the polar skies in green and violet.',
      imageSrc: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '96', label: 'km Above Surface' },
    },
    {
      rank: 3,
      title: 'Grand Prismatic Spring',
      description: 'Thermophilic bacteria create a living rainbow across Yellowstone\'s largest hot spring.',
      imageSrc: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '160°F', label: 'Water Temperature' },
    },
    {
      rank: 2,
      title: 'Sailing Stone Valleys',
      description: 'In Death Valley, rocks slide across cracked earth without human intervention.',
      imageSrc: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '700 lbs', label: 'Heaviest Stone' },
    },
    {
      rank: 1,
      title: 'Northern Lights Above Volcanoes',
      description: 'Iceland\'s midnight sun sets the stage for the most spectacular light show on Earth.',
      imageSrc: 'https://images.unsplash.com/photo-1520769946591-0e8d053f9405?auto=format&fit=crop&w=1280&q=80',
      statistic: { value: '∞', label: 'Possibilities' },
    },
  ],
} as const;
