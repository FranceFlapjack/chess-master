// One board component for the whole app: rendering (cm-chessboard) + rules (chess.js)
// + animation, highlights, arrows, promotion, sounds and input handling.
import { Chess } from '../vendor/chess.js/chess.js'
import { Chessboard, COLOR, INPUT_EVENT_TYPE, BORDER_TYPE } from '../vendor/cm-chessboard/src/Chessboard.js'
import { Markers } from '../vendor/cm-chessboard/src/extensions/markers/Markers.js'
import { LearnArrows } from './arrows.js'
import { PromotionDialog, PROMOTION_DIALOG_RESULT_TYPE } from '../vendor/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js'
import { sound } from './sound.js'
import { progress } from './progress.js'

const ASSETS = new URL('../vendor/cm-chessboard/assets/', import.meta.url).href

// marker types must be shared references (the library matches by identity)
export const MARK = {
  last:  { class: 'mk-last',  slice: 'markerSquare' },
  from:  { class: 'mk-from',  slice: 'markerSquare' },
  check: { class: 'mk-check', slice: 'markerSquare' },
  hint:  { class: 'mk-hint',  slice: 'markerSquare' },
  good:  { class: 'mk-good',  slice: 'markerFrame' },
  bad:   { class: 'mk-bad',   slice: 'markerFrame' },
}
const ARROW = { main: { class: 'ar-main' }, alt: { class: 'ar-alt' }, bad: { class: 'ar-bad' } }

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
function animMs() {
  const v = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-anim')) || 220
  return reduced ? Math.min(v, 80) : v
}

export class Board {
  /**
   * @param {HTMLElement} el container (should be square via CSS)
   * @param {object} o  { fen, orientation:'w'|'b', coordinates, arrows:[], highlight:[], interactive:false|'turn'|'w'|'b', onMove(move, board) }
   */
  constructor(el, o = {}) {
    this.el = el
    this.chess = new Chess(o.fen || undefined)
    this.onMove = o.onMove || null
    this.judge = null // optional (move) => false to suppress the move sound (exercise plays its own)
    this.inputWho = null
    this.cb = new Chessboard(el, {
      position: this.chess.fen(),
      orientation: o.orientation === 'b' || o.orientation === 'black' ? COLOR.black : COLOR.white,
      assetsUrl: ASSETS,
      style: {
        cssClass: 'learn',
        showCoordinates: o.coordinates !== false,
        borderType: BORDER_TYPE.none,
        pieces: { file: 'pieces/staunty.svg' },
        animationDuration: animMs(),
      },
      extensions: [
        { class: Markers, props: { autoMarkers: null } },
        { class: LearnArrows },
        { class: PromotionDialog },
      ],
    })
    if (o.arrows) this.setArrows(o.arrows)
    if (o.highlight) this.setHighlights(o.highlight)
    this._paintCheck()
    if (o.interactive) this.enableInput(o.interactive === true ? 'turn' : o.interactive)
  }

  // ---- state ----
  fen() { return this.chess.fen() }
  turn() { return this.chess.turn() }
  history() { return this.chess.history({ verbose: true }) }

  /** Jump to a position (no history). lastMove: {from,to} to tint; play: 'auto' plays the sound that move would make. */
  async showPosition(fen, { lastMove = null, play = null, animate = true } = {}) {
    this.chess.load(fen)
    this.cb.removeMarkers(MARK.last)
    this.cb.removeMarkers(MARK.check)
    if (lastMove) this._markLast(lastMove)
    if (play === 'auto' && lastMove) this._sound(lastMove)
    else if (play) sound.play(play)
    await this.cb.setPosition(fen, animate)
    this._paintCheck()
  }

  /** Play a move (SAN string or {from,to,promotion}) from the current position. Returns the move or null. */
  async play(move, { animate = true, silent = false } = {}) {
    let m = null
    try { m = this.chess.move(move) } catch (_) { return null }
    if (!m) return null
    if (!silent) this._sound(m)
    this._markLast(m)
    await this.cb.setPosition(this.chess.fen(), animate)
    this._paintCheck()
    return m
  }

  async undo({ silent = false } = {}) {
    const m = this.chess.undo()
    if (!m) return null
    if (!silent) sound.play('move')
    this.cb.removeMarkers(MARK.last)
    const prev = this.chess.history({ verbose: true }).at(-1)
    if (prev) this._markLast(prev)
    await this.cb.setPosition(this.chess.fen(), true)
    this._paintCheck()
    return m
  }

  /** Replace the game with `sans` played from the start position; the board keeps a real history. */
  async setHistory(sans, { animate = true } = {}) {
    this.chess.reset()
    for (const s of sans) this.chess.move(s)
    this.cb.removeMarkers(MARK.last); this.cb.removeMarkers(MARK.check)
    const last = this.chess.history({ verbose: true }).at(-1)
    if (last) this._markLast(last)
    await this.cb.setPosition(this.chess.fen(), animate)
    this._paintCheck()
  }

