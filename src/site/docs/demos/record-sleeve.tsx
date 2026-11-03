import { RecordSleeve } from "@/fineliner/extras/record-sleeve"
import { RELEASES } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Record sleeve",
  description:
    "A square sleeve with a drawn cover, the title lettered, the artist and the catalogue number up the spine, and the record peeking out.",
  item: "record-sleeve",
  group: "Fineliner extras",
}

const byId = (id: string) => {
  const record = RELEASES.find((r) => r.id === id)
  if (!record) throw new Error(`No record ${id}`)
  return record
}

export default function RecordSleeveDemo() {
  const harbour = byId("LR-0431")
  return (
    <>
      <DemoSection title="Sizes">
        <StateRow label="sm">
          <RecordSleeve
            size="sm"
            title={harbour.title}
            artist={harbour.artist}
            catalogue={harbour.id}
          />
        </StateRow>
        <StateRow label="md (default)">
          <RecordSleeve
            title={harbour.title}
            artist={harbour.artist}
            catalogue={harbour.id}
          />
        </StateRow>
        <StateRow label="lg">
          <RecordSleeve
            size="lg"
            title={harbour.title}
            artist={harbour.artist}
            catalogue={harbour.id}
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="In the racks">
        <ul className="m-0 flex list-none flex-wrap gap-snug p-0">
          {RELEASES.slice(0, 8).map((r) => (
            <li key={r.id}>
              <RecordSleeve
                size="sm"
                title={r.title}
                artist={r.artist}
                catalogue={r.id}
                href={`#${r.id}`}
              />
            </li>
          ))}
        </ul>
      </DemoSection>
      <DemoSection title="Covers and faces">
        <StateRow label="Object">
          <RecordSleeve
            title="Studies in Blue Light"
            artist="Library Ensemble Nº 4"
            catalogue="LR-0424"
            object="turntable"
          />
          <RecordSleeve
            title="Field Hum"
            artist="Tove Aske"
            catalogue="LR-0419"
            object="window"
            face="tramline"
          />
        </StateRow>
        <StateRow label="Scene">
          <RecordSleeve
            size="lg"
            title="A Room to Listen In"
            artist="Various artists"
            catalogue="LR-0412"
            scene="room"
            face="ribbon"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="As a link">
          <RecordSleeve
            title="Neon Orchard"
            artist="Satoko Ishii"
            catalogue="LR-0414"
            href="#record-sleeve-link"
          />
        </StateRow>
        <StateRow label="Long title">
          <RecordSleeve
            title="Music for Waiting Rooms"
            artist="Ana Lindqvist"
            catalogue="LR-0427"
          />
          <RecordSleeve
            size="sm"
            title="A Slow Walk Home Along the Harbour After the Last Ferry"
            artist="Roy Mensah & His Highlifers with the Gold Coast Strings"
            catalogue="LR-0418"
          />
        </StateRow>
        <StateRow label="Calm hand">
          <div data-hand="calm">
            <RecordSleeve
              title={harbour.title}
              artist={harbour.artist}
              catalogue={harbour.id}
            />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
