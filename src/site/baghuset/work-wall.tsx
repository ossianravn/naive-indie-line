"use client"

// The top floor's pin-up: six sheets on the wall and a toggle group that takes every sheet of another kind off it
// (their pins and tape stay). Each sheet opens its case. At the foot, the way into the archive in the plan chest.
import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { CaseSheet } from "./case-sheet"
import { KINDS, WORK, type Kind } from "./data"

export function WorkWall() {
  const [shown, setShown] = useState<Kind | "All">("All")
  return (
    <div className="grid gap-y-section">
      <ToggleGroup
        aria-label="Show work"
        variant="outline"
        spacing={0}
        value={[shown]}
        onValueChange={(next: unknown[]) =>
          next[0] && setShown(next[0] as Kind | "All")
        }
        className="justify-self-start"
      >
        {(["All", ...KINDS] as const).map((kind) => (
          <ToggleGroupItem key={kind} value={kind}>
            {kind}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-snug gap-y-section p-0 sm:gap-x-line lg:grid-cols-3">
        {WORK.map((work) => (
          <li key={work.id} className="grid">
            <CaseSheet
              work={work}
              away={shown !== "All" && !work.kinds.includes(shown)}
            />
          </li>
        ))}
      </ul>
      <p className="m-0">
        <a href="#archive">Older work, in the plan chest</a>
      </p>
    </div>
  )
}
