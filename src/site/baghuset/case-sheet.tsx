"use client"

// One piece of work on the wall: a pinned sheet that opens its case, in a dialog on a wide screen and a drawer on a
// phone. The case shows the drawing large, three short paragraphs, a quote, its number in the archive and "Visit"
// where the work is live. Off the wall (filtered out), the sheet fades and its fixing stays.
// A wide screen swaps the server's drawer trigger for a dialog's, which draws the sheet again in the browser: so this
// imports the collections the work is drawn from (not the building's strips, which hydration keeps as served).
import "@/fineliner/pen/objects/indie"
import "@/fineliner/pen/objects/food"
import "@/fineliner/pen/objects/studio"
import { useSyncExternalStore, type ReactElement, type ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { EditionNumber } from "@/fineliner/extras/edition-number"
import { Pinned } from "@/fineliner/extras/pinned"
import { PullQuote } from "@/fineliner/extras/pull-quote"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { buttonVariants } from "@/fineliner/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/fineliner/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/fineliner/ui/drawer"
import type { Work } from "./data"

const WIDE = "(min-width: 48rem)"
const subscribe = (change: () => void) => {
  const query = matchMedia(WIDE)
  query.addEventListener("change", change)
  return () => query.removeEventListener("change", change)
}
/** A dialog from 48rem up, a drawer below; the server sends the drawer's trigger, which is the same sheet. */
function useWide() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(WIDE).matches,
    () => false,
  )
}

function Story({
  work,
  title,
  description,
}: {
  work: Work
  title: ReactNode
  description: ReactNode
}) {
  return (
    <div className="grid gap-y-snug">
      <Drawing
        object={work.object}
        seed={`baghuset-case-${work.id}`}
        title=""
        className="justify-self-center [&>svg]:h-40 [&>svg]:w-auto [&>svg]:max-w-full"
      />
      <div className="flex items-baseline justify-between gap-x-snug">
        {title}
        <EditionNumber
          value={work.number}
          digits={3}
          className="text-small text-pen-quiet"
        />
      </div>
      {description}
      {work.story.slice(1).map((line) => (
        <p key={line} className="m-0 max-w-measure">
          {line}
        </p>
      ))}
      <PullQuote cite={work.quote[1]}>{work.quote[0]}</PullQuote>
      {work.href ? (
        <a
          href={work.href}
          data-slot="button"
          className={buttonVariants({
            className: "justify-self-start no-underline",
          })}
          style={frameStyle(["Visit"])}
        >
          Visit {work.title}
        </a>
      ) : null}
    </div>
  )
}

export function CaseSheet({ work, away }: { work: Work; away: boolean }) {
  const wide = useWide()
  const sheet: ReactElement = (
    <Pinned
      fix={work.fix}
      seed={work.id}
      away={away}
      aria-label={`${work.title}, the case`}
    >
      <span className="grid gap-y-tight">
        <Drawing
          object={work.object}
          seed={`baghuset-${work.id}`}
          title=""
          className="justify-self-center [&>svg]:h-16 [&>svg]:w-auto [&>svg]:max-w-full sm:[&>svg]:h-24"
        />
        <span className="font-read text-body leading-body sm:text-lead sm:leading-subhead">
          {work.title}
        </span>
        <span className="flex flex-wrap gap-x-tight font-type text-small leading-small text-pen-quiet">
          <span className="basis-full">{work.client}</span>
          <span>{work.year}</span>
          <span>{work.kinds.join(", ")}</span>
        </span>
      </span>
    </Pinned>
  )
  const lead = <p className="m-0 max-w-measure">{work.story[0]}</p>
  if (wide)
    return (
      <Dialog>
        <DialogTrigger render={sheet} />
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[38rem]">
          <Story
            work={work}
            title={
              <DialogTitle className="text-h2 leading-heading">
                {work.title}
              </DialogTitle>
            }
            description={<DialogDescription render={lead} />}
          />
        </DialogContent>
      </Dialog>
    )
  return (
    <Drawer>
      <DrawerTrigger render={sheet} />
      <DrawerContent className="max-h-[90dvh] overflow-y-auto px-snug pb-line">
        <Story
          work={work}
          title={
            <DrawerTitle className="text-h2 leading-heading">
              {work.title}
            </DrawerTitle>
          }
          description={<DrawerDescription render={lead} />}
        />
      </DrawerContent>
    </Drawer>
  )
}
