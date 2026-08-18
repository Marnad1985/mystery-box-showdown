import { motion } from 'framer-motion';
import { LEVEL_COLORS } from '@/lib/gameLogic';

const GOLD = { bg: 'linear-gradient(135deg,#fde047,#f59e0b)', text: '#451a03', glow: 'rgba(251,191,36,0.6)' };

export default function DealPanel({ prize, onEnd, onSeeWhat }) {
  const c = prize.level ? LEVEL_COLORS[prize.level] || LEVEL_COLORS.yellow : GOLD;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-3 md:gap-5 p-2">
      <motion.h1
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-white text-4xl md:text-7xl font-black drop-shadow-lg"
      >
        DEAL!
      </motion.h1>
      <p className="text-amber-300 text-sm md:text-xl tracking-[0.2em] font-bold">YOUR OFFICIAL PRIZE</p>
      <motion.div
        style={{ background: c.bg, color: c.text, boxShadow: `0 0 50px ${c.glow}` }}
        className="px-6 py-4 md:px-10 md:py-7 rounded-2xl md:rounded-3xl text-2xl md:text-5xl font-black"
      >
        {prize.name}
      </motion.div>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-1">
        <button
          onClick={onEnd}
          className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-white text-slate-900 font-black text-base md:text-xl hover:scale-105 transition"
        >
          END GAME
        </button>
        <button
          onClick={onSeeWhat}
          className="px-5 py-2.5 md:px-9 md:py-3.5 rounded-full bg-white/10 text-white border border-white/30 font-black text-base md:text-xl hover:scale-105 transition"
        >
          SEE WHAT COULD HAVE HAPPENED
        </button>
      </div>
    </div>
  );
}