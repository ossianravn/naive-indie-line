"use client"

import { useEffect, useRef, useState, type SyntheticEvent } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { cn } from "@/fineliner/lib/utils"
import type { SceneName } from "@/fineliner/pen"
import { Button } from "@/fineliner/ui/button"
import { Checkbox } from "@/fineliner/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/fineliner/ui/input-group"
import { Label } from "@/fineliner/ui/label"

// A sign-in form in a 23rem column beside a scene drawn by the pen; on narrow screens a small figure stands above the
// heading instead. Email and password are checked when the form is sent and then as you correct them, with errors
// in the correction pen; focus moves to the first field that needs attention. "Email me a link instead" checks only
// the email and turns the form into a check-your-email note. Wire onSignIn and onRequestLink to your auth.

export const meta = {
  title: "Sign in",
  description:
    "Email and password with validation, keep me signed in, and a link by email instead, beside a scene drawn by the pen.",
}

export interface SignIn01Props {
  /** The product being signed in to, in the heading. */
  product?: string
  /** One line under the heading. */
  tagline?: string
  /** The scene beside the form on wider screens. */
  scene?: SceneName
  /** The object above the heading on narrow screens. */
  figure?: string
  /** Where a successful sign-in goes. Without it, the form says who signed in. */
  redirectTo?: string
  onSignIn?: (details: { email: string; remember: boolean }) => void
  onRequestLink?: (email: string) => void
  className?: string
}

const EMAIL = /^\S+@\S+\.\S+$/

export function SignIn01({
  product = "Listening Room",
  tagline = "The racks are where you left them.",
  scene = "room",
  figure = "person-wave",
  redirectTo,
  onSignIn,
  onRequestLink,
  className,
}: SignIn01Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [visible, setVisible] = useState(false)
  // Which action was tried: a password sign-in checks both fields, a link only the email.
  const [tried, setTried] = useState<"password" | "link" | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const emailField = useRef<HTMLInputElement>(null)
  const passwordField = useRef<HTMLInputElement>(null)
  const sentHeading = useRef<HTMLHeadingElement>(null)
  const returning = useRef(false)

  const errors = {
    email:
      tried && !EMAIL.test(email)
        ? "Enter the email address you signed up with, like maya@example.com."
        : "",
    password: tried === "password" && !password ? "Enter your password." : "",
  }

  // Moving between the form and the sent note keeps focus with the person: on the note's heading, then back on the
  // email they may want to change.
  useEffect(() => {
    if (sentTo) sentHeading.current?.focus()
    else if (returning.current) emailField.current?.focus()
    returning.current = false
  }, [sentTo])

  function signIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setTried("password")
    if (!EMAIL.test(email)) return emailField.current?.focus()
    if (!password) return passwordField.current?.focus()
    onSignIn?.({ email, remember })
    if (redirectTo) window.location.assign(redirectTo)
    else setStatus(`Signed in as ${email}.`)
  }

  function requestLink() {
    if (tried !== "password") setTried("link")
    if (!EMAIL.test(email)) return emailField.current?.focus()
    onRequestLink?.(email)
    setStatus("")
    setSentTo(email)
  }

  return (
    <div className={cn("@container flex min-h-dvh flex-col", className)}>
      <div className="mx-auto grid w-full max-w-[66rem] flex-1 content-start items-center gap-x-page px-snug py-section grid-cols-[minmax(0,1fr)] @min-[40rem]:px-line @min-[52rem]:grid-cols-[23rem_minmax(0,1fr)] @min-[52rem]:content-center">
        <div className="w-[23rem] max-w-full">
          <Drawing
            object={figure}
            seed={`sign-in:${product}`}
            title=""
            drawOnView
            className="w-20 @min-[52rem]:hidden"
          />
          {sentTo ? (
            <>
              <h1
                ref={sentHeading}
                tabIndex={-1}
                className="m-0 mt-tight text-h2 focus-visible:outline-offset-4 @min-[52rem]:mt-0"
              >
                Check your email
              </h1>
              <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
                We sent a sign-in link to{" "}
                <strong className="font-medium [overflow-wrap:anywhere] text-pen">
                  {sentTo}
                </strong>
                . Open it on this device to sign in.
              </p>
              <div className="mt-line flex flex-wrap items-center gap-snug">
                <Button
                  variant="outline"
                  onClick={() => {
                    onRequestLink?.(sentTo)
                    setStatus(`Sent another link to ${sentTo}.`)
                  }}
                >
                  Send again
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    returning.current = true
                    setStatus("")
                    setSentTo(null)
                  }}
                >
                  Use a password
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="m-0 mt-tight text-h2 @min-[52rem]:mt-0">
                Sign in to {product}
              </h1>
              <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
                {tagline}
              </p>
              <form onSubmit={signIn} noValidate className="mt-line">
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                    <Input
                      ref={emailField}
                      id="sign-in-email"
                      type="email"
                      autoComplete="username"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "sign-in-email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <FieldError id="sign-in-email-error">
                        {errors.email}
                      </FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        ref={passwordField}
                        id="sign-in-password"
                        type={visible ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "sign-in-password-error" : undefined
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          aria-label="Show password"
                          aria-pressed={visible}
                          onClick={() => setVisible((v) => !v)}
                        >
                          {visible ? <EyeOffIcon /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.password && (
                      <FieldError id="sign-in-password-error">
                        {errors.password}
                      </FieldError>
                    )}
                  </Field>
                  <Label>
                    <Checkbox
                      checked={remember}
                      onCheckedChange={(on) => setRemember(on)}
                    />
                    Keep me signed in on this device
                  </Label>
                </FieldGroup>
                <div className="mt-line flex flex-wrap items-center gap-snug">
                  <Button type="submit">Sign in</Button>
                  <Button variant="link" type="button" onClick={requestLink}>
                    Email me a link instead
                  </Button>
                </div>
              </form>
            </>
          )}
          <p
            aria-live="polite"
            className="m-0 text-small leading-small text-pen-quiet not-empty:mt-snug"
          >
            {status}
          </p>
        </div>
        <Drawing
          scene={scene}
          seed={`sign-in:${product}`}
          title=""
          drawOnView
          className="hidden w-full max-w-[36rem] justify-self-center @min-[52rem]:grid"
        />
      </div>
    </div>
  )
}

export default SignIn01
