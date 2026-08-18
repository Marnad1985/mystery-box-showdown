import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function BankerModal({ subphase, offer, onDeal, onKeep }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 p-8 text-center"
      >
        {subphase === 'calling' ? (
          <>
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Phone className="w-24 h-24 text-amber-300" />
            </motion.div>
            <p className="text-amber-200 text-3xl md:text-5xl font-black tracking-[0.2em] animate-pulse">
              THE BANKER IS CALLING...
            </p>
          </>
        ) : (
          <>
            <p className="text-amber-300 text-2xl md:text-3xl tracking-[0.3em] font-bold">THE BANKER'S OFFER</p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', boxShadow: '0 0 60px rgba(251,191,36,0.5)' }}
              className="px-12 py-10 rounded-3xl border-2 border-amber-400/60"
            >
              <span className="text-5xl md:text-7xl font-black text-amber-200">{offer.name}</span>
            </motion.div>
            <p className="text-white/80 text-xl">Take the offer and end the game?</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={onDeal}
                className="px-10 py-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-black text-xl hover:scale-105 transition shadow-lg shadow-emerald-500/40"
              >
                DEAL
              </button>
              <button
                onClick={onKeep}
                className="px-10 py-4 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-xl hover:scale-105 transition shadow-lg shadow-rose-500/40"
              >
                KEEP PLAYING
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}