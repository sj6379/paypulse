import { insforge as client } from "./insforge";


export interface Trade {
  symbol: string;
  side: string;
  quantity: number;
  price?: number;
  order_id?: string;
  status: string;
}

export const saveTrade = async (trade: Trade) => {
  const { data, error } = await client
    .database
    .from("trades")
    .insert([trade]);

  if (error) {
    console.error("Failed to save trade to DB:", error);
    return null;
  }
  return data;
};

export const getTradeHistory = async (limit: number = 10) => {
  const { data, error } = await client
    .database
    .from("trades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch trade history:", error);
    return [];
  }
  return data || [];
};

