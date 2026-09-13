---
id: strategy/opposite-castling
track: Middlegame strategy
title: Opposite-side castling
lede: When the kings are on opposite wings, both sides attack with pawns. It is a race, and the rules of the race are simple.
level: 3
sources:
  - Wikipedia, "Castling" (opposite-side castling) and "Pawn storm" (CC BY-SA), https://en.wikipedia.org/wiki/Pawn_storm
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The race

With kings on opposite sides, the pawns in front of your own king are not needed for defence, so they become the attack: h4–h5, g4–g5 against a kingside king; b4–b5, a4–a5 or c4–c5 against a queenside one. Whoever opens a file against the enemy king first, wins.

- **Speed over material.** A tempo is worth more than a pawn. Do not stop to capture unless the capture is also a threat.
- **Open a file, then use it.** The pawns' job is to open lines for the rooks and queen. Trade the pawn for the file.
- **Do not move your own pawns on the side where the opponent attacks.** Every pawn move there opens a line for them.
- **A defender that leaves is a defender gone.** Pieces that stay near your king cost tempi in the attack; pieces that go cost safety. Count.

```board
fen: 2kr1b1r/ppqn1ppp/2p1pn2/8/3PP1P1/2N2N2/PPPQ1P1P/2KR1B1R w - - 0 1
arrows: g4g5, h2h4
caption: Kings on c1 and c8. White's g- and h-pawns attack; Black's a- and b-pawns will come the other way.
```

## Play it

<p class="puzzle-intro">1 · Kings on opposite wings. White to move: which pawn goes?</p>

```try
fen: 1k1r3r/ppqb1ppp/2n1pn2/2pp4/3P1B2/2N1PN2/PPPQ1PPP/2KR3R w - - 0 1
solution: g4
tolerance: 60
hint: The pawns in front of your own king are the attackers. Which one gains a tempo on a piece?
prompt: White to play. Start the storm.
success: g4 hits the knight on f6 and prepares g5 to open the g-file. Black must respond, and the tempo is what the race is about.
```

<p class="puzzle-intro">2 · Black's turn in the same kind of race. The white king is on c1 and Black's pawns are ready.</p>

```try
fen: 1k1r3r/ppqb1pp1/2n1pn1p/2pp4/3P2PP/2N1PN2/PPPQ1P2/2KR1B1R b - - 0 1
solution: c4
tolerance: 60
hint: Open a line towards c1 and take a square from the knight at the same time.
prompt: Black to play. Answer the storm with your own.
success: c4 fixes the queenside and prepares b5–b4 to drive the knight from c3 and open the b-file against the king. Both sides race; the side that opens a file first usually gets there.
```

## Remember

- Opposite-side castling: attack with the pawns in front of your own king.
- Tempo over material. Every move must push the attack or stop theirs.
- Keep the pawns in front of your king still on the side where the opponent attacks.
- The goal of the pawn storm is an open file; the rooks finish it.

+++ Read more: judging the race

The hardest part of these positions is deciding whether to attack or defend on a given move. The rule of thumb: if the opponent's attack needs one more pawn move than yours to open a file, attack. If it needs one fewer, spend a move on defence, then attack. Count the pawn moves each side needs, and count any piece that must be moved out of the way. Sicilian Defence positions with the white king on c1 and the black king on g8 are the classic school for this, and the Openings track's "opposite-side castling" games in the Ruy Lopez and Caro-Kann lessons are where to see it done well.

+++
