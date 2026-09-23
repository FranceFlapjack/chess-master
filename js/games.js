// My games: pull your games from chess.com or Lichess (or paste a PGN), review any of them with the
// same judge as the play page, read an opening report of what you actually play and where you leave
// the book, and drill the positions where you went wrong early — the traps people spring on you.
//
// Everything runs in the browser: both sites allow cross-origin reads of public games, nothing is
// sent anywhere. Only finished games are ever fetched. chess.com's API can also list games you are
// still playing; we deliberately never touch that endpoint, because asking an engine about a game in
// progress is fair-play cheating and gets accounts closed.
//
// Analysis is the expensive part (a full game is about a minute), so nothing is analysed on import:
// the opening report is built from the move lists alone and shows at once, one game is reviewed on
// request, and the opening scan (first sixteen plies of every game) is a button the owner presses.
import { mountReview, betterLine, gradeAll, DEPTH } from './review.js'
import { gameClock, clockReport, hurriedMistakes, lostOnTimeOf, mmss } from './clocks.js'
import { mountExercise } from './exercise.js'
import { analyst } from './engine/analyst.js'
import { adoptOldKey } from './progress.js'
import { Chess } from '../vendor/chess.js/chess.js'

const KEY = 'chess-master.games.v1'
const load = () => { try { adoptOldKey(KEY); return JSON.parse(localStorage.getItem(KEY)) || {} } catch (_) { return {} } }
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {} }
const FETCH_GAMES = 20   // games per fetch
const MAX_STORED = 60    // games kept in the browser
const MAX_CACHED = 30    // games whose evaluations are kept
const EARLY_PLY = 30     // "early" for the trap drills: the first fifteen moves
const SCAN_PLY = 16      // how far into a game the opening scan looks
const MAX_DRILLS = 40
const SITES = { chesscom: 'chess.com', lichess: 'Lichess', pgn: 'a PGN' }

let catalogue = null // openings book lines, for matching the games against the lines we teach

