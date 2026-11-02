import {
  BookmarkIcon,
  HeadphonesIcon,
  ListPlusIcon,
  ShareIcon,
} from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import { Kbd } from "@/fineliner/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/fineliner/ui/tooltip"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tooltip",
  description:
    "A slip of ink that names a control, or defines a term, while it is hovered or focused.",
  item: "tooltip",
  group: "Overlays",
}

const SIDES = [
  { side: "top", label: "Hold for a week", icon: BookmarkIcon },
  { side: "right", label: "Play in the room", icon: HeadphonesIcon },
  { side: "bottom", label: "Add to a list", icon: ListPlusIcon },
  { side: "left", label: "Share", icon: ShareIcon },
] as const

export default function TooltipDemo() {
  return (
    <>
      <DemoSection title="Open">
        <StateRow label="Default open">
          <Tooltip defaultOpen>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Play in the room"
                />
              }
            >
              <HeadphonesIcon />
            </TooltipTrigger>
            <TooltipContent side="right">Play in the room</TooltipContent>
          </Tooltip>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sides">
        <StateRow label="Hover or focus">
          {SIDES.map(({ side, label, icon: Icon }) => (
            <Tooltip key={side}>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label={label} />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent side={side}>{label}</TooltipContent>
            </Tooltip>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Content">
        <StateRow label="With shortcut">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>
              Hold
            </TooltipTrigger>
            <TooltipContent>
              Hold for a week <Kbd>H</Kbd>
            </TooltipContent>
          </Tooltip>
        </StateRow>
        <StateRow label="On a term">
          <p className="m-0 max-w-measure">
            Every record is graded on the{" "}
            <Tooltip>
              <TooltipTrigger render={<span tabIndex={0} />} className="term">
                Goldmine scale
              </TooltipTrigger>
              <TooltipContent>
                Mint, Near Mint, Very Good Plus, and so down to Poor
              </TooltipContent>
            </Tooltip>{" "}
            before it goes into a crate.
          </p>
        </StateRow>
        <StateRow label="Long label">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Late listening
            </TooltipTrigger>
            <TooltipContent>
              Thursdays after nine. Bring headphones if you want the turntable
              to yourself
            </TooltipContent>
          </Tooltip>
        </StateRow>
        <StateRow label="On the main action">
          <Tooltip>
            <TooltipTrigger render={<Button />}>Book session</TooltipTrigger>
            <TooltipContent side="bottom">Thu 5 Nov · 19:00</TooltipContent>
          </Tooltip>
        </StateRow>
      </DemoSection>
    </>
  )
}
