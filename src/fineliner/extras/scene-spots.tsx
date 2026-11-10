"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { cn } from "@/fineliner/lib/utils"
import type { Region } from "@/fineliner/pen/layers"
import {
  sceneRegions,
  type SceneFormat,
  type SceneName,
} from "@/fineliner/pen/scenes"
import type { HandName } from "@/fineliner/pen/stroke"

// A scene with operable places. It draws the scene and, over it, one SceneSpot per named region, positioned in
// percentages from sceneRegions() when it renders (on the server too), so nothing in the browser measures. A spot is a
// real button or link: it takes the kit's trigger parts through their `render` prop
// (<PopoverTrigger render={<SceneSpot region="lamp" label="Light" />} />), carries a visible label in the label voice,
// is at least 44 px on a coarse pointer, and on hover and focus the pen rings the object. Spots follow in DOM order.

export interface SceneRegions {
  size: [number, number]
  regions: Record<string, Region>
}

const Spots = createContext<SceneRegions | null>(null)

export interface SceneSpotsProps extends Omit<ComponentProps<"div">, "title"> {
  scene: SceneName
  seed: string
  format?: SceneFormat
  /** The hand the regions are measured in; the page's hand moves them by a few units at most. */
  hand?: HandName
  title?: string
  drawOnView?: boolean
  /** sceneRegions() computed ahead (on the server), so hydrating a page does not compose the scene again. */
  regions?: SceneRegions
  /** SceneSpot elements, or triggers rendering them. */
  children?: ReactNode
}

/** A scene drawing with SceneSpots over it. */
export function SceneSpots({
  scene,
  seed,
  format,
  hand = "lively",
  title,
  drawOnView,
  regions,
  className,
  children,
  ...props
}: SceneSpotsProps) {
  const value = useMemo(
    () => regions ?? sceneRegions({ scene, format, seed, hand }),
    [regions, scene, format, seed, hand],
  )
  return (
    <div
      data-slot="scene-spots"
      className={cn("relative", className)}
      {...props}
    >
      <Drawing
        scene={scene}
        format={format}
        seed={seed}
        title={title}
        drawOnView={drawOnView}
        className="[&>svg]:h-auto [&>svg]:w-full"
      />
      <Spots.Provider value={value}>{children}</Spots.Provider>
    </div>
  )
}

/** Where a region sits in its scene, in percentages of the drawing. */
function placeOf(spots: SceneRegions | null, region: string) {
  const found = spots?.regions[region]
  if (!spots || !found) return undefined
  const [W, H] = spots.size
  const [x0, y0, x1, y1] = found.box
  return {
    left: `${((x0 / W) * 100).toFixed(2)}%`,
    top: `${((y0 / H) * 100).toFixed(2)}%`,
    width: `${(((x1 - x0) / W) * 100).toFixed(2)}%`,
    height: `${(((y1 - y0) / H) * 100).toFixed(2)}%`,
  }
}

/** Words or anything else laid over a region, not operable: the name on a sign's board. */
export function SceneLabel({
  region,
  className,
  style,
  ...props
}: ComponentProps<"span"> & { region: string }) {
  const place = placeOf(useContext(Spots), region)
  if (!place) return null
  return (
    <span
      data-slot="scene-label"
      data-region={region}
      className={cn(
        "pointer-events-none absolute flex items-center justify-center",
        className,
      )}
      style={{ ...place, ...style }}
      {...props}
    />
  )
}

export interface SceneSpotProps extends ComponentProps<"button"> {
  /** The key the scene put the object under. */
  region: string
  /** The visible label, in the label voice. */
  label: string
  /** Makes the spot a link. */
  href?: string
}

/** A button (or link) over one object in a SceneSpots scene. */
export function SceneSpot({
  region,
  label,
  href,
  className,
  style,
  ...props
}: SceneSpotProps) {
  const found = placeOf(useContext(Spots), region)
  if (!found) return null
  const place = { ...found, ...style }
  const inside = (
    <>
      <span
        aria-hidden="true"
        data-slot="scene-spot-ring"
        className="pointer-events-none absolute -inset-[8%] rounded-[50%] border-(length:--pen-weight-pressed) border-pen opacity-0 transition-opacity duration-150 [filter:var(--wob,var(--wob-3))] group-hover/spot:opacity-100 group-focus-visible/spot:opacity-100 forced-colors:border-[Highlight]"
      />
      <span
        data-slot="scene-spot-label"
        className="label absolute bottom-full left-1/2 mb-1 -translate-x-1/2 bg-paper px-hair whitespace-nowrap text-pen"
      >
        {label}
      </span>
    </>
  )
  const spot = cn(
    "group/spot absolute flex min-h-6 min-w-6 cursor-pointer items-end justify-center rounded-[50%] text-pen no-underline outline-none pointer-coarse:min-h-11 pointer-coarse:min-w-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen",
    className,
  )
  if (href)
    return (
      <a
        href={href}
        data-slot="scene-spot"
        data-region={region}
        className={spot}
        style={place}
      >
        {inside}
      </a>
    )
  return (
    <button
      type="button"
      {...props}
      data-slot="scene-spot"
      data-region={region}
      className={spot}
      style={place}
    >
      {inside}
    </button>
  )
}
