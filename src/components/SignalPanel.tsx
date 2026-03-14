"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw, BrainCircuit, Zap, ArrowUpRight } from "lucide-react";

interface Signal {
  signal: string;
  confidence: number;
  reasoning: string;
  entry: number;
  target: number;
  stopLoss: number;
}

interface SignalPanelProps {
  signal: any;
  loading: boolean;
  onRefresh: () => void;
  onApprove: (quantity: number) => void;
}

export default function SignalPanel({ signal, loading, onRefresh, onApprove }: SignalPanelProps) {
  const [quantity, setQuantity] = useState<number>(0.001);

  return (
    <div className="glass-card p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">AI Analyst</h3>
          <p className="text-xs text-white/40">Gemini 1.5 Flash Decision Engine</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!signal ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
          <BrainCircuit className="w-12 h-12 text-primary" />
          <p className="text-sm italic">Awaiting market data for analysis...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase text-white/40 tracking-widest">
              <span>Recommendation</span>
              <span>Confidence: {signal.confidence}%</span>
            </div>
            <div className={`text-4xl font-black italic tracking-tighter ${
              signal.signal.includes('BUY') ? 'text-primary' : 'text-accent'
            }`}>
              {signal.signal}
            </div>
          </div>

          <div className="glass-card bg-white/5 p-4 rounded-xl border-0">
            <h4 className="text-[10px] uppercase text-white/40 mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Reasoning
            </h4>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              {signal.reasoning}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[10px] uppercase text-white/40 mb-1">Entry</div>
              <div className="text-sm font-bold text-white">{signal.entry}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-white/40 mb-1">Target</div>
              <div className="text-sm font-bold text-primary">{signal.target}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-white/40 mb-1">Stop</div>
              <div className="text-sm font-bold text-accent">{signal.stopLoss}</div>
            </div>
          </div>

          <div className="pt-6 space-y-4 border-t border-white/5 mt-auto">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-white/40 ml-1">Trade Quantity</label>
              <input 
                type="number"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button 
              onClick={() => onApprove(quantity)}
              className="w-full py-4 rounded-xl bg-primary text-obsidian font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-primary-neon"
            >
              Approve & Execute
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <p className="text-[8px] text-white/20 text-center uppercase tracking-widest">
              Secured by InsForge Middleware
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
