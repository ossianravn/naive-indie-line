import { Fragment } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import { Field, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Separator } from "@/fineliner/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/fineliner/ui/sheet"
import {
  CONDITION_LABEL,
  RELEASES,
  STATUS_LABEL,
  kroner,
} from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sheet",
  description:
    "A drawn sheet laid along one edge of the window, for a record or a short task beside the page it came from.",
  item: "sheet",
  group: "Overlays",
}

const harbour = RELEASES[0]!

const BOOKINGS = [
  ["18:00", "Maya Singh", "2 seats", "Neon Orchard"],
  ["19:00", "Jonas Berg", "1 seat", "Paper Moons"],
  ["20:00", "Ama Owusu", "3 seats", "Rain on Tin"],
  ["21:00", "Open", "4 seats", "Bring a record"],
] as const

/** One record as a sheet of facts: its drawing, the catalogue line, the shop's note. */
function RecordSheet() {
  const facts = [
    ["Number", <span className="font-type">{harbour.id}</span>],
    ["Format", harbour.format],
    ["Condition", CONDITION_LABEL[harbour.condition]],
    ["Price", <span className="font-type">{kroner(harbour.price)}</span>],
  ] as const
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{harbour.title}</SheetTitle>
        <SheetDescription>
          {harbour.artist} · {harbour.label}, {harbour.year}
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-col gap-snug overflow-y-auto px-snug">
        <Drawing object="record" seed={harbour.id} title="" className="w-36" />
        <dl className="m-0 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-tight gap-y-hair text-ui leading-ui">
          {facts.map(([term, value]) => (
            <Fragment key={term}>
              <dt className="label pt-0.5 text-pen-quiet">{term}</dt>
              <dd className="m-0">{value}</dd>
            </Fragment>
          ))}
          <dt className="label pt-0.5 text-pen-quiet">Status</dt>
          <dd className="m-0">
            <Badge variant="outline">{STATUS_LABEL[harbour.status]}</Badge>
          </dd>
        </dl>
        <p className="m-0 text-body leading-body">{harbour.note}</p>
      </div>
      <SheetFooter>
        <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        <SheetClose render={<Button />}>Put on hold</SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

export default function SheetDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Right (default)">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Harbour Lights
            </SheetTrigger>
            <RecordSheet />
          </Sheet>
        </StateRow>
        <StateRow label="Left">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Thursday sessions
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Listening sessions</SheetTitle>
                <SheetDescription>
                  Thursday 5 November · the back room
                </SheetDescription>
              </SheetHeader>
              <ul className="m-0 flex list-none flex-col p-0 px-snug">
                {BOOKINGS.map(([time, who, seats, record], i) => (
                  <li key={time}>
                    {i > 0 && <Separator />}
                    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-tight py-hair">
                      <span className="font-type text-small leading-ui">
                        {time}
                      </span>
                      <span className="text-ui leading-ui">
                        {who} · {seats}
                      </span>
                      <span className="col-start-2 text-small text-pen-quiet italic">
                        {record}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Top">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Late opening
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Late opening on Thursday 12 November</SheetTitle>
                <SheetDescription>Dub at dusk with Ama Owusu</SheetDescription>
              </SheetHeader>
              <p className="m-0 max-w-measure px-snug text-body leading-body">
                The shop opens at 14:00 instead of 11:00. The listening room
                opens at 19:00 for Low Tide Dub, played loud.
              </p>
              <SheetFooter>
                <SheetClose render={<Button />}>Understood</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Bottom">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Share a list
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Share “Rainy Thursdays”</SheetTitle>
                <SheetDescription>
                  Anyone with the link can see the list; only you can change it.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-wrap items-end gap-tight px-snug pb-snug">
                <Field className="w-auto max-w-full">
                  <FieldLabel htmlFor="share-link">Link</FieldLabel>
                  <Input
                    id="share-link"
                    readOnly
                    defaultValue="listening.room/l/rainy-thursdays"
                    className="w-[22rem] max-w-full font-type"
                  />
                </Field>
                <Button variant="outline">Copy link</Button>
              </div>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Scrolling body">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              The catalogue
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>The catalogue</SheetTitle>
                <SheetDescription>
                  {RELEASES.length} records in the shop
                </SheetDescription>
              </SheetHeader>
              <ul className="m-0 flex min-h-0 flex-1 list-none flex-col overflow-y-auto p-0 px-snug">
                {RELEASES.map((r, i) => (
                  <li key={r.id}>
                    {i > 0 && <Separator />}
                    <div className="flex items-baseline justify-between gap-tight py-hair">
                      <span className="min-w-0">
                        <span className="block truncate text-ui leading-ui">
                          {r.title}
                        </span>
                        <span className="block truncate text-small text-pen-quiet">
                          {r.artist}
                        </span>
                      </span>
                      <span className="shrink-0 font-type text-small">
                        {kroner(r.price)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
                <Button>Add a record</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Footer close only">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" />}>
              House rules
            </SheetTrigger>
            <SheetContent showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>House rules</SheetTitle>
                <SheetDescription>For the listening room</SheetDescription>
              </SheetHeader>
              <p className="m-0 px-snug text-body leading-body">
                One side at a time, and whoever brought the record lifts the
                needle. Glasses stay on the bar, not on the sleeves. Talk
                between sides, not during them.
              </p>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
    </>
  )
}
