import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/fineliner/ui/accordion"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Accordion",
  description:
    "Rows of questions or sections that open one at a time, so a long page of answers stays easy to scan.",
  item: "accordion",
  group: "Data display",
}

const QUESTIONS = [
  {
    value: "listen",
    title: "Can I listen before I buy?",
    body: "Yes. Take any record from the racks to the counter and we will play a side for you, or book the listening room for an hour.",
  },
  {
    value: "book",
    title: "How do listening-room bookings work?",
    body: "Book an hour for up to three people. Bring records from the racks or from home; we clean the stylus between sessions.",
  },
  {
    value: "hold",
    title: "How long will you hold a record for me?",
    body: "Until the end of the next Thursday evening. After that it goes back in the racks for someone else to find.",
  },
]

export default function AccordionDemo() {
  return (
    <>
      <DemoSection title="Modes">
        <StateRow label="One at a time">
          <Accordion defaultValue={["listen"]} className="max-w-[36rem]">
            {QUESTIONS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.body}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StateRow>
        <StateRow label="Several open">
          <Accordion
            multiple
            defaultValue={["programme", "wine"]}
            className="max-w-[36rem]"
          >
            <AccordionItem value="programme">
              <AccordionTrigger>Thursday 19 November</AccordionTrigger>
              <AccordionContent>
                <p>
                  Ama Owusu plays highlife from the shop&apos;s own shelves,
                  from seven until the last side. Eight seats by the window.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="wine">
              <AccordionTrigger>Wine</AccordionTrigger>
              <AccordionContent>
                <p>
                  A pét-nat from the Loire and a light red, by the glass. Jonas
                  Berg pours.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="recording" disabled>
              <AccordionTrigger>Recording</AccordionTrigger>
              <AccordionContent>
                <p>This evening is not recorded.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </StateRow>
      </DemoSection>
    </>
  )
}
