---
id: openings/italian-game
track: Openings
title: The Italian Game
lede: 1.e4 e5 2.Nf3 Nc6 3.Bc4. The bishop looks at f7, both sides develop naturally, and the plans are easy to remember. The best first opening for White.
level: 1
sources:
  - Wikibooks, Chess Opening Theory, Italian Game (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._e4/1...e5/2._Nf3/2...Nc6/3._Bc4
  - Anderssen – Dufresne, Berlin 1852 ("the Evergreen Game"), an Evans Gambit. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Evergreen_Game
  - The Blackburne Shilling Gambit trap and the Fried Liver Attack are standard theory; positions checked with Stockfish 18.
---

## The idea

White puts the bishop on its best diagonal, then builds a small centre with c3 and d3 and castles. Nothing is forced, so you get a playable middlegame every time. The plans are the same in every game.

```board
fen: r1bq1rk1/bpp2ppp/p1np1n2/4p3/4P3/1BPP1N2/PP3PPP/RNBQR1K1 w - - 2 9
arrows: b1d2, d2f1:alt, f1g3:alt, d3d4:alt
highlight: d4, f5
caption: The main line after 8…Ba7. White's plan: Nbd2–f1–g3, h3, and eventually d4. The knight on g3 eyes f5, and the bishop on b3 keeps pointing at f7.
```

**White's plans.** The knight tour Nb1–d2–f1–g3. The pawn break d3–d4 once everything is ready. Keep the bishop with Bb3 when Black plays …Na5. **Black's plans.** …Ba7 to keep the bishop, …h6, …Re8, and the freeing break …d5 when White is slow.

## Play it

<p class="puzzle-intro">1 · Play the main line as White, move by move. Black's replies are played for you.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
solution: e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7
hint: e4, Nf3, Bc4, c3, d3, castle, Re1, Bb3.
prompt: White to play. Reach the main-line position from the board above.
success: That is the whole opening. From here it is plans, not memory: Nbd2, h3, Nf1–g3, and d4 when the time is right.
```

<p class="puzzle-intro">2 · The Blackburne Shilling Gambit. Black played 3…Nd4?! and White grabbed the pawn with 4.Nxe5?. You are Black. Punish it.</p>

```try
fen: r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4
solution: Qg5 Nxf7 Qxg2 Rf1 Qxe4+ Be2 Nf3#
hint: Attack the knight and g2 with the queen at once. When White grabs f7, take g2, then e4 with check.
prompt: Black to play. Win by force.
success: A smothered-style mate with the knight after the queen has torn everything open. Greed on move four costs the game.
```

<p class="puzzle-intro">3 · The Fried Liver Attack. Black met 4.Ng5 with 4…d5 5.exd5 Nxd5?, the natural but wrong recapture. You are White.</p>

```try
type: line
tolerance: 60
fen: r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6
solution: Nxf7 Kxf7 Qf3+ Ke6 Nc3
hint: Give the knight on f7 to drag the king out, check with the queen, and bring the other knight against the pinned one on d5.
prompt: White to play. Start the Fried Liver.
success: The black king is on e6 on move seven and every white piece is coming. This is why Black should play 5…Na5, not 5…Nxd5.
```

## Remember

- Bc4, c3, d3, castle. Then the knight tour to g3 and the d4 break.
- The bishop on c4 aims at f7. Any time f7 is weak, look for Bxf7+ or Ng5.
- Against 3…Nf6, 4.Ng5 is sharp and good. Against 3…Nd4?!, do not take on e5.

+++ Read more: the Evergreen Game

The Evans Gambit is the Italian's wild cousin: 4.b4 gives a pawn for time. Anderssen's win over Dufresne in 1852 shows what that time buys when the defender falls behind in development.

```pgn
file: anderssen-dufresne-1852.pgn
```

+++
