---
id: strategy/isolated-pawn
track: Middlegame strategy
title: The isolated queen's pawn
lede: The most common structure in open games. The side with the pawn attacks; the side against it blockades and trades.
level: 2
sources:
  - Wikipedia, "Isolated pawn" (CC BY-SA), https://en.wikipedia.org/wiki/Isolated_pawn
  - Nimzowitsch, My System (1925, Hereford translation), the chapter on the isolated queen's pawn — public domain.
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Two plans, one pawn

An isolated d-pawn (IQP) is weak in the ending and strong in the middlegame. It gives its owner space, open c- and e-files for the rooks, and the squares e5 and c5 for the knights. It gives the other side a blockade square in front of it and a target once the pieces come off.

**With the pawn:** keep pieces on, put a knight on e5, rooks on the e-file, and look for the **d4–d5 break** that opens the position while the pieces are active.

**Against the pawn:** trade pieces, especially the knight that would sit on e5, blockade the pawn with a knight on d5, and press it with rooks on the d-file.

```board
fen: 2rq1rk1/pp2bppp/2n1bn2/8/3P4/2NBBN2/PPQ2PPP/R3R1K1 w - - 0 1
highlight: d5, e5
arrows: f3e5
caption: White's IQP on d4. Nf3–e5 and a later d4–d5 are White's plan; Black wants a knight on d5 and exchanges.
```

## Play it

<p class="puzzle-intro">1 · Playing against the pawn. Black to move: which square does the knight want?</p>

```try
fen: 2rq1rk1/pp2bppp/2n1bn2/8/3P4/2NBBN2/PP2QPPP/R3R1K1 b - - 0 1
solution: Nd5
tolerance: 50
hint: The square in front of the isolated pawn, where no pawn can ever drive the knight away.
prompt: Black to play. Blockade.
success: The knight on d5 cannot be attacked by a pawn, blocks the d-pawn for good, and eyes c3 and e3. Every exchange from here makes the pawn weaker.
```

<p class="puzzle-intro">2 · Playing with the pawn. Black has neglected the blockade. White to move: open the position while every piece is ready.</p>

```try
fen: 2rq1rk1/pp2bppp/2n2n2/8/3P4/2NBBN2/PPQ2PPP/R3R1K1 w - - 0 1
solution: d5
tolerance: 50
hint: The break. The pawn gives itself so that the bishops and rooks open.
prompt: White to play. Use the pawn.
success: d4–d5 opens the diagonal for the bishop on d3, frees e-file play and hits the knight on c6. The isolated pawn is worth most at the moment it advances.
```

## Remember

- With the pawn: pieces on, knight to e5, prepare d5.
- Against it: pieces off, knight to d5, rooks on the d-file, win it in the ending.
- The IQP is a middlegame asset and an endgame liability. Decide which game you are playing.

+++ Read more: Nimzowitsch's verdict

Nimzowitsch devotes a chapter of *My System* to the isolated queen's pawn and calls the position dynamically balanced: the pawn is at once a weakness and the source of all of its owner's activity. His advice to the defender is the blockade, a piece on the square in front of the pawn that is not only a stopper but a strong piece in its own right, because nothing can drive it off. His advice to the attacker is not to wait. That is still the modern verdict.

+++
