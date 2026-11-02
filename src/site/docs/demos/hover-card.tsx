import type { ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/fineliner/ui/hover-card"
import {
  CONDITION_LABEL,
  RELEASES,
  STATUS_LABEL,
  kroner,
  type Release,
} from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Hover card",
  description:
    "A preview that appears while a link is hovered or focused, so a reader can glance at a record or a person without leaving the page.",
  item: "hover-card",
  group: "Overlays",
}

type Side = "top" | "bottom" | "inline-start" | "inline-end"

const find = (title: string) => RELEASES.find((r) => r.title === title)!

/** A record's title that previews its sleeve, pressing, condition and price. */
function Record({
  item,
  side,
  children,
}: {
  item: Release
  side?: Side
  children?: ReactNode
}) {
  return (
    <HoverCard>
      <HoverCardTrigger href={`#${item.id}`}>
        {children ?? item.title}
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-auto max-w-[20rem]">
        <div className="flex gap-snug">
          <Drawing
            object="record"
            seed={item.id}
            title=""
            className="w-16 shrink-0 self-start"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="m-0 font-read text-ui leading-ui font-medium">
              {item.title}
            </p>
            <p className="m-0 text-pen-quiet">
              {item.artist} · {item.label}, {item.year}
            </p>
            <p className="m-0 mt-hair font-type text-pen-quiet">
              {item.id} · {item.format} ·{" "}
              <abbr
                title={CONDITION_LABEL[item.condition]}
                className="no-underline"
              >
                {item.condition}
              </abbr>
            </p>
            <p className="m-0 font-type">
              {kroner(item.price)} · {STATUS_LABEL[item.status]}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

/** A regular's name that previews who they are and what they are waiting for. */
function Person({ name, about }: { name: string; about: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger href={`#${name.toLowerCase().replace(" ", "-")}`}>
        {name}
      </HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-[17rem]">
        <div className="flex items-start gap-tight">
          <Drawing
            object="portrait"
            seed={name}
            title=""
            className="w-12 shrink-0"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="m-0 font-read text-ui leading-ui font-medium">
              {name}
            </p>
            <p className="m-0 text-pen-quiet">{about}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function HoverCardDemo() {
  return (
    <>
      <DemoSection title="Hover or focus a link">
        <StateRow label="In a note">
          <p className="m-0 max-w-measure text-body leading-body">
            On Thursday 12 November{" "}
            <Person
              name="Jonas Berg"
              about="Hosts the evening of 12 November; Paper Moons is held for him"
            />{" "}
            plays <Record item={find("Harbour Lights")} /> by the Ellen Moe
            Trio, both sides, then{" "}
            <Record item={find("Music for Waiting Rooms")} /> while the wine
            goes round.{" "}
            <Person
              name="Maya Singh"
              about="A regular since 2019; she is coming in this Thursday"
            />{" "}
            has asked us to keep <Record item={find("Neon Orchard")} /> until
            then.
          </p>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sides">
        <StateRow label="Above">
          <Record item={find("Low Tide Dub")} side="top" />
        </StateRow>
        <StateRow label="Inline end">
          <Record item={find("Field Hum")} side="inline-end" />
        </StateRow>
        <StateRow label="Long title">
          <Record item={find("Studies in Blue Light")}>
            Studies in Blue Light, the white-label promo from Archive Sound
          </Record>
        </StateRow>
      </DemoSection>
    </>
  )
}
