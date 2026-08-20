import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrizeEditor from '@/components/mystery/PrizeEditor';
import { defaultPrizes, defaultBankerPool, LEVELS, LEVEL_COLORS, createRound, saveRound } from '@/lib/gameLogic';

const CONFIG_KEY = 'mysterybox.config';
const BOX_OPTIONS = [5, 10, 15, 20];

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export default function AdminSetup() {
  const navigate = useNavigate();
  const saved = loadConfig();
  const [numBoxes, setNumBoxes] = useState(saved?.numBoxes || 20);
  const [prizes, setPrizes] = useState(saved?.prizes?.length ? saved.prizes : defaultPrizes(saved?.numBoxes || 20));
  const [bankerPool, setBankerPool] = useState(saved?.bankerPool?.length ? saved.bankerPool : defaultBankerPool());
  const [error, setError] = useState('');

  function changeNumBoxes(n) {
    setNumBoxes(n);
    setPrizes((prev) => {
      if (prev.length === n) return prev;
      if (prev.length > n) return prev.slice(0, n);
      const base = defaultPrizes(n);
      const extra = base.slice(prev.length).map((p) => ({ ...p, id: newId() }));
      return [...prev, ...extra];
    });
  }

  function loadDefaults() {
    setPrizes(defaultPrizes(numBoxes));
    setBankerPool(defaultBankerPool());
  }

  function start() {
    if (prizes.length !== numBoxes) {
      setError(`You need exactly ${numBoxes} box prizes (currently ${prizes.length}).`);
      return;
    }
    if (prizes.some((p) => !p.name.trim())) {
      setError('Every box prize needs a name.');
      return;
    }
    if (bankerPool.length === 0) {
      setError('Add at least one Banker offer.');
      return;
    }
    if (bankerPool.some((p) => !p.name.trim())) {
      setError('Every Banker offer needs a name.');
      return;
    }
    const cfg = { numBoxes, prizes, bankerPool };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    const round = createRound(cfg);
    saveRound(round);
    navigate('/proof');
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#1e1b4b,#0b1020_60%)] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            MYSTERY BOX LIVE
          </h1>
          <p className="text-white/60 tracking-[0.3em] text-sm mt-1">ADMIN SETUP</p>
        </header>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm">
            {error}
          </div>
        )}

        <section className="mb-6 bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="text-xl font-bold mb-3">Number of Boxes</h2>
          <div className="flex flex-wrap gap-2">
            {BOX_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => changeNumBoxes(n)}
                className={`px-5 py-2.5 rounded-full font-bold transition ${
                  numBoxes === n ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {n} boxes
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-xl font-bold">
              Box Prizes <span className="text-white/50 text-sm font-normal">({prizes.length}/{numBoxes})</span>
            </h2>
            <button onClick={loadDefaults} className="text-sm px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20">
              Load examples
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3 text-xs">
            {LEVELS.map((l) => (
              <span
                key={l}
                style={{ background: LEVEL_COLORS[l].solid }}
                className={`px-2 py-1 rounded font-bold capitalize ${l === 'yellow' ? 'text-amber-900' : 'text-white'}`}
              >
                {l}
              </span>
            ))}
          </div>
          <PrizeEditor prizes={prizes} onChange={setPrizes} withLevel />
        </section>

        <section className="mb-6 bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="text-xl font-bold mb-1">Banker Offer Pool</h2>
          <p className="text-white/50 text-sm mb-3">
            Prizes the Banker can offer during the game. Internal values drive the Banker's logic and are never shown to players.
          </p>
          <PrizeEditor prizes={bankerPool} onChange={setBankerPool} withLevel={false} />
        </section>

        <button
          onClick={start}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 text-xl font-black hover:scale-[1.01] transition shadow-lg shadow-amber-500/30"
        >
          START GAME →
        </button>
      </div>
    </div>
  );
}