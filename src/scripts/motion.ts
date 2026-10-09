// Every animation of the landing, loaded after the first paint. The page is complete without it: what moves starts
// in its final, readable state in the HTML (html.pending only hides the sketch and the title for a moment, with a
// 1.5-second safety net), and with reduced motion or the "pause motion" button it stays still.
//
// The story, in order:
//   1. The kiskadee is sketched in ink, then washed with colour; its eye follows the pointer.
//   2. Bugs walk about: on wide screens all over the page, on phones and tablets beside the drawing. They run from
//      the pointer (or a finger) and go back to their business; a click or a tap next to one sends the kiskadee out
//      from its perch (the counter) to take it on the wing, as it hunts. Everywhere, the specimens (already caught)
//      are stamped as they scroll in.
//   3. The terminal types itself, the ledger gets its hanko, the tags ride a conveyor, the Jira card turns over, the
//      naturalist's notes write themselves and, on wide screens, each plate is uncovered like a turning page.

type Gsap = typeof import('gsap').gsap
type Trigger = typeof import('gsap/ScrollTrigger').ScrollTrigger
type Point = { x: number; y: number }

const STORAGE = 'pitangus-motion'
const root = document.documentElement
const WIDE = '(min-width: 64rem)'
// Everything below animates the landing. Elsewhere (the 404) the kiskadee only bobs on its perch, in CSS, which
// html.still stops.
const landing = document.querySelector('[data-field]') !== null
let teardown: (() => void) | null = null

// The counter in the header: bugs caught around the page, and specimens.
const tally = { page: 0, specimens: 0 }

export function start() {
  // Changing language turns the page: the next one comes in complete (see the inline script in Base.astro).
  document.querySelectorAll('[data-turn]').forEach(link => link.addEventListener('click', () => {
    try { sessionStorage.setItem('pitangus-turn', '1') } catch { /* then it just plays its entrance */ }
  }))
  wireCopyButtons()
  wireMotionToggle()
  wireThemeToggle()
  if (!landing) { root.classList.remove('pending'); return }
  const wanted = !root.classList.contains('still') && !matchMedia('(prefers-reduced-motion: reduce)').matches
  if (wanted) void run()
  else settle()
}

// The final state, without animation: specimens caught, nothing hidden.
function settle() {
  root.classList.remove('pending')
  document.querySelectorAll<HTMLElement>('[data-type]').forEach(element => { element.textContent = element.dataset.command ?? element.textContent })
  const caught = document.querySelectorAll<HTMLElement>('[data-specimen]')
  caught.forEach(item => item.classList.add('is-caught'))
  Object.assign(tally, { page: 0, specimens: caught.length })
  paintCounter()
}

// Lets the browser paint and handle input between two pieces of the set-up: one long task would block a phone.
const breathe = () => new Promise<void>(resolve => setTimeout(resolve, 0))

async function run() {
  if (!landing) return
  // On touch screens Lenis doesn't smooth the finger's scroll anyway: native scrolling, one script and a per-frame job less.
  const touch = matchMedia('(hover: none)').matches
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, Lenis] = await Promise.all([
    import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('gsap/DrawSVGPlugin'),
    touch ? null : import('lenis').then(module => module.default),
  ])
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)
  // On phones the address bar shows and hides as you scroll, changing the viewport's height: recomputing the held
  // plates then would make the page jump under the finger.
  ScrollTrigger.config({ ignoreMobileResize: true })
  const lenis = Lenis ? new Lenis({ anchors: true, lerp: 0.12 }) : null
  const onTick = (time: number) => lenis?.raf(time * 1000)
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
  }
  Object.assign(tally, { page: 0, specimens: 0 })
  paintCounter()

  const cleanups: (() => void)[] = []
  const media = gsap.matchMedia()
  // The safety net already showed the page (the script came late): don't hide it again to animate its entrance.
  const late = !root.classList.contains('pending')
  // The entrance first, in the same task as the first frame it animates; the rest of the page a piece at a time.
  const context = gsap.context(() => {
    ink(gsap, late)
    cleanups.push(eyes(gsap))
    // html.pending hides the notes until they write themselves: they must be set up before it goes.
    notes(gsap, ScrollTrigger, late)
  })
  root.classList.remove('pending')
  let stopped = false
  teardown = () => {
    stopped = true
    cleanups.forEach(cleanup => cleanup())
    media.revert()
    context.revert()
    document.querySelectorAll('.critter, .leaf').forEach(element => element.remove())
    gsap.ticker.remove(onTick)
    lenis?.destroy()
  }
  const pieces: (() => void)[] = [
    // The big set pieces (bugs all over the page, the turning pages) are for wide screens. On phones and tablets a
    // few bugs walk beside the drawing and the specimens are stamped as they scroll in: lighter, and nothing fights
    // with touch scrolling.
    () => media.add({ wide: WIDE, narrow: `not all and ${WIDE}` }, matched => {
      Object.assign(tally, { page: 0, specimens: 0 })
      paintCounter()
      stamps(gsap, ScrollTrigger)
      if (!matched.conditions?.wide) return snack(gsap, ScrollTrigger)
      const bugsOnPage = swarm(gsap, ScrollTrigger)
      pages(gsap)
      return () => {
        bugsOnPage()
        document.querySelectorAll('.leaf').forEach(element => element.remove())
      }
    }),
    () => reveals(gsap, SplitText),
    () => terminal(gsap, ScrollTrigger),
    () => ledger(gsap, ScrollTrigger),
    () => { belt(gsap); card(gsap) },
    () => numerals(gsap),
  ]
  for (const piece of pieces) {
    await breathe()
    if (stopped) return
    context.add(piece)
  }
  // Only if the fonts weren't there yet: a refresh once the reader is scrolling moves the held plates under them.
  if (document.fonts.status !== 'loaded') void document.fonts.ready.then(() => ScrollTrigger.refresh())
}

