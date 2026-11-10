import "@/fineliner/pen/objects/rooms"
import { SceneSpot, SceneSpots } from "@/fineliner/extras/scene-spots"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/fineliner/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Scene spots",
  description:
    "A scene with operable places: a labelled button over each named object, placed from where the pen drew it.",
  item: "scene-spots",
  group: "Fineliner extras",
}

const SPOTS = [
  {
    region: "lamp",
    label: "Light",
    title: "The pendant",
    text: "Lit from four until close.",
  },
  {
    region: "deck",
    label: "Playing",
    title: "On the deck",
    text: "Harbour Lights, side B.",
  },
  {
    region: "till",
    label: "Till",
    title: "The till",
    text: "Cards and cash; no account needed.",
  },
]

export default function SceneSpotsDemo() {
  return (
    <>
      <DemoSection title="Spots">
        <StateRow label="Popovers over the room">
          <SceneSpots scene="room" seed="spots" className="max-w-[40rem]">
            {SPOTS.map((spot) => (
              <Popover key={spot.region}>
                <PopoverTrigger
                  render={<SceneSpot region={spot.region} label={spot.label} />}
                />
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>{spot.title}</PopoverTitle>
                    <PopoverDescription>{spot.text}</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            ))}
          </SceneSpots>
        </StateRow>
        <StateRow label="A spot as a link">
          <SceneSpots scene="room" seed="spots-link" className="max-w-[32rem]">
            <SceneSpot
              region="bin"
              label="Browse the bins"
              href="/listening-room"
            />
          </SceneSpots>
        </StateRow>
      </DemoSection>
    </>
  )
}
