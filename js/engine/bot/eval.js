// Evaluation: material + piece-square tables, tapered king table.
// Tables: Tomasz Michniewski's "Simplified Evaluation Function" (Chess Programming Wiki), a public reference set.
import { PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, typeOf, colorOf, WHITE, sq64 } from './board.js'

export const VALUE = [0, 100, 320, 330, 500, 900, 20000]
export const MATE = 30000

// tables are written from White's view, rank 8 first (index 0 = a8), as in the source
const PST_SRC = {
  [PAWN]: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0],
  [KNIGHT]: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50],
  [BISHOP]: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20],
  [ROOK]: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0],
  [QUEEN]: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20],
  [KING]: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20],
}
const KING_END_SRC = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50]

// Build lookup tables indexed [piece][sq64] for both colours (a1 = 0).
const flip = i => ((7 - (i >> 3)) << 3) | (i & 7)   // source index (a8=0) -> a1-based
export const PST = [] // PST[piece code][sq64]
export const PST_KING_END = []
for (let c = 0; c < 2; c++) for (let t = PAWN; t <= KING; t++) {
  const tbl = new Int16Array(64), kend = new Int16Array(64)
  for (let i = 0; i < 64; i++) {
    const s = flip(i)                       // white's square for source index i
    const target = c === WHITE ? s : flip(s) // mirror for black
    tbl[target] = PST_SRC[t][i]
    if (t === KING) kend[target] = KING_END_SRC[i]
  }
  PST[(c << 3) | t] = tbl
  if (t === KING) PST_KING_END[(c << 3) | t] = kend
}

/** Static evaluation from the side-to-move's point of view, in centipawns. */
export function evaluate(b) {
  const sq = b.sq
  let mg = 0, material = 0, nonPawn = 0
  let wb = 0, bb = 0
  const kings = []
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) { s += 7; continue }
    const p = sq[s]; if (!p) continue
    const t = typeOf(p), c = colorOf(p), sign = c === WHITE ? 1 : -1
    if (t === KING) { kings.push([p, s, sign]); continue }
    material += sign * VALUE[t]
    mg += sign * PST[p][sq64(s)]
    if (t > PAWN) nonPawn += VALUE[t]
    if (t === BISHOP) { if (c === WHITE) wb++; else bb++ }
  }
  // phase: 0 = full middlegame (all pieces), 1 = bare endgame
  const phase = Math.min(1, Math.max(0, 1 - (nonPawn - 2000) / 4000)) // ~6200 total non-pawn material at start
  for (const [p, s, sign] of kings) {
    const i = sq64(s)
    mg += sign * Math.round(PST[p][i] * (1 - phase) + PST_KING_END[p][i] * phase)
  }
  if (wb >= 2) mg += 30
  if (bb >= 2) mg -= 30
  const score = material + mg
  return b.side === WHITE ? score : -score
}
