import { useState } from "react"
import { tally } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { PagePicker } from "./pagination/page-picker"

export const meta: DemoMeta = {
  title: "Pagination",
  description:
    "Typed page numbers for moving through a long list a page at a time, the current page ringed by the pen.",
  item: "pagination",
  group: "Navigation",
}

const PER_PAGE = 24

/** The catalogue a page at a time, starting on the given page; the last page is part full. */
function Pages({ start, pages }: { start: number; pages: number }) {
  const [page, setPage] = useState(start)
  const total = pages * PER_PAGE - 7
  return (
    <div className="flex flex-col gap-hair">
      <PagePicker page={page} pages={pages} onPage={setPage} />
      <p
        className="m-0 font-type text-small text-pen-quiet tabular-nums"
        aria-live="polite"
      >
        Records {tally((page - 1) * PER_PAGE + 1)}–
        {tally(Math.min(page * PER_PAGE, total))} of {tally(total)}
      </p>
    </div>
  )
}

export default function PaginationDemo() {
  return (
    <>
      <DemoSection title="The catalogue">
        <StateRow label="A middle page">
          <Pages start={3} pages={8} />
        </StateRow>
        <StateRow label="First page">
          <Pages start={1} pages={3} />
        </StateRow>
        <StateRow label="Gaps either side">
          <Pages start={9} pages={17} />
        </StateRow>
        <StateRow label="Last page">
          <Pages start={17} pages={17} />
        </StateRow>
      </DemoSection>
    </>
  )
}
