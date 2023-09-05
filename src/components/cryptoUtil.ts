export interface Crypto {
  name: string; 
  symbol: string;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
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

export type AssetDataObj = {
  "id": string,
  "symbol": string,
  "name": string,
  "supply": string,
  "maxSupply": string,
  "marketCapUsd": string,
  "volumeUsd24Hr": string,
  "priceUsd": string,
  "changePercent24Hr": string,
  "vwap24Hr": string
}

export function RespToCrypto(resp: AssetDataObj): Crypto {
  return {
    name: resp.name, 
    symbol: resp.symbol, 
    priceUsd: parseFloat(resp.priceUsd), 
    changePercent24Hr: parseFloat(resp.changePercent24Hr), 
    marketCapUsd: parseFloat(resp.marketCapUsd)
  }
}

export type AssetResponse = {
  "data": AssetDataObj,
  "timestamp": number
}

export type AllAssetsResponse = {
  "data": [AssetDataObj],
  "timestamp": number
}

const API_KEY = '4948c070-26dc-47aa-9105-be6283a3ffd4'
export const headers = new Headers()
headers.append("Authorization", `Bearer ${API_KEY}`)