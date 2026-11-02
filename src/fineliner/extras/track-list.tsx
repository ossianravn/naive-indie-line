import type { ComponentProps, ReactNode } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"

// A record's sides as lists, as on the back of a sleeve: each side under a heading in the label voice, each track
// a row with its number and duration in the typewriter, the title in the reading face and a dotted pen leader between.
// Number, leader and duration keep to the title's first line, which greedy wrapping makes its longest, so a long
// title wraps under itself and the leader still starts where its words end. A button as the title (to play the
// track) is set as a block, since an inline-block's baseline is its last line.
// The pen marks the playing track, ringing its number (or ticking it with mark="tick"); a tick can also mark tracks
// already heard. Marks are put down with the pen's short wipe when they appear. Rows stay steady: they are read and
// operated, so nothing here tilts or boils.

/** The record's sides. Put a TrackListSide for each inside; two sit side by side with md:grid-cols-2. */
export function TrackList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="track-list"
      className={cn(
        "grid w-full max-w-[26rem] min-w-0 gap-x-section gap-y-snug text-pen",
        className,
      )}
      {...props}
    />
  )
}

export interface TrackListSideProps extends Omit<
  ComponentProps<"section">,
  "title"
> {
  /** The side's heading, such as "Side A". */
  title: ReactNode
  /** The side's running time, set in the typewriter at the heading's end. */
  duration?: string
}

/** One side: a heading in the label voice over its tracks. */
export function TrackListSide({
  title,
  duration,
  className,
  children,
  ...props
}: TrackListSideProps) {
  return (
    <section
      data-slot="track-list-side"
      className={cn("min-w-0", className)}
      {...props}
    >
      <div
        data-slot="track-list-side-heading"
        className="flex items-baseline justify-between gap-tight pb-hair"
      >
        <h3 className="label m-0 text-pen">{title}</h3>
        {duration ? (
          <span className="font-type text-small text-pen-quiet tabular-nums">
            <span className="sr-only">Running time </span>
            {duration}
          </span>
        ) : null}
      </div>
      <ol className="m-0 flex list-none flex-col p-0">{children}</ol>
    </section>
  )
}

export interface TrackListItemProps extends ComponentProps<"li"> {
  /** The track's number as printed: "A1", "B3" or "4". */
  number: string
  /** The running time: "4:12". */
  duration?: string
  /** The track on the turntable now; the pen rings its number unless `mark` says otherwise. */
  playing?: boolean
  /** How the pen marks this track: a ring round the number or a tick before it. */
  mark?: "ring" | "tick"
}

/** One track: number, title, a dotted leader and the running time. */
export function TrackListItem({
  number,
  duration,
  playing = false,
  mark,
  className,
  children,
  ...props
}: TrackListItemProps) {
  const pen = mark ?? (playing ? "ring" : undefined)
  return (
    <li
      data-slot="track-list-item"
      data-playing={playing ? "" : undefined}
      data-mark={pen}
      aria-current={playing ? "true" : undefined}
      className={cn(
        "relative flex min-w-0 items-baseline gap-x-tight py-[0.3rem] text-ui leading-ui",
        className,
      )}
      {...props}
    >
      <span
        data-slot="track-list-number"
        className="relative inline-flex w-[3.4ch] shrink-0 justify-center font-type text-small text-pen-quiet tabular-nums in-data-playing:text-pen"
      >
        {pen === "ring" ? (
          <PenMark
            name="ring"
            seed={`track:${number}`}
            className="put-down absolute -inset-x-[0.15em] -inset-y-[0.2em] text-pen"
          />
        ) : null}
        {pen === "tick" ? (
          <PenMark
            name="tick"
            seed={`track:${number}`}
            className="put-down absolute top-[0.05em] -left-[1.1em] size-[1.15em] text-pen"
          />
        ) : null}
        {number}
      </span>
      <span
        data-slot="track-list-title"
        className="min-w-0 font-read wrap-anywhere in-data-playing:font-medium [&>button]:block [&>button]:text-start"
      >
        {children}
        {playing ? <span className="sr-only">, playing</span> : null}
        {!playing && pen === "tick" ? (
          <span className="sr-only">, played</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        data-slot="track-list-leader"
        className="h-[3px] min-w-[1.25rem] flex-1 bg-[radial-gradient(circle,currentColor_0.8px,transparent_1.1px)] bg-size-[7px_3px] bg-repeat-x text-pen-faint [filter:var(--wob-3)]"
      />
      {duration ? (
        <span
          data-slot="track-list-duration"
          className="shrink-0 font-type text-small text-pen-quiet tabular-nums"
        >
          {duration}
        </span>
      ) : null}
    </li>
  )
}
