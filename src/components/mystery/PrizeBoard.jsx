import { LEVEL_COLORS } from '@/lib/gameLogic';

export default function PrizeBoard({ prizes, eliminatedIds, align = 'left' }) {
  const justify = align === 'right' ? 'justify-end text-right' : 'justify-start text-left';
  return (
    <div className="h-full flex flex-col gap-0.5 sm:gap-1">
      {prizes.map((p) => {
        const c = LEVEL_COLORS[p.level] || LEVEL_COLORS.yellow;
        const out = eliminatedIds.includes(p.id);
        return (
          <div
            key={p.id}
            style={{ background: c.bg, color: c.text, boxShadow: out ? 'none' : `0 0 10px ${c.glow}` }}
            className={`flex-1 min-h-0 flex items-center ${justify} px-1.5 sm:px-2.5 rounded-md sm:rounded-lg font-bold transition-all text-[9px] sm:text-xs md:text-sm lg:text-base xl:text-lg ${
              out ? 'opacity-25 grayscale line-through' : ''
            }`}
          >
            <span className="truncate">{p.name}</span>
          </div>
        );
      })}
    </div>
  );
}