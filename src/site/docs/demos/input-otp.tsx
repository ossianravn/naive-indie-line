import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/fineliner/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/fineliner/ui/input-otp"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input OTP",
  description:
    "One drawn box per digit for a short one-time code, such as the sign-in code Listening Room sends by email.",
  item: "input-otp",
  group: "Forms",
}

type CodeProps = {
  id?: string
  invalid?: boolean
  defaultValue?: string
  disabled?: boolean
  autoComplete?: string
  "aria-label"?: string
  "aria-describedby"?: string
}

// Controlled: input-otp forwards defaultValue to its own controlled <input>, which React rejects.
function Code({ invalid, defaultValue = "", ...props }: CodeProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={setValue}
      {...props}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

function DoorCode() {
  const [value, setValue] = useState("")
  return (
    <InputOTP
      maxLength={4}
      pattern={REGEXP_ONLY_DIGITS}
      aria-label="Door code for the back room"
      value={value}
      onChange={setValue}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default function InputOTPDemo() {
  return (
    <>
      <DemoSection title="Sign-in code">
        <StateRow label="Empty">
          <Field className="w-auto">
            <FieldLabel htmlFor="otp-sign-in">Sign-in code</FieldLabel>
            <Code
              id="otp-sign-in"
              autoComplete="one-time-code"
              aria-describedby="otp-sign-in-hint"
            />
            <FieldDescription id="otp-sign-in-hint">
              Sent to maya@example.com. It works for ten minutes.
            </FieldDescription>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Partly filled">
          <Code aria-label="Sign-in code" defaultValue="418" />
        </StateRow>
        <StateRow label="Filled">
          <Code aria-label="Sign-in code" defaultValue="418205" />
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <Code
              aria-label="Sign-in code"
              defaultValue="418250"
              invalid
              aria-describedby="otp-error"
            />
            <FieldError id="otp-error">
              That code does not match. Check the latest email.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Code aria-label="Sign-in code" defaultValue="418205" disabled />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Four digits">
          <DoorCode />
        </StateRow>
      </DemoSection>
    </>
  )
}
