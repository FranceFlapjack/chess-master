// A second, full-strength Stockfish used only to judge positions: the live evaluation bar and the
// post-game review. Separate from the opponent instance, which may be strength-limited.
import { UciEngine } from './uci.js'
import { STOCKFISH_URL } from './stockfish.js'
import { toWhite } from '../analysis.js'
import { DEFAULT_POSITION } from '../../vendor/chess.js/chess.js'

let instance = null
export function analyst() {
  if (!instance) instance = new Analyst()
  return instance
}

class Analyst {
  constructor() {
    this.engine = new UciEngine(STOCKFISH_URL, { name: 'analyst' })
    this.queue = Promise.resolve()
    this.busy = false
    this.gen = 0
  }
  ready() { return this.engine.ready() }
  newGame() { const p = this.queue.then(() => this.engine.ready()).then(() => this.engine.newGame()); this.queue = p.catch(() => {}); return p }
  stop() { if (this.busy) this.engine.stop() }
  /**
   * Evaluate the position after `moves` (UCI, from the start position). Any search in progress is
   * stopped first; requests run one at a time. Resolves { cp, mate, depth, best, pv } from White's
   * point of view, or null if a newer request superseded it. onInfo streams partial results in the same shape.
   */
  evaluate({ moves, depth = 14, movetime = null, onInfo = null }) {
    const stm = moves.length % 2 === 0 ? 'w' : 'b'
    const norm = r => Object.assign(toWhite(r, stm), { depth: r.depth, best: r.bestMove || (r.pv && r.pv[0]) || null, pv: r.pv || [] })
    this.stop()
    const myGen = ++this.gen
    const run = async () => {
      if (myGen !== this.gen) return null // superseded while waiting in the queue
      await this.engine.ready()
      this.busy = true
      try {
        const r = await this.engine.analyse({ fen: DEFAULT_POSITION, moves, depth, movetime, onInfo: onInfo && (i => onInfo(norm({ cp: i.scoreType === 'cp' ? i.score : null, mate: i.scoreType === 'mate' ? i.score : null, depth: i.depth, pv: i.pv }))) })
        return norm(r)
      } finally { this.busy = false }
    }
    const p = this.queue.then(run, run)
    this.queue = p.catch(() => {})
    return p
  }
  destroy() { this.engine.destroy(); instance = null }
}
