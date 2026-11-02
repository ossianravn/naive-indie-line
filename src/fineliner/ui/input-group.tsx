"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/fineliner/lib/utils"

import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { Textarea } from "@/fineliner/ui/textarea"

// One steady field line shared by an input or textarea and its addons. The group takes the pen line, the page's
// dashed focus ring, the correction pen's underline when invalid and the dashed line when disabled; the inner control
// gives its own line up. Addons speak in the typewriter, quietly: units, prefixes, counts. Icons sit at 16px.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group control-field relative flex h-control w-full min-w-0 items-center",
        "has-[[data-slot=input-group-control]:focus-visible]:outline-[1.5px] has-[[data-slot=input-group-control]:focus-visible]:outline-offset-4 has-[[data-slot=input-group-control]:focus-visible]:outline-pen has-[[data-slot=input-group-control]:focus-visible]:outline-dashed",
        "has-[[data-slot][aria-invalid=true]]:border-correction has-[[data-slot][aria-invalid=true]]:shadow-[inset_0_-1.5px_0_var(--correction)]",
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:border-dashed has-[[data-slot=input-group-control]:disabled]:text-pen-faint has-[[data-slot=input-group-control]:disabled]:hover:shadow-none",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:[&>input]:pt-tight has-[>[data-align=block-start]]:[&>input]:pb-tight has-[>[data-align=inline-end]]:[&>input]:pr-hair has-[>[data-align=inline-start]]:[&>input]:pl-hair",
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-hair py-hair font-type text-small leading-small text-pen-quiet select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:text-pen-faint [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-tight has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-tight has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-tight pt-tight [.border-b]:border-input/30 [.border-b]:pb-hair",
        "block-end":
          "order-last w-full justify-start px-tight pb-tight [.border-t]:border-input/30 [.border-t]:pt-hair",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-hair", {
  variants: {
    size: {
      xs: "h-7 gap-1 px-hair [&>svg:not([class*='size-'])]:size-3.5",
      sm: "px-tight",
      "icon-xs": "size-7 p-0 has-[>svg]:p-0",
      "icon-sm": "size-control-compact p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
})

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-hair font-type text-small leading-small text-pen-quiet [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

// The inner control keeps its caret, placeholder and value but hands its line, ring and states to the group.
const bare =
  "flex-1 rounded-none border-0! bg-transparent! shadow-none! focus-visible:outline-none"

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(bare, "h-full", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(bare, "resize-none py-tight", className)}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
