"use client"

// The drawing desk: choose an object, a scene or a line of lettering, reroll its seed until it is right, then take
// the seed, the code or the SVG. The seed travels in the URL, so a drawing can be shared. Lettering here is drawn by
// the pen from its seed (lettering() in the engine), not set in the Tramline font.
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
  lettering,
  listObjects,
  type HandName,
  type SceneName,
} from "@/fineliner/pen"
import { Segments, frame } from "./desk-controls"
import { download, standaloneSvg } from "./export-svg"

type Kind = "scene" | "object" | "lettering"
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
  const [scene, setScene] = useState<SceneName>("room")
  const [object, setObject] = useState(
    () => query().get("object") ?? "turntable",
  )
  const [text, setText] = useState("Listening room")
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
      ...(kind === "object" ? { object } : {}),
    })
    history.replaceState(null, "", `?${q}`)
  }, [seed, kind, object, scene])

  const reroll = (next = pickWord()) => {
    settle.current = true
    setSeed(next)
  }
  const svg = () =>
    (kind === "lettering"
      ? lettering(text, { face: "tramline", seed, hand })
      : drawing({
          ...(kind === "scene" ? { scene } : { object }),
          seed,
          hand,
        }))[0] ?? ""
  const jsx =
    kind === "lettering"
      ? `lettering(${JSON.stringify(text)}, { seed: "${seed}" })`
      : kind === "scene"
        ? `<Drawing scene="${scene}" seed="${seed}" />`
        : `<Drawing object="${object}" seed="${seed}" />`
  const copy = (what: string, value: string) =>
    navigator.clipboard
      .writeText(value)
      .then(() => (setCopied(what), setTimeout(() => setCopied(""), 1600)))
  const neighbours = [1, 2, 3, 4].map((n) => `${seed}-${n}`)
  const show = (s: string, className = "") =>
    kind === "lettering" ? (
      // The first take names itself by the text.
      <span
        className={`fl-takes ${className}`}
        dangerouslySetInnerHTML={{
          __html: lettering(text, { seed: s, hand, takes: 3 }).join(""),
        }}
      />
    ) : (
      <Drawing
        {...(kind === "scene" ? { scene } : { object })}
        seed={s}
        hand={hand}
        className={className}
      />
    )

  return (
    // One column on a phone: the drawing, its controls right under it, then the neighbouring seeds. From lg the
    // controls run down a narrow column beside the drawing and its neighbours.
    <div className="grid gap-x-section gap-y-line lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-[auto_1fr]">
      <div
        ref={stage}
        className={kind === "object" ? "mx-auto w-full max-w-[26rem]" : ""}
      >
        {show(
          seed,
          kind === "lettering"
            ? "[&>svg]:h-28 [&>svg]:w-auto [&>svg]:max-w-full"
            : "",
        )}
      </div>
      <div className="grid content-start gap-snug lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <Segments
          label="Draw"
          value={kind}
          onChange={setKind}
          options={[
            ["scene", "Scene"],
            ["object", "Object"],
            ["lettering", "Letters"],
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
        {kind === "lettering" && (
          <>
            <label className="grid justify-items-start gap-hair">
              <span className="label">Words</span>
              <span
                className="frame inline-flex h-control w-56 items-center px-tight"
                style={frame("desk-words")}
              >
                <input
                  className="w-full bg-transparent text-ui outline-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  spellCheck={false}
                />
              </span>
            </label>
          </>
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
              onClick={() => copy(kind === "lettering" ? "code" : "JSX", jsx)}
            >
              {kind === "lettering" ? "Copy code" : "Copy JSX"}
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
              {show(
                n,
                kind === "lettering"
                  ? "[&>svg]:h-8 [&>svg]:w-auto [&>svg]:max-w-full"
                  : "",
              )}
              <span className="font-type text-small">{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
