import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function SwapConfirmPanel({ subphase, onConfirm, onKeep }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-3 md:gap-5 p-2">
      {subphase === 'calling' ? (
        <>
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Phone className="w-12 h-12 md:w-20 md:h-20 text-amber-300" />
          </motion.div>
          <p className="text-amber-200 text-base md:text-3xl font-black tracking-[0.15em] animate-pulse">
            THE BANKER IS CALLING...
          </p>
        </>
      ) : (
        <>
          <p className="text-amber-300 text-sm md:text-2xl tracking-[0.2em] font-bold">ARE YOU SURE?</p>
          <p className="text-white text-base md:text-xl font-bold">You are about to give up your current box.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white font-black text-base md:text-xl hover:scale-105 transition shadow-lg shadow-fuchsia-500/40"
            >
              CONFIRM SWAP
            </button>
            <button
              onClick={onKeep}
              className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black text-base md:text-xl hover:scale-105 transition shadow-lg shadow-amber-500/40"
            >
              KEEP ORIGINAL BOX
            </button>
          </div>
        </>
      )}
    </div>
  );
}