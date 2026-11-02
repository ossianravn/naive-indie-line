import { HandNote } from "@/fineliner/extras/hand-note"
import { Button } from "@/fineliner/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Hand note",
  description:
    "An aside in the hand voice with a drawn arrow toward what it is about, under its line or out in the margin.",
  item: "hand-note",
  group: "Fineliner extras",
}

export default function HandNoteDemo() {
  return (
    <>
      <DemoSection title="Under its line">
        <StateRow label="Pointing up">
          <div className="max-w-[28rem]">
            <p className="m-0">
              Harbour Lights by the Ellen Moe Trio, first pressing, 320 kr.
            </p>
            <HandNote className="ps-tight">
              a whisper of surface noise on side two
            </HandNote>
          </div>
        </StateRow>
        <StateRow label="Pointing down">
          <div className="max-w-[28rem]">
            <HandNote point="down" className="mb-hair ps-tight">
              the good chair is by the window
            </HandNote>
            <p className="m-0">The listening room, back of the shop</p>
          </div>
        </StateRow>
      </DemoSection>

      <DemoSection title="Beside what it is about">
        <StateRow label="Back to the start">
          <div className="flex flex-wrap items-start gap-x-tight">
            <Button variant="outline">Book Thursday</Button>
            <HandNote point="start" className="mt-0 min-w-[10rem] flex-1">
              it fills up by noon
            </HandNote>
          </div>
        </StateRow>
        <StateRow label="On to the end">
          <div className="flex flex-wrap items-start gap-x-tight">
            <HandNote point="end" className="mt-0">
              taste it first
            </HandNote>
            <p className="m-0 font-type text-ui">Pét-nat · 65 kr</p>
          </div>
        </StateRow>
        <StateRow label="Curl">
          <div className="max-w-[28rem]">
            <p className="m-0">Music for Waiting Rooms, Ana Lindqvist</p>
            <HandNote point="curl" className="ps-snug">
              plays beautifully on the room&apos;s speakers
            </HandNote>
          </div>
        </StateRow>
      </DemoSection>

      <DemoSection title="In the margin">
        <StateRow label="64rem and wider">
          <div className="relative max-w-[30rem]">
            <p className="m-0">
              We grade the vinyl and the sleeve apart, by eye under a bright
              lamp and then by ear on the counter&apos;s turntable. A record
              that looks very good plus but crackles through a quiet passage
              drops a grade; one with scuffs that play silent keeps it.
            </p>
            <HandNote placement="margin">the ear always wins</HandNote>
          </div>
        </StateRow>
      </DemoSection>

      <DemoSection title="Hand and direction">
        <StateRow label="Calm hand">
          <div data-hand="calm" className="max-w-[28rem]">
            <p className="m-0">Slow Weather, The Quiet Arcade, near mint</p>
            <HandNote className="ps-tight">still in its shrink wrap</HandNote>
          </div>
        </StateRow>
        <StateRow label="Right to left">
          <div dir="rtl" lang="he" className="max-w-[28rem]">
            <p className="m-0">חדר ההאזנה, בחלק האחורי של החנות</p>
            <HandNote className="ps-tight">הכורסה ליד החלון היא הטובה</HandNote>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
