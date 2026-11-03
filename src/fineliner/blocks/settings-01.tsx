"use client"

import { useState } from "react"
import {
  SettingsRow,
  SettingsSection,
  ALIGN_APPEARANCE,
  SETTINGS_LABEL,
} from "@/fineliner/blocks/settings-01-rows"
import {
  AppearanceControl,
  type AppearanceRow,
} from "@/fineliner/extras/appearance-control"
import { cn } from "@/fineliner/lib/utils"
import type { Appearance } from "@/fineliner/theme"
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
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { Switch } from "@/fineliner/ui/switch"

// A settings page in one narrow column (40rem): profile fields sized to their values, the appearance settings
// (AppearanceControl, every row unless `appearance` picks some), notifications as switches, and closing the account
// behind an alert dialog. Every name sits at the end of one label column, right beside its control, and the controls
// of every section line up on one edge. `bare` drops the page's padding and heading, for an app shell that draws its
// own page frame.

export const meta = {
  title: "Settings",
  description:
    "A narrow settings column: profile, appearance, notifications as switches, and closing the account behind an alert dialog.",
}

export interface Notification {
  id: string
  label: string
  hint: string
  on: boolean
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "holds",
    label: "Holds running out",
    hint: "The morning a hold ends.",
    on: true,
  },
  {
    id: "bookings",
    label: "New bookings",
    hint: "Each time someone books the room.",
    on: true,
  },
  {
    id: "thursday",
    label: "The Thursday list",
    hint: "Monday mornings: who is coming and how many seats are left.",
    on: false,
  },
]

export interface Settings01Props {
  name?: string
  email?: string
  notifications?: Notification[]
  /** What closing the account removes, in the confirmation dialog. */
  closeNote?: string
  onSaveProfile?: (profile: { name: string; email: string }) => void
  onNotificationChange?: (id: string, on: boolean) => void
  onCloseAccount?: () => void
  /** The defaults the page's appearanceScript uses, so the appearance rows render the right choices on the server. */
  appearanceDefaults?: Appearance
  /** Which appearance settings show, in this order. Defaults to every one. */
  appearance?: readonly AppearanceRow[]
  /** Only the sections: no page padding and no heading, for a shell that draws its own page frame. */
  bare?: boolean
  className?: string
}

const EMAIL = /^\S+@\S+\.\S+$/

export function Settings01({
  name: initialName = "Maya Singh",
  email: initialEmail = "maya@example.com",
  notifications = NOTIFICATIONS,
  closeNote = "You're signed out everywhere and your name comes off the rota. The shop's records and bookings stay. This can't be undone.",
  onSaveProfile,
  onNotificationChange,
  onCloseAccount,
  appearanceDefaults,
  appearance,
  bare = false,
  className,
}: Settings01Props) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [saved, setSaved] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [alerts, setAlerts] = useState(() =>
    Object.fromEntries(notifications.map((n) => [n.id, n.on])),
  )

  function save() {
    if (!EMAIL.test(email)) {
      setInvalid(true)
      document.getElementById("settings-email")?.focus()
      return
    }
    onSaveProfile?.({ name, email })
    setSaved(true)
  }

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "@container/settings max-w-[40rem]",
          bare
            ? "*:first:mt-0"
            : "mx-auto px-snug pt-section pb-page @min-[40rem]:px-line",
          SETTINGS_LABEL,
        )}
      >
        {!bare && <h1 className="m-0 text-h1">Settings</h1>}

        <SettingsSection title="Profile">
          <SettingsRow label="Name" htmlFor="settings-name">
            <Input
              id="settings-name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSaved(false)
              }}
              className="w-[16rem] max-w-full"
            />
          </SettingsRow>
          <SettingsRow
            label="Email"
            htmlFor="settings-email"
            hint="For signing in and the shop's notices."
            hintId="settings-email-hint"
            error={invalid && "Enter an email address, like maya@example.com."}
            errorId="settings-email-error"
          >
            <Input
              id="settings-email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setSaved(false)
                if (invalid) setInvalid(!EMAIL.test(e.target.value))
              }}
              aria-invalid={invalid}
              aria-describedby={`${invalid ? "settings-email-error " : ""}settings-email-hint`}
              className="w-[18rem] max-w-full"
            />
          </SettingsRow>
          <SettingsRow>
            {/* Saving turns the label to Saved in the same footprint, instead of adding a message. */}
            <Button onClick={save}>
              <span className="grid *:col-start-1 *:row-start-1">
                <span className={cn(saved && "invisible")}>Save profile</span>
                <span className={cn(!saved && "invisible")}>Saved</span>
              </span>
            </Button>
            <span aria-live="polite" className="sr-only">
              {saved ? "Profile saved." : ""}
            </span>
          </SettingsRow>
        </SettingsSection>

        <section className="mt-section" aria-labelledby="settings-appearance">
          <h2 id="settings-appearance" className="label m-0 text-pen-quiet">
            Appearance
          </h2>
          <AppearanceControl
            rows={appearance}
            defaults={appearanceDefaults}
            className={cn("mt-snug", ALIGN_APPEARANCE)}
          />
        </section>

        <SettingsSection title="Notifications">
          {notifications.map((n) => (
            <SettingsRow
              key={n.id}
              label={n.label}
              htmlFor={`settings-alert-${n.id}`}
              hint={n.hint}
              hintId={`settings-alert-${n.id}-hint`}
              beside
            >
              <Switch
                id={`settings-alert-${n.id}`}
                checked={!!alerts[n.id]}
                aria-describedby={`settings-alert-${n.id}-hint`}
                onCheckedChange={(on) => {
                  setAlerts((all) => ({ ...all, [n.id]: on }))
                  onNotificationChange?.(n.id, on)
                }}
              />
            </SettingsRow>
          ))}
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            label="Close account"
            hint="Signs you out and takes you off the rota."
          >
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                Close account
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Close your account?</AlertDialogTitle>
                  <AlertDialogDescription>{closeNote}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onCloseAccount?.()}
                  >
                    Close account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsRow>
        </SettingsSection>
      </div>
    </div>
  )
}

export default Settings01
