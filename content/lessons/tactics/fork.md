---
id: tactics/fork
track: Tactics
title: The fork
lede: One piece attacks two. Something has to give.
level: 1
sources:
  - Fischer – Reshevsky, US Championship, New York 1958. Move list checked against the Lichess study and chess.com game records, https://lichess.org/study/PsdAFTGJ/j6OrSBIp
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The idea

A fork is a double attack by one piece. The defender can only move one target away, so the other falls. Knights are the classic forkers because their attack is hard to see coming and cannot be blocked, but pawns, queens, rooks and bishops all fork.

```board
fen: 4k3/8/q7/3N4/8/8/8/4K3 w - - 0 1
arrows: d5c7
highlight: e8, a6
caption: Nc7+ attacks the king and the queen at once. The king must move, and the queen is lost.
```

**Look for loose pieces.** A fork needs two targets: the king, an undefended piece, or a piece worth more than the forking piece. Every time your opponent leaves a piece undefended, ask which square attacks it and something else.

## Play it

<p class="puzzle-intro">1 · Fischer – Reshevsky, 1958. The knight on c6 has wandered to a5 and the knight on f6 to e8. The square e6 has lost its guards.</p>

```try
fen: r1bqnrk1/pp1pppbp/6p1/n3P3/3N4/1BN1B3/PPP2PPP/R2QK2R w KQ - 1 10
solution: Bxf7+ Kxf7 Ne6 dxe6 Qxd8
hint: First remove the pawn that shields e6. Then a knight there attacks two things at once.
prompt: White to play. Win the queen.
success: Reshevsky lost his queen on move eleven and played on for thirty more moves. Fischer was fifteen.
```

<p class="puzzle-intro">2 · A royal fork.</p>

```try
fen: 2r3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1
solution: Ne7+ Kf8 Nxc8
hint: Which knight move gives check?
prompt: White to play. Win the rook.
success: Check first, then take. The king had to move and the rook was left behind.
```

<p class="puzzle-intro">3 · The pawn fork. Cheapest of all.</p>

```try
fen: r1bqk2r/pppp1ppp/2n1n3/8/2BPP3/5N2/PP3PPP/RNBQK2R w KQkq - 0 1
solution: d5
hint: Two knights, one square between them.
prompt: White to play. Win a knight.
success: One pawn attacks two knights. Only one can escape.
```

<p class="puzzle-intro">4 · The queen fork. Two loose pieces on one diagonal and one rank.</p>

```try
fen: r5k1/p4ppp/8/b7/8/7P/PP3PP1/3Q2K1 w - - 0 1
solution: Qd5
hint: The rook on a8 and the bishop on a5 are both undefended. One square sees both.
prompt: White to play. Win a piece.
success: Whatever Black saves, the other piece goes. Loose pieces drop off.
```

## Remember

- A fork needs two targets. Loose pieces and the king are the targets.
- Knights fork on the colour opposite to the one they stand on: a knight on a light square attacks only dark squares.
- Before every move, check which of your pieces are undefended. That is how you avoid being forked.

+++ Read more: Fischer – Reshevsky in full

The queen is lost on move eleven. Watch how Fischer then converts an overwhelming material advantage patiently rather than looking for another trick.

```pgn
file: fischer-reshevsky-1958.pgn
```

+++
