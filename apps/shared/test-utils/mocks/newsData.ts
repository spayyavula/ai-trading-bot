import { MarketData } from '../../types';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: number;
  symbols: string[];
  categories: string[];
}

interface SentimentData {
  symbol: string;
  sentiment: number;
  trend: string;
  newsCount: number;
  socialMentions: number;
  technicalScore: number;
  fundamentalScore: number;
}

// News categories
const NEWS_CATEGORIES = [
  'Earnings',
  'Mergers & Acquisitions',
  'Product Launch',
  'Regulatory',
  'Market Analysis',
  'Economic Data',
  'Company News',
  'Industry News',
];

// News sources
const NEWS_SOURCES = [
  'Bloomberg',
  'Reuters',
  'CNBC',
  'Wall Street Journal',
  'Financial Times',
  'MarketWatch',
  'Seeking Alpha',
  'Business Insider',
];

// Generate mock news item
export const generateNewsItem = (
  symbols: string[],
  marketData: Record<string, MarketData>
): NewsItem => {
  const id = Math.random().toString(36).substring(7);
  const source = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
  const categories = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => NEWS_CATEGORIES[Math.floor(Math.random() * NEWS_CATEGORIES.length)]
  );

  // Generate sentiment based on price movement
  const sentiment = symbols.reduce((acc, symbol) => {
    const data = marketData[symbol];
    return acc + (data.changePercent > 0 ? 0.1 : -0.1);
  }, 0) / symbols.length;

  // Generate title and content based on sentiment and categories
  const title = generateNewsTitle(symbols, categories, sentiment);
  const content = generateNewsContent(symbols, categories, sentiment, marketData);

  return {
    id,
    title,
    content,
    source,
    url: `https://${source.toLowerCase().replace(/\s+/g, '')}.com/news/${id}`,
    publishedAt: new Date().toISOString(),
    sentiment,
    symbols,
    categories,
  };
};

// Generate news title
const generateNewsTitle = (
  symbols: string[],
  categories: string[],
  sentiment: number
): string => {
  const symbolStr = symbols.join(', ');
  const category = categories[0];
  const sentimentWord = sentiment > 0.3 ? 'Surges' : sentiment < -0.3 ? 'Plummets' : 'Moves';
  
  return `${symbolStr} ${sentimentWord} on ${category} News`;
};

// Generate news content
const generateNewsContent = (
  symbols: string[],
  categories: string[],
  sentiment: number,
  marketData: Record<string, MarketData>
): string => {
  const symbolData = symbols.map(symbol => {
    const data = marketData[symbol];
    return `${symbol} is trading at $${data.price.toFixed(2)}, ${data.changePercent > 0 ? 'up' : 'down'} ${Math.abs(data.changePercent).toFixed(2)}%`;
  }).join('. ');

  const categoryDesc = categories.map(category => {
    switch (category) {
      case 'Earnings':
        return 'reported better-than-expected earnings';
      case 'Mergers & Acquisitions':
        return 'announced a strategic acquisition';
      case 'Product Launch':
        return 'unveiled a new product line';
      case 'Regulatory':
        return 'received regulatory approval';
      default:
        return 'released market update';
    }
  }).join(' and ');

  return `${symbolData}. The company ${categoryDesc}. Analysts are ${sentiment > 0.3 ? 'bullish' : sentiment < -0.3 ? 'bearish' : 'neutral'} on the stock's prospects.`;
};

// Generate sentiment data
export const generateSentimentData = (
  symbol: string,
  marketData: MarketData,
  newsItems: NewsItem[]
): SentimentData => {
  const symbolNews = newsItems.filter(item => item.symbols.includes(symbol));
  const sentiment = symbolNews.reduce((acc, item) => acc + item.sentiment, 0) / (symbolNews.length || 1);
  
  return {
    symbol,
    sentiment,
    trend: sentiment > 0.3 ? 'Bullish' : sentiment < -0.3 ? 'Bearish' : 'Neutral',
    newsCount: symbolNews.length,
    socialMentions: Math.floor(Math.random() * 1000),
    technicalScore: (Math.random() * 2) - 1,
    fundamentalScore: (Math.random() * 2) - 1,
  };
};

// Generate batch of news items
export const generateNewsBatch = (
  symbols: string[],
  marketData: Record<string, MarketData>,
  count: number = 10
): NewsItem[] => {
  return Array.from({ length: count }, () => {
    const selectedSymbols = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => symbols[Math.floor(Math.random() * symbols.length)]
    );
    return generateNewsItem(selectedSymbols, marketData);
  });
};

// Generate batch of sentiment data
export const generateSentimentBatch = (
  symbols: string[],
  marketData: Record<string, MarketData>,
  newsItems: NewsItem[]
): Record<string, SentimentData> => {
  return symbols.reduce((acc, symbol) => {
    acc[symbol] = generateSentimentData(symbol, marketData[symbol], newsItems);
    return acc;
  }, {} as Record<string, SentimentData>);
}; 