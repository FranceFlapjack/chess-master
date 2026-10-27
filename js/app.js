// App shell: curriculum sidebar, hash router, home and lesson pages, mute + activity footer.
import { renderLesson } from './lesson.js'
import { progress } from './progress.js'
import { mountActivity } from './activity-grid.js'
import { sound } from './sound.js'
import { mountPlay } from './play.js'
import { mountOpenings } from './openings.js'
import { mountGames } from './games.js'
import { setActiveViewer } from './pgn-viewer.js'
import { mountFamily } from './family.js'
import { mountWelcome } from './welcome.js'
import { mountTour } from './knight-tour.js'
import { mountStory } from './story.js'
import { mascot, catHeadHTML } from './mascot.js'

const $ = s => document.querySelector(s)
let curriculum = null
let current = null // {track, slug}
let unsubLesson = null
let unmountPage = null

const ICON_SOUND_ON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8v4h3l4 3V5L6 8zM13 7a4 4 0 010 6M15.5 4.5a7.5 7.5 0 010 11"/></svg>'
const ICON_SOUND_OFF = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8v4h3l4 3V5L6 8zM13 8l4 4M17 8l-4 4"/></svg>'

async function boot() {
  curriculum = await (await fetch('content/curriculum.json')).json()
  renderSidebar()
  mountActivity($('#activity'))
  const mute = $('#mute')
  const paintMute = () => { mute.innerHTML = sound.muted ? ICON_SOUND_OFF : ICON_SOUND_ON; mute.setAttribute('aria-pressed', String(sound.muted)); mute.title = sound.muted ? 'Sound off' : 'Sound on' }
  paintMute(); mute.addEventListener('click', () => { sound.toggle(); paintMute() })
  mountFamily('chess')
  // the cat's own switch, beside the sound: hints and tips go inline when it is off
  const cat = $('#cat')
  cat.innerHTML = catHeadHTML(20)
  const paintCat = () => { cat.setAttribute('aria-pressed', String(mascot.enabled)); cat.title = mascot.enabled ? 'Tips from the cat: on' : 'Tips from the cat: off' }
  paintCat(); cat.addEventListener('click', () => { mascot.enabled = !mascot.enabled })
  mascot.mount()   // the cat lives in its corner from the start, quiet until it has something to say
  document.addEventListener('mascot-toggle', paintCat)
  $('#menu').addEventListener('click', () => toggleSidebar())
  $('#scrim').addEventListener('click', () => toggleSidebar(false))
  document.addEventListener('pointerdown', () => sound.unlock(), { once: true })
  progress.onChange(() => renderSidebar())
  window.addEventListener('hashchange', route)
  // the series welcome, the first time this browser opens the app — a curtain over the app, not a route
  if (location.hash !== '#/welcome') welcome()
  route()
}

function visibleTracks() { return curriculum.tracks.filter(t => !t.beginner || progress.beginner) }
function allLessons() { return visibleTracks().flatMap(t => t.lessons.map(l => ({ ...l, track: t.id, trackTitle: t.title }))) }
function lessonId(track, slug) { return `${track}/${slug}` }

function renderSidebar() {
  const nav = $('#curriculum')
  const open = new Set([...nav.querySelectorAll('.track.open')].map(t => t.dataset.track))
  if (current) open.add(current.track)
  const playLink = `<a class="nav-play${location.hash.startsWith('#/play') ? ' current' : ''}" href="#/play"><span class="num">▶</span><span class="name">Play vs computer</span></a><a class="nav-play${location.hash.startsWith('#/openings') ? ' current' : ''}" href="#/openings"><span class="num">≡</span><span class="name">Openings book</span></a><a class="nav-play${location.hash.startsWith('#/games') ? ' current' : ''}" href="#/games"><span class="num">↺</span><span class="name">My games</span></a>`
  nav.innerHTML = '<div class="nav-label">Tools</div>' + playLink + '<div class="nav-label">Learn</div>' + visibleTracks().map((t, i) => {
    const ready = t.lessons.filter(l => l.ready)
    const done = ready.filter(l => progress.isLessonDone(lessonId(t.id, l.slug))).length
    const pct = ready.length ? Math.round(100 * done / ready.length) : 0
    return `<div class="track${open.has(t.id) ? ' open' : ''}" data-track="${t.id}">
      <button class="track-head" aria-expanded="${open.has(t.id)}">
        <span class="num">${t.beginner ? '0' : i + (progress.beginner ? 0 : 1)}</span><span class="name">${esc(t.title)}</span>
        <span class="bar" title="${done}/${ready.length} done"><i style="width:${pct}%"></i></span><span class="chev">▶</span>
      </button>
      <ul class="lessons">${t.lessons.map(l => {
        const id = lessonId(t.id, l.slug)
        const done = progress.isLessonDone(id)
        const cls = ['lesson-link', l.ready ? '' : 'planned', done ? 'done' : (progress.triesFor(id) ? 'started' : ''), current && current.track === t.id && current.slug === l.slug ? 'current' : ''].filter(Boolean).join(' ')
        return `<li><a class="${cls}" href="#/lesson/${t.id}/${l.slug}"${l.ready ? '' : ' aria-disabled="true"'}><span class="tick"></span><span>${esc(l.title)}</span>${l.ready ? '' : '<span class="soon">soon</span>'}</a></li>`
      }).join('')}</ul>
    </div>`
  }).join('')
  nav.querySelectorAll('.track-head').forEach(b => b.addEventListener('click', () => { const t = b.parentElement; t.classList.toggle('open'); b.setAttribute('aria-expanded', t.classList.contains('open')) }))
}

