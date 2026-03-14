"use server";

import crypto from "crypto";
import { saveTrade } from "@/lib/db";

const getBaseUrl = (testnet: boolean) => 
  testnet ? "https://testnet.binance.vision" : "https://api.binance.com";

export async function executeTradeAction(symbol: string, side: 'BUY' | 'SELL', quantity: number, price: number) {
  const apiKey = process.env.BINANCE_API_KEY || "";
  const apiSecret = process.env.BINANCE_API_SECRET || "";
  const isTestnet = true; // Hardcoded to true for safety in demo

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Binance API Configuration in environment variables.");
  }

  const timestamp = Date.now();
  const query = `symbol=${symbol.toUpperCase()}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(query)
    .digest("hex");

  const url = `${getBaseUrl(isTestnet)}/api/v3/order?${query}&signature=${signature}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(data.msg || "Binance API Error");
    }

    // Persist to InsForge DB
    await saveTrade({
      symbol,
      side,
      quantity,
      price,
      order_id: data.orderId?.toString(),
      status: data.status,
    });

    return {
      success: true,
      orderId: data.orderId,
      status: data.status,
    };
  } catch (error: any) {
    console.error("Trade Action Error:", error.message);
    throw new Error(error.message);
  }
}