// --- 1. the ink sketch ------------------------------------------------------------------------------------------------

function ink(gsap: Gsap, late: boolean) {
  const mascot = document.querySelector('[data-mascot]')
  if (!mascot) return
  if (!late) {
    // Pencil first, then the ink over it, then colour and shading, each to its own opacity.
    const pencil = mascot.querySelectorAll('[data-pencil]')
    const inkLayer = mascot.querySelector('[data-ink-layer]')
    const washes = mascot.querySelectorAll('[data-wash]')
    // It only starts blinking once it is drawn: a lid closing over an eye not yet painted is a black blot.
    const timeline = gsap.timeline({ delay: 0.2, onComplete: () => blink(gsap) })
      .from(pencil, { opacity: 0, duration: 0.6, stagger: 0.08, ease: 'sine.out' })
    // The ink goes down from the crown to the tail, as if drawn, then the colour washes over it.
    if (inkLayer) timeline.fromTo(inkLayer, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'sine.inOut' }, '-=0.2')
    timeline.from(washes, { opacity: 0, duration: 1, stagger: 0.12, ease: 'sine.out' }, '-=0.4')
    // The lines of the title rise into place.
    // y: 0 as well: while the page loaded, CSS held them down, and GSAP would otherwise keep that offset in pixels.
    gsap.fromTo('.hero .line-inner', { y: 0, yPercent: 130 }, { y: 0, yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' })
    gsap.from('.hero [data-reveal]', { y: 18, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 })
  }
  // Alive, quietly: it breathes on its perch, from the feet.
  gsap.to('.mascot-figure', { scaleY: 1.008, transformOrigin: '50% 80%', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 })
  if (late) blink(gsap)
}

// A real blink: the lid comes down fast, rises a bit slower, at uneven intervals, now and then twice.
function blink(gsap: Gsap) {
  const lid = document.querySelector('[data-lid]')
  if (!lid) return
  // Scaled from its own 0 0, the top of the eye (Mascot.astro): no origin for GSAP to work out.
  gsap.set(lid, { scaleY: 0, transformOrigin: '0 0' })
  const once = () => gsap.timeline().to(lid, { scaleY: 1, duration: 0.07, ease: 'sine.in' }).to(lid, { scaleY: 0, duration: 0.13, ease: 'sine.out' })
  const next = () => {
    if (root.classList.contains('still') || !root.contains(lid)) return  // motion was paused: stop blinking
    const timeline = once()
    if (Math.random() < 0.25) timeline.add(once(), '+=0.12')
    gsap.delayedCall(gsap.utils.random(2.8, 6.5), next)
  }
  gsap.delayedCall(3.2, next)
}

// The eye looks toward the pointer: its iris and pupil move up to data-reach (drawing units) from where they rest.
function eyes(gsap: Gsap) {
  const pupil = document.querySelector<SVGElement>('[data-pupil]')
  const eye = document.querySelector<SVGElement>('[data-eye]')
  if (!pupil || !eye) return () => {}
  const reach = Number(eye.dataset.reach ?? 0.9)
  const moveX = gsap.quickTo(pupil, 'x', { duration: 0.35, ease: 'power3.out' })
  const moveY = gsap.quickTo(pupil, 'y', { duration: 0.35, ease: 'power3.out' })
  const look = (event: PointerEvent) => {
    const box = eye.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2), dy = event.clientY - (box.top + box.height / 2)
    const distance = Math.hypot(dx, dy) || 1
    moveX((dx / distance) * reach)
    moveY((dy / distance) * reach)
  }
  addEventListener('pointermove', look, { passive: true })
  return () => removeEventListener('pointermove', look)
}

