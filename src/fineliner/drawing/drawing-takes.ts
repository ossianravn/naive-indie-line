// Line boil's other takes, drawn in the browser where boil can show them. A server-rendered drawing carries its first
// take only, so a page ships each drawing once. boilTakes() adds the second and third once the page's boil setting
// would cycle them: during idle time for drawings in view when boil runs always, or on hover with a pointer that can
// hover (the default), and at once under the pointer. Boil off, reduced motion, or a phone without hover, and they are
// never drawn. The pen engine loads only when the first one is. No React, so static pages can use it too.
import { ownIds } from "@/fineliner/lib/own-ids"
import type { SceneName } from "@/fineliner/pen/scenes"

const TAKES = 3
const watched = new WeakSet<HTMLElement>()
const inView = new Set<HTMLElement>()
const waiting: HTMLElement[] = []
let engine: Promise<typeof import("@/fineliner/pen")> | undefined
let seen: IntersectionObserver | undefined
let made = 0
let busy = false

const boils = (el: HTMLElement) => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  const style = getComputedStyle(el)
  const running = (name: string) =>
    style.getPropertyValue(name).trim() === "running"
  return (
    running("--boil") ||
    (running("--boil-hover") &&
      matchMedia("(hover: hover) and (pointer: fine)").matches)
  )
}

/** Add the next take, or every missing take (`all`, under the pointer). Returns whether one is still missing. */
async function grow(el: HTMLElement, all = false) {
  const { seed, object, scene, hand } = el.dataset
  const has = el.children.length
  if (!seed || has >= TAKES) return false
  // A drawing still waiting to be drawn on gets its other takes afterwards, so boil never flashes them first.
  if (el.querySelector(".fl-unseen")) {
    setTimeout(() => queue(el), 1500)
    return false
  }
  const { drawing } = await (engine ??= import("@/fineliner/pen"))
  // A reroll may have redrawn it, takes and all, while the engine loaded.
  if (el.dataset.seed !== seed || el.children.length !== has) return false
  const takes = drawing({
    object,
    scene: scene as SceneName | undefined,
    seed,
    hand: hand === "calm" ? "calm" : "lively",
    takes: all ? TAKES : has + 1,
    from: has,
  })
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

function start() {
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

/** Every drawing under `root` that carries one take, for pages whose drawings render without React in the browser. */
export function boilTakesIn(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(".fl-takes[data-seed]").forEach(boilTakes)
}
