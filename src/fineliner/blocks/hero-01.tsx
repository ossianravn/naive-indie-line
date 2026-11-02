"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { DicesIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { settleDrawing } from "@/fineliner/drawing/drawing-motion"
import { Lettering } from "@/fineliner/drawing/lettering"
import { cn } from "@/fineliner/lib/utils"
import type { FaceName } from "@/fineliner/pen/lettering-svg"
import { SCENES, type SceneName } from "@/fineliner/pen/scenes"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { Button, buttonVariants } from "@/fineliner/ui/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/fineliner/ui/code-block"

// A landing hero: the product's name lettered by the pen, one line of copy, the install command in a code block and
// two actions, beside a scene the pen draws on the first time it is seen. Reroll redraws the scene from a new seed
// and lets it settle through its takes; the seeds walk a seeded stream from the first, so every visitor meets the same
// sequence of rooms. On narrow screens the scene follows the text. Every prop has a default (Fineliner's own landing
// copy and Listening Room's scene), so the block renders as a finished page as it is.

export const meta = {
  title: "Hero",
  description:
    "A lettered wordmark beside a scene the visitor can reroll, one line of copy, the install command and two actions.",
}

export interface Hero01Props {
  /** The product's name, lettered by the pen and read as the page's heading. */
  product?: string
  /** The lettering face: liner, stilt, ribbon or tramline. */
  face?: FaceName
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
  face = "liner",
  kicker,
  copy = "A shadcn/ui kit drawn the way a natural-wine label is: one pen, cream paper and a quiet hand.",
  command = "npx shadcn add @fineliner/fineliner",
  actions = ACTIONS,
  scene = "room",
  seed: first = "corner-shop",
  className,
}: Hero01Props) {
  const [seed, setSeed] = useState(first)
  const picture = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const rerolled = seed !== first

  // A rerolled scene settles through its takes instead of being drawn on again.
  useEffect(() => {
    if (rerolled && picture.current) settleDrawing(picture.current)
  }, [seed, rerolled])

  return (
    <div className={cn("@container", className)}>
      <section
        data-slot="hero"
        aria-labelledby={titleId}
        className="mx-auto grid max-w-[76rem] items-center gap-x-page gap-y-section px-snug pt-section pb-section @min-[40rem]:px-line @min-[56rem]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div className="min-w-0">
          {kicker && (
            <p className="label m-0 mb-snug text-pen-quiet">{kicker}</p>
          )}
          <h1 id={titleId} className="m-0">
            <span className="sr-only">{product}</span>
            <Lettering
              aria-hidden="true"
              text={product}
              face={face}
              seed={`wordmark:${product}`}
              className="w-full max-w-[26rem]"
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
              {/* Not CodeBlockActions: as a direct child it shows only on hover, and the hero's copy stays put. */}
              <div className="shrink-0 pe-1.5">
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

        <figure className="m-0 mx-auto w-full max-w-[40rem]">
          <div ref={picture}>
            <Drawing scene={scene} seed={seed} drawOnView={!rerolled} />
          </div>
          <figcaption className="mt-tight flex flex-wrap items-center gap-x-snug gap-y-hair">
            <p aria-live="polite" className="label m-0 min-w-0 text-pen-quiet">
              {SCENES[scene].name} · seed{" "}
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
          </figcaption>
        </figure>
      </section>
    </div>
  )
}

export default Hero01