// --- 2. the bugs ------------------------------------------------------------------------------------------------------

// Caught and pinned, not eaten: a specimen stays in the collection, with its stamp.
function pin(gsap: Gsap, item: HTMLElement) {
  const bug = item.querySelector('[data-bug]')
  const stamp = item.querySelector('[data-caught]')
  const timeline = gsap.timeline()
  if (bug) timeline.to(bug, { keyframes: [{ rotate: -14, duration: 0.07 }, { rotate: 12, duration: 0.07 }, { rotate: -8, duration: 0.07 }, { rotate: 0, scale: 0.94, duration: 0.18 }] })
  timeline.call(() => item.classList.add('is-caught'))
  if (stamp) timeline.fromTo(stamp, { scale: 1.8, opacity: 0, rotate: -18 }, { scale: 1, opacity: 1, rotate: -8, duration: 0.45, ease: 'back.out(3)' }, '-=0.05')
  return timeline.call(() => { tally.specimens = document.querySelectorAll('[data-specimen].is-caught').length; paintCounter() })
}

// Phones and tablets: three bugs walk around beside the drawing; touch one (or point at it) and it scurries off, then
// goes back to walking.
function snack(gsap: Gsap, ScrollTrigger: Trigger) {
  const field = document.querySelector<HTMLElement>('[data-field]')
  const frame = document.querySelector<HTMLElement>('.hero .frame')
  if (!field || !frame) return () => {}
  const spots = [{ u: 0.86, v: 0.7 }, { u: 0.6, v: 0.88 }, { u: 0.9, v: 0.92 }]
  const bugs = spots.map(() => critter(field))
  const homes: Point[] = spots.map(() => ({ x: 0, y: 0 }))
  const layout = () => {
    const box = field.getBoundingClientRect(), frameBox = frame.getBoundingClientRect()
    spots.forEach((spot, index) => {
      homes[index] = { x: frameBox.left - box.left + spot.u * frameBox.width, y: frameBox.top - box.top + spot.v * frameBox.height }
      gsap.set(bugs[index], { left: homes[index].x - 17, top: homes[index].y - 17 })
    })
  }
  layout()
  ScrollTrigger.addEventListener('refreshInit', layout)

  const walks: (GSAPTimeline | undefined)[] = []
  // Never off the screen's edges: the offsets are clamped so the whole bug stays inside the page.
  const inside = (index: number, to: Point): Point => ({ x: clamp(to.x, 18 - homes[index].x, field.offsetWidth - 18 - homes[index].x), y: to.y })
  const heading = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI + 90
  // Turn towards a nearby point, walk there at a bug's pace, pause, and pick the next one.
  const walk = (index: number) => {
    const bug = bugs[index]
    const from = { x: Number(gsap.getProperty(bug, 'x')), y: Number(gsap.getProperty(bug, 'y')) }
    const to = inside(index, { x: gsap.utils.random(-44, 44), y: gsap.utils.random(-28, 28) })
    const dx = to.x - from.x, dy = to.y - from.y
    walks[index] = gsap.timeline({ onComplete: () => walk(index) })
      .to(bug, { rotation: heading(dx, dy), duration: 0.3, ease: 'power1.inOut' })
      .call(() => pose(bug, 'walk'))
      .to(bug, { x: to.x, y: to.y, duration: Math.max(0.6, Math.hypot(dx, dy) / 26), ease: 'none' })
      .call(() => pose(bug, null))
      .to({}, { duration: gsap.utils.random(0.4, 1.6) })
  }
  bugs.forEach((bug, index) => {
    gsap.fromTo(bug, { opacity: 0, scale: 0.5, rotation: index * 120 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 1.4 + index * 0.15, ease: 'back.out(1.8)', onComplete: () => walk(index) })
    // The legs take turns (the drawing's own stride); the body only sways a little.
    gsap.to(bug.querySelector('.critter-body'), { rotation: 'random(-3, 3)', duration: 0.12, ease: 'none', repeat: -1, yoyo: true, repeatRefresh: true })
  })

  // A tap right next to a bug: the kiskadee takes it, and a while later another walks in at its spot.
  const caught = new Set<number>()
  const take = (event: PointerEvent): boolean => {
    if (event.type !== 'pointerdown' || !onPage(event)) return false
    const index = bugs.findIndex((bug, at) => {
      if (caught.has(at)) return false
      const box = bug.getBoundingClientRect()
      return Math.hypot(box.left + box.width / 2 - event.clientX, box.top + box.height / 2 - event.clientY) < 60
    })
    if (index < 0) return false
    caught.add(index)
    walks[index]?.kill()
    const sent = sally(gsap, bugs[index], () => {
      tally.page += 1
      paintCounter()
      gsap.set(bugs[index], { x: 0, y: 0, delay: 0.2 })
      gsap.fromTo(bugs[index], { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, delay: 8, ease: 'back.out(1.8)',
        onComplete: () => { caught.delete(index); walk(index) } })
    })
    if (!sent) { caught.delete(index); walk(index) }
    return sent
  }

  // A finger (or a pointer) close by: it runs straight away from it, then calms down and walks again.
  const scare = (event: PointerEvent) => {
    if (take(event)) return
    const box = field.getBoundingClientRect()
    const pointer = { x: event.clientX - box.left, y: event.clientY - box.top }
    bugs.forEach((bug, index) => {
      if (caught.has(index)) return
      const at = { x: homes[index].x + Number(gsap.getProperty(bug, 'x')), y: homes[index].y + Number(gsap.getProperty(bug, 'y')) }
      const dx = at.x - pointer.x, dy = at.y - pointer.y, distance = Math.hypot(dx, dy) || 1
      if (distance > 80) return
      walks[index]?.kill()
      const to = inside(index, { x: clamp(Number(gsap.getProperty(bug, 'x')) + (dx / distance) * 70, -70, 70),
                                 y: clamp(Number(gsap.getProperty(bug, 'y')) + (dy / distance) * 70, -50, 50) })
      // A fly that's startled takes off: a short hop on the wing, then it lands and walks again.
      walks[index] = gsap.timeline({ onComplete: () => walk(index) })
        .call(() => pose(bug, 'fly'))
        .to(bug, { rotation: heading(dx, dy), duration: 0.08 })
        .to(bug, { x: to.x, y: to.y, duration: 0.35, ease: 'power3.out' })
        .call(() => pose(bug, null))
        .to({}, { duration: 0.9 })
    })
  }
  addEventListener('pointerdown', scare, { passive: true })
  addEventListener('pointermove', scare, { passive: true })
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', layout)
    removeEventListener('pointerdown', scare)
    removeEventListener('pointermove', scare)
    walks.forEach(timeline => timeline?.kill())
    bugs.forEach(bug => bug.remove())
  }
}

