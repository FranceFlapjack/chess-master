#!/usr/bin/env node
// Asks Stockfish whether each "try" block's reader moves are the engine's best (or within a small margin).
// Usage: node scripts/verify-puzzles.mjs [lesson-path-substring] [movetime=800]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from '../vendor/chess.js/chess.js'
import { loadStockfish } from './stockfish-node.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const filter = process.argv[2] || '', movetime = +process.argv[3] || 800
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
const files = walk(path.join(root, 'content/lessons')).filter(f => f.endsWith('.md') && f.includes(filter))
const sf = await loadStockfish()
sf.send('setoption name MultiPV value 2')

async function analyse(fen) {
  const infos = []
  const done = sf.waitFor(l => l.startsWith('bestmove'))
  const listener = l => { if (l.startsWith('info') && l.includes(' multipv ')) infos.push(l) }
  sf.waitFor(() => false, 0).catch(() => {}) // no-op keeps API shape
  const p = sf.waitFor(l => { listener(l); return l.startsWith('bestmove') })
  sf.send(`position fen ${fen}`); sf.send(`go movetime ${movetime}`)
  await p; await done.catch(() => {})
  const last = {}
  for (const l of infos) { const m = l.match(/multipv (\d+) score (cp|mate) (-?\d+).* pv (\S+)/); if (m) last[m[1]] = { type: m[2], score: +m[3], move: m[4] } }
  return last
}
let problems = 0, checked = 0
for (const f of files) {
  const md = fs.readFileSync(f, 'utf8')
  const re = /```try\r?\n([\s\S]*?)```/g; let m, n = 0
  while ((m = re.exec(md))) {
    n++
    const p = {}; for (const line of m[1].split(/\r?\n/)) { const kv = line.match(/^([\w-]+):\s*(.*)$/); if (kv) p[kv[1]] = kv[2].trim() }
    const moves = (p.solution || '').split(/\s+/).filter(t => t && !/^\d+\.+$/.test(t))
    const tol = p.type === 'line' ? (+p.tolerance || 50) : 0 // opening lines: any move within `tol` cp of best is fine
    const c = new Chess(p.fen)
    for (let i = 0; i < moves.length; i++) {
      const san = moves[i]
      if (i % 2 === 0) { // reader's move
        const fen = c.fen()
        const mv = c.move(san); if (!mv) { problems++; console.log(`✗ ${path.relative(root, f)} try#${n}: illegal ${san}`); break }
        const uci = mv.from + mv.to + (mv.promotion || '')
        const r = await analyse(fen); checked++
        const best = r['1'], second = r['2']
        if (!best) continue
        if (best.move !== uci && tol) {
          // tolerant mode: evaluate the position after our move and compare with the best line
          const after = await analyse(c.fen())
          const ob = after['1']
          const toCp = x => x.type === 'mate' ? Math.sign(x.score) * 10000 : x.score
          const ours = ob ? -toCp(ob) : -99999
          const diff = toCp(best) - ours
          if (diff <= tol) { console.log(`✓ ${path.relative(root, f)} try#${n} move ${i / 2 + 1}: ${san} (book, ${diff} cp behind best ${best.move})`); continue }
          problems++; console.log(`✗ ${path.relative(root, f)} try#${n} move ${i / 2 + 1}: ${san} is ${diff} cp behind ${best.move} (${best.type} ${best.score})`); continue
        }
        if (best.move !== uci) {
          const bestTxt = `${best.move} (${best.type} ${best.score})`
          const ours = second && second.move === uci ? `${second.type} ${second.score}` : 'not in top 2'
          const okAlt = second && second.move === uci && best.type === 'cp' && second.type === 'cp' && Math.abs(best.score - second.score) <= 40
          if (okAlt) console.log(`~ ${path.relative(root, f)} try#${n} move ${i / 2 + 1}: ${san} is 2nd best (${ours}), best ${bestTxt} — acceptable`)
          else { problems++; console.log(`✗ ${path.relative(root, f)} try#${n} move ${i / 2 + 1}: ${san} — engine prefers ${bestTxt}; ours: ${ours}`) }
        } else console.log(`✓ ${path.relative(root, f)} try#${n} move ${i / 2 + 1}: ${san} (${best.type} ${best.score})`)
      } else { if (!c.move(san)) { problems++; console.log(`✗ ${path.relative(root, f)} try#${n}: illegal reply ${san}`); break } }
    }
  }
}
console.log(problems ? `${problems} problem(s) in ${checked} reader moves` : `✓ ${checked} reader moves agree with Stockfish`)
process.exit(0)