  async flip() {
    const to = this.cb.getOrientation() === COLOR.white ? COLOR.black : COLOR.white
    await this.cb.setOrientation(to, true)
  }
  orientation() { return this.cb.getOrientation() === COLOR.white ? 'w' : 'b' }

  // ---- decorations ----
  /** arrows: ["e2e4", "g1f3:alt", {from,to,type}] */
  setArrows(list = []) {
    this.cb.removeArrows()
    for (const a of list) {
      let from, to, type = 'main'
      if (typeof a === 'string') {
        const [sq, t] = a.trim().split(':')
        from = sq.slice(0, 2); to = sq.slice(2, 4); if (t) type = t
      } else ({ from, to, type = 'main' } = a)
      this.cb.addArrow(ARROW[type] || ARROW.main, from, to)
    }
  }
  setHighlights(list = [], type = MARK.hint) {
    this.cb.removeMarkers(type)
    for (const s of list) this.cb.addMarker(type, String(s).trim())
  }
  mark(square, type = MARK.good) { this.cb.addMarker(type, square) }
  clearMarks(type) { this.cb.removeMarkers(type) }

  // ---- input ----
  /** who: 'turn' (whoever is to move), 'w', 'b' */
  enableInput(who = 'turn', onMove) {
    if (onMove) this.onMove = onMove
    this.inputWho = who
    const color = who === 'w' ? COLOR.white : who === 'b' ? COLOR.black : undefined
    if (this.cb.isMoveInputEnabled()) this.cb.disableMoveInput()
    this.cb.enableMoveInput(e => this._input(e), color)
  }
  disableInput() { this.inputWho = null; this.cb.disableMoveInput() }

  _input(e) {
    switch (e.type) {
      case INPUT_EVENT_TYPE.movingOverSquare:
        return
      case INPUT_EVENT_TYPE.moveInputStarted: {
        this._clearInputMarks()
        const moves = this.chess.moves({ square: e.squareFrom, verbose: true })
        if (!moves.length) return false
        this.cb.addLegalMovesMarkers(moves)
        this.cb.addMarker(MARK.from, e.squareFrom)
        return true
      }
      case INPUT_EVENT_TYPE.validateMoveInput: {
        this._clearInputMarks()
        const legal = this.chess.moves({ square: e.squareFrom, verbose: true }).filter(m => m.to === e.squareTo)
        if (!legal.length) return false // illegal square or re-selecting a piece: just snap back, no fuss
        if (legal[0].promotion) {
          const color = this.chess.turn() === 'w' ? COLOR.white : COLOR.black
          this.cb.showPromotionDialog(e.squareTo, color, r => {
            if (r && r.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
              this._commit({ from: e.squareFrom, to: e.squareTo, promotion: r.piece.charAt(1) })
            } else {
              this.cb.setPosition(this.chess.fen(), true)
            }
          })
          return true
        }
        this._commit({ from: e.squareFrom, to: e.squareTo })
        return true
      }
      case INPUT_EVENT_TYPE.moveInputCanceled:
        this._clearInputMarks()
        return
      default:
        return
    }
  }
  _clearInputMarks() { this.cb.removeLegalMovesMarkers(); this.cb.removeMarkers(MARK.from) }
  async _commit(mv) {
    await this.cb.state.moveInputProcess // let the library finish its own drop animation
    const m = this.chess.move(mv)
    if (!m) return
    const ok = this.judge ? this.judge(m) !== false : true // an exercise can veto the move sound
    if (ok) this._sound(m)
    this._markLast(m)
    await this.cb.setPosition(this.chess.fen(), true)
    this._paintCheck()
    progress.recordMove() // a move the reader played, on any board: the activity grid counts these
    if (this.onMove) this.onMove(m, this)
  }
  /** Brief shake of the piece on a square (used for a wrong answer). */
  shakePiece(square) {
    const el = this.el.querySelector(`.pieces-layer [data-square="${square}"]`)
    if (!el) return
    el.classList.remove('piece-shake'); void el.getBBox(); el.classList.add('piece-shake')
    setTimeout(() => el.classList.remove('piece-shake'), 450)
  }

  // ---- internals ----
  _sound(m) {
    const flags = m.flags || ''
    if (this.chess.isCheckmate()) sound.play('mate')
    else if (this.chess.isCheck()) sound.play('check')
    else if (flags.includes('k') || flags.includes('q')) sound.play('castle')
    else if (m.promotion) sound.play('promote')
    else if (flags.includes('c') || flags.includes('e')) sound.play('capture')
    else sound.play('move')
  }
  _markLast(m) {
    this.cb.removeMarkers(MARK.last)
    this.cb.addMarker(MARK.last, m.from)
    this.cb.addMarker(MARK.last, m.to)
  }
  _paintCheck() {
    this.cb.removeMarkers(MARK.check)
    if (!this.chess.isCheck()) return
    const k = this._king(this.chess.turn())
    if (k) this.cb.addMarker(MARK.check, k)
  }
  _king(color) {
    for (const row of this.chess.board()) for (const sq of row) if (sq && sq.type === 'k' && sq.color === color) return sq.square
    return null
  }
  destroy() { try { this.cb.destroy() } catch (_) {} }
}