// The specimens get their stamp as they scroll in.
function stamps(gsap: Gsap, ScrollTrigger: Trigger) {
  gsap.utils.toArray<HTMLElement>('[data-specimen]').forEach(item => {
    item.classList.remove('is-caught')
    ScrollTrigger.create({ trigger: item, start: 'top 70%', once: true, onEnter: () => pin(gsap, item) })
  })
}

// --- 3. the plates ------------------------------------------------------------------------------------------------

function reveals(gsap: Gsap, Split: typeof import('gsap/SplitText').SplitText) {
  gsap.utils.toArray<HTMLElement>('.plate [data-split]').forEach(title => {
    Split.create(title, { type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: self => {
        // The masks clip each line; room above and below keeps accents and descenders (é, g, p) whole.
        self.masks.forEach(mask => Object.assign((mask as HTMLElement).style, { paddingBlock: '0.16em', marginBlock: '-0.16em' }))
        return gsap.from(self.lines, { yPercent: 120, duration: 1, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: title, start: 'top 85%', once: true } })
      } })
  })
  gsap.utils.toArray<HTMLElement>('.plate [data-reveal]').forEach(element => {
    gsap.from(element, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
  })
}

function terminal(gsap: Gsap, ScrollTrigger: Trigger) {
  const box = document.querySelector<HTMLElement>('[data-terminal]')
  const typed = box?.querySelector<HTMLElement>('[data-type]')
  if (!box || !typed) return
  const command = typed.dataset.command ?? typed.textContent ?? ''
  const lines = box.querySelectorAll('[data-out]')
  gsap.set(lines, { opacity: 0, y: 6 })
  typed.textContent = ''
  ScrollTrigger.create({ trigger: box, start: 'top 75%', once: true, onEnter: () => {
    const state = { count: 0 }
    gsap.timeline()
      .to(state, { count: command.length, duration: command.length * 0.045, ease: 'none', onUpdate: () => { typed.textContent = command.slice(0, Math.round(state.count)) } })
      .to(lines, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'power2.out' }, '+=0.35')
  } })
}

