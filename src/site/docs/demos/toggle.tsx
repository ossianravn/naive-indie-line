import { BookmarkIcon, Disc3Icon, HeartIcon } from "lucide-react"
import { Toggle } from "@/fineliner/ui/toggle"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle",
  description:
    "A button that stays down, for one option that is on or off; pressed, the pen puts a pocket of ink under it.",
  item: "toggle",
  group: "Forms",
}

const VARIANTS = ["outline", "default"] as const

export default function ToggleDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map((variant) => (
          <StateRow key={variant} label={variant}>
            <Toggle variant={variant} defaultPressed>
              <Disc3Icon data-icon="inline-start" /> On vinyl
            </Toggle>
            <Toggle variant={variant}>
              <HeartIcon data-icon="inline-start" /> Wishlist
            </Toggle>
            <Toggle variant={variant} disabled>
              Signed copies
            </Toggle>
            <Toggle variant={variant} disabled defaultPressed>
              Second-hand
            </Toggle>
          </StateRow>
        ))}
        <StateRow label="Invalid">
          <Toggle variant="outline" aria-invalid="true">
            House rules read
          </Toggle>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default · lg">
          <Toggle variant="outline" size="sm" defaultPressed>
            New in
          </Toggle>
          <Toggle variant="outline" defaultPressed>
            New in
          </Toggle>
          <Toggle variant="outline" size="lg" defaultPressed>
            New in
          </Toggle>
        </StateRow>
        <StateRow label="Icon only">
          <Toggle variant="outline" size="sm" aria-label="Save to the list">
            <BookmarkIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Add to wishlist" defaultPressed>
            <HeartIcon />
          </Toggle>
          <Toggle variant="outline" size="lg" aria-label="Save to the list">
            <BookmarkIcon />
          </Toggle>
        </StateRow>
      </DemoSection>
    </>
  )
}
