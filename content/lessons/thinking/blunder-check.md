---
id: thinking/blunder-check
track: How to think
title: The blunder check
lede: You have chosen a move. Before you play it, ask one question: what is the opponent's best reply? Most lost games are lost by skipping this.
level: 1
sources:
  - Standard advice in every teaching book; the framing here follows Rozman, How to Win at Chess (2023), paraphrased and credited.
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The question

Once you have a move in mind, imagine it played, and look at the board from the other side. Run the same routine as before: checks, captures, attacks, for the opponent. In particular:

- Does my move leave a piece undefended, or move a defender away from something?
- Does it open a line to my king?
- Can a knight fork anything after it?
- Does it walk into a pin or a discovered attack?

If the answer to any of these is yes, you have found the blunder before playing it. If the answer is no, play the move.

The puzzles below are from the other side: the opponent has just made a natural-looking move without the check. Punish it. Every blunder is a tactic for the other player, and this is what the blunder check is looking for.

## Play it

<p class="puzzle-intro">1 · White played 3.Ng5, threatening f7. It was a blunder.</p>

```try
fen: r1bqkbnr/pppp1ppp/2n5/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 1
solution: Qxg5
hint: Which white piece has no defender?
prompt: Black to play.
success: The knight on g5 was defended by nothing: the bishop on c1 is blocked by the d2 pawn. A one-move blunder check would have seen it.
```

<p class="puzzle-intro">2 · Black played …Qg5, attacking the knight on d5. It left something behind.</p>

```try
fen: r1b1kbnr/pp1ppppp/2p5/3N2q1/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1
solution: Nc7+
hint: Which check forks the king and something big?
prompt: White to play.
success: Nc7+ forks the king and the rook on a8. The queen left c7 unguarded when it went to g5.
```

<p class="puzzle-intro">3 · White has just played Bxh7+, the Greek gift. Here it does not work, because Black's queen guards g5.</p>

```try
fen: r4rk1/pppnqppB/4p3/3p4/3P4/2N1PN2/PPP2PPP/R1BQ1RK1 b - - 0 1
solution: Kxh7 Ng5+ Qxg5
hint: Take the bishop. The knight check that should follow can be captured.
prompt: Black to play.
success: Kxh7 Ng5+ Qxg5. The sacrifice needed Ng5 to be safe; the queen on e7 said otherwise. White's blunder check should have asked what defends g5.
```

## Remember

- Choose the move, then look from the other side before you play it.
- Undefended pieces, open lines to the king, knight forks, pins: the four usual answers.
- One question per move. It costs five seconds and saves the game.

+++ Read more: why we skip it

Everyone knows the rule, and everyone skips it when the move looks obvious, when the clock is low, or when the position is going well and it feels like nothing can go wrong. That is exactly when blunders happen, because the opponent's move is the one thing you are not looking at. The fix is not to think harder but to make the check mechanical: a five-second look from the other side, every move, whether it seems necessary or not. After a month it is invisible and the blunder rate halves.

+++
