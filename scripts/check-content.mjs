#!/usr/bin/env node
// Validates every lesson: frontmatter, FENs, PGNs (inline and files), "try" solutions, sources, curriculum links.
// Usage: node scripts/check-content.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess, validateFen } from '../vendor/chess.js/chess.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const content = path.join(root, 'content')
let errors = 0, checked = 0
const fail = (file, msg) => { errors++; console.error(`✗ ${path.relative(root, file)}: ${msg}`) }

function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, body: md }
  const meta = {}; let listKey = null
  for (const raw of m[1].split(/\r?\n/)) {
    const li = raw.match(/^\s+-\s+(.*)$/); if (li && listKey) { meta[listKey].push(li[1].trim()); continue }
    const kv = raw.match(/^([\w-]+):\s*(.*)$/); if (kv) { if (kv[2] === '') { listKey = kv[1]; meta[kv[1]] = [] } else { listKey = null; meta[kv[1]] = kv[2].trim() } }
  }
  return { meta, body: md.slice(m[0].length) }
}
function parseParams(text) {
  const params = {}; const lines = text.split(/\r?\n/); let i = 0
  for (; i < lines.length; i++) { const kv = lines[i].match(/^([\w-]+):\s*(.*)$/); if (!kv) break; params[kv[1]] = kv[2].trim() }
  params.rest = lines.slice(i).join('\n').trim(); return params
}
function checkPgn(file, text, label) {
  try { const c = new Chess(); c.loadPgn(text); if (!c.history().length) fail(file, `${label}: PGN has no moves`); else checked++ }
  catch (e) { fail(file, `${label}: PGN failed to load — ${e.message}`) }
}
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]) }

// games
const gamesDir = path.join(content, 'games')
for (const f of walk(gamesDir).filter(f => f.endsWith('.pgn'))) checkPgn(f, fs.readFileSync(f, 'utf8'), 'file')

// lessons
const lessonFiles = walk(path.join(content, 'lessons')).filter(f => f.endsWith('.md'))
const curriculum = JSON.parse(fs.readFileSync(path.join(content, 'curriculum.json'), 'utf8'))
const listed = new Map()
for (const t of curriculum.tracks) for (const l of t.lessons) listed.set(`${t.id}/${l.slug}`, l)

for (const f of lessonFiles) {
  const md = fs.readFileSync(f, 'utf8')
  const rel = path.relative(path.join(content, 'lessons'), f).replace(/\.md$/, '').split(path.sep).join('/')
  const { meta, body } = parseFrontmatter(md)
  if (meta.id !== rel) fail(f, `frontmatter id "${meta.id}" should be "${rel}"`)
  if (!meta.title) fail(f, 'missing title')
  if (!Array.isArray(meta.sources) || !meta.sources.length) fail(f, 'sources block is empty')
  const entry = listed.get(rel)
  if (!entry) fail(f, 'not listed in curriculum.json')
  else if (!entry.ready) fail(f, 'exists but curriculum.json does not mark it ready: true')
  const re = /```(board|pgn|try)\r?\n([\s\S]*?)```/g
  let m, n = 0
  while ((m = re.exec(body))) {
    n++
    const kind = m[1], p = parseParams(m[2]), label = `${kind} block #${n}`
    if (kind === 'board' || kind === 'try') {
      if (!p.fen) { fail(f, `${label}: missing fen`); continue }
      const v = validateFen(p.fen); if (!v.ok) { fail(f, `${label}: bad FEN — ${v.error}`); continue }
      checked++
      const c = new Chess(p.fen)
      for (const sq of (p.highlight || '').split(/[,\s]+/).filter(Boolean)) if (!/^[a-h][1-8]$/.test(sq)) fail(f, `${label}: bad highlight square ${sq}`)
      for (const a of (p.arrows || '').split(/[,\s]+/).filter(Boolean)) if (!/^[a-h][1-8][a-h][1-8](:\w+)?$/.test(a)) fail(f, `${label}: bad arrow ${a}`)
      if (kind === 'try') {
        const moves = (p.solution || '').split(/\s+/).filter(t => t && !/^\d+\.+$/.test(t))
        if (!moves.length) fail(f, `${label}: missing solution`)
        let bad = false
        for (const san of moves) { // reader moves may list alternatives with "|"; each must be legal, the first continues
          const alts = san.split('|')
          for (const alt of alts.slice(1)) { const t = new Chess(c.fen()); try { if (!t.move(alt)) throw new Error('illegal') } catch (_) { fail(f, `${label}: alternative "${alt}" is illegal after ${c.history().join(' ') || 'start'}`); bad = true } }
          try { if (!c.move(alts[0])) throw new Error('illegal') } catch (_) { fail(f, `${label}: solution move "${alts[0]}" is illegal after ${c.history().join(' ') || 'start'}`); bad = true }
          if (bad) break
        }
      }
    } else if (kind === 'pgn') {
      if (p.file) { const gf = path.join(gamesDir, p.file); if (!fs.existsSync(gf)) fail(f, `${label}: games/${p.file} not found`) }
      else checkPgn(f, p.rest, label)
    }
  }
}
for (const [id, l] of listed) if (l.ready && !lessonFiles.some(f => f.endsWith(path.join(...id.split('/')) + '.md'))) fail(path.join(content, 'curriculum.json'), `lesson ${id} is marked ready but has no file`)

console.log(errors ? `${errors} problem(s), ${checked} items checked` : `✓ all good — ${lessonFiles.length} lesson(s), ${checked} positions/games checked`)
process.exit(errors ? 1 : 0)
