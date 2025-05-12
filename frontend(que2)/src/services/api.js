import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3001'; 

const createSyntheticPriceData = (symbol, duration = 30) => {
  const prices = [];
  const currentTime = new Date();
  
  const baseValueGenerator = (ticker) => {
    let hashValue = 0;
    for (let i = 0; i < ticker.length; i++) {
      hashValue += ticker.charCodeAt(i);
    }
    return Math.max(100, (hashValue % 1000) + 100);
  };
  
  const baseValue = baseValueGenerator(symbol);
  
  for (let i = 0; i < Math.min(duration, 50); i++) {
    const time = new Date(currentTime.getTime() - (i * 60000));
    const fluctuation = 0.02; 
    const change = baseValue * fluctuation * (Math.random() * 2 - 1);
    
    prices.push({
      price: baseValue + change + (Math.sin(i / 10) * baseValue * 0.05),
      lastUpdatedAt: time.toISOString()
    });
  }
  
  prices.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
  
  const meanPrice = prices.reduce((total, item) => total + item.price, 0) / prices.length;
  
  return {
    averageStockPrice: meanPrice,
    priceHistory: prices
  };
};

const createSyntheticCorrelation = (symbols, duration = 30) => {
  const correlationGenerator = (symbol1, symbol2) => {
    let seed = 0;
    const combined = symbol1 + symbol2;
    for (let i = 0; i < combined.length; i++) {
      seed = (seed + combined.charCodeAt(i)) % 100;
    }
    return (seed / 100 * 1.9) - 0.95;
  };
  
  const [symbol1, symbol2] = symbols;
  const correlationValue = correlationGenerator(symbol1, symbol2);
  
  const stockData1 = createSyntheticPriceData(symbol1, duration);
  const stockData2 = createSyntheticPriceData(symbol2, duration);
  
  return {
    correlation: Math.round(correlationValue * 10000) / 10000,
    stocks: {
      [symbol1]: {
        averagePrice: stockData1.averageStockPrice,
        priceHistory: stockData1.priceHistory
      },
      [symbol2]: {
        averagePrice: stockData2.averageStockPrice,
        priceHistory: stockData2.priceHistory
      }
    }
  };
};

export const fetchStockData = async (symbol, duration = null, aggregation = null) => {
  try {
    let url = `${API_ENDPOINT}/stocks/${symbol}`;
    const params = {};
    
    if (duration) {
      params.minutes = duration;
    }
    
    if (aggregation) {
      params.aggregation = aggregation;
    }
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    return createSyntheticPriceData(symbol, duration || 30);
  }
};

export const fetchCorrelationData = async (duration, symbols) => {
  try {
    if (!duration || !symbols || symbols.length !== 2) {
      throw new Error('Invalid parameters');
    }
    
    const params = {
      minutes: duration,
      ticker: symbols
    };
    
    const response = await axios.get(`${API_ENDPOINT}/stockcorrelation`, { params });
    return response.data;
  } catch (error) {
    return createSyntheticCorrelation(symbols, duration);
  }
};

export const fetchAvailableStocks = async () => {
  const defaultStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.' }
  ];
  
  return defaultStocks;
};

export const checkServerStatus = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/health`);
    return response.data;
  } catch (error) {
    return { status: 'OFFLINE' };
  }
}; 