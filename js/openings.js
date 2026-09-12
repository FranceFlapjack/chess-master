// Openings book: every line the bot knows, playable with a description, and drillable from either side.
import { mountPgnViewer } from './pgn-viewer.js'
import { mountExercise } from './exercise.js'
import { Chess } from '../vendor/chess.js/chess.js'

let catalogue = null

export function mountOpenings(main, selectedId) {
  let current = null // {viewer, exercise}
  main.innerHTML = `<div class="page"><header class="lesson-head"><span class="eyebrow">Openings book</span><h1>Every line in the book</h1><p class="lede">The 84 openings the Chess Learn Bot plays from, with the idea behind each. Pick a line, step through it, then drill it from either side.</p></header><div class="openings"><nav class="openings-list" id="olist"></nav><section class="openings-view" id="oview"><p class="small">Loading…</p></section></div></div>`
  const listEl = main.querySelector('#olist'), viewEl = main.querySelector('#oview')

  ;(catalogue ? Promise.resolve(catalogue) : fetch('content/openings/lines.json').then(r => r.json()).then(j => (catalogue = j))).then(lines => {
    const families = [...new Set(lines.map(l => l.family))]
    listEl.innerHTML = families.map(f => `<div class="ofam"><h2>${esc(f)}</h2><ul>${lines.filter(l => l.family === f).map(l => `<li><a href="#/openings/${l.id}" data-id="${l.id}">${esc(l.name)}</a></li>`).join('')}</ul></div>`).join('')
    const id = +selectedId || lines[0].id
    show(lines.find(l => l.id === id) || lines[0])
  })

  function show(line) {
    if (current) { current.forEach(c => c.board && c.board.destroy()); current = null }
    listEl.querySelectorAll('a').forEach(a => a.classList.toggle('current', +a.dataset.id === line.id))
    const pgn = `[Event "${esc(line.family)}"]\n[White "${esc(line.name)}"]\n[Black ""]\n[Result "*"]\n\n{${line.note.replace(/[{}]/g, '')}} ${toPgn(line.moves)} *`
    viewEl.innerHTML = `<span class="eyebrow">${esc(line.family)}</span><h2 class="oname">${esc(line.name)}</h2><p class="onote">${esc(line.note)}</p><p class="omoves mono">${esc(toPgn(line.moves))}</p><figure id="oviewer"></figure><div class="odrill"><span class="eyebrow">Drill it</span><div class="seg"><button class="btn" data-side="w">Play it as White</button><button class="btn" data-side="b">Play it as Black</button></div><figure id="odrill" hidden></figure></div>`
    const viewer = mountPgnViewer(viewEl.querySelector('#oviewer'), pgn, { id: `openings-book#${line.id}` })
    current = [viewer]
    viewEl.querySelector('.odrill').addEventListener('click', e => {
      const b = e.target.closest('[data-side]'); if (!b) return
      const side = b.dataset.side
      const fig = viewEl.querySelector('#odrill'); fig.hidden = false; fig.innerHTML = ''
      const c = new Chess()
      let solution = line.moves, fen = c.fen()
      if (side === 'b') { c.move(line.moves[0]); fen = c.fen(); solution = line.moves.slice(1) }
      if (current[1] && current[1].board) current[1].board.destroy()
      current[1] = mountExercise(fig, { fen, solution: solution.join(' '), type: 'line', orientation: side, prompt: `Play the ${line.name} as ${side === 'w' ? 'White' : 'Black'}.`, hint: toPgn(line.moves), success: 'That is the line. Now you know it from this side.', id: `openings-book#${line.id}-${side}` }, { lessonId: 'openings-book' })
      fig.scrollIntoView({ block: 'start', behavior: 'smooth' })
      viewEl.querySelectorAll('[data-side]').forEach(x => x.classList.toggle('on', x === b))
    })
    window.scrollTo({ top: 0 })
  }
  listEl.addEventListener('click', e => {
    const a = e.target.closest('a[data-id]'); if (!a) return
    e.preventDefault(); history.replaceState(null, '', a.getAttribute('href'))
    show(catalogue.find(l => l.id === +a.dataset.id))
  })
  return () => { if (current) current.forEach(c => c.board && c.board.destroy()) }
}

function toPgn(moves) { return moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + m).join(' ') }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
