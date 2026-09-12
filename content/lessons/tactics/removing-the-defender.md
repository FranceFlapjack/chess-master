---
id: tactics/removing-the-defender
track: Tactics
title: Removing the defender
lede: Every threat you cannot play is stopped by one defender. Capture that defender, and the threat plays itself.
level: 2
sources:
  - Composed positions for this lesson, checked with Stockfish 18.
  - The pattern is standard in every tactics primer; see the Wikipedia article "Undermining (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Undermining_(chess)
---

## The idea

When a capture or a mate fails only because one enemy piece guards the square, look at that guard. If you can capture it, even at a cost, the original threat comes back with nothing to stop it. The knight that guards h7, the bishop that guards g7, the rook that guards the back rank: those are the pieces to remove.

```board
fen: r2q1rk1/ppp2ppp/3ppn2/6B1/8/8/PPQ2PPP/RB4K1 w - - 0 1
arrows: g5f6, c2h7:alt
highlight: f6, h7
caption: Qxh7 would be mate if the knight on f6 were not guarding h7. So take the knight first.
```

**The question to ask:** what stops my best move, and can I capture it?

## Play it

<p class="puzzle-intro">1 · The knight on f6 is the only guard of h7.</p>

```try
fen: r2q1rk1/ppp2ppp/3ppn2/6B1/8/8/PPQ2PPP/RB4K1 w - - 0 1
solution: Bxf6 Qxf6 Qxh7#
hint: Which piece guards h7? Take it, whatever recaptures.
prompt: White to play. Mate in two.
success: Whether the queen or the g-pawn recaptured, h7 was lost.
```

<p class="puzzle-intro">2 · Two jobs for one knight. The knight on f6 guards h7 and the knight on d5.</p>

```try
fen: r4rk1/ppp1qppp/5n2/3n4/8/2NB3Q/PPP2PPP/R4RK1 w - - 0 1
solution: Nxd5 Nxd5 Qxh7#
hint: The knight on f6 cannot recapture on d5 and keep guarding h7 at the same time.
prompt: White to play. Win at least a piece.
success: The knight was overworked. Recapturing cost the mate, and not recapturing costs a piece.
```

<p class="puzzle-intro">3 · Give up the exchange to remove the guard.</p>

```try
fen: r2q1rk1/pp2bppp/5n2/8/7Q/3B4/PPP3PP/R4RK1 w - - 0 1
solution: Rxf6 Bxf6 Qxh7#
hint: A rook for a knight is a fine price for a mate.
prompt: White to play. Mate in two.
success: The rook removed the only guard of h7. Material counts for nothing once the king is mated.
```

## Remember

- Ask what stops your threat. Then ask whether you can capture it.
- A defender with two jobs is overworked. Give it a job it cannot refuse.
- Removing the defender often costs material. Count the result, not the price.
