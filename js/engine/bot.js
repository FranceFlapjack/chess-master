// The site's own engine as a UCI worker, same interface as Stockfish.
import { UciEngine } from './uci.js'
export const BOT_URL = new URL('./bot/worker.js', import.meta.url).href
let instance = null
export function bot() {
  if (!instance) instance = new UciEngine(BOT_URL, { name: 'bot', type: 'module' })
  return instance
}
