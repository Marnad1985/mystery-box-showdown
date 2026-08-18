import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function FinalBankerPanel({ subphase, offer, onTake, onTrust }) {
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
          <p className="text-amber-300 text-sm md:text-2xl tracking-[0.2em] font-bold">FINAL BANKER OFFER</p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', boxShadow: '0 0 50px rgba(251,191,36,0.5)' }}
            className="px-6 py-5 md:px-10 md:py-8 rounded-2xl md:rounded-3xl border-2 border-amber-400/60"
          >
            <span className="text-3xl md:text-6xl font-black text-amber-200">{offer.name}</span>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={onTake}
              className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-black text-base md:text-xl hover:scale-105 transition shadow-lg shadow-emerald-500/40"
            >
              TAKE THE OFFER
            </button>
            <button
              onClick={onTrust}
              className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white font-black text-base md:text-xl hover:scale-105 transition shadow-lg shadow-blue-500/40"
            >
              TRUST MY BOX
            </button>
          </div>
        </>
      )}
    </div>
  );
}