// Play page: human vs Stockfish at a chosen strength. One board, a side panel, a move list.
import { Board } from './board.js'
import { stockfish, LEVELS, applyLevel } from './engine/stockfish.js'
import { bot } from './engine/bot.js'
import { uciToMove } from './engine/uci.js'
import { progress } from './progress.js'
import { sound } from './sound.js'
import { DEFAULT_POSITION } from '../vendor/chess.js/chess.js'

const KEY = 'chess-learn.play.v1'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch (_) { return {} } }
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {} }

export function mountPlay(main) {
  const prefs = Object.assign({ level: 3, color: 'w', opponent: 'stockfish' }, load())
  const BOT_MS = 800
  main.innerHTML = `
    <div class="page">
      <header class="lesson-head">
        <span class="eyebrow">Play</span>
        <h1>Against the computer</h1>
        <p class="lede">Two opponents live inside this page: Stockfish 18 at seven strengths, up to the Boss that nobody beats, and the Chess Learn Bot, our own engine, still young.</p>
      </header>
      <div class="play">
        <div class="play-board"><div class="board-wrap"><div class="board"></div></div></div>
        <aside class="play-side">
          <div class="field">
            <label>Opponent</label>
            <div class="seg" role="radiogroup">
              <button class="btn${prefs.opponent === 'stockfish' ? ' on' : ''}" data-opp="stockfish" role="radio" aria-checked="${prefs.opponent === 'stockfish'}">Stockfish</button>
              <button class="btn${prefs.opponent === 'bot' ? ' on' : ''}" data-opp="bot" role="radio" aria-checked="${prefs.opponent === 'bot'}">Chess Learn Bot</button>
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
          <div class="play-actions">
            <button class="btn primary" id="new">New game</button>
            <button class="btn" id="takeback" disabled>Take back</button>
            <button class="btn" id="hint" disabled>Hint</button>
            <button class="btn" id="resign" disabled>Resign</button>
          </div>
          <div class="status" id="status" aria-live="polite">Press New game.</div>
          <div class="moves" id="moves"></div>
        </aside>
      </div>
    </div>`

  const $ = s => main.querySelector(s)
  const statusEl = $('#status'), movesEl = $('#moves')
  const board = new Board($('.board'), { fen: DEFAULT_POSITION, orientation: prefs.color })
  let engine = null, level = LEVELS.find(l => l.id === prefs.level), userColor = prefs.color, opponent = prefs.opponent
  let playing = false, thinking = false, gen = 0
  const uciMoves = []

  const setStatus = (t, cls = '') => { statusEl.textContent = t; statusEl.className = 'status ' + cls }
  const buttons = on => { for (const id of ['takeback', 'hint', 'resign']) $('#' + id).disabled = !on }

  const engines = {}
  async function getEngine() {
    if (!engines[opponent]) { setStatus('Loading engine…'); engines[opponent] = opponent === 'bot' ? bot() : stockfish() }
    engine = engines[opponent]
    await engine.ready()
    return engine
  }
  const moveMs = () => opponent === 'bot' ? BOT_MS : level.ms

  function paintMoves() {
    const h = board.history()
    movesEl.innerHTML = h.map((m, i) => `${i % 2 === 0 ? `<span class="mvnum">${i / 2 + 1}.</span>` : ''}<span class="mv${i === h.length - 1 ? ' current' : ''}">${esc(m.san)}</span>`).join('')
    movesEl.scrollTop = movesEl.scrollHeight
  }

  function gameOver() {
    const c = board.chess
    if (!c.isGameOver()) return null
    if (c.isCheckmate()) return c.turn() === userColor ? { text: 'Checkmate. The computer wins.', result: 'loss' } : { text: 'Checkmate. You win!', result: 'win' }
    if (c.isStalemate()) return { text: 'Stalemate. Draw.', result: 'draw' }
    if (c.isThreefoldRepetition()) return { text: 'Draw by repetition.', result: 'draw' }
    if (c.isInsufficientMaterial()) return { text: 'Draw: not enough material to mate.', result: 'draw' }
    return { text: 'Draw by the fifty-move rule.', result: 'draw' }
  }
  function finish(over) {
    playing = false; board.disableInput(); buttons(false); $('#takeback').disabled = false
    setStatus(over.text, over.result === 'win' ? 'good' : over.result === 'loss' ? 'bad' : '')
    if (over.result === 'win') sound.play('success')
    progress.recordPlay({ opponent, level: opponent === 'bot' ? 0 : level.id, color: userColor, result: over.result })
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
    uciMoves.push(uci); paintMoves()
    const over = gameOver(); if (over) return finish(over)
    setStatus(board.chess.isCheck() ? 'Check. Your move.' : 'Your move.')
    board.enableInput(userColor); buttons(true)
  }

  function onUserMove(m) {
    uciMoves.push(m.from + m.to + (m.promotion || '')); paintMoves()
    const over = gameOver(); if (over) return finish(over)
    engineMove()
  }

  async function newGame() {
    gen++; if (engine && thinking) engine.stop()
    thinking = false; playing = true
    uciMoves.length = 0
    await board.showPosition(DEFAULT_POSITION)
    if (board.orientation() !== userColor) await board.flip()
    paintMoves()
    const e = await getEngine()
    if (opponent === 'stockfish') applyLevel(e, level)
    await e.newGame()
    board.onMove = onUserMove
    if (userColor === 'w') { setStatus('Your move.'); board.enableInput('w'); buttons(true) }
    else engineMove()
  }

  async function takeBack() {
    if (!board.history().length) return
    gen++; if (thinking) { engine.stop(); thinking = false }
    // undo back to a position where it is the user's turn
    const undoOne = async () => { const m = await board.undo({ silent: true }); if (m) uciMoves.pop(); return m }
    await undoOne()
    if (board.turn() !== userColor) await undoOne()
    paintMoves()
    playing = true; setStatus('Your move.'); board.enableInput(userColor); buttons(true)
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
    finish({ text: 'You resigned. The computer wins.', result: 'loss' })
  }

  main.querySelector('.play-side').addEventListener('click', e => {
    const b = e.target.closest('[data-opp]'); if (!b || playing) return
    opponent = b.dataset.opp; prefs.opponent = opponent; save(prefs)
    main.querySelectorAll('[data-opp]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b) })
    $('#level-field').hidden = opponent === 'bot'
    getEngine().then(() => { if (!playing) setStatus('Engine ready. Press New game.') })
  })
  $('#level').addEventListener('change', e => { level = LEVELS.find(l => l.id === +e.target.value); prefs.level = level.id; save(prefs); if (engine) applyLevel(engine, level) })
  $('.seg').addEventListener('click', e => {
    const b = e.target.closest('[data-color]'); if (!b) return
    userColor = b.dataset.color; prefs.color = userColor; save(prefs)
    main.querySelectorAll('[data-color]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b) })
    if (!playing) { if (board.orientation() !== userColor) board.flip() }
  })
  $('#new').addEventListener('click', () => { sound.unlock(); newGame() })
  $('#takeback').addEventListener('click', takeBack)
  $('#hint').addEventListener('click', hint)
  $('#resign').addEventListener('click', resign)

  // warm the engine up in the background so the first game starts quickly
  getEngine().then(() => { if (!playing) setStatus('Engine ready. Press New game.') }).catch(err => setStatus('Could not load the engine: ' + err.message, 'bad'))

  return () => { gen++; if (engine && thinking) engine.stop(); board.destroy() }
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
