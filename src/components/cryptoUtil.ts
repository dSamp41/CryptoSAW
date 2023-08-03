export interface Crypto {
  name: string; 
  symbol: string;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
  volumeUsd24Hr: number;
  timestamp: number;
}

export const START_CRYPTO = {
  name: "*",
  symbol: "*",
  priceUsd: 0.0,
  changePercent24Hr: 0.0,
  marketCapUsd: 0.0,
  volumeUsd24Hr: 0.0,
  timestamp: 0.0
};

export type NotifEvent = {
  asset: string,
  direction: string,
  value: number
}