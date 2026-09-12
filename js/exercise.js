// "Try it" exercise: the reader plays the solution moves; the opponent's replies are played automatically.
import { Board, MARK } from './board.js'
import { sound } from './sound.js'
import { progress } from './progress.js'
import { setActiveViewer } from './pgn-viewer.js'

const norm = s => s.replace(/[+#!?]/g, '')
const isMoveToken = t => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)

export function mountExercise(container, o, ctx = {}) {
  const solution = (o.solution || '').split(/\s+/).filter(isMoveToken)
  const id = o.id || `${ctx.lessonId || 'x'}#${ctx.index ?? 0}`
  const orientation = o.orientation || (o.fen.split(' ')[1] === 'b' ? 'b' : 'w')
  const side = o.fen.split(' ')[1]
  const prompt = o.prompt || (side === 'w' ? 'White to move.' : 'Black to move.')

  container.className = 'exercise'
  container.tabIndex = 0
  container.innerHTML = `
    <div class="exercise-board"><div class="board-wrap"><div class="board"></div></div></div>
    <div class="exercise-side">
      <div class="turn"><span class="turn-dot ${side}"></span><span>${side === 'w' ? 'White' : 'Black'} to move</span></div>
      <div class="prompt">${esc(o.prompt || 'Find the best continuation.')}</div>
      <div class="status" aria-live="polite"></div>
      <div class="hint" hidden></div>
      <div class="actions">
        <button class="btn quiet" data-act="hint">Hint</button>
        <button class="btn quiet" data-act="reset">Reset</button>
        <button class="btn quiet" data-act="solution">Show solution</button>
      </div>
    </div>`

  const statusEl = container.querySelector('.status')
  const hintEl = container.querySelector('.hint')
  const board = new Board(container.querySelector('.board'), { fen: o.fen, orientation })
  let idx = 0, wrong = 0, solved = progress.isTryDone(id), showing = false

  function setStatus(text, cls = '') { statusEl.textContent = text; statusEl.className = 'status ' + cls }
  function arm() { if (!solved && !showing) board.enableInput(side, onMove) }

  async function onMove(m) {
    board.disableInput()
    const expected = solution[idx]
    if (expected && norm(m.san) === norm(expected)) {
      idx++
      board.mark(m.to, MARK.good)
      if (idx >= solution.length) return finish()
      setStatus('Yes. ' + (side === 'w' ? 'Black' : 'White') + ' replies…')
      await wait(380)
      board.clearMarks(MARK.good)
      await board.play(solution[idx]); idx++
      if (idx >= solution.length) return finish()
      setStatus('Keep going.')
      arm()
    } else {
      wrong++
      sound.play('fail')
      board.mark(m.to, MARK.bad)
      setStatus(wrong === 1 ? 'Not that one. Try again.' : 'Still not it. The hint may help.', 'bad')
      await wait(500)
      board.clearMarks(MARK.bad)
      await board.undo({ silent: true })
      if (wrong >= 2) showHint()
      arm()
    }
  }
  function finish() {
    solved = true
    container.classList.add('solved')
    sound.play('success')
    setStatus(o.success || 'Solved.', 'good')
    const first = wrong === 0
    if (progress.recordTry(id, first)) { /* points added */ }
    board.disableInput()
  }
  function showHint() { if (o.hint) { hintEl.textContent = o.hint; hintEl.hidden = false } }
  async function reset() {
    showing = false; idx = 0; solved = false
    board.disableInput()
    container.classList.remove('solved')
    board.clearMarks(MARK.good); board.clearMarks(MARK.bad)
    await board.showPosition(o.fen)
    setStatus('')
    arm()
  }
  async function showSolution() {
    showing = true; board.disableInput()
    await board.showPosition(o.fen)
    setStatus('Watch: ' + solution.join(' '))
    for (const san of solution) { await wait(600); await board.play(san) }
    showing = false
    setStatus('That was the line. Reset to try it yourself.')
  }

  container.querySelector('.actions').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return
    sound.unlock()
    if (b.dataset.act === 'hint') { showHint(); if (!o.hint) setStatus('No hint for this one — think about checks first.') }
    if (b.dataset.act === 'reset') reset()
    if (b.dataset.act === 'solution') showSolution()
  })
  container.addEventListener('pointerdown', () => { setActiveViewer(null); sound.unlock() })

  if (solved) { container.classList.add('solved'); setStatus('Solved earlier. Reset to play it again.', 'good') }
  arm()
  return { board, reset }
}

const wait = ms => new Promise(r => setTimeout(r, ms))
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
