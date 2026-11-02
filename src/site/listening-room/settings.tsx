import { useState, type ReactNode } from "react"
import { APPEARANCE, useAppearance, type Appearance } from "@/fineliner/theme"
import { cn } from "@/fineliner/lib/utils"
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { Switch } from "@/fineliner/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
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

const NAMES: Record<string, string> = {
  system: "System",
  day: "Day",
  night: "Night",
  black: "Soft black",
  art: "Always",
  caps: "Small caps",
  type: "Typewriter",
}
const name = (value: string) =>
  NAMES[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
const options = (key: keyof Appearance) =>
  APPEARANCE[key].map((value) => ({ value, label: name(value) }))

/**
 * One setting: its name and an optional hint on the left, the control beside it. On a phone a wide control drops
 * below its name; a switch (`beside`) stays beside it at every width.
 */
function Row({
  label,
  hint,
  htmlFor,
  id,
  beside,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  id?: string
  beside?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-x-section gap-y-tight py-snug sm:grid-cols-[minmax(0,1fr)_auto]",
        beside && "grid-cols-[minmax(0,1fr)_auto]",
      )}
    >
      <div>
        <label id={id} htmlFor={htmlFor} className="font-medium">
          {label}
        </label>
        {hint && (
          <p className="m-0 text-small leading-small text-pen-quiet">{hint}</p>
        )}
      </div>
      <div className={cn("sm:justify-self-end", beside && "justify-self-end")}>
        {children}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = `settings-${title.toLowerCase()}`
  return (
    <section className="mt-section" aria-labelledby={id}>
      <h2 id={id} className="label m-0 text-pen-quiet">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** A two-to-three-way appearance choice as a segmented control. */
function Segmented<K extends keyof Appearance>({
  setting,
  label,
  value,
  onChange,
}: {
  setting: K
  label: string
  value: Appearance[K]
  onChange: (v: Appearance[K]) => void
}) {
  return (
    <Row label={label} id={`setting-${setting}`}>
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[value]}
        onValueChange={(v) => v[0] && onChange(v[0] as Appearance[K])}
        aria-labelledby={`setting-${setting}`}
      >
        {APPEARANCE[setting].map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {name(option)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Row>
  )
}

/** A longer appearance choice as a select, as wide as its longest option. */
function Choice<K extends "stock" | "pen">({
  setting,
  label,
  value,
  width,
  onChange,
}: {
  setting: K
  label: string
  value: Appearance[K]
  width: string
  onChange: (v: Appearance[K]) => void
}) {
  const items = options(setting)
  return (
    <Row label={label} htmlFor={`setting-${setting}`}>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v as Appearance[K])}
      >
        <SelectTrigger id={`setting-${setting}`} className={width}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Row>
  )
}

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
    <div className="mx-auto max-w-[42rem] px-snug pt-section pb-page sm:px-line">
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
