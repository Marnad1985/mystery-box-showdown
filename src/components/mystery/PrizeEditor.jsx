import { Trash2, Plus } from 'lucide-react';
import { LEVELS } from '@/lib/gameLogic';

const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export default function PrizeEditor({ prizes, onChange, withLevel = true }) {
  function update(id, field, value) {
    onChange(prizes.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }
  function remove(id) {
    onChange(prizes.filter((p) => p.id !== id));
  }
  function add() {
    const item = withLevel
      ? { id: newId(), name: '', value: 0, level: 'yellow' }
      : { id: newId(), name: '', value: 0 };
    onChange([...prizes, item]);
  }

  return (
    <div className="flex flex-col gap-2">
      {prizes.map((p, i) => (
        <div key={p.id} className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-2">
          <span className="text-slate-500 text-sm w-6 text-center">{i + 1}</span>
          <input
            value={p.name}
            onChange={(e) => update(p.id, 'name', e.target.value)}
            placeholder="Prize name"
            className="flex-1 min-w-0 bg-slate-900/70 rounded px-2 py-1.5 text-sm text-white border border-slate-700 focus:border-amber-400 outline-none"
          />
          <input
            type="number"
            step="0.01"
            value={p.value}
            onChange={(e) => update(p.id, 'value', parseFloat(e.target.value) || 0)}
            placeholder="Value"
            className="w-20 bg-slate-900/70 rounded px-2 py-1.5 text-sm text-white border border-slate-700 focus:border-amber-400 outline-none"
          />
          {withLevel && (
            <select
              value={p.level}
              onChange={(e) => update(p.id, 'level', e.target.value)}
              className="bg-slate-900/70 rounded px-2 py-1.5 text-sm text-white border border-slate-700 outline-none capitalize"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l} className="capitalize">
                  {l}
                </option>
              ))}
            </select>
          )}
          <button onClick={() => remove(p.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 justify-center py-2 rounded-lg border-2 border-dashed border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-300 transition text-sm font-semibold"
      >
        <Plus className="w-4 h-4" /> Add prize
      </button>
    </div>
  );
}