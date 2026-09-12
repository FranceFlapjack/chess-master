// Evaluation, version 2: material + piece-square tables (tapered king), pawn structure, passed pawns,
// king shelter, mobility, rooks on open files and the seventh, bishop pair, mop-up in won endgames, tempo.
// Tables: Tomasz Michniewski's "Simplified Evaluation Function" (Chess Programming Wiki), a public reference set.
import { PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, typeOf, colorOf, WHITE, BLACK, sq64, makePiece } from './board.js'

export const VALUE = [0, 100, 320, 330, 500, 900, 20000]
export const MATE = 30000

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

const flip = i => ((7 - (i >> 3)) << 3) | (i & 7)
export const PST = [], PST_KING_END = []
for (let c = 0; c < 2; c++) for (let t = PAWN; t <= KING; t++) {
  const tbl = new Int16Array(64), kend = new Int16Array(64)
  for (let i = 0; i < 64; i++) {
    const s = flip(i), target = c === WHITE ? s : flip(s)
    tbl[target] = PST_SRC[t][i]
    if (t === KING) kend[target] = KING_END_SRC[i]
  }
  PST[(c << 3) | t] = tbl
  if (t === KING) PST_KING_END[(c << 3) | t] = kend
}

// --- tunable terms (centipawns) ---
const DOUBLED = -12, ISOLATED = -14
const PASSED_MG = [0, 5, 10, 20, 35, 60, 100, 0]   // by relative rank (0 = own back rank)
const PASSED_EG = [0, 10, 20, 40, 70, 120, 200, 0]
const SHIELD_MISSING = -16, SHIELD_OPEN_FILE = -12
const MOB_N = 4, MOB_B = 4, MOB_R = 2, MOB_Q = 1
const ROOK_OPEN = 22, ROOK_SEMI = 10, ROOK_SEVENTH = 20
const BISHOP_PAIR = 30, TEMPO = 10

const N_OFFS = [-33, -31, -18, -14, 14, 18, 31, 33]
const B_DIRS = [-17, -15, 15, 17], R_DIRS = [-16, -1, 1, 16], Q_DIRS = [-17, -16, -15, -1, 1, 15, 16, 17]
const CENTER_DIST = new Int8Array(64)
for (let i = 0; i < 64; i++) { const f = i & 7, r = i >> 3; CENTER_DIST[i] = Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5)) * 2 - 1 }

const pawnFiles = [new Int8Array(10), new Int8Array(10)]   // index file+1, so files -1 and 8 read as 0
const pawnMinRank = [new Int8Array(10), new Int8Array(10)] // most advanced enemy-facing pawn per file (for passed-pawn test)
const pawnMaxRank = [new Int8Array(10), new Int8Array(10)]

