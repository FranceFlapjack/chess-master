// Chess Master Bot — board representation and move generation.
// 0x88 mailbox: square = rank*16 + file; an index with (sq & 0x88) set is off the board.
// Pieces: (color << 3) | type. Empty = 0. Moves are packed integers (see encode()).

export const WHITE = 0, BLACK = 1
export const EMPTY = 0, PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6
export const typeOf = p => p & 7
export const colorOf = p => p >> 3
export const makePiece = (c, t) => (c << 3) | t

// castling rights bits
export const WK = 1, WQ = 2, BK = 4, BQ = 8

// move flags
export const F_CAPTURE = 1, F_DOUBLE = 2, F_EP = 4, F_CASTLE = 8, F_PROMO = 16
export const encode = (from, to, promo = 0, flags = 0) => from | (to << 7) | (promo << 14) | (flags << 17)
export const mFrom = m => m & 0x7f
export const mTo = m => (m >> 7) & 0x7f
export const mPromo = m => (m >> 14) & 7
export const mFlags = m => (m >> 17) & 31

const N_OFFS = [-33, -31, -18, -14, 14, 18, 31, 33]
const K_OFFS = [-17, -16, -15, -1, 1, 15, 16, 17]
const B_DIRS = [-17, -15, 15, 17]
const R_DIRS = [-16, -1, 1, 16]
const PAWN_PUSH = [16, -16]           // white moves up the board (rank increases)
const PAWN_CAPS = [[15, 17], [-15, -17]]

export const sqName = sq => 'abcdefgh'[sq & 7] + (((sq >> 4) & 7) + 1)
export const nameSq = s => (s.charCodeAt(1) - 49) * 16 + (s.charCodeAt(0) - 97)
export const sq64 = sq => ((sq >> 4) << 3) | (sq & 7)        // 0x88 -> 0..63 (a1=0)
export const PIECE_CHARS = ' PNBRQK'

// --- Zobrist keys (two 32-bit halves per feature; deterministic PRNG so keys are stable) ---
let seed = 0x9e3779b9
const rnd = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed | 0 }
export const Z_PIECE = new Int32Array(16 * 128 * 2)
export const Z_CASTLE = new Int32Array(16 * 2)
export const Z_EP = new Int32Array(8 * 2)
export const Z_SIDE = [rnd(), rnd()]
for (let i = 0; i < Z_PIECE.length; i++) Z_PIECE[i] = rnd()
for (let i = 0; i < Z_CASTLE.length; i++) Z_CASTLE[i] = rnd()
for (let i = 0; i < Z_EP.length; i++) Z_EP[i] = rnd()

