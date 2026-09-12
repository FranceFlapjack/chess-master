#!/usr/bin/env node
// Builds js/engine/bot/book.js from curated opening lines (mainstream theory, as in Wikibooks "Chess Opening Theory").
// Each line is SAN; the same position reached by several lines accumulates weight.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from '../vendor/chess.js/chess.js'

const LINES = [
  { family: "Open games", name: "Ruy Lopez, Closed Defence", note: "The main line of the Spanish. White keeps the bishop, castles and prepares d4; Black's \u2026b5 and \u2026d6 make a solid wall.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O" },
  { family: "Open games", name: "Ruy Lopez, Closed, 9.h3", note: "The same wall with 9.h3 stopping \u2026Bg4 before d4. The starting point of the Chigorin, Breyer and Zaitsev systems.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d6 9.h3" },
  { family: "Open games", name: "Ruy Lopez, Open Defence", note: "Black takes on e4 and fights for activity: a knight on e4 and free pieces against White's better structure.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6" },
  { family: "Open games", name: "Ruy Lopez, Berlin Defence", note: "The Berlin Wall: queens come off on move eight. Black's doubled pawns and bishop pair against White's healthy majority.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8" },
  { family: "Open games", name: "Ruy Lopez, Exchange Variation", note: "White gives the bishop pair for a better pawn structure and aims for an endgame where the kingside majority counts.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5" },
  { family: "Open games", name: "Italian Game, Giuoco Pianissimo", note: "The slow Italian: c3 and d3, castle, then the knight tour to g3 and the d4 break. The system taught in this course.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Re1 a6 8.Bb3 Ba7" },
  { family: "Open games", name: "Italian Game, Giuoco Piano, 5.d4", note: "The old main line: White builds the full centre at once and accepts a pin on b4. The position opens early.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5" },
  { family: "Open games", name: "Two Knights Defence, 4.d3", note: "Black plays \u2026Nf6 before \u2026Bc5 and White declines the sharp lines. It transposes to the slow Italian.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Bc5 5.c3 d6 6.O-O O-O 7.Re1 a6" },
  { family: "Open games", name: "Two Knights Defence, 4.Ng5", note: "The knight attacks f7 at once. Black gives a pawn with 5\u2026Na5 and gets active play against the offside bishop.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 6.Bb5+ c6 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4" },
  { family: "Open games", name: "Scotch Game, Classical 4\u2026Bc5", note: "White opens the centre on move three. Black hits the knight with bishop and queen; White answers with c3 and Bc4.", moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4 Ne5 8.Be2" },
  { family: "Open games", name: "Scotch Game, Mieses Variation", note: "Black takes on c6 with the b-pawn and after e5 the knight goes to d5. Unbalanced pawns for both sides.", moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6" },
  { family: "Open games", name: "Petrov Defence, Classical", note: "Black copies the knight move and, after 3\u2026d6 first, takes on e4 safely. Symmetrical and solid.", moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Nc6 7.O-O Be7 8.c4 Nb4" },
  { family: "Open games", name: "Petrov Defence, 3.d4", note: "White strikes in the centre instead of taking on e5. Pieces come off quickly; a common way to avoid the main Petrov.", moves: "1.e4 e5 2.Nf3 Nf6 3.d4 Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7 7.O-O Bd6" },
  { family: "Open games", name: "Vienna Game", note: "2.Nc3 keeps f4 in reserve. With Bc4 and d3 it is an Italian with a King's Gambit idea in the pocket.", moves: "1.e4 e5 2.Nc3 Nf6 3.Bc4 Nc6 4.d3 Bc5 5.f4 d6 6.Nf3 O-O" },
  { family: "Open games", name: "Four Knights, Spanish Variation", note: "All four knights out by move three. Black mirrors with \u2026Bb4 and a quiet, balanced game follows.", moves: "1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O 6.d3 d6 7.Bg5 Bxc3 8.bxc3 Qe7" },
  { family: "Open games", name: "Philidor Defence", note: "Black supports e5 with the d-pawn. Solid but passive; the bishop on f8 needs a plan.", moves: "1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Be7 6.Be2 O-O 7.O-O c6" },
  { family: "Sicilian", name: "Najdorf, English Attack", note: "Be3, f3 and Qd2, then castle long and push g4. The most feared setup against the Najdorf.", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O" },
  { family: "Sicilian", name: "Najdorf, 6.Be2", note: "The classical, positional treatment: castle short and play for d5 rather than a pawn storm.", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6" },
  { family: "Sicilian", name: "Dragon, Yugoslav Attack", note: "Opposite-side castling and a race: White pushes h4\u2013h5, Black storms the queenside. The sharpest opening in chess.", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4 Bd7" },
  { family: "Sicilian", name: "Sveshnikov", note: "Black accepts a hole on d5 and a backward d6 pawn for active pieces and the bishop pair.", moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Nd5 Be7" },
  { family: "Sicilian", name: "Accelerated Dragon", note: "The fianchetto without \u2026d6, so \u2026d5 can come in one move. White's best answer is the Maroczy bind with c4.", moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 d6 9.f3 Bd7" },
  { family: "Sicilian", name: "Taimanov", note: "Flexible: \u2026e6, \u2026Nc6 and \u2026Qc7, keeping every option open. White usually castles long.", moves: "1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nc3 Qc7 6.Be3 a6 7.Qd2 Nf6 8.O-O-O Bb4" },
  { family: "Sicilian", name: "Kan", note: "\u2026e6 and \u2026a6 with a small centre. White's most common reply is a Maroczy setup with c4.", moves: "1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Bd3 Nf6 6.O-O Qc7 7.Qe2 d6 8.c4 g6" },
  { family: "Sicilian", name: "Moscow Variation, 3.Bb5+", note: "The check trades bishops early and sidesteps open-Sicilian theory. Calm, with a small edge in space.", moves: "1.e4 c5 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Qxd7 5.O-O Nc6 6.c3 Nf6 7.Re1 e6 8.d4 d5" },
  { family: "Sicilian", name: "Rossolimo Variation", note: "3.Bb5 against \u2026Nc6. White may double Black's pawns or simply develop; a favourite at the top.", moves: "1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.O-O Bg7 5.Re1 Nf6 6.c3 O-O 7.d4 cxd4 8.cxd4 d5" },
  { family: "Sicilian", name: "Closed Sicilian", note: "White fianchettoes and plays f4: a kingside attack without opening the centre.", moves: "1.e4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.f4 e6 7.Nf3 Nge7 8.O-O O-O" },
  { family: "Sicilian", name: "Alapin, 2\u2026Nf6", note: "2.c3 prepares d4 with a pawn. Black's knight harasses e5 and the game resembles an Advance French.", moves: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6 7.Bc4 Nb6 8.Bb5 dxe5 9.Nxe5 Bd7" },
  { family: "Sicilian", name: "Alapin, 2\u2026d5", note: "Black takes the centre pawn and brings the queen out early; White gains tempi but Black's structure is sound.", moves: "1.e4 c5 2.c3 d5 3.exd5 Qxd5 4.d4 Nf6 5.Nf3 Bg4 6.Be2 e6 7.h3 Bh5 8.O-O Nc6" },
  { family: "French", name: "Winawer, Poisoned Pawn", note: "White takes on g7 with the queen; Black gets the centre and open lines. Wild and deeply analysed.", moves: "1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7 7.Qg4 Qc7 8.Qxg7 Rg8 9.Qxh7 cxd4" },
  { family: "French", name: "Classical, 4.Bg5", note: "Black keeps the bishop with \u2026Be7 and after e5 trades it on e7. A closed centre and long plans.", moves: "1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7 7.f4 O-O 8.Nf3 c5" },
  { family: "French", name: "Tarrasch, 3\u2026c5", note: "Black opens the position at once; an isolated d-pawn often results, with active pieces to compensate.", moves: "1.e4 e6 2.d4 d5 3.Nd2 c5 4.exd5 exd5 5.Ngf3 Nc6 6.Bb5 Bd6 7.O-O Nge7 8.dxc5 Bxc5" },
  { family: "French", name: "Tarrasch, 3\u2026Nf6", note: "The closed centre: White's e5 pawn against Black's \u2026c5 and \u2026f6 breaks.", moves: "1.e4 e6 2.d4 d5 3.Nd2 Nf6 4.e5 Nfd7 5.Bd3 c5 6.c3 Nc6 7.Ne2 cxd4 8.cxd4 f6" },
  { family: "French", name: "Advance Variation", note: "White fixes the pawn on e5 and defends d4. Black attacks it with \u2026c5, \u2026Nc6 and \u2026Qb6.", moves: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2 Na5 8.Be2 Bd7" },
  { family: "French", name: "Exchange Variation", note: "Symmetrical pawns give an open, easy game. Drawish only if both sides want it to be.", moves: "1.e4 e6 2.d4 d5 3.exd5 exd5 4.Nf3 Nf6 5.Bd3 Bd6 6.O-O O-O 7.Bg5 Bg4 8.Nbd2 Nbd7" },
  { family: "Caro-Kann", name: "Classical, 4\u2026Bf5", note: "The bishop escapes to f5, is chased with h4\u2013h5 and traded on d3. The reference line of this course.", moves: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3" },
  { family: "Caro-Kann", name: "Tartakower, 5\u2026exf6", note: "Black recaptures on f6 with the e-pawn, opening the f-file and keeping a compact structure.", moves: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Nxf6+ exf6 6.Bc4 Bd6 7.Qe2+ Be7 8.Nf3 O-O" },
  { family: "Caro-Kann", name: "Advance, Short System", note: "White develops calmly with Nf3 and Be2 and keeps the space from e5. Quiet and modern.", moves: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7 7.Nbd2 h6 8.c4" },
  { family: "Caro-Kann", name: "Advance, 4.Nc3 and g4", note: "White pushes g4 to harass the bishop. Sharp: both kings stay in the centre for a while.", moves: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nc3 e6 5.g4 Bg6 6.Nge2 c5 7.h4 h6 8.Be3 Nc6" },
  { family: "Caro-Kann", name: "Exchange Variation", note: "Symmetrical pawns; White's Bd3 and Bf4 aim at a slow kingside attack.", moves: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Qd7 8.Nd2 e6" },
  { family: "Caro-Kann", name: "Panov Attack", note: "c4 gives White an isolated d-pawn with open lines and activity. Nothing like the usual Caro-Kann.", moves: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2 Nc6" },
  { family: "Caro-Kann", name: "Two Knights Variation", note: "White develops both knights and delays d4. Black trades the bishop on f3 for a solid setup.", moves: "1.e4 c6 2.Nc3 d5 3.Nf3 Bg4 4.h3 Bxf3 5.Qxf3 e6 6.d4 Nf6 7.Bd3 dxe4 8.Nxe4 Nxe4" },
  { family: "Other replies to 1.e4", name: "Pirc Defence, Classical", note: "Black fianchettoes and waits. White builds a full centre and plays a4 and h3 to restrict counterplay.", moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c6 7.a4 Nbd7 8.h3 e5" },
  { family: "Other replies to 1.e4", name: "Pirc Defence, Austrian Attack", note: "f4 grabs space and prepares e5. Black must counter quickly in the centre.", moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.O-O Bg4 8.Be3" },
  { family: "Other replies to 1.e4", name: "Scandinavian, 3\u2026Qa5", note: "The queen comes out on move two and sits on a5. Easy to learn, solid, slightly passive.", moves: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6 8.Qe2 Bb4" },
  { family: "Other replies to 1.e4", name: "Scandinavian, 2\u2026Nf6", note: "Black delays recapturing and develops first. The knight on d5 and bishop on g4 give a comfortable game.", moves: "1.e4 d5 2.exd5 Nf6 3.d4 Nxd5 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.c4 Nb6 8.Nc3 O-O" },
  { family: "Other replies to 1.e4", name: "Alekhine's Defence, Modern", note: "Black invites e5 and hopes to attack the advanced pawns. 4.Nf3 keeps the centre under control.", moves: "1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.c4 Nb6 8.Nc3 O-O 9.Be3" },
  { family: "Queen's Gambit", name: "QGD Orthodox, Capablanca's manoeuvre", note: "Black waits for Bd3, takes on c4 and plays \u2026Nd5 to trade pieces and free the position.", moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4 9.Bxc4 Nd5" },
  { family: "Queen's Gambit", name: "QGD Exchange Variation", note: "White trades on d5 and attacks c6 with b4\u2013b5, the minority attack. Black aims for \u2026Ne4 and a kingside attack.", moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 c6 6.e3 Bf5 7.Qf3 Bg6 8.Bxf6 Qxf6 9.Qxf6 gxf6" },
  { family: "Queen's Gambit", name: "QGD, Harrwitz Attack 5.Bf4", note: "The bishop goes to f4 and Black frees the position with \u2026c5 at once.", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.Nc3 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Bxc5 8.Qc2 Nc6 9.a3 Qa5" },
  { family: "Queen's Gambit", name: "Slav Defence, main line", note: "\u2026c6 keeps the bishop free; after \u2026dxc4 and 5.a4 Bf5 Black develops it before \u2026e6.", moves: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2 Bg6" },
  { family: "Queen's Gambit", name: "Slav, 4.e3 Bf5", note: "White avoids the main theory and later trades the bishop with Nh4.", moves: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.e3 Bf5 5.Nc3 e6 6.Nh4 Bg6 7.Nxg6 hxg6 8.Bd3 Nbd7" },
  { family: "Queen's Gambit", name: "Semi-Slav, Meran", note: "Black takes on c4 and pushes \u2026b5. A dynamic queenside majority against White's centre.", moves: "1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 Bb7 9.O-O a6" },
  { family: "Queen's Gambit", name: "Queen's Gambit Accepted, Classical", note: "Black takes the pawn, gives it back, and plays \u2026c5 for a free game.", moves: "1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.Qe2 b5 8.Bb3 Bb7 9.Rd1 Nbd7" },
  { family: "Queen's Gambit", name: "Queen's Gambit Accepted, 3.e4", note: "White takes the whole centre; Black hits it with \u2026Nf6 and \u2026e5 or \u2026c5.", moves: "1.d4 d5 2.c4 dxc4 3.e4 Nf6 4.e5 Nd5 5.Bxc4 Nb6 6.Bd3 Nc6 7.Be3 Be6 8.Nc3" },
  { family: "Queen's Gambit", name: "Tarrasch Defence", note: "Black accepts an isolated d-pawn for active pieces. White fianchettoes to press it.", moves: "1.d4 d5 2.c4 e6 3.Nc3 c5 4.cxd5 exd5 5.Nf3 Nc6 6.g3 Nf6 7.Bg2 Be7 8.O-O O-O 9.Bg5 cxd4" },
  { family: "Queen's pawn systems", name: "Colle System", note: "d4, e3, Bd3, c3 and Nbd2, then e4. A quiet setup with a Greek gift waiting on h7.", moves: "1.d4 d5 2.Nf3 Nf6 3.e3 e6 4.Bd3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.O-O O-O 8.dxc5 Bxc5 9.e4 Qc7" },
  { family: "Queen's pawn systems", name: "London System, 2.Nf3 and 3.Bf4", note: "The London with Nf3 first, avoiding early \u2026c5 tricks.", moves: "1.d4 d5 2.Nf3 Nf6 3.Bf4 c5 4.e3 Nc6 5.Nbd2 e6 6.c3 Bd6 7.Bg3 O-O 8.Bd3 b6 9.Ne5" },
  { family: "Queen's pawn systems", name: "London System, 2.Bf4", note: "The direct London. Same pyramid, bishop outside it first. The system taught in this course.", moves: "1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O 8.Bd3 b6" },
  { family: "Indian defences", name: "Nimzo-Indian, Rubinstein 4.e3", note: "4.e3 keeps everything flexible. Black pins the knight and plays \u2026d5 and \u2026c5.", moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4 10.Bxc4 Qc7" },
  { family: "Indian defences", name: "Nimzo-Indian, Classical 4.Qc2", note: "White avoids doubled pawns; Black takes on c3 and plays \u2026b6, \u2026Bb7 and \u2026d6.", moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Bg5 Bb7 8.e3 d6 9.Ne2 Nbd7" },
  { family: "Indian defences", name: "Queen's Indian, 4.g3 Ba6", note: "The bishop attacks c4 from a6 instead of b7, making White defend the pawn awkwardly.", moves: "1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Ba6 5.b3 Bb4+ 6.Bd2 Be7 7.Bg2 c6 8.Bc3 d5 9.Ne5 Nfd7" },
  { family: "Queen's Gambit", name: "QGD, Lasker Defence", note: "\u2026h6, \u2026Ne4 and trades on e4 and e7. Simplifies early; a favourite equaliser.", moves: "1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Be7 5.Bg5 h6 6.Bh4 O-O 7.e3 Ne4 8.Bxe7 Qxe7 9.Rc1 c6" },
  { family: "Indian defences", name: "King's Indian, Mar del Plata", note: "The classic race: Black's \u2026f5 pawn storm against White's c5 and b4 on the other wing.", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.Be3 f5" },
  { family: "Indian defences", name: "King's Indian, S\u00e4misch", note: "f3 supports e4 and prepares Be3, Qd2 and castling long. Black counters with \u2026e5 and \u2026Nh5.", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 e5 7.d5 Nh5 8.Qd2 f5 9.O-O-O Nd7" },
  { family: "Indian defences", name: "King's Indian, Makogonov 6.h3", note: "6.h3 keeps \u2026Bg4 out and prepares g4. A modern, slow-burning treatment.", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.h3 e5 7.d5 a5 8.Be3 Na6 9.Nd2 Nd7" },
  { family: "Indian defences", name: "Gr\u00fcnfeld, Exchange Variation", note: "Black gives up the centre and attacks it with \u2026c5 and the g7 bishop. White's big centre against Black's pieces.", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Nf3 c5 8.Rb1 O-O 9.Be2 cxd4 10.cxd4 Qa5+" },
  { family: "Indian defences", name: "King's Indian, Fianchetto", note: "White mirrors the fianchetto. Slower and safer; the fight is about the e5 and c5 breaks.", moves: "1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.g3 O-O 5.Bg2 d6 6.O-O Nbd7 7.Nc3 e5 8.e4 c6 9.h3 Qb6" },
  { family: "Indian defences", name: "Modern Benoni", note: "Black gets a queenside majority and the long diagonal; White gets the centre and e5 ideas.", moves: "1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.e4 g6 7.Nf3 Bg7 8.h3 O-O 9.Bd3 b5" },
  { family: "Indian defences", name: "Benko Gambit", note: "A pawn for two open files on the queenside and lasting pressure that survives into the endgame.", moves: "1.d4 Nf6 2.c4 c5 3.d5 b5 4.cxb5 a6 5.bxa6 g6 6.Nc3 Bxa6 7.e4 Bxf1 8.Kxf1 d6 9.Nf3 Bg7" },
  { family: "Queen's pawn systems", name: "London vs the Queen's Indian setup", note: "The London against \u2026e6 and \u2026b6: Bd3, castle, then the e4 break or a knight to e5.", moves: "1.d4 Nf6 2.Nf3 e6 3.Bf4 c5 4.e3 b6 5.Nbd2 Bb7 6.h3 Be7 7.Bd3 O-O 8.O-O d6 9.c3" },
  { family: "Queen's pawn systems", name: "London vs the King's Indian setup", note: "The London against \u2026g6: h3 keeps the bishop safe, Be2 and castling, then c3 and Ne5.", moves: "1.d4 Nf6 2.Nf3 g6 3.Bf4 Bg7 4.e3 O-O 5.h3 d6 6.Be2 Nbd7 7.O-O c5 8.c3 b6" },
  { family: "Other replies to 1.d4", name: "Dutch Defence, Leningrad", note: "\u2026f5 with a fianchetto: Black wants \u2026e5 and a kingside attack. White plays d5 and Rb1\u2013b4.", moves: "1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.Nf3 Bg7 5.O-O O-O 6.c4 d6 7.Nc3 Qe8 8.d5 Na6 9.Rb1 Bd7" },
  { family: "Other replies to 1.d4", name: "Philidor, Hanham setup", note: "A modern move order into the Philidor: solid, with \u2026e5 held by \u2026Nbd7 and \u2026c6.", moves: "1.d4 d6 2.e4 Nf6 3.Nc3 e5 4.Nf3 Nbd7 5.Bc4 Be7 6.O-O O-O 7.Re1 c6 8.a4 b6" },
  { family: "Flank openings", name: "English, Reversed Dragon", note: "1.c4 e5 with g3: a Sicilian Dragon with colours reversed and an extra tempo.", moves: "1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nb6 7.O-O Be7 8.d3 O-O 9.a3 Be6" },
  { family: "Flank openings", name: "English, Botvinnik setup", note: "c4, g3, e4 and d3 against \u2026Nc6 and \u2026g6. A closed, manoeuvring game.", moves: "1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nf3 f5 7.O-O Nf6 8.Rb1 O-O 9.b4 h6" },
  { family: "Flank openings", name: "English, Symmetrical, 3\u2026d5", note: "The \u2026d5 break; after e4 the knight goes to b4 and play on the c-file begins.", moves: "1.c4 c5 2.Nf3 Nf6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nb4 6.Bc4 Nd3+ 7.Ke2 Nf4+ 8.Kf1 Ne6" },
  { family: "Flank openings", name: "English, Symmetrical, 3.d4", note: "Transposes toward Sicilian structures with c4 already in: a Maroczy-like bind for White.", moves: "1.c4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6 6.g3 Qb6 7.Nb3 Ne5 8.e4 Bb4 9.Qe2 d6" },
  { family: "Queen's Gambit", name: "QGD Tartakower (via 1.c4)", note: "Fischer\u2013Spassky, game 6. \u2026b6 and \u2026Bb7 solve the bishop problem; White trades on d5 and presses.", moves: "1.c4 Nf6 2.Nc3 e6 3.Nf3 d5 4.d4 Be7 5.Bg5 O-O 6.e3 h6 7.Bh4 b6 8.Be2 Bb7 9.Bxf6 Bxf6 10.cxd5 exd5" },
  { family: "Flank openings", name: "English vs the King's Indian setup", note: "Both sides fianchetto; White holds back d4 and plays on the queenside with b4.", moves: "1.c4 Nf6 2.Nc3 g6 3.g3 Bg7 4.Bg2 O-O 5.Nf3 d6 6.O-O e5 7.d3 Nc6 8.Rb1 a5 9.a3 h6" },
  { family: "Flank openings", name: "King's Indian Attack", note: "White plays the King's Indian with an extra tempo: Nf3, g3, Bg2, d3, e4 and a kingside attack.", moves: "1.Nf3 d5 2.g3 Nf6 3.Bg2 e6 4.O-O Be7 5.d3 O-O 6.Nbd2 c5 7.e4 Nc6 8.Re1 b5 9.e5 Nd7" },
  { family: "Queen's Gambit", name: "QGD, Harrwitz Attack (via 1.Nf3)", note: "The 5.Bf4 line reached through 1.Nf3. Same plans as the direct move order.", moves: "1.Nf3 Nf6 2.c4 e6 3.Nc3 d5 4.d4 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Bxc5 8.a3 Nc6 9.Qc2 Qa5" },
  { family: "Indian defences", name: "King's Indian, Mar del Plata (via 1.Nf3)", note: "The same Mar del Plata race reached through 1.Nf3 Nf6 2.c4 g6.", moves: "1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.d4 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7" },
  { family: "Flank openings", name: "English, Symmetrical, Rubinstein", note: "\u2026d5 and \u2026Nc7 aiming for \u2026e5: Black takes the centre in the symmetrical English.", moves: "1.Nf3 c5 2.c4 Nc6 3.Nc3 Nf6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nc7 7.O-O e5 8.d3 Be7 9.Nd2 Bd7" },
  { family: "Flank openings", name: "Nimzo-Larsen Attack", note: "1.b3 puts the bishop on the long diagonal first. Unusual, sound, and good for surprise.", moves: "1.b3 e5 2.Bb2 Nc6 3.e3 d5 4.Bb5 Bd6 5.f4 Qh4+ 6.g3 Qe7 7.Nf3 f6 8.Nc3 Be6" },
]

const book = {}
let total = 0
const catalogue = []
for (const [idx, L] of LINES.entries()) {
  const line = L.moves
  const c = new Chess()
  const sans = line.replace(/\d+\./g, ' ').trim().split(/\s+/)
  catalogue.push({ id: idx + 1, family: L.family, name: L.name, note: L.note, moves: sans })
  for (const san of sans) {
    const key = c.fen().split(' ').slice(0, 3).join(' ')
    const m = c.move(san)
    if (!m) throw new Error(`illegal ${san} in: ${L.name}`)
    const uci = m.from + m.to + (m.promotion || '')
    book[key] ??= {}
    book[key][uci] = (book[key][uci] || 0) + 1
    total++
  }
}
const out = `// Generated by scripts/build-book.mjs — ${LINES.length} curated mainline openings, ${Object.keys(book).length} positions.\n// Lines follow mainstream theory (see Wikibooks "Chess Opening Theory", CC BY-SA). Do not edit by hand.\nexport const BOOK = ${JSON.stringify(book)}\n`
const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../js/engine/bot/book.js')
fs.writeFileSync(dest, out)
const cat = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/openings/lines.json')
fs.mkdirSync(path.dirname(cat), { recursive: true })
fs.writeFileSync(cat, JSON.stringify(catalogue, null, 1))
console.log(`book: ${LINES.length} lines, ${Object.keys(book).length} positions, ${total} moves → ${path.relative(process.cwd(), dest)}`)
