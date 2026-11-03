"use client"

import "@/fineliner/pen/objects/rooms"
import { useRef, type ReactNode } from "react"
import { GradingStory } from "@/fineliner/blocks/article-01-story"
import { EditionNumber } from "@/fineliner/extras/edition-number"
import { ReadingProgress } from "@/fineliner/extras/reading-progress"
import { RoomHeader } from "@/fineliner/extras/room-header"
import { cn } from "@/fineliner/lib/utils"
import type { SceneName } from "@/fineliner/pen/scenes"
import { Badge } from "@/fineliner/ui/badge"
import { Typography } from "@/fineliner/ui/typography"

// A journal post: a pen line along the top that draws itself as you read, a page head with the title lettered beside
// a drawn scene and the issue's number in the kicker, a byline, prose with a drop cap held to the reading measure, a
// pull quote, a hand note in the margin (under its paragraph on narrow screens), and the tags it was filed under.
// Pass your own prose as children; the structure is the block.

export const meta = {
  title: "Article",
  description:
    "A journal post: a lettered title beside a drawn scene, prose with a drop cap, a pull quote, a hand note in the margin and reading progress.",
}

export interface Article01Props {
  /** The journal's issue, in the kicker: Nº 012. */
  issue?: number
  /** The journal's name, beside the issue. */
  section?: string
  /** Lettered by the pen and read as the page's heading. */
  title?: string
  /** One or two sentences under the title. */
  standfirst?: ReactNode
  /** Who wrote it, when, and how long it takes to read. */
  byline?: ReactNode
  scene?: SceneName
  tags?: string[]
  /** The prose, set by Typography. Defaults to the shop's piece on grading. */
  children?: ReactNode
  className?: string
}

export function Article01({
  issue = 12,
  section = "The shop journal",
  title = "How we grade a record",
  standfirst = "Under the lamp, then on the turntable in the room: what M, NM, VG+, VG and G mean on our price tags.",
  byline = "Ellen Moe · Thursday 5 November 2026 · 4 min read",
  scene = "room",
  tags = ["Grading", "The racks", "The listening room"],
  children = <GradingStory />,
  className,
}: Article01Props) {
  const article = useRef<HTMLElement>(null)
  return (
    <div className={cn("@container", className)}>
      <ReadingProgress target={article} seed={`article:${title}`} />
      <article
        ref={article}
        className="mx-auto max-w-[66rem] px-snug pt-section pb-page @min-[40rem]:px-line"
      >
        <RoomHeader
          title={title}
          scene={scene}
          seed={`journal:${issue}`}
          kicker={
            <>
              <EditionNumber value={issue} digits={3} /> · {section}
            </>
          }
        >
          <p>{standfirst}</p>
        </RoomHeader>
        {byline && <p className="label m-0 mt-line text-pen-quiet">{byline}</p>}

        <Typography dropCap className="mt-line">
          {children}
        </Typography>

        {tags.length > 0 && (
          <footer className="mt-section max-w-measure">
            <div className="rule text-pen-faint" aria-hidden="true" />
            <p className="label m-0 mt-tight text-pen-quiet">Filed under</p>
            <ul className="m-0 mt-hair flex list-none flex-wrap gap-hair p-0">
              {tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline">{tag}</Badge>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </div>
  )
}

export default Article01
