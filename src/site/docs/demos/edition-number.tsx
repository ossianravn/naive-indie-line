import { EditionNumber } from "@/fineliner/extras/edition-number"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Edition number",
  description:
    "A numbered copy in the typewriter, zero padded so a run lines up: Nº 0127, Nº 0127 of 500, or set up a spine.",
  item: "edition-number",
  group: "Fineliner extras",
}

export default function EditionNumberDemo() {
  return (
    <>
      <DemoSection title="As a kicker">
        <StateRow label="Of a run">
          <div className="flex max-w-measure flex-col gap-hair">
            <span className="text-small text-pen-quiet">
              <EditionNumber value={127} of={500} />
            </span>
            <span className="font-read text-h2 leading-heading">
              A Room to Listen In
            </span>
            <span className="text-ui leading-small text-pen-quiet">
              Our own compilation, pressed once; the money goes to the Thursday
              nights.
            </span>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Inline">
        <StateRow label="In running text">
          <p className="m-0 max-w-measure text-body leading-body">
            Your copy of the compilation is{" "}
            <EditionNumber value={127} of={500} className="text-[0.9em]" />.
            Bring it on Thursday 12 November and Tove Aske will sign the sleeve.
          </p>
        </StateRow>
      </DemoSection>
      <DemoSection title="Padding and totals">
        <StateRow label="digits 4">
          <EditionNumber value={7} />
        </StateRow>
        <StateRow label="digits 2">
          <EditionNumber value={7} digits={2} />
        </StateRow>
        <StateRow label="of a total">
          <EditionNumber value={412} of={500} />
        </StateRow>
        <StateRow label="In a column">
          <span className="flex flex-col">
            <EditionNumber value={1} of={500} />
            <EditionNumber value={48} of={500} />
            <EditionNumber value={127} of={500} />
            <EditionNumber value={499} of={500} />
          </span>
        </StateRow>
        <StateRow label="Other sign">
          <EditionNumber value={3} digits={2} prefix="Vol." label="Volume" />
        </StateRow>
      </DemoSection>
      <DemoSection title="On the spine">
        <StateRow label="Up an edge">
          <div className="flex items-stretch gap-tight">
            <EditionNumber
              spine
              value={127}
              of={500}
              className="text-small text-pen-quiet"
            />
            <span aria-hidden="true" className="rule-y text-pen-faint" />
            <div className="max-w-[20rem]">
              <p className="m-0 font-read text-lead leading-subhead">
                A Room to Listen In
              </p>
              <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
                Twenty records from the listening room, chosen by the people who
                host its Thursday nights, on two discs in a hand-numbered
                sleeve.
              </p>
            </div>
          </div>
        </StateRow>
        <StateRow label="Alone">
          <EditionNumber spine value={412} />
          <EditionNumber spine value={412} of={500} className="text-lead" />
        </StateRow>
      </DemoSection>
    </>
  )
}
