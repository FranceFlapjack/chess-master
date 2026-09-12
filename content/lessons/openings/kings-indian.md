---
id: openings/kings-indian
track: Openings
title: King's Indian, an introduction
lede: 1.d4 Nf6 2.c4 g6. Black gives White the centre, then attacks it, and the king behind it, with pawns. The most exciting answer to 1.d4, and the most demanding.
level: 3
sources:
  - Wikibooks, Chess Opening Theory, King's Indian Defence (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._d4/1...Nf6/2._c4/2...g6/3._Nc3/3...Bg7/4._e4/4...d6
  - Byrne – Fischer, New York 1956 ("the Game of the Century"), a Grünfeld, the King's Indian's cousin. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/The_Game_of_the_Century_(chess)
  - Positions checked with Stockfish 18.
---

## The idea

Black fianchettoes the bishop, castles, and only then strikes at the centre with …e5. When White closes it with d5, the board splits: White attacks on the queenside with c5 and b4, Black attacks the king with …f5, …f4, …g5 and …g4. Whoever arrives first wins. It is not a quiet opening.

```board
fen: r1bq1rk1/pppnn1bp/3p2p1/3Ppp2/2P1P3/2N1B3/PP2BPPP/R2QNRK1 w - - 0 11
arrows: f5f4:alt, g6g5:alt, c4c5, b2b4
highlight: f4, c5
caption: The Mar del Plata after 10…f5. Black's plan: …f4, …g5, …g4, …Rf6–h6. White's plan: c5, Nd3, b4, cxd6 and Nb5. Both sides ignore the other.
```

**The one thing to know before playing it:** Black's attack takes ten moves to arrive. If you hesitate, White's queenside attack arrives first. Commit.

## Play it

<p class="puzzle-intro">1 · The Mar del Plata main line as Black.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1
solution: Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Be3 f5
hint: Nf6, g6, Bg7, d6, castle, e5, Nc6, Ne7, Nd7, f5.
prompt: Black to play. Reach the position above.
success: Ten moves, and the pawn storm has begun. From here it is …f4, …g5 and …g4, whatever White does on the other wing.
```

<p class="puzzle-intro">2 · A trick to know. White traded queens and took the e5 pawn: 7.dxe5 dxe5 8.Qxd8 Rxd8 9.Nxe5?. You are Black.</p>

```try
fen: rnbr2k1/ppp2pbp/5np1/4N3/2P1P3/2N5/PP2BPPP/R1B1K2R b KQ - 0 9
solution: Nxe4 Nxe4 Bxe5
hint: Take the e4 pawn with the knight. If White recaptures, the bishop takes on e5 and hits b2.
prompt: Black to play. Get the pawn back with interest.
success: The fianchetto bishop does the work. This trick comes up in many King's Indian and Grünfeld lines: when e5 is taken, look at …Nxe4.
```

<p class="puzzle-intro">3 · Byrne – Fischer, 1956. Fischer, thirteen years old, has just been hit by 17.Kf1. His queen is attacked. You are Fischer.</p>

```try
fen: r3r1k1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3R1K1R b - - 3 17
solution: Be6
hint: Leave the queen where it is. A quiet bishop move creates threats worth more than the queen.
prompt: Black to play. Find the move of the century.
success: If White takes the queen, Bxc4+ and the knight checks lead to a windmill that collects a rook, two bishops and a knight for it. Fischer went on to mate.
```

## Remember

- …Nf6, …g6, …Bg7, …d6, castle, …e5. Then …f5 and the storm.
- When the centre closes with d5, play only on the kingside. Speed is everything.
- The Grünfeld is the same fianchetto with an early …d5 strike. Study the Game of the Century for what that bishop can do.

+++ Read more: the Game of the Century

```pgn
file: byrne-fischer-1956.pgn
```

+++
