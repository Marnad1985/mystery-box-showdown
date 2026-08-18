import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import BoxTile from '@/components/mystery/BoxTile';
import PrizeBoard from '@/components/mystery/PrizeBoard';
import RevealOverlay from '@/components/mystery/RevealOverlay';
import BankerModal from '@/components/mystery/BankerModal';
import SwapModal from '@/components/mystery/SwapModal';
import FinalModal from '@/components/mystery/FinalModal';
import WonOverlay from '@/components/mystery/WonOverlay';
import { initGame, unopenedCount, openedCount, computeBankerOffer, splitBoard } from '@/lib/gameLogic';
import { playBell, playOpen, playWin } from '@/lib/sound';

const CONFIG_KEY = 'mysterybox.config';
function loadConfig() {
  try {
    const r = localStorage.getItem(CONFIG_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return null;
}

export default function GameScreen() {
  const navigate = useNavigate();
  const [config] = useState(loadConfig);
  const [game, setGame] = useState(() => (config ? initGame(config.prizes, config.numBoxes) : null));
  const [phase, setPhase] = useState('playing');
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [revealedPrize, setRevealedPrize] = useState(null);
  const [bankerOffer, setBankerOffer] = useState(null);
  const [bankerSub, setBankerSub] = useState('calling');
  const [pendingSwapPoint, setPendingSwapPoint] = useState(null);
  const [wonPrize, setWonPrize] = useState(null);
  const [otherPrize, setOtherPrize] = useState(null);
  const [sourceLabel, setSourceLabel] = useState('YOU WON!');
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (phase === 'won') {
      playWin();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }, [phase]);

  if (!config || !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <p className="text-xl">No game configured yet.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-amber-400 text-slate-900 font-bold">
          Go to Setup
        </button>
      </div>
    );
  }

  const board = splitBoard(config.prizes);
  const eliminatedIds = game.boxes.filter((b) => b.opened).map((b) => b.prize.id);
  const unopened = unopenedCount(game);
  const opened = openedCount(game);
  const disabled = phase !== 'playing' && phase !== 'swapPick';

  function handleBoxClick(box) {
    if (phase === 'playing') openBox(box);
    else if (phase === 'swapPick') doSwapPick(box);
  }

  function openBox(box) {
    if (box.isPlayerBox || box.opened) return;
    setActiveBoxId(box.id);
    setRevealedPrize(box.prize);
    setPhase('opening');
    playOpen();
    const t = setTimeout(() => {
      setGame((g) => ({ ...g, boxes: g.boxes.map((b) => (b.id === box.id ? { ...b, opened: true } : b)) }));
      setPhase('reveal');
    }, 1300);
    timers.current.push(t);
  }

  function continueAfterReveal() {
    const u = unopenedCount(game);
    const o = openedCount(game);
    setActiveBoxId(null);
    setRevealedPrize(null);
    if (u === 2) {
      setPhase('final');
      return;
    }
    if (game.swapPoints.includes(u) && !game.swapsUsed.includes(u)) {
      setPendingSwapPoint(u);
      setPhase('swap');
      return;
    }
    if (game.bankerPoints.includes(o)) {
      triggerBanker();
      return;
    }
    setPhase('playing');
  }

  function triggerBanker() {
    const offer = computeBankerOffer(game, config.bankerPool, config.numBoxes);
    setBankerOffer(offer);
    setBankerSub('calling');
    setPhase('banker');
    playBell();
    const t = setTimeout(() => setBankerSub('offer'), 2400);
    timers.current.push(t);
  }

  function bankerDeal() {
    setWonPrize(bankerOffer);
    setOtherPrize(null);
    setSourceLabel("YOU TOOK THE BANKER'S DEAL");
    setPhase('won');
  }

  function bankerKeep() {
    setGame((g) => ({ ...g, rejectedOffers: [...g.rejectedOffers, bankerOffer] }));
    setBankerOffer(null);
    setPhase('playing');
  }

  function swapKeep() {
    setGame((g) => ({ ...g, swapsUsed: [...g.swapsUsed, pendingSwapPoint] }));
    setPendingSwapPoint(null);
    setPhase('playing');
  }

  function swapChoose() {
    setPhase('swapPick');
  }

  function doSwapPick(box) {
    if (box.isPlayerBox || box.opened) return;
    setGame((g) => {
      const boxes = g.boxes.map((b) =>
        b.id === g.playerBoxId ? { ...b, isPlayerBox: false } : b.id === box.id ? { ...b, isPlayerBox: true } : b
      );
      return { ...g, boxes, playerBoxId: box.id, swapsUsed: [...g.swapsUsed, pendingSwapPoint] };
    });
    setPendingSwapPoint(null);
    setPhase('playing');
  }

  function finalKeep() {
    resolveFinal(false);
  }
  function finalSwap() {
    resolveFinal(true);
  }

  function resolveFinal(swapped) {
    const currentPlayerId = game.playerBoxId;
    const otherBox = game.boxes.find((b) => !b.opened && b.id !== currentPlayerId);
    let pId = currentPlayerId;
    let oId = otherBox.id;
    if (swapped) {
      const tmp = pId;
      pId = oId;
      oId = tmp;
    }
    const pPrize = game.boxes.find((b) => b.id === pId).prize;
    const oPrize = game.boxes.find((b) => b.id === oId).prize;
    if (swapped) {
      setGame((g) => ({
        ...g,
        boxes: g.boxes.map((b) =>
          b.id === currentPlayerId ? { ...b, isPlayerBox: false } : b.id === otherBox.id ? { ...b, isPlayerBox: true } : b
        ),
        playerBoxId: otherBox.id,
      }));
    }
    setPhase('finalReveal');
    const t = setTimeout(() => {
      setWonPrize(pPrize);
      setOtherPrize(oPrize);
      setSourceLabel('YOU WON!');
      setPhase('won');
    }, 2600);
    timers.current.push(t);
  }

  function newGame() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setGame(initGame(config.prizes, config.numBoxes));
    setPhase('playing');
    setActiveBoxId(null);
    setRevealedPrize(null);
    setBankerOffer(null);
    setWonPrize(null);
    setOtherPrize(null);
    setPendingSwapPoint(null);
  }

  const instruction =
    phase === 'playing'
      ? 'PICK A BOX TO OPEN'
      : phase === 'swapPick'
      ? 'CHOOSE A BOX TO SWAP WITH YOUR BOX'
      : phase === 'opening'
      ? 'OPENING...'
      : '';

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#1e1b4b,#0b1020_60%)] text-white flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            MYSTERY BOX LIVE
          </h1>
          <p className="text-[10px] md:text-xs text-white/60 tracking-[0.3em]">HOTEL GAME SHOW</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-white/70 text-sm">
            Boxes left: <b className="text-amber-300">{unopened}</b>
          </span>
          <button
            onClick={newGame}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold border border-white/20"
          >
            New Game
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold border border-white/20"
          >
            Setup
          </button>
        </div>
      </header>

      <div className="text-center py-2 text-amber-200 font-bold tracking-[0.3em] text-sm md:text-base h-10">
        <AnimatePresence mode="wait">
          <motion.span key={instruction} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {instruction}
          </motion.span>
        </AnimatePresence>
      </div>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-3 md:gap-6 px-3 md:px-8 pb-6">
        <div className="order-2 md:order-1 self-center">
          <PrizeBoard prizes={board.left} eliminatedIds={eliminatedIds} align="left" />
        </div>
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div className="grid gap-2 md:gap-3 w-full max-w-2xl grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
            {game.boxes.map((box) => (
              <BoxTile
                key={box.id}
                box={box}
                disabled={disabled || (phase === 'swapPick' && box.isPlayerBox)}
                isActive={activeBoxId === box.id}
                swapPickMode={phase === 'swapPick' && !box.isPlayerBox && !box.opened}
                onOpen={handleBoxClick}
              />
            ))}
          </div>
        </div>
        <div className="order-3 self-center">
          <PrizeBoard prizes={board.right} eliminatedIds={eliminatedIds} align="right" />
        </div>
      </main>

      <AnimatePresence>
        {phase === 'reveal' && revealedPrize && (
          <RevealOverlay key="reveal" prize={revealedPrize} onContinue={continueAfterReveal} />
        )}
        {phase === 'banker' && bankerOffer && (
          <BankerModal
            key="banker"
            subphase={bankerSub}
            offer={bankerOffer}
            onDeal={bankerDeal}
            onKeep={bankerKeep}
          />
        )}
        {phase === 'swap' && <SwapModal key="swap" onKeep={swapKeep} onSwap={swapChoose} />}
        {phase === 'final' && <FinalModal key="final" onKeep={finalKeep} onSwap={finalSwap} />}
        {phase === 'finalReveal' && (
          <div key="finalreveal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <p className="text-amber-300 text-2xl md:text-3xl tracking-[0.3em] font-bold animate-pulse">
                OPENING YOUR BOX...
              </p>
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-7xl md:text-8xl"
              >
                🎁
              </motion.div>
            </motion.div>
          </div>
        )}
        {phase === 'won' && wonPrize && (
          <WonOverlay
            key="won"
            prize={wonPrize}
            otherPrize={otherPrize}
            sourceLabel={sourceLabel}
            onAgain={newGame}
            onSetup={() => navigate('/')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}