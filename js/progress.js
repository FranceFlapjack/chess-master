// Local progress store: lessons done, exercises solved, games stepped through, moves played per day (the
// activity grid). Everything lives in one localStorage key.

const KEY = 'chess-master.progress.v1'
/** Earlier builds stored under a different prefix: adopt any key with the same suffix once, then remove it. */
export function adoptOldKey(key) {
  try {
    if (localStorage.getItem(key) != null) return
    const suffix = key.slice(key.indexOf('.'))
    for (const k of Object.keys(localStorage)) if (k !== key && k.endsWith(suffix)) { localStorage.setItem(key, localStorage.getItem(k)); localStorage.removeItem(k); return }
  } catch (_) {}
}
const empty = () => ({ v: 1, lessons: {}, tries: {}, games: {}, moves: {}, beginner: false, lastLesson: null })

class Progress {
  constructor() {
    this.state = load()
    this.listeners = new Set()
    // another tab saved: take its state, or this tab's next save would overwrite what it recorded
    addEventListener('storage', e => { if (e.key === KEY && e.newValue) { this.state = Object.assign(empty(), JSON.parse(e.newValue)); this.listeners.forEach(fn => fn(this.state)) } })
  }
  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) }
  _save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)) } catch (_) {} ; this.listeners.forEach(fn => fn(this.state)) }

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
    this._save()
    return true
  }
  setLastLesson(id) { if (this.state.lastLesson !== id) { this.state.lastLesson = id; this._save() } }

  // --- exercises ---
  isTryDone(id) { return !!this.state.tries[id] }
  triesFor(lessonId) { return Object.keys(this.state.tries).filter(k => k.startsWith(lessonId + '#')).length }
  recordTry(id, firstAttempt) {
    if (this.state.tries[id]) return false
    this.state.tries[id] = { solved: Date.now(), first: !!firstAttempt }
    this._save()
    return true
  }
  recordGame(id) {
    if (this.state.games[id]) return false
    this.state.games[id] = { done: Date.now() }
    this._save()
    return true
  }

  // --- settings ---
  get beginner() { return !!this.state.beginner }
  set beginner(v) { this.state.beginner = !!v; this._save() }
}

function load() {
  try {
    adoptOldKey(KEY)
    const raw = localStorage.getItem(KEY)
    if (raw) return Object.assign(empty(), JSON.parse(raw))
  } catch (_) {}
  return empty()
}
export function dayKey(d) { const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${dd}` }
export function today() { return dayKey(new Date()) }
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

export const progress = new Progress()
