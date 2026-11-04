"use client"

import "@/fineliner/pen/objects/rooms"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { DicesIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { settleDrawing } from "@/fineliner/drawing/drawing-motion"
import { Lettering, type LetteringFace } from "@/fineliner/drawing/lettering"
import { cn } from "@/fineliner/lib/utils"
import { SCENES, type SceneName } from "@/fineliner/pen/scenes"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { Button, buttonVariants } from "@/fineliner/ui/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/fineliner/ui/code-block"

// A landing hero: the product's name lettered by the pen, one line of copy, the install command in a code block and
// two actions, in a room the pen draws. Open (the default), the room has no border: on a wide container it fills the
// section behind the text, its floor across the whole width and its lamp hung from whatever line is above, cropped like
// a photograph to the section's shape; on a narrow one the text comes first and a tall room follows it, full width.
// Boxed, the scene stands in its border beside the text. Reroll redraws the room from a new seed and lets it settle
// through its takes; the seeds walk a seeded stream from the first, so every visitor meets the same sequence of rooms.
// Every prop has a default (Fineliner's own landing copy and Listening Room's scene), so the block renders as a
// finished page as it is. The open section is a screen tall less --hero-top, the height of what sits above it.

export const meta = {
  title: "Hero",
  description:
    "A lettered wordmark beside a scene the visitor can reroll, one line of copy, the install command and two actions.",
}

export interface Hero01Props {
  /** The product's name, lettered by the pen and read as the page's heading. */
  product?: string
  /** The wordmark's face: "line" (Fineliner Naïve Sans), "inline" or "tramline" (import their stylesheets once). */
  face?: LetteringFace
  /** A line in the label voice above the name. */
  kicker?: ReactNode
  /** One line under the name. */
  copy?: ReactNode
  /** The install command, with a copy button. */
  command?: string
  /** The page's actions, usually two links styled with buttonVariants. */
  actions?: ReactNode
  /** room (a listening room), studio (a freelancer's desk) or bistro (a table for two). */
  scene?: SceneName
  /** The scene's first seed; rerolls continue from it. */
  seed?: string
  /** open: the room fills the section (a scene without open formats is drawn boxed); boxed: in its border beside. */
  room?: "open" | "boxed"
  className?: string
}

const ADJECTIVES = [
  "quiet",
  "late",
  "slow",
  "warm",
  "blue",
  "low",
  "dusty",
  "soft",
  "rainy",
  "early",
  "worn",
  "sunday",
  "small",
  "second",
  "golden",
  "still",
]
const NOUNS = [
  "corner",
  "crate",
  "needle",
  "sleeve",
  "groove",
  "shelf",
  "lamp",
  "speaker",
  "record",
  "evening",
  "sofa",
  "window",
  "radio",
  "tape",
  "chorus",
  "b-side",
]

/** The seed after this one: a word pair drawn from a stream forked from the current seed, never the same twice. */
export function nextSeed(seed: string) {
  const words = stream(seedOf(seed), "hero:reroll")
  let next = seed
  while (next === seed) next = `${words.pick(ADJECTIVES)}-${words.pick(NOUNS)}`
  return next
}

// Links styled as buttons: they navigate, so they stay links for assistive technology.
const ACTIONS = (
  <>
    <a href="/docs" className={cn(buttonVariants(), "no-underline")}>
      Browse the components
    </a>
    <a
      href="/docs/blocks"
      className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
    >
      See the blocks
    </a>
  </>
)

export function Hero01({
  product = "Fineliner",
  face = "line",
  kicker,
  copy = "A shadcn/ui kit drawn the way a natural-wine label is: one pen, cream paper and a quiet hand.",
  command = "npx shadcn add @fineliner/fineliner",
  actions = ACTIONS,
  scene = "room",
  seed: first = "corner-shop",
  room = "open",
  className,
}: Hero01Props) {
  const [seed, setSeed] = useState(first)
  const picture = useRef<HTMLElement>(null)
  const titleId = useId()
  const rerolled = seed !== first
  const wide = SCENES[scene]?.open?.wide
  const open = room === "open" && !!wide

  // A rerolled room settles through its takes instead of being drawn on again.
  useEffect(() => {
    if (rerolled && picture.current) settleDrawing(picture.current)
  }, [seed, rerolled])

  const text = (
    <div className="min-w-0">
      {kicker && <p className="label m-0 mb-snug text-pen-quiet">{kicker}</p>}
      <h1 id={titleId} className="m-0">
        <Lettering
          text={product}
          face={face}
          className="block text-[clamp(3.25rem,13cqi,6.5rem)]"
        />
      </h1>
      {copy && (
        <p className="m-0 mt-line max-w-measure text-body leading-body @min-[40rem]:text-lead @min-[40rem]:leading-lead">
          {copy}
        </p>
      )}
      {command && (
        <CodeBlock className="mt-line w-fit max-w-full flex-row items-center">
          {/* Wraps at a space only when the column is too narrow for the whole command. */}
          <CodeBlockContent wrap className="flex-1">
            {command}
          </CodeBlockContent>
          {/* Not CodeBlockActions: as a direct child it shows only on hover, and the hero's copy stays put. In the
              label voice, as every code block header's copy button is. */}
          <div className="label shrink-0 pe-1.5">
            <CodeBlockCopyButton value={command} />
          </div>
        </CodeBlock>
      )}
      {actions && (
        <div className="mt-line flex flex-wrap items-center gap-tight">
          {actions}
        </div>
      )}
    </div>
  )
  const caption = (className?: string) => (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-snug gap-y-hair",
        className,
      )}
    >
      <p aria-live="polite" className="label m-0 min-w-0 text-pen-quiet">
        {SCENES[scene]?.name ?? scene} · seed{" "}
        <span className="font-type tracking-normal text-pen normal-case [font-variant-caps:normal]">
          {seed}
        </span>
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSeed(nextSeed(seed))}
      >
        <DicesIcon data-icon="inline-start" />
        Reroll
      </Button>
    </div>
  )

  if (!open)
    return (
      <div className={cn("@container", className)}>
        <section
          ref={picture}
          data-slot="hero"
          aria-labelledby={titleId}
          className="mx-auto grid max-w-[76rem] items-center gap-x-page gap-y-section px-snug pt-section pb-section @min-[40rem]:px-line @min-[56rem]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          {text}
          <figure className="m-0 mx-auto w-full max-w-[40rem]">
            <Drawing scene={scene} seed={seed} drawOnView={!rerolled} />
            {caption("mt-tight")}
          </figure>
        </section>
      </div>
    )

  return (
    <div className={cn("@container", className)}>
      <section
        ref={picture}
        data-slot="hero"
        aria-labelledby={titleId}
        className="relative flex flex-col @min-[64rem]:min-h-[max(38rem,calc(100svh-var(--hero-top,0rem)))]"
      >
        {/* Wide: the room behind the text, as wide as the section or as tall, whichever covers it, the floor kept at
            the bottom and the sides cropped evenly. */}
        <div className="absolute inset-0 hidden overflow-hidden [container-type:size] @min-[64rem]:block">
          <Drawing
            scene={scene}
            format="wide"
            seed={seed}
            drawOnView={!rerolled}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: `max(100cqw, calc(100cqh * ${wide.size[0] / wide.size[1]}))`,
            }}
          />
        </div>
        {/* The text column lets the pointer through to the room around it, for line boil on hover. */}
        <div className="pointer-events-none relative mx-auto flex w-full max-w-[76rem] flex-1 flex-col px-snug pt-section @min-[40rem]:px-line @min-[64rem]:pt-page">
          <div className="pointer-events-auto @min-[64rem]:max-w-[min(31rem,40cqi)]">
            {text}
          </div>
          {caption(
            "pointer-events-auto mt-auto hidden pt-section pb-line @min-[64rem]:flex",
          )}
        </div>
        <figure className="m-0 mt-section @min-[64rem]:hidden">
          <Drawing
            scene={scene}
            format="tall"
            seed={seed}
            drawOnView={!rerolled}
          />
          {caption("mt-tight px-snug @min-[40rem]:px-line")}
        </figure>
      </section>
    </div>
  )
}

export default Hero01
