// UCI protocol for the Chess Learn Bot. IO-agnostic: feed lines to handle(), get lines from `send`.
import { Board } from './board.js'
import { Search } from './search.js'
import { MATE } from './eval.js'

export const BOT_NAME = 'Chess Learn Bot 0.1'

export class BotUci {
  constructor(send) {
    this.send = send
    this.board = new Board()
    this.search = new Search()
    this.search.onInfo = i => {
      const score = Math.abs(i.score) >= MATE - 100 ? `mate ${Math.ceil((MATE - Math.abs(i.score)) / 2) * Math.sign(i.score)}` : `cp ${i.score}`
      this.send(`info depth ${i.depth} score ${score} nodes ${i.nodes} time ${i.time} nps ${Math.round(i.nodes / Math.max(1, i.time) * 1000)} pv ${i.pv.join(' ')}`)
    }
  }
  handle(line) {
    line = line.trim()
    const [cmd, ...args] = line.split(/\s+/)
    switch (cmd) {
      case 'uci': this.send(`id name ${BOT_NAME}`); this.send('id author Chess Learn'); this.send('uciok'); break
      case 'isready': this.send('readyok'); break
      case 'ucinewgame': this.search.clear(); this.board.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); break
      case 'position': this.position(args); break
      case 'go': this.go(args); break
      case 'stop': break // searches are bounded by movetime; nothing to interrupt
      case 'quit': break
      case 'd': this.send(this.board.fen()); break
      default: break
    }
  }
  position(args) {
    let i = 0
    if (args[0] === 'startpos') { this.board.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); i = 1 }
    else if (args[0] === 'fen') { const end = args.indexOf('moves'); this.board.load(args.slice(1, end < 0 ? undefined : end).join(' ')); i = end < 0 ? args.length : end }
    if (args[i] === 'moves') for (const u of args.slice(i + 1)) { const m = this.board.uciToMove(u); if (!m || !this.board.make(m)) break }
  }
  go(args) {
    const opt = {}
    for (let i = 0; i < args.length; i += 2) opt[args[i]] = +args[i + 1]
    let movetime = opt.movetime
    if (!movetime) {
      const my = this.board.side === 0 ? opt.wtime : opt.btime, inc = (this.board.side === 0 ? opt.winc : opt.binc) || 0
      movetime = my ? Math.max(50, Math.min(my / 30 + inc * 0.8, my * 0.5)) : 1000
    }
    const r = this.search.think(this.board, { movetime, depth: opt.depth || 64 })
    this.send(`bestmove ${r.move ? this.board.moveToUci(r.move) : '(none)'}`)
  }
}
