// My games: pull your last games from Lichess or chess.com (or paste a PGN), review any of them with
// the same judge as the play page, see which openings you actually play, and drill the positions
// where you went wrong early — the traps people spring on you.
//
// Everything runs in the browser: both sites allow cross-origin reads of public games, nothing is
// sent anywhere. Only one game is analysed at a time, on request: eighty positions at depth 14 take
// about a minute, so the openings table is built from the move lists alone and shows at once.
import { mountReview, betterLine } from './review.js'
import { mountExercise } from './exercise.js'
import { adoptOldKey } from './progress.js'
import { Chess } from '../vendor/chess.js/chess.js'

const KEY = 'chess-master.games.v1'
const load = () => { try { adoptOldKey(KEY); return JSON.parse(localStorage.getItem(KEY)) || {} } catch (_) { return {} } }
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {} }
const MAX_GAMES = 20, EARLY_PLY = 30, MAX_DRILLS = 40, MAX_CACHED = 30

let catalogue = null // openings book lines, for matching the games against the lines we teach

export function mountGames(main) {
  const store = Object.assign({ site: 'lichess', user: '', games: [], evals: {}, drills: [] }, load())
  let reviewer = null, exercises = [], selected = null
  main.innerHTML = `
    <div class="page">
      <header class="lesson-head">
        <span class="eyebrow">My games</span>
        <h1>Review your own games</h1>
        <p class="lede">Pull your last ${MAX_GAMES} games from Lichess or chess.com, or paste a PGN. Review any game with the same full-strength judge as the play page, see which openings you really play, and drill the early positions where you went wrong.</p>
      </header>
      <section class="games-source">
        <div class="field">
          <label>Where are your games?</label>
          <div class="seg" role="radiogroup">
            <button class="btn${store.site === 'lichess' ? ' on' : ''}" data-site="lichess" role="radio">Lichess</button>
            <button class="btn${store.site === 'chesscom' ? ' on' : ''}" data-site="chesscom" role="radio">chess.com</button>
            <button class="btn${store.site === 'pgn' ? ' on' : ''}" data-site="pgn" role="radio">Paste a PGN</button>
          </div>
        </div>
        <form class="field games-user" id="userform"${store.site === 'pgn' ? ' hidden' : ''}>
          <label for="user">Username</label>
          <div class="row"><input id="user" type="text" autocomplete="off" spellcheck="false" value="${esc(store.user)}" placeholder="your username"><button class="btn primary" id="fetch">Fetch games</button></div>
        </form>
        <form class="field games-paste" id="pgnform"${store.site === 'pgn' ? '' : ' hidden'}>
          <label for="pgn">PGN (one or more games)</label>
          <textarea id="pgn" rows="6" spellcheck="false" placeholder="[Event &quot;…&quot;]&#10;1. e4 e5 2. Nf3 …"></textarea>
          <div class="row"><span class="small">I played</span><div class="seg"><button type="button" class="btn on" data-me="w">White</button><button type="button" class="btn" data-me="b">Black</button></div><button class="btn primary" id="import">Add games</button></div>
        </form>
        <div class="status" id="gstatus" aria-live="polite"></div>
      </section>
      <section id="openings" class="games-openings" hidden></section>
      <section id="list" class="games-list" hidden></section>
      <section id="reviewwrap" class="games-review" hidden>
        <span class="eyebrow">Review</span>
        <div id="review"></div>
      </section>
      <section id="drills" class="games-drills" hidden></section>
    </div>`
  const $ = s => main.querySelector(s)
  const setStatus = (t, cls = '') => { $('#gstatus').textContent = t; $('#gstatus').className = 'status ' + cls }
  let pasteColor = 'w'

  // ---- source ----
  main.querySelector('.games-source').addEventListener('click', e => {
    const b = e.target.closest('[data-site]'); if (!b) return
    store.site = b.dataset.site; save(store)
    main.querySelectorAll('[data-site]').forEach(x => x.classList.toggle('on', x === b))
    $('#userform').hidden = store.site === 'pgn'; $('#pgnform').hidden = store.site !== 'pgn'
  })
  main.querySelector('.games-paste').addEventListener('click', e => {
    const b = e.target.closest('[data-me]'); if (!b) return
    pasteColor = b.dataset.me
    main.querySelectorAll('[data-me]').forEach(x => x.classList.toggle('on', x === b))
  })
  $('#userform').addEventListener('submit', async e => {
    e.preventDefault()
    const user = $('#user').value.trim(); if (!user) return
    store.user = user; save(store)
    $('#fetch').disabled = true; setStatus(`Fetching your last games from ${store.site === 'lichess' ? 'Lichess' : 'chess.com'}…`)
    try {
      const games = store.site === 'lichess' ? await fetchLichess(user) : await fetchChesscom(user)
      const fresh = games.filter(g => parse(g.pgn))
      if (!fresh.length) throw new Error('No standard games found for that account.')
      const known = new Set(fresh.map(g => g.id))
      store.games = [...fresh, ...store.games.filter(g => !known.has(g.id))].slice(0, MAX_GAMES * 2)
      save(store); setStatus(`${fresh.length} games fetched.`, 'good')
      paint()
    } catch (err) { setStatus(err.message, 'bad') }
    $('#fetch').disabled = false
  })
  $('#pgnform').addEventListener('submit', e => {
    e.preventDefault()
    const games = splitPgn($('#pgn').value).map(pgn => fromPgn(pgn, 'pgn', { userColor: pasteColor })).filter(g => g && parse(g.pgn))
    if (!games.length) { setStatus('Could not read a game from that text.', 'bad'); return }
    const known = new Set(games.map(g => g.id))
    store.games = [...games, ...store.games.filter(g => !known.has(g.id))].slice(0, MAX_GAMES * 2)
    save(store); setStatus(`${games.length} game${games.length === 1 ? '' : 's'} added.`, 'good')
    $('#pgn').value = ''
    paint(); open(games[0].id)
  })

  // ---- lists ----
  function paint() {
    const games = store.games
    $('#list').hidden = $('#openings').hidden = !games.length
    paintDrills()
    if (!games.length) return
    withCatalogue(lines => { paintList(lines); paintOpenings(lines) })
  }
  function paintList(lines) {
    $('#list').innerHTML = `<span class="eyebrow">Your games</span>
      <div class="table-scroll"><table class="games-table"><thead><tr><th>Date</th><th>You</th><th>Opponent</th><th>Result</th><th>Opening</th><th></th></tr></thead><tbody>${store.games.map(g => {
        const me = g.userColor, opp = me === 'w' ? 'b' : 'w', res = resultFor(g)
        return `<tr class="${selected === g.id ? 'current' : ''}${store.evals[g.id] ? ' analysed' : ''}" data-id="${g.id}">
          <td class="mono">${esc(g.date || '')}</td>
          <td><span class="turn-dot ${me}"></span>${esc(g.names[me] || (me === 'w' ? 'White' : 'Black'))}</td>
          <td>${esc(g.names[opp] || (opp === 'w' ? 'White' : 'Black'))}</td>
          <td class="res ${res}">${{ win: 'Won', loss: 'Lost', draw: 'Draw' }[res] || esc(g.result || '')}</td>
          <td>${esc(openingName(g, lines))}${g.timeClass ? ` <span class="small">· ${esc(g.timeClass)}</span>` : ''}</td>
          <td><button class="btn quiet" data-open="${g.id}">${store.evals[g.id] ? 'Review' : 'Open'}</button></td>
        </tr>`
      }).join('')}</tbody></table></div>`
  }
  function paintOpenings(lines) {
    const groups = new Map()
    for (const g of store.games) {
      const p = parse(g.pgn); if (!p) continue
      const book = bookMatch(lines, p.sans)
      const name = openingName(g, lines)
      const key = family(name)
      const grp = groups.get(key) || { name: key, games: [], variations: new Set(), lines: new Map(), w: 0, b: 0, score: 0 }
      grp.games.push(g); grp.variations.add(name); grp[g.userColor]++
      grp.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
      if (book) grp.lines.set(book.line.id, book.line)
      groups.set(key, grp)
    }
    const rows = [...groups.values()].sort((a, b) => b.games.length - a.games.length)
    $('#openings').innerHTML = `<span class="eyebrow">Your openings</span>
      <p class="small">What you actually play, from the games above. The score is yours; the drills are the lines from the openings book that these games followed.</p>
      <div class="table-scroll"><table class="openings-table"><thead><tr><th>Opening</th><th>Games</th><th>As White</th><th>As Black</th><th>Score</th><th>Book lines</th></tr></thead><tbody>${rows.map(r => `<tr>
        <td><b>${esc(r.name)}</b>${r.variations.size > 1 || [...r.variations][0] !== r.name ? `<div class="small">${[...r.variations].filter(v => v !== r.name).map(esc).join(' · ')}</div>` : ''}</td>
        <td class="mono">${r.games.length}</td><td class="mono">${r.w}</td><td class="mono">${r.b}</td>
        <td class="mono">${Math.round(100 * r.score / r.games.length)}%</td>
        <td>${[...r.lines.values()].map(l => `<a href="#/openings/${l.id}">${esc(l.name)}</a>`).join('<br>') || '<span class="small">not in the book</span>'}</td>
      </tr>`).join('')}</tbody></table></div>`
  }
  function paintDrills() {
    const d = store.drills
    $('#drills').hidden = !d.length
    for (const x of exercises) x.board.destroy()
    exercises = []
    if (!d.length) return
    $('#drills').innerHTML = `<span class="eyebrow">Traps you fell for</span>
      <p class="small">Positions from your analysed games where you went wrong in the first ${EARLY_PLY / 2} moves. Find the move the engine wanted; the drill stays until you solve it, and you can always reset it.</p>
      ${d.map((x, i) => `<div class="drill"><div class="drill-caption">${esc(x.caption)}</div><figure id="drill-${i}"></figure></div>`).join('')}`
    d.forEach((x, i) => {
      exercises.push(mountExercise($('#drill-' + i), { fen: x.fen, solution: x.solution, orientation: x.color, prompt: x.prompt, hint: x.hint, success: x.success, id: x.id }, { lessonId: 'my-games' }))
    })
  }

  // ---- review ----
  $('#list').addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (b) open(b.dataset.open)
  })
  function open(id) {
    const g = store.games.find(x => x.id === id); if (!g) return
    const p = parse(g.pgn); if (!p) return
    if (reviewer) reviewer.destroy()
    selected = id
    main.querySelectorAll('.games-table tr').forEach(tr => tr.classList.toggle('current', tr.dataset.id === id))
    const wrap = $('#reviewwrap'); wrap.hidden = false
    reviewer = mountReview($('#review'), {
      sans: p.sans, uciMoves: p.uciMoves, userColor: g.userColor, names: g.names, result: g.result,
      subtitle: [g.date, g.opening, g.timeClass, g.site === 'pgn' ? '' : g.site === 'lichess' ? 'Lichess' : 'chess.com'].filter(Boolean).join(' · '),
      evals: store.evals[id],
    }, {
      onEvals: evals => { store.evals[id] = evals; trimEvals(); save(store) },
      onGraded: rec => { addDrills(g, rec); paint() },
    })
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function trimEvals() {
    const keep = new Set(store.games.slice(0, MAX_CACHED).map(g => g.id))
    for (const k of Object.keys(store.evals)) if (!keep.has(k) && k !== selected) delete store.evals[k]
  }
  /** Turn the user's early mistakes and blunders into drills: the position before the move, the engine's move as the answer. */
  function addDrills(g, rec) {
    const c = new Chess()
    for (let i = 1; i <= rec.sans.length; i++) {
      const gr = rec.grades[i], ev0 = rec.evals[i - 1]
      const mine = gr && gr.mover === g.userColor && (gr.label === 'mistake' || gr.label === 'blunder')
      if (mine && i <= EARLY_PLY && ev0 && ev0.best) {
        const id = `my-games#${g.id}#${i}`
        if (!store.drills.some(d => d.id === id)) {
          const probe = new Chess(c.fen()); const best = probe.move({ from: ev0.best.slice(0, 2), to: ev0.best.slice(2, 4), promotion: ev0.best[4] })
          if (best) {
            const opp = g.names[g.userColor === 'w' ? 'b' : 'w'] || 'your opponent'
            store.drills.unshift({
              id, fen: c.fen(), solution: best.san, color: g.userColor,
              caption: `vs ${opp}${g.date ? `, ${g.date}` : ''} · move ${Math.ceil(i / 2)} as ${g.userColor === 'w' ? 'White' : 'Black'} — you played ${rec.sans[i - 1]}${gr.label === 'blunder' ? '??' : '?'}`,
              prompt: `${g.userColor === 'w' ? 'White' : 'Black'} to move. In the game you played ${rec.sans[i - 1]}. What was better?`,
              hint: `The engine's line: ${betterLine(rec, i)}`,
              success: `Yes. ${betterLine(rec, i, 6)}`,
            })
          }
        }
      }
      c.move(rec.sans[i - 1])
    }
    store.drills = store.drills.slice(0, MAX_DRILLS)
    save(store)
  }

  paint()
  if (store.games.length) setStatus(`${store.games.length} games from last time. Fetch again for new ones.`)
  return () => { if (reviewer) reviewer.destroy(); for (const x of exercises) x.board.destroy() }

  function withCatalogue(fn) {
    (catalogue ? Promise.resolve(catalogue) : fetch('content/openings/lines.json').then(r => r.json()).then(j => (catalogue = j)).catch(() => [])).then(fn)
  }
}

