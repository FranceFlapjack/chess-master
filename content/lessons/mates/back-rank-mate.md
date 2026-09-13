---
id: mates/back-rank-mate
track: Checkmate patterns
title: Back-rank mate
lede: The most common mate in club chess. A rook or queen lands on the back rank, and the king's own pawns finish the job.
level: 1
sources:
  - Wikipedia, "Back-rank checkmate" and "Checkmate pattern" (CC BY-SA), https://en.wikipedia.org/wiki/Checkmate_pattern
  - Composed positions for this lesson, checked with Stockfish 18.
  - The Tactics track's "Back-rank weakness" lesson covers the deflection tactics that lead here.
---

## The shape

The king castled and never made a hole. Three pawns stand in front of it, so the back rank is a corridor. Any heavy piece that reaches the corridor with nothing to capture it and nothing to block gives mate. Note that squares *behind* the king along the checking line count as attacked too: the king cannot slide along the rank away from the rook.

```board
fen: 6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1
arrows: e1e8
highlight: f8, h8
caption: Re8 is mate. Both f8 and h8 are on the rook's line.
```

The pattern lesson is short. The work is in **spotting the guard** of the back rank and removing it: the puzzles below add one guard each and ask you to deal with it.

## Play it

<p class="puzzle-intro">1 · Two rooks against one guard. The rook on a8 covers e8, but it can only capture once.</p>

```try
fen: r5k1/5ppp/8/8/8/8/4RPPP/4R1K1 w - - 0 1
solution: Re8+ Rxe8 Rxe8#
hint: Doubled rooks: the first is bait, the second delivers.
prompt: White to play. Mate in two.
success: The rook on a8 captured and the second rook recaptured on e8 with mate.
```

<p class="puzzle-intro">2 · The queen as bait. Black's rook guards e8, and Black's queen is far away on a5.</p>

```try
fen: 3r2k1/5ppp/8/q7/8/8/4QPPP/4R1K1 w - - 0 1
solution: Qe8+ Rxe8 Rxe8#
hint: Any piece will do as the first visitor to e8, as long as a rook follows.
prompt: White to play. Mate in two.
success: Rxe8 was forced and the rook on e1 recaptured with mate. The queen cost nothing.
```

<p class="puzzle-intro">3 · Black made a hole with h6, so h7 is an escape square. Or it would be, if White's bishop were not looking at it.</p>

```try
fen: r5k1/pp3pp1/1q5p/8/8/8/PPB1RPPP/4R1K1 w - - 0 1
solution: Re8+ Rxe8 Rxe8#
hint: Check the bishop's diagonal before you count the king's escape squares.
prompt: White to play. Mate in two.
success: The bishop on c2 covers h7, so the hole on h6 did not help. Luft only works if the escape square is not attacked.
```

## Remember

- Three pawns in front, nothing on the back rank: mate is one heavy-piece move away.
- Count the guards of the back rank and look for the move that removes, deflects or overloads them.
- An escape square must also be *safe*. Look for long-range bishops and knights that cover it.
- On your own side: make luft with h3 (h6) before the corridor becomes a problem, or keep a rook home.

+++ Read more: why it happens so often

The back rank is weak because castling is good. You put the king behind its pawns early, then spend the middlegame moving rooks to the centre and open files, which is where they belong. Both rooks leave the back rank, and the king is safe from everything except a heavy piece arriving on the rank.

The usual disasters follow a pattern: a rook or queen that guards the back rank is asked to do a second job (capture, defend another piece, block a check). Once it has two duties it can be forced to abandon one. That is the deflection and overloading theme from the Tactics track, and the mate here is what it leads to.

The cure is one pawn move. h3 (or h6, or g3 with a fianchetto) gives the king a square. Strong players make it when nothing more urgent is on the board. It looks passive and it wins games.

+++
