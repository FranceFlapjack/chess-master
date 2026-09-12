// Stockfish 18 (lite, single-threaded WASM, GPL-3) as a UCI worker. ~7 MB, loaded on first use.
import { UciEngine } from './uci.js'

export const STOCKFISH_URL = new URL('../../vendor/stockfish/stockfish-18-lite-single.js', import.meta.url).href

let instance = null
export function stockfish() {
  if (!instance) instance = new UciEngine(STOCKFISH_URL, { name: 'stockfish' })
  return instance
}

/** Strength ladder. `elo: null` means full strength. Times are per move, in ms. */
export const LEVELS = [
  { id: 1, name: 'Beginner', elo: 1320, ms: 120 },
  { id: 2, name: 'Casual', elo: 1500, ms: 200 },
  { id: 3, name: 'Club', elo: 1800, ms: 300 },
  { id: 4, name: 'Strong club', elo: 2000, ms: 400 },
  { id: 5, name: 'Expert', elo: 2300, ms: 600 },
  { id: 6, name: 'Master', elo: 2600, ms: 800 },
  { id: 7, name: 'Boss', elo: null, ms: 1500 },
]
export function applyLevel(engine, level) {
  if (level.elo) { engine.setOption('UCI_LimitStrength', 'true'); engine.setOption('UCI_Elo', level.elo) }
  else engine.setOption('UCI_LimitStrength', 'false')
}
