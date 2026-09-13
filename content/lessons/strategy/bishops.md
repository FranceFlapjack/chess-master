---
id: strategy/bishops
track: Middlegame strategy
title: Good bishop, bad bishop, bishop pair
lede: A bishop is only as good as the diagonals its own pawns leave open. Two bishops together are more than twice one.
level: 2
sources:
  - Wikipedia, "Bad bishop" and "Bishop pair" as described in "Bishop (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Bishop_(chess)
  - Capablanca, Chess Fundamentals (1921), on the two bishops — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The rules

- **Bad bishop:** one whose own pawns stand on its colour. It is blocked by them and defends them, which is not a job worth a piece.
- **Good bishop:** one whose own pawns stand on the other colour, so the diagonals are open and the pawns cannot be attacked by the enemy bishop.
- **Bishop pair:** two bishops cover both colours. In open positions, and in endings with pawns on both wings, they are worth about half a pawn more than bishop and knight or two knights.

Practical rules: put your pawns on the opposite colour to your bishop; exchange your bad bishop for a good one or for a knight; with the pair, open the position; against it, keep it closed and trade one of them off.

```board
fen: 8/8/2p1k3/1pPp4/1P1P4/4KB2/8/2b5 w - - 0 1
highlight: b4, c5, d4
caption: Black's bishop is bad: its pawns on b5, c6 and d5 are on light squares and the bishop is a light-squared prisoner. White's bishop has the board.
```

## Play it

<p class="puzzle-intro">1 · Trade the bad bishop. Black's bishop on d7 is walled in by pawns on e6 and d5. White's on d3 is the good one. Black to move offers the exchange that fixes the problem.</p>

```try
fen: r2q1rk1/1p1bnppp/p3pn2/3p4/3P4/2NBBN2/PP3PPP/R2Q1RK1 b - - 0 1
solution: Bb5
tolerance: 60
hint: Which square gets the bishop outside the pawn chain and offers a trade?
prompt: Black to play. Solve the bad bishop.
success: On b5 the bishop stands outside its pawns and offers itself for White's good bishop on d3. Whether White exchanges or moves away, Black's worst piece has become a normal one.
```

<p class="puzzle-intro">2 · The bishop pair wants an open board. White has both bishops; the centre is still closed. Open it.</p>

```try
fen: r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2P1PN2/PP2BPPP/RNBQ1RK1 w - - 0 1
solution: dxc5
tolerance: 60
hint: Exchanges of pawns open diagonals.
prompt: White to play. Open lines for the bishops.
success: With the d-file and the long diagonals opening, the two bishops begin to outrun the knights. Keep exchanging pawns, not pieces, when you have the pair.
```

## Remember

- Pawns on the opposite colour to your bishop.
- Bad bishop: trade it, or get it outside the pawn chain.
- Two bishops: open the position and keep them both.
- Against two bishops: close the position and trade one.

+++ Read more: Capablanca on the two bishops

Capablanca ranks the bishop pair as a real advantage, enough to play for a win in an otherwise level ending, and the endgame lesson on minor pieces gives the reason: two bishops control both colours and can never be short of a diagonal, while a knight must cross the board one hop at a time. Steinitz had said the same forty years earlier and made it a matter of principle. In practical club games the more useful half of the rule is the negative one: notice when a bishop has been buried behind its own pawns, and either free it or exchange it before it becomes the reason you lose the ending.

+++
