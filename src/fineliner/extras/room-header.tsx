"use client"

import type { ComponentProps, ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { cn } from "@/fineliner/lib/utils"
import type { FaceName } from "@/fineliner/pen/lettering-svg"
import type { SceneName } from "@/fineliner/pen/scenes"
import type { HandName } from "@/fineliner/pen/stroke"

// A page head: a scene drawn by the pen with the title lettered beside or under it, a kicker in the label voice above
// the title and an optional line under it. The scene is drawn on, stroke by stroke, the first time the header comes
// into view, and after that boils with the page's line boil setting. The title is lettered word by word so it wraps
// like text; the heading carries the words for screen readers and the lettering is decorative. Beside stacks under a
// container 44rem wide.

export interface RoomHeaderProps extends Omit<
  ComponentProps<"header">,
  "title"
> {
  /** The page's title, lettered by the pen and read as the heading. */
  title: string
  /** A line in the label voice above the title: the section, the date, the issue. */
  kicker?: ReactNode
  /** room (a listening room), studio (a freelancer's desk) or bistro (a table for two). */
  scene?: SceneName
  /** The lettering face: liner, stilt, ribbon or tramline. */
  face?: FaceName
  /** beside: title and scene side by side on wide containers. under: the scene above, the title centred under it. */
  layout?: "beside" | "under"
  /** The heading's level. */
  level?: 1 | 2
  /** Same seed, same scene and letters. Defaults to the title. */
  seed?: string | number
  hand?: HandName
  /** Names the scene for screen readers; it is decorative by default, since the heading says what the page is. */
  sceneTitle?: string
  /** A line or two under the title, in the reading voice. */
  children?: ReactNode
}

/** A page head with a drawn scene and a lettered title. */
export function RoomHeader({
  title,
  kicker,
  scene = "room",
  face = "liner",
  layout = "beside",
  level = 1,
  seed,
  hand,
  sceneTitle = "",
  className,
  children,
  ...props
}: RoomHeaderProps) {
  const key = String(seed ?? title)
  const Heading = level === 1 ? "h1" : "h2"
  const under = layout === "under"
  const words = title.split(/\s+/).filter(Boolean)

  return (
    <header
      data-slot="room-header"
      data-layout={layout}
      data-scene={scene}
      className={cn("@container/room-header text-pen", className)}
      {...props}
    >
      <div
        className={cn(
          "grid items-end gap-x-section gap-y-line",
          under
            ? "justify-items-center text-center"
            : "@min-[44rem]/room-header:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
        )}
      >
        <div
          data-slot="room-header-text"
          className={cn(
            "flex min-w-0 flex-col gap-tight",
            under ? "order-last items-center" : "items-start",
          )}
        >
          {kicker && (
            <p
              data-slot="room-header-kicker"
              className="label m-0 text-pen-quiet"
            >
              {kicker}
            </p>
          )}
          <Heading
            data-slot="room-header-title"
            className={cn(
              "m-0 flex flex-wrap items-end gap-x-[0.18em] gap-y-0 text-[length:var(--letter-size)] [--letter-size:clamp(2.5rem,9cqi,4.25rem)]",
              under
                ? "justify-center [--letter-size:clamp(2.5rem,8cqi,4.5rem)]"
                : "@min-[44rem]/room-header:[--letter-size:clamp(2.5rem,5.4cqi,4.75rem)]",
            )}
          >
            <span className="sr-only">{title}</span>
            {words.map((word, i) => (
              <Lettering
                key={`${i}-${word}`}
                aria-hidden="true"
                text={word}
                face={face}
                seed={`${key}:${i}`}
                hand={hand}
                className="h-(--letter-size) shrink-0 [&>svg]:h-full [&>svg]:w-auto"
              />
            ))}
          </Heading>
          {children && (
            <div
              data-slot="room-header-description"
              className="max-w-measure text-body leading-body text-pen sm:text-lead sm:leading-lead [&>p]:m-0"
            >
              {children}
            </div>
          )}
        </div>
        <Drawing
          scene={scene}
          seed={key}
          hand={hand}
          title={sceneTitle}
          drawOnView
          className={cn("w-full", under ? "max-w-[32rem]" : "max-w-[40rem]")}
        />
      </div>
    </header>
  )
}
