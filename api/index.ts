// TODO: env로 숨기기
const BASE_URL = "https://api.binance.com/api/v3";

export type TickerPrice = {
  symbol: string;
  price: string;
};

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
