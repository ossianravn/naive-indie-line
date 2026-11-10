import { StickyNote } from "@/fineliner/extras/sticky-note"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sticky note",
  description:
    "A small square note in the hand voice, a band of the wash along its glued edge and its corner curling up.",
  item: "sticky-note",
  group: "Fineliner extras",
}

const STEPS = ["Listen", "Sketch", "Make", "Hand over"]

export default function StickyNoteDemo() {
  return (
    <>
      <DemoSection title="Notes">
        <StateRow label="A process">
          <ol className="m-0 flex list-none flex-wrap gap-line p-0">
            {STEPS.map((step) => (
              <li key={step}>
                <StickyNote>{step}</StickyNote>
              </li>
            ))}
          </ol>
        </StateRow>
        <StateRow label="Long words">
          <StickyNote>
            Call Ane about the glaze colours before Thursday
          </StickyNote>
        </StateRow>
      </DemoSection>
      <DemoSection title="Hand">
        <StateRow label="Calm: straight">
          <div data-hand="calm" className="flex flex-wrap gap-line">
            <StickyNote>Print proofs</StickyNote>
            <StickyNote>Send invoice</StickyNote>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
