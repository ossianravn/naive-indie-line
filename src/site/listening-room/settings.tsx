import { useState } from "react"
import { useAppearance } from "@/fineliner/theme"
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { Switch } from "@/fineliner/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/fineliner/ui/alert-dialog"
import { Choice, Row, Section, Segmented } from "./settings-rows"

const ALERTS = [
  ["holds", "Hold reminders", "The day before a record you hold goes back."],
  [
    "thursday",
    "The Thursday list",
    "Monday mornings: who is playing and what.",
  ],
  ["arrivals", "New arrivals", "When records come in from the genres you buy."],
] as const

/** Listening Room's settings, in one narrow column: profile, appearance, notifications and account. */
export function Settings() {
  const [appearance, update] = useAppearance()
  const [person, setPerson] = useState("Maya Singh")
  const [saved, setSaved] = useState("")
  const [alerts, setAlerts] = useState({
    holds: true,
    thursday: true,
    arrivals: false,
  })

  return (
    <div className="mx-auto w-full max-w-[42rem] px-snug pt-section pb-page sm:px-line">
      <h1 className="m-0 text-h1">Settings</h1>

      <Section title="Profile">
        <Row label="Name" htmlFor="name">
          <Input
            id="name"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="w-[16rem]"
          />
        </Row>
        <Row
          label="Email"
          hint="For sign-in and hold reminders."
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            defaultValue="maya@example.com"
            className="w-[18rem]"
          />
        </Row>
        <div className="flex items-center gap-snug pt-tight">
          <Button onClick={() => setSaved("Profile saved.")}>
            Save profile
          </Button>
          <p className="m-0 text-small text-pen-quiet" aria-live="polite">
            {saved}
          </p>
        </div>
      </Section>

      <Section title="Appearance">
        <Segmented
          setting="theme"
          label="Light"
          value={appearance.theme}
          onChange={(theme) => update({ theme })}
        />
        <Choice
          setting="stock"
          label="Paper"
          width="w-[9rem]"
          value={appearance.stock}
          onChange={(stock) => update({ stock })}
        />
        <Choice
          setting="pen"
          label="Pen"
          width="w-[10rem]"
          value={appearance.pen}
          onChange={(pen) => update({ pen })}
        />
        <Segmented
          setting="hand"
          label="Hand"
          value={appearance.hand}
          onChange={(hand) => update({ hand })}
        />
        <Segmented
          setting="boil"
          label="Line boil"
          value={appearance.boil}
          onChange={(boil) => update({ boil })}
        />
        <Segmented
          setting="containers"
          label="Containers"
          value={appearance.containers}
          onChange={(containers) => update({ containers })}
        />
      </Section>

      <Section title="Notifications">
        {ALERTS.map(([key, label, hint]) => (
          <Row
            key={key}
            label={label}
            hint={hint}
            htmlFor={`alert-${key}`}
            beside
          >
            <Switch
              id={`alert-${key}`}
              checked={alerts[key]}
              onCheckedChange={(on) => setAlerts((a) => ({ ...a, [key]: on }))}
            />
          </Row>
        ))}
      </Section>

      <Section title="Account">
        <Row
          label="Close account"
          hint="Removes your holds, your bookings and your listening history."
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Close account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Close your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This demo keeps nothing, so nothing is removed; a real account
                  would be gone for good, holds included.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my account</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Close account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Section>
    </div>
  )
}
