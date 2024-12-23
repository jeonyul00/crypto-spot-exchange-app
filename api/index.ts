// TODO: env로 숨기기
const BASE_URL = "https://api.binance.com/api/v3";

export const fetchTickerPrices = async () => {
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
