"use client"

// The studio floor's room: its wall above the strip, and the tools on the table as the room's own appearance
// controls, writing the same saved look as the panel: the pen pot picks the pen, the paper stack the stock, the lamp
// switches day and night. Each has a second way in the appearance panel at the top of the page.
import { useId, type ReactNode } from "react"
import { appearanceLabels } from "@/fineliner/extras/appearance-control"
import { PenControl } from "@/fineliner/extras/appearance-pen"
import { RoomSection } from "@/fineliner/extras/room-section"
import { SceneSpot, type SceneRegions } from "@/fineliner/extras/scene-spots"
import { APPEARANCE, type Stock } from "@/fineliner/theme"
import { useAppearance } from "@/fineliner/theme"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/fineliner/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { BAGHUSET_STORAGE_KEY, baghusetAppearance } from "./appearance"

export function StudioRoom({
  regions,
  children,
}: {
  regions: SceneRegions
  children?: ReactNode
}) {
  const [appearance, update] = useAppearance(
    baghusetAppearance,
    BAGHUSET_STORAGE_KEY,
  )
  const penTitle = useId()
  const night = () =>
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "night"
  return (
    <RoomSection
      id="studio"
      aria-labelledby="studio-title"
      scene="baghuset-studio"
      format="strip"
      seed="baghuset"
      side="both"
      regions={regions}
      spots={
        <>
          <Popover>
            <PopoverTrigger render={<SceneSpot region="pot" label="Pen" />} />
            <PopoverContent className="w-auto">
              <PopoverHeader>
                <PopoverTitle id={penTitle}>Pen</PopoverTitle>
              </PopoverHeader>
              <PenControl
                appearance={appearance}
                update={update}
                names={appearanceLabels.pen.options}
                labelledBy={penTitle}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              render={<SceneSpot region="paper" label="Paper" />}
            />
            <PopoverContent className="w-auto">
              <PopoverHeader>
                <PopoverTitle>Paper</PopoverTitle>
              </PopoverHeader>
              <ToggleGroup
                aria-label="Paper"
                variant="outline"
                spacing={0}
                value={[appearance.stock]}
                onValueChange={(next: unknown[]) =>
                  next[0] && update({ stock: next[0] as Stock })
                }
              >
                {APPEARANCE.stock.map((stock) => (
                  <ToggleGroupItem key={stock} value={stock}>
                    {appearanceLabels.stock.options[stock]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </PopoverContent>
          </Popover>
          <SceneSpot
            region="lamp"
            label="Light"
            aria-pressed={appearance.theme === "night"}
            onClick={() => update({ theme: night() ? "day" : "night" })}
          />
        </>
      }
    >
      {children}
    </RoomSection>
  )
}
