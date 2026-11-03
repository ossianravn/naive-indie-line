import { useState } from "react"
import { Lettering } from "@/fineliner/drawing/lettering"
import { DrawnBorder } from "@/fineliner/extras/drawn-border"
import { EditionNumber } from "@/fineliner/extras/edition-number"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { ALLERGENS, MENU_NUMBER, TONIGHT, type Allergen } from "./data"
import { MenuCard } from "./menu-card"

// Tonight's menu page: what to leave out, then the card as it is printed for the tables, in a doubled drawn border
// with the evening lettered at its head, its date and the menu's number. Leaving something out takes those dishes
// off the card.

const NAMES: Record<Allergen, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  fish: "Fish",
  nuts: "Nuts",
}

export function TonightMenu() {
  const [leaveOut, setLeaveOut] = useState<Allergen[]>([])
  return (
    <div className="grid gap-y-line">
      <div className="flex flex-wrap items-center gap-x-snug gap-y-tight">
        <span id="leave-out" className="text-small text-pen-quiet">
          Leave out
        </span>
        <ToggleGroup
          multiple
          variant="outline"
          size="sm"
          value={leaveOut}
          onValueChange={(next) => setLeaveOut(next as Allergen[])}
          aria-labelledby="leave-out"
        >
          {ALLERGENS.map((allergen) => (
            <ToggleGroupItem key={allergen} value={allergen}>
              {NAMES[allergen]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <DrawnBorder
        double
        seed="maaltid-menu-card"
        className="sm:p-[calc(var(--border-gap)+var(--space-line))]"
      >
        <header className="mb-section grid justify-items-start gap-tight">
          <Lettering text="Tonight" className="text-display" />
          <p className="label m-0 flex flex-wrap gap-x-snug text-pen-quiet">
            <span>{TONIGHT.label}</span>
            <EditionNumber value={MENU_NUMBER} label="Menu number" />
          </p>
        </header>
        <MenuCard leaveOut={leaveOut} />
      </DrawnBorder>
    </div>
  )
}