function ledger(gsap: Gsap, ScrollTrigger: Trigger) {
  const book = document.querySelector<HTMLElement>('[data-ledger]')
  const stamp = book?.querySelector<HTMLElement>('[data-hanko]')
  if (!book || !stamp) return
  gsap.set(stamp, { opacity: 0 })
  ScrollTrigger.create({ trigger: book, start: 'top 60%', once: true, onEnter: () => {
    gsap.timeline()
      .from(book.querySelectorAll('[data-row]'), { x: -16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })
      .fromTo(stamp, { scale: 2.4, opacity: 0, rotate: 6 }, { scale: 1, opacity: 1, rotate: -8, duration: 0.55, ease: 'back.out(2.6)' }, '+=0.2')
      .fromTo(book, { x: 0 }, { x: 3, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' }, '<0.35')
  } })
}

// Tied to the scroll, so nothing moves on its own.
function belt(gsap: Gsap) {
  const track = document.querySelector<HTMLElement>('[data-belt-track]')
  const belt = document.querySelector<HTMLElement>('[data-belt]')
  if (!track || !belt) return
  // The whole plate stops while scrolling carries every tag past, then the page goes on.
  const plate = belt.closest<HTMLElement>('.plate') ?? belt
  const distance = () => Math.max(0, track.scrollWidth - belt.clientWidth)
  gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: held(plate, () => distance()) })
}

function card(gsap: Gsap) {
  const element = document.querySelector<HTMLElement>('[data-card]')
  const stage = document.querySelector<HTMLElement>('[data-card-stage]')
  if (!element || !stage) return
  // The plate stops: the front can be read, the card turns over, the back can be read, and the page goes on.
  const plate = stage.closest<HTMLElement>('.plate') ?? stage
  // A short hold (about half a screen of scrolling): long enough to turn it, never so long the page seems to end here.
  gsap.timeline({ scrollTrigger: held(plate, () => innerHeight * 0.55) })
    .fromTo(element, { rotateY: 0, rotateZ: -2 }, { rotateY: 0, rotateZ: 0, duration: 0.15 })
    .to(element, { rotateY: 180, rotateZ: 1.5, duration: 0.6, ease: 'power2.inOut' })
    .to({}, { duration: 0.25 })
}

