// Minimal UCI client over a Web Worker. Works for Stockfish and, later, for our own engine,
// as long as the worker speaks UCI lines over postMessage.
export class UciEngine {
  constructor(workerUrl, { name = 'engine' } = {}) {
    this.name = name
    this.worker = new Worker(workerUrl)
    this.listeners = new Set()
    this.lastInfo = null
    this.worker.onmessage = e => this._line(typeof e.data === 'string' ? e.data : String(e.data))
    this.worker.onerror = e => console.error(`[${name}]`, e.message || e)
    this.readyPromise = this._init()
  }
  _line(line) {
    if (line.startsWith('info ') && line.includes(' score ')) this.lastInfo = parseInfo(line)
    for (const fn of this.listeners) fn(line)
  }
  send(cmd) { this.worker.postMessage(cmd) }
  waitFor(pred, timeoutMs = 90000) {
    return new Promise((resolve, reject) => {
      const timer = timeoutMs && setTimeout(() => { this.listeners.delete(fn); reject(new Error(`${this.name}: no reply`)) }, timeoutMs)
      const fn = line => { if (pred(line)) { clearTimeout(timer); this.listeners.delete(fn); resolve(line) } }
      this.listeners.add(fn)
    })
  }
  async _init() {
    this.send('uci'); await this.waitFor(l => l === 'uciok')
    this.send('isready'); await this.waitFor(l => l === 'readyok')
  }
  ready() { return this.readyPromise }
  setOption(name, value) { this.send(`setoption name ${name} value ${value}`) }
  async newGame() { this.send('ucinewgame'); this.send('isready'); await this.waitFor(l => l === 'readyok') }
  /** Returns the best move in UCI form (e2e4, e7e8q) or null. */
  async bestMove({ fen, moves = [], movetime = 500, depth = null }) {
    this.lastInfo = null
    this.send(`position fen ${fen}${moves.length ? ' moves ' + moves.join(' ') : ''}`)
    const reply = this.waitFor(l => l.startsWith('bestmove'))
    this.send(depth ? `go depth ${depth}` : `go movetime ${movetime}`)
    const line = await reply
    const mv = line.split(/\s+/)[1]
    return mv && mv !== '(none)' ? mv : null
  }
  stop() { this.send('stop') }
  destroy() { this.worker.terminate(); this.listeners.clear() }
}

function parseInfo(line) {
  const t = line.split(/\s+/); const info = {}
  for (let i = 0; i < t.length; i++) {
    if (t[i] === 'depth') info.depth = +t[i + 1]
    if (t[i] === 'score') { info.scoreType = t[i + 1]; info.score = +t[i + 2] }
    if (t[i] === 'pv') { info.pv = t.slice(i + 1); break }
  }
  return info
}

export const uciToMove = u => ({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || undefined })
