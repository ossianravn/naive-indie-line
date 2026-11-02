import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { NativeSelect, NativeSelectOption } from "@/fineliner/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/fineliner/ui/alert-dialog"
import {
  RELEASES,
  STATUS_LABEL,
  catalogueNumber,
  nextNumber,
  recordsWord,
  tally,
  type Release,
  type Status,
} from "./data"
import { AddRecord } from "./add-record"
import { RecordRow } from "./record-row"

type Filter = "all" | Status

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ...(Object.entries(STATUS_LABEL) as [Status, string][]),
]
/** Rows rendered at a time; "Show more" adds another page. */
const PAGE = 50

/** Listening Room's main screen: the catalogue, searchable and filterable, with add, hold, sell and remove. */
export function Catalogue({ initial = RELEASES }: { initial?: Release[] }) {
  const [items, setItems] = useState<Release[]>(initial)
  const [next, setNext] = useState(() => nextNumber(initial))
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [limit, setLimit] = useState(PAGE)
  const [fresh, setFresh] = useState<string | null>(null)
  const [doomed, setDoomed] = useState<Release | null>(null)
  const [message, setMessage] = useState("")

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q ||
          `${r.title} ${r.artist} ${r.genre} ${r.id}`
            .toLowerCase()
            .includes(q)),
    )
  }, [items, query, filter])

  const search = (q: string) => [setQuery(q), setLimit(PAGE)]
  const show = (f: Filter) => [setFilter(f), setLimit(PAGE)]
  const change = (id: string, patch: Partial<Release>, said: string) => {
    setItems((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    setMessage(said)
  }
  const add = (item: Release) => {
    setItems((list) => [item, ...list])
    setNext((n) => n + 1)
    setFresh(item.id)
    search("")
    show("all")
    setMessage(`Added ${item.title}.`)
  }
  const remove = () => {
    if (!doomed) return
    setItems((list) => list.filter((r) => r.id !== doomed.id))
    setMessage(`Removed ${doomed.title}.`)
    setDoomed(null)
  }

  return (
    <div className="mx-auto max-w-[72rem] px-snug pt-section pb-page sm:px-line">
      <header className="flex flex-wrap items-end justify-between gap-snug">
        <div>
          <p className="label m-0 text-pen-quiet">The racks · November</p>
          <h1 className="m-0 mt-hair text-h1">Catalogue</h1>
        </div>
        <AddRecord onAdd={add} next={next} />
      </header>

      {items.length > 0 && (
        <div className="mt-line flex flex-wrap items-center gap-x-section gap-y-tight">
          <label className="relative">
            <span className="sr-only">Search the catalogue</span>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-tight size-4 -translate-y-1/2 text-pen-quiet"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Title, artist or genre"
              className="w-[16rem] pl-9"
            />
          </label>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[filter]}
            onValueChange={(value) => show((value[0] as Filter) ?? "all")}
            aria-label="Show"
            className="max-sm:hidden"
          >
            {FILTERS.map(([value, label]) => (
              <ToggleGroupItem key={value} value={value}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <NativeSelect
            value={filter}
            onChange={(e) => show(e.target.value as Filter)}
            aria-label="Show"
            className="w-[10rem] sm:hidden"
          >
            {FILTERS.map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className="label m-0 text-pen-quiet" aria-live="polite">
            {tally(shown.length)} of {tally(items.length)}{" "}
            {recordsWord(items.length)}
            {message && ` · ${message}`}
          </p>
        </div>
      )}

      {shown.length ? (
        <>
          <ul className="m-0 mt-snug list-none p-0 [&>li]:border-b [&>li]:border-dotted [&>li]:border-pen-faint">
            {shown.slice(0, limit).map((item) => (
              <RecordRow
                key={item.id}
                item={item}
                fresh={item.id === fresh}
                onHold={() =>
                  change(
                    item.id,
                    { status: item.status === "held" ? "racks" : "held" },
                    item.status === "held"
                      ? `${item.title} is back in the racks.`
                      : `${item.title} is on hold.`,
                  )
                }
                onSold={() =>
                  change(item.id, { status: "sold" }, `Sold ${item.title}.`)
                }
                onDuplicate={() =>
                  add({ ...item, id: catalogueNumber(next), status: "racks" })
                }
                onRemove={() => setDoomed(item)}
              />
            ))}
          </ul>
          {shown.length > limit && (
            <div className="mt-snug flex flex-wrap items-center gap-snug">
              <Button
                variant="outline"
                onClick={() => setLimit((n) => n + PAGE)}
              >
                Show more
              </Button>
              <p className="label m-0 text-pen-quiet">
                {tally(limit)} of {tally(shown.length)} shown
              </p>
            </div>
          )}
        </>
      ) : items.length ? (
        <div className="mt-section flex flex-col items-center gap-tight text-center">
          <Drawing
            object="crate"
            seed={`empty-${query}-${filter}`}
            title=""
            className="w-32"
          />
          <p className="m-0 text-lead leading-subhead font-medium">
            Nothing in these racks
          </p>
          <p className="m-0 text-small leading-small text-pen-quiet">
            No record fits that search and filter.
          </p>
          <Button variant="outline" onClick={() => [search(""), show("all")]}>
            Show every record
          </Button>
        </div>
      ) : (
        <div className="mt-section flex flex-col items-center gap-tight text-center">
          <Drawing
            object="turntable"
            seed="empty-catalogue"
            title=""
            drawOnView
            className="w-36"
          />
          <p className="m-0 text-lead leading-subhead font-medium">
            The racks are empty
          </p>
          <p className="m-0 text-small leading-small text-pen-quiet">
            Your first record starts the catalogue.
          </p>
        </div>
      )}

      <AlertDialog
        open={!!doomed}
        onOpenChange={(open) => !open && setDoomed(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {doomed?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This takes {doomed?.id} out of the catalogue. In this demo it
              comes back when you reload.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
