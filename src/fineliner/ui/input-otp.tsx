"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// One box drawn by the pen per digit, square at control height and seeded by its place, so a row of boxes wobbles
// box by box. Digits in the typewriter. The box that takes the next keystroke presses harder and carries the page's
// dashed ring (a little closer, so it clears its neighbours). Invalid boxes draw in the correction pen; disabled ones
// dim with their digits. Groups are divided by a short pen stroke.
const DASH = penMark("strike", "input-otp", "calm")

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/input-otp flex items-center gap-tight has-disabled:cursor-not-allowed",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-hair", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "frame relative flex size-control items-center justify-center font-type text-lead leading-none text-pen tabular-nums [--over:2.5px] calm:[--over:1px]",
        "data-[active=true]:z-10 data-[active=true]:outline-[1.5px] data-[active=true]:outline-offset-[3px] data-[active=true]:outline-pen data-[active=true]:outline-dashed data-[active=true]:[--pen-weight:var(--pen-weight-pressed)]",
        "aria-invalid:text-correction group-has-[input[aria-invalid=true]]/input-otp:text-correction",
        "group-has-disabled/input-otp:text-pen-faint",
        className,
      )}
      style={frameStyle(`input-otp slot ${index}`, style)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1.1em] w-[1.5px] animate-caret-blink bg-pen duration-1000 motion-reduce:animate-none" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center text-pen-quiet group-has-disabled/input-otp:text-pen-faint"
      role="separator"
      {...props}
    >
      <span
        aria-hidden="true"
        className="block h-2 w-3.5 [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: DASH }}
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
