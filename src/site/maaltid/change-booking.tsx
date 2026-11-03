import { useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useIsMobile } from "@/fineliner/hooks/use-mobile"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/fineliner/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/fineliner/ui/drawer"
import { FieldDescription, FieldError } from "@/fineliner/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/fineliner/ui/input-otp"
import {
  cancelBooking,
  dayName,
  findBooking,
  STANDING_CODE,
  type Booked,
} from "./bookings"

// "Change a booking": the six-digit code from the booking's email finds it, and it can be cancelled from there, after
// a question in the correction pen. A dialog on a wide screen, a drawer from the bottom on a phone, the same inside.
// The restaurant is made up, so the field says which code to try. The toast lands in the booking form's Toaster.

export function ChangeBooking() {
  const mobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const found = code.length === 6 ? findBooking(code) : undefined
  const reset = (next: boolean) => {
    setOpen(next)
    if (!next) setCode("")
  }
  const body = (
    <ChangeBody
      code={code}
      setCode={setCode}
      found={found}
      onCancelled={(b) => {
        cancelBooking(code)
        reset(false)
        toast.success(`Your table on ${dayName(b.day)} is cancelled`)
      }}
    />
  )
  const trigger = <Button variant="outline" />
  const title = "Change a booking"
  const description = "Enter the code from your booking email."
  if (mobile)
    return (
      <Drawer open={open} onOpenChange={reset}>
        <DrawerTrigger render={trigger}>{title}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-snug pb-line">{body}</div>
        </DrawerContent>
      </Drawer>
    )
  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger render={trigger}>{title}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  )
}

function ChangeBody({
  code,
  setCode,
  found,
  onCancelled,
}: {
  code: string
  setCode: (code: string) => void
  found?: Booked
  onCancelled: (b: Booked) => void
}) {
  const missing = code.length === 6 && !found
  return (
    <div className="grid gap-snug">
      <div className="grid gap-tight">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(next) => setCode(next.replace(/\D/g, ""))}
          inputMode="numeric"
          aria-label="Booking code"
          aria-invalid={missing}
          autoFocus
        >
          <InputOTPGroup>
            {[0, 1, 2].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
          <InputOTPGroup>
            {[3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {missing ? (
          <FieldError>No booking has that code. Check the email.</FieldError>
        ) : (
          <FieldDescription>
            MÅLTID is made up: try {STANDING_CODE.slice(0, 3)}{" "}
            {STANDING_CODE.slice(3)}, or the code from a booking you made here.
          </FieldDescription>
        )}
      </div>
      {found && (
        <Found booked={found}>
          <CancelBooking booked={found} onCancelled={onCancelled} />
        </Found>
      )}
    </div>
  )
}

function Found({ booked, children }: { booked: Booked; children: ReactNode }) {
  return (
    <div className="grid gap-tight" aria-live="polite">
      <p className="m-0 font-read text-lead leading-subhead">
        {dayName(booked.day)} at {booked.time}
      </p>
      <p className="m-0 text-pen-quiet">
        A table for {booked.guests} under{" "}
        <span className="wrap-anywhere">{booked.name}</span>. To move it, cancel
        it and book again.
      </p>
      <div className="mt-hair">{children}</div>
    </div>
  )
}

function CancelBooking({
  booked,
  onCancelled,
}: {
  booked: Booked
  onCancelled: (b: Booked) => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Cancel the booking
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your table?</AlertDialogTitle>
          <AlertDialogDescription>
            The table for {booked.guests} on {dayName(booked.day)} at{" "}
            {booked.time} goes back to whoever asks next. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onCancelled(booked)}
          >
            Cancel the booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
