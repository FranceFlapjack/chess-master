---
id: tactics/discovered-attack
track: Tactics
title: Discovered attack and discovered check
lede: One piece moves, and a second piece behind it attacks. The moving piece is free to do anything, because the real threat comes from behind.
level: 2
sources:
  - Réti – Tartakower, Vienna 1910. Move list checked against Edward Winter's Chess Notes, https://www.chesshistory.com/winter/extra/retitartakower.html
  - French Advance trap 5...Qb6 6.Bd3? cxd4 7.cxd4 Nxd4 8.Nxd4 Qxd4 9.Bb5+, as given in the Wikipedia article "Discovered attack" (CC BY-SA), https://en.wikipedia.org/wiki/Discovered_attack
  - Composed position for this lesson, checked with Stockfish 18.
---

## The idea

Put a piece in front of your own rook, bishop or queen. When the front piece moves, the piece behind attacks along the line. The front piece can capture, give check or attack something else at the same time, so the opponent faces two threats from one move.

When the discovered attack hits the king it is a **discovered check**, and the moving piece can go anywhere. When both pieces give check it is a **double check**, and the king must move: nothing can be captured or blocked.

```board
fen: rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9
arrows: d3d8, d2g5:alt, d1d8:alt
highlight: d8
caption: Réti – Tartakower, 1910, after 8…Nxe4. The queen goes to d8 with check, and after Kxd8 the bishop moves to g5 with double check from bishop and rook.
```

## Play it

<p class="puzzle-intro">1 · Réti – Tartakower, Vienna 1910. The most famous eleven-move game in chess.</p>

```try
fen: rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9
solution: Qd8+ Kxd8 Bg5+ Kc7 Bd8#
hint: Drag the king onto the d-file, then move the bishop with double check.
prompt: White to play. Mate in three.
success: Double check with the bishop and the rook. The king could only run to c7 or e8, and both are mate.
```

<p class="puzzle-intro">2 · A trap from the French Defence. Black has just taken a pawn on d4 with the queen.</p>

```try
fen: r1b1kbnr/pp3ppp/4p3/3pP3/3q4/3B4/PP3PPP/RNBQK2R w KQkq - 0 9
solution: Bb5+ Bd7 Bxd7+ Kxd7 Qxd4
hint: The bishop on d3 stands between the white queen and the black queen. Move it with check, and keep checking until the queen is yours.
prompt: White to play. Win the queen.
success: The bishop gave check, and the queen behind it took the queen. Black never had time to save it.
```

<p class="puzzle-intro">3 · Discovered check. The knight can go anywhere, so send it where it does the most damage.</p>

```try
fen: 3qk3/8/8/4N3/8/8/8/4R1K1 w - - 0 1
solution: Nc6 Kf7 Nxd8
hint: When the knight moves, the rook checks. Which knight square also attacks the queen?
prompt: White to play. Win the queen.
success: Black had to answer the check and could not save the queen at the same time.
```

## Remember

- Look for your own pieces standing in front of your rooks, bishops and queens. Each one is a loaded gun.
- The moving piece can do anything: capture, check, or attack. Choose the square that makes a second threat.
- Double check cannot be blocked or captured away. Only a king move answers it.

+++ Read more: Réti – Tartakower in full

```pgn
file: reti-tartakower-1910.pgn
```

+++
