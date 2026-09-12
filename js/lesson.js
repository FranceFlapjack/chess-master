// Lesson renderer: Markdown (+ frontmatter) → HTML, with `board`, `pgn` and `try` fences mounted as components.
import { marked } from '../vendor/marked/marked.esm.js'
import { Board } from './board.js'
import { mountPgnViewer } from './pgn-viewer.js'
import { mountExercise } from './exercise.js'
import { progress } from './progress.js'

const BLOCKS = new Set(['board', 'pgn', 'try'])
marked.use({
  renderer: {
    code({ text, lang }) {
      if (BLOCKS.has(lang)) return `<div class="blk" data-kind="${lang}" data-src="${encodeURIComponent(text)}"></div>`
      return false
    },
  },
})

export function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, body: md }
  const meta = {}
  let listKey = null
  for (const raw of m[1].split(/\r?\n/)) {
    const li = raw.match(/^\s+-\s+(.*)$/)
    if (li && listKey) { meta[listKey].push(li[1].trim()); continue }
    const kv = raw.match(/^([\w-]+):\s*(.*)$/)
    if (kv) {
      if (kv[2] === '') { listKey = kv[1]; meta[kv[1]] = [] }
      else { listKey = null; meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1') }
    }
  }
  return { meta, body: md.slice(m[0].length) }
}

/** parse "key: value" lines; everything after the first blank line (or a line not matching) is `rest` */
export function parseParams(text) {
  const params = {}; const lines = text.split(/\r?\n/); let i = 0
  for (; i < lines.length; i++) {
    const kv = lines[i].match(/^([\w-]+):\s*(.*)$/)
    if (!kv) break
    params[kv[1]] = kv[2].trim()
  }
  params.rest = lines.slice(i).join('\n').trim()
  return params
}
const list = s => s ? s.split(/[,\s]+/).filter(Boolean) : []

/** `+++ Title` opens a collapsible "read more" section, a bare `+++` closes it. */
function expandSections(md) {
  return md.replace(/^\+\+\+[ \t]+(.+)$/gm, (_, t) => `<details class="more"><summary>${esc(t.trim())}</summary><div class="more-body">\n\n`)
           .replace(/^\+\+\+[ \t]*$/gm, '\n\n</div></details>')
}

export async function renderLesson(container, md, { lessonId, contentBase = 'content/', onSolved = null } = {}) {
  const { meta, body } = parseFrontmatter(md)
  const html = marked.parse(expandSections(body))
  const sources = Array.isArray(meta.sources) ? meta.sources : []
  container.innerHTML = `
    <article class="lesson">
      <header class="lesson-head">
        <span class="eyebrow">${esc(meta.track || '')}${meta.level ? ' · level ' + esc(meta.level) : ''}</span>
        <h1>${esc(meta.title || lessonId)}</h1>
        ${meta.lede ? `<p class="lede">${esc(meta.lede)}</p>` : ''}
      </header>
      <div class="prose lesson-body">${html}</div>
      ${sources.length ? `<section class="sources"><span class="eyebrow">Sources</span><ul>${sources.map(s => `<li>${linkify(esc(s))}</li>`).join('')}</ul></section>` : ''}
    </article>`

  const mounted = []
  const tryIds = []
  let tryIndex = 0
  for (const blk of container.querySelectorAll('.blk')) {
    const kind = blk.dataset.kind
    const src = decodeURIComponent(blk.dataset.src)
    const p = parseParams(src)
    if (kind === 'board') {
      const fig = document.createElement('figure'); fig.className = 'board-figure' + (p.image ? ' with-aside' : '')
      const aside = p.image ? `<div class="board-aside"><div class="photo${p.tone ? ' ' + esc(p.tone) : ''}"><img src="${esc(contentBase + 'images/' + p.image)}" alt="${esc(p.alt || '')}"${p.focus ? ` style="object-position: ${esc(p.focus)}"` : ''}></div>${p.credit ? `<div class="credit">${esc(p.credit)}</div>` : ''}</div>` : ''
      fig.innerHTML = `<div class="board-wrap"><div class="board"></div></div>${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}${aside}`
      blk.replaceWith(fig)
      mounted.push(new Board(fig.querySelector('.board'), {
        fen: p.fen, orientation: p.orientation, arrows: list(p.arrows), highlight: list(p.highlight),
        coordinates: p.coordinates !== 'false', interactive: p.interactive === 'true' ? 'turn' : false,
      }))
    } else if (kind === 'pgn') {
      let pgn = p.rest
      if (p.file) pgn = await (await fetch(contentBase + 'games/' + p.file)).text()
      const fig = document.createElement('figure'); blk.replaceWith(fig)
      const gameId = p.file || `${lessonId}#game`
      mounted.push(mountPgnViewer(fig, pgn, { orientation: p.orientation, start: +p.start || 0, id: gameId, onEnd: id => progress.recordGame(id) }))
    } else if (kind === 'try') {
      const fig = document.createElement('figure'); blk.replaceWith(fig)
      const ex = mountExercise(fig, p, { lessonId, index: tryIndex++, onSolved })
      tryIds.push(ex.id)
      mounted.push(ex)
    }
  }
  return { meta, mounted, tryIds }
}

function linkify(s) { return s.replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>') }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
