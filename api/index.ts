// TODO: env로 숨기기
const BASE_URL = "https://api.binance.com/api/v3";

export type TickerPrice = {
  symbol: string;
  price: string;
};

export type KlineData = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// list
export const fetchTickerPrices = async (): Promise<TickerPrice[]> => {
  const response = await fetch(`${BASE_URL}/ticker/price`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// line
export const fetchKlineData = async (symbol: string): Promise<KlineData[]> => {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch kline data: ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((item: any) => ({
    time: item[0],
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
  }));
};

export const fetchOrderBookData = async (symbol: string) => {
  const response = await fetch(
    `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=10`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch order book data");
  }
  return response.json();
};
