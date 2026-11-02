import { AppearanceControl } from "@/fineliner/extras/appearance-control"
import { siteAppearance } from "@/site/appearance"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Appearance control",
  description:
    "Every appearance setting (light, paper, pen, hand, line boil, containers, labels and density) as settings rows that restyle the whole page.",
  item: "appearance-control",
  group: "Fineliner extras",
}

export default function AppearanceControlDemo() {
  return (
    <>
      <DemoSection title="Every setting">
        <StateRow label="Rows">
          <AppearanceControl defaults={siteAppearance} />
        </StateRow>
        <StateRow label="With hints">
          <AppearanceControl defaults={siteAppearance} hints />
        </StateRow>
      </DemoSection>
      <DemoSection title="Chosen rows">
        <StateRow label="Three rows">
          <AppearanceControl
            defaults={siteAppearance}
            rows={["theme", "pen", "density"]}
          />
        </StateRow>
        <StateRow label="Narrow column">
          <AppearanceControl
            defaults={siteAppearance}
            rows={["theme", "stock", "pen", "boil"]}
            className="max-w-[17rem]"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
