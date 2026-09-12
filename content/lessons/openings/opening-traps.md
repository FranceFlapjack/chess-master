---
id: openings/opening-traps
track: Openings
title: Traps worth knowing
lede: Not to set them, mostly, but so that you never fall into them. The five that decide the most club games.
level: 1
sources:
  - Standard opening traps (Scholar's mate, the Petrov trap, the Englund Gambit trap, Légal's mate, the Elephant Trap); positions checked with Stockfish 18.
  - Wikipedia, "List of chess traps" (CC BY-SA), https://en.wikipedia.org/wiki/List_of_chess_traps
---

## The idea

A trap is a move that looks natural and loses at once. Every trap here has been played thousands of times because the losing move is the one a reasonable player wants to make. Knowing the pattern is enough: you will see it coming from a move away.

```board
fen: r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 3 3
arrows: h5f7:alt
highlight: f7
caption: The oldest trap. After 2.Qh5 and 3.Bc4, f7 is attacked twice. One careless developing move and it is mate.
```

## Play it

<p class="puzzle-intro">1 · Scholar's mate. Black played 3…Nf6??. You are White.</p>

```try
fen: r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4
solution: Qxf7#
hint: f7 is attacked twice and defended once.
prompt: White to play. Mate in one.
success: Know it so you never allow it. The defence is 3…g6, as in the principles lesson.
```

<p class="puzzle-intro">2 · The Petrov trap. Black copied White: 3.Nxe5 Nxe4? 4.Qe2 Nf6??. You are White.</p>

```try
fen: rnbqkb1r/pppp1ppp/5n2/4N3/8/8/PPPPQPPP/RNB1KB1R w KQkq - 2 5
solution: Nc6+ Qe7 Nxe7
hint: Move the knight off the e-file with a threat. The queen behind it gives discovered check.
prompt: White to play. Win the queen.
success: A discovered check that also attacks the queen. In the Petrov, Black must play 3…d6 first, and only then …Nxe4.
```

<p class="puzzle-intro">3 · The Englund Gambit trap. White grabbed the pawn and then the queen's bait: 5.Bd2 Qxb2 6.Bc3??. You are Black.</p>

```try
fen: r1b1kbnr/pppp1ppp/2n5/4P3/8/2B2N2/PqP1PPPP/RN1QKB1R b KQkq - 1 6
solution: Bb4 Qd2 Bxc3 Qxc3 Qc1#
hint: Pin the bishop to the queen, take it, and the white queen has to recapture on a square that lets your queen in.
prompt: Black to play. Mate in three.
success: 6.Bc3 looked like it trapped the queen. Instead the queen and bishop mate on the back rank. White should have played 6.Nc3.
```

<p class="puzzle-intro">4 · Légal's mate, once more. White's "pinned" knight moves anyway. You are White.</p>

```try
fen: rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5
solution: Nxe5 Bxd1 Bxf7+ Ke7 Nd5#
hint: If Black takes the queen, three minor pieces deliver mate.
prompt: White to play. Ignore the pin.
success: Two hundred and seventy years old. The lesson: a pin to the queen is only as strong as the mate you cannot see.
```

## Remember

- Early queen out, bishop on c4: look at f7 before every move.
- Copying moves in the Petrov loses to 4.Qe2. Play …d6 first.
- A "free" queen on move six is usually mate for the other side. Count the pieces around your king before you take it.
