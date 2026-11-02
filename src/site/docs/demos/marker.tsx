import { CalendarCheckIcon, PaperclipIcon, UserPlusIcon } from "lucide-react"
import { Marker, MarkerContent, MarkerIcon } from "@/fineliner/ui/marker"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Marker",
  description:
    "A line in a thread that is not a message: the day, where unread messages begin, or something that happened.",
  item: "marker",
  group: "Conversation",
}

function Line({ children }: { children: string }) {
  return (
    <p className="m-0 max-w-measure font-read text-body leading-lead">
      {children}
    </p>
  )
}

export default function MarkerDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="Separator">
          <Marker variant="separator" className="max-w-[34rem]">
            <MarkerContent>Monday 2 November</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Unread">
          <Marker
            variant="separator"
            className="max-w-[34rem] text-pen [--pen-weight:var(--pen-weight-pressed)]"
          >
            <MarkerContent>New</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Event">
          <Marker>
            <MarkerIcon>
              <PaperclipIcon />
            </MarkerIcon>
            <MarkerContent>
              Maya Singh attached neon-orchard-sleeve.jpg
            </MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Border">
          <Marker variant="border" className="max-w-[34rem]">
            <MarkerContent>Last week</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="With a link">
          <Marker>
            <MarkerIcon>
              <UserPlusIcon />
            </MarkerIcon>
            <MarkerContent>
              Ama Owusu joined from{" "}
              <a href="#thursday-list">the Thursday list</a>
            </MarkerContent>
          </Marker>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a thread">
        <div className="flex max-w-[38rem] flex-col gap-tight">
          <Marker variant="separator">
            <MarkerContent>Monday 2 November</MarkerContent>
          </Marker>
          <Line>
            Could you keep Neon Orchard for me until Thursday? I&rsquo;d like to
            hear it in the room before I buy it.
          </Line>
          <Marker>
            <MarkerIcon>
              <CalendarCheckIcon />
            </MarkerIcon>
            <MarkerContent>
              Lars Holm booked room 1 · Thursday 5 November, 16:00
            </MarkerContent>
          </Marker>
          <Marker
            variant="separator"
            className="text-pen [--pen-weight:var(--pen-weight-pressed)]"
          >
            <MarkerContent>New</MarkerContent>
          </Marker>
          <Line>
            It&rsquo;s held for you, and the room is yours from four. See you
            Thursday.
          </Line>
        </div>
      </DemoSection>
    </>
  )
}
