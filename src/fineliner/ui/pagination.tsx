import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

import { Button } from "@/fineliner/ui/button"

// Typed page numbers as ghost buttons (a pale pocket under the pointer); the current page is ringed by the pen, its
// ring seeded by the number and put down as the page changes. Previous and next carry a short straight pen arrow,
// turned round in right-to-left text, and drop their words on phones. A link with aria-disabled (no previous page on
// page one) fades to the faint pen and takes no pointer.

const PREVIOUS = penMark("next", "pagination-previous", "calm")
const NEXT = penMark("next", "pagination-next", "calm")

function Arrow({
  svg,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { svg: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none block h-[0.7rem] w-[1.15rem] shrink-0 [&>svg]:size-full!",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("m-0 flex list-none items-center gap-1 p-0", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) {
  const label =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : "page"
  const ring = React.useMemo(
    () => (isActive ? penMark("ring", `page:${label}`, "calm") : ""),
    [isActive, label],
  )
  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "font-type text-pen no-underline tabular-nums aria-disabled:pointer-events-none aria-disabled:text-pen-faint",
        className,
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    >
      {children}
      {isActive ? (
        <span
          aria-hidden="true"
          className="put-down pointer-events-none absolute inset-[0.3rem] [&>svg]:size-full!"
          dangerouslySetInnerHTML={{ __html: ring }}
        />
      ) : null}
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("font-ui max-sm:w-control max-sm:px-0!", className)}
      {...props}
    >
      <Arrow
        svg={PREVIOUS}
        className="-scale-x-100 rtl:scale-x-100"
        data-icon="inline-start"
      />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("font-ui max-sm:w-control max-sm:px-0!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <Arrow svg={NEXT} className="rtl:-scale-x-100" data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-control items-center justify-center text-pen-quiet [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
