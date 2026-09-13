---
id: strategy/outposts
track: Middlegame strategy
title: Outposts and weak squares
lede: A square the opponent's pawns can never attack is an outpost. Put a knight on it and it is worth a rook.
level: 2
sources:
  - Nimzowitsch, My System (1925, Hereford translation), on the outpost and the blockade — public domain.
  - Wikipedia, "Outpost (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Outpost_(chess)
  - Composed positions for this lesson, checked with Stockfish 18.
---

## What makes an outpost

A square in the opponent's half of the board, protected by one of your pawns, that no enemy pawn can attack now or later. The classic squares are d5, e5, d4 and e4, and any square in front of a backward or isolated pawn. Knights love outposts because a knight is the piece that most needs a safe forward square; bishops and rooks can act from a distance.

```board
fen: r2q1rk1/pp1nbppp/2np4/2p1p3/2P1P3/2NP1N2/PP3PPP/R2QKB1R w KQ - 0 1
highlight: d5
arrows: c3d5
caption: d5 is an outpost for White: protected by the e4 pawn, and Black's c- and e-pawns are past it. Nc3–d5 is the plan.
```

**How to get one:** trade off the pawn that could challenge it, or fix the pawns so that it cannot move. **How to fight one:** exchange the knight that sits there, or attack it with a piece that costs less.

## Play it

<p class="puzzle-intro">1 · The knight has a home. White to move.</p>

```try
fen: r2q1rk1/pp1nbppp/2np4/2p1p3/2P1P3/2NP1N2/PP3PPP/R2QKB1R w KQ - 0 1
solution: Nd5
tolerance: 50
hint: Which square can no black pawn ever touch?
prompt: White to play. Occupy the outpost.
success: On d5 the knight attacks e7, f6 and b6, and can never be driven off by a pawn. If Black exchanges it, cxd5 or exd5 gives White a strong pawn on d5 instead.
```

<p class="puzzle-intro">2 · Make the outpost first. Black's pawn on e6 could go to e5 and take d4 away from you. Fix it.</p>

```try
fen: r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 1
solution: Ne5
tolerance: 60
hint: The square in front of a pawn that cannot advance is an outpost.
prompt: White to play. Take the strong square.
success: The e5 square is protected by d4 and Black's f- and d-pawns cannot touch it. The knight there ties Black's pieces down for the rest of the game.
```

## Remember

- Outpost: protected by a pawn, safe from enemy pawns for good.
- Knights on outposts. Bishops and rooks work from behind.
- Create outposts by fixing or exchanging the pawns that could challenge them.
- Fight an outpost by exchanging the piece on it, never by ignoring it.

+++ Read more: the knight against the bad bishop

The most common winning plan in club games is not a combination but an outpost knight against a bishop shut in by its own pawns. Nimzowitsch's chapters on the outpost and on the blockade describe the same thing from two angles: a piece on a square the opponent cannot contest both restricts and threatens. The lesson on bishops that follows this one is the companion piece: it explains why the bishop on the other side of the board is often worth so little.

+++
