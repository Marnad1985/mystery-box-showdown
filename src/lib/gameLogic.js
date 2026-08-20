export const LEVELS = ['yellow', 'orange', 'green', 'red'];

export const LEVEL_COLORS = {
  yellow: { bg: 'linear-gradient(135deg,#fde047,#facc15)', solid: '#facc15', text: '#713f12', glow: 'rgba(250,204,21,0.65)' },
  orange: { bg: 'linear-gradient(135deg,#fdba74,#f97316)', solid: '#f97316', text: '#7c2d12', glow: 'rgba(249,115,22,0.65)' },
  green:  { bg: 'linear-gradient(135deg,#86efac,#22c55e)', solid: '#22c55e', text: '#052e16', glow: 'rgba(34,197,94,0.65)' },
  red:    { bg: 'linear-gradient(135deg,#fca5a5,#ef4444)', solid: '#ef4444', text: '#450a0a', glow: 'rgba(239,68,68,0.65)' },
};

const MASTER_PRIZES = [
  { name: '€0.05', value: 0.05, level: 'yellow' },
  { name: '€0.10', value: 0.10, level: 'yellow' },
  { name: '€0.20', value: 0.20, level: 'yellow' },
  { name: '€0.40', value: 0.40, level: 'yellow' },
  { name: '€0.50', value: 0.50, level: 'yellow' },
  { name: 'Soft drink', value: 1.5, level: 'yellow' },
  { name: 'Coffee', value: 2, level: 'yellow' },
  { name: 'Slice of pizza', value: 3, level: 'yellow' },
  { name: '€0.75', value: 0.75, level: 'orange' },
  { name: '€1', value: 1, level: 'orange' },
  { name: '€2', value: 2, level: 'orange' },
  { name: 'Dessert', value: 4, level: 'orange' },
  { name: 'Full pizza', value: 8, level: 'orange' },
  { name: 'Hotel bracelet', value: 15, level: 'green' },
  { name: 'Bowling voucher for 2', value: 12, level: 'green' },
  { name: 'Bowling voucher for 4', value: 24, level: 'green' },
  { name: '€5', value: 5, level: 'red' },
  { name: '€10', value: 10, level: 'red' },
  { name: 'Bottle of bubbly wine', value: 25, level: 'red' },
  { name: 'Massage voucher', value: 50, level: 'red' },
];

const DEFAULT_BANKER_POOL = [
  { name: '€0.05', value: 0.05 },
  { name: '€0.25', value: 0.25 },
  { name: '€0.50', value: 0.50 },
  { name: '€0.75', value: 0.75 },
  { name: '€1', value: 1 },
  { name: '€2', value: 2 },
  { name: '€3', value: 3 },
  { name: '€5', value: 5 },
  { name: 'Soft drink', value: 1.5 },
  { name: 'Slice of pizza', value: 3 },
  { name: 'Bowling voucher for 1', value: 6 },
  { name: 'Bracelet', value: 10 },
];

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export function defaultPrizes(n) {
  const sorted = [...MASTER_PRIZES].sort((a, b) => a.value - b.value);
  const picks = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.min(sorted.length - 1, Math.floor((i * sorted.length) / n));
    picks.push({ ...sorted[idx], id: uid() });
  }
  return picks;
}

