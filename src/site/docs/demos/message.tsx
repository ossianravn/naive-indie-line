import { CalendarPlusIcon, CopyIcon, ReplyIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/fineliner/ui/bubble"
import { Button } from "@/fineliner/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/fineliner/ui/message"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Message",
  description:
    "One turn in a conversation: who wrote it and when, what they said, and what can be done with it.",
  item: "message",
  group: "Conversation",
}

function Byline({ name, time }: { name: string; time: string }) {
  return (
    <MessageHeader>
      <b>{name}</b>
      <time dateTime={`2026-11-02T${time}`}>{time}</time>
    </MessageHeader>
  )
}

function Who({ name, initials }: { name: string; initials: string }) {
  return (
    <MessageAvatar>
      <Avatar>
        <AvatarFallback name={name}>{initials}</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

const ACTIONS = [
  { label: "Add to calendar", icon: CalendarPlusIcon },
  { label: "Copy", icon: CopyIcon },
  { label: "Reply", icon: ReplyIcon },
]

export default function MessageDemo() {
  return (
    <>
      <DemoSection title="A message each way">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message align="end">
            <Who name="Maya Singh" initials="MS" />
            <MessageContent>
              <Byline name="Maya Singh" time="14:05" />
              <Bubble>
                <BubbleContent>
                  Could you keep Neon Orchard for me until Thursday? I&rsquo;d
                  like to hear it in the listening room before I buy it.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <Who name="Lars Holm" initials="LH" />
            <MessageContent>
              <Byline name="Lars Holm" time="14:12" />
              <Bubble variant="secondary">
                <BubbleContent>
                  It&rsquo;s held for you until closing on Thursday. Room 1 is
                  free at 16:00 on Thursday 5 November; I&rsquo;ve pencilled you
                  in for an hour.
                </BubbleContent>
              </Bubble>
              <MessageFooter className="-ms-1.5">
                {ACTIONS.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={label}
                    className="text-pen-quiet hover:text-pen"
                  >
                    <Icon />
                  </Button>
                ))}
              </MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
      <DemoSection title="Several bubbles, one message">
        <Message align="end" className="max-w-[40rem]">
          <Who name="Maya Singh" initials="MS" />
          <MessageContent>
            <Byline name="Maya Singh" time="14:14" />
            <BubbleGroup>
              <Bubble>
                <BubbleContent>Perfect, thank you.</BubbleContent>
              </Bubble>
              <Bubble>
                <BubbleContent>
                  Can Ama come too? She wants to hear Rain on Tin while
                  we&rsquo;re there.
                </BubbleContent>
              </Bubble>
            </BubbleGroup>
            <MessageFooter>Read 14:15</MessageFooter>
          </MessageContent>
        </Message>
      </DemoSection>
      <DemoSection title="Without avatars">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message>
            <MessageContent>
              <Byline name="Jonas Berg" time="16:40" />
              <Bubble variant="secondary">
                <BubbleContent>
                  Is Paper Moons still held for me? I can be there on Thursday
                  at five.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Byline name="Lars Holm" time="16:43" />
              <Bubble>
                <BubbleContent>
                  Still held. We close at five on Thursdays, so come by half
                  past four.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
    </>
  )
}
