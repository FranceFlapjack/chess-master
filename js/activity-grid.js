// 12-week activity grid (one cell per day) + streak and points, like a contribution graph.
import { progress, dayKey, addDays } from './progress.js'

const WEEKS = 12
const level = p => p <= 0 ? 0 : p < 10 ? 1 : p < 25 ? 2 : p < 50 ? 3 : 4
const fmt = d => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

export function mountActivity(el) {
  const render = () => {
    const now = new Date(); now.setHours(12, 0, 0, 0)
    // grid ends on today's column; columns are weeks, rows Mon..Sun
    const dow = (now.getDay() + 6) % 7 // Mon=0
    const start = addDays(now, -(WEEKS * 7 - 1) - dow)
    const cells = []
    let d = start
    const total = WEEKS * 7 + dow
    for (let i = 0; i < total; i++) {
      const k = dayKey(d), p = progress.pointsOn(k)
      const isFuture = d > now
      cells.push(`<i class="l${isFuture ? 0 : level(p)}${k === dayKey(now) ? ' today' : ''}" title="${fmt(d)} · ${p} pt${p === 1 ? '' : 's'}"${isFuture ? ' style="visibility:hidden"' : ''}></i>`)
      d = addDays(d, 1)
    }
    // pad the last column so the grid stays rectangular
    const streak = progress.streak()
    el.innerHTML = `
      <div class="activity">
        <div class="activity-grid" role="img" aria-label="Activity over the last ${WEEKS} weeks">${cells.join('')}</div>
        <div class="activity-stats">
          <span><b>${streak}</b> day${streak === 1 ? '' : 's'} streak</span>
          <span><b>${progress.state.total}</b> pts</span>
        </div>
      </div>`
  }
  render()
  return progress.onChange(render)
}
