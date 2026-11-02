import type { MouseEvent } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/fineliner/ui/pagination"

/**
 * The page numbers to show: every page when they fit, otherwise the ends, the current page and `near` pages either
 * side of it, with gaps between.
 */
export function pageList(
  page: number,
  pages: number,
  near = 1,
): (number | "gap")[] {
  if (pages <= 5 + near * 2)
    return Array.from({ length: pages }, (_, i) => i + 1)
  const middle = Array.from({ length: near * 2 + 1 }, (_, i) => page - near + i)
  const inner = middle.filter((p) => p > 1 && p < pages)
  // At either end the middle is empty; show the adjacent page so one gap separates the ends.
  const shown = inner.length ? inner : [page <= 1 ? 2 : pages - 1]
  const list: (number | "gap")[] = [1]
  if ((shown[0] ?? pages) > 2) list.push("gap")
  list.push(...shown)
  if ((shown.at(-1) ?? 1) < pages - 1) list.push("gap")
  list.push(pages)
  return list
}

/**
 * Pagination driving in-page state: each link changes the page in place. On page one, Previous is aria-disabled.
 * Phones get a shorter list (no neighbours of the current page), so the 44px targets fit a 390px screen.
 */
export function PagePicker({
  page,
  pages,
  onPage,
  className,
}: {
  page: number
  pages: number
  onPage: (page: number) => void
  className?: string
}) {
  const go = (to: number) => (e: MouseEvent) => {
    e.preventDefault()
    if (to >= 1 && to <= pages) onPage(to)
  }
  const first = page <= 1
  const last = page >= pages
  return (
    <Pagination className={className ?? "mx-0 w-auto"}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`#page-${page - 1}`}
            onClick={go(page - 1)}
            aria-disabled={first || undefined}
            tabIndex={first ? -1 : undefined}
          />
        </PaginationItem>
        {(
          [
            ["wide", 1, "max-sm:hidden"],
            ["phone", 0, "sm:hidden"],
          ] as const
        ).map(([key, near, hide]) =>
          pageList(page, pages, near).map((p, i) =>
            p === "gap" ? (
              <PaginationItem key={`${key}-gap-${i}`} className={hide}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`${key}-${p}`} className={hide}>
                <PaginationLink
                  href={`#page-${p}`}
                  isActive={p === page}
                  onClick={go(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={`#page-${page + 1}`}
            onClick={go(page + 1)}
            aria-disabled={last || undefined}
            tabIndex={last ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