// ---- fetching ----
async function fetchLichess(user) {
  const r = await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=${MAX_GAMES}&opening=true`, { headers: { Accept: 'application/x-chess-pgn' } })
  if (r.status === 404) throw new Error(`No Lichess player called “${user}”.`)
  if (r.status === 429) throw new Error('Lichess is rate-limiting requests; wait a minute and try again.')
  if (!r.ok) throw new Error(`Lichess answered ${r.status}.`)
  const text = await r.text()
  return splitPgn(text).map(pgn => fromPgn(pgn, 'lichess', { user })).filter(Boolean)
}
async function fetchChesscom(user) {
  const u = encodeURIComponent(user.toLowerCase())
  const a = await fetch(`https://api.chess.com/pub/player/${u}/games/archives`)
  if (a.status === 404) throw new Error(`No chess.com player called “${user}”.`)
  if (!a.ok) throw new Error(`chess.com answered ${a.status}.`)
  const { archives } = await a.json()
  const games = []
  for (const url of archives.slice().reverse()) { // newest month first; two months are usually plenty
    const r = await fetch(url); if (!r.ok) break
    const j = await r.json()
    games.push(...j.games.filter(g => g.rules === 'chess' && g.pgn).reverse())
    if (games.length >= MAX_GAMES) break
  }
  return games.slice(0, MAX_GAMES).map(g => fromPgn(g.pgn, 'chesscom', { user, url: g.url, timeClass: g.time_class })).filter(Boolean)
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
/** A game record from a PGN: { id, site, url, date, names:{w,b}, result, opening, eco, timeClass, userColor, pgn }. */
function fromPgn(pgn, site, { user = '', url = '', timeClass = '', userColor } = {}) {
  const p = parse(pgn); if (!p) return null
  const h = p.headers
  const names = { w: h.White || '', b: h.Black || '' }
  const lower = user.toLowerCase()
  const me = userColor || (lower && names.b.toLowerCase() === lower && names.w.toLowerCase() !== lower ? 'b' : 'w')
  const link = url || (h.Site && /^https?:/.test(h.Site) ? h.Site : '')
  const date = (h.UTCDate || h.Date || '').replace(/\./g, '-').replace(/-\?\?/g, '')
  const opening = h.Opening || (h.ECOUrl ? openingFromUrl(h.ECOUrl) : '')
  const id = link ? link.replace(/^https?:\/\//, '') : `pgn:${hash(p.uciMoves.join(' ') + names.w + names.b + date)}`
  return { id, site, url: link, date, names, result: h.Result && h.Result !== '*' ? h.Result : '', opening, eco: h.ECO || '', timeClass: timeClass || ((h.Event || '').match(/bullet|blitz|rapid|classical|correspondence/i) || [''])[0].toLowerCase(), userColor: me, pgn }
}
function resultFor(g) {
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
function openingName(g, lines) {
  if (g.opening) return g.opening.split('...')[0].trim()
  const p = parse(g.pgn); if (!p) return ''
  const book = bookMatch(lines, p.sans)
  return book ? book.line.name : firstMoves(p.sans)
}
export function firstMoves(sans) { return sans.slice(0, 6).map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + m).join(' ') }
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
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
