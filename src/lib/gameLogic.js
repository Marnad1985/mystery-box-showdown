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

export function computeBankerOffer(game, pool, numBoxes) {
  const remaining = game.boxes.filter((b) => !b.opened);
  if (!remaining.length || !pool.length) return null;
  const total = remaining.reduce((s, b) => s + (b.prize.value || 0), 0);
  const avg = total / remaining.length;
  const progress = (numBoxes - remaining.length) / numBoxes;
  const factor = 0.4 + 0.4 * progress + Math.min(0.15, game.rejectedOffers.length * 0.03);
  const target = avg * factor;
  const sorted = [...pool].sort((a, b) => (a.value || 0) - (b.value || 0));
  let best = sorted[0];
  let bestDiff = Infinity;
  for (const item of sorted) {
    const diff = Math.abs((item.value || 0) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = item;
    }
  }
  return best;
}

export function splitBoard(prizes) {
  const sorted = [...prizes].sort((a, b) => a.value - b.value);
  const half = Math.ceil(sorted.length / 2);
  return { left: sorted.slice(0, half), right: sorted.slice(half) };
}