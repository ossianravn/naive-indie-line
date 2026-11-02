import { PriceTag } from "@/fineliner/extras/price-tag"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Price tag",
  description:
    "A hanging tag with a punched hole and a loop of string: the price in the typewriter, an old price struck through by the pen.",
  item: "price-tag",
  group: "Fineliner extras",
}

export default function PriceTagDemo() {
  return (
    <>
      <DemoSection title="Tags">
        <StateRow label="Reduced">
          <PriceTag price="320 kr" was="380 kr" note="Harbour Lights" />
        </StateRow>
        <StateRow label="Price alone">
          <div className="flex flex-wrap items-start gap-snug">
            <PriceTag price="240 kr" />
            <PriceTag price="90 kr" note="7″ single" />
            <PriceTag price="1,450 kr" note="First pressing, signed" />
          </div>
        </StateRow>
        <StateRow label="Long note">
          <PriceTag
            price="180 kr"
            was="220 kr"
            note="Paper Moons, held for Jonas until Thursday"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm, default, lg">
          <div className="flex flex-wrap items-start gap-line">
            <PriceTag size="sm" price="150 kr" note="Low Tide Dub" />
            <PriceTag price="150 kr" note="Low Tide Dub" />
            <PriceTag size="lg" price="150 kr" note="Low Tide Dub" />
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Hand">
        <StateRow label="Lively (default)">
          <div className="flex flex-wrap items-start gap-line">
            {RELEASES.slice(0, 5).map((r) => (
              <PriceTag key={r.id} price={kroner(r.price)} note={r.id} />
            ))}
          </div>
        </StateRow>
        <StateRow label="Calm: straight">
          <div data-hand="calm" className="flex flex-wrap items-start gap-line">
            {RELEASES.slice(0, 5).map((r) => (
              <PriceTag key={r.id} price={kroner(r.price)} note={r.id} />
            ))}
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
