import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRound, saveRound, loadHistory } from '@/lib/gameLogic';

export default function BoxAssignmentProof() {
  const navigate = useNavigate();
  const [round, setRound] = useState(loadRound());
  const [history] = useState(loadHistory());

  if (!round) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,#1e1b4b,#0b1020_60%)] text-white">
        <p className="text-xl">No round found.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-amber-400 text-slate-900 font-bold">
          Go to Setup
        </button>
      </div>
    );
  }

  function lock() {
    const now = new Date().toISOString();
    const updated = { ...round, lockedAt: now, status: 'active', history: { ...round.history, startTimestamp: now } };
    saveRound(updated);
    setRound(updated);
    navigate('/game');
  }

  const created = new Date(round.createdAt);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#1e1b4b,#0b1020_60%)] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-4">
          <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            BOX ASSIGNMENT PROOF
          </h1>
          <p className="text-rose-300 tracking-[0.2em] text-xs md:text-sm mt-1 font-bold">
            ⚠ PRIVATE — GAME MANAGER ONLY — DO NOT SHOW TO HOST OR PLAYER
          </p>
        </header>

        {round.status === 'pending' && (
          <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs tracking-wider">ROUND ID</p>
                <p className="text-amber-200 font-bold text-lg break-all">{round.roundId}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs tracking-wider">DATE & TIME</p>
                <p className="text-white font-bold text-lg">{created.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
              <h2 className="text-lg font-bold mb-3">Box → Prize Assignments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {round.game.boxes.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2 border border-white/10"
                  >
                    <span className="text-white/70 text-sm">Box {b.number}</span>
                    <span className="text-white font-bold flex items-center gap-2">
                      {b.prize.name}
                      {b.id === round.game.playerBoxId && (
                        <span className="text-[10px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.5 rounded font-bold">PLAYER BOX</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={lock}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 text-lg md:text-xl font-black hover:scale-[1.01] transition shadow-lg shadow-amber-500/30"
            >
              LOCK ASSIGNMENTS & START GAME
            </button>
            <p className="text-white/40 text-xs text-center mt-3">
              Once locked, assignments cannot be changed by anyone — including Admin — until the round ends.
            </p>
          </>
        )}

        {round.status === 'active' && (
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
            <p className="text-2xl font-black text-amber-200 mb-2">ROUND IN PROGRESS</p>
            <p className="text-white/70">Assignments are locked. Box contents are hidden during gameplay.</p>
            <button
              onClick={() => navigate('/game')}
              className="mt-5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 font-bold"
            >
              Return to Game
            </button>
          </div>
        )}

        {round.status === 'completed' && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
            <h2 className="text-lg font-bold mb-1">Completed Round Record</h2>
            <p className="text-white/50 text-sm mb-3">
              Round ID: {round.roundId} • Final prize: <b className="text-amber-200">{round.history.finalPrize}</b>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {round.history.initialAssignments.map((a) => (
                <div
                  key={a.box}
                  className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2 border border-white/10"
                >
                  <span className="text-white/70 text-sm">Box {a.box}</span>
                  <span className="text-white font-bold">{a.prize}</span>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs">
              Original player box: Box {round.history.originalPlayerBox} • Swaps: {round.history.swaps.length} • Banker
              offers: {round.history.bankerOffers.length}
            </p>
          </div>
        )}

        {history.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3">Completed Rounds History</h2>
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <details key={h.roundId} className="bg-white/5 rounded-xl border border-white/10">
                  <summary className="px-4 py-3 cursor-pointer font-bold flex items-center justify-between">
                    <span className="text-amber-200">{h.roundId}</span>
                    <span className="text-white/60 text-sm">Final: {h.finalPrize || '—'}</span>
                  </summary>
                  <div className="px-4 pb-3">
                    <p className="text-white/50 text-xs mb-2">
                      Started: {h.startTimestamp ? new Date(h.startTimestamp).toLocaleString() : '—'} • Ended:{' '}
                      {h.endTimestamp ? new Date(h.endTimestamp).toLocaleString() : '—'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {h.initialAssignments.map((a) => (
                        <div key={a.box} className="text-xs bg-slate-900/60 rounded px-2 py-1 border border-white/10">
                          Box {a.box}: <b className="text-white">{a.prize}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate('/')} className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold">
            Setup
          </button>
        </div>
      </div>
    </div>
  );
}