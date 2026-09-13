#!/usr/bin/env node
// Match runner: Chess Master Bot vs Stockfish (Elo-limited) under Node.
// Usage: node scripts/match.mjs [games=4] [opponent=nodes:50000|elo:1800] [botMs=300] [sfMs=300]
//   BOT_DIR=/path/to/other/bot node scripts/match.mjs …   plays a different build of the bot (for before/after tests)
import { Chess } from '../vendor/chess.js/chess.js'
import { loadStockfish } from './stockfish-node.mjs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const argv = process.argv.slice(2)
const games = +argv[0] || 4, spec = argv[1] || 'nodes:50000', botMs = +argv[2] || 300, sfMs = +argv[3] || 300
const [mode, amount] = spec.includes(':') ? spec.split(':') : ['elo', spec]
const botDir = process.env.BOT_DIR ? path.resolve(process.env.BOT_DIR) : path.resolve('js/engine/bot')
const { BotUci } = await import(pathToFileURL(path.join(botDir, 'uci.js')).href)
const sf = await loadStockfish()
if (mode === 'elo') { sf.send('setoption name UCI_LimitStrength value true'); sf.send(`setoption name UCI_Elo value ${amount}`) }
const sfGo = mode === 'nodes' ? `go nodes ${amount}` : `go movetime ${sfMs}`
let botOut = []
const bot = new BotUci(l => botOut.push(l))
const botMove = moves => { botOut = []; bot.handle(`position startpos${moves.length ? ' moves ' + moves.join(' ') : ''}`); bot.handle(`go movetime ${botMs}`); return botOut.find(l => l.startsWith('bestmove')).split(' ')[1] }
const sfMove = async moves => { sf.send(`position startpos${moves.length ? ' moves ' + moves.join(' ') : ''}`); const p = sf.waitFor(l => l.startsWith('bestmove')); sf.send(sfGo); return (await p).split(' ')[1] }

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
console.log(`\n${path.basename(botDir)} vs Stockfish@${spec} (bot ${botMs}ms${mode === 'nodes' ? '' : ` / sf ${sfMs}ms`}): +${tally.win} =${tally.draw} -${tally.loss}`)
process.exit(0)
