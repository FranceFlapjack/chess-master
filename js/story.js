// The home page's story: chess told in six short scenes on the dark brand ground, before the course.
// Owner's direction 2026-10-27: the site stays light; the entry is dark or the main green; graphics that
// make someone want to play — heatmaps for every piece — with every fact computed here or cited below.
//
// Each scene rises in as it reaches the screen and only then starts its own animation; everything stops
// when the page is left (the returned function), and reduced motion gets the finished pictures, still.
import { Chess } from '../vendor/chess.js/chess.js'
import { Board } from './board.js'
import { heatmap, reach } from './heatmap.js'

const PIECES = [['k', 'King'], ['q', 'Queen'], ['r', 'Rook'], ['b', 'Bishop'], ['n', 'Knight'], ['p', 'Pawn']]
export const PIECE_SET = 'vendor/cm-chessboard/assets/pieces/staunty.svg'
const icon = p => `<svg class="story-piece" viewBox="0 0 40 40" aria-hidden="true"><use href="${PIECE_SET}#w${p}"/></svg>`
const START = new Chess().fen()
const cap = t => t.charAt(0).toUpperCase() + t.slice(1)

/** `cta`: { href, label, today, secondary: { href, label } } — the hero's way in, decided by the app (start or continue). */
export function mountStory(el, { cta }) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  let dead = false
  const wait = ms => new Promise(r => setTimeout(r, ms))
  el.className = 'story'
  el.innerHTML = `
    <section class="story-scene story-hero">
      <div class="story-copy">
        <p class="story-kicker">A course built on real games</p>
        <h1 class="story-title">64 squares.<br>32 pieces.<br><em>No two games alike.</em></h1>
        <p class="story-lead">It began in India more than 1,400 years ago, and people still can’t put it down. Scroll to see why, or start right now.</p>
        <div class="story-cta"><a class="btn primary" href="${cta.href}">${cta.label}</a>${cta.secondary ? `<a class="btn" href="${cta.secondary.href}">${cta.secondary.label}</a>` : ''}</div>
      </div>
      <figure class="story-figure"><div class="board-wrap"><div class="board" id="story-first"></div></div><figcaption><b id="story-first-n">20</b> ways to make the first move</figcaption></figure>
    </section>

    <section class="story-scene">
      <p class="story-kicker">1 · Possibilities</p>
      <h2 class="story-h">How many games can there be?</h2>
      <ol class="story-count">${[[1, 20, 'one move by White'], [2, 400, 'one move each'], [4, 197281, 'two moves each'], [6, 119060324, 'three moves each']].map(([ply, n, what]) =>
        `<li><b data-n="${n}">${n.toLocaleString('en-US')}</b><i style="--w:${(Math.log10(n) / Math.log10(119060324)).toFixed(3)}"></i><span>different games after ${what}</span></li>`).join('')}</ol>
      <p class="story-src">Counted, not looked up: this site’s own engine plays out every legal move (scripts/perft.mjs).</p>
    </section>

    <section class="story-scene story-split">
      <div>
        <p class="story-kicker">2 · Every piece</p>
        <h2 class="story-h">All six pieces, <em>one board.</em></h2>
        <p class="story-body" id="story-reach-text"></p>
        <div class="story-chips" id="story-reach-chips"><button class="story-chip story-chip-all on" data-all aria-pressed="true"><span>All six</span></button>${PIECES.map(([p, name]) => `<button class="story-chip on" data-p="${p}" aria-pressed="true">${icon(p)}<span>${name}</span></button>`).join('')}</div>
      </div>
      <div class="story-heat story-heat-big" id="story-reach"></div>
    </section>

    <section class="story-scene story-split">
      <div>
        <p class="story-kicker">3 · Footprints</p>
        <h2 class="story-h" id="story-foot-title">Where the pieces go.</h2>
        <p class="story-body" id="story-foot-text"></p>
        <div class="story-chips" id="story-foot-filter"><button class="story-chip story-chip-all on" data-p="">All</button>${PIECES.map(([p, n]) => `<button class="story-chip" data-p="${p}">${icon(p)}<span>${n}</span></button>`).join('')}</div>
        <div class="seg story-filter" id="story-foot-kind"><button class="btn on" data-k="go">Where they move</button><button class="btn" data-k="fall">Where they are captured</button></div>
      </div>
      <div class="story-heat story-heat-big" id="story-foot"></div>
    </section>

    <section class="story-scene story-split">
      <div>
        <p class="story-kicker">4 · Speed</p>
        <h2 class="story-h">The fastest checkmate takes <em>two moves.</em></h2>
        <p class="story-body">It is called Fool’s Mate, and it only works if White helps: two careless pawn moves open the way to the king, and Black’s queen walks straight in.</p>
        <p class="story-moves">1. f3 e5 &nbsp;2. g4 <em>Qh4#</em></p>
      </div>
      <div class="board-wrap story-board"><div class="board" id="story-fools"></div></div>
    </section>

    <section class="story-scene">
      <p class="story-kicker">5 · The story so far</p>
      <h2 class="story-h">Fourteen centuries, five moments.</h2>
      <ol class="story-time">
        <li><b>c. 600</b><span>India: chaturanga, the game that became chess.</span></li>
        <li><b>Late 1400s</b><span>Europe: the queen gets her long, sweeping move.</span></li>
        <li><b>1858</b><span>Paris: Paul Morphy plays the <a href="#/lesson/games/morphy-opera-game">Opera Game</a>, at the opera.</span></li>
        <li><b>1997</b><span>New York: the computer Deep Blue beats world champion Garry Kasparov.</span></li>
        <li><b>Today</b><span>You. <a href="${cta.href}">${cta.today}</a>.</span></li>
      </ol>
      <p class="story-src">Sources: game counts from this site’s move generator; piece reach and footprints computed on this page. History from Wikipedia, “History of chess”, “Queen (chess)” and “Deep Blue versus Garry Kasparov” (CC BY-SA). Pieces: Staunty set from lichess, CC BY-NC-SA 4.0.</p>
    </section>`
  const $ = s => el.querySelector(s)

  // scenes rise in as they arrive, and start their own motion then
  const starts = new Map()
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return
    e.target.classList.add('story-in')
    const go = starts.get(e.target); if (go) { starts.delete(e.target); go() }
  }), { threshold: 0.2 })
  const scenes = [...el.querySelectorAll('.story-scene')]
  scenes.forEach(s => io.observe(s))
  setTimeout(() => scenes[0].classList.add('story-in'), 30)   // the first screen never waits for the observer (or for a frame: background tabs get none)

  // hero: all 20 first moves, drawn one by one
  const first = new Board($('#story-first'), { fen: START, coordinates: false })
  const moves = new Chess().moves({ verbose: true }).map(m => ({ from: m.from, to: m.to, type: m.piece === 'n' ? 'alt' : 'main' }))
  starts.set(scenes[0], async () => {
    for (let i = 1; i <= moves.length && !dead; i++) {
      first.setArrows(moves.slice(0, i)); $('#story-first-n').textContent = i
      if (!still) await wait(140)
    }
  })

  // 1: count up to the exact numbers, the bars growing on a log scale
  starts.set(scenes[1], () => {
    scenes[1].classList.add('story-grow')
    if (still) return
    el.querySelectorAll('.story-count b').forEach((b, i) => {
      const n = +b.dataset.n, t0 = performance.now() + i * 300
      const tick = now => { if (dead) return; const p = Math.min(1, Math.max(0, (now - t0) / 1300)); b.textContent = Math.round(n * (1 - (1 - p) ** 3)).toLocaleString('en-US'); if (p < 1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
    })
  })

  // 2: every piece's reach on one board — each square scores the squares the switched-on pieces would
  // attack from there, added together. One piece on shows that piece alone.
  const maps = Object.fromEntries(PIECES.map(([p]) => [p, reach(p)]))
  const chips = $('#story-reach-chips')
  const paintReach = () => {
    const on = [...chips.querySelectorAll('.story-chip.on[data-p]')].map(b => b.dataset.p)
    const sum = {}
    for (const sq of Object.keys(maps.k)) {
      const vals = on.map(p => maps[p][sq])
      sum[sq] = on.length === 1 ? vals[0] : vals.reduce((t, v) => t + (v || 0), 0)   // a pawn's "never" only shows when it is alone
    }
    const v = Object.values(sum).filter(x => x != null), lo = Math.min(...v), hi = Math.max(...v)
    const names = on.map(p => PIECES.find(x => x[0] === p)[1].toLowerCase())
    $('#story-reach-text').textContent =
      on.length === 6 ? `Every square, scored by how many squares all six pieces would attack from there, added up: ${lo} from a corner, ${hi} from the middle. Tap a piece to see it alone.`
      : on.length === 1 && on[0] === 'r' ? 'The rook attacks 14 squares from every square on the board — the one piece the centre does not help.'
      : on.length === 1 && on[0] === 'p' ? 'A pawn attacks 1 square from the edge files and 2 from anywhere else, and can never stand on the first or last rank.'
      : on.length === 1 ? `The ${names[0]} attacks ${lo} squares from a corner and ${hi} from the middle.`
      : `${cap(names.slice(0, -1).join(', '))} and ${names.at(-1)} together: ${lo} from a corner, ${hi} from the middle.`
    heatmap($('#story-reach'), sum, { numbers: true, label: `Squares attacked from each square by: ${names.join(', ')}` })
  }
  // with every piece on, a tap shows that piece alone; after that, taps add or remove pieces; "All six" resets
  chips.addEventListener('click', e => {
    const b = e.target.closest('.story-chip'); if (!b) return
    const pieces = [...chips.querySelectorAll('.story-chip[data-p]')], all = pieces.every(c => c.classList.contains('on'))
    const set = (c, v) => { c.classList.toggle('on', v); c.setAttribute('aria-pressed', v) }
    if (b.hasAttribute('data-all')) pieces.forEach(c => set(c, true))
    else if (all) pieces.forEach(c => set(c, c === b))
    else { set(b, !b.classList.contains('on')); if (!pieces.some(c => c.classList.contains('on'))) pieces.forEach(c => set(c, true)) }
    set(chips.querySelector('[data-all]'), pieces.every(c => c.classList.contains('on')))
    paintReach()
  })
  paintReach()

  // 3: footprints — the visitor's own games if My games has them, else Morphy's Opera Game
  footprints().then(f => {
    if (dead) return
    $('#story-foot-title').innerHTML = f.title; $('#story-foot-text').textContent = f.text
    let piece = '', kind = 'go'
    const draw = () => heatmap($('#story-foot'), f.count(kind, piece), { label: `${kind === 'go' ? 'Where the pieces moved' : 'Where pieces were captured'}${piece ? `: ${PIECES.find(p => p[0] === piece)[1].toLowerCase()}s` : ''}` })
    const pick = (box, attr, set) => box.addEventListener('click', e => {
      const b = e.target.closest(`[${attr}]`); if (!b) return
      set(b.getAttribute(attr)); box.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); draw()
    })
    pick($('#story-foot-filter'), 'data-p', v => { piece = v })
    pick($('#story-foot-kind'), 'data-k', v => { kind = v })
    draw()
  })

  // 4: Fool's Mate on the course's own board, replayed while the page is open
  const fools = new Board($('#story-fools'), { fen: START, coordinates: false })
  const MATE = ['f3', 'e5', 'g4', 'Qh4#']
  if (still) { const c = new Chess(); MATE.forEach(m => c.move(m)); fools.showPosition(c.fen(), { animate: false }) }
  else starts.set(el.querySelector('#story-fools').closest('.story-scene'), async () => {
    while (!dead) {
      await fools.showPosition(START); await wait(900)
      for (const m of MATE) { if (dead) return; await fools.play(m, { silent: true }); await wait(800) }
      await wait(2600)
    }
  })

  return () => { dead = true; io.disconnect(); first.destroy(); fools.destroy() }
}

