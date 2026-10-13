// Tests for the pure logic: move grading, clock maths, reading PGNs into game records.
//   node scripts/test.mjs          (also run it as TZ=America/New_York node scripts/test.mjs)
import assert from 'node:assert/strict'
import { grade, toWhite, winChance } from '../js/analysis.js'
import { parseTimeControl, spentPerPly } from '../js/clocks.js'
import { fromPgn, bookMatch, monthAfter, family } from '../js/games-data.js'

// grading: the Lichess thresholds on the mover's fall in winning chances
const g = (cp0, cp1, mover = 'w') => grade({ cp: cp0, mate: null }, { cp: cp1, mate: null }, mover).label
assert.equal(g(0, -100), 'inaccuracy')
assert.equal(g(0, -150), 'mistake')
assert.equal(g(0, -300), 'blunder')
assert.equal(g(0, 300, 'b'), 'blunder')               // the same fall, seen from Black
assert.equal(g(800, 700), '')                        // still clearly winning: no mark
assert.equal(g(500, 0), 'blunder')                   // a winning position thrown away (a stalemate scores 0)
assert.deepEqual(toWhite({ cp: 50, mate: null }, 'b'), { cp: -50, mate: null })
assert.equal(winChance({ cp: null, mate: -3 }), -1)

// clocks: readings include the increment, so the time spent is the drop plus the increment
assert.deepEqual(parseTimeControl('300+3'), { base: 300, inc: 3, daily: false })
assert.equal(parseTimeControl('1/86400').daily, true)
assert.equal(parseTimeControl('-'), null)
assert.deepEqual(spentPerPly([300, 300, 290, 295], { base: 300, inc: 3 }), [3, 3, 13, 8])

// which side you played: by username, any case; neither name matching is flagged, not guessed silently
const pgn = '[Event "Rated blitz game"]\n[Site "https://lichess.org/abcd1234"]\n[White "someone"]\n[Black "Thibault"]\n[Result "0-1"]\n[TimeControl "300+3"]\n[Termination "Time forfeit"]\n\n1. e4 e5 2. Nf3 Nc6 0-1'
const me = fromPgn(pgn, 'lichess', { user: 'thibault' })
assert.equal(me.userColor, 'b')
assert.equal(me.unknownSide, false)
assert.equal(me.id, 'lichess.org/abcd1234')
assert.equal(me.rated, true)
assert.equal(me.lostOnTime, false)                   // Black won on time: the loss was White's
assert.equal(fromPgn(pgn, 'lichess', { user: 'someone' }).lostOnTime, true)
assert.equal(fromPgn(pgn, 'lichess', { user: 'nobody' }).unknownSide, true)

// the book line followed longest, four plies at least
const lines = [{ id: 1, moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'] }, { id: 2, moves: ['e4', 'c5'] }]
assert.equal(bookMatch(lines, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']).plies, 4)
assert.equal(bookMatch(lines, ['e4', 'e5', 'Nf3', 'Nf6']), null)
assert.equal(family('Sicilian Defense: Najdorf Variation'), 'Sicilian Defense')

// chess.com archives are UTC months, whatever the computer's time zone
const t = Date.UTC(2026, 8, 1, 1) / 1000             // 1 Sep 2026, 01:00 UTC — still August in New York
assert.equal(monthAfter('https://api.chess.com/pub/player/x/games/2026/09', t), false)
assert.equal(monthAfter('https://api.chess.com/pub/player/x/games/2026/10', t), true)

console.log('✓ all tests pass')
