// Game review, shared by the play page and "My games": the grading of a whole game, the wording of
// the key moves, and a self-contained reviewer (board, bar, controls, key moves) for an imported game.
//
// A record `rec` is { sans, uciMoves, evals, grades, userColor, who(colour) }: sans[i] / uciMoves[i]
// is ply i+1, evals[i] judges the position after i plies (from White's point of view), grades[i] the
// move that reached it. `who` names a side ("You", "Stockfish", a username).
import { Board } from './board.js'
import { analyst } from './engine/analyst.js'
import { uciToMove } from './engine/uci.js'
import { whiteShare, formatScore, grade, moveAccuracy, GLYPH, MATED } from './analysis.js'
import { Chess, DEFAULT_POSITION } from '../vendor/chess.js/chess.js'
import { ICONS } from './pgn-viewer.js'

export const DEPTH = 14 // fixed depth for the judge, so evaluations of different positions compare fairly

/** Grade every move of the record from its evals. */
export function gradeAll(rec) {
  const grades = []
  for (let i = 1; i <= rec.sans.length; i++) {
    const before = rec.evals[i - 1], after = rec.evals[i], mover = i % 2 === 1 ? 'w' : 'b'
    if (!before || !after) continue
    grades[i] = Object.assign(grade(before, after, mover, before.best === rec.uciMoves[i - 1]), { acc: moveAccuracy(before, after, mover), mover })
  }
  return grades
}

export function moveLabel(rec, i) { const g = rec.grades[i]; return `${Math.ceil(i / 2)}${i % 2 ? '.' : '…'} ${rec.sans[i - 1]}${g && g.label ? GLYPH[g.label] : ''}` }

/** The engine's line from the position before ply i, in SAN with move numbers (up to `n` plies). */
export function betterLine(rec, i, n = 4) {
  const ev0 = rec.evals[i - 1]; if (!ev0 || !ev0.pv || !ev0.pv.length) return ''
  const c = new Chess(); for (const s of rec.sans.slice(0, i - 1)) c.move(s)
  const pv = []
  for (const u of ev0.pv.slice(0, n)) {
    const white = c.turn() === 'w', num = c.moveNumber()
    const m = c.move(uciToMove(u)); if (!m) break
    pv.push((white ? `${num}. ` : pv.length ? '' : `${num}… `) + m.san)
  }
  return pv.join(' ')
}

/** The moves that decided the game: every mistake and blunder, in game order, with the better line. */
export function keyMoves(rec) {
  const { grades, evals, userColor } = rec, opp = userColor === 'w' ? 'b' : 'w'
  const pick = (c, max) => {
    let list = grades.map((g, i) => g && g.mover === c && (g.label === 'mistake' || g.label === 'blunder') ? i : 0).filter(Boolean)
    if (!list.length) list = grades.map((g, i) => g && g.mover === c && g.label === 'inaccuracy' ? i : 0).filter(Boolean)
    if (list.length > max) list = list.sort((a, b) => grades[b].drop - grades[a].drop).slice(0, max).sort((a, b) => a - b)
    return list
  }
  const item = (i, mine) => {
    const g = grades[i], ev0 = evals[i - 1], ev1 = evals[i], line = betterLine(rec, i)
    return `<button class="key ${g.label}" data-ply="${i}">
        <span class="key-move">${esc(moveLabel(rec, i))}</span>
        <span class="key-swing">${formatScore(ev0)} → ${formatScore(ev1)}</span>
        <span class="key-better">${line ? `${mine ? 'Play instead' : 'Punish with'} <b>${esc(line)}</b>` : ''}</span>
      </button>`
  }
  const mine = pick(userColor, 6), theirs = pick(opp, 3)
  let html = ''
  if (mine.length) html += `<div class="key-head">Key moves</div>${mine.map(i => item(i, true)).join('')}`
  if (theirs.length) html += `<div class="key-head">Chances you missed</div>${theirs.map(i => item(i, false)).join('')}`
  return { html, plies: [...mine, ...theirs].sort((a, b) => a - b) }
}

