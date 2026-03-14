"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";

interface ChartProps {
  data: any[];
  symbol: string;
}

export default function TradingChart({ data, symbol }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log("📊 Initializing Chart Instance...");
    
    try {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "rgba(255, 255, 255, 0.5)",
        },
        grid: {
          vertLines: { color: "rgba(255, 255, 255, 0.05)" },
          horzLines: { color: "rgba(255, 255, 255, 0.05)" },
        },
        width: chartContainerRef.current.clientWidth || 300,
        height: 500,
        timeScale: { borderColor: "rgba(255, 255, 255, 0.1)" },
        rightPriceScale: { borderColor: "rgba(255, 255, 255, 0.1)" },
      });

      // Verification of method existence
      if (typeof (chart as any).addCandlestickSeries !== 'function') {
        throw new Error("Chart instance is missing addCandlestickSeries method. Check library version.");
      }

      const candlestickSeries = (chart as any).addCandlestickSeries({
        upColor: "#00f2fe",
        downColor: "#7000ff",
        borderVisible: false,
        wickUpColor: "#00f2fe",
        wickDownColor: "#7000ff",
      });

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
        chartRef.current = null;
        seriesRef.current = null;
      };
    } catch (error) {
      console.error("❌ Chart Initialization Failed:", error);
    }
  }, []); // Run only once

  // 2. Update Data
  useEffect(() => {
    if (seriesRef.current && Array.isArray(data) && data.length > 0) {
      console.log("📈 Updating Chart Data:", data.length, "points");
      try {
        seriesRef.current.setData(data);
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error("❌ Failed to set chart data:", error);
      }
    }
  }, [data]); // Run when data updates

  return (
    <div className="relative w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {symbol.toUpperCase()} / USDT
          <span className="text-xs font-normal text-primary px-2 py-0.5 rounded-full border border-primary/30">
            Live
          </span>
        </h2>
        <div className="flex gap-2">
          {["1m", "5m", "15m", "1h", "1D"].map((t) => (
            <button key={t} className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-primary/20 transition-colors">
              {t}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[500px]" />
    </div>
  );
}
