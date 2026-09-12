// Loads the vendored Stockfish WASM under Node and exposes a tiny UCI interface (send / waitFor).
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../vendor/stockfish')
const jsPath = path.join(dir, 'stockfish-18-lite-single.js'), wasmPath = path.join(dir, 'stockfish-18-lite-single.wasm')

export async function loadStockfish() {
  const INIT = require(jsPath)
  const listeners = new Set()
  const engine = {
    locateFile: p => p.includes('.wasm') ? wasmPath : jsPath,
    listener: line => { for (const fn of listeners) fn(String(line)) },
    print: line => { for (const fn of listeners) fn(String(line)) },
  }
  await INIT()(engine)
  while (engine._isReady && !engine._isReady()) await new Promise(r => setTimeout(r, 10))
  const api = {
    send: cmd => engine.ccall('command', null, ['string'], [cmd], { async: /^go\b/.test(cmd) }),
    waitFor: (pred, ms = 60000) => new Promise((res, rej) => {
      const t = setTimeout(() => { listeners.delete(fn); rej(new Error('stockfish timeout')) }, ms)
      const fn = l => { if (pred(l)) { clearTimeout(t); listeners.delete(fn); res(l) } }
      listeners.add(fn)
    }),
  }
  // output arrives synchronously inside ccall for non-search commands, so listen before sending
  const ok = api.waitFor(l => l === 'uciok'); api.send('uci'); await ok
  return api
}
