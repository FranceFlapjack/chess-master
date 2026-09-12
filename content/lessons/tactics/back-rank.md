---
id: tactics/back-rank
track: Tactics
title: Back-rank weakness
lede: A castled king with its three pawns still in front has no escape square. Any rook or queen that reaches the back rank is mate.
level: 1
sources:
  - Bernstein – Capablanca, Moscow 1914 (exhibition game), final position as given in the Wikipedia article "Back-rank checkmate" (CC BY-SA), https://en.wikipedia.org/wiki/Back-rank_checkmate
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The idea

After castling, the pawns on f, g and h protect the king from the front and trap it from behind. If the back rank is guarded by only one piece, remove or distract that piece and a rook delivers mate.

```board
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
arrows: a1a8
highlight: g8
caption: The shape to remember. Ra8 is mate: the king has no square, and nothing can block or capture.
```

**Two questions to ask every move.** How many of my pieces guard my back rank, and could one of them be pulled away? The same for the opponent. A piece that guards the back rank and also does another job is **overloaded**, and overloaded pieces are the target.

## Play it

<p class="puzzle-intro">1 · Bernstein – Capablanca, Moscow 1914. Capablanca called this his most artistic game. You are Black. White's queen and rook are both tied to the back rank.</p>

```try
fen: 3r2k1/p4ppp/1q6/8/8/2R1P3/PP2QPPP/6K1 b - - 0 29
solution: Qb2
hint: Offer the queen where taking it allows Rd1 mate, and where declining loses the rook.
prompt: Black to play. Find the move that made Bernstein resign.
success: If the queen takes, Rd1 is mate. If the rook moves off the c-file, the queen takes on e2 or the rook falls. Bernstein resigned at once.
```

<p class="puzzle-intro">2 · Deflection. The black queen guards f8, the rook guards e8, and neither can do two jobs.</p>

```try
fen: 4r1k1/5ppp/3q4/1Q6/8/8/5PPP/3R2K1 w - - 0 1
solution: Qxe8+ Qf8 Rd8
hint: Take the guard of the back rank, even at the cost of the queen.
prompt: White to play. Force mate.
success: The queen on f8 is pinned against the mate on d8. Whatever Black does, a piece lands on f8 or e8 with mate.
```

<p class="puzzle-intro">3 · Overloading. The rook on d8 guards e8 and the eighth rank at once.</p>

```try
fen: 3r2k1/2q2ppp/8/1Q6/8/8/5PPP/4R1K1 w - - 0 1
solution: Re8+ Rxe8 Qxe8#
hint: Make the rook take, so the rank is guarded by nothing.
prompt: White to play. Mate in two.
success: The rook was forced to capture and left the back rank to the queen.
```

## Remember

- Three pawns in front of the king and no piece on the back rank: mate is one rook move away.
- Count the guards. One guard can be deflected, overloaded or captured.
- Make an escape square ("luft") with h3 or h6 when you have a quiet move and your back rank is thin. It costs one tempo and saves games.
