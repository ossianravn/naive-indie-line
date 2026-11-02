"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/fineliner/ui/dialog"

// A sheet of paper drawn round by the pen for finding things by typing. The query sits on one pen rule, with no box;
// while it has focus the pen presses harder on the rule, and that is its focus mark (cmdk keeps focus in the query and
// moves the selection with the arrows). Results below: the selected row takes a pale pocket that wobbles with the
// frame, group headings speak in the label voice, shortcuts in the typewriter. Inside a dialog the dialog's sheet is
// the frame, so the command drops its own.
const TICK = penMark("tick", "command", "calm")

function Command({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "float-sheet frame flex size-full flex-col text-pen in-data-[slot=dialog-content]:bg-transparent in-data-[slot=dialog-content]:bg-none in-data-[slot=dialog-content]:before:hidden in-data-[slot=dialog-content]:after:hidden",
        className,
      )}
      style={frameStyle("command", style)}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run…",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "mt-[12vh] gap-0 p-0 sm:mt-[18vh] sm:max-w-lg sm:[--dialog-spacing:0]",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="relative flex h-control items-center gap-tight px-snug pt-1 text-pen-quiet has-[input:focus-visible]:[--pen-weight:var(--pen-weight-pressed)] has-[input:disabled]:text-pen-faint"
    >
      <SearchIcon className="size-4 shrink-0" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full w-full min-w-0 flex-1 bg-transparent font-ui text-ui text-pen outline-none placeholder:text-pen-quiet disabled:cursor-not-allowed disabled:text-pen-faint",
          className,
        )}
        {...props}
      />
      <span
        aria-hidden="true"
        className="rule pointer-events-none absolute inset-x-tight bottom-0 translate-y-1/2 text-pen"
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[18rem] scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain pt-tight pb-hair",
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "px-snug py-line text-center text-small leading-small text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-pen **:[[cmdk-group-heading]]:label **:[[cmdk-group-heading]]:px-snug **:[[cmdk-group-heading]]:pt-hair **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        "rule pointer-events-none mx-snug my-1 text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item flex cursor-default items-center gap-tight px-snug py-hair text-ui leading-ui text-pen outline-hidden select-none pocket data-[disabled=true]:pointer-events-none data-[disabled=true]:text-pen-faint data-[selected=true]:before:bg-tint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-pen-quiet",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="put-down ml-auto hidden size-[1.15rem] -translate-y-[10%] group-has-data-[slot=command-shortcut]/command-item:hidden! group-data-[checked=true]/command-item:block [&>svg]:size-full!"
        dangerouslySetInnerHTML={{ __html: TICK }}
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto pl-snug font-type text-small leading-none text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
