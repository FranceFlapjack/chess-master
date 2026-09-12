---
id: tactics/deflection-and-decoy
track: Tactics
title: Deflection and decoy
lede: Deflection drags a defender away from its post. A decoy drags a piece onto a square where something bad happens to it. Both work by offering something the opponent cannot refuse.
level: 2
sources:
  - Adams – Torre, New Orleans 1920, position after Black's 17th move and the following sequence as given in the Wikipedia article "Back-rank checkmate" (CC BY-SA), https://en.wikipedia.org/wiki/Back-rank_checkmate. (Historians doubt the game was really played; the sequence is a classic either way.)
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The idea

A **deflection** attacks or captures so that a defender must leave the square or line it was guarding. A **decoy** sacrifices so that an enemy piece, usually the king or queen, is pulled onto a square where a fork, a skewer or a mate follows. In both, the sacrifice is bait: the point is where the enemy piece ends up, not what you gave.

```board
fen: r1r3k1/p4ppp/1pb5/q7/2Q5/1P1R4/P1B2PPP/3R2K1 w - - 0 1
arrows: c4c6, d3d8:alt
highlight: c6, c8
caption: Qxc6 wins a bishop for nothing: if the rook on c8 recaptures, it has left the back rank, and Rd8+ Rxd8 Rxd8 is mate.
```

## Play it

<p class="puzzle-intro">1 · Deflection. The rook on c8 guards the bishop on c6 and the back rank, and the rook on a8 guards the back rank alone. Neither can do two jobs.</p>

```try
fen: r1r3k1/p4ppp/1pb5/q7/2Q5/1P1R4/P1B2PPP/3R2K1 w - - 0 1
solution: Qxc6 Rxc6 Rd8+ Rxd8 Rxd8#
hint: Take the bishop with the queen. If the rook recaptures, it has abandoned the eighth rank.
prompt: White to play. Win a piece, or more.
success: The rook was deflected to c6, the other rook was overloaded on d8, and the doubled rooks mated. Black should have declined and stayed a piece down.
```

<p class="puzzle-intro">2 · Decoy. The king is dragged to h7, where the rook can reach it with the bishop covering the escape.</p>

```try
fen: 4rrk1/ppq2p1p/6p1/8/7Q/5R2/PB3PPP/6K1 w - - 0 1
solution: Qxh7+ Kxh7 Rh3+ Kg8 Rh8#
hint: Give the queen on h7. The king must take, and the rook lifts to the h-file.
prompt: White to play. Mate in three.
success: The king was decoyed onto the h-file. The bishop on b2 covers g7, so Rh8 is mate.
```

<p class="puzzle-intro">3 · Deflecting the king. The king on e8 is the only guard of the queen on d8.</p>

```try
fen: rnbqkbnr/ppp2ppp/8/8/2B5/8/PPP2PPP/RNBQK1NR w KQkq - 0 1
solution: Bxf7+ Kxf7 Qxd8
hint: Check the king so it has to step away from d8.
prompt: White to play. Win the queen.
success: One bishop check and the queen was undefended.
```

<p class="puzzle-intro">4 · Adams – Torre, 1920. The black queen must keep guarding e8, where Rxe8 would be mate. Chase it with attacks it cannot answer by capturing.</p>

```try
fen: 2r1r1k1/1p1q1ppp/p2p1b2/3P4/3Q4/5N2/PP2RPPP/4R1K1 w - - 0 18
solution: Qg4
hint: Attack the queen from a square where taking your queen loses to Rxe8 mate.
prompt: White to play. Start the chase.
success: The black queen cannot take on g4 because e8 would fall. In the game the chase went on with Qc4, Qc7 and a4 until the queen was lost. (Honesty note: engines rate only the first move as clearly best; the rest of the famous sequence is dramatic rather than forced.)
```

## Remember

- Deflection: take away the guard. Decoy: bring the victim to the square.
- The bait is usually your queen or a rook. Do not flinch at the price; look at where the enemy piece lands.
- Back-rank mates, forks and skewers are what usually follows.
