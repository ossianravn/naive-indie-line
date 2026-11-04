// Line boil's other takes, drawn in the browser where boil can show them. A server-rendered drawing carries its first
// take only, so a page ships each drawing once. boilTakes() adds the second and third once the page's boil setting
// would cycle them: during idle time for drawings in view when boil runs always, or on hover with a pointer that can
// hover (the default), and at once under the pointer. A touch screen has no hover, so there a tap draws them and boils
// the drawing once (boilOnce). Boil off or reduced motion, and they are never drawn. The pen engine loads only when
// the first one is. No React, so static pages can use it too.
import { ownIds } from "@/fineliner/lib/own-ids"
import type { SceneFormat, SceneName } from "@/fineliner/pen/scenes"

const TAKES = 3
const watched = new WeakSet<HTMLElement>()
const inView = new Set<HTMLElement>()
const waiting: HTMLElement[] = []
let engine: Promise<typeof import("@/fineliner/pen")> | undefined
let loadDrawings: (() => Promise<unknown>) | undefined
let drawings: Promise<unknown> | undefined
let seen: IntersectionObserver | undefined
let made = 0
let busy = false

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches
const running = (el: HTMLElement, name: string) =>
  getComputedStyle(el).getPropertyValue(name).trim() === "running"
const boils = (el: HTMLElement) =>
  !reduced() &&
  (running(el, "--boil") ||
    (running(el, "--boil-hover") &&
      matchMedia("(hover: hover) and (pointer: fine)").matches))
// Where boil waits for a hover, a tap on a touch screen boils the drawing once instead.
const boilsOnTap = (el: HTMLElement) =>
  !reduced() && !running(el, "--boil") && running(el, "--boil-hover")

/** Add the next take, or every missing take (`all`, under the pointer). Returns whether one is still missing. */
async function grow(el: HTMLElement, all = false) {
  const { seed, object, scene, format, hand } = el.dataset
  const has = el.children.length
  if (!seed || has >= TAKES) return false
  // A drawing still waiting to be drawn on gets its other takes afterwards, so boil never flashes them first.
  if (el.querySelector(".fl-unseen")) {
    setTimeout(() => queue(el), 1500)
    return false
  }
  const [{ drawing }] = await Promise.all([
    (engine ??= import("@/fineliner/pen")),
    (drawings ??= loadDrawings?.()),
  ])
  // A reroll may have redrawn it, takes and all, while the engine loaded.
  if (el.dataset.seed !== seed || el.children.length !== has) return false
  let takes: string[]
  try {
    takes = drawing({
      object,
      scene: scene as SceneName | undefined,
      format: format as SceneFormat | undefined,
      seed,
      hand: hand === "calm" ? "calm" : "lively",
      takes: all ? TAKES : has + 1,
      from: has,
    })
  } catch {
    return false
  }
  el.insertAdjacentHTML("beforeend", ownIds(takes.join(""), `t${++made}`))
  return el.children.length < TAKES
}

function queue(el: HTMLElement) {
  if (!waiting.includes(el)) waiting.push(el)
  if (busy) return
  busy = true
  idle(next)
}
const idle = (fn: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(fn, { timeout: 2000 })
    : setTimeout(fn, 60)
// One take per idle moment, so drawing takes never holds up the page.
async function next() {
  const el = waiting.shift()
  if (el?.isConnected && inView.has(el) && boils(el) && (await grow(el)))
    waiting.push(el)
  if (waiting.length) idle(next)
  else busy = false
}

const TAP_STEPS = [1, 2, 0, 1, 2, 0]
/** A tap's boil: every take drawn, then two rounds of them at the boil's pace, resting on the first. */
async function boilOnce(el: HTMLElement) {
  if (el.dataset.show !== undefined) return
  el.dataset.show = "0"
  await grow(el, true)
  if (el.children.length < TAKES) return void delete el.dataset.show
  const pace = getComputedStyle(el).getPropertyValue("--take").trim()
  const take = parseFloat(pace) * (/\ds$/.test(pace) ? 1000 : 1) || 120
  TAP_STEPS.forEach((show, i) =>
    setTimeout(() => (el.dataset.show = String(show)), take * i),
  )
  setTimeout(() => delete el.dataset.show, take * TAP_STEPS.length)
}

function start() {
  // A tap, not the start of a scroll: the finger lifts on the drawing it came down on (a scroll cancels the pointer).
  let tapped: HTMLElement | undefined
  document.addEventListener(
    "pointerdown",
    (e) => {
      const el =
        e.pointerType === "mouse"
          ? undefined
          : (e.target as Element).closest?.<HTMLElement>(".fl-takes")
      tapped = el && watched.has(el) ? el : undefined
    },
    { passive: true },
  )
  document.addEventListener("pointercancel", () => (tapped = undefined))
  document.addEventListener("pointerup", (e) => {
    const el = (e.target as Element).closest?.<HTMLElement>(".fl-takes")
    if (el && el === tapped && boilsOnTap(el)) void boilOnce(el)
    tapped = undefined
  })
  seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (!e.isIntersecting) {
          inView.delete(el)
          continue
        }
        inView.add(el)
        queue(el)
      }
    },
    { rootMargin: "200px" },
  )
  document.addEventListener("pointerover", (e) => {
    const el = (e.target as Element).closest?.<HTMLElement>(".fl-takes")
    if (el && watched.has(el) && boils(el)) void grow(el, true)
  })
  // Boil turned on, here or for a part of the page: the drawings in view get their takes.
  new MutationObserver(() => inView.forEach(queue)).observe(
    document.documentElement,
    { attributes: true, subtree: true, attributeFilter: ["data-boil"] },
  )
}

/** Draw a drawing's other takes where boil shows them. `<Drawing>` calls it; a server-only page calls boilTakesIn(). */
export function boilTakes(el: HTMLElement) {
  if (watched.has(el) || !el.dataset.seed) return
  watched.add(el)
  if (!seen) start()
  seen?.observe(el)
}

/**
 * Every drawing under `root` that carries one take, for pages whose drawings render without React in the browser.
 * `load` registers the page's drawings once, before drawing the first take. A later loader replaces an unused one.
 * For example: `boilTakesIn(document, () => import("@/fineliner/pen/objects"))`.
 */
export function boilTakesIn(
  root: ParentNode = document,
  load?: () => Promise<unknown>,
) {
  if (load && !drawings) loadDrawings = load
  root.querySelectorAll<HTMLElement>(".fl-takes[data-seed]").forEach(boilTakes)
}
