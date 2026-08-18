import { motion } from 'framer-motion';

export default function BoxTile({ box, disabled, isActive, swapPickMode, onOpen }) {
  const opened = box.opened;
  const clickable = !opened && !disabled;

  return (
    <motion.button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onOpen(box)}
      whileHover={clickable ? { scale: 1.06, y: -4 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      animate={isActive ? { rotate: [0, -3, 3, -3, 3, 0], scale: [1, 1.1, 1.05, 1.1, 1] } : { rotate: 0, scale: 1 }}
      transition={isActive ? { duration: 1.1, repeat: Infinity } : { type: 'spring', stiffness: 300, damping: 18 }}
      className={`relative w-full h-full min-h-0 rounded-lg md:rounded-2xl flex flex-col items-center justify-center font-black select-none border-2
        ${opened
          ? 'bg-slate-800/60 border-slate-600/40 text-slate-500'
          : clickable
            ? 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-300/40 text-amber-50 shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
            : 'bg-gradient-to-br from-amber-800 to-amber-950 border-amber-700/40 text-amber-200/60 opacity-60'}
        ${swapPickMode ? ' ring-2 sm:ring-4 ring-cyan-300/80' : ''}`}
    >
      {box.isPlayerBox && !opened && (
        <span className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-400 text-slate-900 text-[7px] sm:text-[10px] font-extrabold tracking-wider whitespace-nowrap shadow z-10">
          YOUR BOX
        </span>
      )}
      {opened ? (
        <>
          <span className="text-lg sm:text-2xl opacity-40 line-through">{box.number}</span>
          <span className="hidden sm:block text-[10px] mt-1 px-1 text-center leading-tight text-slate-400 truncate w-full">
            {box.prize.name}
          </span>
        </>
      ) : (
        <span className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg">{box.number}</span>
      )}
      {isActive && <span className="absolute inset-0 rounded-lg md:rounded-2xl ring-4 ring-white/80 animate-pulse" />}
    </motion.button>
  );
}