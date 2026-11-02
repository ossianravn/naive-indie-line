import { LayoutGridIcon, ListIcon, LibraryIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle group",
  description:
    "A row of toggles: a segmented control in one drawn frame for two to four choices, or a set of filters that switch on and off.",
  item: "toggle-group",
  group: "Forms",
}

export default function ToggleGroupDemo() {
  return (
    <>
      <DemoSection title="Segmented">
        <StateRow label="One choice">
          <ToggleGroup
            aria-label="Speed"
            variant="outline"
            spacing={0}
            defaultValue={["33"]}
          >
            <ToggleGroupItem value="33">33⅓</ToggleGroupItem>
            <ToggleGroupItem value="45">45</ToggleGroupItem>
            <ToggleGroupItem value="78">78</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="With icons · sm">
          <ToggleGroup
            aria-label="Show the catalogue as"
            variant="outline"
            size="sm"
            spacing={0}
            defaultValue={["crates"]}
          >
            <ToggleGroupItem value="crates" aria-label="Crates">
              <LibraryIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="wall" aria-label="Wall of sleeves">
              <LayoutGridIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List">
              <ListIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Disabled">
          <ToggleGroup
            aria-label="Group size"
            variant="outline"
            spacing={0}
            defaultValue={["1-2"]}
            disabled
          >
            <ToggleGroupItem value="1-2">1–2</ToggleGroupItem>
            <ToggleGroupItem value="3-4">3–4</ToggleGroupItem>
            <ToggleGroupItem value="5+">5+</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ToggleGroup
            aria-label="Room"
            variant="outline"
            spacing={0}
            orientation="vertical"
            defaultValue={["back"]}
          >
            <ToggleGroupItem value="front">Front room</ToggleGroupItem>
            <ToggleGroupItem value="back">Back room</ToggleGroupItem>
            <ToggleGroupItem value="booth">Booth</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Filters">
        <StateRow label="Several on">
          <ToggleGroup
            aria-label="Formats"
            multiple
            defaultValue={["vinyl", "cassette"]}
          >
            <ToggleGroupItem value="vinyl">Vinyl</ToggleGroupItem>
            <ToggleGroupItem value="cassette">Cassette</ToggleGroupItem>
            <ToggleGroupItem value="cd">CD</ToggleGroupItem>
            <ToggleGroupItem value="reel" disabled>
              Reel-to-reel
            </ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Outline">
          <ToggleGroup
            aria-label="Formats"
            variant="outline"
            spacing={3}
            multiple
            defaultValue={["vinyl"]}
          >
            <ToggleGroupItem value="vinyl">Vinyl</ToggleGroupItem>
            <ToggleGroupItem value="cassette">Cassette</ToggleGroupItem>
            <ToggleGroupItem value="cd">CD</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
