"use client"

// The brief, on a sheet taped to the street-level wall: name, email, what you need (filled from the estimate when it
// was sent down) and a message, and "Send" as the one pocket of ink. Nothing is sent anywhere: on sending, the sheet
// gives way to an envelope drawn on, a RECEIVED stamp, a reference number and a toast. Errors are in the correction
// pen, under their fields.
// The envelope after a brief is sent is drawn in the browser.
import "@/fineliner/pen/objects/everyday"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Drawing } from "@/fineliner/drawing/drawing"
import { EditionNumber } from "@/fineliner/extras/edition-number"
import { Pinned } from "@/fineliner/extras/pinned"
import { Stamp } from "@/fineliner/extras/stamp"
import { Button } from "@/fineliner/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Textarea } from "@/fineliner/ui/textarea"
import { Toaster } from "@/fineliner/ui/sonner"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { seedOf } from "@/fineliner/pen/seed"
import { onCarried } from "./brief-store"
import { PRICES } from "./data"

const KINDS = Object.keys(PRICES.kinds)

export function BriefForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [kinds, setKinds] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(
    () =>
      onCarried(({ kinds: k, lines }) => {
        setKinds(k)
        setMessage((m) =>
          m.trim() ? m : `From the estimate:\n${lines.join("\n")}\n\n`,
        )
      }),
    [],
  )
  useEffect(() => {
    if (sent !== null) heading.current?.focus()
  }, [sent])
  const errors = {
    name: name.trim() ? "" : "Write your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? ""
      : "Write an email we can answer.",
    message: message.trim() ? "" : "Tell us a little about it.",
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTried(true)
    if (errors.name || errors.email || errors.message) return
    const reference = (seedOf(`${name}|${email}|${message}`) % 9000) + 1000
    setSent(reference)
    toast.success(
      `Brief received. We answer ${email.trim()} within two working days.`,
    )
  }
  return (
    <div className="w-full max-w-[30rem]">
      <Pinned fix="tape" seed="baghuset-brief" className="rotate-none">
        {sent === null ? (
          <form noValidate onSubmit={submit} className="grid gap-y-line">
            <h3 className="m-0 text-h3 leading-heading">The brief</h3>
            <FieldGroup>
              <Field data-invalid={tried && !!errors.name}>
                <FieldLabel htmlFor="brief-name">Name</FieldLabel>
                <Input
                  id="brief-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={tried && !!errors.name}
                  className="w-64 max-w-full"
                />
                {tried && errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>
              <Field data-invalid={tried && !!errors.email}>
                <FieldLabel htmlFor="brief-email">Email</FieldLabel>
                <Input
                  id="brief-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={tried && !!errors.email}
                  className="w-72 max-w-full"
                />
                {tried && errors.email && (
                  <FieldError>{errors.email}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel id="brief-kinds">What you need</FieldLabel>
                <ToggleGroup
                  aria-labelledby="brief-kinds"
                  variant="outline"
                  spacing={0}
                  multiple
                  value={kinds}
                  onValueChange={(v: unknown[]) => setKinds(v as string[])}
                  className="flex-wrap justify-self-start"
                >
                  {KINDS.map((kind) => (
                    <ToggleGroupItem key={kind} value={kind}>
                      {kind}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
              <Field data-invalid={tried && !!errors.message}>
                <FieldLabel htmlFor="brief-message">Message</FieldLabel>
                <Textarea
                  id="brief-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={tried && !!errors.message}
                />
                {tried && errors.message && (
                  <FieldError>{errors.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
            <div>
              <Button type="submit">Send</Button>
            </div>
          </form>
        ) : (
          <div className="grid justify-items-start gap-y-snug">
            <Drawing
              object="envelope"
              seed={`baghuset-brief-${sent}`}
              drawOnView
              title=""
              className="w-28"
            />
            <h3
              ref={heading}
              tabIndex={-1}
              className="m-0 text-h3 leading-heading outline-none"
            >
              Thank you, {name.trim()}
            </h3>
            <p className="m-0">
              We read every brief ourselves and answer within two working days.
            </p>
            <div className="flex items-center gap-x-snug">
              <Stamp>Received</Stamp>
              <EditionNumber
                value={sent}
                label="Reference"
                className="text-small text-pen-quiet"
              />
            </div>
          </div>
        )}
      </Pinned>
      <Toaster />
    </div>
  )
}
