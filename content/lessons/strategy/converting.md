---
id: strategy/converting
track: Middlegame strategy
title: Converting an advantage
lede: Winning a won position is a skill of its own. Simplify when ahead, keep the opponent without counterplay, and cash in the advantage in the right currency.
level: 3
sources:
  - Capablanca, Chess Fundamentals (1921), the principles on exchanges when ahead — public domain, https://www.gutenberg.org/ebooks/33870
  - Botvinnik – Capablanca, AVRO 1938. Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Botvinnik_versus_Capablanca,_AVRO_1938
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Four rules

1. **Ahead in material: exchange pieces, keep pawns.** The Endgames track's rule, and it applies from the moment you win material.
2. **Ahead in position: do not hurry.** Improve the worst-placed piece. Take away the opponent's only active idea. Then act.
3. **Convert into the currency you know.** A space advantage becomes a passed pawn; an attack becomes material; extra material becomes a won ending you can play in your sleep.
4. **Look for the opponent's counterplay first.** Nearly every lost won game is lost to a counter-attack that a single prophylactic move would have stopped.

```board
fen: 4r1k1/p6p/1p3np1/3p1P2/q1pP4/1nP3N1/1B3QPP/4R1K1 w - - 1 26
arrows: e1e6
caption: Botvinnik – Capablanca after 25…Re8. White converts the central plan into a passed pawn with 26.Re6! Rxe6 27.fxe6.
```

## Play it

<p class="puzzle-intro">1 · Botvinnik – Capablanca, after 25…Re8. Black offers a rook trade. White has something better than a trade: a transformation.</p>

```try
fen: 4r1k1/p6p/1p3np1/3p1P2/q1pP4/1nP3N1/1B3QPP/4R1K1 w - - 1 26
solution: Re6
tolerance: 60
hint: Which exchange leaves White with a passed pawn on the sixth?
prompt: White to play. Convert the space into something concrete.
success: 26.Re6! Rxe6 27.fxe6. The e-pawn on e6 is the whole game from here: it cuts the black king off and every white piece plays around it.
```

<p class="puzzle-intro">2 · Up a bishop with queens on. Black's only hope is the attack on your king. Remove it.</p>

```try
fen: r4rk1/pp3ppp/2p5/4q3/2B5/2P1P3/P2Q1PPP/R4RK1 w - - 0 1
solution: Qd4
tolerance: 60
hint: Offer the exchange the opponent cannot refuse without losing the counterplay anyway.
prompt: White to play. Simplify.
success: Qd4 offers the queen trade. If Black exchanges, the ending with an extra bishop is trivial; if the queen leaves, White has gained time and the counterplay is gone.
```

## Remember

- Ahead: exchange pieces, keep pawns, do not hurry.
- Stop the counterplay before you start the harvest.
- Turn the advantage you have into one you can cash: passed pawn, extra piece, won ending.
- Winning a won game is the most practical skill in club chess. Practise it against the computer with an extra piece.

+++ Read more: Capablanca's method

Capablanca's reputation was built on converting small advantages without apparent effort, and *Chess Fundamentals* is largely an explanation of how. The recurring advice: when ahead, simplify; when you have the better ending, go into it; do not look for brilliance where technique will do. The play page in this app is a good practice ground: give yourself a winning position by taking back a computer blunder, then play the rest against the engine and see whether you can convert it.

+++
