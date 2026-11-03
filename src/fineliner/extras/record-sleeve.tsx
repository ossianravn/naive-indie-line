"use client"

import { useMemo, type ComponentProps, type CSSProperties } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering, type LetteringFace } from "@/fineliner/drawing/lettering"
import { cn } from "@/fineliner/lib/utils"
import type { SceneName } from "@/fineliner/pen"
import { sheet } from "@/fineliner/pen/layers"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { pen, type HandName } from "@/fineliner/pen/stroke"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

// A record's square sleeve, seen from the front: a drawing, the title lettered by the pen, the artist in the reading
// face and the catalogue number up the spine edge (the spine voice: the reading serif, bottom to top). The record's
// edge, a solid disc of ink, peeks out of the open side. The catalogue number seeds everything (cover, face, how far
// the record peeks), so a sleeve is drawn the same in the catalogue, on the record's page and in a block.
//
// The sleeve and the disc are one pen drawing at the sleeve's own size in pixels, since a sleeve is square at three
// fixed sizes; the disc is masked a hair inside the open edge, so ink always meets the line and never leaves a gap.
// Without a `hand` the sleeve follows the page: a lively line, and a calm one under data-hand="calm".

/** Objects that make a good cover on their own, in the order a seed picks from. */
const COVERS = [
  "sunflower",
  "house-plant",
  "cactus",
  "disco-ball",
  "speaker",
  "radio",
  "armchair",
  "floor-lamp",
  "window",
  "guitar",
  "cat",
  "picture",
  "cassette",
  "headphones",
  "teapot",
  "lemon",
]

/** The sleeve's side in pixels at 16px to the rem, and the lettered title's height in rem. */
const SIZES = {
  sm: { px: 144, word: 1.05, inner: 6.4 },
  md: { px: 200, word: 1.45, inner: 9.2 },
  lg: { px: 272, word: 1.95, inner: 12.7 },
} as const

export interface RecordSleeveProps extends Omit<
  ComponentProps<"div">,
  "title"
> {
  title: string
  artist: string
  /** The catalogue number, set up the spine. It seeds the cover, the letters and the disc. */
  catalogue: string
  size?: keyof typeof SIZES
  /** The cover's drawing; the catalogue number picks one when left out. */
  object?: string
  /** A whole scene on the cover in place of an object. */
  scene?: SceneName
  /** The title's face: "line" (Naïve Indie Line Sans, as text, the default) or "tramline" (drawn by the pen). */
  face?: LetteringFace
  /** The pen's hand. Left out, the sleeve follows the page's hand. */
  hand?: HandName
  /** Makes the whole sleeve a link to this address. */
  href?: string
}

/** The sleeve and the record's edge, as one SVG string. */
function sleeveCase(key: string, px: number, peek: number, hand: HandName) {
  const r = stream(seedOf(key), "sleeve-disc")
  const s = sheet(`fl${seedOf(`${key}:sleeve`).toString(36)}v${hand[0]}${px}`)
  const p = pen(`${key}:sleeve`, hand)
  const R = px * 0.47
  const cy = px / 2 + r.between(-0.025, 0.025) * px
  s.fill(p.disc([px + peek - R, cy], [R, 0], [0, R]))
  s.blank(`M-30 -30H${px - 1.8}V${px + 30}H-30Z`)
  s.stroke(
    p.edges([
      [1, 1],
      [px - 1, 1],
      [px - 1, px - 1],
      [1, px - 1],
    ]),
  )
  return s.svg(px + peek, px)
}