// Holds a plate still for `distance` pixels of scrolling: its bottom at the bottom of the screen, or centred if it fits.
function held(plate: HTMLElement, distance: () => number) {
  return { trigger: plate, start: () => (plate.offsetHeight > innerHeight ? 'bottom bottom' : 'center center'),
           end: () => `+=${distance()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true }
}

function numerals(gsap: Gsap) {
  gsap.utils.toArray<HTMLElement>('.plate-num').forEach(number => {
    gsap.fromTo(number, { yPercent: 20 }, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: number, start: 'top bottom', end: 'bottom top', scrub: true } })
  })
}

// The naturalist's notes write themselves: the words appear left to right, then the arrow is drawn.
function notes(gsap: Gsap, ScrollTrigger: Trigger, late: boolean) {
  gsap.utils.toArray<HTMLElement>('[data-note]').forEach(note => {
    if (late && note.closest('[data-hero]')) return
    const words = note.querySelector('[data-note-text]')
    const ink = note.querySelectorAll('[data-note-ink]')
    gsap.set(words, { clipPath: 'inset(-20% 100% -20% 0)' })
    gsap.set(ink, { drawSVG: '0%' })
    const write = () => gsap.timeline({ delay: note.closest('[data-hero]') ? 2.2 : 0.2 })
      .to(words, { clipPath: 'inset(-20% 0% -20% 0)', duration: Math.min(1.6, 0.05 * (words?.textContent?.length ?? 20)), ease: 'none' })
      .to(ink, { drawSVG: '100%', duration: 0.35, stagger: 0.18, ease: 'power2.out' })
    ScrollTrigger.create({ trigger: note, start: 'top 88%', once: true, onEnter: write })
  })
}

// Each plate arrives under a blank leaf that peels off diagonally, top right to bottom left, as you scroll: the part
// already lifted is mirrored across the fold line and drawn as the leaf's back, with its shadow on the plate.
function pages(gsap: Gsap) {
  gsap.utils.toArray<HTMLElement>('.plate').forEach(plate => {
    const leaf = document.createElement('div')
    leaf.className = 'leaf'
    leaf.setAttribute('aria-hidden', 'true')
    leaf.innerHTML = '<div class="leaf-cover"></div><div class="leaf-shade"></div><div class="leaf-flap"></div>'
    plate.appendChild(leaf)
    const cover = leaf.querySelector<HTMLElement>('.leaf-cover')!
    const flap = leaf.querySelector<HTMLElement>('.leaf-flap')!
    const shade = leaf.querySelector<HTMLElement>('.leaf-shade')!
    const draw = (progress: number) => {
      const width = plate.offsetWidth, height = plate.offsetHeight
      // The fold is the line x − y = d; it travels from the top right corner (d = width) past the bottom left (d = −height).
      const d = width - progress * (width + height + 40)
      const rect: Point[] = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }]
      const kept = halfPlane(rect, point => d - (point.x - point.y))
      const lifted = halfPlane(rect, point => (point.x - point.y) - d)
      const back = lifted.map(point => ({ x: point.y + d, y: point.x - d }))  // mirrored across the fold
      cover.style.clipPath = polygon(kept)
      flap.style.clipPath = polygon(back)
      shade.style.clipPath = polygon(back.map(point => ({ x: point.x - 7, y: point.y + 9 })))
      leaf.style.visibility = progress >= 1 ? 'hidden' : 'visible'
    }
    draw(0)
    gsap.timeline({ scrollTrigger: { trigger: plate, start: 'top 92%', end: 'top 25%', scrub: 0.5,
                                     onUpdate: self => draw(self.progress), onRefresh: self => draw(self.progress) } })
  })
}

// The part of a convex polygon where side(point) >= 0 (Sutherland–Hodgman against one line).
function halfPlane(points: Point[], side: (point: Point) => number): Point[] {
  const out: Point[] = []
  points.forEach((current, index) => {
    const previous = points[(index + points.length - 1) % points.length]
    const a = side(previous), b = side(current)
    if (b >= 0) {
      if (a < 0) out.push(lerp(previous, current, a / (a - b)))
      out.push(current)
    } else if (a >= 0) out.push(lerp(previous, current, a / (a - b)))
  })
  return out
}
const lerp = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const polygon = (points: Point[]) => points.length < 3 ? 'polygon(0 0, 0 0, 0 0)'
  : `polygon(${points.map(point => `${point.x.toFixed(1)}px ${point.y.toFixed(1)}px`).join(', ')})`

// --- bugs all over the page ----------------------------------------------------------------------------------------

// A few beside the cover's title and two on every plate. They crawl in place and run from the pointer on a desktop.
function swarm(gsap: Gsap, ScrollTrigger: Trigger): () => void {
  const field = document.querySelector<HTMLElement>('[data-field]')
  const title = document.querySelector<HTMLElement>('.hero-title')
  if (!field || !title) return () => {}
  // None among the specimens (already caught) or on the plates held still while scrolling.
  const plates = gsap.utils.toArray<HTMLElement>('.plate').filter(plate => plate.id !== 'specimens' && !plate.hasAttribute('data-held'))
  const random = mulberry(11)
  type Wild = { el: HTMLElement; home: Point; pos: Point; cover: boolean; caught: boolean; landing?: ReturnType<typeof setTimeout> }
  const spots = [
    ...Array.from({ length: 3 }, () => ({ plate: -1, u: random(), v: random() })),
    ...plates.flatMap((_, index) => [{ plate: index, u: 0.55 + random() * 0.35, v: 0.08 + random() * 0.12 },
                                      { plate: index, u: 0.02 + random() * 0.08, v: 0.45 + random() * 0.3 }]),
  ]
  const wild: Wild[] = spots.map(spot => ({ el: critter(field), home: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, cover: spot.plate < 0, caught: false }))
  const lines = gsap.utils.toArray<HTMLElement>('.line-inner', title)
  const layout = () => {
    const box = field.getBoundingClientRect()
    wild.forEach((bug, index) => {
      const spot = spots[index]
      if (spot.plate < 0) {
        // At the end of each line of the cover's title, clear of the words.
        const line = lines[index % lines.length], row = line.parentElement!.getBoundingClientRect()
        bug.home = { x: line.getBoundingClientRect().right - box.left + 20 + spot.u * 14, y: row.top - box.top + row.height * (0.45 + spot.v * 0.15) }
      } else {
        const plate = plates[spot.plate].getBoundingClientRect()
        bug.home = { x: 20 + spot.u * (field.offsetWidth - 40), y: plate.top - box.top + spot.v * plate.height }
      }
      gsap.set(bug.el, { left: bug.home.x - 17, top: bug.home.y - 17 })
    })
  }
  layout()
  ScrollTrigger.addEventListener('refreshInit', layout)
  wild.forEach((bug, index) => {
    gsap.set(bug.el, { rotation: random() * 360 })
    pose(bug.el, 'walk')
    gsap.fromTo(bug.el, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, delay: bug.cover ? 1.4 + index * 0.12 : 0, ease: 'back.out(1.8)' })
    gsap.to(bug.el.querySelector('.critter-body'), { x: 'random(-14, 14)', y: 'random(-10, 10)', rotation: 'random(-30, 30)',
      duration: 'random(1.6, 3)', ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true })
  })

  // On a desktop, they run from the pointer (not far: they stay around their spot).
  let frame = 0
  const onMove = (event: PointerEvent) => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const box = field.getBoundingClientRect()
      const pointer = { x: event.clientX - box.left, y: event.clientY - box.top }
      wild.forEach(bug => {
        if (bug.caught) return
        const at = { x: bug.home.x + bug.pos.x, y: bug.home.y + bug.pos.y }
        const dx = at.x - pointer.x, dy = at.y - pointer.y, distance = Math.hypot(dx, dy) || 1
        if (distance < 130) {
          const push = (130 - distance) * 0.9
          bug.pos = { x: clamp(bug.pos.x + (dx / distance) * push, -120, 120), y: clamp(bug.pos.y + (dy / distance) * push, -90, 90) }
          // Startled: it takes off, and lands back on its feet once it's away.
          pose(bug.el, 'fly')
          clearTimeout(bug.landing)
          bug.landing = setTimeout(() => pose(bug.el, 'walk'), 520)
          gsap.to(bug.el, { x: bug.pos.x, y: bug.pos.y, rotation: (Math.atan2(dy, dx) * 180) / Math.PI + 90, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
        }
      })
    })
  }
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  if (fine) addEventListener('pointermove', onMove, { passive: true })

  // A click next to a bug (it runs, so not right on it): the kiskadee takes it. It comes back to its spot a while later.
  const onCatch = (event: PointerEvent) => {
    if (!onPage(event)) return
    let nearest: Wild | null = null, best = 160
    wild.forEach(bug => {
      if (bug.caught) return
      const box = bug.el.getBoundingClientRect()
      const distance = Math.hypot(box.left + box.width / 2 - event.clientX, box.top + box.height / 2 - event.clientY)
      if (distance < best) { best = distance; nearest = bug }
    })
    const bug = nearest as Wild | null
    if (!bug) return
    bug.caught = true
    const sent = sally(gsap, bug.el, () => {
      tally.page += 1
      paintCounter()
      bug.pos = { x: 0, y: 0 }
      gsap.set(bug.el, { x: 0, y: 0, delay: 0.2 })
      gsap.fromTo(bug.el, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, delay: 9, ease: 'back.out(1.8)', onComplete: () => { bug.caught = false } })
    })
    if (!sent) bug.caught = false
  }
  addEventListener('pointerdown', onCatch, { passive: true })
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', layout)
    if (fine) removeEventListener('pointermove', onMove)
    removeEventListener('pointerdown', onCatch)
    cancelAnimationFrame(frame)
    wild.forEach(bug => { clearTimeout(bug.landing); bug.el.remove() })
  }
}

// How the kiskadee hunts: it waits on its perch (the counter in the header), sallies out to take the bug on the wing
// and goes back to the same perch. One sally at a time; `caught` runs when the bug is in its bill.
let flying = false
function sally(gsap: Gsap, bug: HTMLElement, caught: () => void): boolean {
  const perch = document.querySelector<HTMLElement>('.counter')
  const template = document.querySelector<HTMLTemplateElement>('[data-flyer-template]')
  if (flying || !perch || !template) return false
  flying = true
  const bird = template.content.firstElementChild!.cloneNode(true) as HTMLElement
  document.body.appendChild(bird)
  const wing = bird.querySelector('.flyer-wing')
  const flap = wing ? gsap.to(wing, { scaleY: -0.6, transformOrigin: '50% 100%', duration: 0.08, ease: 'sine.inOut', repeat: -1, yoyo: true }) : null
  const centre = (element: Element): Point => { const box = element.getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 } }
  // A curved flight, read afresh every frame: the page may scroll and the bug may still be moving.
  const flight = (from: () => Point, to: () => Point, duration: number) => {
    const state = { t: 0 }
    return gsap.to(state, { t: 1, duration, ease: 'power2.inOut', onUpdate: () => {
      const a = from(), b = to(), t = state.t, u = 1 - t
      const c = { x: (a.x + b.x) / 2, y: Math.max(16, Math.min(a.y, b.y) - 50) }
      const x = u * u * a.x + 2 * u * t * c.x + t * t * b.x, y = u * u * a.y + 2 * u * t * c.y + t * t * b.y
      const dx = 2 * u * (c.x - a.x) + 2 * t * (b.x - c.x), dy = 2 * u * (c.y - a.y) + 2 * t * (b.y - c.y)
      const left = dx < 0
      const tilt = clamp((Math.atan2(dy, Math.abs(dx) || 1) * 180) / Math.PI, -35, 35)
      gsap.set(bird, { x: x - 26, y: y - 18, scaleX: left ? -1 : 1, rotation: left ? -tilt : tilt })
    } })
  }
  const start = centre(perch)
  gsap.set(bird, { x: start.x - 26, y: start.y - 18, scale: 0.4, opacity: 0 })
  let taken: Point = start
  gsap.timeline({ onComplete: () => { flap?.kill(); bird.remove(); flying = false } })
    .to(bird, { scale: 1, opacity: 1, duration: 0.15 })
    .add(flight(() => centre(perch), () => centre(bug), 0.8))
    .call(() => {
      taken = centre(bug)
      gsap.to(bug, { scale: 0, opacity: 0, duration: 0.14, ease: 'power2.in' })
      gsap.fromTo(perch, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' })
      caught()
    })
    .add(flight(() => taken, () => centre(perch), 0.8))
    .to(bird, { scale: 0.4, opacity: 0, duration: 0.15 })
  return true
}

// A click or a tap that is not on a link, a button or a field.
const onPage = (event: PointerEvent) =>
  event.button === 0 && !(event.target instanceof Element && event.target.closest('a, button, input, select, textarea, summary, label, [role="button"]'))

// The drawing's pose: walking (the legs take turns), flying (wings open and beating) or, with null, resting.
function pose(critter: HTMLElement, state: 'walk' | 'fly' | null) {
  const bug = critter.querySelector('[data-bug]')
  if (state) bug?.setAttribute('data-state', state)
  else bug?.removeAttribute('data-state')
}

function critter(parent: HTMLElement): HTMLElement {
  const template = document.querySelector<HTMLTemplateElement>('[data-bug-template]')
  const element = template!.content.firstElementChild!.cloneNode(true) as HTMLElement
  parent.appendChild(element)
  return element
}

function paintCounter() {
  const value = tally.page + tally.specimens
  document.querySelectorAll('[data-counter]').forEach(element => { element.textContent = String(value) })
  document.querySelectorAll<HTMLElement>('[data-counter-label]').forEach(label => {
    label.textContent = (value === 1 ? label.dataset.one : label.dataset.other) ?? label.textContent
  })
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// A small seeded random: the swarm lands in the same places on every visit.
function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function wireCopyButtons() {
  // The button's name says what it copies; a polite live region says it worked.
  const status = document.querySelector('[data-copy-status]')
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => {
    const label = button.textContent
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '')
        button.textContent = button.dataset.copied ?? label
        if (status) status.textContent = button.dataset.copied ?? ''
        setTimeout(() => {
          button.textContent = label
          if (status) status.textContent = ''
        }, 1600)
      } catch { /* the text stays selectable */ }
    })
  })
}

function wireMotionToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')
  if (!button) return
  const paint = () => {
    const still = root.classList.contains('still')
    const label = button.querySelector('[data-motion-label]')
    // The label says what a press will do (no aria-pressed as well: it would read "Play motion, pressed").
    if (label) label.textContent = still ? button.dataset.play ?? '' : button.dataset.pause ?? ''
  }
  paint()
  button.addEventListener('click', () => {
    const still = !root.classList.contains('still')
    root.classList.toggle('still', still)
    try { localStorage.setItem(STORAGE, still ? 'off' : 'on') } catch { /* a convenience only */ }
    if (still) { teardown?.(); teardown = null; if (landing) settle() }
    else if (!matchMedia('(prefers-reduced-motion: reduce)').matches) void run()
    paint()
  })
}

// Day or night notebook: follows the system until the visitor chooses (remembered per browser).
function wireThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  if (!button) return
  button.addEventListener('click', () => {
    const night = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    root.dataset.theme = night ? 'light' : 'dark'
    try { localStorage.setItem('pitangus-theme', root.dataset.theme) } catch { /* a convenience only */ }
  })
}
