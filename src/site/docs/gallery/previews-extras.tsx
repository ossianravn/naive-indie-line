import type { CSSProperties } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { AppearanceControl } from "@/fineliner/extras/appearance-control"
import { ReadingProgress } from "@/fineliner/extras/reading-progress"
import { LabelCard } from "@/fineliner/extras/label-card"
import {
  TrackList,
  TrackListItem,
  TrackListSide,
} from "@/fineliner/extras/track-list"
import { plot } from "@/fineliner/pen/plot"
import { AspectRatio } from "@/fineliner/ui/aspect-ratio"
import { siteAppearance } from "@/site/appearance"
import { week } from "../demos/chart/data"
import { PageLines, Scaled } from "./parts"

// Extras and the chart, whose demos open with a whole article, panel or chart card: the same parts, smaller or with
// less in them. The chart draws its bars as the kit's drawn bar does (plot edges round an exact rectangle), since
// Recharts measures its container and so draws nothing on the server.

function AppearanceControlPreview() {
  return (
    <AppearanceControl
      defaults={siteAppearance}
      rows={["theme", "stock"]}
      className="w-full max-w-[16rem]"
    />
  )
}

function ReadingProgressPreview() {
  return (
    <div className="frame w-full max-w-[16rem] p-[3px]">
      <ReadingProgress
        seed="gallery:reading"
        className="relative inset-auto top-auto mb-0"
        style={{ "--read": 0.4 } as CSSProperties}
      />
      <div className="px-snug pt-hair pb-snug">
        <p className="m-0 mb-tight font-read text-lead leading-subhead font-medium">
          How we grade a record
        </p>
        <PageLines widths={[100, 92, 96, 70]} />
      </div>
    </div>
  )
}

/**
 * The room header's lettered title beside a drawing. Its own scene is a whole room, about 900 KB of pen strokes in
 * three takes, so the index puts one object from the library where the scene stands.
 */
function RoomHeaderPreview() {
  return (
    <div className="grid w-full max-w-[17rem] grid-cols-[minmax(0,1fr)_6rem] items-end gap-x-snug">
      <div className="flex min-w-0 flex-col gap-hair">
        <p className="label m-0 text-pen-quiet">The journal</p>
        <p className="m-0 flex flex-wrap items-end gap-x-[0.18em]">
          {["How", "we", "grade", "a", "record"].map((word, i) => (
            <Lettering
              key={`${i}-${word}`}
              text={word}
              face="liner"
              seed={`How we grade a record:${i}`}
              className="h-6 shrink-0 [&>svg]:h-full [&>svg]:w-auto"
            />
          ))}
        </p>
      </div>
      <Drawing object="armchair" seed="gallery:room-header" still title="" />
    </div>
  )
}

/** The aspect ratio's 3 : 2 plate with a drawing in it; the demo's first plate holds a whole room. */
function AspectRatioPreview() {
  return (
    <figure className="m-0 flex w-[12rem] flex-col gap-hair">
      <AspectRatio ratio={3 / 2} className="frame">
        <Drawing
          object="turntable"
          seed="gallery:aspect"
          still
          title=""
          className="absolute inset-tight [&>svg]:size-full"
        />
      </AspectRatio>
      <figcaption className="text-small leading-small text-pen-quiet">
        The counter turntable
      </figcaption>
    </figure>
  )
}

/** The demo's second label, an object in place of the first's whole scene. */
function LabelCardPreview() {
  return (
    <Scaled by={0.72}>
      <LabelCard
        object="record"
        title="Harbour Lights"
        kicker="Ellen Moe Trio · LR-0431"
        spine="Nordlys 1968"
        className="w-[12rem]"
      />
    </Scaled>
  )
}

const SIDE_A = [
  ["A1", "Harbour Lights", "6:12"],
  ["A2", "Grey Morning", "4:48"],
  ["A3", "The Ferry Bell", "5:30"],
] as const

function TrackListPreview() {
  return (
    <TrackList className="w-full max-w-[16rem]">
      <TrackListSide title="Side A" duration="19:40">
        {SIDE_A.map(([n, title, length]) => (
          <TrackListItem
            key={n}
            number={n}
            duration={length}
            playing={n === "A2"}
          >
            {title}
          </TrackListItem>
        ))}
      </TrackListSide>
    </TrackList>
  )
}

const W = 240
const H = 110
const BASE = 100

function ChartPreview() {
  const max = Math.max(...week.map((d) => d.sold))
  const step = W / week.length
  const bars = week.map((d, i) => {
    const h = (d.sold / max) * (BASE - 8)
    const x = i * step + step * 0.22
    const w = step * 0.56
    const y = BASE - h
    return {
      x,
      y,
      w,
      h,
      d: plot(`gallery:${d.day}`).edges([
        [x, y],
        [x + w, y],
        [x + w, BASE],
        [x, BASE],
      ]),
    }
  })
  const axis = plot("gallery:axis").path([
    [
      [0, BASE],
      [W, BASE],
    ],
  ])
  return (
    <div className="w-full max-w-[16rem]">
      <p className="label m-0 mb-hair text-pen-quiet">Records sold</p>
      <svg
        viewBox={`-2 -2 ${W + 4} ${H}`}
        className="block w-full overflow-visible"
      >
        {bars.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="var(--pen)" />
            <path
              d={b.d}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={1.35}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
        <path
          d={axis}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={1.35}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="m-0 flex justify-around font-type text-small text-pen-quiet">
        {week.map((d) => (
          <span key={d.day}>{d.day.slice(0, 1)}</span>
        ))}
      </p>
    </div>
  )
}

export const EXTRA_PREVIEWS = {
  "appearance-control": AppearanceControlPreview,
  "reading-progress": ReadingProgressPreview,
  "room-header": RoomHeaderPreview,
  "aspect-ratio": AspectRatioPreview,
  "label-card": LabelCardPreview,
  "track-list": TrackListPreview,
  chart: ChartPreview,
}

/** Demos whose first example is the part itself, only taller than the plate: drawn smaller instead. */
export const SCALE: Record<string, number> = {
  "drawn-border": 0.62,
  "input-otp": 0.85,
  tabs: 0.88,
  "pull-quote": 0.85,
  "price-tag": 0.88,
  "tasting-note": 0.85,
}
