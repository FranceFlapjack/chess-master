---
id: tactics/pin
track: Tactics
title: The pin
lede: A piece that cannot move because something more valuable stands behind it. Find the pin, then pile on.
level: 1
sources:
  - Morphy – Duke of Brunswick and Count Isouard, Paris 1858 ("the Opera Game"). Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Opera_Game
  - Légal's mate (Kermur de Légal, Paris, c. 1750), the standard illustration that a pinned piece may still move.
  - Composed positions for this lesson, checked with Stockfish 18.
  - Photograph of Paul Morphy (1859), public domain, via Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Paul_Morphy_1859_photo_portrait.jpg
---

## The idea

A pin is a line attack where the piece in front cannot move without exposing the piece behind it. When the piece behind is the king, the pinned piece may not move at all: an **absolute pin**. When it is the queen or a rook, it may move but usually shouldn't: a **relative pin**.

```board
fen: r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3
arrows: b5c6
highlight: e8
caption: After 3.Bb5 the knight on c6 is pinned to the king. It cannot move.
image: morphy-1859.jpg
tone: faded
alt: Paul Morphy, photographed in 1859
credit: Paul Morphy, 1859. Wikimedia Commons, public domain.
```

**A pinned piece is a target.** It cannot run, so attack it again: with a pawn, a rook, or another piece. That is the whole technique. Morphy's Opera Game is nothing but pins and piling on.

## Play it

<p class="puzzle-intro">1 · Opera Game, move 13. Both black knights are pinned: d7 to the king, f6 to the queen. Win material.</p>

```try
fen: 3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13
solution: Rxd7 Rxd7 Rd1
hint: Take the pinned knight, and let the second rook take over the file.
prompt: White to play. Cash in on the pins.
success: The rook on d7 is pinned and attacked again, and its defender on f6 is pinned too.
```

<p class="puzzle-intro">2 · Opera Game, move 16. The finish that made the game famous.</p>

```try
fen: 4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16
solution: Qb8+ Nxb8 Rd8#
hint: The knight on d7 is the only defender of d8. Pull it away with the biggest piece you have.
prompt: Mate in two.
success: The Opera mate. Rook and bishop finish what the pins began.
```

<p class="puzzle-intro">3 · Pinned to the queen. The knight on f6 cannot move without losing the queen on d8. Attack it.</p>

```try
fen: r2q1rk1/ppp2ppp/5n2/6B1/3PP2P/8/PPP2PP1/R2Q1RK1 w - - 0 1
solution: e5
hint: A pawn is the cheapest attacker. Which pawn can hit f6?
prompt: White to play. Win a piece.
success: The knight is attacked and cannot run. Whatever Black does, White wins material.
```

<p class="puzzle-intro">4 · A pin is not a wall. White's knight on f3 is "pinned" to the queen by the bishop on g4. It moves anyway.</p>

```try
fen: rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5
solution: Nxe5 Bxd1 Bxf7+ Ke7 Nd5#
hint: If Black takes the queen, three minor pieces deliver mate. If Black declines, White has simply won a pawn.
prompt: White to play. Ignore the pin.
success: Légal's mate, two hundred and seventy years old. Count what the pinned piece is really worth before you trust a pin.
```

## Remember

- Pinned piece? Attack it again. Pawns are the best attackers because they are cheap.
- Absolute pins (to the king) are unbreakable. Relative pins (to the queen or rook) can be broken by a sacrifice, so check what happens if the pinned piece moves anyway.
- Pins are created with bishops, rooks and queens, never with knights or pawns.

+++ Read more: the Opera Game in full

Morphy against two amateurs who consulted with each other, during a performance of Norma. Every move is about development and pins.

```pgn
file: morphy-opera-1858.pgn
```

+++
