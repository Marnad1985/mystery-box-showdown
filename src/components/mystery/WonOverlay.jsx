import { motion } from 'framer-motion';
import { LEVEL_COLORS } from '@/lib/gameLogic';

export default function WonOverlay({ prize, otherPrize, sourceLabel, onAgain, onSetup }) {
  const c = LEVEL_COLORS[prize.level] || LEVEL_COLORS.yellow;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-5 p-8 text-center"
      >
        <p className="text-amber-300 text-xl md:text-2xl tracking-[0.3em] font-bold">{sourceLabel || 'YOU WON!'}</p>
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-white text-5xl md:text-7xl font-black drop-shadow-lg"
        >
          YOU WON!
        </motion.h1>
        <motion.div
          style={{ background: c.bg, color: c.text, boxShadow: `0 0 60px ${c.glow}` }}
          className="px-10 py-8 rounded-3xl text-4xl md:text-6xl font-black"
        >
          {prize.name}
        </motion.div>
        {otherPrize && (
          <p className="text-white/70 text-lg mt-2">
            The other box contained: <span className="font-bold text-white">{otherPrize.name}</span>
          </p>
        )}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onAgain}
            className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-105 transition"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onSetup}
            className="px-8 py-3 rounded-full bg-white/10 text-white border border-white/30 font-bold text-lg hover:scale-105 transition"
          >
            EDIT SETUP
          </button>
        </div>
      </motion.div>
    </div>
  );
}