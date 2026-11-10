// The roof over the hero: the roof strip with the office's name lettered on the sign hanging from the gable, laid
// over the board the drawing marked. Rendered on the server only; nothing on the roof is operated.
import "@/site/baghuset/drawings"
import { RoomSection } from "@/fineliner/extras/room-section"
import { SceneLabel, type SceneRegions } from "@/fineliner/extras/scene-spots"

export function RoofRoom({ regions }: { regions: SceneRegions }) {
  return (
    <RoomSection
      scene="baghuset-roof"
      seed="baghuset"
      title="The roof: someone leans out of the skylight to wave at a bird on the chimney"
      regions={regions}
      className="[container-type:inline-size]"
      spots={
        <SceneLabel
          region="sign-board"
          className="font-line text-[clamp(0.55rem,1.55cqw,1.35rem)] tracking-[0.06em]"
        >
          BAGHUSET
        </SceneLabel>
      }
    />
  )
}
