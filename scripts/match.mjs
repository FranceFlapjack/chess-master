#!/usr/bin/env node
// Match runner: Chess Learn Bot vs Stockfish (Elo-limited) under Node.
// Usage: node scripts/match.mjs [games=4] [elo=1500] [botMs=300] [sfMs=300]
import { Chess } from '../vendor/chess.js/chess.js'
import { BotUci } from '../js/engine/bot/uci.js'
import { loadStockfish } from './stockfish-node.mjs'

const [games = 4, elo = 1500, botMs = 300, sfMs = 300] = process.argv.slice(2).map(Number)
const sf = await loadStockfish()
sf.send('setoption name UCI_LimitStrength value true'); sf.send(`setoption name UCI_Elo value ${elo}`)
let botOut = []
const bot = new BotUci(l => botOut.push(l))
const botMove = moves => { botOut = []; bot.handle(`position startpos${moves.length ? ' moves ' + moves.join(' ') : ''}`); bot.handle(`go movetime ${botMs}`); return botOut.find(l => l.startsWith('bestmove')).split(' ')[1] }
const sfMove = async moves => { sf.send(`position startpos${moves.length ? ' moves ' + moves.join(' ') : ''}`); const p = sf.waitFor(l => l.startsWith('bestmove')); sf.send(`go movetime ${sfMs}`); return (await p).split(' ')[1] }

const tally = { win: 0, draw: 0, loss: 0 }
for (let g = 0; g < games; g++) {
  const botWhite = g % 2 === 0
  const chess = new Chess(); const moves = []
  bot.handle('ucinewgame'); sf.send('ucinewgame'); { const r = sf.waitFor(l => l === 'readyok'); sf.send('isready'); await r }
  let result
  while (true) {
    if (chess.isGameOver()) { result = chess.isCheckmate() ? (chess.turn() === 'w' ? '0-1' : '1-0') : '1/2-1/2'; break }
    if (moves.length >= 300) { result = '1/2-1/2'; break }
    const botTurn = (chess.turn() === 'w') === botWhite
    const u = botTurn ? botMove(moves) : await sfMove(moves)
    const m = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })
    if (!m) { console.log(`illegal move ${u} by ${botTurn ? 'bot' : 'stockfish'}`); result = botTurn ? (botWhite ? '0-1' : '1-0') : (botWhite ? '1-0' : '0-1'); break }
    moves.push(u)
  }
  const botResult = result === '1/2-1/2' ? 'draw' : ((result === '1-0') === botWhite ? 'win' : 'loss')
  tally[botResult]++
  console.log(`game ${g + 1}: bot as ${botWhite ? 'White' : 'Black'} — ${result} (${botResult}) in ${Math.ceil(moves.length / 2)} moves`)
  console.log('  ' + chess.pgn().replace(/\[[^\]]*\]\n?/g, '').trim().slice(0, 400))
}
console.log(`\nBot vs Stockfish@${elo} (${botMs}ms / ${sfMs}ms): +${tally.win} =${tally.draw} -${tally.loss}`)
process.exit(0)
