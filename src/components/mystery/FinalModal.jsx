import { motion } from 'framer-motion';
import { ArrowLeftRight, Lock } from 'lucide-react';

export default function FinalModal({ onKeep, onSwap }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 p-8 text-center"
      >
        <p className="text-amber-300 text-2xl md:text-3xl tracking-[0.4em] font-bold animate-pulse">FINAL DECISION</p>
        <p className="text-white text-2xl md:text-3xl font-bold">Only two boxes remain.</p>
        <h2 className="text-white text-4xl md:text-6xl font-black">KEEP YOUR BOX OR SWAP?</h2>
        <div className="flex gap-4 mt-2">
          <button
            onClick={onKeep}
            className="flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black text-2xl hover:scale-105 transition shadow-lg shadow-amber-500/40"
          >
            <Lock className="w-6 h-6" /> KEEP YOUR BOX
          </button>
          <button
            onClick={onSwap}
            className="flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white font-black text-2xl hover:scale-105 transition shadow-lg shadow-fuchsia-500/40"
          >
            <ArrowLeftRight className="w-6 h-6" /> SWAP BOXES
          </button>
        </div>
      </motion.div>
    </div>
  );
}