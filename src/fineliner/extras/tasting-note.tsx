import "@/fineliner/pen/objects/food"
import { Fragment, type ComponentProps, type ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { wordsOf } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import type { HandName } from "@/fineliner/pen"

// A wine on the shop's list, set like a bistro's card: a drawn bottle or glass beside the name and producer in the
// reading face, grape, region and year in the typewriter, the note in the hand voice (the one place on the list that
// sounds like a person) and the price in the typewriter at the line's end, with the glass price under it. A wine that
// has run out keeps its place with the price struck through by the pen. The name seeds the drawing.

export interface TastingNoteProps extends Omit<ComponentProps<"div">, "title"> {
  /** The wine's name. */
  name: ReactNode
  producer?: ReactNode
  grape?: ReactNode
  region?: ReactNode
  year?: ReactNode
  /** The price of a bottle, such as "420 kr". */
  price?: ReactNode
  /** The price of a glass, set under the bottle's. */
  glass?: ReactNode
  /** The drawing beside it. */
  vessel?: "bottle" | "glass" | "carafe"
  /** All gone: the price is struck through and the words say so. */
  soldOut?: boolean
  /** Same seed, same drawing. Defaults to the name. */
  seed?: string | number
  hand?: HandName
  /** The note, in the hand voice. */
  children?: ReactNode
}

/** A fact that never breaks inside a name: "Chenin blanc, pét-nat" may wrap after its comma, never at the hyphen. */
function unbroken(part: ReactNode) {
  if (typeof part !== "string")
    return <span className="whitespace-nowrap">{part}</span>
  return part.split(/,\s*/).map((piece, i, all) => (
    <Fragment key={i}>
      <span className="whitespace-nowrap">{piece}</span>
      {i < all.length - 1 ? ", " : null}
    </Fragment>
  ))
}

/** A wine on the list: drawing, name, producer, facts, a note in the hand and the price. */
export function TastingNote({
  name,
  producer,
  grape,
  region,
  year,
  price,
  glass,
  vessel = "bottle",
  soldOut = false,
  seed,
  hand,
  className,
  children,
  ...props
}: TastingNoteProps) {
  const key = String(seed ?? wordsOf(name))
  const facts = [grape, region, year].filter(
    (part) => part !== undefined && part !== null && part !== "",
  )

  return (
    <div
      data-slot="tasting-note"
      data-sold-out={soldOut ? "" : undefined}
      className={cn(
        "grid w-full max-w-measure min-w-0 grid-cols-[2.75rem_minmax(0,1fr)_auto] gap-x-tight gap-y-hair sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-x-snug text-pen",
        className,
      )}
      {...props}
    >
      <Drawing
        object={vessel}
        seed={key}
        hand={hand}
        title=""
        className={cn(
          "row-span-4 self-start pt-hair",
          vessel === "glass" ? "w-[85%] justify-self-center" : "w-full",
        )}
      />
      <div className="col-start-2 min-w-0">
        <div
          data-slot="tasting-note-name"
          className="font-read text-lead leading-subhead font-medium text-balance wrap-anywhere"
        >
          {name}
        </div>
        {producer ? (
          <div
            data-slot="tasting-note-producer"
            className="text-ui leading-ui text-pen-quiet"
          >
            {producer}
          </div>
        ) : null}
      </div>
      {price || glass || soldOut ? (
        <div
          data-slot="tasting-note-price"
          className="col-start-3 row-start-1 flex flex-col items-end pt-[0.3rem] text-end font-type text-body leading-ui whitespace-nowrap tabular-nums"
        >
          {price ? (
            <span className="relative in-data-sold-out:text-pen-quiet">
              {price}
              {soldOut ? (
                <PenMark
                  name="strike"
                  seed={`${key}:sold`}
                  className="absolute -inset-x-[0.2em] top-1/2 h-2 -translate-y-1/2"
                />
              ) : null}
            </span>
          ) : null}
          {glass && !soldOut ? (
            <span className="text-small text-pen-quiet">
              <span className="label me-[0.4em]">Glass</span>
              {glass}
            </span>
          ) : null}
          {soldOut ? (
            <span className="label text-pen-quiet">Sold out</span>
          ) : null}
        </div>
      ) : null}
      {facts.length ? (
        <p
          data-slot="tasting-note-facts"
          className="col-span-2 col-start-2 m-0 font-type text-small leading-small"
        >
          {facts.map((part, i) => (
            <Fragment key={i}>
              {i > 0 ? (
                <span aria-hidden="true" className="text-pen-faint">
                  {"\u00a0· "}
                </span>
              ) : null}
              {unbroken(part)}
            </Fragment>
          ))}
        </p>
      ) : null}
      {children ? (
        <p
          data-slot="tasting-note-note"
          className="col-span-2 col-start-2 m-0 max-w-[30rem] font-hand text-lead leading-(--lh-hand) text-pretty"
        >
          {children}
        </p>
      ) : null}
    </div>
  )
}
