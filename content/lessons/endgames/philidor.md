---
id: endgames/philidor
track: Endgames
title: The Philidor position
lede: The drawing method in rook endings. Your king is in front of the pawn; keep your rook on the third rank until the pawn advances, then check from behind.
level: 2
sources:
  - Wikipedia, "Philidor position" (CC BY-SA), https://en.wikipedia.org/wiki/Philidor_position — analysed by Philidor in 1777.
  - Positions checked with Stockfish 18.
---

## The position

Black's king stands on the queening square. White's king and pawn want to come to the sixth rank. The rule: keep your rook on your *third* rank (the sixth from White's side) so the white king cannot cross it. The moment the pawn steps onto that rank, the king no longer has shelter, so the rook goes to the far end of the board and checks from behind forever.

```board
fen: 4k3/1R6/r7/3KP3/8/8/8/8 b - - 0 1
highlight: a6, b6, c6, d6, e6, f6, g6, h6
caption: The rook on the sixth rank keeps the white king out. If the pawn comes to e6, the rook goes to a1 and checks from behind.
```

## Play it

<p class="puzzle-intro">1 · The rook is on the wrong rank. White threatens Kd6. Black to move.</p>

```try
fen: 4k3/1R6/8/3KP3/8/8/8/r7 b - - 0 1
solution: Ra6
hint: Which rank stops the king from coming to d6 or f6?
prompt: Black to play and draw.
success: The rook on the sixth rank is a fence. As long as the pawn stays on e5 the white king cannot cross it.
```

<p class="puzzle-intro">2 · White has pushed the pawn to e6. The fence has served its purpose; now the rook has another job.</p>

```try
fen: 4k3/1R6/r3P3/3K4/8/8/8/8 b - - 0 1
solution: Ra1|Ra2|Ra3|Ra4
hint: With the pawn on e6 the white king has no shelter from checks along the files. Go far away.
prompt: Black to play and draw.
success: From the far end the rook checks the king every move: Kd6 Rd1+, Ke5 Re1+. The king cannot hide behind its own pawn, and the draw is certain.
```

## Remember

- King on the queening square, rook on the third rank: the fence.
- When the pawn reaches the sixth, rook to the first rank and check from behind.
- Do not check early, and do not let the rook be pushed off the third rank while the pawn is still on the fifth.
- If your king is not in front of the pawn, this method is not available, and you are usually lost (see the Lucena position).

+++ Read more: the two positions together

Lucena and Philidor are the two poles of rook-and-pawn endings. In the Lucena, the attacker's king is in front of the pawn and the defender's king is cut off; the attacker wins. In the Philidor, the defender's king is in front of the pawn; the defender draws with the rook-on-the-third-rank method. Most practical rook endings come down to which of these the players can reach, and a club player who knows both cold will save and win a surprising number of games.

Philidor published the analysis in 1777, in the second edition of his *Analyse*. It is the older of the two names only in usage: Lucena's book dates from 1497, although the position now called after him was in fact first given by Salvio in 1634.

+++
