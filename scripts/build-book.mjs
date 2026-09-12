#!/usr/bin/env node
// Builds js/engine/bot/book.js from curated opening lines (mainstream theory, as in Wikibooks "Chess Opening Theory").
// Each line is SAN; the same position reached by several lines accumulates weight.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from '../vendor/chess.js/chess.js'

const LINES = [
  // Open games
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O',
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d6 9.h3',
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6',
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8',
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5',
  '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Re1 a6 8.Bb3 Ba7',
  '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5',
  '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Bc5 5.c3 d6 6.O-O O-O 7.Re1 a6',
  '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 6.Bb5+ c6 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4',
  '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4 Ne5 8.Be2',
  '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6',
  '1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Nc6 7.O-O Be7 8.c4 Nb4',
  '1.e4 e5 2.Nf3 Nf6 3.d4 Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7 7.O-O Bd6',
  '1.e4 e5 2.Nc3 Nf6 3.Bc4 Nc6 4.d3 Bc5 5.f4 d6 6.Nf3 O-O',
  '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O 6.d3 d6 7.Bg5 Bxc3 8.bxc3 Qe7',
  '1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Be7 6.Be2 O-O 7.O-O c6',
  // Sicilian
  '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O',
  '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6',
  '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4 Bd7',
  '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Nd5 Be7',
  '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 d6 9.f3 Bd7',
  '1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nc3 Qc7 6.Be3 a6 7.Qd2 Nf6 8.O-O-O Bb4',
  '1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Bd3 Nf6 6.O-O Qc7 7.Qe2 d6 8.c4 g6',
  '1.e4 c5 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Qxd7 5.O-O Nc6 6.c3 Nf6 7.Re1 e6 8.d4 d5',
  '1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.O-O Bg7 5.Re1 Nf6 6.c3 O-O 7.d4 cxd4 8.cxd4 d5',
  '1.e4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.f4 e6 7.Nf3 Nge7 8.O-O O-O',
  '1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6 7.Bc4 Nb6 8.Bb5 dxe5 9.Nxe5 Bd7',
  '1.e4 c5 2.c3 d5 3.exd5 Qxd5 4.d4 Nf6 5.Nf3 Bg4 6.Be2 e6 7.h3 Bh5 8.O-O Nc6',
  // French, Caro-Kann, Pirc, Scandinavian, Alekhine
  '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7 7.Qg4 Qc7 8.Qxg7 Rg8 9.Qxh7 cxd4',
  '1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7 7.f4 O-O 8.Nf3 c5',
  '1.e4 e6 2.d4 d5 3.Nd2 c5 4.exd5 exd5 5.Ngf3 Nc6 6.Bb5 Bd6 7.O-O Nge7 8.dxc5 Bxc5',
  '1.e4 e6 2.d4 d5 3.Nd2 Nf6 4.e5 Nfd7 5.Bd3 c5 6.c3 Nc6 7.Ne2 cxd4 8.cxd4 f6',
  '1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2 Na5 8.Be2 Bd7',
  '1.e4 e6 2.d4 d5 3.exd5 exd5 4.Nf3 Nf6 5.Bd3 Bd6 6.O-O O-O 7.Bg5 Bg4 8.Nbd2 Nbd7',
  '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3',
  '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Nxf6+ exf6 6.Bc4 Bd6 7.Qe2+ Be7 8.Nf3 O-O',
  '1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7 7.Nbd2 h6 8.c4',
  '1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nc3 e6 5.g4 Bg6 6.Nge2 c5 7.h4 h6 8.Be3 Nc6',
  '1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Qd7 8.Nd2 e6',
  '1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2 Nc6',
  '1.e4 c6 2.Nc3 d5 3.Nf3 Bg4 4.h3 Bxf3 5.Qxf3 e6 6.d4 Nf6 7.Bd3 dxe4 8.Nxe4 Nxe4',
  '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c6 7.a4 Nbd7 8.h3 e5',
  '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.O-O Bg4 8.Be3',
  '1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6 8.Qe2 Bb4',
  '1.e4 d5 2.exd5 Nf6 3.d4 Nxd5 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.c4 Nb6 8.Nc3 O-O',
  '1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.c4 Nb6 8.Nc3 O-O 9.Be3',
  // Queen's pawn
  '1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4 9.Bxc4 Nd5',
  '1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 c6 6.e3 Bf5 7.Qf3 Bg6 8.Bxf6 Qxf6 9.Qxf6 gxf6',
  '1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.Nc3 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Bxc5 8.Qc2 Nc6 9.a3 Qa5',
  '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2 Bg6',
  '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.e3 Bf5 5.Nc3 e6 6.Nh4 Bg6 7.Nxg6 hxg6 8.Bd3 Nbd7',
  '1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 Bb7 9.O-O a6',
  '1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.Qe2 b5 8.Bb3 Bb7 9.Rd1 Nbd7',
  '1.d4 d5 2.c4 dxc4 3.e4 Nf6 4.e5 Nd5 5.Bxc4 Nb6 6.Bd3 Nc6 7.Be3 Be6 8.Nc3',
  '1.d4 d5 2.c4 e6 3.Nc3 c5 4.cxd5 exd5 5.Nf3 Nc6 6.g3 Nf6 7.Bg2 Be7 8.O-O O-O 9.Bg5 cxd4',
  '1.d4 d5 2.Nf3 Nf6 3.e3 e6 4.Bd3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.O-O O-O 8.dxc5 Bxc5 9.e4 Qc7',
  '1.d4 d5 2.Nf3 Nf6 3.Bf4 c5 4.e3 Nc6 5.Nbd2 e6 6.c3 Bd6 7.Bg3 O-O 8.Bd3 b6 9.Ne5',
  '1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O 8.Bd3 b6',
  '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4 10.Bxc4 Qc7',
  '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Bg5 Bb7 8.e3 d6 9.Ne2 Nbd7',
  '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Ba6 5.b3 Bb4+ 6.Bd2 Be7 7.Bg2 c6 8.Bc3 d5 9.Ne5 Nfd7',
  '1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Be7 5.Bg5 h6 6.Bh4 O-O 7.e3 Ne4 8.Bxe7 Qxe7 9.Rc1 c6',
  '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.Be3 f5',
  '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 e5 7.d5 Nh5 8.Qd2 f5 9.O-O-O Nd7',
  '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.h3 e5 7.d5 a5 8.Be3 Na6 9.Nd2 Nd7',
  '1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Nf3 c5 8.Rb1 O-O 9.Be2 cxd4 10.cxd4 Qa5+',
  '1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.g3 O-O 5.Bg2 d6 6.O-O Nbd7 7.Nc3 e5 8.e4 c6 9.h3 Qb6',
  '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.e4 g6 7.Nf3 Bg7 8.h3 O-O 9.Bd3 b5',
  '1.d4 Nf6 2.c4 c5 3.d5 b5 4.cxb5 a6 5.bxa6 g6 6.Nc3 Bxa6 7.e4 Bxf1 8.Kxf1 d6 9.Nf3 Bg7',
  '1.d4 Nf6 2.Nf3 e6 3.Bf4 c5 4.e3 b6 5.Nbd2 Bb7 6.h3 Be7 7.Bd3 O-O 8.O-O d6 9.c3',
  '1.d4 Nf6 2.Nf3 g6 3.Bf4 Bg7 4.e3 O-O 5.h3 d6 6.Be2 Nbd7 7.O-O c5 8.c3 b6',
  '1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.Nf3 Bg7 5.O-O O-O 6.c4 d6 7.Nc3 Qe8 8.d5 Na6 9.Rb1 Bd7',
  '1.d4 d6 2.e4 Nf6 3.Nc3 e5 4.Nf3 Nbd7 5.Bc4 Be7 6.O-O O-O 7.Re1 c6 8.a4 b6',
  // Flank openings
  '1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nb6 7.O-O Be7 8.d3 O-O 9.a3 Be6',
  '1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nf3 f5 7.O-O Nf6 8.Rb1 O-O 9.b4 h6',
  '1.c4 c5 2.Nf3 Nf6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nb4 6.Bc4 Nd3+ 7.Ke2 Nf4+ 8.Kf1 Ne6',
  '1.c4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6 6.g3 Qb6 7.Nb3 Ne5 8.e4 Bb4 9.Qe2 d6',
  '1.c4 Nf6 2.Nc3 e6 3.Nf3 d5 4.d4 Be7 5.Bg5 O-O 6.e3 h6 7.Bh4 b6 8.Be2 Bb7 9.Bxf6 Bxf6 10.cxd5 exd5',
  '1.c4 Nf6 2.Nc3 g6 3.g3 Bg7 4.Bg2 O-O 5.Nf3 d6 6.O-O e5 7.d3 Nc6 8.Rb1 a5 9.a3 h6',
  '1.Nf3 d5 2.g3 Nf6 3.Bg2 e6 4.O-O Be7 5.d3 O-O 6.Nbd2 c5 7.e4 Nc6 8.Re1 b5 9.e5 Nd7',
  '1.Nf3 Nf6 2.c4 e6 3.Nc3 d5 4.d4 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Bxc5 8.a3 Nc6 9.Qc2 Qa5',
  '1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.d4 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7',
  '1.Nf3 c5 2.c4 Nc6 3.Nc3 Nf6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nc7 7.O-O e5 8.d3 Be7 9.Nd2 Bd7',
  '1.b3 e5 2.Bb2 Nc6 3.e3 d5 4.Bb5 Bd6 5.f4 Qh4+ 6.g3 Qe7 7.Nf3 f6 8.Nc3 Be6',
]

const book = {}
let total = 0
for (const line of LINES) {
  const c = new Chess()
  const sans = line.replace(/\d+\./g, ' ').trim().split(/\s+/)
  for (const san of sans) {
    const key = c.fen().split(' ').slice(0, 3).join(' ')
    const m = c.move(san)
    if (!m) throw new Error(`illegal ${san} in: ${line}`)
    const uci = m.from + m.to + (m.promotion || '')
    book[key] ??= {}
    book[key][uci] = (book[key][uci] || 0) + 1
    total++
  }
}
const out = `// Generated by scripts/build-book.mjs — ${LINES.length} curated mainline openings, ${Object.keys(book).length} positions.\n// Lines follow mainstream theory (see Wikibooks "Chess Opening Theory", CC BY-SA). Do not edit by hand.\nexport const BOOK = ${JSON.stringify(book)}\n`
const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../js/engine/bot/book.js')
fs.writeFileSync(dest, out)
console.log(`book: ${LINES.length} lines, ${Object.keys(book).length} positions, ${total} moves → ${path.relative(process.cwd(), dest)}`)