/** A square record sleeve with the record peeking out of its open side. */
export function RecordSleeve({
  title,
  artist,
  catalogue,
  size = "md",
  object,
  scene,
  face,
  hand,
  href,
  className,
  style,
  ...props
}: RecordSleeveProps) {
  const own = useOwnIds()
  const { px, word, inner } = SIZES[size]
  const key = catalogue
  const seed = seedOf(key)
  const peek = Math.round(px * stream(seed, "sleeve-peek").between(0.1, 0.15))
  const letters = face ?? "line"
  const cover = object ?? stream(seed, "sleeve-cover").pick(COVERS)
  const cases = useMemo(
    () =>
      (hand ? [hand] : (["lively", "calm"] as const)).map((h) => ({
        hand: h,
        svg: sleeveCase(key, px, peek, h),
      })),
    [key, px, peek, hand],
  )
  // Long titles letter smaller, so they wrap onto two or three lines rather than pushing the drawing off the sleeve.
  // A title too long to letter at a readable size is set in small capitals instead, as a printer would.
  const words = title.trim().split(/\s+/).filter(Boolean)
  const perChar = 0.62
  const room = (inner * 2.4) / (title.length * perChar + words.length * 0.3)
  const printed = room < word * 0.72
  const height = Math.min(word, room)
  const lettered = printed ? (
    <span className="line-clamp-3 font-read text-[0.8125rem] leading-tight tracking-[0.04em] uppercase group-data-[size=lg]/record-sleeve:text-body group-data-[size=md]/record-sleeve:text-small">
      {title}
    </span>
  ) : letters === "line" ? (
    <Lettering text={title} className="text-balance" />
  ) : (
    <>
      <span className="sr-only">{title}</span>
      {words.map((w, i) => (
        <Lettering
          key={`${w}:${i}`}
          aria-hidden="true"
          text={w}
          face={letters}
          seed={`${key}:${i}`}
          hand={hand}
          className="h-(--word) max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full"
        />
      ))}
    </>
  )
  const titleClass =
    "flex min-w-0 flex-wrap items-center gap-x-[0.3em] gap-y-[0.15em] text-(length:--word)"

  return (
    <div
      data-slot="record-sleeve"
      data-size={size}
      data-link={href ? "" : undefined}
      className={cn(
        "group/record-sleeve relative max-w-full shrink-0 text-pen",
        "has-[[data-slot=record-sleeve-link]:focus-visible]:outline-[1.5px] has-[[data-slot=record-sleeve-link]:focus-visible]:outline-offset-4 has-[[data-slot=record-sleeve-link]:focus-visible]:outline-pen has-[[data-slot=record-sleeve-link]:focus-visible]:outline-dashed",
        className,
      )}
      style={
        {
          width: `${(px + peek) / 16}rem`,
          aspectRatio: `${px + peek} / ${px}`,
          "--word": `${height.toFixed(3)}rem`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {cases.map((c) => (
        <span
          key={c.hand}
          data-slot="record-sleeve-case"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 block [&>svg]:size-full",
            !hand && (c.hand === "calm" ? "hidden calm:block" : "calm:hidden"),
            href &&
              "group-hover/record-sleeve:[--pen-weight:var(--pen-weight-pressed)]",
          )}
          dangerouslySetInnerHTML={{ __html: own(c.svg) }}
        />
      ))}
      <div
        data-slot="record-sleeve-front"
        className={cn(
          "absolute inset-y-0 left-0 grid aspect-square grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden",
          "gap-x-[0.4rem] gap-y-[0.35rem] p-[0.65rem] group-data-[size=lg]/record-sleeve:gap-x-hair group-data-[size=lg]/record-sleeve:gap-y-tight group-data-[size=lg]/record-sleeve:p-snug group-data-[size=md]/record-sleeve:p-[0.85rem]",
        )}
      >
        <div
          data-slot="record-sleeve-title"
          className={cn("col-start-2", !href && titleClass)}
        >
          {href ? (
            <a
              data-slot="record-sleeve-link"
              href={href}
              className={cn(
                titleClass,
                "no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
              )}
            >
              {lettered}
            </a>
          ) : (
            lettered
          )}
        </div>
        <div className="relative col-start-2 min-h-0">
          <Drawing
            object={scene ? undefined : cover}
            scene={scene}
            seed={key}
            hand={hand}
            title=""
            className="absolute inset-0 [&>svg]:absolute [&>svg]:inset-0 [&>svg]:size-full"
          />
        </div>
        <div
          data-slot="record-sleeve-artist"
          className="col-start-2 line-clamp-2 font-read text-[0.8125rem] leading-tight text-pen group-data-[size=lg]/record-sleeve:text-body group-data-[size=md]/record-sleeve:text-small"
        >
          {artist}
        </div>
        <div
          data-slot="record-sleeve-spine"
          data-spine=""
          className="relative col-start-1 row-span-3 row-start-1 w-[1.3em] font-read text-[0.75rem] leading-[1.3] tracking-[0.06em] tabular-nums group-data-[size=lg]/record-sleeve:text-small group-data-[size=md]/record-sleeve:text-[0.8125rem]"
        >
          <span className="absolute inset-0 overflow-hidden text-start text-ellipsis whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
            {catalogue}
          </span>
        </div>
      </div>
    </div>
  )
}
