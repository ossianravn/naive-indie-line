import type { ReactNode } from "react"
import { drawing } from "@/fineliner/pen"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/fineliner/ui/attachment"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/fineliner/ui/trace"

// The message scroller demo's conversation: Maya Singh asks Listening Room to hold a record and book the room, the
// shop's assistant answers, and Lars Holm at the counter takes over. Monday 2 November 2026.

export type Note =
  | {
      id: string
      kind: "marker"
      text: string
      unread?: boolean
      event?: boolean
    }
  | {
      id: string
      kind: "note"
      from: "maya" | "shop" | "lars"
      time: string
      body: ReactNode
    }

export const PEOPLE = {
  maya: { name: "Maya Singh", initials: "MS", portrait: true },
  shop: { name: "Listening Room", initials: "LR", portrait: false },
  lars: { name: "Lars Holm", initials: "LH", portrait: true },
}

const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  drawing({ object: "record", seed: "Neon Orchard sleeve" })[0]!
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(
      /(<svg[^>]*>)/,
      '$1<style>.ln{fill:none;stroke:#1d2840;stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}.ink{fill:#1d2840}.wash,.sheet-fill{fill:#e9dcc0}</style><rect x="-40" y="-40" width="200" height="200" fill="#d9b9a9"/>',
    ),
)}`

const sleeve = (
  <Attachment size="sm">
    <AttachmentMedia variant="image">
      <img src={PHOTO} alt="" />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>neon-orchard-sleeve.jpg</AttachmentTitle>
      <AttachmentDescription>Photo · 1.8 MB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
)

const checked = (
  <Trace>
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status="done">
          <TraceIcon>4</TraceIcon>
          <TraceTitle>Checked in four steps</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        Read the message, found Neon Orchard (LR-0414), checked its hold, then
        looked at room 1 on Thursday.
      </TraceCollapsibleContent>
    </TraceCollapsible>
  </Trace>
)

export const THREAD: Note[] = [
  { id: "day", kind: "marker", text: "Monday 2 November" },
  {
    id: "n1",
    kind: "note",
    from: "maya",
    time: "14:05",
    body: "Could you keep Neon Orchard for me until Thursday? I’d like to hear it in the listening room before I buy it.",
  },
  { id: "n2", kind: "note", from: "maya", time: "14:05", body: sleeve },
  {
    id: "n3",
    kind: "note",
    from: "shop",
    time: "14:06",
    body: (
      <>
        {checked}
        Neon Orchard is already held for you until closing on Thursday. Room 1
        is free at 16:00 on Thursday 5 November. Shall I book it for an hour?
      </>
    ),
  },
  {
    id: "n4",
    kind: "note",
    from: "maya",
    time: "14:08",
    body: "Yes please. Can Ama come too?",
  },
  { id: "joined", kind: "marker", text: "Lars Holm joined", event: true },
  {
    id: "n5",
    kind: "note",
    from: "lars",
    time: "14:12",
    body: "Hi Maya, Lars here. The sofa seats three, so bring Ama. I’ll put Rain on Tin by the platter for her.",
  },
  { id: "new", kind: "marker", text: "New", unread: true },
  {
    id: "n6",
    kind: "note",
    from: "maya",
    time: "14:14",
    body: "Perfect, thank you.",
  },
]

export const LATER: Note[] = [
  {
    id: "n7",
    kind: "note",
    from: "lars",
    time: "14:15",
    body: "Booked: room 1, Thursday 5 November, 16:00 to 17:00, for two.",
  },
  {
    id: "n8",
    kind: "note",
    from: "maya",
    time: "14:16",
    body: "See you on Thursday.",
  },
]
