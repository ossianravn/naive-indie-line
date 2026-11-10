import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import {
  SCENES,
  sceneIn,
  type SceneFormat,
  type SceneName,
} from "@/fineliner/pen/scenes"
import { seedOf } from "@/fineliner/pen/seed"
import { SceneSpots, type SceneRegions } from "./scene-spots"

// A page section with a room in it: its children on the wall, then a scene strip along its floor. The strip is cropped
// from the centre on a narrow container (as wide as the section, or --strip-min, whichever is wider, the section
// clipping its sides), so one drawing serves every width; it is drawn on the first time it is seen. With `spots` the
// strip is a SceneSpots layer. `side` draws the section's outer wall on one edge or both, so stacked sections read as
// storeys of one building. This is the open room for any section. A strip is hundreds of long paths, so one out of
// view is not styled, laid out or painted (content-visibility), its box held at the scene's aspect ratio meanwhile;
// it stays in the server's HTML, readable and focusable.

export interface RoomSectionProps extends ComponentProps<"section"> {
  scene: SceneName
  seed: string
  /** strip (the default), or another open format the scene has. */
  format?: SceneFormat
  /** SceneSpot (or SceneLabel) elements over the strip. */
  spots?: ReactNode
  /** sceneRegions() computed ahead, passed to the spots layer. */
  regions?: SceneRegions
  /** The outer wall on the start edge, the end edge or both. */
  side?: "start" | "end" | "both"
  /** The scene's accessible name; "" leaves it decorative. */
  title?: string
  children?: ReactNode
}

/** A section whose floor is a drawn room: wall above, strip below. */
export function RoomSection({
  scene,
  seed,
  format = "strip",
  spots,
  regions,
  side,
  title,
  className,
  style,
  children,
  ...props
}: RoomSectionProps) {
  const wall = (edge: "start" | "end") => (
    <span
      aria-hidden="true"
      data-slot="room-section-wall"
      className={cn(
        "rule-y absolute inset-y-0",
        edge === "start" ? "start-0 sm:-start-1.5" : "end-0 sm:-end-1.5",
      )}
      style={frameVars(seedOf(`${seed}:${edge}`))}
    />
  )
  const known = SCENES[scene]
  const [w, h] = known ? sceneIn(known, format).size : [0, 0]
  return (
    <section
      data-slot="room-section"
      className={cn("relative grid", className)}
      style={{ "--strip-min": "44rem", ...style } as CSSProperties}
      {...props}
    >
      {side && side !== "end" ? wall("start") : null}
      {side && side !== "start" ? wall("end") : null}
      <div data-slot="room-section-wall-content">{children}</div>
      <div
        data-slot="room-section-strip"
        className="overflow-hidden [contain:paint]"
      >
        <div
          className={cn(
            "ms-[50%] w-[max(100%,var(--strip-min))] -translate-x-1/2 rtl:translate-x-1/2",
            known && "[content-visibility:auto]",
          )}
          style={known ? { aspectRatio: `${w} / ${h}` } : undefined}
        >
          {spots ? (
            <SceneSpots
              scene={scene}
              seed={seed}
              format={format}
              title={title}
              regions={regions}
              drawOnView
            >
              {spots}
            </SceneSpots>
          ) : (
            <Drawing
              scene={scene}
              format={format}
              seed={seed}
              title={title}
              drawOnView
              className="[&>svg]:h-auto [&>svg]:w-full"
            />
          )}
        </div>
      </div>
    </section>
  )
}
