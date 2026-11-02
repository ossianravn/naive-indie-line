import { useMemo, useState } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import { Checkbox } from "@/fineliner/ui/checkbox"
import { Input } from "@/fineliner/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import {
  RELEASES,
  STATUS_LABEL,
  kroner,
  type Release,
} from "@/site/listening-room/data"

// A data table from Table and the existing primitives alone: sortable heads, a search field, row selection with a
// head checkbox that goes partly checked, and paging. No table library.

type Column = "title" | "artist" | "price"
type Sort = { column: Column; dir: "asc" | "desc" }

const PAGE_SIZE = 5
const BADGE = { racks: "outline", held: "secondary", sold: "ghost" } as const

const compare = (a: Release, b: Release, column: Column) =>
  column === "price"
    ? a.price - b.price
    : a[column].localeCompare(b[column], "en-GB")

function SortHead({
  column,
  label,
  sort,
  onSort,
  numeric = false,
  className,
}: {
  column: Column
  label: string
  sort: Sort
  onSort: (column: Column) => void
  numeric?: boolean
  className?: string
}) {
  const dir = sort.column === column ? sort.dir : undefined
  return (
    <TableHead
      aria-sort={
        dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"
      }
      className={cn(numeric && "text-right", className)}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "-mx-1 inline-flex h-control-compact cursor-pointer items-center gap-1.5 px-1 transition-colors hover:text-pen",
          numeric && "flex-row-reverse",
          dir && "text-pen",
        )}
      >
        {label}
        <PenMark
          name="chevron"
          seed={`sort:${column}`}
          hand="calm"
          className={cn(
            "h-2 w-2.5",
            dir === "asc" && "rotate-180",
            !dir && "opacity-0",
          )}
        />
      </button>
    </TableHead>
  )
}

export function DataTable() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>({ column: "title", dir: "asc" })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(["LR-0427"]),
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const found = RELEASES.filter((r) =>
      [r.title, r.artist, r.genre].some((f) => f.toLowerCase().includes(q)),
    )
    const sign = sort.dir === "asc" ? 1 : -1
    return found.sort((a, b) => sign * compare(a, b, sort.column))
  }, [query, sort])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const onPage = shown.filter((r) => selected.has(r.id)).length
  const all = shown.length > 0 && onPage === shown.length

  const onSort = (column: Column) =>
    setSort((s) =>
      s.column === column
        ? { column, dir: s.dir === "asc" ? "desc" : "asc" }
        : { column, dir: column === "price" ? "desc" : "asc" },
    )
  const toggle = (ids: string[], on: boolean) =>
    setSelected((s) => {
      const next = new Set(s)
      for (const id of ids) {
        if (on) next.add(id)
        else next.delete(id)
      }
      return next
    })

  return (
    <div className="flex w-full max-w-[48rem] flex-col gap-tight">
      <Input
        type="search"
        aria-label="Search the catalogue"
        placeholder="Title, artist or genre"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(1)
        }}
        className="w-full sm:w-[17rem]"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select every record on this page"
                checked={all}
                indeterminate={onPage > 0 && !all}
                onCheckedChange={(on) =>
                  toggle(
                    shown.map((r) => r.id),
                    on,
                  )
                }
              />
            </TableHead>
            <SortHead
              column="title"
              label="Title"
              sort={sort}
              onSort={onSort}
            />
            <SortHead
              column="artist"
              label="Artist"
              sort={sort}
              onSort={onSort}
              className="max-sm:hidden"
            />
            <SortHead
              column="price"
              label="Price"
              sort={sort}
              onSort={onSort}
              numeric
              className="w-24"
            />
            <TableHead className="w-32 max-sm:hidden">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((r) => (
            <TableRow
              key={r.id}
              data-state={selected.has(r.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${r.title} by ${r.artist}`}
                  checked={selected.has(r.id)}
                  onCheckedChange={(on) => toggle([r.id], on)}
                />
              </TableCell>
              <TableCell className="whitespace-normal">
                <span className="font-medium">{r.title}</span>
                <span className="block font-type text-small whitespace-nowrap text-pen-quiet">
                  {r.id} · {r.format}
                </span>
              </TableCell>
              <TableCell className="text-pen-quiet max-sm:hidden">
                {r.artist}
              </TableCell>
              <TableCell className="text-right font-type text-small">
                {kroner(r.price)}
              </TableCell>
              <TableCell className="max-sm:hidden">
                <Badge variant={BADGE[r.status]}>
                  {STATUS_LABEL[r.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {shown.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-snug text-center text-pen-quiet"
              >
                No record matches “{query.trim()}”.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-tight">
        <p className="label m-0 text-pen-quiet" aria-live="polite">
          {selected.size} of {RELEASES.length} selected
        </p>
        <div className="flex items-center gap-tight">
          <span className="font-type text-small text-pen-quiet">
            {current} / {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
