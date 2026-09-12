---
id: tactics/skewer
track: Tactics
title: The skewer
lede: A pin in reverse. The valuable piece stands in front and must move, exposing the one behind it.
level: 1
sources:
  - Composed positions for this lesson, checked with Stockfish 18.
  - The pattern is described in every tactics primer; see the Wikipedia article "Skewer (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Skewer_(chess)
---

## The idea

Line up two enemy pieces on a rank, file or diagonal with the more valuable one in front. Attack the front piece. When it moves, take the one behind. When the front piece is the king, the skewer comes with check and the defender has no choice.

```board
fen: 3q4/8/3k4/8/8/8/8/R4K2 w - - 0 1
arrows: a1d1, d1d8:alt
highlight: d6, d8
caption: Rd1+ attacks the king with the queen behind it on the same file. The king steps aside, and Rxd8 follows.
```

Skewers happen most in endgames, when the board is open and the king is out. Any time the enemy king and another piece share a line, look for a check along it.

## Play it

<p class="puzzle-intro">1 · King in front, queen behind.</p>

```try
fen: 3q4/8/3k4/8/8/8/8/R4K2 w - - 0 1
solution: Rd1+ Kc5 Rxd8
hint: Give check along the file the queen stands on.
prompt: White to play. Win the queen.
success: The king had to leave the file and the queen was left on it.
```

<p class="puzzle-intro">2 · The bishop skewer. Same idea on a diagonal.</p>

```try
fen: 1q6/8/8/4k3/8/8/5B2/4K3 w - - 0 1
solution: Bg3+ Kd5 Bxb8
hint: Which diagonal holds both the king and the queen?
prompt: White to play. Win the queen.
success: One bishop move, one check, one queen.
```

<p class="puzzle-intro">3 · Check on the rank.</p>

```try
fen: 8/8/8/8/5k1q/8/8/R5K1 w - - 0 1
solution: Ra4+ Kg5 Rxh4
hint: The king and queen share the fourth rank.
prompt: White to play. Win material.
success: The queen was defended by its king, so White gave up the rook for it: still a winning trade.
```

## Remember

- Same line, valuable piece in front: attack it, take what is behind.
- With the king in front, it is a check, and forced.
- Skewers are why an exposed king in the endgame loses rooks and queens. Keep your king off open lines that your opponent's rook can reach.
