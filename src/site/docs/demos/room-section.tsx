import "@/site/baghuset/drawings"
import { RoomSection } from "@/fineliner/extras/room-section"
import { SceneSpot } from "@/fineliner/extras/scene-spots"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Room section",
  description:
    "A page section with a room in it: content on the wall, a drawn strip along its floor, cropped from the centre on narrow screens.",
  item: "room-section",
  group: "Fineliner extras",
}

export default function RoomSectionDemo() {
  return (
    <>
      <DemoSection title="Sections">
        <StateRow label="Wall and floor">
          <RoomSection
            scene="baghuset-top"
            seed="room-section"
            side="both"
            className="px-snug"
          >
            <div className="grid gap-y-tight pt-snug">
              <h3 className="m-0 text-h2 leading-heading">Work</h3>
              <p className="m-0 max-w-measure text-pen-quiet">
                What is on the wall this month. The strip below is one drawing:
                all of it on a wide screen, its middle on a phone.
              </p>
            </div>
          </RoomSection>
        </StateRow>
        <StateRow label="With a spot">
          <RoomSection
            scene="baghuset-top"
            seed="room-section-spots"
            spots={<SceneSpot region="chest" label="Archive" href="#archive" />}
          >
            <p className="m-0 max-w-measure pt-snug">
              Twelve older jobs live in the plan chest.
            </p>
          </RoomSection>
        </StateRow>
      </DemoSection>
    </>
  )
}
