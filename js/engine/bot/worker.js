// Web Worker entry: UCI over postMessage. Load with new Worker(url, { type: 'module' }).
import { BotUci } from './uci.js'
const uci = new BotUci(line => postMessage(line))
onmessage = e => uci.handle(String(e.data))
