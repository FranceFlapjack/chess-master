// Local progress store: lessons done, exercises solved, moves played per day (the activity grid), points per day.
// Everything lives in one localStorage key; export/import as JSON.

const KEY = 'chess-learn.progress.v1'
export const POINTS = { lesson: 10, tryFirst: 5, tryLater: 2, puzzle: 3, game: 5, win: 15, draw: 5, loss: 2 }

const empty = () => ({ v: 1, lessons: {}, tries: {}, games: {}, plays: [], days: {}, moves: {}, total: 0, beginner: false, lastLesson: null })

class Progress {
  constructor() {
    this.state = load()
    this.listeners = new Set()
  }
  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) }
  _save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)) } catch (_) {} ; this.listeners.forEach(fn => fn(this.state)) }

  // --- points & days ---
  addPoints(n, day = today()) {
    this.state.days[day] = (this.state.days[day] || 0) + n
    this.state.total += n
    this._save()
  }
  pointsOn(day) { return this.state.days[day] || 0 }

  // --- moves: every move the reader plays on any board, counted per day (what the grid shows) ---
  recordMove(day = today()) {
    if (!this.state.moves) this.state.moves = {}
    this.state.moves[day] = (this.state.moves[day] || 0) + 1
    this._save()
  }
  movesOn(day) { return (this.state.moves && this.state.moves[day]) || 0 }
  get totalMoves() { return Object.values(this.state.moves || {}).reduce((s, n) => s + n, 0) }

  // --- lessons ---
  isLessonDone(id) { return !!this.state.lessons[id] }
  completeLesson(id) {
    if (this.state.lessons[id]) return false
    this.state.lessons[id] = { done: Date.now() }
    this.addPoints(POINTS.lesson)
    return true
  }
  setLastLesson(id) { if (this.state.lastLesson !== id) { this.state.lastLesson = id; this._save() } }

  // --- exercises ---
  isTryDone(id) { return !!this.state.tries[id] }
  triesFor(lessonId) { return Object.keys(this.state.tries).filter(k => k.startsWith(lessonId + '#')).length }
  recordTry(id, firstAttempt) {
    if (this.state.tries[id]) return false
    this.state.tries[id] = { solved: Date.now(), first: !!firstAttempt }
    this.addPoints(firstAttempt ? POINTS.tryFirst : POINTS.tryLater)
    return true
  }
  recordPlay({ level, color, result }) {
    this.state.plays.push({ t: Date.now(), level, color, result })
    this.addPoints(POINTS[result] || 0)
  }
  recordGame(id) {
    if (this.state.games[id]) return false
    this.state.games[id] = { done: Date.now() }
    this.addPoints(POINTS.game)
    return true
  }

  // --- settings ---
  get beginner() { return !!this.state.beginner }
  set beginner(v) { this.state.beginner = !!v; this._save() }

  // --- streak: consecutive active days ending today (or yesterday if today is untouched),
  //     with one "rest day" forgiven per rolling 7 days.
  streak(now = new Date()) {
    const active = d => (this.state.days[dayKey(d)] || 0) > 0
    let d = new Date(now); d.setHours(12, 0, 0, 0)
    if (!active(d)) d = addDays(d, -1)
    if (!active(d)) return 0
    let n = 0, lastRest = null
    while (true) {
      if (active(d)) { n++; d = addDays(d, -1); continue }
      // gap: allowed only if no other rest day within the previous 7 days
      if (lastRest && (lastRest - d) / 86400000 < 7) break
      // a gap right at the start of history (nothing before it) just ends the streak
      const before = addDays(d, -1)
      if (!active(before)) break
      lastRest = new Date(d); d = before
    }
    return n
  }

  // --- export / import ---
  exportJSON() { return JSON.stringify(this.state, null, 2) }
  importJSON(text) {
    const obj = JSON.parse(text)
    if (!obj || obj.v !== 1 || typeof obj.days !== 'object') throw new Error('Not a Chess Learn progress file')
    this.state = Object.assign(empty(), obj)
    this._save()
  }
  reset() { this.state = empty(); this._save() }
}

function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(empty(), JSON.parse(raw)) } catch (_) {} ; return empty() }
export function dayKey(d) { const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${dd}` }
export function today() { return dayKey(new Date()) }
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

export const progress = new Progress()