function toggleSidebar(force) {
  const s = $('#sidebar'), open = force ?? !s.classList.contains('open')
  s.classList.toggle('open', open); $('#scrim').classList.toggle('open', open)
}

/** The series welcome, with this app's knight's tour behind it. */
function welcome(force = false) { const w = mountWelcome({ app: 'chess', word: 'Chess', force }); if (w) mountTour(w.root) }

async function route() {
  if (location.hash === '#/welcome') {
    history.replaceState(null, '', '#/')
    welcome(true)
  }
  const hash = location.hash || '#/'
  const main = $('#main')
  toggleSidebar(false)
  document.documentElement.classList.remove('immersive')
  if (unmountPage) { unmountPage(); unmountPage = null }
  setActiveViewer(null) // the previous page's game viewer must not keep the arrow keys
  mascot.hide()         // a hint belongs to the page it was given on
  const m = hash.match(/^#\/lesson\/([\w-]+)\/([\w-]+)/)
  if (m) return showLesson(main, m[1], m[2])
  current = null
  renderSidebar()
  if (hash.startsWith('#/play')) { document.title = 'Play · Chess Master'; unmountPage = mountPlay(main); window.scrollTo({ top: 0 }); return }
  const om = hash.match(/^#\/openings(?:\/(\d+))?/)
  if (om) { document.title = 'Openings book · Chess Master'; unmountPage = mountOpenings(main, om[1]); return }
  if (hash.startsWith('#/games')) { document.title = 'My games · Chess Master'; unmountPage = mountGames(main); window.scrollTo({ top: 0 }); return }
  showHome(main)
}

function showHome(main) {
  document.title = 'Chess Master'
  document.documentElement.classList.add('immersive')   // the story gets the whole screen; the sidebar waits behind the menu
  const lessons = allLessons()
  const last = progress.state.lastLesson && lessons.find(l => lessonId(l.track, l.slug) === progress.state.lastLesson)
  const next = lessons.find(l => l.ready && !progress.isLessonDone(lessonId(l.track, l.slug)))
  const cont = last && !progress.isLessonDone(progress.state.lastLesson) ? last : next
  // a returning reader continues; a new one picks a door by what they already know
  const cta = last && cont === last
    ? { href: `#/lesson/${cont.track}/${cont.slug}`, label: `Continue: ${esc(cont.title)}`, today: 'Pick up where you left off', secondary: { href: '#/play', label: 'Play a game' } }
    : { href: '#/lesson/first-steps/the-board-and-the-pieces', label: 'New to chess? Start here', today: 'Your first lesson takes five minutes', secondary: { href: '#/lesson/thinking/checks-captures-attacks', label: 'I know how the pieces move' } }
  main.innerHTML = `
    <div id="story"></div>
    <div class="page home-course" id="course">
      <h2>The course</h2>
      ${cont ? `<div class="card continue"><div><span class="eyebrow">${last && cont === last ? 'Continue' : 'Start here'}</span><h3>${esc(cont.title)}</h3><div class="small">${esc(cont.trackTitle)}</div></div><a class="btn primary" href="#/lesson/${cont.track}/${cont.slug}">Open lesson</a></div>` : ''}
      <div class="track-grid">
        ${visibleTracks().map((t, i) => {
          const ready = t.lessons.filter(l => l.ready).length
          const done = t.lessons.filter(l => progress.isLessonDone(lessonId(t.id, l.slug))).length
          const first = t.lessons.find(l => l.ready)
          return `<a class="card track-card" href="${first ? `#/lesson/${t.id}/${first.slug}` : '#/'}"><span class="eyebrow">Track ${t.beginner ? 0 : i + (progress.beginner ? 0 : 1)}</span><h3>${esc(t.title)}</h3><p>${esc(t.blurb || '')}</p><span class="meta">${t.lessons.length} lessons · ${ready} ready${done ? ` · ${done} done` : ''}</span></a>`
        }).join('')}
      </div>
      <div class="switch-row">
        <button class="switch" id="beginner" role="switch" aria-checked="${progress.beginner}" aria-label="Show the beginner track"></button>
        <span>New to chess? Show the <em>First steps</em> track (how the pieces move, checkmate, notation).</span>
      </div>
      <h2>Tools</h2>
      <div class="tool-row">
        <a class="card" href="#/play"><span class="eyebrow">Play</span><h3>Against the computer</h3><span class="small">Stockfish at seven strengths, then your game reviewed move by move.</span></a>
        <a class="card feature" href="#/games"><span class="eyebrow">For chess.com players</span><h3>My games</h3><span class="small">Your chess.com games: openings, clock, the mistakes you repeat.</span></a>
        <a class="card" href="#/openings"><span class="eyebrow">Reference</span><h3>Openings book</h3><span class="small">84 lines with the idea behind each, drillable from either side.</span></a>
      </div>
    </div>`
  const stopStory = mountStory(main.querySelector('#story'), { cta })
  unmountPage = stopStory   // the story's boards and loops stop when the page changes
  $('#beginner').addEventListener('click', () => { progress.beginner = !progress.beginner; stopStory(); showHome(main); renderSidebar(); main.querySelector('#course').scrollIntoView() })
}

async function showLesson(main, track, slug) {
  const t = curriculum.tracks.find(x => x.id === track)
  const l = t && t.lessons.find(x => x.slug === slug)
  if (!l || !l.ready) { location.hash = '#/'; return }
  if (t.beginner && !progress.beginner) { progress.beginner = true }
  current = { track, slug }
  renderSidebar()
  const id = lessonId(track, slug)
  main.innerHTML = '<div class="page"><p class="small">Loading…</p></div>'
  let md
  try { md = await (await fetch(`content/lessons/${track}/${slug}.md`)).text() } catch (e) { main.innerHTML = '<div class="page"><p>Could not load this lesson.</p></div>'; return }
  const page = document.createElement('div'); page.className = 'page'
  main.innerHTML = ''; main.appendChild(page)
  if (unsubLesson) { unsubLesson(); unsubLesson = null }
  const { meta, tryIds } = await renderLesson(page, md, { lessonId: id, onSolved: () => checkAuto() })
  document.title = `${meta.title || slug} · Chess Master`
  progress.setLastLesson(id)

  // complete row + prev/next. A lesson with puzzles completes itself when all of them are solved.
  const lessons = allLessons(); const idx = lessons.findIndex(x => x.track === track && x.slug === slug)
  const prev = lessons.slice(0, idx).reverse().find(x => x.ready), next = lessons.slice(idx + 1).find(x => x.ready)
  const row = document.createElement('div'); row.className = 'complete-row'
  const solvedCount = () => tryIds.filter(t => progress.isTryDone(t)).length
  // once every puzzle is solved, the way on sits right under the last one rather than at the bottom of the page
  const nextUp = document.createElement('a'); nextUp.className = 'next-up'
  if (next) { nextUp.href = `#/lesson/${next.track}/${next.slug}`; nextUp.innerHTML = `<span><span class="eyebrow">Lesson complete · Next</span><b>${esc(next.title)}</b></span><span class="go" aria-hidden="true">→</span>` }
  const paintRow = () => {
    const done = progress.isLessonDone(id); row.classList.toggle('done', done)
    const lastTry = [...page.querySelectorAll('figure.exercise')].pop()
    if (done && next && lastTry && tryIds.length && solvedCount() === tryIds.length) lastTry.after(nextUp); else nextUp.remove()
    if (done) row.innerHTML = `<span class="msg">Lesson complete.</span>${tryIds.length ? `<span class="count">${solvedCount()}/${tryIds.length} puzzles</span>` : ''}`
    else if (tryIds.length) row.innerHTML = `<span class="msg">Solve the puzzles to complete this lesson.</span><span class="count">${solvedCount()}/${tryIds.length}</span><button class="btn quiet" id="complete">Mark as read instead</button>`
    else row.innerHTML = `<button class="btn primary" id="complete">Mark as read</button><span class="msg">Ticks the lesson in the sidebar.</span>`
    const b = row.querySelector('#complete'); if (b) b.addEventListener('click', () => { progress.completeLesson(id); sound.play('success'); paintRow() })
  }
  function checkAuto() {
    if (!progress.isLessonDone(id) && tryIds.length && solvedCount() === tryIds.length) { progress.completeLesson(id); sound.play('success') }
    paintRow()
  }
  paintRow(); page.appendChild(row)
  unsubLesson = progress.onChange(paintRow)
  const nav = document.createElement('nav'); nav.className = 'lesson-nav'
  nav.innerHTML = `<div>${prev ? `<a href="#/lesson/${prev.track}/${prev.slug}"><span class="eyebrow">Previous</span>${esc(prev.title)}</a>` : ''}</div><div class="next">${next ? `<a href="#/lesson/${next.track}/${next.slug}"><span class="eyebrow">Next</span>${esc(next.title)}</a>` : '<a href="#/"><span class="eyebrow">Next</span>Back to the course</a>'}</div>`
  page.appendChild(nav)
  window.scrollTo({ top: 0 })
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }

boot()
