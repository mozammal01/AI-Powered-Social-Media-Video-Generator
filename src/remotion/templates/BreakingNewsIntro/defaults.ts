export interface BreakingNewsStatistic {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export const breakingNewsIntroDefaultContent = {
  headline: 'GLOBAL CRISIS ESCALATES',
  category: 'WORLD NEWS',
  location: 'Eastern Europe',
  date: 'March 15, 2026',
  statistic: {
    value: 2400000,
    label: 'People Affected',
    prefix: '',
    suffix: '+',
  },
  imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?q=80&w=1000&auto=format&fit=crop',
  source: 'CNN',
  tickerText: 'Breaking news updates every minute',
};

export type BreakingNewsIntroDefaultContent =
  typeof breakingNewsIntroDefaultContent;
