import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

import { Separator } from "@/fineliner/ui/separator"

// Buttons joined into one control, like the segmented control. Outline buttons give their own frames up to one
// drawn frame round the group; each member after the first is divided from the one before by a short pen stroke, and
// a member pressed or hovered takes a pale pocket inset from the frame. A group that holds a field (an input or a
// select trigger) shares the field's steady line instead, divided by steady strokes, and the page's dashed ring moves
// to the group while the field has focus. Groups of groups sit apart; pocket buttons keep their pockets and take a
// ButtonGroupSeparator between them. ButtonGroupText is a typewriter cell in the same line.
const buttonGroupVariants = cva(
  cn(
    "group/button-group flex w-fit items-stretch text-pen *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-tight [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    // One line round the group: drawn round buttons, steady round a field.
    "has-[>.frame,>.control-field]:[--divider-wob:var(--wob-5)] has-[>.control-field]:control-field has-[>.control-field]:[--divider-wob:none] not-has-[>.control-field]:has-[>.frame]:frame",
    "has-[>.control-field:focus-visible]:outline-[1.5px] has-[>.control-field:focus-visible]:outline-offset-4 has-[>.control-field:focus-visible]:outline-pen has-[>.control-field:focus-visible]:outline-dashed has-[>[aria-invalid=true]]:border-correction has-[>[aria-invalid=true]]:shadow-[inset_0_-1.5px_0_var(--correction)]",
    // Members give up their own lines: a field its border and ring, a framed button its frame, which becomes a pale
    // pocket under the pointer; a pocket button's pocket steps in from the shared line.
    "has-[>.frame,>.control-field]:[&>*]:relative has-[>.control-field]:[&>*]:-my-(--pen-weight) [&>.control-field]:rounded-none [&>.control-field]:border-0 [&>.control-field]:bg-transparent [&>.control-field]:shadow-none! [&>.control-field]:focus-visible:outline-none",
    "has-[>.frame,>.control-field]:[&>.frame]:before:inset-[3px] has-[>.frame,>.control-field]:[&>.frame]:before:border-0 has-[>.frame,>.control-field]:[&>.frame]:after:border-0 has-[>.frame,>.control-field]:[&>.frame:hover]:before:bg-tint has-[>.frame,>.control-field]:[&>.frame[aria-expanded=true]]:before:bg-tint has-[>.frame,>.control-field]:[&>.pocket]:before:inset-[3px]",
    // The divider: a short stroke on the leading edge of every member but the first, centred on the seam.
    "has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:pointer-events-none has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:absolute has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:border-0 has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bg-[linear-gradient(currentColor,currentColor)] has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bg-center has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bg-no-repeat has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:[filter:var(--divider-wob)]",
  ),
  {
    variants: {
      orientation: {
        horizontal:
          "has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:inset-y-0 has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:right-auto has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:left-[-3px] has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:w-1.5 has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bg-size-[var(--pen-weight)_100%]",
        vertical:
          "flex-col has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:inset-x-0 has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:top-[-3px] has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bottom-auto has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:h-1.5 has-[>.frame,>.control-field]:[&>*:not(:first-child)]:after:bg-size-[100%_var(--pen-weight)]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
)

function ButtonGroup({
  className,
  orientation,
  style,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      style={frameStyle(props["aria-label"], style)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-hair px-tight font-type text-small leading-small text-pen-quiet [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

// A pen line between two members that have no line of their own (pocket buttons). It takes no room: it sits on the
// seam, over the pockets, and lets the pointer through.
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "pointer-events-none relative z-10 self-stretch text-pen-quiet data-[orientation=horizontal]:-my-1.5 data-[orientation=horizontal]:w-auto data-[orientation=vertical]:-mx-1.5 data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
