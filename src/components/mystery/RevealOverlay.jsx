import { motion } from 'framer-motion';
import { LEVEL_COLORS } from '@/lib/gameLogic';

export default function RevealOverlay({ prize, onContinue }) {
  const c = LEVEL_COLORS[prize.level] || LEVEL_COLORS.yellow;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center gap-6 p-8 text-center"
      >
        <p className="text-white/70 text-xl tracking-[0.3em] font-bold">YOU OPENED</p>
        <motion.div
          initial={{ rotateZ: -8, y: -20 }}
          animate={{ rotateZ: 0, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{ background: c.bg, color: c.text, boxShadow: `0 0 60px ${c.glow}` }}
          className="px-10 py-8 rounded-3xl text-4xl md:text-6xl font-black max-w-[80vw]"
        >
          {prize.name}
        </motion.div>
        <p className="text-white/60 text-lg">This prize is now eliminated!</p>
        <button
          onClick={onContinue}
          className="mt-2 px-8 py-3 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-105 transition"
        >
          CONTINUE
        </button>
      </motion.div>
    </div>
  );
}