/** Piece footprints: counts by square, for one piece or all, of moves made or of pieces lost there. */
async function footprints() {
  let games = []
  try { games = (JSON.parse(localStorage.getItem('chess-master.games.v1')) || {}).games || [] } catch {}
  const tally = list => {
    const t = { go: {}, fall: {} }
    for (const [mine, m] of list) {
      if (mine) bump(t.go, m.piece, m.to)
      else if (m.captured) bump(t.fall, m.captured, m.to)   // their capture: the square where one of ours died
    }
    return (kind, piece) => (piece ? t[kind][piece] : t[kind].all) || {}
  }
  const bump = (o, p, sq) => { for (const k of [p, 'all']) { o[k] = o[k] || {}; o[k][sq] = (o[k][sq] || 0) + 1 } }
  const verbose = pgn => { const c = new Chess(); try { c.loadPgn(pgn) } catch { return [] } return c.history({ verbose: true }) }
  if (games.length) return {
    title: 'Where <em>your</em> pieces go.',
    text: `From your ${games.length} games on My games. Pick a piece; switch to “captured” to see where you lose them.`,
    count: tally(games.flatMap(g => verbose(g.pgn).map(m => [m.color === g.userColor, m]))),
  }
  const pgn = await (await fetch('content/games/morphy-opera-1858.pgn')).text()
  return {
    title: 'Where Morphy’s pieces <em>went.</em>',
    text: 'Paris, 1858: the Opera Game, seventeen moves. Bring your chess.com games to My games and this map becomes yours.',
    count: tally(verbose(pgn).map(m => [m.color === 'w', m])),
  }
}
