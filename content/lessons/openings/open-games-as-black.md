---
id: openings/open-games-as-black
track: Openings
title: 1…e5 against 1.e4
lede: Meet 1.e4 in the centre. You need one answer to the Italian, one to the Ruy Lopez, one to the Scotch, and a calm reply to the early queen. Here they are.
level: 2
sources:
  - Wikibooks, Chess Opening Theory, 1.e4 e5 (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._e4/1...e5
  - Positions checked with Stockfish 18.
---

## The idea

1…e5 claims as much centre as White did. The price is that White chooses the opening, so Black needs a plan against each main try. The good news: one setup covers most of them. Knight to c6, knight to f6, bishop to c5 (or e7 against the Ruy Lopez), castle, then …d6 and …a6.

```board
fen: r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b - - 1 7
arrows: c5a7:alt, c8e6:alt, d6d5:alt
highlight: d5
caption: Black's setup against the Italian. The plans: …a6 and …Ba7 to keep the bishop, …Be6 to trade White's best piece, and the …d5 break when White is slow.
```

**Against the Ruy Lopez** play the Morphy Defence: 3…a6 4.Ba4 Nf6 5.O-O Be7, as in the Ruy Lopez lesson, but from the other side of the board. **Against the Scotch** (3.d4) take on d4 and put the bishop on c5, hitting the knight.

## Play it

<p class="puzzle-intro">1 · The Italian as Black. White's moves are played for you.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1
solution: e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O
hint: e5, Nc6, Bc5, Nf6, d6, castle.
prompt: Black to play. Reach the setup above.
success: Six natural moves and nothing is loose. Next: …a6, …Ba7, …h6, and watch for …d5.
```

<p class="puzzle-intro">2 · The Scotch. White opened the centre with 3.d4. You are Black.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1
solution: e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7
hint: Take on d4, then Bc5 attacking the knight, Qf6 to add pressure, and the knight to e7 so f7 stays defended.
prompt: Black to play. Meet the Scotch.
success: The bishop and queen both press on d4 and White must spend moves defending. Black is fully developed by move seven.
```

<p class="puzzle-intro">3 · The early queen: 2.Qh5. You are Black.</p>

```try
type: line
fen: rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2
solution: Nc6 Bc4 g6 Qf3 Nf6
hint: Nc6 defends e5, g6 chases the queen, Nf6 defends f7 and develops.
prompt: Black to play. Do not lose to Scholar's mate, and do not panic.
success: Every move developed or gained time. The queen will have to move again, and Black is ahead.
```

## Remember

- …Nc6, …Nf6, …Bc5 or …Be7, castle. Against most openings, the same six moves.
- Against the Scotch, take on d4 and hit the knight with the bishop.
- Against early queen sorties, develop with threats. Never move a pawn in front of your king unless it gains a tempo.
