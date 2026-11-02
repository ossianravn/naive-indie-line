import { RoomHeader } from "@/fineliner/extras/room-header"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Room header",
  description:
    "A page head with a scene drawn by the pen and the title lettered beside or under it, drawn on the first time it is seen.",
  item: "room-header",
  group: "Fineliner extras",
}

export default function RoomHeaderDemo() {
  return (
    <>
      <DemoSection title="Beside">
        <StateRow label="Room">
          <RoomHeader
            title="How we grade a record"
            kicker="The journal · Thursday 5 November 2026"
            level={2}
            className="w-full"
          >
            <p>
              By eye under a bright lamp, then by ear on the counter&apos;s
              turntable, and the ear always wins.
            </p>
          </RoomHeader>
        </StateRow>
        <StateRow label="Studio, stilt">
          <RoomHeader
            title="Notes from the back office"
            kicker="The journal · Nº 12"
            scene="studio"
            face="stilt"
            level={2}
            className="w-full"
          />
        </StateRow>
      </DemoSection>

      <DemoSection title="Under">
        <StateRow label="Bistro, tramline">
          <RoomHeader
            title="Thursday wine"
            kicker="Six bottles, by the glass, from 7 pm"
            scene="bistro"
            face="tramline"
            layout="under"
            level={2}
            className="w-full"
          >
            <p>Thursdays 12, 19 and 26 November.</p>
          </RoomHeader>
        </StateRow>
        <StateRow label="Calm hand">
          <div data-hand="calm" className="w-full">
            <RoomHeader
              title="The room"
              kicker="Book an hour"
              layout="under"
              hand="calm"
              level={2}
            />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
