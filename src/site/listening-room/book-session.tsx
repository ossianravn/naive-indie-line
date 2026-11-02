import { Fragment, useState, type FormEvent } from "react"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import { Calendar } from "@/fineliner/ui/calendar"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/fineliner/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { NativeSelect, NativeSelectOption } from "@/fineliner/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/fineliner/ui/popover"
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
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { RELEASES } from "./data"
import { ROOM_SEATS, isoOf, longDay, type Session } from "./sessions-data"

const TODAY = new Date(2026, 10, 2)
const CLOSED = [{ before: TODAY }, { dayOfWeek: [0] }]
const TIMES = Array.from({ length: 14 }, (_, i) => {
  const minutes = 11 * 60 + i * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
})
const LENGTHS = [
  ["30", "30 min"],
  ["60", "1 hour"],
  ["90", "1½ hours"],
] as const
const TITLES = RELEASES.filter((r) => r.status !== "sold").map((r) => r.title)

const trigger =
  "control-field inline-flex h-control cursor-pointer items-center gap-tight px-tight text-left whitespace-nowrap data-[empty=true]:text-pen-quiet [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-pen-quiet"

/** The "Book a session" button and its sheet. Calls onBook with the new session once the form is valid. */
export function BookSession({
  onBook,
  next,
}: {
  onBook: (session: Session) => void
  next: number
}) {
  const [open, setOpen] = useState(false)
  const [picking, setPicking] = useState(false)
  const [guest, setGuest] = useState("")
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 10, 3))
  const [start, setStart] = useState("14:00")
  const [length, setLength] = useState<"30" | "60" | "90">("60")
  const [party, setParty] = useState("2")
  const [titles, setTitles] = useState<string[]>([])
  const [tried, setTried] = useState(false)
  const anchor = useComboboxAnchor()

  const partyValue = Number(party)
  const errors = {
    guest: guest.trim() ? "" : "Who is the room for?",
    day: day ? "" : "Pick a day; the room is shut on Sundays.",
    party:
      Number.isInteger(partyValue) &&
      partyValue >= 1 &&
      partyValue <= ROOM_SEATS
        ? ""
        : `The room seats one to ${ROOM_SEATS}.`,
  }

  function book(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (errors.guest || errors.day || errors.party || !day) return
    onBook({
      id: `S-${String(next).padStart(3, "0")}`,
      date: isoOf(day),
      start,
      minutes: Number(length) as Session["minutes"],
      guest: guest.trim(),
      party: partyValue,
      records: titles.flatMap(
        (title) => RELEASES.find((r) => r.title === title)?.id ?? [],
      ),
      status: "booked",
    })
    setOpen(false)
    setGuest("")
    setTitles([])
    setTried(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" /> Book a session
      </SheetTrigger>
      <SheetContent className="sm:max-w-[28rem]">
        <form
          onSubmit={book}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <SheetHeader className="pr-12">
            <SheetTitle>Book the listening room</SheetTitle>
            <SheetDescription>
              Four seats at the back of the shop, a turntable and the records
              you ask for.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-snug py-snug">
            <Field data-invalid={tried && !!errors.guest}>
              <FieldLabel htmlFor="session-guest">Guest</FieldLabel>
              <Input
                id="session-guest"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                aria-invalid={tried && !!errors.guest}
                className="w-64 max-w-full"
                autoFocus
              />
              {tried && errors.guest && <FieldError>{errors.guest}</FieldError>}
            </Field>
            <div className="flex flex-wrap gap-x-section gap-y-snug">
              <Field data-invalid={tried && !!errors.day} className="w-auto">
                <FieldLabel htmlFor="session-day">Day</FieldLabel>
                <Popover open={picking} onOpenChange={setPicking}>
                  <PopoverTrigger
                    id="session-day"
                    data-empty={!day}
                    className={`${trigger} w-56`}
                  >
                    <CalendarIcon />
                    {day ? longDay(isoOf(day)) : "Pick a day"}
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
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {tried && errors.day && <FieldError>{errors.day}</FieldError>}
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="session-start">From</FieldLabel>
                <NativeSelect
                  id="session-start"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-28 font-type"
                >
                  {TIMES.map((time) => (
                    <NativeSelectOption key={time} value={time}>
                      {time}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </div>
            <Field>
              <FieldLabel id="session-length">For</FieldLabel>
              <ToggleGroup
                variant="outline"
                spacing={0}
                value={[length]}
                onValueChange={(v) => v[0] && setLength(v[0] as typeof length)}
                aria-labelledby="session-length"
              >
                {LENGTHS.map(([value, label]) => (
                  <ToggleGroupItem key={value} value={value}>
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
            <Field data-invalid={tried && !!errors.party} className="w-auto">
              <FieldLabel htmlFor="session-party">Guests</FieldLabel>
              <Input
                id="session-party"
                inputMode="numeric"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                aria-invalid={tried && !!errors.party}
                className="w-20 font-type tabular-nums"
              />
              {tried && errors.party && <FieldError>{errors.party}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="session-records">Records to play</FieldLabel>
              <Combobox
                multiple
                autoHighlight
                items={TITLES}
                value={titles}
                onValueChange={(v) => setTitles(v as string[])}
              >
                <ComboboxChips ref={anchor} className="w-full">
                  <ComboboxValue>
                    {(values: string[]) => (
                      <Fragment>
                        {values.map((value) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          id="session-records"
                          placeholder={values.length ? "" : "Add a record"}
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No record by that title.</ComboboxEmpty>
                  <ComboboxList>
                    {(title: string) => (
                      <ComboboxItem key={title} value={title}>
                        {title}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
            <Button type="submit">Book the room</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
