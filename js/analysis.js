// Pure helpers for evaluation display and move grading. No DOM, no engine: node can test them.
// Conventions: an eval is { cp, mate } from White's point of view; `mate` is signed moves to mate
// (positive: White mates) and wins over `cp` when present.

const MATE_CP = 10000
/** A finished game: checkmate on the board, given as a plain cp so it sorts with the rest. */
export const MATED = { w: { cp: MATE_CP, mate: null }, b: { cp: -MATE_CP, mate: null } } // key = winner

/** Lichess's logistic model: winning chances for White in [-1, 1]. */
export function winChance(ev) {
  if (!ev) return 0
  if (ev.mate != null) return ev.mate > 0 ? 1 : -1
  return 2 / (1 + Math.exp(-0.00368208 * clamp(ev.cp, -MATE_CP, MATE_CP))) - 1
}

/** Share of the bar (0..1) that belongs to White. Never fully empty unless it is mate. */
export function whiteShare(ev) {
  if (!ev) return 0.5
  if (ev.mate != null) return ev.mate > 0 ? 1 : 0
  if (Math.abs(ev.cp) >= MATE_CP) return ev.cp > 0 ? 1 : 0
  const s = (winChance(ev) + 1) / 2
  return clamp(s, 0.05, 0.95)
}

/** "+1.2", "−0.4", "M3", "−M2", "0.0" from White's point of view. */
export function formatScore(ev) {
  if (!ev) return ''
  if (ev.mate != null) return ev.mate === 0 ? '#' : (ev.mate > 0 ? 'M' : '−M') + Math.abs(ev.mate)
  if (Math.abs(ev.cp) >= MATE_CP) return '#'
  const p = ev.cp / 100
  const s = Math.abs(p).toFixed(1)
  return p > 0.05 ? '+' + s : p < -0.05 ? '−' + s : '0.0'
}

/** Engine score (from the side to move) → White's point of view. */
export function toWhite({ cp, mate }, sideToMove) {
  const sign = sideToMove === 'w' ? 1 : -1
  return { cp: cp == null ? null : cp * sign, mate: mate == null ? null : mate * sign }
}

/**
 * Grade the move that led from `before` to `after`, played by `mover` ('w' | 'b').
 * Returns { drop, label } where drop is the fall in the mover's winning chances (0..2) and label is
 * '' | 'inaccuracy' | 'mistake' | 'blunder' — the Lichess thresholds 0.1 / 0.2 / 0.3.
 */
export function grade(before, after, mover, playedIsBest = false) {
  const sign = mover === 'w' ? 1 : -1
  const drop = (winChance(before) - winChance(after)) * sign
  // still clearly winning afterwards (about +5 or better): not worth a mark at club level
  if (playedIsBest || winChance(after) * sign >= 0.75) return { drop, label: '' }
  const label = drop >= 0.3 ? 'blunder' : drop >= 0.2 ? 'mistake' : drop >= 0.1 ? 'inaccuracy' : ''
  return { drop, label }
}

/** Lichess move accuracy in percent from the mover's win% before and after the move. */
export function moveAccuracy(before, after, mover) {
  const sign = mover === 'w' ? 1 : -1
  const pct = ev => 50 + 50 * winChance(ev) * sign
  const loss = Math.max(0, pct(before) - pct(after))
  return clamp(103.1668 * Math.exp(-0.04354 * loss) - 3.1669, 0, 100)
}

export const GLYPH = { inaccuracy: '?!', mistake: '?', blunder: '??' }

function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)) }
