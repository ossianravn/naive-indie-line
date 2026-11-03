import { useState } from "react"
import { CalendarDaysIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/fineliner/ui/item"
import {
  CONDITION_LABEL,
  STATUS_LABEL,
  kroner,
  type Release,
  type Status,
} from "./data"
import { PageHeader, ShellPage } from "./page"
import { RecordThread } from "./record-thread"
import { SESSIONS, SESSION_STATUS, endOf, shortDay } from "./sessions-data"
import { THREADS } from "./threads"

const BADGE = { racks: "outline", held: "default", sold: "secondary" } as const

/**
 * One record's page: the sleeve drawn large, its details, what to do with it, who asked for it and what they said.
 * The top bar's crumb is the way back to the catalogue.
 */
export function RecordPage({ record }: { record: Release }) {
  const [status, setStatus] = useState<Status>(record.status)
  const [said, setSaid] = useState("")
  const sessions = SESSIONS.filter((s) => s.records.includes(record.id))
  const facts: [string, string][] = [
    ["Catalogue number", record.id],
    ["Label", `${record.label}, ${record.year}`],
    ["Format", record.format],
    ["Genre", record.genre],
    ["Condition", `${record.condition} · ${CONDITION_LABEL[record.condition]}`],
  ]
  const change = (next: Status, words: string) => {
    setStatus(next)
    setSaid(words)
  }

  return (
    <ShellPage>
      <PageHeader
        kicker={`${record.id} · ${record.genre}`}
        title={record.title}
        lede={record.artist}
      />

      <div className="mt-line grid max-w-[60rem] gap-x-section gap-y-line md:grid-cols-[14rem_minmax(0,1fr)]">
        <Drawing
          object="record"
          seed={record.id}
          title=""
          className="w-40 md:w-full"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-snug">
            <span
              className={
                status === "sold"
                  ? "font-type text-lead text-pen-quiet line-through"
                  : "font-type text-lead"
              }
            >
              {kroner(record.price)}
            </span>
            <Badge variant={BADGE[status]}>{STATUS_LABEL[status]}</Badge>
          </div>
          {record.note && (
            <p className="m-0 mt-snug max-w-measure">{record.note}</p>
          )}

          <div className="mt-line flex flex-wrap items-center gap-tight">
            {status === "held" ? (
              <Button
                variant="outline"
                onClick={() => change("racks", "Back in the racks.")}
              >
                Back in the racks
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={status === "sold"}
                onClick={() => change("held", "On hold.")}
              >
                Put on hold
              </Button>
            )}
            <Button
              disabled={status === "sold"}
              onClick={() =>
                change("sold", `Sold for ${kroner(record.price)}.`)
              }
            >
              Mark as sold
            </Button>
            <p className="m-0 text-small text-pen-quiet" aria-live="polite">
              {said}
            </p>
          </div>

          <dl className="m-0 mt-line grid max-w-[30rem] grid-cols-[auto_minmax(0,1fr)] gap-x-section gap-y-hair">
            {facts.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="label pt-0.5 text-pen-quiet">{term}</dt>
                <dd className="m-0 font-type text-small">{value}</dd>
              </div>
            ))}
          </dl>

          {sessions.length > 0 && (
            <section aria-labelledby="record-sessions" className="mt-section">
              <h2 id="record-sessions" className="label m-0 text-pen-quiet">
                Asked for in the room
              </h2>
              <ItemGroup className="mt-tight -ms-tight w-auto max-w-[34rem]">
                {sessions.map((s) => (
                  // A list may own only list items, and the row is a link, so each sits in its own list item.
                  <div key={s.id} role="listitem">
                    <Item
                      size="sm"
                      render={<a href="/listening-room/sessions" />}
                    >
                      <CalendarDaysIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-pen-quiet"
                      />
                      <ItemContent>
                        <ItemTitle>{s.guest}</ItemTitle>
                        <ItemDescription>
                          {shortDay(s.date)}, {s.start}–{endOf(s)} ·{" "}
                          {SESSION_STATUS[s.status]}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                ))}
              </ItemGroup>
            </section>
          )}

          <RecordThread notes={THREADS[record.id] ?? []} />
        </div>
      </div>
    </ShellPage>
  )
}
