"use client"

import "@/fineliner/pen/objects/indie"
import { useRef, useState, type ReactNode } from "react"
import { CalendarPlusIcon, PlusIcon, SearchIcon } from "lucide-react"
import { cn } from "@/fineliner/lib/utils"
import { Button } from "@/fineliner/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/fineliner/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/fineliner/ui/input-group"

// A page with nothing to show, in three states: an empty catalogue, a search that matched nothing, and a week with
// nothing booked. Each is a drawing the pen draws on the first time it is seen, a serif title, one line on why and
// the one action that helps. The search state keeps its field, so clearing the search leaves focus where the next
// one starts.

export const meta = {
  title: "Empty states",
  description:
    "An empty catalogue, a search with no results and a week with nothing booked, each a drawing, one line and one action.",
  variants: ["first-run", "no-results", "no-bookings"],
}

export type Empty01Variant = "first-run" | "no-results" | "no-bookings"

export interface Empty01Props {
  variant?: Empty01Variant
  /** The search that found nothing, for the no-results state. */
  query?: string
  onAdd?: () => void
  onClearSearch?: () => void
  onBook?: () => void
  className?: string
}

export function Empty01({
  variant = "first-run",
  query = "Ellen Mow",
  onAdd,
  onClearSearch,
  onBook,
  className,
}: Empty01Props) {
  const [search, setSearch] = useState(query)
  const field = useRef<HTMLInputElement>(null)
  const sessions = variant === "no-bookings"

  let state: ReactNode
  if (variant === "no-results") {
    state = search ? (
      <State
        object="record"
        seed="empty:search"
        title={`Nothing matches “${search}”`}
        description="Check the spelling, or search by artist, title or catalogue number."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setSearch("")
              field.current?.focus()
              onClearSearch?.()
            }}
          >
            Clear the search
          </Button>
        }
      />
    ) : (
      <State
        object="record"
        seed="empty:search"
        title="Search the racks"
        description="Artists, titles and catalogue numbers all work."
      />
    )
  } else if (sessions) {
    state = (
      <State
        object="armchair"
        seed="empty:sessions"
        title="The room is free"
        description="Nobody has booked the listening room this week."
        action={
          <Button onClick={() => onBook?.()}>
            <CalendarPlusIcon data-icon="inline-start" />
            Book the room
          </Button>
        }
      />
    )
  } else {
    state = (
      <State
        object="crate"
        seed="empty:catalogue"
        title="The racks are empty"
        description="Your first record starts the catalogue."
        action={
          <Button onClick={() => onAdd?.()}>
            <PlusIcon data-icon="inline-start" />
            Add a record
          </Button>
        }
      />
    )
  }

  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[56rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <p className="label m-0 text-pen-quiet">
          {sessions ? "The room · this week" : "The shop"}
        </p>
        <h1 className="m-0 mt-hair text-h1">
          {sessions ? "Sessions" : "Catalogue"}
        </h1>
        {variant === "no-results" && (
          <InputGroup className="mt-snug w-[22rem] max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={field}
              type="search"
              aria-label="Search the catalogue"
              placeholder="Artist, title or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        )}
        <Empty className="mt-section min-h-[22rem]">{state}</Empty>
      </div>
    </div>
  )
}

function State({
  object,
  seed,
  title,
  description,
  action,
}: {
  /** An object from the drawing library. */
  object: string
  seed: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <>
      <EmptyHeader>
        <EmptyMedia object={object} seed={seed} />
        <EmptyTitle>
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit]">
            {title}
          </h2>
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </>
  )
}

export default Empty01
