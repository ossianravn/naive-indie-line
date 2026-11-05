"use client"

import { useState } from "react"
import { cn } from "@/fineliner/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/fineliner/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import {
  PLAN_ROWS,
  PlanCard,
  type Billing,
  type Plan,
} from "@/fineliner/blocks/pricing-01-plan"

// Memberships for the listening room: a Monthly/Yearly segmented control above three plans whose prices follow it,
// what each includes ticked by the pen, and a few questions in an accordion. The plans sit side by side when their
// container is wide enough and stack in one readable column when it is not.

export const meta = {
  title: "Pricing",
  description:
    "Three memberships with a monthly or yearly price, what each includes ticked by the pen, and questions in an accordion.",
}

export const PLANS: Plan[] = [
  {
    name: "Listener",
    audience: "For an hour in the room now and then.",
    monthly: 49,
    yearly: 490,
    action: "Become a listener",
    features: [
      "One hour in the room a month",
      "Hold a record for three days",
      "The Thursday programme by email",
    ],
  },
  {
    name: "Regular",
    audience: "For the ones who come in every week.",
    monthly: 129,
    yearly: 1290,
    action: "Become a regular",
    recommended: true,
    features: [
      "Everything in Listener",
      "Four hours in the room a month",
      "A seat at one Thursday evening a month",
      "Hold records for a week",
      "10% off every record",
    ],
  },
  {
    name: "Patron",
    audience: "For friends of the shop who keep Thursdays going.",
    monthly: 299,
    yearly: 2990,
    action: "Become a patron",
    features: [
      "Everything in Regular",
      "The room whenever it is free",
      "A seat kept for you every Thursday",
      "First look at new arrivals",
      "A Room to Listen In, our own 2×LP",
    ],
  },
]

export const QUESTIONS = [
  {
    q: "Can I bring my own records?",
    a: "Yes. The room has a turntable and two speakers; bring anything that plays at 33 or 45.",
  },
  {
    q: "How far ahead can I book the room?",
    a: "Members book up to four weeks ahead, at the counter or online. Everyone else can book a week ahead.",
  },
  {
    q: "What happens to hours I don’t use?",
    a: "They carry over to the next month, then lapse. Thursday seats don’t carry over.",
  },
  {
    q: "Can I stop at any time?",
    a: "Yes. A monthly membership ends with the month you have paid for; a yearly one is refunded for the whole months left.",
  },
]

export interface Pricing01Props {
  plans?: Plan[]
  questions?: { q: string; a: string }[]
  defaultBilling?: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
  className?: string
}

export function Pricing01({
  plans = PLANS,
  questions = QUESTIONS,
  defaultBilling = "monthly",
  onChoose,
  className,
}: Pricing01Props) {
  const [billing, setBilling] = useState<Billing>(defaultBilling)
  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[68rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <h1 className="m-0 max-w-[18em] text-h1 text-balance">
          A chair in the room, a seat on Thursdays
        </h1>
        <p className="m-0 mt-tight max-w-measure text-body leading-body text-pen-quiet">
          Every membership books the listening room at the back of the shop. Pay
          by the month, or by the year and get two months free.
        </p>

        <div className="mt-line flex flex-wrap items-center gap-x-snug gap-y-hair">
          <ToggleGroup
            aria-label="Billing period"
            variant="outline"
            spacing={0}
            value={[billing]}
            onValueChange={(next: unknown[]) =>
              next[0] && setBilling(next[0] as Billing)
            }
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
          <span className="font-hand text-lead leading-none text-pen-quiet">
            two months free
          </span>
        </div>

        <div
          className={cn(
            "mt-section grid max-w-[24rem] gap-x-line gap-y-section @min-[54rem]:max-w-none @min-[54rem]:grid-cols-3 @min-[54rem]:gap-y-0",
            PLAN_ROWS,
          )}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              billing={billing}
              onChoose={onChoose}
            />
          ))}
        </div>

        <section
          aria-labelledby="pricing-questions"
          className="mt-page max-w-measure"
        >
          <h2 id="pricing-questions" className="m-0 text-h2">
            Questions
          </h2>
          <Accordion className="mt-snug">
            {questions.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>
                  <p>{a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  )
}

export default Pricing01
