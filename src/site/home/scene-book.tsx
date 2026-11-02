import { useState } from "react"
import { Calendar } from "@/fineliner/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

const TODAY = new Date(2026, 10, 2)
const CLOSED = [{ before: TODAY }, { dayOfWeek: [0] }]
const LENGTHS = [
  ["30", "30 min"],
  ["60", "1 hour"],
  ["90", "1½ hours"],
] as const

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
})

/** Booking the listening room: a day on a printed month, a length on a segmented control, and what that books. */
export function BookScene() {
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 10, 5))
  const [length, setLength] = useState<string>("60")
  const label = LENGTHS.find(([value]) => value === length)?.[1]
  return (
    <div className="flex flex-wrap items-start gap-x-section gap-y-snug">
      <Calendar
        mode="single"
        weekStartsOn={1}
        today={TODAY}
        defaultMonth={TODAY}
        selected={day}
        onSelect={setDay}
        disabled={CLOSED}
      />
      <div className="grid gap-snug">
        <ToggleGroup
          variant="outline"
          spacing={0}
          value={[length]}
          onValueChange={(v) => v[0] && setLength(v[0])}
          aria-label="Length"
        >
          {LENGTHS.map(([value, text]) => (
            <ToggleGroupItem key={value} value={value}>
              {text}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p
          className="m-0 max-w-[16rem] text-small leading-small"
          aria-live="polite"
        >
          {day
            ? `${label} in the room on ${DAY.format(day)}, from two.`
            : "Pick a day; the room is shut on Sundays."}
        </p>
      </div>
    </div>
  )
}
