import type { TimelineStep } from '@/remotion/animations/Timeline';
import type { FlowNode } from '@/remotion/animations/DataFlowAnimation';

export interface RevenueStream {
  id: string;
  label: string;
  percentage: number;
  color: string;
  description: string;
}

export const techBusinessExplainerDefaultContent = {
  headline: 'How AI Companies Make Money',
  subheadline: 'From data to dollars — the modern revenue engine',
  brand: {
    name: 'AI Economics',
    primaryColor: '#6366F1',
    accentColor: '#A855F7',
  },
  revenueStreams: [
    {
      id: 'subscription',
      label: 'Subscriptions',
      percentage: 45,
      color: '#6366F1',
      description: 'Recurring SaaS plans powering predictable, compounding revenue.',
    },
    {
      id: 'api',
      label: 'API Usage',
      percentage: 28,
      color: '#A855F7',
      description: 'Pay-per-token or pay-per-call infrastructure for developers.',
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      percentage: 18,
      color: '#EC4899',
      description: 'Custom deployments, SLAs, and dedicated support contracts.',
    },
    {
      id: 'ads',
      label: 'Ads & Data',
      percentage: 9,
      color: '#14B8A6',
      description: 'Contextual placements and anonymized data licensing.',
    },
  ] as RevenueStream[],
  timelineSteps: [
    { label: 'Data', color: '#6366F1' },
    { label: 'Train', color: '#A855F7' },
    { label: 'Productize', color: '#EC4899' },
    { label: 'Monetize', color: '#14B8A6' },
  ] as TimelineStep[],
  flowNodes: [
    { id: 'data', label: 'DATA', x: 200, y: 540, color: '#6366F1' },
    { id: 'train', label: 'TRAIN', x: 600, y: 300, color: '#A855F7' },
    { id: 'api', label: 'API', x: 1000, y: 300, color: '#EC4899' },
    { id: 'product', label: 'PRODUCT', x: 1400, y: 540, color: '#14B8A6' },
  ] as FlowNode[],
  flowConnections: [
    { from: 'data', to: 'train' },
    { from: 'train', to: 'api' },
    { from: 'api', to: 'product' },
  ] as Array<{ from: string; to: string }>,
} as const;

export type TechBusinessExplainerDefaultContent =
  typeof techBusinessExplainerDefaultContent;