export function defaultBankerPool() {
  return DEFAULT_BANKER_POOL.map((p) => ({ ...p, id: uid() }));
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function swapPointsFor(N) {
  const p1 = Math.ceil(N / 2);
  const p2 = Math.ceil(N / 4);
  const pts = [p1, p2].filter((p) => p > 2);
  return [...new Set(pts)].sort((a, b) => b - a);
}

export function bankerPointsFor(N) {
  const count = Math.min(5, Math.max(2, Math.round(N / 5)));
  const pts = [];
  for (let i = 1; i <= count; i++) pts.push(Math.round((i * (N - 2)) / (count + 1)));
  return [...new Set(pts)].filter((p) => p >= 1 && p < N - 1);
}

function jitter(points) {
  return [...new Set(points.map((p) => Math.max(1, p + Math.floor(Math.random() * 3) - 1)))];
}

export function initGame(prizes, numBoxes) {
  const shuffled = shuffle(prizes.map((p) => ({ ...p })));
  const boxes = shuffled.map((prize, i) => ({ id: i, number: i + 1, prize, opened: false, isPlayerBox: false }));
  const playerIdx = Math.floor(Math.random() * boxes.length);
  boxes[playerIdx].isPlayerBox = true;
  return {
    boxes,
    playerBoxId: boxes[playerIdx].id,
    bankerPoints: jitter(bankerPointsFor(numBoxes)),
    swapPoints: swapPointsFor(numBoxes),
    rejectedOffers: [],
    swapsUsed: [],
  };
}

export const unopenedCount = (g) => g.boxes.filter((b) => !b.opened).length;
export const openedCount = (g) => g.boxes.filter((b) => b.opened).length;

const CURRENCY_RE = /^€/;
const isCashOffer = (item) => CURRENCY_RE.test((item?.name || '').trim());

const BANKER_MESSAGES = [
  'The Banker thinks you should stop.',
  'Interesting choice...',
  'The Banker is getting nervous.',
  'That one hurt.',
  'The Banker has something for you.',
  "He thinks someone in your family is giving you terrible advice.",
];
const NO_OFFER_MESSAGES = [
  'He just wanted to wish you good luck. 😈',
  "He's just calling to say... nice box. 😈",
  'The Banker is just admiring your courage. 😈',
];

const HIGH_VALUE = 5;

function pickClosest(items, target, avoid) {
  const sorted = [...items].sort((a, b) => (a.value || 0) - (b.value || 0));
  let pool2 = sorted;
  if (avoid && sorted.length > 1) {
    const filtered = sorted.filter((p) => p.name !== avoid.name);
    if (filtered.length) pool2 = filtered;
  }
  let best = pool2[0];
  let bestDiff = Infinity;
  for (const it of pool2) {
    const v = it.value || 0;
    let diff = Math.abs(v - target);
    if (v > target) diff = (v - target) * 1.6; // discourage large overpay
    if (diff < bestDiff) {
      bestDiff = diff;
      best = it;
    }
  }
  return best;
}

// The Banker engine is allowed to know every locked box's contents (including
// the player's box) and uses that hidden knowledge ~75-85% of the time, with
// controlled bluffing ~15-25%. It never directly reveals box contents.
export function computeBankerOffer(game, pool, numBoxes, opts = {}) {
  const remaining = game.boxes.filter((b) => !b.opened);
  if (!remaining.length || !pool.length) return null;
  const playerBox = game.boxes.find((b) => b.id === game.playerBoxId);
  const playerValue = playerBox ? playerBox.prize.value || 0 : 0;
  const total = remaining.reduce((s, b) => s + (b.prize.value || 0), 0);
  const avg = total / remaining.length;
  const progress = (numBoxes - remaining.length) / numBoxes;
  const baseFactor = 0.4 + 0.4 * progress + Math.min(0.15, (game.rejectedOffers || []).length * 0.03);
  let target = avg * baseFactor;

  const highAlive = remaining.some((b) => (b.prize.value || 0) >= HIGH_VALUE);

  // Occasional no-offer call (mid-game only) — keeps the Banker unpredictable.
  if (!opts.final && Math.random() < 0.08) {
    return { noOffer: true, message: NO_OFFER_MESSAGES[Math.floor(Math.random() * NO_OFFER_MESSAGES.length)] };
  }

  // Bluff ~20% of the time (within the 15-25% guidance).
  const bluff = Math.random() < 0.2;

  // Strategic lean from hidden player-box knowledge.
  let lean = 0;
  if (playerValue >= HIGH_VALUE) lean = 0.15;   // valuable box → Banker pushes to buy out
  else if (playerValue <= 1) lean = -0.1;        // low box → Banker relaxes (or bluffs the opposite)
  if (bluff) lean = -lean;
  target = target * (1 + lean);

  // Cash vs gift preference. Low/normal board → mostly gifts; dangerous board → more cash.
  let cashProb = highAlive ? 0.6 : 0.2;
  if (playerValue >= HIGH_VALUE && !bluff) cashProb = Math.min(0.85, cashProb + 0.2);
  const wantCash = Math.random() < cashProb;

  const cashItems = pool.filter(isCashOffer);
  const giftItems = pool.filter((p) => !isCashOffer(p));
  let candidates = wantCash ? cashItems : giftItems;
  if (!candidates.length) candidates = wantCash ? giftItems : cashItems;
  if (!candidates.length) return null;

  const lastRejected = (game.rejectedOffers || []).slice(-1)[0];
  const chosen = pickClosest(candidates, target, lastRejected);

  const message = Math.random() < 0.4 ? BANKER_MESSAGES[Math.floor(Math.random() * BANKER_MESSAGES.length)] : null;
  return { ...chosen, message, bluff };
}

export function splitBoard(prizes) {
  const sorted = [...prizes].sort((a, b) => a.value - b.value);
  const half = Math.ceil(sorted.length / 2);
  return { left: sorted.slice(0, half), right: sorted.slice(half) };
}

// ---- Round management: lockable assignments + fairness record ----
const ROUND_KEY = 'mysterybox.round';
const HISTORY_KEY = 'mysterybox.history';

export function createRound(config) {
  const game = initGame(config.prizes, config.numBoxes);
  const playerBox = game.boxes.find((b) => b.id === game.playerBoxId);
  const roundId = 'RND-' + Date.now().toString(36).toUpperCase();
  return {
    roundId,
    createdAt: new Date().toISOString(),
    lockedAt: null,
    status: 'pending', // pending -> active -> completed
    numBoxes: config.numBoxes,
    game,
    history: {
      startTimestamp: null,
      endTimestamp: null,
      initialAssignments: game.boxes.map((b) => ({ box: b.number, prize: b.prize.name, value: b.prize.value })),
      originalPlayerBox: playerBox.number,
      swaps: [],
      bankerOffers: [],
      finalPrize: null,
    },
  };
}

export function loadRound() {
  try {
    const r = localStorage.getItem(ROUND_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return null;
}
export function saveRound(round) {
  try {
    localStorage.setItem(ROUND_KEY, JSON.stringify(round));
  } catch {}
}
export function loadHistory() {
  try {
    const r = localStorage.getItem(HISTORY_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return [];
}
export function saveHistory(h) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)));
  } catch {}
}
export function completeRound(round, finalPrize, historyUpdates) {
  const completed = {
    ...round,
    status: 'completed',
    history: {
      ...round.history,
      ...historyUpdates,
      endTimestamp: new Date().toISOString(),
      finalPrize: finalPrize?.name || finalPrize || null,
    },
  };
  saveRound(completed);
  const hist = loadHistory();
  hist.unshift({
    roundId: completed.roundId,
    createdAt: completed.createdAt,
    lockedAt: completed.lockedAt,
    startTimestamp: completed.history.startTimestamp,
    endTimestamp: completed.history.endTimestamp,
    initialAssignments: completed.history.initialAssignments,
    originalPlayerBox: completed.history.originalPlayerBox,
    swaps: completed.history.swaps,
    bankerOffers: completed.history.bankerOffers,
    finalPrize: completed.history.finalPrize,
  });
  saveHistory(hist);
  return completed;
}