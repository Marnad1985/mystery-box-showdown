import { LEVEL_COLORS } from '@/lib/gameLogic';

export default function PrizeBoard({ prizes, eliminatedIds, align = 'left' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      {prizes.map((p) => {
        const c = LEVEL_COLORS[p.level] || LEVEL_COLORS.yellow;
        const out = eliminatedIds.includes(p.id);
        return (
          <div
            key={p.id}
            style={{ background: c.bg, color: c.text, boxShadow: out ? 'none' : `0 0 12px ${c.glow}` }}
            className={`px-3 py-1.5 rounded-lg text-sm md:text-base font-bold w-full transition-all ${
              align === 'right' ? 'text-right' : ''
            } ${out ? 'opacity-25 grayscale line-through' : ''}`}
          >
            {p.name}
          </div>
        );
      })}
    </div>
  );
}