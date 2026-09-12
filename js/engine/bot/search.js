// Search: iterative deepening, negamax alpha-beta with quiescence, transposition table,
// killer moves, history heuristic, null-move pruning, check extension, late-move reduction.
import { mFrom, mTo, mFlags, mPromo, F_CAPTURE, F_PROMO, typeOf, KING, PAWN } from './board.js'
import { evaluate, VALUE, MATE } from './eval.js'

const TT_BITS = 20, TT_SIZE = 1 << TT_BITS, TT_MASK = TT_SIZE - 1
const TT_EXACT = 1, TT_ALPHA = 2, TT_BETA = 3
const MAX_PLY = 64

export class Search {
  constructor() {
    this.ttKey = new Int32Array(TT_SIZE)   // hi half of the key; index comes from lo
    this.ttDepth = new Int8Array(TT_SIZE)
    this.ttScore = new Int16Array(TT_SIZE)
    this.ttFlag = new Int8Array(TT_SIZE)
    this.ttMove = new Int32Array(TT_SIZE)
    this.killers = Array.from({ length: MAX_PLY }, () => [0, 0])
    this.history = new Int32Array(2 * 128 * 128)
    this.nodes = 0
    this.stopped = false
    this.deadline = 0
    this.onInfo = null
  }
  clear() { this.ttKey.fill(0); this.ttDepth.fill(0); this.ttFlag.fill(0); this.ttMove.fill(0); this.history.fill(0) }

  /** @returns {{move:number, score:number, depth:number, pv:number[]}} */
  think(board, { movetime = 1000, depth: maxDepth = 64 } = {}) {
    this.nodes = 0; this.stopped = false
    this.deadline = Date.now() + movetime
    this.history.fill(0)
    for (const k of this.killers) { k[0] = 0; k[1] = 0 }
    let best = 0, bestScore = 0, bestDepth = 0, pv = []
    const start = Date.now()
    let prev = 0
    for (let d = 1; d <= maxDepth; d++) {
      // aspiration window around the previous score, widened on failure
      let alpha = d >= 4 ? prev - 40 : -MATE - 1, beta = d >= 4 ? prev + 40 : MATE + 1
      let score = this.negamax(board, d, alpha, beta, 0)
      if (!this.stopped && (score <= alpha || score >= beta)) score = this.negamax(board, d, -MATE - 1, MATE + 1, 0)
      if (this.stopped && d > 1) break
      prev = score
      const m = this.ttMove[board.lo & TT_MASK]
      if (m) { best = m; bestScore = score; bestDepth = d; pv = this.extractPv(board, d) }
      if (this.onInfo) this.onInfo({ depth: d, score, nodes: this.nodes, time: Date.now() - start, pv: pv.map(x => board.moveToUci(x)) })
      if (Math.abs(score) >= MATE - MAX_PLY) break                      // mate found
      if (Date.now() - start > movetime * 0.4) break                    // the next iteration would not finish
    }
    if (!best) { const legal = board.legalMoves(); best = legal[0] || 0 }
    return { move: best, score: bestScore, depth: bestDepth, pv }
  }

  extractPv(board, depth) {
    const pv = []
    for (let i = 0; i < depth; i++) {
      const m = this.ttMove[board.lo & TT_MASK]
      if (!m || this.ttKey[board.lo & TT_MASK] !== board.hi) break
      if (!board.legalMoves().includes(m)) break
      if (!board.make(m)) break
      pv.push(m)
    }
    for (let i = pv.length - 1; i >= 0; i--) board.unmake(pv[i])
    return pv
  }

