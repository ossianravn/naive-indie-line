import { Stamp } from "@/fineliner/extras/stamp"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Stamp",
  description:
    "A rubber-stamp word in typewriter capitals inside a doubled frame, put down a few degrees off true.",
  item: "stamp",
  group: "Fineliner extras",
}

export default function StampDemo() {
  return (
    <>
      <DemoSection title="Stamps">
        <StateRow label="In the pen">
          <div className="flex flex-wrap items-center gap-line">
            <Stamp>Estimate</Stamp>
            <Stamp>Received</Stamp>
            <Stamp>Paid</Stamp>
            <Stamp>Approved for print</Stamp>
          </div>
        </StateRow>
        <StateRow label="Correction pen: destructive only">
          <div className="flex flex-wrap items-center gap-line">
            <Stamp tone="correction">Void</Stamp>
            <Stamp tone="correction">Rejected</Stamp>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a line">
        <StateRow label="Beside text">
          <p className="m-0 max-w-measure">
            Reference BH-0412 <Stamp className="ms-tight">Received</Stamp>
          </p>
        </StateRow>
      </DemoSection>
    </>
  )
}
