"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"
import { Kbd } from "@/fineliner/ui/kbd"

// The answering parts of a questionnaire card. A choice is a row in a drawn frame (seeded by its value) that presses
// harder under the pointer and once chosen; inside, a drawn box takes a tick that runs past it (several answers) or a
// drawn circle takes an inked dot (one answer), both put down by the pen. Shortcut letters sit on typewriter keys. A
// typed answer is a steady field; the error is written in the correction pen, and so is an unanswered choice's frame.
export const TICK = penMark("tick", "questionnaire", "calm")
const DOT = penMark("dot", "questionnaire", "calm")

function QuestionnaireChoice({
  children,
  className,
  style,
  value,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      value={value}
      className={cn(
        "group/questionnaire-choice frame relative flex min-h-control cursor-pointer items-start gap-tight px-tight py-tight text-start font-ui text-ui leading-ui text-pen select-none [--over:2.5px] calm:[--over:1px] hover:[--pen-weight:var(--pen-weight-pressed)] data-checked:[--pen-weight:var(--pen-weight-pressed)] data-invalid:before:text-correction data-invalid:after:text-correction",
        "has-[>input:focus-visible]:outline-[1.5px] has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-current has-[>input:focus-visible]:outline-dashed",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:text-pen-faint",
        className,
      )}
      style={frameStyle(`choice:${String(value ?? "")}`, style)}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 focus-visible:outline-none"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative mt-[0.15rem] flex size-[1.1rem] shrink-0 items-center justify-center"
      >
        <span className="hidden size-full frame [--over:1.5px] calm:[--over:0.6px] group-data-[type=checkbox]/questionnaire-choice:block" />
        <span className="absolute inset-0 hidden rounded-full border-(length:--pen-weight) border-current [filter:var(--wob,var(--wob-1))] group-data-[type=radio]/questionnaire-choice:block" />
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="put-down absolute inset-0 hidden [[data-checked][data-type=radio]_&]:block [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: DOT }}
        />
        <span
          data-slot="questionnaire-choice-indicator-check"
          className="put-down absolute -top-1.5 -left-0.5 hidden size-[1.6rem] [[data-checked][data-type=checkbox]_&]:block [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        render={<Kbd />}
        className="ms-auto mt-0.5 text-pen-quiet"
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn(
        "text-small leading-small text-pen-quiet group-data-disabled/questionnaire-choice:text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "control-field h-control w-full min-w-0 px-tight py-hair",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("m-0 text-small leading-small text-correction", className)}
      {...props}
    />
  )
}

export {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
}
