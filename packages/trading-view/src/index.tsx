import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
  interval?: string;
  theme?: 'light' | 'dark';
  style?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  save_image?: boolean;
  hideideas?: boolean;
  studies?: string[];
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  width = '100%',
  height = 500,
  interval = 'D',
  theme = 'dark',
  style = '1',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  save_image = true,
  hideideas = false,
  studies = ['RSI@tv-basicstudies', 'MACD@tv-basicstudies']
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          symbol,
          width,
          height,
          interval,
          theme,
          style,
          locale,
          toolbar_bg,
          enable_publishing,
          allow_symbol_change,
          save_image,
          hideideas,
          studies,
          container_id: container.current.id
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [symbol, width, height, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, save_image, hideideas, studies]);

  return <div id="tradingview_widget" ref={container} style={{ width, height }} />;
};

export default TradingViewWidget; 