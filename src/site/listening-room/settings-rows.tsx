import type { ReactNode } from "react"
import { APPEARANCE, type Appearance } from "@/fineliner/theme"
import { cn } from "@/fineliner/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

// The settings screen's rows: a setting's name and hint beside its control, a titled section, and the two kinds of
// appearance choice (a segmented control for two or three options, a select for more).

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
export function Row({
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

export function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
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
export function Segmented<K extends keyof Appearance>({
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
export function Choice<K extends "stock" | "pen">({
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
