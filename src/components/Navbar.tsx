import { Wallet, Bell, Menu, Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0d16]/80 backdrop-blur-xl border-b border-white/10 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Cpu className="text-black w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          PAYPULSE <span className="text-white/50 text-sm font-normal ml-1 tracking-normal">Co-Pilot</span>
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
        <a href="#" className="hover:text-primary transition-colors font-medium">Markets</a>
        <a href="#" className="hover:text-primary transition-colors font-medium">Trade Log</a>
        <a href="#" className="hover:text-primary transition-colors font-medium">Portfolio</a>
        <a href="#" className="hover:text-primary transition-colors font-medium">Security</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-white/70" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#0a0d16]" />
        </button>
        <div className="h-8 w-[1px] bg-white/10 mx-2" />
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">$12,450.00</span>
        </button>
      </div>
    </nav>
  );
}
