import { Drawing } from "@/fineliner/drawing/drawing"
import { DrawnBorder } from "@/fineliner/extras/drawn-border"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Drawn border",
  description:
    "The label's border round any region: four pen strokes that run past or stop short of their corners, single or doubled, resizing with what they hold.",
  item: "drawn-border",
  group: "Fineliner extras",
}

function Label({ seed }: { seed: string }) {
  return (
    <div className="grid justify-items-center gap-tight text-center">
      <Drawing object="bottle" seed={seed} title="" className="w-16" />
      <p className="m-0 font-read text-lead leading-subhead">
        Thursday Pét-nat
      </p>
      <p className="label m-0 text-pen-quiet">Loire · 2025 · 65 kr a glass</p>
    </div>
  )
}

export default function DrawnBorderDemo() {
  return (
    <>
      <DemoSection title="Single and doubled">
        <StateRow label="Single">
          <DrawnBorder className="w-64 px-snug py-line">
            <Label seed="thursday-pet-nat" />
          </DrawnBorder>
        </StateRow>
        <StateRow label="Doubled">
          <DrawnBorder double className="w-64">
            <Label seed="thursday-pet-nat" />
          </DrawnBorder>
        </StateRow>
        <StateRow label="Wider gap">
          <DrawnBorder
            double
            className="w-64 [--border-gap:var(--space-tight)]"
          >
            <Label seed="thursday-pet-nat" />
          </DrawnBorder>
        </StateRow>
      </DemoSection>

      <DemoSection title="Resizes with its content">
        <StateRow label="A notice">
          <DrawnBorder className="max-w-measure">
            <p className="m-0 font-type text-small leading-small">
              THE LISTENING ROOM IS CLOSED ON THURSDAY 12 NOVEMBER FOR A PRIVATE
              SESSION. RECORDS ON HOLD CAN BE COLLECTED AT THE COUNTER AS USUAL.
            </p>
          </DrawnBorder>
        </StateRow>
        <StateRow label="One word">
          <DrawnBorder className="px-tight py-hair">
            <span className="label">Sold</span>
          </DrawnBorder>
        </StateRow>
      </DemoSection>

      <DemoSection title="Seeds and hands">
        <StateRow label="Seeded by words">
          <div className="flex flex-wrap gap-snug">
            {["Side A", "Side B", "Bonus 7″"].map((side) => (
              <DrawnBorder key={side} className="px-snug py-tight">
                <span className="font-read text-lead">{side}</span>
              </DrawnBorder>
            ))}
          </div>
        </StateRow>
        <StateRow label="Calm hand">
          <div data-hand="calm" className="flex flex-wrap gap-tight">
            <DrawnBorder double className="w-64">
              <Label seed="thursday-pet-nat" />
            </DrawnBorder>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
