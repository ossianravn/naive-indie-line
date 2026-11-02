import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/fineliner/ui/bubble"
import { Marker, MarkerContent } from "@/fineliner/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/fineliner/ui/message"
import { noteTime, type Note } from "./threads"

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

/** The messages behind a hold: the customer on the left, the shop on the right, a marker where the thread starts. */
export function RecordThread({ notes }: { notes: Note[] }) {
  const first = notes[0]
  if (!first) return null
  return (
    <section aria-labelledby="record-thread" className="mt-section">
      <h2 id="record-thread" className="label m-0 text-pen-quiet">
        Messages
      </h2>
      <Marker className="mt-snug">
        <MarkerContent>{noteTime(first.at).replace(/,.*$/u, "")}</MarkerContent>
      </Marker>
      <BubbleGroup className="mt-snug gap-snug">
        {notes.map((note) => {
          const shop = note.from === "shop"
          return (
            <Message key={note.id} align={shop ? "end" : "start"}>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback name={shop ? undefined : note.author}>
                    {initials(note.author)}
                  </AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  {note.author} · {noteTime(note.at).replace(/^.*, /u, "")}
                </MessageHeader>
                <Bubble
                  align={shop ? "end" : "start"}
                  variant={shop ? "default" : "secondary"}
                >
                  <BubbleContent>{note.body}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )
        })}
      </BubbleGroup>
    </section>
  )
}