/** Static evaluation from the side-to-move's point of view, in centipawns. */
export function evaluate(b) {
  const sq = b.sq
  let mg = 0, eg = 0, material = 0, nonPawn = 0
  const bishops = [0, 0], pawns = [0, 0], pieces = [0, 0]
  // pass 1: pawn maps
  for (let c = 0; c < 2; c++) { pawnFiles[c].fill(0); pawnMinRank[c].fill(8); pawnMaxRank[c].fill(-1) }
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) { s += 7; continue }
    const p = sq[s]; if (!p || typeOf(p) !== PAWN) continue
    const c = colorOf(p), f = (s & 7) + 1, r = s >> 4
    pawnFiles[c][f]++
    if (r < pawnMinRank[c][f]) pawnMinRank[c][f] = r
    if (r > pawnMaxRank[c][f]) pawnMaxRank[c][f] = r
  }
  // pass 2: pieces
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) { s += 7; continue }
    const p = sq[s]; if (!p) continue
    const t = typeOf(p), c = colorOf(p), sign = c === WHITE ? 1 : -1, i = sq64(s), f = s & 7, r = s >> 4
    const relRank = c === WHITE ? r : 7 - r
    if (t !== KING) { material += sign * VALUE[t]; if (t > PAWN) { nonPawn += VALUE[t]; pieces[c]++ } }
    let vmg = 0, veg = 0
    switch (t) {
      case PAWN: {
        vmg += PST[p][i]; veg += PST[p][i]; pawns[c]++
        if (pawnFiles[c][f + 1] > 1) { vmg += DOUBLED; veg += DOUBLED }
        if (!pawnFiles[c][f] && !pawnFiles[c][f + 2]) { vmg += ISOLATED; veg += ISOLATED }
        // passed: no enemy pawn ahead on this or adjacent files
        const e = c ^ 1
        let passed = true
        for (let ff = f; ff <= f + 2; ff++) {
          if (!pawnFiles[e][ff]) continue
          if (c === WHITE ? pawnMaxRank[e][ff] > r : pawnMinRank[e][ff] < r) { passed = false; break }
        }
        if (passed) { vmg += PASSED_MG[relRank]; veg += PASSED_EG[relRank] }
        break
      }
      case KNIGHT: {
        let mob = 0
        for (const d of N_OFFS) { const q = s + d; if (!(q & 0x88) && (!sq[q] || colorOf(sq[q]) !== c)) mob++ }
        vmg += PST[p][i] + (mob - 4) * MOB_N; veg += PST[p][i] + (mob - 4) * MOB_N
        bishops[c] += 0
        break
      }
      case BISHOP: case ROOK: case QUEEN: {
        const dirs = t === BISHOP ? B_DIRS : t === ROOK ? R_DIRS : Q_DIRS
        let mob = 0
        for (const d of dirs) { let q = s + d; while (!(q & 0x88)) { const x = sq[q]; if (!x) mob++; else { if (colorOf(x) !== c) mob++; break } q += d } }
        const w = t === BISHOP ? MOB_B : t === ROOK ? MOB_R : MOB_Q
        const base = t === BISHOP ? 6 : t === ROOK ? 7 : 13
        vmg += PST[p][i] + (mob - base) * w; veg += PST[p][i] + (mob - base) * w
        if (t === BISHOP) bishops[c]++
        if (t === ROOK) {
          if (!pawnFiles[c][f + 1]) { const open = !pawnFiles[c ^ 1][f + 1]; vmg += open ? ROOK_OPEN : ROOK_SEMI; veg += open ? ROOK_OPEN / 2 : ROOK_SEMI / 2 }
          if (relRank === 6) { vmg += ROOK_SEVENTH; veg += ROOK_SEVENTH }
        }
        break
      }
      case KING: {
        vmg += PST[p][i]; veg += PST_KING_END[p][i]
        // pawn shelter (middlegame): friendly pawns on the three files around the king, one or two ranks ahead
        const ahead = c === WHITE ? 16 : -16
        for (let df = -1; df <= 1; df++) {
          const ff = f + df; if (ff < 0 || ff > 7) continue
          const s1 = s + ahead + df, s2 = s + 2 * ahead + df
          const own = makePiece(c, PAWN)
          const has = (!(s1 & 0x88) && sq[s1] === own) || (!(s2 & 0x88) && sq[s2] === own)
          if (!has) vmg += SHIELD_MISSING
          if (!pawnFiles[c][ff + 1] && !pawnFiles[c ^ 1][ff + 1]) vmg += SHIELD_OPEN_FILE
        }
        break
      }
    }
    mg += sign * vmg; eg += sign * veg
  }
  if (bishops[WHITE] >= 2) { mg += BISHOP_PAIR; eg += BISHOP_PAIR }
  if (bishops[BLACK] >= 2) { mg -= BISHOP_PAIR; eg -= BISHOP_PAIR }

  // insufficient material: lone minor piece cannot win
  if (!pawns[0] && !pawns[1] && Math.abs(material) <= 330 && (pieces[0] + pieces[1]) <= 1) return 0

  // mop-up: when one side has only a king (and no pawns), push it to the edge and bring our king close
  for (let c = 0; c < 2; c++) {
    const e = c ^ 1
    if (pieces[e] === 0 && pawns[e] === 0 && (material * (c === WHITE ? 1 : -1)) >= 400) {
      const ek = sq64(b.king[e]), mk = sq64(b.king[c])
      const kdist = Math.max(Math.abs((ek & 7) - (mk & 7)), Math.abs((ek >> 3) - (mk >> 3)))
      const bonus = CENTER_DIST[ek] * 10 + (7 - kdist) * 6
      eg += (c === WHITE ? 1 : -1) * bonus; mg += (c === WHITE ? 1 : -1) * bonus
    }
  }

  // phase: 0 = full middlegame, 1 = bare endgame (about 6200 of non-pawn material at the start)
  const phase = Math.min(1, Math.max(0, 1 - (nonPawn - 1200) / 5000))
  let score = material + Math.round(mg * (1 - phase) + eg * phase)
  score = b.side === WHITE ? score : -score
  return score + TEMPO
}
