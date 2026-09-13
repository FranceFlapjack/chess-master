// Annotated game viewer: board + move list + comments + keyboard navigation.
import { Chess } from '../vendor/chess.js/chess.js'
import { Board } from './board.js'
import { sound } from './sound.js'

export function parsePgn(text) {
  const c = new Chess()
  c.loadPgn(text)
  const headers = c.getHeaders()
  const moves = c.history({ verbose: true })
  const cmap = new Map(c.getComments().map(x => [x.fen, x.comment]))
  const fens = [moves.length ? moves[0].before : c.fen()]
  for (const m of moves) fens.push(m.after)
  const comments = fens.map(f => cmap.get(f) || null)
  return { headers, moves, fens, comments, result: headers.Result || '' }
}

let activeViewer = null
document.addEventListener('keydown', e => {
  if (!activeViewer || e.altKey || e.metaKey || e.ctrlKey) return
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  const v = activeViewer
  const map = { ArrowLeft: () => v.goTo(v.ply - 1), ArrowRight: () => v.goTo(v.ply + 1), ArrowUp: () => v.goTo(0), ArrowDown: () => v.goTo(v.moves.length), Home: () => v.goTo(0), End: () => v.goTo(v.moves.length), f: () => v.board.flip(), F: () => v.board.flip() }
  if (map[e.key]) { e.preventDefault(); map[e.key]() }
})

export const ICONS = {
  start: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4v12M15 4l-7 6 7 6z"/></svg>',
  prev:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4l-6 6 6 6"/></svg>',
  next:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4l6 6-6 6"/></svg>',
  end:   '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4v12M5 4l7 6-7 6z"/></svg>',
  prevkey: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l-6 6 6 6M16 4l-6 6 6 6"/></svg>',
  nextkey: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l6 6-6 6M4 4l6 6-6 6"/></svg>',
  flip:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h12l-3-3M16 13H4l3 3"/></svg>',
}

export function mountPgnViewer(container, pgnText, { orientation = 'w', start = 0, onEnd = null, id = null } = {}) {
  const game = parsePgn(pgnText)
  const h = game.headers
  const players = h.Black ? `${h.White || 'White'} – ${h.Black}` : (h.White || 'White')
  const meta = [h.Event, h.Site, h.Date ? h.Date.replace(/\.\?\?/g, '').replace(/\./g, '-') : null].filter(x => x && x !== '?').join(', ')

  container.className = 'game'
  container.tabIndex = 0
  container.innerHTML = `
    <div class="game-board">
      <div class="board-wrap"><div class="board"></div></div>
      <div class="game-controls">
        <button class="icon-btn" data-nav="start" title="Start (↑)">${ICONS.start}</button>
        <button class="icon-btn" data-nav="prev" title="Previous (←)">${ICONS.prev}</button>
        <button class="icon-btn" data-nav="next" title="Next (→)">${ICONS.next}</button>
        <button class="icon-btn" data-nav="end" title="End (↓)">${ICONS.end}</button>
        <span class="spacer"></span>
        <button class="icon-btn" data-nav="flip" title="Flip board (F)">${ICONS.flip}</button>
      </div>
    </div>
    <div class="game-side">
      <header class="game-head">
        <div class="game-players">${esc(players)}</div>
        <div class="game-meta">${esc(meta)}${game.result ? ' · ' + esc(game.result) : ''}</div>
      </header>
      <div class="game-note" aria-live="polite"></div>
      <div class="moves"></div>
    </div>`

  const board = new Board(container.querySelector('.board'), { fen: game.fens[0], orientation })
  const movesEl = container.querySelector('.moves')
  const noteEl = container.querySelector('.game-note')

  // move list
  const frag = []
  let needNumber = false // after a comment, a black move needs its own "N…" label
  game.moves.forEach((m, i) => {
    const ply = i + 1
    const white = m.color === 'w'
    if (white) frag.push(`<span class="mvnum">${Math.ceil(ply / 2)}.</span>`)
    else if (needNumber) frag.push(`<span class="mvnum">${Math.ceil(ply / 2)}…</span>`)
    frag.push(`<button class="mv" data-ply="${ply}">${esc(m.san)}</button>`)
    if (!white && needNumber) frag.push('<span class="mv-break"></span>') // keep the next "N." on its own row
    needNumber = false
    if (game.comments[ply]) { frag.push(`<div class="mv-comment">${esc(game.comments[ply])}</div>`); needNumber = white }
  })
  if (game.result) frag.push(`<div class="mv-result">${esc(game.result)}</div>`)
  movesEl.innerHTML = frag.join('')

  const viewer = {
    board, moves: game.moves, ply: 0, ended: false,
    async goTo(ply) {
      ply = Math.max(0, Math.min(game.moves.length, ply))
      if (ply === this.ply) return
      const forward = ply === this.ply + 1
      const last = ply > 0 ? game.moves[ply - 1] : null
      this.ply = ply
      paint()
      await board.showPosition(game.fens[ply], { lastMove: last, play: forward ? 'auto' : (ply === 0 ? null : 'move') })
      if (ply === game.moves.length && !this.ended) { this.ended = true; if (onEnd) onEnd(id) }
    },
  }
  function paint() {
    movesEl.querySelectorAll('.mv.current').forEach(b => b.classList.remove('current'))
    const cur = movesEl.querySelector(`.mv[data-ply="${viewer.ply}"]`)
    if (cur) { cur.classList.add('current'); cur.scrollIntoView({ block: 'nearest' }) }
    else movesEl.scrollTop = 0
    noteEl.textContent = game.comments[viewer.ply] || ''
  }
  paint()

  movesEl.addEventListener('click', e => { const b = e.target.closest('.mv'); if (b) { activate(); viewer.goTo(+b.dataset.ply) } })
  container.querySelector('.game-controls').addEventListener('click', e => {
    const b = e.target.closest('[data-nav]'); if (!b) return
    activate()
    const n = b.dataset.nav
    if (n === 'start') viewer.goTo(0); else if (n === 'prev') viewer.goTo(viewer.ply - 1)
    else if (n === 'next') viewer.goTo(viewer.ply + 1); else if (n === 'end') viewer.goTo(game.moves.length)
    else if (n === 'flip') board.flip()
  })
  function activate() { activeViewer = viewer; sound.unlock() }
  container.addEventListener('pointerdown', activate)
  container.addEventListener('focus', activate)
  if (!activeViewer) activeViewer = viewer
  if (start) viewer.goTo(start)
  return viewer
}

export function setActiveViewer(v) { activeViewer = v }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
