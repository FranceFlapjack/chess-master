---
id: openings/opening-principles
track: Openings
title: Opening principles
lede: Before any named opening, five rules that decide most games under 1800. Every line you learn later is these rules applied to one position.
level: 1
sources:
  - J. R. Capablanca, Chess Fundamentals (1921), chapter on general theory — public domain, https://www.gutenberg.org/ebooks/33870
  - Wikibooks, Chess Opening Theory, introduction (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory
  - Composed and classic positions, checked with Stockfish 18.
---

## The idea

The opening is a race to get your pieces onto useful squares before the opponent does. Capablanca put it in one sentence: develop quickly, control the centre, and castle. Everything else follows.

1. **Take the centre with pawns.** e4 and d4, or one of them supported by c3 or e3. Pieces work best from the middle.
2. **Develop knights and bishops before the queen.** One move each, toward the centre. Knights before bishops, usually.
3. **Castle early**, by move ten. An uncastled king is the target of most opening tactics you have seen in the Tactics track.
4. **Do not move the same piece twice** unless it wins something or is forced.
5. **Do not grab pawns with the queen** while your pieces are at home. The queen is easy to chase, and every chase is a free developing move for the opponent.

```board
fen: r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1
arrows: e1g1
highlight: e4, d3, c4, f3, c3
caption: A textbook opening for both sides: centre pawns, knights and bishops out, and castling next. Nobody has moved a piece twice.
```

## Play it

<p class="puzzle-intro">1 · Someone brings the queen out on move two. You are Black. Meet Scholar's mate the calm way: develop with tempo, cover f7, and never touch the queen.</p>

```try
type: line
fen: rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2
solution: Nc6 Bc4 g6 Qf3 Nf6
hint: Develop a knight, then chase the queen with a pawn, then develop the other knight. Each move defends f7.
prompt: Black to play. Three developing moves that make the early queen look silly.
success: White has moved the queen twice and Black has three pieces out. That is the whole story of early queen attacks.
```

<p class="puzzle-intro">2 · Black played 2…f6 to defend the e-pawn. It weakens the king's diagonal, and there is a punishment.</p>

```try
fen: rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3
solution: Nxe5 fxe5 Qh5+ Ke7 Qxe5+ Kf7 Bc4+
hint: Give a knight to open the e8–h5 diagonal, then the queen comes in with check after check.
prompt: White to play. Punish 2…f6.
success: The Damiano Defence, refuted in the 1500s and still played by beginners every day. The king walks, and White gets far more than a knight.
```

## Remember

- Centre, pieces, castle. In that order, and fast.
- The queen comes out last. If the opponent's comes out first, develop with threats against it.
- Every pawn move that does not fight for the centre or free a piece is a wasted tempo.
