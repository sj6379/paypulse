import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiSignals = async (priceData: any[], indicatorData: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert autonomous trading AI for professional crypto traders.
    Analyze the following market data and provide a trade signal.
    
    Current Market Indicators:
    - RSI (14): ${indicatorData.rsi.toFixed(2)}
    - EMA (9): ${indicatorData.ema9.toFixed(2)}
    - EMA (21): ${indicatorData.ema21.toFixed(2)}
    - Bollinger Bands: Upper ${indicatorData.bb.upper.toFixed(2)}, Lower ${indicatorData.bb.lower.toFixed(2)}, Middle ${indicatorData.bb.middle.toFixed(2)}
    
    Price Data (Last 10 candles): ${JSON.stringify(priceData.slice(-10))}
    
    Return a JSON object only. Structure:
    {
      "signal": "STRONG BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG SELL",
      "confidence": 0-100,
      "reasoning": "Direct evidence-based logic citing indicators",
      "entry": number,
      "target": number,
      "stopLoss": number
    }
  `;


  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Simple JSON extraction if Gemini wraps it in code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Gemini Signal Error:", error);
    return null;
  }
};
