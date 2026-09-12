#!/usr/bin/env node
// Standalone UCI engine on stdin/stdout, so the bot can play in any chess GUI or match runner.
import readline from 'node:readline'
import { BotUci } from '../js/engine/bot/uci.js'
const uci = new BotUci(line => process.stdout.write(line + '\n'))
const rl = readline.createInterface({ input: process.stdin })
rl.on('line', l => { if (l.trim() === 'quit') process.exit(0); uci.handle(l) })
