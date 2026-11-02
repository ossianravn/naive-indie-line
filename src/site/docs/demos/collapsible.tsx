import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/fineliner/ui/collapsible"
import { Separator } from "@/fineliner/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Collapsible",
  description:
    "A section that opens and closes in place, for detail a reader asks for rather than reads by default.",
  item: "collapsible",
  group: "Data display",
}

const QUESTIONS = [
  {
    q: "How long is a listening session?",
    a: "An hour in room 1, with up to three records from the racks. Bring your own if you like; we clean them before they go on the platter.",
  },
  {
    q: "Can I bring someone?",
    a: "Up to three of you fit on the sofa. The headphone bench by the window seats one, for when the room is booked.",
  },
]

const NOTES = [
  {
    q: "Condition",
    a: "Very good plus. A whisper of surface noise in the run-in of side two; it settles by the first chorus. The sleeve has a little ring wear on the back.",
  },
  {
    q: "Pressing",
    a: "First pressing on Nordlys, 1968, with the laminated sleeve and the blue label. Matrix numbers NL 2041 A1 and B1.",
  },
  {
    q: "Played in the room",
    a: "Twice this autumn, both times on a Thursday. Track three, side one is the one people ask about.",
  },
]

// Each rule between the rows bends through its own wobble, so no two lines match.
const wobble = (n: number) =>
  ({ "--wob": `var(--wob-${(n % 6) + 1})` }) as React.CSSProperties

function Question({
  q,
  a,
  defaultOpen,
  disabled,
}: {
  q: string
  a: string
  defaultOpen?: boolean
  disabled?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} disabled={disabled}>
      <CollapsibleTrigger className="flex min-h-control-compact cursor-pointer items-center gap-hair text-left font-ui text-ui leading-ui text-pen disabled:cursor-not-allowed disabled:text-pen-faint">
        <CollapsibleChevron className="text-pen-quiet in-disabled:text-pen-faint" />
        {q}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="m-0 max-w-measure ps-[1.4375rem] pt-1 pb-tight text-small leading-small text-pen-quiet">
          {a}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function CollapsibleDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Closed">
          <Question {...QUESTIONS[0]!} />
        </StateRow>
        <StateRow label="Open">
          <Question {...QUESTIONS[1]!} defaultOpen />
        </StateRow>
        <StateRow label="Disabled">
          <Question q="Can I book on a Thursday evening?" a="" disabled />
        </StateRow>
      </DemoSection>
      <DemoSection title="On a record">
        <div className="max-w-measure">
          <p className="label m-0 text-pen-quiet">LR-0431 · Jazz · 320 kr</p>
          <p className="m-0 mt-hair font-read text-lead leading-subhead font-medium">
            Harbour Lights
          </p>
          <p className="m-0 text-small leading-small text-pen-quiet">
            Ellen Moe Trio · Nordlys, 1968
          </p>
          <div className="mt-tight text-pen-faint">
            {NOTES.map((note, index) => (
              <div key={note.q}>
                <Separator style={wobble(index)} />
                <div className="text-pen">
                  <Question {...note} defaultOpen={index === 0} />
                </div>
              </div>
            ))}
            <Separator style={wobble(NOTES.length)} />
          </div>
        </div>
      </DemoSection>
    </>
  )
}
