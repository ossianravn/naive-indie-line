import type { CSSProperties } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { AppearanceControl } from "@/fineliner/extras/appearance-control"
import { cn } from "@/fineliner/lib/utils"
import { frameVars, seedOf } from "@/fineliner/pen"
import { useAppearance } from "@/fineliner/theme"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/fineliner/ui/sheet"
import { siteAppearance } from "./appearance"
import { PresetSwatch } from "./studio/preset-picker"
import { matchPreset, PRESETS } from "./studio/presets"

// The site's appearance panel: a button at the end of every page's header that opens a sheet from the right with the
// studio's presets and every setting. Choices apply to <html> and persist, so they follow the visitor from page to
// page. The sheet is not modal and the page is not dimmed (site.css), so the page restyles in view behind it and
// still scrolls.

export function AppearancePanel({
  className,
  dotOnPhone = false,
}: {
  className?: string
  /** On a phone the button is its pen dot alone, for a header with no room for the word. */
  dotOnPhone?: boolean
}) {
  const [appearance, update] = useAppearance(siteAppearance)
  const preset = matchPreset(appearance)
  return (
    <Sheet modal={false}>
      <SheetTrigger
        className={cn(
          "press inline-flex cursor-pointer items-center gap-hair border-0 bg-transparent p-0 font-ui text-small text-pen hover:underline",
          dotOnPhone && "max-sm:size-control max-sm:justify-center",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="size-3 rounded-full bg-pen [filter:var(--wob-2)] forced-colors:[forced-color-adjust:none]"
        />
        <span className={cn(dotOnPhone && "max-sm:sr-only")}>Appearance</span>
      </SheetTrigger>
      <SheetContent
        data-appearance-panel=""
        className="gap-tight sm:max-w-[31rem]"
      >
        <SheetHeader>
          <SheetTitle>Appearance</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-col gap-line overflow-y-auto px-snug pb-snug">
          <section aria-labelledby="panel-presets">
            <h2 id="panel-presets" className="label m-0 text-pen-quiet">
              Presets
            </h2>
            <ul className="m-0 mt-hair grid list-none grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-hair p-0">
              {PRESETS.map((item) => {
                const on = item === preset
                return (
                  <li key={item.name} className="flex">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => update(item.choices)}
                      style={frameVars(seedOf(item.name)) as CSSProperties}
                      className="frame press flex w-full cursor-pointer items-center gap-tight px-tight py-hair text-left aria-pressed:[--pen-weight:var(--pen-weight-pressed)] hover:[--pen-weight:var(--pen-weight-pressed)]"
                    >
                      <PresetSwatch preset={item} />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {item.name}
                      </span>
                      <PenMark
                        name="tick"
                        seed={item.name}
                        hand="calm"
                        className={cn("put-down size-4", !on && "invisible")}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
          <section aria-labelledby="panel-settings">
            <h2 id="panel-settings" className="label m-0 text-pen-quiet">
              Settings
            </h2>
            <AppearanceControl defaults={siteAppearance} className="mt-tight" />
          </section>
          <a href="/studio#export" className="self-start text-small">
            Export this theme in the studio
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
