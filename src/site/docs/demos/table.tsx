import { useState } from "react"
import { Checkbox } from "@/fineliner/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { DataTable } from "./table/data-table"
import { LongTable } from "./table/long-table"

export const meta: DemoMeta = {
  title: "Table",
  description:
    "A ledger for records that compare across columns: label heads over a pen rule, hand-drawn rules between rows and figures that line up.",
  item: "table",
  group: "Data display",
}

const NEW_IN = RELEASES.filter((r) => r.status === "racks").slice(0, 5)

const BOOKINGS = [
  { time: "18:00", name: "Maya Singh", party: 2, record: "Neon Orchard" },
  { time: "18:45", name: "Jonas Berg", party: 1, record: "Paper Moons" },
  { time: "19:30", name: "Ama Owusu", party: 3, record: "Rain on Tin" },
]

export default function TableDemo() {
  const [confirmed, setConfirmed] = useState<string[]>(["18:45"])
  const confirm = (time: string, on: boolean) =>
    setConfirmed((list) =>
      on ? [...list, time] : list.filter((t) => t !== time),
    )
  return (
    <>
      <DemoSection title="Ledger">
        <StateRow label="Default">
          <div className="w-full max-w-[40rem] [contain:inline-size]">
            <Table>
              <TableCaption>New in the racks this week.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="max-sm:hidden">Artist</TableHead>
                  <TableHead className="max-sm:hidden">Format</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {NEW_IN.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-type text-small text-pen-quiet">
                      {r.id}
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal">
                      {r.title}
                    </TableCell>
                    <TableCell className="text-pen-quiet max-sm:hidden">
                      {r.artist}
                    </TableCell>
                    <TableCell className="max-sm:hidden">{r.format}</TableCell>
                    <TableCell className="text-right font-type text-small">
                      {kroner(r.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Five records</TableCell>
                  <TableCell className="max-sm:hidden" />
                  <TableCell className="max-sm:hidden" />
                  <TableCell className="text-right font-type text-small">
                    {kroner(NEW_IN.reduce((sum, r) => sum + r.price, 0))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </StateRow>
        <StateRow label="Selected row">
          <div className="w-full max-w-[32rem] [contain:inline-size]">
            <Table>
              <TableCaption>
                Listening sessions, Thursday 5 November.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <span className="sr-only">Confirmed</span>
                  </TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Booked by</TableHead>
                  <TableHead className="text-right">Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOOKINGS.map((b) => (
                  <TableRow
                    key={b.time}
                    data-state={
                      confirmed.includes(b.time) ? "selected" : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Confirm ${b.name} at ${b.time}`}
                        checked={confirmed.includes(b.time)}
                        onCheckedChange={(on) => confirm(b.time, on)}
                      />
                    </TableCell>
                    <TableCell className="font-type text-small">
                      {b.time}
                    </TableCell>
                    <TableCell>
                      {b.name}
                      <span className="block text-small text-pen-quiet">
                        {b.record}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-type text-small">
                      {b.party}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Data table">
        <DataTable />
      </DemoSection>
      <DemoSection title="200 rows, sticky head">
        <LongTable />
      </DemoSection>
    </>
  )
}
