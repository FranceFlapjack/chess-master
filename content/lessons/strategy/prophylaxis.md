---
id: strategy/prophylaxis
track: Middlegame strategy
title: Prophylaxis and overprotection
lede: Ask what the opponent wants, then stop it. Nimzowitsch turned this into a method, and one game of his shows it taken to the end.
level: 3
sources:
  - Sämisch – Nimzowitsch, Copenhagen 1923 ("the Immortal Zugzwang Game"). Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Immortal_Zugzwang_Game
  - Nimzowitsch, My System (1925, Hereford translation), the chapters on prophylaxis and overprotection — public domain.
  - Puzzle moves checked with Stockfish 18.
---

## The habit

**Prophylaxis** is a move made to prevent the opponent's plan rather than to advance your own. Before every move, ask "what does my opponent want to do next?" If the answer is a good move, stop it first. Most of the time that costs nothing, and it removes the counterplay that turns won games into lost ones.

**Overprotection** is Nimzowitsch's word for defending an important point (a strong pawn, a central square) with more pieces than it needs. The pieces that overprotect are well placed for everything else, because the point they guard is where the action is.

**Zugzwang** is where prophylaxis ends up when it is total: the opponent has no useful move left, and any move makes things worse.

```board
fen: 6k1/3q2pp/p2bp3/3p1r2/1p1Pp3/3bQ1PP/PP1B1rB1/1N2R1RK b - - 7 25
highlight: h6
caption: Sämisch – Nimzowitsch after 25.Rce1. Black plays 25…h6, and White resigns: there is no move that does not lose material.
```

## Play it

<p class="puzzle-intro">1 · The Immortal Zugzwang Game, after 25.Rce1. Black is a rook down for a knight and has all the play. Find the move that ends it.</p>

```try
fen: 6k1/3q2pp/p2bp3/3p1r2/1p1Pp3/3bQ1PP/PP1B1rB1/1N2R1RK b - - 7 25
solution: h6
tolerance: 80
hint: Nothing needs to happen. Every white piece is already tied up; pass the move and let White prove otherwise.
prompt: Black to play. Force zugzwang.
success: 25…h6!! Every white move loses: Kh2 R5f3 wins the queen; g4 R5f3 the same; Bc1 Bxb1; Rc1 or Rd1 Re2 wins the queen. Sämisch resigned. Black never had to attack.
```

<p class="puzzle-intro">2 · Earlier in the same game, after 21.Qxh5. White has just taken a knight. Black's reply wins the exchange back with the initiative.</p>

```try
fen: r4rk1/3q2pp/p2bp3/1b1p3Q/1p1Pp3/6PP/PP1B1PBK/1NR3R1 b - - 0 21
solution: Rxf2
tolerance: 60
hint: The f2 pawn is attacked twice and defended once, and the rook cannot be taken without losing the queen.
prompt: Black to play.
success: 21…Rxf2 wins the pawn and pins the white army: after 22.Qg5 Raf8 the second rook joins and the zugzwang net closes.
```

## Remember

- Before your move: what does the opponent want? If it is good, stop it.
- Guard the squares and pawns your plan depends on with more than they need.
- A player with no counterplay can be put in zugzwang even in the middlegame.
- Prophylaxis is not passivity. It is how you get to make your plan undisturbed.

+++ Read more: the game in full

**Sämisch – Nimzowitsch, Copenhagen 1923.** A Queen's Indian in which White never gets a plan and Black takes the squares one by one: e4, f-file, the second rank. The final position is famous because White is not in check, has all his pieces, and is completely lost.

```pgn
file: samisch-nimzowitsch-1923.pgn
```

+++
