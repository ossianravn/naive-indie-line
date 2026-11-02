import { PenMark } from "@/fineliner/drawing/pen-mark"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/fineliner/ui/bubble"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Bubble",
  description:
    "One turn of a conversation: a pocket of tint for your own words, a drawn line round the other side's.",
  item: "bubble",
  group: "Conversation",
}

const VARIANTS = [
  ["default", "Could you keep Neon Orchard for me until Thursday?"],
  ["secondary", "It’s held for you until closing on Thursday."],
  ["muted", "Room 1 is free from 16:00 on Thursday 5 November."],
  ["tinted", "Book room 1 for an hour"],
  ["outline", "Show me Thursday’s wine list"],
  ["ghost", "Held at 14:12 · LR-0414 · until Thursday"],
  ["destructive", "The photo didn’t arrive. Try sending it again."],
] as const

const SUGGESTIONS = ["Book room 1 at 16:00", "Show Thursday’s wine list"]

export default function BubbleDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map(([variant, text]) => (
          <StateRow key={variant} label={variant}>
            <Bubble variant={variant}>
              <BubbleContent>{text}</BubbleContent>
            </Bubble>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Both sides">
        <BubbleGroup className="max-w-[38rem] gap-tight">
          <Bubble align="end">
            <BubbleContent>
              Could you keep Neon Orchard for me until Thursday? I&rsquo;d like
              to hear it in the listening room before I buy it.
            </BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>
              It&rsquo;s held for you until closing on Thursday. Room 1 is free
              at 16:00 on Thursday 5 November, and I&rsquo;ve pencilled you in
              for an hour.
            </BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>Perfect. Can Ama come too?</BubbleContent>
          </Bubble>
          <Bubble variant="secondary" className="mb-tight">
            <BubbleContent>
              Of course: the sofa seats three. I&rsquo;ll put Rain on Tin by the
              platter for her.
            </BubbleContent>
            <BubbleReactions>
              <PenMark name="tick" seed="bubble-reaction" className="size-3" />2
            </BubbleReactions>
          </Bubble>
        </BubbleGroup>
      </DemoSection>
      <DemoSection title="As buttons">
        <StateRow label="Suggestions">
          {SUGGESTIONS.map((text) => (
            <Bubble key={text} variant="outline">
              <BubbleContent render={<button type="button" />}>
                {text}
              </BubbleContent>
            </Bubble>
          ))}
        </StateRow>
        <StateRow label="Tinted link">
          <Bubble variant="tinted">
            <BubbleContent render={<a href="#neon-orchard" />}>
              Neon Orchard in the catalogue
            </BubbleContent>
          </Bubble>
        </StateRow>
      </DemoSection>
    </>
  )
}
