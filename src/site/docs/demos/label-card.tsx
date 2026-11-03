import { EditionNumber } from "@/fineliner/extras/edition-number"
import { LabelCard } from "@/fineliner/extras/label-card"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Label card",
  description:
    "A label from a bottle or a sleeve: a drawing in a drawn border, words up its spine, a kicker and a title, lettered or in the reading face.",
  item: "label-card",
  group: "Fineliner extras",
}

export default function LabelCardDemo() {
  return (
    <>
      <DemoSection title="Labels">
        <StateRow label="Scene, lettered">
          <LabelCard
            scene="room"
            title="Listening Room"
            face="line"
            kicker="Chenin blanc · Loire · 2025"
            spine="Pétillant Naturel"
            className="w-[19rem]"
          />
        </StateRow>
        <StateRow label="Object, reading face">
          <LabelCard
            object="record"
            title="Harbour Lights"
            kicker={
              <>
                Ellen Moe Trio ·{" "}
                <span className="whitespace-nowrap">LR-0431</span>
              </>
            }
            spine="Nordlys 1968"
          />
          <LabelCard
            object="bottle"
            title="Haut & Tief"
            kicker="Grüner Veltliner · Kamptal · 2022"
            spine="Skin contact"
          />
        </StateRow>
        <StateRow label="Picked by the seed">
          <LabelCard
            title="Slow Weather"
            kicker={
              <>
                The Quiet Arcade ·{" "}
                <span className="whitespace-nowrap">LR-0430</span>
              </>
            }
            className="w-[13rem]"
          />
          <LabelCard
            title="Paper Moons"
            kicker={
              <>
                Odile & the Lanterns ·{" "}
                <span className="whitespace-nowrap">LR-0429</span>
              </>
            }
            className="w-[13rem]"
          />
          <LabelCard
            title="Rain on Tin"
            kicker={
              <>
                Mabel Okafor ·{" "}
                <span className="whitespace-nowrap">LR-0423</span>
              </>
            }
            className="w-[13rem]"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Spine">
        <StateRow label="Edition number">
          <LabelCard
            object="disco-ball"
            title="A Room to Listen In"
            face="line"
            kicker="Various artists · 2×LP"
            spine={<EditionNumber value={127} of={500} />}
          />
        </StateRow>
        <StateRow label="Too long for its edge">
          <LabelCard
            object="carafe"
            title="Ruisseau"
            kicker="Gamay · Beaujolais · 2024"
            spine="Vin de France, bottled by hand at Les Vignes du Mardi on a Thursday in March"
            className="w-[13rem]"
          />
        </StateRow>
        <StateRow label="No spine, no art">
          <LabelCard
            art={false}
            title="Thursday 12 November"
            kicker="Listening night · from seven"
            className="w-[13rem]"
          >
            <p className="m-0 text-small leading-small text-pen-quiet">
              Twelve seats; the host brings the records.
            </p>
          </LabelCard>
        </StateRow>
      </DemoSection>
      <DemoSection title="Containers and hand">
        <StateRow label="Boxed">
          <div data-containers="boxed" className="flex flex-wrap gap-line">
            <LabelCard
              object="glass"
              title="Bulles de Grès"
              kicker="Pét-nat · Anjou · 2025"
              spine="Clos Pied-de-Lièvre"
            />
            <LabelCard
              scene="bistro"
              title="Wine Thursday"
              face="line"
              kicker="Thursday 19 November"
              spine="Listening Room"
            />
          </div>
        </StateRow>
        <StateRow label="Calm hand">
          <div data-hand="calm" data-containers="boxed">
            <LabelCard
              object="record"
              title="Harbour Lights"
              kicker={
                <>
                  Ellen Moe Trio ·{" "}
                  <span className="whitespace-nowrap">LR-0431</span>
                </>
              }
              spine="Nordlys 1968"
              hand="calm"
            />
          </div>
        </StateRow>
        <StateRow label="As a link">
          <div data-containers="boxed">
            <LabelCard
              object="radio"
              title="Neon Orchard"
              kicker={
                <>
                  Satoko Ishii ·{" "}
                  <span className="whitespace-nowrap">LR-0414</span>
                </>
              }
              spine="Kasumi 1986"
              href="#label-card-link"
            />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
