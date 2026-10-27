// The heatmap: an 8×8 board whose squares run from --heat-cold (the map's lowest value) to --heat-hot
// (its highest). One component for the story home, My games and, later, lessons. Pure SVG: the colours
// come from the tokens, so a .story block (dark) and a light page draw the same markup differently.

const FILES = 'abcdefgh'
export const square = (f, r) => FILES[f] + (r + 1)

/**
 * Draw `counts` (square name → number; null = a square the thing can never stand on) into `el`.
 * `numbers` writes each value in its square; `label` names the map for screen readers.
 */
export function heatmap(el, counts, { numbers = false, label = 'Heatmap' } = {}) {
  const all = []; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) all.push(square(f, r))
  const at = sq => counts[sq] === undefined ? 0 : counts[sq]          // missing: nothing landed there; null: never possible
  const vals = all.map(at).filter(v => v != null)
  const max = Math.max(...vals), min = Math.min(...vals)
  const share = v => max > min ? (v - min) / (max - min) : max ? 1 : 0   // one value everywhere (the rook): all hot; all zero: all cold
  const hottest = all.filter(sq => at(sq) === max)
  let cells = ''
  for (let r = 7; r >= 0; r--) for (let f = 0; f < 8; f++) {
    const s = square(f, r), v = at(s), x = f, y = 7 - r
    if (v == null) { cells += `<rect class="heat-none" x="${x + .04}" y="${y + .04}" width=".92" height=".92"><title>${s}: never</title></rect>`; continue }
    cells += `<rect class="heat-sq" style="--v:${share(v).toFixed(3)}" x="${x + .04}" y="${y + .04}" width=".92" height=".92"><title>${s}: ${v}</title></rect>`
    if (numbers) cells += `<text class="heat-num" x="${x + .5}" y="${y + .5}">${v}</text>`
  }
  const coords = [...FILES].map((c, i) => `<text class="heat-coord" x="${i + .5}" y="8.42">${c}</text>`).join('') +
    [...Array(8)].map((_, i) => `<text class="heat-coord" x="-.3" y="${7.5 - i}">${i + 1}</text>`).join('')
  el.innerHTML = `<svg class="heat" viewBox="-.6 0 8.6 8.6" role="img" aria-label="${label}. Highest: ${hottest.slice(0, 3).join(', ')} (${max}).">${cells}${coords}</svg>`
}

const JUMPS = { n: [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]], k: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]] }
const on = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8

/** How many squares a piece attacks from each square of an empty board. Pawns (white) never stand on ranks 1 or 8. */
export function reach(piece) {
  const out = {}
  for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) {
    const diag = Math.min(f, r) + Math.min(7 - f, r) + Math.min(f, 7 - r) + Math.min(7 - f, 7 - r)
    out[square(f, r)] =
      piece === 'r' ? 14 :
      piece === 'b' ? diag :
      piece === 'q' ? 14 + diag :
      piece === 'p' ? (r === 0 || r === 7 ? null : (f > 0) + (f < 7)) :
      JUMPS[piece].filter(([a, b]) => on(f + a, r + b)).length
  }
  return out
}
