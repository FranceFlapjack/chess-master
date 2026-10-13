// The data half of My games: fetching finished games from chess.com and Lichess, and reading PGNs into
// game records. No DOM here, so node can test it (scripts/test.mjs).
//
// Only finished games are ever fetched. chess.com's API can also list games still in progress; we never
// touch that endpoint, because asking an engine about a running game is cheating.
import { Chess } from '../vendor/chess.js/chess.js'

const FETCH_GAMES = 20   // games per fetch

// ---- fetching (finished games only; see the note at the top of this file) ----
export async function fetchLichess(user, { max = FETCH_GAMES, before } = {}) {
  const until = before ? `&until=${(before - 1) * 1000}` : ''
  const r = await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=${max}&opening=true&finished=true&clocks=true${until}`, { headers: { Accept: 'application/x-chess-pgn' } })
  if (r.status === 404) throw new Error(`No Lichess player called “${user}”.`)
  if (r.status === 429) throw new Error('Lichess is rate-limiting requests; wait a minute and try again.')
  if (!r.ok) throw new Error(`Lichess answered ${r.status}.`)
  return splitPgn(await r.text()).map(pgn => fromPgn(pgn, 'lichess', { user })).filter(Boolean)
}
/** chess.com keeps finished games in monthly archives; we walk them newest first. */
export async function fetchChesscom(user, { max = FETCH_GAMES, before } = {}) {
  const a = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/games/archives`)
  if (a.status === 404) throw new Error(`No chess.com player called “${user}”.`)
  if (!a.ok) throw new Error(`chess.com answered ${a.status}.`)
  const { archives } = await a.json()
  const out = []
  for (const url of archives.slice().reverse()) {
    if (before && monthAfter(url, before)) continue // this month is newer than the games we already hold
    const r = await fetch(url); if (!r.ok) break
    const j = await r.json()
    const games = j.games.filter(g => g.rules === 'chess' && g.pgn && (!before || g.end_time < before))
    out.push(...games.sort((x, y) => y.end_time - x.end_time))
    if (out.length >= max) break
  }
  return out.slice(0, max).map(g => fromPgn(g.pgn, 'chesscom', { user, url: g.url, timeClass: g.time_class, time: g.end_time, rated: g.rated })).filter(Boolean)
}
/** True when an archive URL (…/games/2026/09) is for a month after the given epoch-second timestamp. */
export function monthAfter(url, time) {
  const [y, m] = url.split('/').slice(-2).map(Number)
  const d = new Date(time * 1000) // chess.com's monthly archives are UTC months
  return y > d.getUTCFullYear() || (y === d.getUTCFullYear() && m > d.getUTCMonth() + 1)
}
/** The ratings shown above the games; one request, and only for context. */
export async function fetchStats(site, user) {
  const ratings = []
  if (site === 'chesscom') {
    const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/stats`)
    if (!r.ok) return null
    const j = await r.json()
    for (const [k, name] of [['chess_bullet', 'bullet'], ['chess_blitz', 'blitz'], ['chess_rapid', 'rapid'], ['chess_daily', 'daily']])
      if (j[k] && j[k].last) ratings.push({ name, value: j[k].last.rating })
  } else {
    const r = await fetch(`https://lichess.org/api/user/${encodeURIComponent(user)}`)
    if (!r.ok) return null
    const j = await r.json()
    for (const [k, name] of [['bullet', 'bullet'], ['blitz', 'blitz'], ['rapid', 'rapid'], ['classical', 'classical']])
      if (j.perfs && j.perfs[k] && j.perfs[k].games) ratings.push({ name, value: j.perfs[k].rating })
  }
  return { site, user, ratings }
}

