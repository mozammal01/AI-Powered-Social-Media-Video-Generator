export interface StockPoint {
  frame: number;
  value: number;
}

export interface MarketData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
}

export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CompanyData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio?: number;
}

export const financeMarketBreakdownDefaultContent = {
  headline: 'Market Breakdown',
  subheadline: 'S&P 500 hits record high as tech leads rally',
  chartData: [
    { frame: 0, value: 4450 },
    { frame: 30, value: 4480 },
    { frame: 60, value: 4520 },
    { frame: 90, value: 4510 },
    { frame: 120, value: 4550 },
    { frame: 150, value: 4580 },
    { frame: 180, value: 4620 },
    { frame: 210, value: 4600 },
    { frame: 240, value: 4650 },
    { frame: 270, value: 4680 },
    { frame: 300, value: 4720 },
    { frame: 330, value: 4750 },
    { frame: 360, value: 4780 },
    { frame: 390, value: 4820 },
    { frame: 420, value: 4850 },
    { frame: 450, value: 4900 },
  ] as StockPoint[],
  comparisonChartData: [
    { frame: 0, value: 175 },
    { frame: 30, value: 178 },
    { frame: 60, value: 182 },
    { frame: 90, value: 180 },
    { frame: 120, value: 186 },
    { frame: 150, value: 190 },
    { frame: 180, value: 195 },
    { frame: 210, value: 193 },
    { frame: 240, value: 198 },
    { frame: 270, value: 202 },
    { frame: 300, value: 208 },
    { frame: 330, value: 212 },
    { frame: 360, value: 218 },
    { frame: 390, value: 222 },
    { frame: 420, value: 228 },
    { frame: 450, value: 235 },
  ] as StockPoint[],
  companies: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 198.45,
      change: 2.34,
      changePercent: 1.19,
      marketCap: '3.05T',
      peRatio: 31.2,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 415.20,
      change: -1.85,
      changePercent: -0.44,
      marketCap: '3.08T',
      peRatio: 36.8,
    },
  ] as CompanyData[],
  marketCards: [
    {
      symbol: 'SPY',
      company: 'S&P 500 ETF',
      price: 512.30,
      change: 8.45,
      changePercent: 1.68,
      volume: '85M',
    },
    {
      symbol: 'QQQ',
      company: 'Nasdaq 100 ETF',
      price: 438.90,
      change: 12.30,
      changePercent: 2.89,
      volume: '62M',
    },
    {
      symbol: 'DIA',
      company: 'Dow Jones ETF',
      price: 385.20,
      change: -2.10,
      changePercent: -0.54,
      volume: '18M',
    },
  ] as MarketData[],
  tickerItems: [
    { symbol: 'AAPL', price: 198.45, change: 2.34, changePercent: 1.19 },
    { symbol: 'MSFT', price: 415.20, change: -1.85, changePercent: -0.44 },
    { symbol: 'GOOGL', price: 175.30, change: 3.20, changePercent: 1.86 },
    { symbol: 'AMZN', price: 185.60, change: 4.10, changePercent: 2.26 },
    { symbol: 'NVDA', price: 875.40, change: 18.90, changePercent: 2.21 },
    { symbol: 'TSLA', price: 245.80, change: -5.60, changePercent: -2.22 },
    { symbol: 'META', price: 505.20, change: 7.80, changePercent: 1.57 },
    { symbol: 'BRK.B', price: 408.50, change: 1.25, changePercent: 0.31 },
  ] as TickerItem[],
  timelineSteps: [
    { label: 'Open', color: '#6366F1' },
    { label: 'Midday', color: '#A855F7' },
    { label: 'Close', color: '#EC4899' },
    { label: 'After', color: '#14B8A6' },
  ],
} as const;

export type FinanceMarketBreakdownDefaultContent =
  typeof financeMarketBreakdownDefaultContent;