export function summary(rec) {
  const { grades, userColor } = rec
  const side = c => grades.filter(g => g && g.mover === c)
  // an average over a handful of moves says nothing, so the figure needs at least ten of them
  const acc = c => { const g = side(c); return g.length >= 10 ? Math.round(g.reduce((s, x) => s + x.acc, 0) / g.length) : null }
  const count = c => { const o = { inaccuracy: 0, mistake: 0, blunder: 0 }; for (const g of side(c)) if (g.label) o[g.label]++; return o }
  const opp = userColor === 'w' ? 'b' : 'w'
  const line = c => {
    const a = acc(c), k = count(c)
    const parts = [['inaccuracy', 'inaccuracies'], ['mistake', 'mistakes'], ['blunder', 'blunders']].filter(([s]) => k[s]).map(([s, p]) => `${k[s]} ${k[s] === 1 ? s : p}`)
    return `<b>${esc(rec.who(c))}</b><span class="acc">${a == null ? '' : a + '%'}</span><span class="counts">${parts.join(', ') || 'no mistakes'}</span>`
  }
  let turn = ''
  const worst = grades.reduce((w, g, i) => (g && g.label && (!w || g.drop > grades[w].drop)) ? i : w, 0)
  if (worst) turn = `<span class="turning">Turning point: ${esc(moveLabel(rec, worst))}</span>`
  return line(userColor) + line(opp) + turn
}

export function note(rec, i) {
  if (!i) return 'Starting position.'
  const g = rec.grades[i], ev0 = rec.evals[i - 1], ev1 = rec.evals[i]
  if (!g || !ev0 || !ev1) return moveLabel(rec, i)
  if (!g.label) return `${moveLabel(rec, i)} · ${formatScore(ev1)}${ev0.best === rec.uciMoves[i - 1] ? ' · the engine’s choice' : ''}`
  const better = betterLine(rec, i)
  const word = { inaccuracy: 'An inaccuracy', mistake: 'A mistake', blunder: 'A blunder' }[g.label]
  return `${moveLabel(rec, i)} — ${word}. ${formatScore(ev0)} → ${formatScore(ev1)}.${better ? ` Better was ${better}.` : ''}`
}

/** Arrows for ply k: a marked move is shown on the position before it, played in red, the better one in green. */
export function reviewArrows(rec, k) {
  const g = rec.grades[k], ev0 = rec.evals[k - 1], arrows = []
  if (k && g && g.label) {
    const played = uciToMove(rec.uciMoves[k - 1]); arrows.push({ from: played.from, to: played.to, type: 'bad' })
    if (ev0 && ev0.best && ev0.best !== rec.uciMoves[k - 1]) { const b = uciToMove(ev0.best); arrows.push({ from: b.from, to: b.to, type: 'main' }) }
  }
  return arrows
}

/** The move list: `current` is the highlighted ply (0 for none), `clickable` whether moves are buttons. */
export function movesHtml(rec, { current, clickable }) {
  return rec.sans.map((san, i) => {
    const g = rec.grades[i + 1]
    const cls = ['mv', i + 1 === current ? 'current' : '', g && g.label ? g.label : ''].filter(Boolean).join(' ')
    return `${i % 2 === 0 ? `<span class="mvnum">${i / 2 + 1}.</span>` : ''}<button class="${cls}" data-ply="${i + 1}"${clickable ? '' : ' tabindex="-1"'}>${esc(san)}${g && g.label ? `<i>${GLYPH[g.label]}</i>` : ''}</button>`
  }).join('')
}
/** Keep the current move visible inside the list without scrolling the page. */
export function keepCurrentVisible(movesEl) {
  const cur = movesEl.querySelector('.current'); if (!cur) return
  const top = cur.offsetTop - movesEl.offsetTop, bottom = top + cur.offsetHeight
  if (top < movesEl.scrollTop) movesEl.scrollTop = top
  else if (bottom > movesEl.scrollTop + movesEl.clientHeight) movesEl.scrollTop = bottom - movesEl.clientHeight
}

export function paintBar(barEl, ev, orientation) {
  const share = whiteShare(ev)
  const bottom = orientation === 'w' ? share : 1 - share
  barEl.querySelector('.fill').style.height = (bottom * 100).toFixed(1) + '%'
  barEl.querySelector('.num').textContent = ev ? formatScore(ev) : ''
  barEl.classList.toggle('flipped', orientation === 'b')
}

