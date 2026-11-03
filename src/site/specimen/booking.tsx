import { useId, useState, type ComponentProps } from "react"
import { Badge } from "@/fineliner/ui/badge"
import { Button, buttonVariants } from "@/fineliner/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import { Checkbox } from "@/fineliner/ui/checkbox"
import { Field, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Switch } from "@/fineliner/ui/switch"

/**
 * Booking the listening room, as the specimen's working form: a name, a switch and a checkbox, the one ink button and
 * a framed second action. Booking puts a badge down beside the title; nothing leaves the page.
 */
export function BookingCard() {
  const id = useId()
  const [booked, setBooked] = useState<string | null>(null)
  const submit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get("name")
    setBooked(String(name || "you").trim() || "you")
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-tight">
          Book the listening room
          <span role="status" className="contents">
            {booked ? <Badge>Booked for {booked}</Badge> : null}
          </span>
        </CardTitle>
        <CardDescription>Thursday evenings, from seven.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-snug">
          <Field>
            <FieldLabel htmlFor={`${id}-name`}>Your name</FieldLabel>
            <Input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              placeholder="Maya Singh"
              className="w-[16rem] max-w-full"
            />
          </Field>
          <Field orientation="horizontal">
            <Switch id={`${id}-records`} defaultChecked />
            <FieldLabel htmlFor={`${id}-records`}>
              Bring your own records
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id={`${id}-visit`} />
            <FieldLabel htmlFor={`${id}-visit`}>
              I&rsquo;m visiting the shop
            </FieldLabel>
          </Field>
          <div className="mt-hair flex flex-wrap gap-tight">
            <Button type="submit">Book session</Button>
            <a
              href="/listening-room/sessions"
              className={buttonVariants({ variant: "outline", className: "no-underline" })}
            >
              See the sessions
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
