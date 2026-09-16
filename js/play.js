// Play page: human vs Stockfish (seven strengths) or vs our own bot. One board, a side panel, a move
// list, a live evaluation bar (switchable) and, when the game ends, a review of the key moves.
import { Board } from './board.js'
import { stockfish, LEVELS, applyLevel } from './engine/stockfish.js'
import { bot } from './engine/bot.js'
import { analyst } from './engine/analyst.js'
import { uciToMove } from './engine/uci.js'
import { progress, adoptOldKey } from './progress.js'
import { sound } from './sound.js'
import { DEFAULT_POSITION } from '../vendor/chess.js/chess.js'
import { DEPTH, gradeAll, moveLabel, keyMoves, summary, note, reviewArrows, movesHtml, keepCurrentVisible, paintBar as paintEvalBar, controlsHtml, finalEval } from './review.js'

const KEY = 'chess-master.play.v1'
const load = () => { try { adoptOldKey(KEY); return JSON.parse(localStorage.getItem(KEY)) || {} } catch (_) { return {} } }
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {} }

export function mountPlay(main) {
  const prefs = Object.assign({ level: 3, color: 'w', opponent: 'stockfish', evalbar: true }, load())
  const BOT_MS = 800
  main.innerHTML = `
    <div class="page">
      <header class="lesson-head">
        <span class="eyebrow">Play</span>
        <h1>Against the computer</h1>
        <p class="lede">Two opponents live inside this page: Stockfish 18 at seven strengths, up to the Boss that nobody beats, and the Chess Master Bot, our own engine, still young. A third Stockfish watches the game at full strength and reviews it with you when it ends.</p>
      </header>
      <div class="play">
        <div class="play-left">
          <div class="play-board">
            <div class="evalbar" id="evalbar" title="Evaluation" aria-hidden="true"><i class="fill"></i><b class="num"></b></div>
            <div class="board-wrap"><div class="board"></div></div>
          </div>
          <div class="game-controls review-controls" id="controls" hidden>${controlsHtml()}</div>
          <div class="review-note" id="note" hidden></div>
        </div>
        <aside class="play-side">
          <div class="field">
            <label>Opponent</label>
            <div class="seg" role="radiogroup">
              <button class="btn${prefs.opponent === 'stockfish' ? ' on' : ''}" data-opp="stockfish" role="radio" aria-checked="${prefs.opponent === 'stockfish'}">Stockfish</button>
              <button class="btn${prefs.opponent === 'bot' ? ' on' : ''}" data-opp="bot" role="radio" aria-checked="${prefs.opponent === 'bot'}">Chess Master Bot</button>
            </div>
          </div>
          <div class="field" id="level-field"${prefs.opponent === 'bot' ? ' hidden' : ''}>
            <label for="level">Strength</label>
            <select id="level">${LEVELS.map(l => `<option value="${l.id}"${l.id === prefs.level ? ' selected' : ''}>${l.id} · ${l.name}${l.elo ? ` · ~${l.elo}` : ' · full strength'}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label>You play</label>
            <div class="seg" role="radiogroup">
              <button class="btn${prefs.color === 'w' ? ' on' : ''}" data-color="w" role="radio" aria-checked="${prefs.color === 'w'}">White</button>
              <button class="btn${prefs.color === 'b' ? ' on' : ''}" data-color="b" role="radio" aria-checked="${prefs.color === 'b'}">Black</button>
            </div>
          </div>
          <div class="switch-row compact">
            <button class="switch" id="evalswitch" role="switch" aria-checked="${prefs.evalbar}" aria-label="Show the evaluation bar"></button>
            <span>Evaluation bar</span>
          </div>
          <div class="play-actions">
            <button class="btn primary" id="new">New game</button>
            <button class="btn" id="takeback" disabled>Take back</button>
            <button class="btn" id="hint" disabled>Hint</button>
            <button class="btn" id="resign" disabled>Resign</button>
          </div>
          <div class="status" id="status" aria-live="polite">Press New game.</div>
          <div class="review" id="review" hidden>
            <div class="review-summary" id="summary"></div>
            <div class="key-moves" id="keymoves"></div>
          </div>
          <div class="moves" id="moves"></div>
        </aside>
      </div>
    </div>`

  const $ = s => main.querySelector(s)
  const statusEl = $('#status'), movesEl = $('#moves'), barEl = $('#evalbar'), reviewEl = $('#review')
  const board = new Board($('.board'), { fen: DEFAULT_POSITION, orientation: prefs.color })
  let engine = null, level = LEVELS.find(l => l.id === prefs.level), userColor = prefs.color, opponent = prefs.opponent
  let playing = false, thinking = false, reviewing = false, gen = 0, gameId = 0
  // the game record: sans[i] / uciMoves[i] is ply i+1; evals[i] judges the position after i plies
  const sans = [], uciMoves = []
  let evals = [], grades = [], cursor = 0, shownPly = 0 // shownPly: what the board displays (review)
  let keyPlies = [] // plies listed as key moves, in game order
  // the record the shared review functions read; evals/grades/userColor are reassigned, hence getters
  const rec = { sans, uciMoves, get evals() { return evals }, get grades() { return grades }, get userColor() { return userColor }, who: c => c === userColor ? 'You' : opponentName() }

  const setStatus = (t, cls = '') => { statusEl.textContent = t; statusEl.className = 'status ' + cls }
  const buttons = on => { for (const id of ['takeback', 'hint', 'resign']) $('#' + id).disabled = !on }
  const opponentName = () => opponent === 'bot' ? 'the Bot' : 'Stockfish'
  const Opponent = () => opponent === 'bot' ? 'The Bot' : 'Stockfish'

  const engines = {}
  async function getEngine() {
    if (!engines[opponent]) { setStatus('Loading engine…'); engines[opponent] = opponent === 'bot' ? bot() : stockfish() }
    engine = engines[opponent]
    await engine.ready()
    return engine
  }
  const moveMs = () => opponent === 'bot' ? BOT_MS : level.ms

  // ---- evaluation bar ----
  barEl.hidden = !prefs.evalbar
  const paintBar = (ev = evals[reviewing ? cursor : sans.length]) => paintEvalBar(barEl, ev, board.orientation())
  const keyAt = i => uciMoves.slice(0, i).join(' ')
  function analyse(i, { live = true } = {}) {
    const myGame = gameId, key = keyAt(i)
    const same = () => myGame === gameId && key === keyAt(i) // still the same position (no take-back since)
    return analyst().evaluate({
      moves: uciMoves.slice(0, i), depth: DEPTH,
      onInfo: live ? r => { if (same() && !reviewing && i === sans.length) paintBar(r) } : null,
    }).then(r => {
      if (!r || !same()) return null
      const old = evals[i]
      if (!old || (!old.final && r.depth >= old.depth)) evals[i] = r
      if (!reviewing && i === sans.length) paintBar()
      return r
    }).catch(() => null)
  }

  // ---- move list ----
  function paintMoves() {
    movesEl.innerHTML = movesHtml(rec, { current: reviewing ? cursor : sans.length, clickable: reviewing })
    movesEl.classList.toggle('reviewing', reviewing)
    keepCurrentVisible(movesEl)
  }

  function gameOver() {
    const c = board.chess
    if (!c.isGameOver()) return null
    if (c.isCheckmate()) return c.turn() === userColor ? { text: `Checkmate. ${Opponent()} wins.`, result: 'loss' } : { text: 'Checkmate. You win!', result: 'win' }
    if (c.isStalemate()) return { text: 'Stalemate. Draw.', result: 'draw' }
    if (c.isThreefoldRepetition()) return { text: 'Draw by repetition.', result: 'draw' }
    if (c.isInsufficientMaterial()) return { text: 'Draw: not enough material to mate.', result: 'draw' }
    return { text: 'Draw by the fifty-move rule.', result: 'draw' }
  }
  function finish(over) {
    playing = false; board.disableInput(); buttons(false)
    setStatus(over.text, over.result === 'win' ? 'good' : over.result === 'loss' ? 'bad' : '')
    if (over.result === 'win') sound.play('success')
    progress.recordPlay({ opponent, level: opponent === 'bot' ? 0 : level.id, color: userColor, result: over.result })
    // the final position needs no engine: mate or a draw by rule
    const fin = finalEval(board.chess); if (fin) evals[sans.length] = fin
    review(over)
  }

  async function engineMove() {
    const myGen = ++gen
    thinking = true; board.disableInput(); buttons(false)
    setStatus('Thinking…')
    const e = await getEngine()
    let uci = null
    try { uci = await e.bestMove({ fen: DEFAULT_POSITION, moves: uciMoves, movetime: moveMs() }) } catch (err) { setStatus('Engine error: ' + err.message, 'bad'); thinking = false; return }
    if (myGen !== gen) return // a take-back or new game happened meanwhile
    thinking = false
    if (!uci) return
    const m = await board.play(uciToMove(uci))
    if (!m) return
    uciMoves.push(uci); sans.push(m.san); paintMoves()
    const over = gameOver(); if (over) return finish(over)
    analyse(sans.length)
    setStatus(board.chess.isCheck() ? 'Check. Your move.' : 'Your move.')
    board.enableInput(userColor); buttons(true)
  }

  function onUserMove(m) {
    uciMoves.push(m.from + m.to + (m.promotion || '')); sans.push(m.san); paintMoves()
    const over = gameOver(); if (over) return finish(over)
    analyse(sans.length)
    engineMove()
  }

  async function newGame() {
    gen++; gameId++; if (engine && thinking) engine.stop()
    analyst().stop()
    thinking = false; playing = true; reviewing = false
    sans.length = 0; uciMoves.length = 0; evals = []; grades = []; cursor = 0
    reviewEl.hidden = true; $('#controls').hidden = true; $('#note').hidden = true; board.setArrows([])
    $('#takeback').textContent = 'Take back'
    await board.showPosition(DEFAULT_POSITION)
    if (board.orientation() !== userColor) await board.flip()
    paintMoves(); paintBar()
    const e = await getEngine()
    if (opponent === 'stockfish') applyLevel(e, level)
    await e.newGame()
    analyst().newGame().catch(err => console.warn('analyst', err)); analyse(0)
    board.onMove = onUserMove
    if (userColor === 'w') { setStatus('Your move.'); board.enableInput('w'); buttons(true) }
    else engineMove()
  }

  /** Cut the record back to `n` plies and hand the move to the user (one more ply back if needed). */
  async function resumeFrom(n) {
    gen++; if (thinking) { engine.stop(); thinking = false }
    analyst().stop()
    if (n > 0 && (n % 2 === 0 ? 'w' : 'b') !== userColor) n--
    sans.length = n; uciMoves.length = n; evals.length = n + 1; grades = []
    reviewing = false; reviewEl.hidden = true; $('#controls').hidden = true; $('#note').hidden = true; board.setArrows([])
    $('#takeback').textContent = 'Take back'
    await board.setHistory(sans)
    paintMoves(); paintBar(); analyse(n)
    playing = true; setStatus('Your move.'); board.enableInput(userColor); buttons(true)
  }
  async function takeBack() {
    if (reviewing) return resumeFrom(cursor)
    if (!sans.length) return
    // undo back to a position where it is the user's turn
    let n = sans.length - 1
    return resumeFrom(n)
  }

  async function hint() {
    if (!playing || thinking) return
    const e = await getEngine()
    setStatus('Looking…')
    const uci = await e.bestMove({ fen: DEFAULT_POSITION, moves: uciMoves, movetime: 600 })
    if (!uci) return
    const mv = uciToMove(uci)
    board.setArrows([{ from: mv.from, to: mv.to, type: 'alt' }])
    setStatus('The engine likes the marked move. Your move.')
    setTimeout(() => board.setArrows([]), 2500)
  }

  function resign() {
    if (!playing) return
    gen++; if (thinking) engine.stop()
    finish({ text: `You resigned. ${Opponent()} wins.`, result: 'loss' })
  }

  // ---- post-game review ----
  async function review(over) {
    reviewing = true; cursor = shownPly = sans.length
    const myGame = gameId, n = sans.length
    $('#takeback').disabled = false; $('#takeback').textContent = 'Play from here'
    reviewEl.hidden = false
    $('#summary').textContent = 'Analysing…'; $('#note').textContent = ''; $('#keymoves').innerHTML = ''
    for (let i = 0; i <= n; i++) {
      if (myGame !== gameId) return
      if (evals[i] && (evals[i].final || evals[i].depth >= DEPTH)) continue
      $('#summary').textContent = `Analysing… ${i + 1} / ${n + 1}`
      await analyse(i, { live: false })
    }
    if (myGame !== gameId) return
    grades = gradeAll(rec)
    paintMoves(); paintBar()
    $('#summary').innerHTML = summary(rec)
    const km = keyMoves(rec); keyPlies = km.plies
    $('#keymoves').innerHTML = km.html
    $('#controls').hidden = false; paintControls()
    $('#note').hidden = false
    $('#note').textContent = 'Step through with the buttons or ← →; the double arrows jump between key moves.'
  }
  async function goTo(k) {
    if (!reviewing) return
    k = Math.max(0, Math.min(sans.length, k))
    cursor = k
    const arrows = reviewArrows(rec, k)
    // a marked move is shown on the position before it, with the played move in red and the better one in green
    const t = arrows.length ? k - 1 : k
    if (t === shownPly + 1) await board.play(sans[t - 1])
    else if (t === shownPly - 1) await board.undo({ silent: true })
    else if (t !== shownPly) await board.setHistory(sans.slice(0, t))
    shownPly = t
    board.setArrows(arrows)
    paintMoves(); paintBar(); paintControls()
    $('#note').textContent = note(rec, k)
  }
  const prevKey = () => keyPlies.filter(p => p < cursor).at(-1)
  const nextKey = () => keyPlies.find(p => p > cursor)
  function paintControls() {
    const c = $('#controls'); if (c.hidden) return
    c.querySelector('[data-nav="prevkey"]').disabled = prevKey() === undefined
    c.querySelector('[data-nav="nextkey"]').disabled = nextKey() === undefined
    c.querySelector('[data-nav="prev"]').disabled = cursor === 0
    c.querySelector('[data-nav="next"]').disabled = cursor === sans.length
    $('#pos').textContent = cursor ? moveLabel(rec, cursor) : 'Start'
  }

  // ---- wiring ----
  main.querySelector('.play-side').addEventListener('click', e => {
    const b = e.target.closest('[data-opp]'); if (!b || playing) return
    opponent = b.dataset.opp; prefs.opponent = opponent; save(prefs)
    main.querySelectorAll('[data-opp]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b) })
    $('#level-field').hidden = opponent === 'bot'
    getEngine().then(() => { if (!playing) setStatus('Engine ready. Press New game.') })
  })
  $('#level').addEventListener('change', e => { level = LEVELS.find(l => l.id === +e.target.value); prefs.level = level.id; save(prefs); if (engine) applyLevel(engine, level) })
  main.querySelector('.play-side').addEventListener('click', e => {
    const b = e.target.closest('[data-color]'); if (!b) return
    userColor = b.dataset.color; prefs.color = userColor; save(prefs)
    main.querySelectorAll('[data-color]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b) })
    if (!playing) { if (board.orientation() !== userColor) board.flip().then(paintBar) }
  })
  $('#evalswitch').addEventListener('click', e => {
    prefs.evalbar = !prefs.evalbar; save(prefs)
    e.currentTarget.setAttribute('aria-checked', prefs.evalbar); barEl.hidden = !prefs.evalbar; paintBar()
  })
  movesEl.addEventListener('click', e => { const b = e.target.closest('[data-ply]'); if (b && reviewing) goTo(+b.dataset.ply) })
  $('#keymoves').addEventListener('click', e => {
    const b = e.target.closest('[data-ply]'); if (!b || !reviewing) return
    goTo(+b.dataset.ply)
    const r = main.querySelector('.play-board').getBoundingClientRect()
    if (r.top < 0 || r.bottom > window.innerHeight) main.querySelector('.play-board').scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  const onKey = e => {
    if (!reviewing || e.altKey || e.metaKey || e.ctrlKey || /input|select|textarea/i.test(e.target.tagName)) return
    const k = e.shiftKey ? { ArrowLeft: prevKey(), ArrowRight: nextKey() }[e.key] : { ArrowLeft: cursor - 1, ArrowRight: cursor + 1, ArrowUp: 0, ArrowDown: sans.length }[e.key]
    if (k === undefined) return
    e.preventDefault(); goTo(k)
  }
  document.addEventListener('keydown', onKey)
  $('#controls').addEventListener('click', e => {
    const b = e.target.closest('[data-nav]'); if (!b || !reviewing) return
    const k = { prevkey: prevKey(), nextkey: nextKey(), prev: cursor - 1, next: cursor + 1 }[b.dataset.nav]
    if (k !== undefined) goTo(k)
  })
  $('#new').addEventListener('click', () => { sound.unlock(); newGame() })
  $('#takeback').addEventListener('click', takeBack)
  $('#hint').addEventListener('click', hint)
  $('#resign').addEventListener('click', resign)

  // warm the engine up in the background so the first game starts quickly
  getEngine().then(() => { if (!playing) setStatus('Engine ready. Press New game.') }).catch(err => setStatus('Could not load the engine: ' + err.message, 'bad'))

  return () => { gen++; gameId++; if (engine && thinking) engine.stop(); analyst().stop(); document.removeEventListener('keydown', onKey); board.destroy() }
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
