---
id: openings/caro-kann
track: Openings
title: Caro-Kann against 1.e4
lede: 1.e4 c6, then …d5. A solid answer to 1.e4 with a healthy pawn structure and a bishop that gets out before …e6 locks it in.
level: 2
sources:
  - Wikibooks, Chess Opening Theory, Caro-Kann Defence (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._e4/1...c6
  - Deep Blue – Kasparov, New York 1997, game 6. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Deep_Blue_versus_Kasparov,_1997,_Game_6
  - Réti – Tartakower, Vienna 1910 (see the discovered-attack lesson) and the Nd6 mate trap, both standard; positions checked with Stockfish 18.
---

## The idea

Black supports …d5 with the c-pawn instead of the e-pawn, so the light-squared bishop can come out to f5 or g4 first. The result is a position with no weaknesses, which is why Karpov and Kasparov both used it for decades. The cost is a slower development than 1…e5.

```board
fen: r2qkbnr/pp1nppp1/2p4p/7P/3P4/3Q1NN1/PPP2PP1/R1B1K2R b KQkq - 0 10
arrows: e7e6, g8f6:alt, d8c7:alt
highlight: e6, f6, c7
caption: The Classical main line after 10.Qxd3. Black has traded the bishop and will play …e6, …Ngf6, …Qc7 and castle either side. White has more space; Black has no weaknesses.
```

**Black's setup.** …e6, …Ngf6, …Be7 or …Bd6, …Qc7, castle. Break later with …c5. **The traps.** Both go against Black: the knight mate on d6 after a careless …Ngf6, and the e6 sacrifice Kasparov allowed against Deep Blue. Know the move orders.

## Play it

<p class="puzzle-intro">1 · Play the Classical Caro-Kann as Black to move ten.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1
solution: c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3
hint: c6, d5, take on e4, Bf5, Bg6, h6, Nd7, Bh7, and trade on d3.
prompt: Black to play. Reach the position above.
success: The bishop went out before the pawn chain closed, was chased across the board, and was traded with no loss of time. Now …e6 and …Ngf6.
```

<p class="puzzle-intro">2 · The mate trap. After 4…Nd7 5.Qe2 Black played 5…Ngf6??. You are White.</p>

```try
fen: r1bqkb1r/pp1npppp/2p2n2/8/3PN3/8/PPP1QPPP/R1B1KBNR w KQkq - 3 6
solution: Nd6#
hint: The queen on e2 looks through e7 at the king. One knight move covers everything.
prompt: White to play. Mate in one.
success: The knight is protected by nothing, but the pawn on e7 is pinned and the king has no squares. Black must play 5…Ndf6 or 5…e6 here.
```

<p class="puzzle-intro">3 · Deep Blue – Kasparov, 1997. Kasparov played 7…h6 one move too soon. You are the machine.</p>

```try
fen: r1bqkb1r/pp1n1pp1/2p1pn1p/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 8
solution: Nxe6 Qe7 O-O fxe6 Bg6+
hint: Give the knight on e6. Whatever recaptures, the king stays in the centre and the bishop comes to g6 with check.
prompt: White to play. Find the sacrifice that beat the world champion.
success: Kasparov resigned eleven moves later. The lesson for Black: in this line play 7…Bd6 before 7…h6.
```

## Remember

- …c6 and …d5, bishop out to f5 before …e6.
- After Nxe4, never play …Ngf6 while the white queen is on e2 and a knight can reach d6.
- The whole opening is about avoiding weaknesses. If you find yourself attacking early, you have left the Caro-Kann.

+++ Read more: Deep Blue – Kasparov in full

```pgn
file: deep-blue-kasparov-1997-g6.pgn
```

+++
