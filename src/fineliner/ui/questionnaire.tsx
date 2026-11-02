"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"
import { buttonVariants, type Button } from "@/fineliner/ui/button"
import {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
  TICK,
} from "@/fineliner/ui/questionnaire-choice"

// Questions as a stack of sheets. The form is the top sheet, drawn round by the pen on paper; the sheets still to come
// peek out beneath it, one edge per remaining question up to two, each a little narrower and lower and drawn in a
// quieter pen. The answering parts live in questionnaire-choice.tsx. Progress is a row of typed numbers ringed by the
// pen and joined by short rules: the current ring pressed harder, a passed one ticked.

// The stack, bottom sheet first: [seed, place, line colour]. The frame sits on an inner span, since a frame positions
// itself relatively; a lower sheet shows only while that many questions remain after the current one.
const STACK = [
  [
    "questionnaire-third",
    "inset-x-3.5 top-3.5 -bottom-3.5 -z-30 hidden group-has-[[data-slot=questionnaire-item][data-active]~[data-slot=questionnaire-item]~[data-slot=questionnaire-item]]/questionnaire:block",
    "before:text-pen-faint after:text-pen-faint",
  ],
  [
    "questionnaire-next",
    "inset-x-[0.4375rem] top-[0.4375rem] -bottom-[0.4375rem] -z-20 hidden group-has-[[data-slot=questionnaire-item][data-active]~[data-slot=questionnaire-item]]/questionnaire:block",
    "before:text-pen-quiet after:text-pen-quiet",
  ],
  ["questionnaire", "inset-0 -z-10", ""],
] as const

const rings = new Map<number, string>()
const ring = (i: number) => {
  if (!rings.has(i)) rings.set(i, penMark("ring", `questionnaire:${i}`, "calm"))
  return rings.get(i) as string
}

function Questionnaire({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        "group/questionnaire relative isolate mb-snug flex w-full min-w-0 flex-col gap-snug p-snug",
        className,
      )}
      {...props}
    >
      {STACK.map(([seed, place, line]) => (
        <span
          key={seed}
          aria-hidden="true"
          data-slot="questionnaire-stack"
          className={cn("pointer-events-none absolute", place)}
        >
          <span
            className={cn("frame float-sheet block size-full", line)}
            style={frameStyle(seed)}
          />
        </span>
      ))}
      {children}
    </QuestionnairePrimitive.Root>
  )
}

function ProgressRings({ current, total }: { current: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const state =
          i + 1 < current ? "done" : i + 1 === current ? "current" : "next"
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="rule w-2.5 text-pen-faint" />}
            <span
              data-state={state}
              className="relative flex size-7 items-center justify-center font-type text-small text-pen-quiet tabular-nums data-[state=current]:text-pen data-[state=current]:[--pen-weight:var(--pen-weight-pressed)]"
            >
              <span
                className="absolute inset-0 text-pen-faint in-data-[state=current]:text-pen in-data-[state=done]:text-pen-quiet [&>svg]:size-full"
                dangerouslySetInnerHTML={{ __html: ring(i) }}
              />
              {state === "done" ? (
                <span
                  className="put-down absolute -top-px left-1 size-[1.3rem] text-pen [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: TICK }}
                />
              ) : (
                <span className="relative">{i + 1}</span>
              )}
            </span>
          </React.Fragment>
        )
      })}
    </span>
  )
}

function QuestionnaireProgress({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        "flex min-h-[1lh] w-fit items-center gap-tight text-pen-quiet",
        className,
      )}
      render={(rendered, state) => {
        const { current, total } = state as { current: number; total: number }
        return (
          <div {...rendered}>
            <ProgressRings current={current} total={total} />
            {children ? (
              <span className="font-type text-small text-pen-quiet tabular-nums">
                {children}
              </span>
            ) : null}
          </div>
        )
      }}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "m-0 flex min-w-0 animate-in flex-col gap-tight border-0 p-0 duration-200 ease-(--ease-out) fade-in-0 outline-none motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "float-left mb-0 w-full p-0 font-read text-lead leading-subhead font-medium text-pretty text-pen [&:not(:has(~[data-slot=questionnaire-description]))]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        "m-0 -mt-1 mb-hair text-small leading-small text-pretty text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0 gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-control w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-tight pt-hair",
        className,
      )}
      {...props}
    />
  )
}

type Nav = Pick<React.ComponentProps<typeof Button>, "size" | "variant">
type NavPrimitive = typeof QuestionnairePrimitive.Next

// Previous, Skip, Next and Submit share one shape: a button in a fixed column of the actions grid, its frame or pocket
// seeded by its words like any other button.
function navButton(
  Primitive: NavPrimitive,
  slot: string,
  place: string,
  fallback: string,
  defaultVariant: Nav["variant"],
) {
  return function QuestionnaireNavButton({
    children,
    className,
    style,
    size = "default",
    variant = defaultVariant,
    ...props
  }: React.ComponentProps<NavPrimitive> & Nav) {
    return (
      <Primitive
        data-slot={slot}
        data-size={size}
        data-variant={variant}
        className={cn(buttonVariants({ size, variant }), place, className)}
        style={frameStyle(children ?? fallback, style)}
        {...props}
      >
        {children ?? fallback}
      </Primitive>
    )
  }
}

const QuestionnairePrevious = navButton(
  QuestionnairePrimitive.Previous,
  "questionnaire-previous",
  "col-start-1 row-start-1 justify-self-start",
  "Previous",
  "ghost",
)
const QuestionnaireSkip = navButton(
  QuestionnairePrimitive.Skip,
  "questionnaire-skip",
  "col-start-2 row-start-1 justify-self-end",
  "Skip",
  "outline",
)
const QuestionnaireNext = navButton(
  QuestionnairePrimitive.Next,
  "questionnaire-next",
  "col-start-3 row-start-1 justify-self-end",
  "Next",
  "default",
)
const QuestionnaireSubmit = navButton(
  QuestionnairePrimitive.Submit,
  "questionnaire-submit",
  "col-start-3 row-start-1 justify-self-end",
  "Submit",
  "default",
)

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
