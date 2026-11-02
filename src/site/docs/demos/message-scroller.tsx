import { useState } from "react"
import { UserPlusIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Bubble, BubbleContent } from "@/fineliner/ui/bubble"
import { Button } from "@/fineliner/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/fineliner/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/fineliner/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/fineliner/ui/message-scroller"
import { DemoSection, type DemoMeta } from "../demo-kit"
import { LATER, PEOPLE, THREAD, type Note } from "./message-scroller/thread"

export const meta: DemoMeta = {
  title: "Message scroller",
  description:
    "The scrolling column of a conversation: it keeps the latest message in view and offers a way back when you read up.",
  item: "message-scroller",
  group: "Conversation",
}

function Row({ note }: { note: Note }) {
  if (note.kind === "marker" && note.event) {
    return (
      <Marker className="justify-center">
        <MarkerIcon>
          <UserPlusIcon />
        </MarkerIcon>
        <MarkerContent>{note.text}</MarkerContent>
      </Marker>
    )
  }
  if (note.kind === "marker") {
    return (
      <Marker
        variant="separator"
        className={
          note.unread
            ? "text-pen [--pen-weight:var(--pen-weight-pressed)]"
            : undefined
        }
      >
        <MarkerContent>{note.text}</MarkerContent>
      </Marker>
    )
  }
  const who = PEOPLE[note.from]
  const mine = note.from === "maya"
  const isText = typeof note.body === "string"
  return (
    <Message align={mine ? "end" : "start"}>
      <MessageAvatar>
        <Avatar size="sm">
          <AvatarFallback name={who.portrait ? who.name : undefined}>
            {who.initials}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <b>{who.name}</b>
          <time dateTime={`2026-11-02T${note.time}`}>{note.time}</time>
        </MessageHeader>
        {isText || !mine ? (
          <Bubble variant={mine ? "default" : "secondary"}>
            <BubbleContent className="flex flex-col gap-hair">
              {note.body}
            </BubbleContent>
          </Bubble>
        ) : (
          note.body
        )}
      </MessageContent>
    </Message>
  )
}

function Thread({
  notes,
  from = "end",
}: {
  notes: Note[]
  from?: "start" | "end"
}) {
  return (
    <div className="frame h-[26rem] max-w-[40rem]">
      <MessageScrollerProvider autoScroll defaultScrollPosition={from}>
        <MessageScroller>
          <MessageScrollerViewport aria-label="Conversation with Listening Room">
            <MessageScrollerContent className="p-snug">
              {notes.map((note) => (
                <MessageScrollerItem key={note.id} messageId={note.id}>
                  <Row note={note} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          {from === "start" ? (
            <MessageScrollerButton direction="start" />
          ) : null}
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

export default function MessageScrollerDemo() {
  const [shown, setShown] = useState(0)
  return (
    <>
      <DemoSection title="Following the latest message">
        <Thread notes={[...THREAD, ...LATER.slice(0, shown)]} />
        <div className="mt-snug flex items-center gap-tight">
          <Button
            variant="outline"
            size="sm"
            disabled={shown >= LATER.length}
            onClick={() => setShown((n) => n + 1)}
          >
            Next message
          </Button>
          <span className="label text-pen-quiet">
            {shown >= LATER.length
              ? "Conversation complete"
              : `${LATER.length - shown} more to come`}
          </span>
        </div>
      </DemoSection>
      <DemoSection title="Reading from the top">
        <Thread notes={[...THREAD, ...LATER]} from="start" />
      </DemoSection>
    </>
  )
}
