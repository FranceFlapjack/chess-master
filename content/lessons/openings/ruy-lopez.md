---
id: openings/ruy-lopez
track: Openings
title: The Ruy Lopez, an introduction
lede: 1.e4 e5 2.Nf3 Nc6 3.Bb5. Five hundred years old and still the main weapon at the top. Slow pressure on e5, then everything.
level: 2
sources:
  - Wikibooks, Chess Opening Theory, Ruy Lopez (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._e4/1...e5/2._Nf3/2...Nc6/3._Bb5
  - The Noah's Ark trap is standard theory; positions checked with Stockfish 18.
---

## The idea

The bishop on b5 attacks the knight that defends e5. White does not need to take on c6: the threat, renewed every move, is what matters. Black defends with …a6, …b5 and …d6 and gets a solid position; White gets space and a long-term initiative. Players call it the Spanish torture.

```board
fen: r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b - - 0 9
arrows: b1d2, d2f1:alt, f1g3:alt, d2d4:alt
highlight: d4, a5
caption: The Closed Ruy Lopez after 9.h3. White's plan is the same knight tour as the Italian and the d4 break. Black usually plays 9…Na5 to hit the bishop, then …c5.
```

**Why 9.h3?** It stops …Bg4, which would pin the knight just as White prepares d4. **Black's Chigorin plan.** …Na5, …c5, …Qc7: attack the bishop, gain queenside space, and wait for the d4 break to over-extend.

## Play it

<p class="puzzle-intro">1 · Play the Closed Ruy Lopez as White to move nine.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
solution: e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3
hint: e4, Nf3, Bb5, Ba4, castle, Re1, Bb3, c3, h3. The bishop retreats, never trades, until Black forces it.
prompt: White to play. Reach the position above.
success: Every move kept the pressure on e5 and prepared d4. That is the Ruy Lopez in nine moves.
```

<p class="puzzle-intro">2 · Noah's Ark. White took the centre pawn with the queen too early: 5.d4 b5 6.Bb3 Nxd4 7.Nxd4 exd4 8.Qxd4?. You are Black.</p>

```try
fen: r1bqkbnr/2p2ppp/p2p4/1p6/3QP3/1B6/PPP2PPP/RNB1K2R b KQkq - 0 8
solution: c5 Qd5 Be6 Qc6+ Bd7 Qd5 c4
hint: Push the c-pawn twice. The queen has to keep running, and the bishop on b3 has no squares left.
prompt: Black to play. Trap the bishop.
success: The pawns on a6, b5 and c4 form the ark, and the bishop is lost. A famous trap that catches strong players in blitz.
```

<p class="puzzle-intro">3 · Why White does not simply take on c6 and grab e5: 6.Bxc6 dxc6 7.Nxe5?. You are Black.</p>

```try
fen: r1bqk2r/1pp1bppp/p1p2n2/4N3/4P3/8/PPPP1PPP/RNBQ1RK1 b kq - 0 7
solution: Qd4 Nf3 Qxe4
hint: One queen move attacks the knight on e5 and the pawn on e4 at once.
prompt: Black to play. Win the pawn back with interest.
success: The pawn on e5 was never really loose. Black has the two bishops and an open position; White gained nothing.
```

## Remember

- Bb5 attacks the defender of e5. Retreat the bishop along a4 and b3; do not trade it for nothing.
- Castle, Re1, c3, h3, then d4. Same knight tour as the Italian.
- The e5 pawn is poisoned as long as …Qd4 regains it. Do not grab it early.
