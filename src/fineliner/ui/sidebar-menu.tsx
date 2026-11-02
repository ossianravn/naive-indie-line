"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { seedOf } from "@/fineliner/pen/seed"
import { cn } from "@/fineliner/lib/utils"

import { Skeleton } from "@/fineliner/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/fineliner/ui/tooltip"
import { useSidebar } from "@/fineliner/ui/sidebar-provider"

// The sidebar's menu. Rows read in the reading voice at control size. The current row sits in a tint pocket with its
// words in medium weight; a row under the pointer takes the same pocket (a paler one vanished into the paper's
// tooth). The outline variant is a drawn frame whose pen presses harder instead. Counts are typed; submenus hang off a
// quiet pen line under the parent's icon. Rows clip what overflows them (the icon rail hides their words) with a
// margin, so a pocket's wobble and a frame's overshoot still show. Split from sidebar.tsx to keep each file small;
// import everything from "@/fineliner/ui/sidebar".

// A tint pocket under the pointer and behind the current row, whose words also take medium weight.
const rowPocket =
  "pocket hover:before:bg-tint data-active:before:bg-tint data-active:font-medium"

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "m-0 flex w-full min-w-0 list-none flex-col gap-0 p-0",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full cursor-pointer items-center gap-2 overflow-clip px-2.5 text-left font-ui text-pen no-underline [overflow-clip-margin:6px] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-control-compact! group-data-[collapsible=icon]:p-2.5! disabled:pointer-events-none disabled:text-pen-faint aria-disabled:pointer-events-none aria-disabled:text-pen-faint [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: cn(rowPocket, "data-open:hover:before:bg-tint"),
        outline:
          "frame hover:[--pen-weight:var(--pen-weight-pressed)] data-active:font-medium data-active:[--pen-weight:var(--pen-weight-pressed)]",
      },
      size: {
        default: "h-control-compact text-ui leading-ui",
        sm: "h-7 text-small leading-small",
        lg: "h-12 px-0.5 text-ui leading-ui group-data-[collapsible=icon]:p-0.5!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "pocket absolute top-2 right-1 flex aspect-square w-5 cursor-pointer items-center justify-center p-0 text-pen-quiet group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-pen peer-data-[size=default]/menu-button:top-2 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:text-pen hover:before:bg-tint md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-pen aria-expanded:opacity-100 md:opacity-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute top-2 right-1 flex h-5 min-w-5 items-center justify-center px-1 font-type text-small leading-none text-pen-quiet tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-pen peer-data-[size=default]/menu-button:top-2 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-pen",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // A width between 50 and 90 %, seeded by the row's place in the tree, so server and browser agree.
  const id = React.useId()
  const width = `${50 + (seedOf(id) % 41)}%`

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-control-compact items-center gap-2 px-2.5",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton className="size-4" data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className="h-3.5 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "relative my-0 ms-4.5 me-2 flex min-w-0 list-none flex-col gap-0 py-0.5 ps-2.5 text-pen-faint group-data-[collapsible=icon]:hidden",
        "before:absolute before:inset-y-0 before:start-0 before:w-3 before:-translate-x-1/2 before:bg-[linear-gradient(currentColor,currentColor)] before:bg-size-[var(--pen-weight)_100%] before:bg-center before:bg-no-repeat before:[filter:var(--wob,var(--wob-3))] rtl:before:translate-x-1/2",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          rowPocket,
          "flex h-8 min-w-0 cursor-pointer items-center gap-2 overflow-clip px-2 font-ui text-pen no-underline [overflow-clip-margin:6px] group-data-[collapsible=icon]:hidden data-[size=md]:text-ui data-[size=sm]:text-small disabled:pointer-events-none disabled:text-pen-faint aria-disabled:pointer-events-none aria-disabled:text-pen-faint [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-pen-quiet",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
}
