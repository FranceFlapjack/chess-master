---
id: games/morphy-opera-game
track: Study a whole game
title: Morphy – Duke of Brunswick and Count Isouard, Paris 1858
lede: The Opera Game. Seventeen moves, every one with a purpose, and the most quoted lesson in development and pins ever played.
level: 1
sources:
  - Morphy – Duke Karl of Brunswick and Count Isouard, Paris 1858. Move list checked against Wikipedia, "Opera Game" (CC BY-SA), https://en.wikipedia.org/wiki/Opera_Game
  - Puzzle moves checked with Stockfish 18.
---

## How to use this lesson

Play the position at each pause before reading on. The game is short enough to learn by heart, and worth it: Morphy's method (develop with threats, pin, bring the last piece, sacrifice when everything is in place) is the method of every attacking game since.

## Play it

<p class="puzzle-intro">1 · After 9…b5. Black attacks the bishop on c4. Morphy is not interested in retreating.</p>

```try
fen: rn2kb1r/p3qppp/2p2n2/1p2p1B1/2B1P3/1QN5/PPP2PPP/R3K2R w KQkq - 0 10
solution: Nxb5 cxb5 Bxb5+
hint: A piece for two pawns, so that the bishop checks on the a4–e8 diagonal and pins whatever blocks.
prompt: White to play. Morphy's move.
success: 10.Nxb5! cxb5 11.Bxb5+ Nbd7 and both black knights are pinned: d7 to the king, f6 to the queen. Black cannot move a piece.
```

<p class="puzzle-intro">2 · After 12…Rd8. Every white piece is developed; Black's are pinned. Find the move that breaks the position open.</p>

```try
fen: 3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13
solution: Rxd7 Rxd7 Rd1
hint: Take the pinned piece, and let the second rook take over the file.
prompt: White to play.
success: 13.Rxd7! Rxd7 14.Rd1. The rook on d7 is pinned and attacked, and the knight that should defend it is pinned too.
```

<p class="puzzle-intro">3 · After 14…Qe6. The famous finish. Mate in three.</p>

```try
fen: 4kb1r/p2r1ppp/4qn2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 2 15
solution: Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#
hint: Remove the rook, then give the queen so that the knight leaves d7.
prompt: White to play and mate.
success: 15.Bxd7+ Nxd7 16.Qb8+!! Nxb8 17.Rd8#. The queen sacrifice pulls the last defender off the d-file.
```

## What to take from it

- Develop with threats. Morphy's Qb3 on move 7 made two.
- Do not grab pawns while pieces are undeveloped. 8.Qxb7 was possible; 8.Nc3 was better.
- Pins are the attacker's best friend: three of them decided this game.
- The last piece into the attack (12.O-O-O) is the signal that the sacrifices can begin.

+++ Read more: the game in full

```pgn
file: morphy-opera-1858.pgn
```

The story: Morphy, twenty-one, was taken to the Paris opera by two aristocrats who wanted to play him during the performance of Bellini's *Norma*. He sat facing the stage, they played as a team, and he won in seventeen moves while watching the opera. Whether the story is exact hardly matters; the game is.

+++
