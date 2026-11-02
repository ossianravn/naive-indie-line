import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/fineliner/ui/calendar"
import { Field, FieldDescription, FieldLabel } from "@/fineliner/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/fineliner/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Calendar",
  description:
    "A printed month for choosing a day or a run of days, and the date pickers built from it.",
  item: "calendar",
  group: "Forms",
}

// The demo clock: Monday 2 November 2026. Passing it as `today` keeps the server and the browser on one page. The
// shop's weeks start on Monday, and it is closed on Sundays.
const TODAY = new Date(2026, 10, 2)
const day = (d: number, month = 10) => new Date(2026, month, d)
const CLOSED = [{ before: TODAY }, { dayOfWeek: [0] }]

const trigger =
  "control-field inline-flex h-control cursor-pointer items-center gap-tight px-tight text-left whitespace-nowrap data-popup-open:shadow-[inset_0_0_0_0.65px_var(--input)] data-[empty=true]:text-pen-quiet [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-pen-quiet"

function SessionDate() {
  const [date, setDate] = useState<Date | undefined>(day(5))
  const [open, setOpen] = useState(false)
  return (
    <Field className="w-auto">
      <FieldLabel htmlFor="session-date">Session date</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id="session-date"
          data-empty={!date}
          className={`${trigger} w-48`}
        >
          <CalendarIcon />
          {date ? format(date, "EEE d MMM yyyy") : "Pick a day"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={date ?? TODAY}
            selected={date}
            disabled={CLOSED}
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      <FieldDescription>Closed on Sundays.</FieldDescription>
    </Field>
  )
}

function Stocktaking() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(23),
    to: day(25),
  })
  const label = range?.from
    ? range.to
      ? `${format(range.from, "d")}–${format(range.to, "d MMM yyyy")}`
      : format(range.from, "d MMM yyyy")
    : "Pick the days"
  return (
    <Field className="w-auto">
      <FieldLabel htmlFor="stocktaking">Closed for stocktaking</FieldLabel>
      <Popover>
        <PopoverTrigger
          id="stocktaking"
          data-empty={!range?.from}
          className={`${trigger} w-48`}
        >
          <CalendarIcon />
          {label}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={range?.from ?? TODAY}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}

export default function CalendarDemo() {
  const [single, setSingle] = useState<Date | undefined>(day(5))
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(23),
    to: day(25),
  })
  return (
    <>
      <DemoSection title="Calendar">
        <StateRow label="Single day">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            selected={single}
            onSelect={setSingle}
          />
        </StateRow>
        <StateRow label="Range">
          <Calendar
            mode="range"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            selected={range}
            onSelect={setRange}
          />
        </StateRow>
        <StateRow label="Disabled days">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            disabled={CLOSED}
          />
        </StateRow>
        <StateRow label="Month menus">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            captionLayout="dropdown"
            startMonth={day(1, 0)}
            endMonth={new Date(2027, 11, 1)}
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Date pickers">
        <StateRow label="Single">
          <SessionDate />
        </StateRow>
        <StateRow label="Range">
          <Stocktaking />
        </StateRow>
      </DemoSection>
    </>
  )
}
