export interface GeopoliticalEvent {
  id: string;
  time: string;
  headline: string;
  location: string;
  coordinates?: { x: number; y: number };
  impact: 'high' | 'medium' | 'low';
}

export interface NewsCardData {
  id: string;
  headline: string;
  source: string;
  category: string;
}

export interface RouteData {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  label?: string;
}

export const newsGeopoliticalExplainerDefaultContent = {
  headline: 'GLOBAL CRISIS',
  subheadline: 'Escalating tensions in Eastern Europe',
  liveIndicator: true,
  tickerHeadlines: [
    'NATO convenes emergency session in Brussels',
    'UN Security Council votes on resolution',
    'Markets tumble as oil prices spike',
    'Evacuation orders issued for border regions',
    'International aid organizations mobilize',
    'Diplomatic channels remain open',
  ],
  events: [
    {
      id: 'evt-1',
      time: '06:00',
      headline: 'Initial Reports',
      location: 'Border Region',
      coordinates: { x: 520, y: 130 },
      impact: 'medium' as const,
    },
    {
      id: 'evt-2',
      time: '08:30',
      headline: 'Emergency Declared',
      location: 'Capital City',
      coordinates: { x: 540, y: 140 },
      impact: 'high' as const,
    },
    {
      id: 'evt-3',
      time: '10:00',
      headline: 'International Response',
      location: 'Allied Nations',
      coordinates: { x: 480, y: 120 },
      impact: 'high' as const,
    },
    {
      id: 'evt-4',
      time: '12:30',
      headline: 'Humanitarian Corridor',
      location: 'Safe Zone',
      coordinates: { x: 560, y: 150 },
      impact: 'medium' as const,
    },
  ] as GeopoliticalEvent[],
  newsCards: [
    {
      id: 'card-1',
      headline: 'Markets see steepest drop since 2008',
      source: 'Financial Times',
      category: 'Economy',
    },
    {
      id: 'card-2',
      headline: 'UN deploys peacekeeping forces',
      source: 'Reuters',
      category: 'Diplomacy',
    },
    {
      id: 'card-3',
      headline: 'Oil prices surge 15% on supply fears',
      source: 'Bloomberg',
      category: 'Energy',
    },
  ] as NewsCardData[],
  routes: [
    {
      id: 'route-1',
      from: { x: 520, y: 130 },
      to: { x: 540, y: 140 },
      label: ' troop movement',
    },
    {
      id: 'route-2',
      from: { x: 540, y: 140 },
      to: { x: 480, y: 120 },
      label: 'diplomatic channel',
    },
  ] as RouteData[],
  statistics: [
    { id: 'stat-1', value: '2.4M', label: 'Displaced Civilians' },
    { id: 'stat-2', value: '47', label: 'Countries Involved' },
    { id: 'stat-3', value: '$180B', label: 'Economic Impact' },
  ],
  chartData: [80, 65, 45, 30, 20, 15, 5],
  summaryHeadline: 'World Watches as Crisis Deepens',
  summaryBody: 'International community scrambles to respond as humanitarian situation deteriorates. Markets react sharply to uncertainty.',
} as const;

export type NewsGeopoliticalExplainerDefaultContent =
  typeof newsGeopoliticalExplainerDefaultContent;
