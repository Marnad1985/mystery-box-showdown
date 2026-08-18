import { ArrowLeftRight, Lock } from 'lucide-react';

export default function FinalDecisionPanel({ onKeep, onSwap }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-3 md:gap-5 p-2">
      <p className="text-amber-300 text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.4em] font-bold animate-pulse">
        FINAL DECISION
      </p>
      <p className="text-white text-base md:text-2xl font-bold">Only two boxes remain.</p>
      <h2 className="text-white text-2xl md:text-5xl font-black">KEEP YOUR BOX OR SWAP?</h2>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          onClick={onKeep}
          className="flex items-center gap-2 px-6 py-3 md:px-9 md:py-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black text-lg md:text-2xl hover:scale-105 transition shadow-lg shadow-amber-500/40"
        >
          <Lock className="w-5 h-5 md:w-6 md:h-6" /> KEEP YOUR BOX
        </button>
        <button
          onClick={onSwap}
          className="flex items-center gap-2 px-6 py-3 md:px-9 md:py-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white font-black text-lg md:text-2xl hover:scale-105 transition shadow-lg shadow-fuchsia-500/40"
        >
          <ArrowLeftRight className="w-5 h-5 md:w-6 md:h-6" /> SWAP BOXES
        </button>
      </div>
    </div>
  );
}