export function mountGames(main) {
  const store = Object.assign({ site: 'chesscom', users: {}, games: [], evals: {}, drills: [], stats: null, filters: { tc: 'all', color: 'all', rated: false } }, load())
  if (store.user && !Object.keys(store.users).length) store.users = { [store.site === 'pgn' ? 'chesscom' : store.site]: store.user } // pre-2026-09-23 stores kept one username
  let reviewer = null, exercises = [], lineDrill = null, selected = null, scanning = false, dead = false, scanMsg = ''
  const userOf = site => store.users[site] || ''
  main.innerHTML = `
    <div class="page">
      <header class="lesson-head">
        <span class="eyebrow">My games</span>
        <h1>Review your own games</h1>
        <p class="lede">Play on chess.com or Lichess, then bring the games here: review any of them with the same full-strength judge as the play page, read what your openings really look like and where you leave the book, and drill the positions where it went wrong.</p>
      </header>
      <section class="games-source">
        <div class="field">
          <label>Where are your games?</label>
          <div class="seg" role="radiogroup">
            <button class="btn${store.site === 'chesscom' ? ' on' : ''}" data-site="chesscom" role="radio">chess.com</button>
            <button class="btn${store.site === 'lichess' ? ' on' : ''}" data-site="lichess" role="radio">Lichess</button>
            <button class="btn${store.site === 'pgn' ? ' on' : ''}" data-site="pgn" role="radio">Paste a PGN</button>
          </div>
        </div>
        <form class="field games-user" id="userform"${store.site === 'pgn' ? ' hidden' : ''}>
          <label for="user">Username</label>
          <div class="row">
            <input id="user" type="text" autocomplete="off" spellcheck="false" value="${esc(userOf(store.site))}" placeholder="your username">
            <button class="btn primary" id="fetch">Fetch games</button>
            <button class="btn" id="more" type="button" hidden>Load older games</button>
          </div>
        </form>
        <form class="field games-paste" id="pgnform"${store.site === 'pgn' ? '' : ' hidden'}>
          <label for="pgn">PGN (one or more games)</label>
          <textarea id="pgn" rows="6" spellcheck="false" placeholder="[Event &quot;…&quot;]&#10;1. e4 e5 2. Nf3 …"></textarea>
          <div class="row"><span class="small">I played</span><div class="seg"><button type="button" class="btn on" data-me="w">White</button><button type="button" class="btn" data-me="b">Black</button></div><button class="btn primary" id="import">Add games</button></div>
        </form>
        <div class="status" id="gstatus" aria-live="polite"></div>
        <div class="row"><button class="btn quiet" id="forget" hidden>Forget these games</button></div>
        <div class="ratings" id="ratings" hidden></div>
        <p class="small fairplay">Only games you have finished. A game still in progress is never fetched, and never should be: asking an engine about a running game is cheating, and both sites close accounts for it.</p>
      </section>
      <div class="games-filters" id="filters" hidden></div>
      <section id="report" class="games-report" hidden></section>
      <section id="clock" class="games-clock" hidden></section>
      <figure id="linedrill" hidden></figure>
      <section id="list" class="games-list" hidden></section>
      <section id="reviewwrap" class="games-review" hidden>
        <span class="eyebrow">Review</span>
        <div id="reviewhost"></div>
      </section>
      <section id="drills" class="games-drills" hidden></section>
      <details class="scout" id="scout">
        <summary><span class="eyebrow">Prepare for an opponent</span></summary>
        <p class="small">A rematch coming, or a daily game against someone you keep meeting? Their public games say what they play. Nothing here touches a game in progress — this is preparation before the board, not help during it.</p>
        <form class="field" id="scoutform">
          <label for="opp">Their username <span id="scoutsite" class="small"></span></label>
          <div class="row"><input id="opp" type="text" autocomplete="off" spellcheck="false" placeholder="their username"><button class="btn primary" id="scoutgo">Scout</button></div>
        </form>
        <div class="status" id="sstatus" aria-live="polite"></div>
        <div id="scoutout"></div>
      </details>
    </div>`
  const $ = s => main.querySelector(s)
  const setStatus = (t, cls = '') => { $('#gstatus').textContent = t; $('#gstatus').className = 'status ' + cls }
  let pasteColor = 'w'
  const f = store.filters
  const passes = g => (f.tc === 'all' || g.timeClass === f.tc) && (f.color === 'all' || g.userColor === f.color) && (!f.rated || g.rated !== false)
  const shown = () => store.games.filter(passes)

  // ---- source ----
  main.querySelector('.games-source').addEventListener('click', e => {
    const b = e.target.closest('[data-site]'); if (!b) return
    store.site = b.dataset.site; save(store)
    main.querySelectorAll('[data-site]').forEach(x => x.classList.toggle('on', x === b))
    $('#userform').hidden = store.site === 'pgn'; $('#pgnform').hidden = store.site !== 'pgn'
    $('#user').value = userOf(store.site)
    paintRatings(); paintMore()
  })
  main.querySelector('.games-paste').addEventListener('click', e => {
    const b = e.target.closest('[data-me]'); if (!b) return
    pasteColor = b.dataset.me
    main.querySelectorAll('[data-me]').forEach(x => x.classList.toggle('on', x === b))
  })
  $('#userform').addEventListener('submit', e => { e.preventDefault(); fetchGames({}) })
  $('#more').addEventListener('click', () => fetchGames({ older: true }))

  /** Fetch from the chosen site: the newest games, or the ones before the oldest we already hold. */
  async function fetchGames({ older }) {
    const site = store.site, user = $('#user').value.trim(); if (!user) return
    store.users[site] = user; save(store)
    const held = store.games.filter(g => g.site === site && sameUser(g, user))
    const before = older && held.length ? Math.min(...held.map(g => g.time || Infinity)) : null
    $('#fetch').disabled = $('#more').disabled = true
    setStatus(`${older ? 'Looking further back on' : 'Fetching your games from'} ${SITES[site]}…`)
    try {
      const games = (site === 'lichess' ? await fetchLichess(user, { before }) : await fetchChesscom(user, { before })).filter(g => parse(g.pgn))
      if (!games.length) throw new Error(older ? 'No older games found for that account.' : 'No finished standard games found for that account.')
      const known = new Set(store.games.map(g => g.id))
      const fresh = games.filter(g => !known.has(g.id))
      const seen = new Set(games.map(g => g.id))
      store.games = [...games, ...store.games.filter(g => !seen.has(g.id))].sort((a, b) => (b.time || 0) - (a.time || 0)).slice(0, MAX_STORED)
      const unknown = games.filter(g => g.unknownSide).length
      save(store)
      setStatus(unknown
        ? `${games.length} games fetched, but in ${unknown} of them neither player is called “${user}” — those are shown from White's side.`
        : older ? `${fresh.length} older game${fresh.length === 1 ? '' : 's'} added — ${store.games.length} in total.`
        : fresh.length ? `${fresh.length} new game${fresh.length === 1 ? '' : 's'} since last time — ${store.games.length} in total.`
        : `No new games; you already had all ${games.length}.`, unknown ? 'bad' : 'good')
      paint()
      fetchStats(site, user).then(s => { store.stats = s; save(store); paintRatings() }).catch(() => {})
    } catch (err) { setStatus(err.message, 'bad') }
    $('#fetch').disabled = false; paintMore()
  }
  $('#pgnform').addEventListener('submit', e => {
    e.preventDefault()
    const games = splitPgn($('#pgn').value).map(pgn => fromPgn(pgn, 'pgn', { userColor: pasteColor })).filter(g => g && parse(g.pgn))
    if (!games.length) { setStatus('Could not read a game from that text.', 'bad'); return }
    const known = new Set(games.map(g => g.id))
    store.games = [...games, ...store.games.filter(g => !known.has(g.id))].slice(0, MAX_STORED)
    save(store); setStatus(`${games.length} game${games.length === 1 ? '' : 's'} added.`, 'good')
    $('#pgn').value = ''
    paint(); open(games[0].id)
  })
  $('#forget').addEventListener('click', () => {
    if (scanning) stopScan()
    if (reviewer) { reviewer.destroy(); reviewer = null }
    $('#reviewwrap').hidden = true; $('#linedrill').hidden = true
    store.games = []; store.evals = {}; store.stats = null; selected = null
    save(store) // the drills stay: they are practice you have already earned
    setStatus('Games forgotten. The drills below stay.', 'good')
    // ---- prepare for an opponent ----
  const scoutSite = () => store.site === 'pgn' ? 'chesscom' : store.site
  $('#scoutsite').textContent = `on ${SITES[scoutSite()]}`
  $('#scoutform').addEventListener('submit', async e => {
    e.preventDefault()
    const user = $('#opp').value.trim(); if (!user) return
    const site = scoutSite()
    const ss = (t, cls = '') => { $('#sstatus').textContent = t; $('#sstatus').className = 'status ' + cls }
    $('#scoutgo').disabled = true; ss(`Reading ${user}'s last games on ${SITES[site]}…`)
    try {
      const games = (site === 'lichess' ? await fetchLichess(user) : await fetchChesscom(user)).filter(g => parse(g.pgn) && !g.unknownSide)
      if (!games.length) throw new Error(`No finished standard games found for “${user}”.`)
      const stats = await fetchStats(site, user).catch(() => null)
      store.scout = { site, user, games, stats }; save(store)
      ss(`${games.length} of ${user}'s games read.`, 'good')
      withCatalogue(paintScout)
    } catch (err) { ss(err.message, 'bad') }
    $('#scoutgo').disabled = false
  })
  function paintScout(lines) {
    const sc = store.scout; if (!sc) return
    const out = $('#scoutout')
    const of = c => sc.games.filter(g => g.userColor === c)
    const tally = (list, fn) => {
      const m = new Map()
      for (const g of list) {
        const k = fn(g); if (!k) continue
        const e = m.get(k) || { k, n: 0, score: 0 }
        e.n++; e.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
        m.set(k, e)
      }
      return [...m.values()].sort((a, b) => b.n - a.n)
    }
    const san = (g, i) => { const p = parse(g.pgn); return p && p.sans[i] }
    const bar = (list, label) => list.length ? `<div class="scout-line"><span class="small">${label}</span>${list.slice(0, 4).map(e => `<span class="pick"><b class="mono">${esc(e.k)}</b> <span class="small">${e.n}× · scores ${Math.round(100 * e.score / e.n)}%</span></span>`).join('')}</div>` : ''
    const whites = of('w'), blacks = of('b')
    const vs = (first, label) => bar(tally(blacks.filter(g => san(g, 0) === first), g => san(g, 1)), label)
    const groups = new Map()
    for (const g of sc.games) {
      const p = parse(g.pgn); if (!p) continue
      const book = bookMatch(lines, p.sans)
      const name = openingName(g, lines), key = family(name)
      const grp = groups.get(key) || { name: key, n: 0, w: 0, b: 0, score: 0, lines: new Map() }
      grp.n++; grp[g.userColor]++
      grp.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
      if (book) grp.lines.set(book.line.id, book.line)
      groups.set(key, grp)
    }
    const rows = [...groups.values()].sort((a, b) => b.n - a.n).slice(0, 8)
    out.innerHTML = `
      <div class="scout-head"><b>${esc(sc.user)}</b> <span class="small">on ${SITES[sc.site]} · ${sc.games.length} games · ${whites.length} as White, ${blacks.length} as Black</span></div>
      ${sc.stats && sc.stats.ratings.length ? `<div class="ratings">${sc.stats.ratings.map(r => `<span class="rating"><b>${r.value}</b> ${esc(r.name)}</span>`).join('')}</div>` : ''}
      ${bar(tally(whites, g => san(g, 0)), 'As White they open')}
      ${vs('e4', 'Against 1.e4 they play')}
      ${vs('d4', 'Against 1.d4 they play')}
      <div class="table-scroll"><table class="openings-table"><thead><tr><th>Their openings</th><th>Games</th><th>They score</th><th>Prepare</th></tr></thead><tbody>${rows.map(r => `<tr>
        <td><b>${esc(r.name)}</b></td>
        <td class="mono">${r.n}<div class="small">${r.w ? `${r.w} as White` : ''}${r.w && r.b ? '<br>' : ''}${r.b ? `${r.b} as Black` : ''}</div></td>
        <td class="mono">${Math.round(100 * r.score / r.n)}%</td>
        <td>${[...r.lines.values()].slice(0, 2).map(l => `<a href="#/openings/${l.id}">${esc(l.name)}</a>`).join('<br>') || '<span class="small">not in the book</span>'}</td>
      </tr>`).join('')}</tbody></table></div>`
  }
  if (store.scout) { $('#opp').value = store.scout.user; withCatalogue(paintScout) }

  paint(); paintRatings(); paintMore()
  })
  function paintMore() {
    const site = store.site
    $('#more').hidden = site === 'pgn' || !store.games.some(g => g.site === site)
    $('#more').disabled = false
    $('#forget').hidden = !store.games.length
  }
  function paintRatings() {
    const s = store.stats, el = $('#ratings')
    el.hidden = !s || s.site !== store.site || s.user !== userOf(store.site) || !s.ratings.length
    if (el.hidden) return
    el.innerHTML = `<span class="eyebrow">${esc(s.user)} on ${SITES[s.site]}</span>` +
      s.ratings.map(r => `<span class="rating"><b>${r.value}</b> ${esc(r.name)}</span>`).join('')
  }

  // ---- the opening report ----
  function paint() {
    const games = shown()
    $('#filters').hidden = !store.games.length
    $('#list').hidden = $('#report').hidden = !games.length
    paintFilters(); paintDrills(); paintClock()
    if (!games.length) { $('#linedrill').hidden = true; return }
    withCatalogue(lines => { paintList(lines); paintReport(lines) })
  }
  /** Time control, colour and rated: the opening report is only trustworthy when bullet is not mixed into it. */
  function paintFilters() {
    if ($('#filters').hidden) return
    const classes = [...new Set(store.games.map(g => g.timeClass).filter(Boolean))].sort()
    const n = shown().length
    $('#filters').innerHTML = `
      <label>Time control <select id="f-tc">${['all', ...classes].map(c => `<option value="${c}"${f.tc === c ? ' selected' : ''}>${c === 'all' ? 'All' : esc(c)}</option>`).join('')}</select></label>
      <label>You play <select id="f-color">${[['all', 'Both colours'], ['w', 'White'], ['b', 'Black']].map(([v, t]) => `<option value="${v}"${f.color === v ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" id="f-rated"${f.rated ? ' checked' : ''}> Rated only</label>
      <span class="small">${n === store.games.length ? `All ${n} games` : `${n} of ${store.games.length} games`}</span>`
  }
  $('#filters').addEventListener('change', e => {
    if (e.target.id === 'f-tc') f.tc = e.target.value
    else if (e.target.id === 'f-color') f.color = e.target.value
    else if (e.target.id === 'f-rated') f.rated = e.target.checked
    else return
    save(store); paint()
  })
  function paintList(lines) {
    $('#list').innerHTML = `<span class="eyebrow">Your games</span>
      <div class="table-scroll"><table class="games-table"><thead><tr><th>Date</th><th>You</th><th>Opponent</th><th>Result</th><th>Opening</th><th></th></tr></thead><tbody>${shown().map(g => {
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
  /** One row per opening family, from the move lists; the mistake column fills in after a scan. */
  function paintReport(lines) {
    const groups = new Map()
    const games = shown()
    for (const g of games) {
      const r = gameReport(g, lines); if (!r) continue
      const grp = groups.get(r.family) || { name: r.family, games: [], variations: new Set(), lines: new Map(), departures: [], followed: [], mistakes: [], w: 0, b: 0, score: 0 }
      grp.games.push(g); grp.variations.add(r.name); grp[g.userColor]++
      grp.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
      if (r.book) {
        grp.lines.set(r.book.line.id, r.book.line)
        if (r.departure) grp.departures.push(r.departure)
        else grp.followed.push(r.followed)
      }
      if (r.firstMistake) grp.mistakes.push(r.firstMistake)
      groups.set(r.family, grp)
    }
    const rows = [...groups.values()].sort((a, b) => b.games.length - a.games.length)
    const scanned = games.filter(g => scanOf(g)).length
    $('#report').innerHTML = `<span class="eyebrow">Opening report</span>
      <p class="small">What you actually play, from the ${games.length} games above. “Leaves the book” is the first move where a game stopped following the closest line in our openings book — the one that matched the most moves. That line is named under the move and may belong to another opening, because the same position can be reached by more than one move order, so read it as a pointer, not a verdict.</p>
      <div class="report-actions">
        <button class="btn${scanned ? '' : ' primary'}" id="scan"${!scanning && scanned === games.length ? ' disabled' : ''}>${scanning ? 'Stop the scan' : scanned === games.length ? 'All games scanned' : scanned ? `Scan the ${games.length - scanned} game${games.length - scanned === 1 ? '' : 's'} left` : `Scan the first ${SCAN_PLY / 2} moves of these ${games.length} games`}</button>
        <span class="small" id="scanstatus">${scanning ? scanMsg : scanned ? `${scanned} of ${games.length} games scanned${scanned === games.length ? ' — fetch more games and the button comes back' : ''}.` : 'The engine looks for your first mistake in the opening; half a minute for twenty games.'}</span>
      </div>
      <div class="table-scroll"><table class="openings-table"><thead><tr><th>Opening</th><th>Games</th><th>Score</th><th>Leaves the book</th><th>First mistake</th><th></th></tr></thead><tbody>${rows.map(r => {
        const dep = commonest(r.departures.map(d => d.key))
        const d = dep && r.departures.find(x => x.key === dep)
        const m = r.mistakes.length ? Math.round(10 * r.mistakes.reduce((s, x) => s + x, 0) / r.mistakes.length) / 10 : null
        return `<tr>
        <td><b>${esc(r.name)}</b>${(() => { const v = [...r.variations].filter(x => x !== r.name); return v.length ? `<div class="small">${v.slice(0, 2).map(esc).join(' · ')}${v.length > 2 ? ` · +${v.length - 2} more` : ''}</div>` : '' })()}</td>
        <td class="mono">${r.games.length}<div class="small">${r.w ? `${r.w} as White` : ''}${r.w && r.b ? '<br>' : ''}${r.b ? `${r.b} as Black` : ''}</div></td>
        <td class="mono">${Math.round(100 * r.score / r.games.length)}%</td>
        <td>${d ? `<b class="mono">${esc(d.label)}</b><div class="small">${esc(d.line)} · book plays <span class="mono">${esc(d.bookMove)}</span></div>`
          : r.lines.size ? `<span class="small">${commonest(r.followed) === 'they left it' ? 'your opponent left the line first' : 'you play it to the end of the book line'}</span>`
          : '<span class="small">not in the book</span>'}</td>
        <td class="mono">${m ? `move ${m}` : '<span class="small">—</span>'}${r.mistakes.length && r.mistakes.length < r.games.length ? `<div class="small">${r.mistakes.length} of ${r.games.length}</div>` : ''}</td>
        <td>${d ? `<button class="btn quiet" data-drill="${d.lineId}:${d.ply}:${d.color}">Drill this line</button>` : [...r.lines.values()].slice(0, 1).map(l => `<a class="btn quiet" href="#/openings/${l.id}">Book line</a>`).join('')}</td>
      </tr>`
      }).join('')}</tbody></table></div>`
  }
  /** Everything the report knows about one game without asking the engine (plus the scan result if there is one). */
  function gameReport(g, lines) {
    const p = parse(g.pgn); if (!p) return null
    const book = bookMatch(lines, p.sans)
    const name = openingName(g, lines)
    let departure = null, followed = ''
    const mine = book && book.plies % 2 === (g.userColor === 'w' ? 0 : 1)
    if (book && (book.plies >= book.line.moves.length || book.plies >= p.sans.length)) followed = 'to the end'
    else if (book && !mine) followed = 'they left it'
    // the first move that left the line, but only when it was ours: the opponent's choice is not our repertoire
    if (book && book.plies < book.line.moves.length && book.plies < p.sans.length && mine) {
      const ply = book.plies, no = Math.ceil((ply + 1) / 2)
      departure = {
        lineId: book.line.id, line: book.line.name, ply, color: g.userColor, bookMove: `${no}${ply % 2 ? '…' : '.'} ${book.line.moves[ply]}`,
        label: `${no}${ply % 2 ? '…' : '.'} ${p.sans[ply]}`, key: `${book.line.id}:${ply}:${p.sans[ply]}`,
      }
    }
    const scan = scanOf(g)
    return { name, family: family(name), book, departure, followed, firstMistake: scan ? scan.move : null }
  }
  /** The first mistake of ours inside the scanned prefix, as a move number, or null while nothing is known. */
  function scanOf(g) {
    const evals = store.evals[g.id]; if (!evals) return null
    const p = parse(g.pgn); if (!p) return null
    const n = Math.min(SCAN_PLY, p.sans.length)
    for (let i = 0; i <= n; i++) if (!evals[i] || (!evals[i].final && evals[i].depth < DEPTH)) return null
    const rec = { sans: p.sans.slice(0, n), uciMoves: p.uciMoves.slice(0, n), evals, grades: [] }
    rec.grades = gradeAll(rec)
    for (let i = 1; i <= n; i++) {
      const gr = rec.grades[i]
      if (gr && gr.mover === g.userColor && (gr.label === 'mistake' || gr.label === 'blunder')) return { ply: i, move: Math.ceil(i / 2) }
    }
    return { ply: 0, move: 0 } // scanned, nothing found
  }

  // ---- the opening scan ----
  $('#report').addEventListener('click', e => {
    if (e.target.closest('#scan')) return scanning ? stopScan() : scan()
    const d = e.target.closest('[data-drill]'); if (d) drillLine(d.dataset.drill)
  })
  function stopScan() { scanning = false; analyst().stop() }
  async function scan() {
    scanning = true
    const status = t => { scanMsg = t; const el = $('#scanstatus'); if (el) el.textContent = t }
    $('#scan').textContent = 'Stop the scan'
    await analyst().newGame().catch(() => {})
    let done = 0
    const list = shown()
    for (const g of list) {
      if (!scanning || dead) break
      done++
      const p = parse(g.pgn)
      if (!p || scanOf(g)) continue
      const n = Math.min(SCAN_PLY, p.sans.length)
      const evals = store.evals[g.id] ? store.evals[g.id].slice() : []
      for (let i = 0; i <= n; i++) {
        if (!scanning || dead) break
        if (evals[i] && (evals[i].final || evals[i].depth >= DEPTH)) continue
        status(`Scanning game ${done} of ${list.length}… move ${Math.ceil(i / 2) || 1}`)
        const r = await analyst().evaluate({ moves: p.uciMoves.slice(0, i), depth: DEPTH }).catch(() => null)
        if (r) evals[i] = r
      }
      if (dead) return
      store.evals[g.id] = trimPv(evals); trimEvals(); save(store)
      const rec = { sans: p.sans.slice(0, n), uciMoves: p.uciMoves.slice(0, n), evals, grades: [] }
      rec.grades = gradeAll(rec)
      addDrills(g, rec)
      withCatalogue(paintReport)
    }
    const wasScanning = scanning
    scanning = false
    withCatalogue(paintReport)
    status(wasScanning ? 'Scan finished.' : 'Scan stopped.')
    paintDrills()
  }
  /** Drill the book line the games kept leaving, from a couple of moves before the departure. */
  function drillLine(spec) {
    const [id, ply, color] = spec.split(':')
    const line = (catalogue || []).find(l => l.id === +id); if (!line) return
    const start = Math.max(0, +ply - 2)
    const c = new Chess(); for (const m of line.moves.slice(0, start)) c.move(m)
    const fig = $('#linedrill'); fig.hidden = false; fig.innerHTML = ''
    if (lineDrill) lineDrill.board.destroy()
    lineDrill = mountExercise(fig, {
      fen: c.fen(), solution: line.moves.slice(start, start + 8).join(' '), type: 'line', orientation: color,
      prompt: `${line.name} as ${color === 'w' ? 'White' : 'Black'}, from move ${Math.ceil((start + 1) / 2)}. Play the book line.`,
      hint: line.moves.slice(start, start + 4).map((m, i) => ((start + i) % 2 === 0 ? `${(start + i) / 2 + 1}.` : '') + m).join(' '),
      success: 'That is the line. Next time your game reaches it, you will know the move.',
      id: `my-games-line#${id}#${start}#${color}`,
    }, { lessonId: 'my-games' })
    fig.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /** What the clocks say: chess.com always sends them, Lichess when the export asks. */
  function paintClock() {
    const list = shown().map(g => {
      const p = parse(g.pgn)
      const evals = store.evals[g.id]
      let grades = null, full = false
      if (p && evals) {
        const n = Math.min(evals.length - 1, p.sans.length)
        full = evals.length - 1 >= p.sans.length
        const rec = { sans: p.sans.slice(0, n), uciMoves: p.uciMoves.slice(0, n), evals, grades: [] }
        grades = gradeAll(rec)
      }
      return { clock: p && gameClock(g, p.sans), result: resultFor(g), lostOnTime: lostOnTimeOf(g), grades, full, label: `${g.date} vs ${g.names[g.userColor === 'w' ? 'b' : 'w']}` }
    })
    const r = clockReport(list)
    $('#clock').hidden = !r
    if (!r) return
    const hurried = hurriedMistakes(list)
    const pct = v => v == null ? '—' : Math.round(v * 100) + '%'
    $('#clock').innerHTML = `<span class="eyebrow">Your clock</span>
      <p class="small">From the clock readings inside the games themselves — ${r.games} of them have one. Daily games are left out.</p>
      <div class="clock-figures">
        <div class="fig"><b>${mmss(r.perMove)}</b><span>a move, on average</span></div>
        <div class="fig"><b>${pct(r.wonBy15)}</b><span>of your clock gone by move 15 in the games you <i>won</i></span></div>
        <div class="fig"><b>${pct(r.lostBy15)}</b><span>of it gone by move 15 in the games you <i>lost</i></span></div>
        <div class="fig"><b>${pct(r.endLeft)}</b><span>left on the clock when the game ended</span></div>
        ${r.timeLosses ? `<div class="fig bad"><b>${r.timeLosses}</b><span>game${r.timeLosses === 1 ? '' : 's'} lost on time</span></div>` : ''}
        ${hurried ? `<div class="fig"><b>${hurried.hurried} of ${hurried.total}</b><span>mistakes came with under ${hurried.under}s left, in the ${hurried.games} game${hurried.games === 1 ? '' : 's'} you have reviewed in full</span></div>` : ''}
      </div>
      <div class="table-scroll"><table class="clock-table"><thead><tr><th>Phase</th><th>Seconds a move</th></tr></thead><tbody>${r.phase.map(p => `<tr><td>${p.name}</td><td class="mono">${mmss(p.seconds)}</td></tr>`).join('')}</tbody></table></div>
      <div class="clock-slow"><span class="eyebrow">Your longest thinks</span>${r.slowest.map(m => `<button class="slow" data-slow="${esc(m.id)}:${m.ply}"><b class="mono">${mmss(m.spent)}</b><span class="mono">${m.no}${m.ply % 2 ? '.' : '…'} ${esc(m.san)}</span><span class="small">${esc(m.label)} · ${mmss(m.left)} left after it</span></button>`).join('')}</div>`
  }
  $('#clock').addEventListener('click', e => {
    const b = e.target.closest('[data-slow]'); if (!b) return
    const i = b.dataset.slow.lastIndexOf(':')
    open(b.dataset.slow.slice(0, i), { ply: +b.dataset.slow.slice(i + 1) })
  })

  function paintDrills() {
    const d = store.drills
    $('#drills').hidden = !d.length
    for (const x of exercises) x.board.destroy()
    exercises = []
    if (!d.length) return
    $('#drills').innerHTML = `<span class="eyebrow">Traps you fell for</span>
      <p class="small">Positions from your games where you went wrong in the first ${EARLY_PLY / 2} moves. Find the move the engine wanted; the drill stays until you solve it, and you can always reset it.</p>
      ${d.map((x, i) => `<div class="drill"><div class="drill-caption">${esc(x.caption)}</div><figure id="drill-${i}"></figure></div>`).join('')}`
    d.forEach((x, i) => {
      exercises.push(mountExercise($('#drill-' + i), { fen: x.fen, solution: x.solution, orientation: x.color, prompt: x.prompt, hint: x.hint, success: x.success, id: x.id }, { lessonId: 'my-games' }))
    })
  }

  // ---- review ----
  $('#list').addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (b) open(b.dataset.open)
  })
  function open(id, { ply } = {}) {
    const g = store.games.find(x => x.id === id); if (!g) return
    const p = parse(g.pgn); if (!p) return
    if (scanning) stopScan()
    if (reviewer) reviewer.destroy()
    selected = id
    main.querySelectorAll('.games-table tr').forEach(tr => tr.classList.toggle('current', tr.dataset.id === id))
    const wrap = $('#reviewwrap'); wrap.hidden = false
    reviewer = mountReview($('#reviewhost'), {
      sans: p.sans, uciMoves: p.uciMoves, userColor: g.userColor, names: g.names, result: g.result,
      subtitle: [g.date, g.opening, g.timeClass, SITES[g.site] === 'a PGN' ? '' : SITES[g.site]].filter(Boolean).join(' · '),
      evals: store.evals[id],
    }, {
      onEvals: evals => { store.evals[id] = trimPv(evals); trimEvals(); save(store) },
      onGraded: rec => { addDrills(g, rec); paint() },
    })
    if (ply) reviewer.goTo(ply)
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  /** Keep whole games analysed for the newest few; older ones keep only the scanned opening. */
  function trimEvals() {
    const ids = new Set(store.games.map(g => g.id))
    const full = new Set(store.games.slice(0, MAX_CACHED).map(g => g.id))
    for (const k of Object.keys(store.evals)) {
      if (!ids.has(k) && k !== selected) delete store.evals[k]
      else if (!full.has(k) && k !== selected && store.evals[k].length > SCAN_PLY + 1) store.evals[k] = store.evals[k].slice(0, SCAN_PLY + 1)
    }
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

  // ---- prepare for an opponent ----
  const scoutSite = () => store.site === 'pgn' ? 'chesscom' : store.site
  $('#scoutsite').textContent = `on ${SITES[scoutSite()]}`
  $('#scoutform').addEventListener('submit', async e => {
    e.preventDefault()
    const user = $('#opp').value.trim(); if (!user) return
    const site = scoutSite()
    const ss = (t, cls = '') => { $('#sstatus').textContent = t; $('#sstatus').className = 'status ' + cls }
    $('#scoutgo').disabled = true; ss(`Reading ${user}'s last games on ${SITES[site]}…`)
    try {
      const games = (site === 'lichess' ? await fetchLichess(user) : await fetchChesscom(user)).filter(g => parse(g.pgn) && !g.unknownSide)
      if (!games.length) throw new Error(`No finished standard games found for “${user}”.`)
      const stats = await fetchStats(site, user).catch(() => null)
      store.scout = { site, user, games, stats }; save(store)
      ss(`${games.length} of ${user}'s games read.`, 'good')
      withCatalogue(paintScout)
    } catch (err) { ss(err.message, 'bad') }
    $('#scoutgo').disabled = false
  })
  function paintScout(lines) {
    const sc = store.scout; if (!sc) return
    const out = $('#scoutout')
    const of = c => sc.games.filter(g => g.userColor === c)
    const tally = (list, fn) => {
      const m = new Map()
      for (const g of list) {
        const k = fn(g); if (!k) continue
        const e = m.get(k) || { k, n: 0, score: 0 }
        e.n++; e.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
        m.set(k, e)
      }
      return [...m.values()].sort((a, b) => b.n - a.n)
    }
    const san = (g, i) => { const p = parse(g.pgn); return p && p.sans[i] }
    const bar = (list, label) => list.length ? `<div class="scout-line"><span class="small">${label}</span>${list.slice(0, 4).map(e => `<span class="pick"><b class="mono">${esc(e.k)}</b> <span class="small">${e.n}× · scores ${Math.round(100 * e.score / e.n)}%</span></span>`).join('')}</div>` : ''
    const whites = of('w'), blacks = of('b')
    const vs = (first, label) => bar(tally(blacks.filter(g => san(g, 0) === first), g => san(g, 1)), label)
    const groups = new Map()
    for (const g of sc.games) {
      const p = parse(g.pgn); if (!p) continue
      const book = bookMatch(lines, p.sans)
      const name = openingName(g, lines), key = family(name)
      const grp = groups.get(key) || { name: key, n: 0, w: 0, b: 0, score: 0, lines: new Map() }
      grp.n++; grp[g.userColor]++
      grp.score += { win: 1, draw: 0.5 }[resultFor(g)] || 0
      if (book) grp.lines.set(book.line.id, book.line)
      groups.set(key, grp)
    }
    const rows = [...groups.values()].sort((a, b) => b.n - a.n).slice(0, 8)
    out.innerHTML = `
      <div class="scout-head"><b>${esc(sc.user)}</b> <span class="small">on ${SITES[sc.site]} · ${sc.games.length} games · ${whites.length} as White, ${blacks.length} as Black</span></div>
      ${sc.stats && sc.stats.ratings.length ? `<div class="ratings">${sc.stats.ratings.map(r => `<span class="rating"><b>${r.value}</b> ${esc(r.name)}</span>`).join('')}</div>` : ''}
      ${bar(tally(whites, g => san(g, 0)), 'As White they open')}
      ${vs('e4', 'Against 1.e4 they play')}
      ${vs('d4', 'Against 1.d4 they play')}
      <div class="table-scroll"><table class="openings-table"><thead><tr><th>Their openings</th><th>Games</th><th>They score</th><th>Prepare</th></tr></thead><tbody>${rows.map(r => `<tr>
        <td><b>${esc(r.name)}</b></td>
        <td class="mono">${r.n}<div class="small">${r.w ? `${r.w} as White` : ''}${r.w && r.b ? '<br>' : ''}${r.b ? `${r.b} as Black` : ''}</div></td>
        <td class="mono">${Math.round(100 * r.score / r.n)}%</td>
        <td>${[...r.lines.values()].slice(0, 2).map(l => `<a href="#/openings/${l.id}">${esc(l.name)}</a>`).join('<br>') || '<span class="small">not in the book</span>'}</td>
      </tr>`).join('')}</tbody></table></div>`
  }
  if (store.scout) { $('#opp').value = store.scout.user; withCatalogue(paintScout) }

  paint(); paintRatings(); paintMore()
  if (store.games.length) setStatus(`${store.games.length} games from last time. Fetch again for the new ones.`)
  return () => {
    dead = true; scanning = false; analyst().stop()
    if (reviewer) reviewer.destroy()
    if (lineDrill) lineDrill.board.destroy()
    for (const x of exercises) x.board.destroy()
  }

  function withCatalogue(fn) {
    (catalogue ? Promise.resolve(catalogue) : fetch('content/openings/lines.json').then(r => r.json()).then(j => (catalogue = j)).catch(() => [])).then(fn)
  }
}

// the review never reads past six plies of a line, so the rest need not sit in localStorage
const trimPv = evals => evals.map(e => e && e.pv ? Object.assign({}, e, { pv: e.pv.slice(0, 6) }) : e)
const sameUser = (g, user) => [g.names.w, g.names.b].some(n => n.toLowerCase() === user.toLowerCase())
function commonest(list) {
  const n = new Map(); for (const x of list) n.set(x, (n.get(x) || 0) + 1)
  let best = null; for (const [k, v] of n) if (!best || v > n.get(best)) best = k
  return best
}

// ---- fetching (finished games only; see the note at the top of this file) ----
async function fetchLichess(user, { max = FETCH_GAMES, before } = {}) {
  const until = before ? `&until=${(before - 1) * 1000}` : ''
  const r = await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=${max}&opening=true&finished=true&clocks=true${until}`, { headers: { Accept: 'application/x-chess-pgn' } })
  if (r.status === 404) throw new Error(`No Lichess player called “${user}”.`)
  if (r.status === 429) throw new Error('Lichess is rate-limiting requests; wait a minute and try again.')
  if (!r.ok) throw new Error(`Lichess answered ${r.status}.`)
  return splitPgn(await r.text()).map(pgn => fromPgn(pgn, 'lichess', { user })).filter(Boolean)
}
/** chess.com keeps finished games in monthly archives; we walk them newest first. */
async function fetchChesscom(user, { max = FETCH_GAMES, before } = {}) {
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
function monthAfter(url, time) {
  const [y, m] = url.split('/').slice(-2).map(Number)
  const d = new Date(time * 1000)
  return y > d.getFullYear() || (y === d.getFullYear() && m > d.getMonth() + 1)
}
/** The ratings shown above the games; one request, and only for context. */
async function fetchStats(site, user) {
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
