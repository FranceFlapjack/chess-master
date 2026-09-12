// Arrow extension for cm-chessboard with L-shaped knight arrows (lichess style) and a drawn arrowhead.
import { Extension, EXTENSION_POINT } from '../vendor/cm-chessboard/src/model/Extension.js'
import { Svg } from '../vendor/cm-chessboard/src/lib/Svg.js'

const FILES = 'abcdefgh'
const sq2xy = s => [FILES.indexOf(s[0]), parseInt(s[1], 10) - 1]

export class LearnArrows extends Extension {
  constructor(chessboard, props = {}) {
    super(chessboard)
    this.props = Object.assign({ width: 0.2, head: 0.42, offsetTo: 0.42, offsetFrom: 0.15 }, props) // fractions of a square
    this.registerExtensionPoint(EXTENSION_POINT.afterRedrawBoard, () => this.redraw())
    this.registerExtensionPoint(EXTENSION_POINT.destroy, () => this.destroy())
    chessboard.addArrow = this.addArrow.bind(this)
    chessboard.removeArrows = this.removeArrows.bind(this)
    this.group = Svg.addElement(chessboard.view.markersTopLayer, 'g', { class: 'arrows' })
    this.arrows = []
  }
  destroy() {
    this.arrows.length = 0
    if (this.group && this.group.parentNode) this.group.parentNode.removeChild(this.group)
    delete this.chessboard.addArrow
    delete this.chessboard.removeArrows
  }
  addArrow(type, from, to) { this.arrows.push({ type, from, to }); this.redraw() }
  removeArrows(type) { this.arrows = type ? this.arrows.filter(a => a.type !== type) : []; this.redraw() }

  redraw() {
    while (this.group.firstChild) this.group.removeChild(this.group.firstChild)
    for (const a of this.arrows) this.draw(a)
  }
  center(square) {
    const v = this.chessboard.view, p = v.squareToPoint(square)
    return [p.x + v.squareWidth / 2, p.y + v.squareHeight / 2]
  }
  draw(a) {
    const v = this.chessboard.view
    const sw = v.squareWidth
    const [fx, fy] = sq2xy(a.from), [tx, ty] = sq2xy(a.to)
    const dx = tx - fx, dy = ty - fy
    const knight = (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1)
    const start = this.center(a.from), end = this.center(a.to)
    // points along the path (in board pixels)
    let pts
    if (knight) {
      // go the long leg first, then the short leg (lichess style)
      const cornerSq = Math.abs(dx) === 2 ? FILES[tx] + (fy + 1) : FILES[fx] + (ty + 1)
      pts = [start, this.center(cornerSq), end]
    } else {
      pts = [start, end]
    }
    // shorten the first segment at the start and the last at the end
    const shorten = (p, q, d) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [p[0] + (q[0] - p[0]) / L * d, p[1] + (q[1] - p[1]) / L * d] }
    pts[0] = shorten(pts[0], pts[1], sw * this.props.offsetFrom)
    const n = pts.length - 1
    const tip = pts[n]
    pts[n] = shorten(pts[n], pts[n - 1], sw * this.props.offsetTo)
    // arrowhead: triangle pointing along the last segment, its tip at the shortened end + head length
    const p = pts[n - 1], q = pts[n]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1
    const ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
    const headLen = sw * this.props.head, headW = sw * this.props.width * 1.9
    const hx = q[0] + ux * headLen, hy = q[1] + uy * headLen
    const baseX = q[0], baseY = q[1]
    const head = [[hx, hy], [baseX - uy * headW, baseY + ux * headW], [baseX + uy * headW, baseY - ux * headW]]
    void tip

    const g = Svg.addElement(this.group, 'g', { class: 'arrow ' + a.type.class, 'data-arrow': a.from + a.to })
    const line = Svg.addElement(g, 'polyline', { class: 'arrow-line', points: pts.map(p => p.join(',')).join(' ') })
    line.setAttribute('stroke-width', (sw * this.props.width).toString())
    line.setAttribute('fill', 'none')
    line.setAttribute('stroke-linejoin', 'round')
    line.setAttribute('stroke-linecap', 'round')
    Svg.addElement(g, 'polygon', { class: 'arrow-head', points: head.map(p => p.join(',')).join(' ') })
  }
}
