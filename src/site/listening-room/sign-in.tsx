import { useState, type FormEvent } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Button } from "@/fineliner/ui/button"
import { Checkbox } from "@/fineliner/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"

/** Listening Room's sign-in: a demo, so any well-formed email and a password open the shop. */
export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tried, setTried] = useState(false)
  const errors = {
    email: /^\S+@\S+\.\S+$/.test(email)
      ? ""
      : "Enter the email address you signed up with, like maya@example.com.",
    password: password ? "" : "Enter your password.",
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (!errors.email && !errors.password)
      window.location.assign("/listening-room")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-snug py-section">
      <div className="w-[23rem] max-w-full">
        <Drawing
          object="person-wave"
          seed="sign-in"
          title=""
          drawOnView
          className="w-20"
        />
        <h1 className="m-0 mt-tight text-h2">Sign in to Listening Room</h1>
        <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
          The racks are where you left them.
        </p>
        <form onSubmit={submit} noValidate className="mt-line">
          <FieldGroup>
            <Field data-invalid={tried && !!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={tried && !!errors.email}
              />
              {tried && errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>
            <Field data-invalid={tried && !!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={tried && !!errors.password}
              />
              {tried && errors.password && (
                <FieldError>{errors.password}</FieldError>
              )}
            </Field>
            <Label>
              <Checkbox defaultChecked /> Keep me signed in on this device
            </Label>
          </FieldGroup>
          <div className="mt-line flex flex-wrap items-center gap-snug">
            <Button type="submit">Sign in</Button>
            <Button variant="link" type="button" onClick={() => setTried(true)}>
              Email me a link instead
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
