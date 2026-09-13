---
id: endgames/queen-vs-pawn
track: Endgames
title: Queen against pawn
lede: A queen beats a pawn on the seventh, except when it does not. Centre and knight pawns lose; rook and bishop pawns draw with the king in the corner.
level: 2
sources:
  - Wikipedia, "Queen versus pawn endgame" (CC BY-SA), https://en.wikipedia.org/wiki/Queen_versus_pawn_endgame
  - Positions checked with Stockfish 18.
---

## The method

The queen alone cannot stop a pawn on the seventh; the king must come. The trick is to gain tempi: check the king until it has to step in front of its own pawn, and each time it does, the queen is free for a move and the king takes a step closer. Repeat until the king arrives.

```board
fen: 8/6K1/8/8/8/3Q4/4p3/4k3 w - - 0 1
arrows: g7f6
caption: The black king is in front of its pawn, so White has a free move: the king comes closer. Two or three repetitions and it arrives.
```

**The exceptions.** With a **bishop pawn** (c or f) the defender's king goes to the corner and offers stalemate when the queen takes the pawn. With a **rook pawn** the king goes into the corner and there is no way to approach without stalemate at all. Both are draws unless the attacking king is already close.

## Play it

<p class="puzzle-intro">1 · The winning method. Black's king has just been forced in front of the pawn on e2. Use the free move.</p>

```try
fen: 8/6K1/8/8/8/3Q4/4p3/4k3 w - - 0 1
solution: Kf6|Kg6|Kf7
hint: The queen is doing its job. What is the king doing?
prompt: White to play and win.
success: Every time the black king is forced to e1 the white king takes a step. From f6 it reaches e3 or f2 in three more moves and the pawn falls.
```

<p class="puzzle-intro">2 · Bishop pawn. Black to move, in check from b3, with a pawn on c2. Find the drawing idea.</p>

```try
fen: 7K/8/8/8/8/1Q6/2p5/1k6 b - - 0 1
solution: Ka1|Kc1
hint: Which king move makes taking the pawn a stalemate?
prompt: Black to play and draw.
success: In the corner, Qxc2 is stalemate. White can check forever but cannot win a tempo to bring the king, because the pawn on c2 is untouchable.
```

<p class="puzzle-intro">3 · Rook pawn. Black to move, in check from b3, with a pawn on a2. Only one move holds.</p>

```try
fen: 7K/8/8/8/8/1Q6/p7/1k6 b - - 0 1
solution: Ka1
hint: The corner again.
prompt: Black to play and draw.
success: With the king on a1 any quiet white move is stalemate, so White can never bring the king across. Kc1 instead would lose the pawn to Qxa2.
```

## Remember

- Queen against a pawn on the seventh: force the king in front of the pawn, then bring your own king one step at a time.
- Centre pawns and knight pawns lose.
- Bishop pawns and rook pawns draw when the defending king can use the corner, unless the attacking king is close.
- On the defending side: know which pawn you have before you decide to run with it.

+++ Read more: why the corner saves the bishop pawn

With a knight pawn or a centre pawn the corner is no help: when the king goes to the corner next to the pawn, the queen can take the pawn without stalemating, because the king still has a square. With the bishop pawn on c2, a king on a1 has b1 and b2 as its only squares, and both are covered by a queen that takes on c2, so the capture is stalemate. With the rook pawn on a2 and the king on a1, the king has no moves at all unless the queen gives it one, and the queen cannot both give a square and stop the pawn. These are worth knowing exactly, because they decide whether to race with a pawn in king-and-pawn endings a move or two earlier.

+++