export const controlsHtml = () => `
    <button class="icon-btn" data-nav="prevkey" title="Previous key move (shift ←)">${ICONS.prevkey}</button>
    <button class="icon-btn" data-nav="prev" title="Previous move (←)">${ICONS.prev}</button>
    <button class="icon-btn" data-nav="next" title="Next move (→)">${ICONS.next}</button>
    <button class="icon-btn" data-nav="nextkey" title="Next key move (shift →)">${ICONS.nextkey}</button>
    <span class="spacer"></span>
    <span class="review-pos" id="pos"></span>`

/** The final position needs no engine when the game ended by mate or a draw by rule. */
export function finalEval(chess) {
  if (chess.isCheckmate()) return Object.assign({ final: true }, MATED[chess.turn() === 'w' ? 'b' : 'w'])
  if (chess.isGameOver()) return { cp: 0, mate: null, final: true }
  return null
}

/**
 * A reviewer for a finished game: board with evaluation bar, step controls, key moves and move list.
 * `game`: { sans, uciMoves, userColor, names: {w, b}, evals? }. Analysis starts when `analyse()` is
 * called; `onEvals(evals)` reports every finished evaluation so the caller can cache them.
 */
export function mountReview(container, game, { onEvals, onGraded } = {}) {
  const rec = {
    sans: game.sans, uciMoves: game.uciMoves, evals: game.evals ? game.evals.slice() : [], grades: [],
    userColor: game.userColor || 'w',
    who: c => c === rec.userColor ? 'You' : (game.names[c] || (c === 'w' ? 'White' : 'Black')),
  }
  const n = rec.sans.length
  container.classList.add('play', 'reviewer')
  container.innerHTML = `
    <div class="play-left">
      <div class="play-board">
        <div class="evalbar" id="evalbar" title="Evaluation" aria-hidden="true"><i class="fill"></i><b class="num"></b></div>
        <div class="board-wrap"><div class="board"></div></div>
      </div>
      <div class="game-controls review-controls" id="controls">${controlsHtml()}</div>
      <div class="review-note" id="note">Step through with the buttons or ← →. Press Analyse to grade every move.</div>
    </div>
    <aside class="play-side">
      <div class="review-head">
        <div class="review-players"><b>${esc(game.names.w || 'White')}</b> <span class="vs">vs</span> <b>${esc(game.names.b || 'Black')}</b>${game.result ? ` <span class="res">${esc(game.result)}</span>` : ''}</div>
        <div class="small">${esc(game.subtitle || '')}</div>
      </div>
      <div class="play-actions">
        <button class="btn primary" id="analyse">Analyse</button>
        <button class="btn" id="flip">Flip board</button>
      </div>
      <div class="status" id="status" aria-live="polite"></div>
      <div class="review" id="review" hidden>
        <div class="review-summary" id="summary"></div>
        <div class="key-moves" id="keymoves"></div>
      </div>
      <div class="moves reviewing" id="moves"></div>
    </aside>`
  const $ = s => container.querySelector(s)
  const barEl = $('#evalbar'), movesEl = $('#moves'), statusEl = $('#status')
  const board = new Board($('.board'), { fen: DEFAULT_POSITION, orientation: rec.userColor })
  let cursor = 0, shownPly = 0, keyPlies = [], analysing = false, dead = false
  const setStatus = (t, cls = '') => { statusEl.textContent = t; statusEl.className = 'status ' + cls }

  const bar = () => paintBar(barEl, rec.evals[cursor], board.orientation())
  const paintMoves = () => { movesEl.innerHTML = movesHtml(rec, { current: cursor, clickable: true }); keepCurrentVisible(movesEl) }
  const prevKey = () => keyPlies.filter(p => p < cursor).at(-1)
  const nextKey = () => keyPlies.find(p => p > cursor)
  function paintControls() {
    const c = $('#controls')
    c.querySelector('[data-nav="prevkey"]').disabled = prevKey() === undefined
    c.querySelector('[data-nav="nextkey"]').disabled = nextKey() === undefined
    c.querySelector('[data-nav="prev"]').disabled = cursor === 0
    c.querySelector('[data-nav="next"]').disabled = cursor === n
    $('#pos').textContent = cursor ? moveLabel(rec, cursor) : 'Start'
  }
  async function goTo(k) {
    k = Math.max(0, Math.min(n, k)); cursor = k
    const arrows = reviewArrows(rec, k)
    const t = arrows.length ? k - 1 : k
    // the list, the bar and the note are painted before the board moves, so the page never waits on an animation
    paintMoves(); bar(); paintControls()
    $('#note').textContent = rec.grades.length ? note(rec, k) : k ? moveLabel(rec, k) : 'Starting position.'
    if (t === shownPly + 1) await board.play(rec.sans[t - 1])
    else if (t === shownPly - 1) await board.undo({ silent: true })
    else if (t !== shownPly) await board.setHistory(rec.sans.slice(0, t))
    shownPly = t
    board.setArrows(arrows)
  }
  function paintReview() {
    rec.grades = gradeAll(rec)
    const km = keyMoves(rec); keyPlies = km.plies
    $('#summary').innerHTML = summary(rec); $('#keymoves').innerHTML = km.html
    $('#review').hidden = false
    paintMoves(); bar(); paintControls(); $('#note').textContent = note(rec, cursor)
    if (onGraded) onGraded(rec)
  }
  const complete = () => rec.evals.length === n + 1 && rec.evals.every(e => e && (e.final || e.depth >= DEPTH))

  async function analyse() {
    if (analysing) return
    if (complete()) return paintReview()
    analysing = true; $('#analyse').disabled = true
    const c = new Chess(); for (const s of rec.sans) c.move(s)
    const fin = finalEval(c); if (fin) rec.evals[n] = fin
    await analyst().newGame().catch(() => {})
    for (let i = 0; i <= n; i++) {
      if (dead) return
      const old = rec.evals[i]
      if (old && (old.final || old.depth >= DEPTH)) continue
      setStatus(`Analysing… ${i + 1} / ${n + 1}`)
      const r = await analyst().evaluate({ moves: rec.uciMoves.slice(0, i), depth: DEPTH }).catch(() => null)
      if (dead) return
      if (r) { rec.evals[i] = r; if (i === cursor) bar() }
      if (onEvals) onEvals(rec.evals)
    }
    analysing = false; $('#analyse').disabled = false
    if (!complete()) { setStatus('The analysis did not finish. Press Analyse again.', 'bad'); return }
    setStatus(''); $('#analyse').hidden = true
    paintReview()
  }

  const onKey = e => {
    if (e.altKey || e.metaKey || e.ctrlKey || /input|select|textarea/i.test(e.target.tagName)) return
    const k = e.shiftKey ? { ArrowLeft: prevKey(), ArrowRight: nextKey() }[e.key] : { ArrowLeft: cursor - 1, ArrowRight: cursor + 1, ArrowUp: 0, ArrowDown: n }[e.key]
    if (k === undefined) return
    e.preventDefault(); goTo(k)
  }
  document.addEventListener('keydown', onKey)
  $('#controls').addEventListener('click', e => {
    const b = e.target.closest('[data-nav]'); if (!b) return
    const k = { prevkey: prevKey(), nextkey: nextKey(), prev: cursor - 1, next: cursor + 1 }[b.dataset.nav]
    if (k !== undefined) goTo(k)
  })
  movesEl.addEventListener('click', e => { const b = e.target.closest('[data-ply]'); if (b) goTo(+b.dataset.ply) })
  $('#keymoves').addEventListener('click', e => {
    const b = e.target.closest('[data-ply]'); if (!b) return
    goTo(+b.dataset.ply)
    const r = $('.play-board').getBoundingClientRect()
    if (r.top < 0 || r.bottom > window.innerHeight) $('.play-board').scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  $('#analyse').addEventListener('click', analyse)
  $('#flip').addEventListener('click', () => board.flip().then(bar))

  paintMoves(); paintControls(); bar()
  if (complete()) { $('#analyse').hidden = true; paintReview() }

  return {
    rec, board, analyse, goTo,
    destroy() { dead = true; analyst().stop(); document.removeEventListener('keydown', onKey); board.destroy() },
  }
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
