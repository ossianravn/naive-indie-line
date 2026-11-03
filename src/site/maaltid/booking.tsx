import "@/fineliner/pen/objects/everyday"
import { useEffect, useRef, useState, type SyntheticEvent } from "react"
import { CalendarIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Button } from "@/fineliner/ui/button"
import { Calendar } from "@/fineliner/ui/calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { NativeSelect, NativeSelectOption } from "@/fineliner/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/fineliner/ui/popover"
import { Textarea } from "@/fineliner/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

// Booking a table: an evening (Wednesday to Saturday, from the made-up "today"), a time, how many, a name and where to
// send the booking. Fridays and Saturdays are full at the busiest times. Nothing is sent anywhere: a valid form turns
// into the booking itself, with a way to book another.

const TODAY = new Date(2026, 10, 4)
const CLOSED = [{ before: TODAY }, { dayOfWeek: [0, 1, 2] }]
const TIMES = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
]
/** Times already taken, by weekday (5 Friday, 6 Saturday). */
const FULL: Record<number, string[]> = {
  5: ["19:00", "19:30"],
  6: ["18:30", "19:00", "19:30", "20:00"],
}
const GUESTS = Array.from({ length: 8 }, (_, i) => String(i + 1))
const dayName = (day: Date) =>
  day.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
const trigger =
  "control-field inline-flex h-control cursor-pointer items-center gap-tight px-tight text-left whitespace-nowrap data-[empty=true]:text-pen-quiet [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-pen-quiet"

interface Booked {
  day: Date
  time: string
  guests: string
  name: string
  email: string
}

export function Booking() {
  const [day, setDay] = useState<Date>()
  const [picking, setPicking] = useState(false)
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState("2")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [tried, setTried] = useState(false)
  const [booked, setBooked] = useState<Booked | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  const full = day ? (FULL[day.getDay()] ?? []) : []
  const errors = {
    day: day ? "" : "Pick an evening; we're open Wednesday to Saturday.",
    time: time && !full.includes(time) ? "" : "Pick a time that's free.",
    name: name.trim() ? "" : "Whose name is the table under?",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? ""
      : "An email address, so we can send you the booking.",
  }

  useEffect(() => {
    if (booked) heading.current?.focus()
  }, [booked])

  function book(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setTried(true)
    if (Object.values(errors).some(Boolean) || !day) return
    setBooked({ day, time, guests, name: name.trim(), email: email.trim() })
  }

  if (booked)
    return (
      <div className="grid max-w-measure gap-snug" aria-live="polite">
        <Drawing
          object="envelope"
          seed={`maaltid-${booked.email}`}
          title=""
          className="w-32"
        />
        <h2
          ref={heading}
          tabIndex={-1}
          className="m-0 text-h2 leading-heading outline-none"
        >
          See you {dayName(booked.day)} at {booked.time}
        </h2>
        <p className="m-0">
          A table for {booked.guests} under {booked.name}. We've sent the
          booking to <span className="wrap-anywhere">{booked.email}</span>. If
          you're running late, we keep the table for twenty minutes.
        </p>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setBooked(null)
              setTried(false)
              setTime("")
            }}
          >
            Book another table
          </Button>
        </div>
      </div>
    )

  return (
    <form onSubmit={book} noValidate className="grid gap-y-section">
      <FieldGroup>
        <Field data-invalid={tried && !!errors.day} className="w-auto">
          <FieldLabel htmlFor="booking-day">Evening</FieldLabel>
          <Popover open={picking} onOpenChange={setPicking}>
            <PopoverTrigger
              id="booking-day"
              data-empty={!day}
              className={`${trigger} w-64`}
            >
              <CalendarIcon />
              {day ? dayName(day) : "Pick an evening"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                weekStartsOn={1}
                today={TODAY}
                defaultMonth={day ?? TODAY}
                selected={day}
                disabled={CLOSED}
                onSelect={(picked) => {
                  setDay(picked)
                  setPicking(false)
                  if (picked && (FULL[picked.getDay()] ?? []).includes(time))
                    setTime("")
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          {tried && errors.day && <FieldError>{errors.day}</FieldError>}
        </Field>
        <Field data-invalid={tried && !!errors.time}>
          <FieldLabel id="booking-time">Time</FieldLabel>
          <ToggleGroup
            variant="outline"
            value={time ? [time] : []}
            onValueChange={(v) => setTime(v[0] ?? "")}
            aria-labelledby="booking-time"
            className="max-w-[26rem] flex-wrap"
          >
            {TIMES.map((t) => (
              <ToggleGroupItem
                key={t}
                value={t}
                disabled={full.includes(t)}
                aria-label={full.includes(t) ? `${t}, full` : t}
                className="w-20 font-type data-disabled:line-through"
              >
                {t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {full.length > 0 && (
            <FieldDescription>
              The struck-out times are full that evening.
            </FieldDescription>
          )}
          {tried && errors.time && <FieldError>{errors.time}</FieldError>}
        </Field>
        <Field className="w-auto">
          <FieldLabel htmlFor="booking-guests">Guests</FieldLabel>
          <NativeSelect
            id="booking-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-20 font-type"
          >
            {GUESTS.map((g) => (
              <NativeSelectOption key={g} value={g}>
                {g}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldDescription>
            For more than eight, ask at the bar.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field data-invalid={tried && !!errors.name}>
          <FieldLabel htmlFor="booking-name">Name</FieldLabel>
          <Input
            id="booking-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={tried && !!errors.name}
            className="w-64 max-w-full"
          />
          {tried && errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field data-invalid={tried && !!errors.email}>
          <FieldLabel htmlFor="booking-email">Email</FieldLabel>
          <Input
            id="booking-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={tried && !!errors.email}
            className="w-72 max-w-full"
          />
          {tried && errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="booking-note">
            Anything we should know
          </FieldLabel>
          <Textarea
            id="booking-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="max-w-measure"
          />
          <FieldDescription>Allergies, a birthday, a pram.</FieldDescription>
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit">Book the table</Button>
      </div>
    </form>
  )
}