// ---- parsing ----
const parsed = new Map() // pgn → { sans, uciMoves, headers }
export function parse(pgn) {
  if (parsed.has(pgn)) return parsed.get(pgn)
  let out = null
  try {
    const c = new Chess(); c.loadPgn(pgn)
    const h = c.history({ verbose: true })
    if (h.length && (c.getHeaders().Variant || 'Standard') === 'Standard' && !c.getHeaders().FEN) out = { sans: h.map(m => m.san), uciMoves: h.map(m => m.from + m.to + (m.promotion || '')), headers: c.getHeaders() }
  } catch (_) { out = null }
  parsed.set(pgn, out)
  return out
}
export function splitPgn(text) { return text.replace(/\r/g, '').split(/\n(?=\[Event )/).map(s => s.trim()).filter(s => s) }
/** A game record from a PGN: { id, site, url, date, time, names:{w,b}, result, opening, eco, timeClass, userColor, pgn }. */
export function fromPgn(pgn, site, { user = '', url = '', timeClass = '', time = 0, rated, userColor } = {}) {
  const p = parse(pgn); if (!p) return null
  const h = p.headers
  const names = { w: h.White || '', b: h.Black || '' }
  const lower = user.toLowerCase()
  const isMe = c => lower && names[c].toLowerCase() === lower
  const me = userColor || (isMe('b') && !isMe('w') ? 'b' : 'w')
  const unknownSide = !userColor && !isMe('w') && !isMe('b') // neither name is the username: assume White, but say so
  const link = url || (h.Site && /^https?:/.test(h.Site) ? h.Site : '')
  const date = (h.UTCDate || h.Date || '').replace(/\./g, '-').replace(/-\?\?/g, '')
  const opening = h.Opening || (h.ECOUrl ? openingFromUrl(h.ECOUrl) : '')
  const id = link ? link.replace(/^https?:\/\//, '') : `pgn:${hash(p.uciMoves.join(' ') + names.w + names.b + date)}`
  const stamp = time || Math.round(Date.parse(`${date || '1970-01-01'}T${(h.UTCTime || '00:00:00')}Z`) / 1000) || 0
  const term = h.Termination || ''
  const lost = h.Result && h.Result !== '*' && (h.Result === '1-0') !== (me === 'w') && h.Result !== '1/2-1/2'
  return { id, site, url: link, date, time: stamp, names,
    tc: h.TimeControl || '', rated: rated === undefined ? /rated/i.test(h.Event || '') : !!rated,
    lostOnTime: !!lost && /time forfeit|on time|timeout/i.test(term), result: h.Result && h.Result !== '*' ? h.Result : '', opening, eco: h.ECO || '', timeClass: timeClass || ((h.Event || '').match(/bullet|blitz|rapid|classical|correspondence/i) || [''])[0].toLowerCase(), userColor: me, unknownSide, pgn }
}
export function resultFor(g) {
  if (!g.result) return ''
  if (g.result === '1/2-1/2') return 'draw'
  return (g.result === '1-0') === (g.userColor === 'w') ? 'win' : 'loss'
}
/** chess.com's ECOUrl ends with the name and often the moves: ".../Sicilian-Defense-Open-Najdorf-Variation-6.Be3-e5" */
function openingFromUrl(u) {
  const words = u.split('/').pop().split('-').map(w => w.split('...')[0]) // "Variation...5.Nce2" → "Variation"
  const cut = words.findIndex(w => !w || /^\d+\./.test(w))
  return (cut > 0 ? words.slice(0, cut) : words).join(' ')
}
/** The family of an opening name: "Sicilian Defense: Najdorf" → "Sicilian Defense"; "Queens Pawn Opening Zukertort" → "Queens Pawn Opening". */
export function family(name) {
  let s = name.split(/[:,(]/)[0].trim()
  const words = s.split(/\s+/), keys = /^(Defense|Defence|Opening|Game|Gambit|Attack|System|Variation|Countergambit|Counter-Gambit)$/i
  const k = words.findIndex(w => keys.test(w))
  if (k > 0) s = words.slice(0, k + 1).join(' ')
  return s
}
/** The opening as named by the site, else the book line the game followed, else its first three moves. */
export function openingName(g, lines) {
  if (g.opening) return g.opening.split('...')[0].trim()
  const p = parse(g.pgn); if (!p) return ''
  const book = bookMatch(lines, p.sans)
  return book ? book.line.name : firstMoves(p.sans)
}
function firstMoves(sans) { return sans.slice(0, 6).map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + m).join(' ') }
/** The book line the game followed longest (at least four plies), and how far. */
export function bookMatch(lines, sans) {
  let best = null
  for (const line of lines || []) {
    let n = 0; while (n < line.moves.length && n < sans.length && line.moves[n] === sans[n]) n++
    if (n >= 4 && (!best || n > best.plies)) best = { line, plies: n }
  }
  return best
}
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36) }
