// The clock half of a game record. Both chess.com and Lichess put the reading after every move into
// the PGN as a {[%clk h:mm:ss]} comment (Lichess only when the export asks for it), so how you spend
// your time is already in the games we download — no extra request, no engine.
//
// Everything here is pure: the page passes game records in and renders what comes back.

/** Clock readings per ply, in seconds; null when the PGN carries none. */
export function clocksFrom(pgn) {
  const out = []
  const re = /\[%clk\s+(\d+):(\d+):(\d+(?:\.\d+)?)\]/g
  let m
  while ((m = re.exec(pgn))) out.push(+m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]))
  return out.length ? out : null
}

/** "180" → 3 minutes; "300+3" → 5 minutes with a 3 s increment; "1/86400" → a daily game. */
export function parseTimeControl(tc) {
  if (!tc || tc === '-') return null
  const daily = /^1\/(\d+)$/.exec(tc)
  if (daily) return { base: +daily[1], inc: 0, daily: true }
  const [b, i] = String(tc).split('+')
  const base = Number(b)
  if (!isFinite(base) || base <= 0) return null
  return { base, inc: Number(i) || 0, daily: false }
}

/** Seconds the mover spent on ply i: their clock two plies ago, less the reading now, plus the increment. */
export function spentPerPly(clocks, { base, inc }) {
  return clocks.map((c, i) => Math.max(0, Math.round(((i >= 2 ? clocks[i - 2] : base) - c + inc) * 10) / 10))
}

const header = (pgn, name) => (pgn.match(new RegExp(`\\[${name} "([^"]*)"\\]`)) || [])[1] || ''
/** The time control, from the record or — for games stored before the field existed — from the PGN itself. */
export const timeControlOf = g => g.tc || header(g.pgn, 'TimeControl')
/** Did we lose this one on the clock? Records made before the field existed still have the headers. */
export function lostOnTimeOf(g) {
  if (g.lostOnTime !== undefined) return g.lostOnTime
  const result = header(g.pgn, 'Result'), term = header(g.pgn, 'Termination')
  const lost = result && result !== '*' && result !== '1/2-1/2' && (result === '1-0') !== (g.userColor === 'w')
  return !!lost && /time forfeit|on time|timeout/i.test(term)
}

/** One game seen through the clock, or null when it has none (daily games are left out: thinking time there is meaningless). */
export function gameClock(g, sans) {
  const clocks = clocksFrom(g.pgn)
  if (!clocks || !sans) return null
  const tc = parseTimeControl(timeControlOf(g))
  if (!tc || tc.daily) return null
  const spent = spentPerPly(clocks, tc)
  const moves = []
  for (let i = 0; i < Math.min(spent.length, sans.length); i++) {
    if ((i % 2 === 0 ? 'w' : 'b') !== g.userColor) continue
    moves.push({ ply: i + 1, no: Math.ceil((i + 1) / 2), san: sans[i], spent: spent[i], left: clocks[i] })
  }
  if (!moves.length) return null
  return { id: g.id, base: tc.base, inc: tc.inc, moves, endLeft: moves[moves.length - 1].left }
}

const PHASES = [['Moves 1–10', 1, 10], ['Moves 11–25', 11, 25], ['Moves 26 on', 26, Infinity]]
const avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null

/**
 * What the clocks say across a set of games. `list` is [{ clock, result, lostOnTime, label }].
 * Returns null when no game in the set carries a clock.
 */
export function clockReport(list) {
  const games = list.filter(x => x.clock)
  if (!games.length) return null
  const every = games.flatMap(x => x.clock.moves)
  const phase = PHASES.map(([name, from, to]) => ({
    name, seconds: avg(games.flatMap(x => x.clock.moves.filter(m => m.no >= from && m.no <= to).map(m => m.spent))),
  })).filter(p => p.seconds != null)
  // how much of the clock is gone by move 15, in the games you won and in the games you lost
  const usedBy15 = x => {
    const m = [...x.clock.moves].reverse().find(m => m.no <= 15)
    return m ? Math.min(1, (x.clock.base - m.left + m.no * x.clock.inc) / x.clock.base) : null
  }
  const share = res => avg(games.filter(x => x.result === res).map(usedBy15).filter(v => v != null))
  const slowest = every.slice().sort((a, b) => b.spent - a.spent).slice(0, 5).map(m => {
    const owner = games.find(x => x.clock.moves.includes(m))
    return Object.assign({}, m, { id: owner.clock.id, label: owner.label })
  })
  return {
    games: games.length,
    perMove: avg(every.map(m => m.spent)),
    longest: every.length ? Math.max(...every.map(m => m.spent)) : 0,
    phase,
    wonBy15: share('win'), lostBy15: share('loss'),
    endLeft: avg(games.map(x => Math.min(1, x.clock.endLeft / x.clock.base))),
    timeLosses: games.filter(x => x.lostOnTime).length,
    slowest,
  }
}

/**
 * Mistakes you made while short of time. Only games judged from first move to last count: a game the
 * opening scan judged covers the first eight moves, where nobody is ever short of time, and counting
 * those would say "time pressure is not your problem" whatever the truth is.
 */
export function hurriedMistakes(list, under = 30) {
  let hurried = 0, total = 0, games = 0
  for (const x of list) {
    if (!x.clock || !x.grades || !x.full) continue
    games++
    for (const m of x.clock.moves) {
      const g = x.grades[m.ply]
      if (!g || !g.label || g.label === 'inaccuracy') continue
      total++
      if (m.left < under) hurried++
    }
  }
  return total ? { hurried, total, under, games } : null
}

export function mmss(s) {
  if (s == null) return ''
  if (s < 60) return `${Math.round(s * 10) / 10}s`
  const m = Math.floor(s / 60)
  return `${m}m ${String(Math.round(s % 60)).padStart(2, '0')}s`
}
