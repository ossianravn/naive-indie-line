"use client"

import { Circled, PenMark } from "@/fineliner/drawing/pen-mark"
import { PriceTag } from "@/fineliner/extras/price-tag"
import { Button } from "@/fineliner/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"

// One membership as a card: its price on a hanging tag, its name and who it is for, the action, and what it includes,
// each line ticked by the pen. A yearly price strikes out twelve months at the monthly price on the tag. The
// recommended plan is stamped "Most chosen" by its name, ringed by the pen, and its action is the page's one pocket of
// ink. Inside a grid with subgrid rows (PLAN_ROWS on the cards' parent), the four parts line up across neighbouring
// cards, so the tags hang from one line whatever their size.

export type Billing = "monthly" | "yearly"

export interface Plan {
  name: string
  audience: string
  /** Kroner a month, paid monthly. */
  monthly: number
  /** Kroner for a year paid at once. */
  yearly: number
  action: string
  features: string[]
  recommended?: boolean
}

const count = new Intl.NumberFormat("en-GB")

/** A price in kroner: 1,290 kr. */
export const kroner = (n: number) => `${count.format(n)} kr`

/** Classes for the cards' parent at the width where they sit side by side. */
export const PLAN_ROWS = "@min-[54rem]:grid-rows-[auto_auto_auto_1fr]"

/** The tag's words for a plan and period. */
function price(plan: Plan, billing: Billing) {
  if (billing === "monthly")
    return {
      price: kroner(plan.monthly),
      note: "a month",
      basis: "Billed monthly; stop when you like.",
    }
  const was = plan.monthly * 12
  return {
    price: kroner(plan.yearly),
    was: was > plan.yearly ? kroner(was) : undefined,
    note: "a year",
    basis: "Billed once a year.",
  }
}

export function PlanCard({
  plan,
  billing,
  onChoose,
}: {
  plan: Plan
  billing: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
}) {
  const { basis, ...tag } = price(plan, billing)
  return (
    <Card className="@min-[54rem]:row-span-4 @min-[54rem]:grid @min-[54rem]:grid-rows-subgrid">
      <CardContent>
        {/* Seeded by the plan, so the tag keeps its tilt when the period changes. */}
        <PriceTag {...tag} size="lg" seed={`plan:${plan.name}`} />
      </CardContent>
      {/* content-start: a header in a taller row keeps its lines together at the top. */}
      <CardHeader className="content-start">
        {/* The recommendation is stamped by the plan's name, so it reads as part of that plan at every width. */}
        <CardTitle className="flex flex-wrap items-baseline gap-x-snug gap-y-hair text-h2 leading-heading font-normal">
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit]">
            {plan.name}
          </h2>
          {plan.recommended && (
            <Circled seed={`chosen:${plan.name}`} className="label">
              Most chosen
            </Circled>
          )}
        </CardTitle>
        <CardDescription>{plan.audience}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={plan.recommended ? "default" : "outline"}
          onClick={() => onChoose?.(plan, billing)}
        >
          {plan.action}
        </Button>
        <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
          {basis}
        </p>
      </CardContent>
      <CardContent>
        <ul
          aria-label={`${plan.name} includes`}
          className="m-0 flex list-none flex-col gap-hair p-0"
        >
          {plan.features.map((feature, i) => (
            <li
              key={feature}
              className="grid grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-tight text-ui leading-small"
            >
              <PenMark
                name="tick"
                seed={`${plan.name}-${i}`}
                className="mt-0.5 size-4"
              />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
