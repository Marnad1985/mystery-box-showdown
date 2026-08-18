import { motion } from 'framer-motion';
import { ArrowLeftRight, Lock } from 'lucide-react';

export default function SwapModal({ onKeep, onSwap }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 p-8 text-center"
      >
        <p className="text-cyan-300 text-2xl md:text-3xl tracking-[0.3em] font-bold">SWAP OPPORTUNITY</p>
        <h2 className="text-white text-4xl md:text-6xl font-black">KEEP YOUR BOX OR SWAP?</h2>
        <div className="flex gap-4 mt-2">
          <button
            onClick={onKeep}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-white font-black text-xl hover:scale-105 transition"
          >
            <Lock className="w-5 h-5" /> KEEP MY BOX
          </button>
          <button
            onClick={onSwap}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-black text-xl hover:scale-105 transition"
          >
            <ArrowLeftRight className="w-5 h-5" /> SWAP BOX
          </button>
        </div>
      </motion.div>
    </div>
  );
}