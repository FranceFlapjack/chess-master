// Chess Master's welcome background: a thin-ruled board on which one line traces a knight's tour — a
// route that visits all 64 squares once. A small red dot leads the line and every square it has visited
// keeps a dot. The finished tour holds, fades, and starts again: 24 s drawing, 4 s held, 2 s fading.
//
// Chess only, and mounted from js/app.js into the welcome's root, so js/welcome.js and css/welcome.css
// stay identical across the Master series.

const DRAW = 24000, HOLD = 4000, FADE = 2000, CYCLE = DRAW + HOLD + FADE
const JUMPS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
const SVG = 'http://www.w3.org/2000/svg'

/** A knight's tour by Warnsdorff's rule (always jump to the square with the fewest onward jumps): 64 squares 0–63, or null. */
export function knightsTour(start = 0) {
  const seen = new Set([start]), path = [start]
  const onward = sq => JUMPS.map(([dx, dy]) => [sq % 8 + dx, (sq >> 3) + dy])
    .filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8).map(([x, y]) => y * 8 + x).filter(s => !seen.has(s))
  while (path.length < 64) {
    const options = onward(path[path.length - 1])
    if (!options.length) return null
    const next = options.reduce((a, b) => onward(b).length < onward(a).length ? b : a)
    seen.add(next); path.push(next)
  }
  return path
}

/** Draw the tour into `root` (the welcome curtain) behind its type; it stops by itself once root leaves the page. */
export function mountTour(root) {
  let tour = null
  for (let s = 0; !tour && s < 64; s++) tour = knightsTour(s)
  const pt = sq => [sq % 8 + 0.5, 7 - (sq >> 3) + 0.5]          // square centre, rank 1 at the bottom
  const svg = document.createElementNS(SVG, 'svg')
  svg.setAttribute('class', 'wl-tour')
  svg.setAttribute('viewBox', '-0.5 -0.5 9 9')
  svg.setAttribute('aria-hidden', 'true')
  const lines = []
  for (let i = 0; i <= 8; i++) lines.push(`M${i} 0V8`, `M0 ${i}H8`)
  svg.innerHTML = `<path class="wl-tour-grid" d="${lines.join('')}"/>
    <g class="wl-tour-run"><path class="wl-tour-line" pathLength="1" d="M${tour.map(pt).join('L')}"/>
    ${tour.map(sq => `<circle class="wl-tour-dot" cx="${pt(sq)[0]}" cy="${pt(sq)[1]}" r=".04"/>`).join('')}
    <circle class="wl-tour-head" r=".07"/></g>`
  root.prepend(svg)

  const run = svg.querySelector('.wl-tour-run'), line = svg.querySelector('.wl-tour-line'), head = svg.querySelector('.wl-tour-head')
  const dots = [...svg.querySelectorAll('.wl-tour-dot')]
  let shown = -1
  const paint = t => {                                            // t: ms into the cycle
    const p = Math.min(t / DRAW, 1) * 63                          // jumps drawn so far
    const i = Math.min(Math.floor(p), 62), f = p - i, [x0, y0] = pt(tour[i]), [x1, y1] = pt(tour[i + 1])
    line.style.strokeDashoffset = 1 - p / 63                      // every jump is the same length, so time maps straight to distance
    head.setAttribute('cx', x0 + (x1 - x0) * f); head.setAttribute('cy', y0 + (y1 - y0) * f)
    const n = Math.floor(p)
    if (n !== shown) { dots.forEach((d, k) => d.classList.toggle('on', k <= n)); shown = n }
    run.style.opacity = t < DRAW + HOLD ? 1 : Math.max(0, 1 - (t - DRAW - HOLD) / FADE)
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { paint(DRAW); return }   // the finished tour, still
  const start = performance.now()
  const frame = now => { if (!svg.isConnected) return; paint((now - start) % CYCLE); requestAnimationFrame(frame) }
  requestAnimationFrame(frame)
}
