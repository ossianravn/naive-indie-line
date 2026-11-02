import { MoreHorizontalIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import {
  CONDITION_LABEL,
  RELEASES,
  STATUS_LABEL,
  kroner,
  type Release,
} from "./data"

// Records that have a page of their own; ones added in the demo live in memory only.
const PAGES = new Set(RELEASES.map((r) => r.id))

const BADGE = {
  racks: "outline",
  held: "default",
  sold: "secondary",
} as const

/** One record as a catalogue row: its sleeve, title and artist, details, condition, price, status and actions. */
export function RecordRow({
  item,
  fresh,
  onHold,
  onSold,
  onDuplicate,
  onRemove,
}: {
  item: Release
  fresh: boolean
  onHold: () => void
  onSold: () => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const status = (
    <Badge variant={BADGE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
  )
  const price = (
    <span
      className={
        item.status === "sold" ? "text-pen-quiet line-through" : undefined
      }
    >
      {kroner(item.price)}
    </span>
  )
  return (
    <li className="grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-start gap-x-snug gap-y-hair py-tight md:grid-cols-[3.25rem_minmax(0,1.4fr)_minmax(0,1fr)_5.5rem_7.5rem_auto] md:items-center">
      <Drawing
        object="record"
        seed={item.id}
        title=""
        className="row-span-2 w-[3.25rem] md:row-span-1"
      />
      <div className="min-w-0">
        <p className="relative m-0 line-clamp-2 w-fit leading-subhead font-medium wrap-anywhere">
          {PAGES.has(item.id) ? (
            <a
              href={`/listening-room/records/${item.id.toLowerCase()}`}
              className="text-pen no-underline hover:underline"
            >
              {item.title}
            </a>
          ) : (
            item.title
          )}
          {fresh && (
            <PenMark
              name="underline"
              seed={item.id}
              className="put-down absolute inset-x-0 -bottom-1.5 h-2"
            />
          )}
        </p>
        <p
          className="m-0 truncate text-small leading-small text-pen-quiet"
          title={item.artist}
        >
          {item.artist}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-tight gap-y-hair max-md:col-start-2 max-md:row-start-2">
        <p className="m-0 font-type text-small text-pen-quiet">
          {item.id} · {item.format} · {item.genre} ·{" "}
          <abbr
            title={CONDITION_LABEL[item.condition]}
            className="no-underline"
          >
            {item.condition}
          </abbr>
        </p>
        <span className="flex items-center gap-tight md:hidden">
          <span className="font-type text-small tabular-nums">{price}</span>
          {status}
        </span>
      </div>
      <p className="m-0 text-right font-type text-small tabular-nums max-md:hidden">
        {price}
      </p>
      <span className="flex max-md:hidden">{status}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${item.title}`}
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onHold} disabled={item.status === "sold"}>
            {item.status === "held" ? "Back in the racks" : "Put on hold"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSold} disabled={item.status === "sold"}>
            Mark as sold
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            Add another copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onRemove}>
            Remove from catalogue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
