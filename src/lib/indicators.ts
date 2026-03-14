/**
 * Technical Analysis Indicators for PayPulse Co-Pilot
 */

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Relative Strength Index (RSI)
 */
export const calculateRSI = (data: KlineData[], period: number = 14): number => {
  if (data.length <= period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[data.length - i].close - data[data.length - i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

/**
 * Exponential Moving Average (EMA)
 */
export const calculateEMA = (data: KlineData[], period: number): number => {
  const k = 2 / (period + 1);
  let ema = data[0].close;

  for (let i = 1; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
  }

  return ema;
};

/**
 * Bollinger Bands
 */
export const calculateBollingerBands = (data: KlineData[], period: number = 20, stdDevs: number = 2) => {
  const slice = data.slice(-period);
  const closes = slice.map(d => d.close);
  const sma = closes.reduce((a, b) => a + b, 0) / period;
  
  const variance = closes.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
  const standardDeviation = Math.sqrt(variance);

  return {
    middle: sma,
    upper: sma + standardDeviation * stdDevs,
    lower: sma - standardDeviation * stdDevs,
  };
};
