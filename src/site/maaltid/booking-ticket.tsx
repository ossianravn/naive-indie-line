import type { ReactNode, Ref } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { DrawnBorder } from "@/fineliner/extras/drawn-border"
import { EditionNumber } from "@/fineliner/extras/edition-number"
import { codeOf, dayName, numberOf, type Booked } from "./bookings"

// A booking as the slip the restaurant would hand you: a doubled drawn border with the booking's number, the evening
// large, then the time and who the table is for, and the code to change it, spaced on the typewriter so it reads aloud
// in two halves. Whatever follows (a note, a button) goes under it.

export function BookingTicket({
  booked,
  headingRef,
  children,
}: {
  booked: Booked
  headingRef?: Ref<HTMLHeadingElement>
  children?: ReactNode
}) {
  const code = codeOf(booked)
  return (
    <DrawnBorder
      double
      seed={`maaltid-ticket-${code}`}
      className="grid max-w-[30rem] gap-snug sm:p-[calc(var(--border-gap)+var(--space-line))]"
    >
      <div className="flex items-start justify-between gap-snug">
        <p className="label m-0 text-pen-quiet">Table booked</p>
        <EditionNumber
          value={numberOf(booked)}
          digits={4}
          label="Booking number"
          className="text-small text-pen-quiet"
        />
      </div>
      <div className="flex items-end gap-snug">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="m-0 min-w-0 flex-1 text-h2 leading-heading outline-none"
        >
          {dayName(booked.day)}
        </h2>
        <Drawing
          object="envelope"
          seed={`maaltid-${booked.email}`}
          title=""
          className="w-20 shrink-0 max-sm:hidden"
        />
      </div>
      <p className="m-0">
        At {booked.time}, a table for {booked.guests} under{" "}
        <span className="wrap-anywhere">{booked.name}</span>.
      </p>
      <dl className="m-0 grid w-fit grid-cols-[auto_auto] items-baseline gap-x-line">
        <dt className="text-small text-pen-quiet">Booking code</dt>
        <dd className="m-0 font-type text-lead tracking-[0.12em] tabular-nums">
          {code.slice(0, 3)} {code.slice(3)}
        </dd>
      </dl>
      {children}
    </DrawnBorder>
  )
}
