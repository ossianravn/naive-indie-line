"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

import { Button, buttonVariants } from "@/fineliner/ui/button"

// A printed month: the month in the reading face, weekdays in the label voice, day numbers in the reading voice with
// tabular figures. Today is ringed by the pen (one fixed seed, so every build draws the same ring); the chosen day is
// a round pocket of ink with paper numerals, put down as it is chosen; a range is a pale band between its two ends.
// Outside days print faint and disabled days are struck out. Month arrows are pen chevrons. Pass `today` (and
// `defaultMonth`) so the server and the browser draw the same page; dates format in en-US unless a locale is given.
const RING = penMark("ring", "calendar today", "calm")
const CHEVRON = penMark("chevron", "calendar", "calm")

// The band behind a range: a pale pocket that wobbles like the others. Each day draws its own piece, reaching 2px
// into its neighbours so the wobble leaves no seams.
const band =
  "before:pointer-events-none before:absolute before:inset-y-[3px] before:-z-10 before:bg-tint before:[filter:var(--wob,var(--wob-2))]"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  labels,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-tight [--cell-size:2.5rem]",
        String.raw`rtl:**:[.rdp-button\_next>span]:-scale-x-100`,
        String.raw`rtl:**:[.rdp-button\_previous>span]:-scale-x-100`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code ?? "en-US", { month: "short" }),
        ...formatters,
      }}
      labels={{
        // The visible numeral stays a word of the name ("Monday 26 October 2026", not "October 26th"), so voice
        // control can say what it sees (WCAG 2.5.3).
        labelDayButton: (date, modifiers, _options, dateLib) => {
          const name =
            dateLib?.format(date, "EEEE d MMMM yyyy") ?? date.toDateString()
          return `${modifiers.today ? "Today, " : ""}${name}${modifiers.selected ? ", selected" : ""}`
        },
        ...labels,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-snug md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-tight", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-pen-faint",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-pen-faint",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-hair",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "control-field relative h-control-compact data-[disabled=false]:cursor-pointer data-[disabled=false]:border-solid data-[disabled=false]:text-pen data-[disabled=false]:hover:shadow-[inset_0_0_0_0.65px_var(--input)] has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-4 has-focus-visible:outline-pen has-focus-visible:outline-dashed",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-paper opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-read font-medium text-pen select-none",
          captionLayout === "label"
            ? "text-body leading-subhead"
            : "flex h-full items-center gap-hair pr-tight pl-tight text-small leading-small",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "label flex-1 pb-1 font-normal text-pen-quiet select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-0.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "label text-pen-quiet select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative isolate aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          band,
          "before:right-[-2px] before:left-1/2",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          band,
          "before:inset-x-[-2px] first:before:left-0 last:before:right-0",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          band,
          "before:right-1/2 before:left-[-2px] [&:has([data-range-start=true][data-range-end=true])]:before:hidden",
          defaultClassNames.range_end,
        ),
        today: cn(defaultClassNames.today),
        outside: cn(defaultClassNames.outside),
        disabled: cn(defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation }) => (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none block h-2.5 w-3.5 shrink-0 [&>svg]:size-full!",
              orientation === "left" && "rotate-90",
              orientation === "right" && "-rotate-90",
              orientation === "up" && "rotate-180",
              className,
            )}
            dangerouslySetInnerHTML={{ __html: CHEVRON }}
          />
        ),
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  children,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const inked = Boolean(modifiers.selected && !modifiers.range_middle)

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code ?? "en-US")}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-full font-ui text-ui leading-none font-normal lining-nums tabular-nums before:inset-[3px] before:rounded-full focus-visible:outline-offset-0 disabled:line-through disabled:decoration-pen-faint group-data-outside/day:text-pen-faint [&>span:not([aria-hidden])]:text-label [&>span:not([aria-hidden])]:opacity-70",
        "data-[range-end=true]:text-paper data-[range-start=true]:text-paper data-[selected-single=true]:text-paper data-[range-end=true]:before:hidden data-[range-start=true]:before:hidden data-[selected-single=true]:before:hidden data-[range-middle=true]:before:bg-transparent data-[range-middle=true]:hover:before:bg-pen/15",
        "forced-colors:data-[range-end=true]:text-[HighlightText] forced-colors:data-[range-start=true]:text-[HighlightText] forced-colors:data-[selected-single=true]:text-[HighlightText]",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      {inked && (
        <span
          aria-hidden="true"
          className="put-down pointer-events-none absolute inset-[3px] -z-1 rounded-full bg-pen [filter:var(--wob,var(--wob-2))] forced-colors:bg-[Highlight] forced-colors:[forced-color-adjust:none]"
        />
      )}
      {modifiers.today && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px text-pen [&>svg]:size-full!"
          dangerouslySetInnerHTML={{ __html: RING }}
        />
      )}
      {children}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