export class Board {
  constructor(fen) {
    this.sq = new Int8Array(128)
    this.side = WHITE
    this.castling = 0
    this.ep = -1
    this.halfmove = 0
    this.fullmove = 1
    this.king = [0, 0]
    this.lo = 0; this.hi = 0        // Zobrist halves
    this.undo = []                  // {captured, castling, ep, halfmove, lo, hi}
    this.keys = []                  // hash history (lo) for repetition detection
    this.load(fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  }

  load(fen) {
    this.sq.fill(0)
    const [pieces, side, castle, ep, half, full] = fen.trim().split(/\s+/)
    let rank = 7, file = 0
    for (const ch of pieces) {
      if (ch === '/') { rank--; file = 0; continue }
      if (ch >= '1' && ch <= '8') { file += +ch; continue }
      const t = PIECE_CHARS.indexOf(ch.toUpperCase())
      const c = ch === ch.toUpperCase() ? WHITE : BLACK
      const s = rank * 16 + file
      this.sq[s] = makePiece(c, t)
      if (t === KING) this.king[c] = s
      file++
    }
    this.side = side === 'b' ? BLACK : WHITE
    this.castling = 0
    if (castle && castle !== '-') for (const ch of castle) this.castling |= { K: WK, Q: WQ, k: BK, q: BQ }[ch] || 0
    this.ep = ep && ep !== '-' ? nameSq(ep) : -1
    this.halfmove = +half || 0
    this.fullmove = +full || 1
    this.undo.length = 0
    this.keys.length = 0
    this._rehash()
  }

  fen() {
    let out = ''
    for (let r = 7; r >= 0; r--) {
      let empty = 0
      for (let f = 0; f < 8; f++) {
        const p = this.sq[r * 16 + f]
        if (!p) { empty++; continue }
        if (empty) { out += empty; empty = 0 }
        const ch = PIECE_CHARS[typeOf(p)]
        out += colorOf(p) === WHITE ? ch : ch.toLowerCase()
      }
      if (empty) out += empty
      if (r) out += '/'
    }
    const c = (this.castling & WK ? 'K' : '') + (this.castling & WQ ? 'Q' : '') + (this.castling & BK ? 'k' : '') + (this.castling & BQ ? 'q' : '')
    return `${out} ${this.side === WHITE ? 'w' : 'b'} ${c || '-'} ${this.ep >= 0 ? sqName(this.ep) : '-'} ${this.halfmove} ${this.fullmove}`
  }

  _rehash() {
    let lo = 0, hi = 0
    for (let s = 0; s < 128; s++) {
      if (s & 0x88) continue
      const p = this.sq[s]
      if (p) { lo ^= Z_PIECE[(p * 128 + s) * 2]; hi ^= Z_PIECE[(p * 128 + s) * 2 + 1] }
    }
    lo ^= Z_CASTLE[this.castling * 2]; hi ^= Z_CASTLE[this.castling * 2 + 1]
    if (this.ep >= 0) { lo ^= Z_EP[(this.ep & 7) * 2]; hi ^= Z_EP[(this.ep & 7) * 2 + 1] }
    if (this.side === BLACK) { lo ^= Z_SIDE[0]; hi ^= Z_SIDE[1] }
    this.lo = lo; this.hi = hi
  }

  // --- attacks ---
  isAttacked(s, by) {
    const sq = this.sq
    // pawns
    const pc = PAWN_CAPS[by ^ 1] // squares from which an enemy pawn of colour `by` attacks s
    for (const d of pc) { const t = s + d; if (!(t & 0x88) && sq[t] === makePiece(by, PAWN)) return true }
    for (const d of N_OFFS) { const t = s + d; if (!(t & 0x88) && sq[t] === makePiece(by, KNIGHT)) return true }
    for (const d of K_OFFS) { const t = s + d; if (!(t & 0x88) && sq[t] === makePiece(by, KING)) return true }
    const bq = [makePiece(by, BISHOP), makePiece(by, QUEEN)], rq = [makePiece(by, ROOK), makePiece(by, QUEEN)]
    for (const d of B_DIRS) { let t = s + d; while (!(t & 0x88)) { const p = sq[t]; if (p) { if (p === bq[0] || p === bq[1]) return true; break } t += d } }
    for (const d of R_DIRS) { let t = s + d; while (!(t & 0x88)) { const p = sq[t]; if (p) { if (p === rq[0] || p === rq[1]) return true; break } t += d } }
    return false
  }
  inCheck() { return this.isAttacked(this.king[this.side], this.side ^ 1) }

  // --- move generation (pseudo-legal; legality is checked by make()) ---
  generate(capturesOnly = false) {
    const moves = [], sq = this.sq, us = this.side, them = us ^ 1
    const push = PAWN_PUSH[us], caps = PAWN_CAPS[us]
    const promoRank = us === WHITE ? 7 : 0, startRank = us === WHITE ? 1 : 6
    for (let s = 0; s < 128; s++) {
      if (s & 0x88) { s += 7; continue }
      const p = sq[s]
      if (!p || colorOf(p) !== us) continue
      const t = typeOf(p)
      if (t === PAWN) {
        const one = s + push
        if (!(one & 0x88) && !sq[one]) {
          if ((one >> 4) === promoRank) { for (let pr = QUEEN; pr >= KNIGHT; pr--) moves.push(encode(s, one, pr, F_PROMO)) }
          else if (!capturesOnly) {
            moves.push(encode(s, one))
            const two = one + push
            if ((s >> 4) === startRank && !sq[two]) moves.push(encode(s, two, 0, F_DOUBLE))
          }
        }
        for (const d of caps) {
          const c = s + d
          if (c & 0x88) continue
          const q = sq[c]
          if (q && colorOf(q) === them) {
            if ((c >> 4) === promoRank) { for (let pr = QUEEN; pr >= KNIGHT; pr--) moves.push(encode(s, c, pr, F_PROMO | F_CAPTURE)) }
            else moves.push(encode(s, c, 0, F_CAPTURE))
          } else if (c === this.ep) moves.push(encode(s, c, 0, F_EP | F_CAPTURE))
        }
      } else if (t === KNIGHT || t === KING) {
        for (const d of (t === KNIGHT ? N_OFFS : K_OFFS)) {
          const c = s + d
          if (c & 0x88) continue
          const q = sq[c]
          if (!q) { if (!capturesOnly) moves.push(encode(s, c)) }
          else if (colorOf(q) === them) moves.push(encode(s, c, 0, F_CAPTURE))
        }
      } else {
        const dirs = t === BISHOP ? B_DIRS : t === ROOK ? R_DIRS : B_DIRS.concat(R_DIRS)
        for (const d of dirs) {
          let c = s + d
          while (!(c & 0x88)) {
            const q = sq[c]
            if (!q) { if (!capturesOnly) moves.push(encode(s, c)) }
            else { if (colorOf(q) === them) moves.push(encode(s, c, 0, F_CAPTURE)); break }
            c += d
          }
        }
      }
    }
    if (!capturesOnly) {
      const k = this.king[us]
      if (us === WHITE) {
        if ((this.castling & WK) && !sq[0x05] && !sq[0x06] && !this.isAttacked(0x04, them) && !this.isAttacked(0x05, them) && !this.isAttacked(0x06, them)) moves.push(encode(k, 0x06, 0, F_CASTLE))
        if ((this.castling & WQ) && !sq[0x03] && !sq[0x02] && !sq[0x01] && !this.isAttacked(0x04, them) && !this.isAttacked(0x03, them) && !this.isAttacked(0x02, them)) moves.push(encode(k, 0x02, 0, F_CASTLE))
      } else {
        if ((this.castling & BK) && !sq[0x75] && !sq[0x76] && !this.isAttacked(0x74, them) && !this.isAttacked(0x75, them) && !this.isAttacked(0x76, them)) moves.push(encode(k, 0x76, 0, F_CASTLE))
        if ((this.castling & BQ) && !sq[0x73] && !sq[0x72] && !sq[0x71] && !this.isAttacked(0x74, them) && !this.isAttacked(0x73, them) && !this.isAttacked(0x72, them)) moves.push(encode(k, 0x72, 0, F_CASTLE))
      }
    }
    return moves
  }

  _hashPiece(p, s) { this.lo ^= Z_PIECE[(p * 128 + s) * 2]; this.hi ^= Z_PIECE[(p * 128 + s) * 2 + 1] }

  /** Makes the move. Returns false (and leaves the position untouched) if it leaves our king in check. */
  make(m) {
    const sq = this.sq, us = this.side, them = us ^ 1
    const from = mFrom(m), to = mTo(m), flags = mFlags(m), promo = mPromo(m)
    const piece = sq[from]
    let captured = sq[to]
    this.undo.push({ captured, castling: this.castling, ep: this.ep, halfmove: this.halfmove, lo: this.lo, hi: this.hi })
    this.keys.push(this.lo)
    // hash out old castling / ep
    this.lo ^= Z_CASTLE[this.castling * 2]; this.hi ^= Z_CASTLE[this.castling * 2 + 1]
    if (this.ep >= 0) { this.lo ^= Z_EP[(this.ep & 7) * 2]; this.hi ^= Z_EP[(this.ep & 7) * 2 + 1] }

    if (flags & F_EP) {
      const capSq = to - PAWN_PUSH[us]
      captured = sq[capSq]
      this._hashPiece(captured, capSq); sq[capSq] = 0
      this.undo[this.undo.length - 1].captured = captured
    } else if (captured) this._hashPiece(captured, to)

    this._hashPiece(piece, from); sq[from] = 0
    const placed = promo ? makePiece(us, promo) : piece
    sq[to] = placed; this._hashPiece(placed, to)

    if (flags & F_CASTLE) {
      const rFrom = to > from ? from + 3 : from - 4, rTo = to > from ? from + 1 : from - 1
      const rook = sq[rFrom]
      this._hashPiece(rook, rFrom); sq[rFrom] = 0
      sq[rTo] = rook; this._hashPiece(rook, rTo)
    }
    if (typeOf(piece) === KING) this.king[us] = to

    // castling rights
    if (from === 0x04 || to === 0x04) this.castling &= ~(WK | WQ)
    if (from === 0x74 || to === 0x74) this.castling &= ~(BK | BQ)
    if (from === 0x00 || to === 0x00) this.castling &= ~WQ
    if (from === 0x07 || to === 0x07) this.castling &= ~WK
    if (from === 0x70 || to === 0x70) this.castling &= ~BQ
    if (from === 0x77 || to === 0x77) this.castling &= ~BK
    this.ep = (flags & F_DOUBLE) ? from + PAWN_PUSH[us] : -1
    this.halfmove = (captured || typeOf(piece) === PAWN) ? 0 : this.halfmove + 1
    if (us === BLACK) this.fullmove++
    this.side = them

    this.lo ^= Z_CASTLE[this.castling * 2]; this.hi ^= Z_CASTLE[this.castling * 2 + 1]
    if (this.ep >= 0) { this.lo ^= Z_EP[(this.ep & 7) * 2]; this.hi ^= Z_EP[(this.ep & 7) * 2 + 1] }
    this.lo ^= Z_SIDE[0]; this.hi ^= Z_SIDE[1]

    if (this.isAttacked(this.king[us], them)) { this.unmake(m); return false }
    return true
  }

  unmake(m) {
    const u = this.undo.pop(); this.keys.pop()
    const sq = this.sq
    this.side ^= 1
    const us = this.side
    const from = mFrom(m), to = mTo(m), flags = mFlags(m), promo = mPromo(m)
    const placed = sq[to]
    const piece = promo ? makePiece(us, PAWN) : placed
    sq[from] = piece; sq[to] = 0
    if (flags & F_EP) sq[to - PAWN_PUSH[us]] = u.captured
    else if (u.captured) sq[to] = u.captured
    if (flags & F_CASTLE) {
      const rFrom = to > from ? from + 3 : from - 4, rTo = to > from ? from + 1 : from - 1
      sq[rFrom] = sq[rTo]; sq[rTo] = 0
    }
    if (typeOf(piece) === KING) this.king[us] = from
    this.castling = u.castling; this.ep = u.ep; this.halfmove = u.halfmove
    this.lo = u.lo; this.hi = u.hi
    if (us === BLACK) this.fullmove--
  }

  makeNull() {
    this.undo.push({ captured: 0, castling: this.castling, ep: this.ep, halfmove: this.halfmove, lo: this.lo, hi: this.hi, nul: true })
    this.keys.push(this.lo)
    if (this.ep >= 0) { this.lo ^= Z_EP[(this.ep & 7) * 2]; this.hi ^= Z_EP[(this.ep & 7) * 2 + 1] }
    this.ep = -1; this.side ^= 1
    this.lo ^= Z_SIDE[0]; this.hi ^= Z_SIDE[1]
  }
  unmakeNull() {
    const u = this.undo.pop(); this.keys.pop()
    this.side ^= 1; this.ep = u.ep; this.lo = u.lo; this.hi = u.hi
  }

  /** Legal moves as a list (used by UCI and tests). */
  legalMoves() {
    const out = []
    for (const m of this.generate()) if (this.make(m)) { this.unmake(m); out.push(m) }
    return out
  }
  /** Has the current position occurred before in the game / search path? */
  isRepetition() {
    const n = this.keys.length
    for (let i = n - 2; i >= 0 && i >= n - this.halfmove; i -= 2) if (this.keys[i] === this.lo) return true
    return false
  }
  hasNonPawnMaterial(c) {
    for (let s = 0; s < 128; s++) { if (s & 0x88) { s += 7; continue } const p = this.sq[s]; if (p && colorOf(p) === c && typeOf(p) > PAWN && typeOf(p) < KING) return true }
    return false
  }

  moveToUci(m) { return sqName(mFrom(m)) + sqName(mTo(m)) + (mPromo(m) ? PIECE_CHARS[mPromo(m)].toLowerCase() : '') }
  uciToMove(u) {
    const from = nameSq(u.slice(0, 2)), to = nameSq(u.slice(2, 4)), promo = u[4] ? PIECE_CHARS.indexOf(u[4].toUpperCase()) : 0
    for (const m of this.generate()) if (mFrom(m) === from && mTo(m) === to && mPromo(m) === promo) return m
    return 0
  }
  perft(depth) {
    if (depth === 0) return 1
    let n = 0
    for (const m of this.generate()) { if (!this.make(m)) continue; n += depth === 1 ? 1 : this.perft(depth - 1); this.unmake(m) }
    return n
  }
}
