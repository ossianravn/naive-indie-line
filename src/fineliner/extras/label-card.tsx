import type { ComponentProps, ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering, type LetteringFace } from "@/fineliner/drawing/lettering"
import { frameStyle, wordsOf } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import type { HandName, SceneName } from "@/fineliner/pen"
import { seedOf, stream } from "@/fineliner/pen/seed"

// A label from a bottle or a sleeve: a drawing inside a drawn border, spine words standing up its outer edge (the
// reading serif, bottom to top, as on the reference label), then a kicker in the label voice and the title in the
// reading face or lettered by the pen. Open on the page by default; with data-containers="boxed" a drawn frame goes
// round the whole label, like a card's. Everything is seeded from the title, so a label is drawn the same everywhere.
//
// The spine is writing-mode vertical-rl turned 180°, which Chrome, Safari and Firefox all draw the same way. It is
// absolutely placed inside its column, so long words never make the label taller: they end in an ellipsis instead.
// With `href` the title becomes a link whose hit area covers the whole label.

/** Objects that read well alone on a label, in the order a seed picks from. */
const ART = [
  "bottle",
  "glass",
  "carafe",
  "sunflower",
  "house-plant",
  "disco-ball",
  "record",
  "turntable",
  "lemon",
  "teapot",
  "radio",
  "armchair",
]

export interface LabelCardProps extends Omit<ComponentProps<"div">, "title"> {
  title: ReactNode
  /** A line in the label voice above the title: what it is and where it is from. */
  kicker?: ReactNode
  /** Words set up the outer edge of the drawing, bottom to top. Keep them short. */
  spine?: ReactNode
  /** An object from the drawing library; the seed picks one when neither object, scene nor art is given. */
  object?: string
  /** A whole scene (room, studio or bistro) in place of an object; it brings its own border. */
  scene?: SceneName
  /** A picture of your own in place of a drawing, or false for a label without one. */
  art?: ReactNode | false
  /** Letter the title in Naïve Indie Line Sans ("line"), Inline or Tramline; the reading face when left out. */
  face?: LetteringFace
  /** Same seed, same drawing and border. Defaults to the title's words. */
  seed?: string | number
  /** The pen's hand for the drawing. */
  hand?: HandName
  /** Makes the whole label a link to this address. */
  href?: string
}

/** A drawn label: art in a border, spine words up its edge, a kicker and a title. */
export function LabelCard({
  title,
  kicker,
  spine,
  object,
  scene,
  art,
  face,
  seed,
  hand,
  href,
  className,
  style,
  children,
  ...props
}: LabelCardProps) {
  const words = wordsOf(title).trim()
  const key = String(seed ?? words)
  const pick = object ?? stream(seedOf(key), "label-art").pick(ART)
  const picture =
    art === false ? null : art !== undefined && art !== null ? (
      art
    ) : scene ? (
      <Drawing scene={scene} seed={key} hand={hand} title="" />
    ) : (
      <div
        data-slot="label-card-border"
        className="frame relative aspect-square [--over:3px] calm:[--over:1px]"
        style={frameStyle(`${key}:border`)}
      >
        <Drawing
          object={pick}
          seed={key}
          hand={hand}
          title=""
          className="absolute inset-snug [&>svg]:absolute [&>svg]:inset-0 [&>svg]:size-full"
        />
      </div>
    )
  const heading =
    face && words ? (
      <Lettering text={words} face={face} className="text-balance" />
    ) : (
      title
    )

  const titleLayout =
    face && words
      ? "py-[0.1em] text-[2rem]"
      : "font-read text-lead leading-subhead font-medium text-balance wrap-anywhere"

  return (
    <div
      data-slot="label-card"
      data-link={href ? "" : undefined}
      className={cn(
        "group/label-card frame container-frame relative flex w-[17rem] max-w-full min-w-0 flex-col gap-tight p-(--card-inset) text-pen [--over:3px] calm:[--over:1px]",
        "data-link:hover:[--pen-weight:var(--pen-weight-pressed)]",
        "has-[[data-slot=label-card-link]:focus-visible]:outline-[1.5px] has-[[data-slot=label-card-link]:focus-visible]:outline-offset-4 has-[[data-slot=label-card-link]:focus-visible]:outline-pen has-[[data-slot=label-card-link]:focus-visible]:outline-dashed",
        className,
      )}
      style={frameStyle(key, style)}
      {...props}
    >
      {(picture || spine) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-hair">
          <div data-slot="label-card-art" className="min-w-0">
            {picture}
          </div>
          {spine ? (
            <div
              data-slot="label-card-spine"
              data-spine=""
              className="relative w-[1.3em] font-read text-small leading-[1.3] tracking-[0.04em] text-pen"
            >
              <span className="absolute inset-0 overflow-hidden text-start text-ellipsis whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                {spine}
              </span>
            </div>
          ) : null}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-hair">
        {kicker ? (
          <div data-slot="label-card-kicker" className="label text-pen-quiet">
            {kicker}
          </div>
        ) : null}
        <div
          data-slot="label-card-title"
          className={cn("min-w-0", !href && titleLayout)}
        >
          {href ? (
            <a
              data-slot="label-card-link"
              href={href}
              className={cn(
                titleLayout,
                "no-underline group-hover/label-card:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
              )}
            >
              {heading}
            </a>
          ) : (
            heading
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
