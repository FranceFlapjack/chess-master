---
id: endgames/lucena
track: Endgames
title: The Lucena position
lede: The winning method in rook endings. Your pawn is on the seventh, your king in front of it, and the defender's rook keeps checking. Build a bridge.
level: 2
sources:
  - Wikipedia, "Lucena position" (CC BY-SA), https://en.wikipedia.org/wiki/Lucena_position — first published in Lucena's Repetición de Amores y Arte de Ajedrez (1497).
  - Positions checked with Stockfish 18.
---

## The position

White has a pawn on the seventh, the king sits in front of it on the eighth rank, and the black king is cut off on the far side. Black's rook will check from behind as soon as the king steps out. The winning idea, the **bridge**, is to put your rook on the fourth rank so that the king can walk down the board and hide behind it.

```board
fen: 5K2/2k2P2/8/8/3R4/8/8/r7 w - - 0 1
arrows: f8e7, e7f6, f6e6, e6f5, d4f4
caption: The bridge is built. The king steps out; after the checks run out on the fifth rank, the rook interposes on f4.
```

## Play it

<p class="puzzle-intro">1 · Preparation. Black's king on d7 is too close. Push it away with a check, then place the rook on the fourth rank.</p>

```try
fen: 5K2/3k1P2/8/8/8/8/r7/1R6 w - - 0 1
solution: Rd1+ Kc7 Rd4
tolerance: 200
hint: First a check to gain a file, then the rook to the rank where the bridge is built.
prompt: White to play. Set up the bridge.
success: The black king is now two files away and the rook waits on d4. The rest is the walk.
```

<p class="puzzle-intro">2 · The walk. The bridge is built. Step out with the king and answer every check by coming closer, until the rook can block.</p>

```try
fen: 5K2/2k2P2/8/8/3R4/8/8/r7 w - - 0 1
solution: Ke7 Re1+ Kf6 Rf1+ Ke6 Re1+ Kf5 Rf1+ Rf4
tolerance: 200
hint: Zigzag: e7, f6, e6, f5. On the fifth rank the rook on d4 can step in front of the king.
prompt: White to play and win.
success: The bridge. Once the rook blocks on f4, the checks are over and the pawn queens.
```

## Remember

- Pawn on the seventh, king in front, defender's king cut off: it is won. Do not hurry.
- Rook to the fourth rank first. That is the bridge.
- King steps out, zigzagging towards the rook's file; on the fifth rank the rook interposes.
- If the defender's king is too close, check it away first.

+++ Read more: why the fourth rank

The king needs to reach a square where the rook can shield it from the checks along the rank. From the fourth rank the rook covers the fifth-rank king in one move, and it also stops the black king from crossing back. The fifth rank does not work: the king would have to stand on the sixth, where the rook cannot interpose because the black rook checks from behind on the same file. That is the whole reason the method is remembered as "the bridge on the fourth".

The Lucena position is the reason rook endings with an extra pawn are usually won when the defending king is cut off, and the Philidor position (next lesson) is the reason they are usually drawn when it is not.

+++
