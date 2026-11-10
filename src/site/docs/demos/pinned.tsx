import "@/fineliner/pen/objects/studio"
import "@/fineliner/pen/objects/indie"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Pinned } from "@/fineliner/extras/pinned"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Pinned",
  description:
    "A sheet fixed to the wall by a pin, tape or a clip, holding any content, a few degrees off true at the lively hand.",
  item: "pinned",
  group: "Fineliner extras",
}

function Sheet({
  object,
  title,
  meta,
}: {
  object: string
  title: string
  meta: string
}) {
  return (
    <div className="grid gap-y-tight">
      <Drawing
        object={object}
        seed={`pinned-${object}`}
        title=""
        className="justify-self-center [&>svg]:h-24 [&>svg]:w-auto"
      />
      <p className="m-0 font-read text-lead leading-subhead">{title}</p>
      <p className="m-0 font-type text-small leading-small text-pen-quiet">
        {meta}
      </p>
    </div>
  )
}

export default function PinnedDemo() {
  return (
    <>
      <DemoSection title="Fixings">
        <StateRow label="Pin, tape, clip">
          <div className="grid max-w-[44rem] gap-line pt-snug sm:grid-cols-3">
            <Pinned seed="proof">
              <Sheet
                object="proof"
                title="Årsskrift 2025"
                meta="Print · 2025"
              />
            </Pinned>
            <Pinned fix="tape" seed="swatches">
              <Sheet
                object="swatch-fan"
                title="Risteriet Nord"
                meta="Identity · 2026"
              />
            </Pinned>
            <Pinned fix="clip" seed="deck">
              <Sheet
                object="turntable"
                title="Listening Room"
                meta="Web · 2026"
              />
            </Pinned>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="As a link">
        <StateRow label="The whole sheet is the target">
          <div className="max-w-[16rem] pt-snug">
            <Pinned href="#pinned-link" seed="link">
              <Sheet
                object="mood-board"
                title="Forlaget Løv"
                meta="Identity, Print · 2025"
              />
            </Pinned>
          </div>
        </StateRow>
        <StateRow label="Long content">
          <div className="max-w-[20rem] pt-snug">
            <Pinned fix="tape" seed="long">
              <p className="m-0 font-read">
                Andelsforeningen Solsiden asked for a yearbook that the members
                would keep: forty pages, two colours, a cover drawn by hand.
              </p>
            </Pinned>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Hand">
        <StateRow label="Calm: straight">
          <div
            data-hand="calm"
            className="grid max-w-[30rem] gap-line pt-snug sm:grid-cols-2"
          >
            <Pinned seed="calm-a">
              <Sheet object="folder" title="Side B" meta="Print · 2025" />
            </Pinned>
            <Pinned fix="tape" seed="calm-b">
              <Sheet
                object="pen-pot"
                title="Fineliner Naïve"
                meta="Type · 2026"
              />
            </Pinned>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
