---
id: endgames/king-and-pawn
track: Endgames
title: "King and pawn: opposition and the square"
lede: Two rules decide almost every king-and-pawn ending. Can the king catch the pawn? And who has the opposition?
level: 1
sources:
  - Capablanca, Chess Fundamentals (1921), chapter 1, "Pawn promotion" and "Pawn endings" — public domain, https://www.gutenberg.org/ebooks/33870
  - Wikipedia, "King and pawn versus king endgame" and "Opposition (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/King_and_pawn_versus_king_endgame
  - Positions checked with Stockfish 18.
---

## The square

Draw a square from the pawn to its queening square. If the defending king can step into that square on its move, it catches the pawn. If it cannot, the pawn queens. No counting needed.

```board
fen: 8/8/8/4k3/P7/8/8/6K1 b - - 0 1
highlight: a4, e4, e8, a8
caption: The square of the a4 pawn runs a4–e4–e8–a8. Black to move steps in with Kd5 or Kd4 and catches it. White to move plays a5, the square shrinks to a5–d5–d8–a8, and the king is out.
```

A pawn on its starting square can move two, so count its square from the third rank.

## The opposition

Kings facing each other with one square between them: whoever has to move loses ground, because a king cannot step forward into the other king's reach. The side that is *not* to move "has the opposition".

With a king and pawn against a lone king, the winning method is to get your king in front of the pawn and take the opposition, then step diagonally forward when the defender gives way. A spare pawn move is the way to pass the turn to the opponent.

```board
fen: 8/8/4k3/8/4K3/8/4P3/8 w - - 0 1
arrows: e2e3
caption: Kings on e4 and e6, White to move. 1.e3! passes the move to Black, who must step aside, and the white king walks past.
```

## Play it

<p class="puzzle-intro">1 · The square. White's b-pawn is running and the black king is on g6. Black to move.</p>

```try
fen: 8/8/6k1/8/1P6/8/8/7K b - - 0 1
solution: Kf5|Kf6|Kf7
hint: Draw the square from b4 to b8. Which king moves step inside it?
prompt: Black to play. Catch the pawn.
success: Any step into the square catches the pawn: Kf7 to e7, d7, c7 and then b8 arrives with the pawn, and Kf6 or Kf5 do the same.
```

<p class="puzzle-intro">2 · Winning with a tempo move. Kings on e4 and e6, pawn on e2, White to move. Take the opposition, then walk past.</p>

```try
fen: 8/8/4k3/8/4K3/8/4P3/8 w - - 0 1
solution: e3 Kd6 Kf5 Ke7 Ke5
hint: A king move loses the opposition. A pawn move passes the turn to Black.
prompt: White to play and win.
success: 1.e3 gave Black the move and Black had to give way. 2.Kf5 went round the side and 3.Ke5 took the opposition again, one rank further. The pawn queens.
```

<p class="puzzle-intro">3 · Defending. White has pushed to e6 and the black king is on e7 with the white king on d5. Only one move draws.</p>

```try
fen: 8/4k3/4P3/3K4/8/8/8/8 b - - 0 1
solution: Ke8 Kd6 Kd8 e7+ Ke8
hint: Stay in front of the pawn, and go straight back, not sideways.
prompt: Black to play and draw.
success: Straight back keeps the opposition: after 2.Kd6 Kd8 3.e7+ Ke8 4.Ke6 it is stalemate. Sideways to d8 or f8 loses, because the white king reaches d7 or f7 next to the pawn.
```

## Remember

- The square: if the defending king can step into it, the pawn is caught.
- The opposition: kings one square apart, the side not to move wins the argument.
- Winning: king in front of the pawn, take the opposition, use pawn moves to pass the turn.
- Drawing: king in front of the pawn, retreat straight back, never sideways. A pawn on the sixth giving check with the defender's king on the eighth is a draw.

+++ Read more: Capablanca's rule of thumb

Capablanca opens *Chess Fundamentals* with these endings because, as he says, they decide games and they teach the value of a single tempo. His method is the one taught here: bring the king to the pawn, put it in front, and count the opposition. He notes one shortcut worth memorising. If the attacking king reaches the sixth rank in front of its pawn, the game is won no matter whose move it is. If the pawn reaches the seventh rank with check, the game is drawn.

The rook pawn is the exception to everything: with the defender's king in the corner, or able to reach it, a rook pawn never wins, because the attacking king cannot get in front of it without stalemating the defender.

+++
