"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { LayoutGrid, TrendingUp, History, Shield, Activity, RefreshCw } from "lucide-react";
import { fetchBinanceKlines } from "@/lib/binance";
import { getGeminiSignals } from "@/lib/gemini";
import { calculateRSI, calculateEMA, calculateBollingerBands } from "@/lib/indicators";
import { getTradeHistory } from "@/lib/db";
import { executeTradeAction } from "./actions";

// Dynamic imports with SSR disabled to prevent hydration mismatches
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const TradingChart = dynamic(() => import("@/components/TradingChart"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
});
const SignalPanel = dynamic(() => import("@/components/SignalPanel"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
});



export default function Dashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any>(null);
  const [signal, setSignal] = useState<any>(null);
  const [loadingSignal, setLoadingSignal] = useState(false);
  const [symbol] = useState("BTCUSDT");
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  // Load from .env - In production these would securely come from InsForge
  const binanceConfig = {
    apiKey: process.env.NEXT_PUBLIC_BINANCE_API_KEY || "",
    apiSecret: process.env.NEXT_PUBLIC_BINANCE_API_SECRET || "",
    testnet: true,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, history] = await Promise.all([
          fetchBinanceKlines(symbol),
          getTradeHistory(5)
        ]);
        
        setChartData(data);
        setTradeHistory(history);
        
        if (data && data.length > 20) {
          setIndicators({
            rsi: calculateRSI(data),
            ema9: calculateEMA(data, 9),
            ema21: calculateEMA(data, 21),
            bb: calculateBollingerBands(data)
          });
        }
      } catch (error) {
        console.error("❌ Dashboard Data Load Failed:", error);
      }
    };
    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [symbol]);

  const handleRefreshSignal = async () => {
    if (!indicators || chartData.length < 10) return;
    
    setLoadingSignal(true);
    try {
      const signals = await getGeminiSignals(chartData, indicators);
      setSignal(signals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSignal(false);
    }
  };

  const handleApproveTrade = async (quantity: number) => {
    if (!signal) return;
    
    const side = signal?.signal?.includes("BUY") ? "BUY" : "SELL";
    const currentPrice = chartData[chartData.length - 1]?.close;
    
    try {
      const result = await executeTradeAction(symbol, side, quantity, currentPrice);
      
      // Refresh history
      const history = await getTradeHistory(5);
      setTradeHistory(history);

      alert(`✅ Success: ${side} ${quantity} ${symbol} executed via Secure Token. Order ID: ${result.orderId}`);
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
    }
  };



  return (
    <main className="min-h-screen bg-obsidian-gradient pt-24 pb-12 px-8">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-[calc(100vh-160px)]">
        
        {/* Left Sidebar: Navigation & Status */}
        <div className="col-span-1 flex flex-col items-center py-8 glass-card border-none space-y-12">
          <div className="space-y-8">
            <LayoutGrid className="w-8 h-8 text-white/20 hover:text-primary transition-colors cursor-pointer" />
            <TrendingUp className="w-8 h-8 text-primary" />
            <History className="w-8 h-8 text-white/20 hover:text-primary transition-colors cursor-pointer" />
            <Shield className="w-8 h-8 text-white/20 hover:text-primary transition-colors cursor-pointer" />
          </div>
          <div className="mt-auto">
            <Activity className="w-8 h-8 text-accent animate-pulse" />
          </div>
        </div>

        {/* Middle: Chart */}
        <div className="col-span-8 space-y-8 flex flex-col">
          <div className="flex-1 glass-card overflow-hidden relative">
            <TradingChart data={chartData} symbol={symbol} />
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            <div className="glass-card p-6 flex flex-col justify-center">
              <span className="text-[10px] uppercase text-white/40 tracking-widest mb-1">RSI (14)</span>
              <span className={`text-2xl font-black ${
                indicators?.rsi > 70 ? 'text-accent' : indicators?.rsi < 30 ? 'text-primary' : 'text-white'
              }`}>
                {indicators?.rsi?.toFixed(1) || '--'}
              </span>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center">
              <span className="text-[10px] uppercase text-white/40 tracking-widest mb-1">Trend Indicator</span>
              <span className={`text-2xl font-black ${
                indicators?.ema9 > indicators?.ema21 ? 'text-primary' : 'text-accent'
              }`}>
                {indicators?.ema9 > indicators?.ema21 ? 'BULLISH' : 'BEARISH'}
              </span>
            </div>
            <div className="glass-card col-span-2 p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-white/40 tracking-widest mb-1 block">Trade History</span>
                <div className="flex gap-2">
                  {tradeHistory.map((t, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${t?.side === 'BUY' ? 'bg-primary' : 'bg-accent'}`} title={`${t?.side} ${t?.quantity} ${t?.symbol}`} />
                  ))}
                  {(tradeHistory === null || tradeHistory.length === 0) && <span className="text-xs text-white/20 italic">Awaiting first trade...</span>}
                </div>
              </div>
              <button 
                onClick={handleRefreshSignal}
                className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2"
              >
                Sync Wallet <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Analysis */}
        <div className="col-span-3">
          <SignalPanel 
            signal={signal} 
            loading={loadingSignal} 
            onRefresh={handleRefreshSignal}
            onApprove={handleApproveTrade} 
          />
        </div>
      </div>
    </main>
  );
}