  negamax(b, depth, alpha, beta, ply) {
    if ((++this.nodes & 2047) === 0 && Date.now() >= this.deadline) this.stopped = true
    if (this.stopped) return 0
    if (ply > 0 && (b.isRepetition() || b.halfmove >= 100)) return 0
    const inCheck = b.inCheck()
    if (inCheck) depth++                                                 // check extension
    if (depth <= 0) return this.quiesce(b, alpha, beta, ply)
    if (ply >= MAX_PLY - 1) return evaluate(b)

    // transposition table
    const idx = b.lo & TT_MASK
    let ttMove = 0
    if (this.ttKey[idx] === b.hi && this.ttFlag[idx]) {
      ttMove = this.ttMove[idx]
      if (this.ttDepth[idx] >= depth && ply > 0) {
        const s = this.ttScore[idx], f = this.ttFlag[idx]
        if (f === TT_EXACT) return s
        if (f === TT_ALPHA && s <= alpha) return alpha
        if (f === TT_BETA && s >= beta) return beta
      }
    }

    // null move pruning
    if (!inCheck && depth >= 3 && ply > 0 && b.hasNonPawnMaterial(b.side)) {
      b.makeNull()
      const s = -this.negamax(b, depth - 3, -beta, -beta + 1, ply + 1)
      b.unmakeNull()
      if (this.stopped) return 0
      if (s >= beta) return beta
    }

    // futility: at low depth, quiet moves from a clearly lost static position rarely rescue it
    const futile = !inCheck && depth <= 2 && Math.abs(alpha) < MATE - MAX_PLY && evaluate(b) + 120 * depth <= alpha
    const moves = b.generate()
    this.order(b, moves, ttMove, ply)
    let bestMove = 0, flag = TT_ALPHA, legal = 0
    const origAlpha = alpha
    for (let i = 0; i < moves.length; i++) {
      const m = moves[i]
      const quiet = !(mFlags(m) & (F_CAPTURE | F_PROMO))
      if (futile && quiet && legal > 0 && m !== ttMove && m !== this.killers[ply][0]) continue
      if (!b.make(m)) continue
      legal++
      if (futile && quiet && !b.inCheck()) { b.unmake(m); continue }
      let score
      if (legal === 1) score = -this.negamax(b, depth - 1, -beta, -alpha, ply + 1)
      else {
        // late move reduction for quiet moves searched late, then principal-variation search
        let r = 0
        if (quiet && depth >= 3 && legal > 4 && !inCheck && !b.inCheck()) r = 1
        score = -this.negamax(b, depth - 1 - r, -alpha - 1, -alpha, ply + 1)
        if (score > alpha && (r > 0 || score < beta)) score = -this.negamax(b, depth - 1, -beta, -alpha, ply + 1)
      }
      b.unmake(m)
      if (this.stopped) return 0
      if (score >= beta) {
        this.store(idx, b.hi, depth, beta, TT_BETA, m)
        if (quiet) {
          const k = this.killers[ply]; if (k[0] !== m) { k[1] = k[0]; k[0] = m }
          this.history[(b.side << 14) | (mFrom(m) << 7) | mTo(m)] += depth * depth
        }
        return beta
      }
      if (score > alpha) { alpha = score; bestMove = m; flag = TT_EXACT }
    }
    if (legal === 0) return inCheck ? -MATE + ply : 0
    if (flag === TT_ALPHA && alpha === origAlpha && ttMove) bestMove = ttMove
    this.store(idx, b.hi, depth, alpha, flag, bestMove)
    return alpha
  }

  quiesce(b, alpha, beta, ply) {
    if ((++this.nodes & 2047) === 0 && Date.now() >= this.deadline) this.stopped = true
    if (this.stopped) return 0
    const stand = evaluate(b)
    if (stand >= beta) return beta
    if (stand > alpha) alpha = stand
    if (ply >= MAX_PLY - 1) return stand
    const moves = b.generate(true)
    this.order(b, moves, 0, ply)
    for (const m of moves) {
      // delta pruning: skip captures that cannot raise alpha even if won cleanly
      const victim = b.sq[mTo(m)]
      if (victim && stand + VALUE[typeOf(victim)] + 200 < alpha && !(mFlags(m) & F_PROMO)) continue
      if (!b.make(m)) continue
      const score = -this.quiesce(b, -beta, -alpha, ply + 1)
      b.unmake(m)
      if (this.stopped) return 0
      if (score >= beta) return beta
      if (score > alpha) alpha = score
    }
    return alpha
  }

  order(b, moves, ttMove, ply) {
    const k = this.killers[ply], sq = b.sq, side = b.side
    const scores = new Array(moves.length)
    for (let i = 0; i < moves.length; i++) {
      const m = moves[i]
      let s = 0
      if (m === ttMove) s = 1e9
      else if (mFlags(m) & F_CAPTURE) {
        const victim = sq[mTo(m)], attacker = sq[mFrom(m)]
        s = 1e6 + (victim ? VALUE[typeOf(victim)] : VALUE[PAWN]) * 10 - VALUE[typeOf(attacker)]
      } else if (mFlags(m) & F_PROMO) s = 9e5 + VALUE[mPromo(m)]
      else if (m === k[0]) s = 8e5
      else if (m === k[1]) s = 7e5
      else s = this.history[(side << 14) | (mFrom(m) << 7) | mTo(m)]
      scores[i] = s
    }
    // insertion sort by score, descending (move lists are short)
    for (let i = 1; i < moves.length; i++) {
      const m = moves[i], s = scores[i]; let j = i - 1
      while (j >= 0 && scores[j] < s) { moves[j + 1] = moves[j]; scores[j + 1] = scores[j]; j-- }
      moves[j + 1] = m; scores[j + 1] = s
    }
  }

  store(idx, hi, depth, score, flag, move) {
    if (this.stopped) return
    this.ttKey[idx] = hi; this.ttDepth[idx] = depth; this.ttScore[idx] = score; this.ttFlag[idx] = flag
    if (move) this.ttMove[idx] = move
  }
}
