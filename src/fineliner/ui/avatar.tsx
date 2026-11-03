"use client"

import "@/fineliner/pen/objects/people"
import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { Drawing } from "@/fineliner/drawing/drawing"
import { cn } from "@/fineliner/lib/utils"

// A picture in a drawn circle: a round pen line bent by the wobble filter, drawn over the picture's edge. Give the
// fallback a `name` and it becomes a portrait from the drawing library seeded by that name, so the same person is
// drawn the same way everywhere; the children stay as its accessible text. Without a name, the children (initials)
// sit in the circle in serif italic.
const ring =
  "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-full after:border-(length:--pen-weight) after:border-current after:[filter:var(--wob,var(--wob-1))]"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative isolate flex size-8 shrink-0 rounded-full text-pen select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        ring,
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  name,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props & {
  /** Draws a portrait seeded by this name; the children stay as the accessible text. */
  name?: string
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-portrait={name ? "" : undefined}
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden rounded-full bg-paper font-read text-small leading-none text-pen italic group-data-[size=lg]/avatar:text-ui group-data-[size=sm]/avatar:text-[0.7rem]",
        className,
      )}
      {...props}
    >
      {name ? (
        <>
          <Drawing
            object="portrait"
            seed={name}
            title={children ? "" : name}
            className="pointer-events-none absolute top-[-14%] left-[-25%] w-[150%]"
          />
          {children ? <span className="sr-only">{children}</span> : null}
        </>
      ) : (
        children
      )}
    </AvatarPrimitive.Fallback>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-20 inline-flex items-center justify-center rounded-full bg-pen text-paper shadow-[0_0_0_2px_var(--paper)] select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:bg-paper",
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative isolate flex size-8 shrink-0 items-center justify-center rounded-full bg-tint font-type text-label text-pen group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        ring,
        className,
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
