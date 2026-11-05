"use client"

// The drawing desk: choose an object or a scene, reroll its seed until it is right, then take the seed, the JSX or
// the SVG. The seed and the object or scene travel in the URL, so a drawing can be shared. Lettering has its own page (/lettering).
import "@/fineliner/pen/objects"
import { ROOMS } from "@/fineliner/pen/objects/rooms"
import { useEffect, useRef, useState } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { settleDrawing } from "@/fineliner/drawing/drawing-motion"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import {
  COLLECTIONS,
  SCENES,
  drawing,
  listObjects,
  type HandName,
  type SceneName,
} from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { Segments, frame } from "./desk-controls"
import { download, standaloneSvg } from "./export-svg"

type Kind = "scene" | "object"
const WORDS = [
  "corner-shop",
  "side-b",
  "late-bus",
  "quiet-hours",
  "window-seat",
  "last-call",
  "slow-dance",
  "first-press",
]
const pickWord = () =>
  `${WORDS[Math.floor(Math.random() * WORDS.length)]}-${Math.floor(Math.random() * 90 + 10)}`

// The desk renders only in the browser (client:only), so its first state can come straight from the URL.
const query = () => new URLSearchParams(location.search)

export function Desk() {
  const [kind, setKind] = useState<Kind>(() =>
    query().get("object") ? "object" : "scene",
  )
  const [scene, setScene] = useState<SceneName>(() => {
    const asked = query().get("scene") ?? ""
    return (ROOMS as string[]).includes(asked) ? (asked as SceneName) : "room"
  })
  const [object, setObject] = useState(
    () => query().get("object") ?? "turntable",
  )
  const [seed, setSeed] = useState(() => query().get("seed") ?? "corner-shop")
  const [hand, setHand] = useState<HandName>("lively")
  const [copied, setCopied] = useState("")
  const stage = useRef<HTMLDivElement>(null)
  const settle = useRef(false)

  useEffect(() => {
    if (settle.current && stage.current) settleDrawing(stage.current)
    settle.current = false
    const q = new URLSearchParams({
      seed,
      ...(kind === "object" ? { object } : { scene }),
    })
    history.replaceState(null, "", `?${q}`)
  }, [seed, kind, object, scene])

  const reroll = (next = pickWord()) => {
    settle.current = true
    setSeed(next)
  }
  const svg = () =>
    drawing({
      ...(kind === "scene" ? { scene } : { object }),
      seed,
      hand,
    })[0] ?? ""
  const jsx =
    kind === "scene"
      ? `<Drawing scene="${scene}" seed="${seed}" />`
      : `<Drawing object="${object}" seed="${seed}" />`
  const copy = (what: string, value: string) =>
    navigator.clipboard
      .writeText(value)
      .then(() => (setCopied(what), setTimeout(() => setCopied(""), 1600)))
  const neighbours = [1, 2, 3, 4].map((n) => `${seed}-${n}`)
  const show = (s: string) => (
    <Drawing
      {...(kind === "scene" ? { scene } : { object })}
      seed={s}
      hand={hand}
    />
  )

  return (
    // One column on a phone: the drawing, its controls right under it, then the neighbouring seeds. From lg the
    // controls run down a narrow column beside the drawing and its neighbours. The drawing is never taller than the
    // screen leaves it (a tall object narrows instead, its viewBox centred), so a drawing and every control that
    // changes it are in view together; on a phone it takes half the screen, leaving the first controls under it.
    <div className="grid gap-x-section gap-y-line lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-[auto_1fr]">
      <div
        ref={stage}
        className={cn(
          "[&_.fl-drawing]:max-h-[50svh] lg:[&_.fl-drawing]:max-h-[calc(100svh-8.5rem)]",
          kind === "object" && "mx-auto w-full max-w-[30rem]",
        )}
      >
        {show(seed)}
      </div>
      <div className="grid content-start gap-snug lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <Segments
          label="Draw"
          value={kind}
          onChange={setKind}
          options={[
            ["scene", "Scene"],
            ["object", "Object"],
          ]}
        />
        {kind === "scene" && (
          <Segments
            label="Scene"
            value={scene}
            onChange={setScene}
            options={ROOMS.map(
              (k) => [k as SceneName, SCENES[k]?.name ?? k] as const,
            )}
          />
        )}
        {kind === "object" && (
          <label className="grid justify-items-start gap-hair">
            <span className="label">Object</span>
            <span
              className="frame inline-flex h-control w-56 items-center px-tight"
              style={frame("desk-object")}
            >
              <select
                className="w-full appearance-none bg-transparent pr-snug text-ui outline-none"
                value={object}
                onChange={(e) => setObject(e.target.value)}
              >
                {COLLECTIONS.map(([key, title]) => (
                  <optgroup key={key} label={title}>
                    {listObjects(key).map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <PenMark
                name="chevron"
                seed="desk-object"
                className="pointer-events-none absolute right-tight w-3"
              />
            </span>
          </label>
        )}
        <label className="grid justify-items-start gap-hair">
          <span className="label">Seed</span>
          <span className="flex items-center gap-tight">
            <span
              className="frame inline-flex h-control w-44 items-center px-tight"
              style={frame("desk-seed")}
            >
              <input
                className="w-full bg-transparent font-type text-ui outline-none"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                spellCheck={false}
              />
            </span>
            <button
              type="button"
              className="frame h-control px-snug text-ui"
              style={frame("desk-reroll")}
              onClick={() => reroll()}
            >
              Reroll
            </button>
          </span>
        </label>
        <Segments
          label="Hand"
          value={hand}
          onChange={setHand}
          options={[
            ["calm", "Calm"],
            ["lively", "Lively"],
          ]}
        />
        <div className="grid justify-items-start gap-hair">
          <span className="label">Take it</span>
          <div className="flex flex-wrap gap-tight">
            <button
              type="button"
              className="frame h-control px-tight text-small"
              style={frame("desk-copy-seed")}
              onClick={() => copy("seed", seed)}
            >
              Copy seed
            </button>
            <button
              type="button"
              className="frame h-control px-tight text-small"
              style={frame("desk-copy-jsx")}
              onClick={() => copy("JSX", jsx)}
            >
              Copy JSX
            </button>
            <button
              type="button"
              className="relative isolate h-control px-tight text-small text-paper"
              onClick={() =>
                stage.current &&
                download(
                  `fineliner-${seed}.svg`,
                  standaloneSvg(svg(), stage.current),
                )
              }
            >
              <i className="ink-fill" style={frame("desk-download")} />
              Download SVG
            </button>
          </div>
          <p className="m-0 min-h-[1.5em] text-small" role="status">
            {copied && `Copied the ${copied}.`}
          </p>
        </div>
      </div>
      <div className="lg:col-start-1 lg:row-start-2">
        <span className="label">Neighbouring seeds</span>
        <div className="mt-tight grid grid-cols-2 gap-snug sm:grid-cols-4">
          {neighbours.map((n) => (
            <button
              key={n}
              type="button"
              className="grid content-end gap-hair text-left"
              onClick={() => reroll(n)}
              aria-label={`Use seed ${n}`}
            >
              {show(n)}
              <span className="font-type text-small">{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
