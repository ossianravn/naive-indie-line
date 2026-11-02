import { Separator } from "@/fineliner/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Separator",
  description:
    "One wobbling pen line that divides entries in a list or items in a row.",
  item: "separator",
  group: "Data display",
}

const RECORDS = [
  { title: "Kind of Blue", artist: "Miles Davis", price: "£24" },
  { title: "Blue", artist: "Joni Mitchell", price: "£22" },
  { title: "Pink Moon", artist: "Nick Drake", price: "£19" },
]

export default function SeparatorDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Horizontal">
        <div className="w-[22rem] max-w-full">
          {RECORDS.map(({ title, artist, price }, i) => (
            <div key={title}>
              {i > 0 && <Separator />}
              <div className="flex items-baseline justify-between gap-tight py-hair">
                <span>
                  {title}{" "}
                  <span className="text-small text-pen-quiet">{artist}</span>
                </span>
                <span className="font-type text-small">{price}</span>
              </div>
            </div>
          ))}
        </div>
      </StateRow>
      <StateRow label="Vertical">
        <div className="label flex h-6 items-center gap-hair text-pen-quiet">
          <span>Thu 5 Nov</span>
          <Separator orientation="vertical" />
          <span>19:00</span>
          <Separator orientation="vertical" />
          <span>Back room</span>
        </div>
      </StateRow>
    </DemoSection>
  )
}
