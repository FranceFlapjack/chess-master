---
id: openings/queens-gambit-declined
track: Openings
title: Queen's Gambit Declined
lede: 1.d4 d5 2.c4 e6. The classical answer to the queen's pawn, played by every world champion. Solid, and full of long-term plans rather than tricks.
level: 2
sources:
  - Wikibooks, Chess Opening Theory, Queen's Gambit Declined (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._d4/1...d5/2._c4/2...e6
  - Fischer – Spassky, World Championship 1972, game 6. Move list checked against the published record, https://chesstrapguide.com/learn/fischer-spassky-1972-game-6-pgn/
  - The Elephant Trap is standard theory; positions checked with Stockfish 18.
---

## The idea

Black keeps the pawn on d5 with …e6 and develops behind it. The problem child is the bishop on c8, locked behind the e6 pawn. Most of the theory is about freeing it: with …dxc4 and …c5, with …b6 and …Bb7 (the Tartakower), or with Capablanca's manoeuvre …dxc4 and …Nd5 to trade pieces.

```board
fen: r1bq1rk1/pp1nbppp/2p1p3/3n2B1/2BP4/2N1PN2/PP3PPP/2RQK2R w K - 1 10
arrows: d5c3:alt, e7g5:alt, c6c5:alt
highlight: c5, e5
caption: The Orthodox main line after 9…Nd5, Capablanca's freeing idea. Black offers to trade knights and bishops, then plays …e5 or …c5 to free the last bishop.
```

**White's plans.** The minority attack in the Exchange Variation (b4–b5 against c6), or e4 in the centre after preparing it. **Black's plans.** Trade two pairs of minor pieces, then break with …c5 or …e5.

## Play it

<p class="puzzle-intro">1 · The Orthodox line as Black, to Capablanca's freeing move.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1
solution: d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5
hint: d5, e6, Nf6, Be7, castle, Nbd7, c6, then take on c4 and jump the knight to d5.
prompt: Black to play. Reach the position above.
success: Black waited for the bishop to come to d3, then took on c4 so the bishop moved twice. Now …Nxc3 and …e5 free the position.
```

<p class="puzzle-intro">2 · The Elephant Trap. White grabbed a pawn: 4…Nbd7 5.cxd5 exd5 6.Nxd5??. You are Black.</p>

```try
fen: r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6
solution: Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8
tolerance: 80
hint: Take the knight even though the queen hangs. A bishop check regains the queen, and Black ends a piece up.
prompt: Black to play. Spring the trap.
success: The pinned knight was never pinned: the queen was bait. A piece for nothing on move nine.
```

<p class="puzzle-intro">3 · Fischer – Spassky 1972, game 6. Spassky has just played 37…Nf6, the last defender. You are Fischer.</p>

```try
fen: 4q2k/2r1r1p1/4Pn1p/p1p2R2/P2pQ2P/1P1B1R2/6P1/6K1 w - - 9 38
solution: Rxf6 gxf6 Rxf6
hint: The knight is the only piece holding the king. Give a rook for it and the second rook follows.
prompt: White to play. Break through.
success: Spassky resigned three moves later. The exchange sacrifice removed the last defender and the doubled rooks took over.
```

## Remember

- …d5 and …e6, then free the c8 bishop: …dxc4 and …c5, or …b6 and …Bb7, or …Nd5.
- Never take on d5 with a knight while Bg5 pins the f6 knight: the Elephant Trap is waiting.
- The QGD is about pawn breaks. Know yours (…c5, …e5) and White's (e4, b4–b5).

+++ Read more: Fischer – Spassky, game 6

```pgn
file: fischer-spassky-1972-g6.pgn
```

+++
