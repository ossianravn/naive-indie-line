import { useState } from "react"
import {
  TrackList,
  TrackListItem,
  TrackListSide,
} from "@/fineliner/extras/track-list"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Track list",
  description:
    "A record's sides as lists, with numbers and running times in the typewriter, dotted leaders, and the playing track marked by the pen.",
  item: "track-list",
  group: "Fineliner extras",
}

// Harbour Lights, Ellen Moe Trio (LR-0431).
const SIDES = [
  {
    side: "A",
    time: "19:40",
    tracks: [
      ["A1", "Harbour Lights", "6:12"],
      ["A2", "Grey Morning at Kastrup", "4:48"],
      ["A3", "The Ferry Bell", "5:30"],
      ["A4", "Nordlys", "3:10"],
    ],
  },
  {
    side: "B",
    time: "20:22",
    tracks: [
      ["B1", "Low Water", "7:05"],
      ["B2", "Lanterns on the Quay", "4:21"],
      ["B3", "Ellen’s Waltz", "3:54"],
      ["B4", "Last Ferry Home", "5:02"],
    ],
  },
] as const

function Sides({
  playing,
  mark,
  heard = [],
}: {
  playing?: string
  mark?: "ring" | "tick"
  heard?: string[]
}) {
  return SIDES.map(({ side, time, tracks }) => (
    <TrackListSide key={side} title={`Side ${side}`} duration={time}>
      {tracks.map(([n, title, length]) => (
        <TrackListItem
          key={n}
          number={n}
          duration={length}
          playing={n === playing}
          mark={n === playing ? mark : heard.includes(n) ? "tick" : undefined}
        >
          {title}
        </TrackListItem>
      ))}
    </TrackListSide>
  ))
}

function Player() {
  const [playing, setPlaying] = useState("A2")
  return (
    <TrackList className="max-w-[48rem] md:grid-cols-2">
      {SIDES.map(({ side, time, tracks }) => (
        <TrackListSide key={side} title={`Side ${side}`} duration={time}>
          {tracks.map(([n, title, length]) => (
            <TrackListItem
              key={n}
              number={n}
              duration={length}
              playing={n === playing}
            >
              <button
                type="button"
                onClick={() => setPlaying(n)}
                className="cursor-pointer text-start decoration-pen-faint underline-offset-4 hover:underline"
              >
                {title}
              </button>
            </TrackListItem>
          ))}
        </TrackListSide>
      ))}
    </TrackList>
  )
}

export default function TrackListDemo() {
  return (
    <>
      <DemoSection title="Marks">
        <StateRow label="Playing (ring)">
          <TrackList>
            <Sides playing="B1" />
          </TrackList>
        </StateRow>
        <StateRow label="Playing (tick)">
          <TrackList>
            <Sides playing="A3" mark="tick" />
          </TrackList>
        </StateRow>
        <StateRow label="Heard, then playing">
          <TrackList>
            <Sides playing="A3" heard={["A1", "A2"]} />
          </TrackList>
        </StateRow>
        <StateRow label="Nothing playing">
          <TrackList>
            <Sides />
          </TrackList>
        </StateRow>
      </DemoSection>
      <DemoSection title="Side by side">
        <StateRow label="Choose a track">
          <Player />
        </StateRow>
      </DemoSection>
      <DemoSection title="Long titles">
        <StateRow label="Wrapping">
          <TrackList>
            <TrackListSide title="Side C" duration="24:15">
              <TrackListItem number="C1" duration="9:47" playing>
                A Slow Walk Home Along the Harbour After the Last Ferry Has Gone
                (Alternate Take)
              </TrackListItem>
              <TrackListItem number="C2" duration="14:28">
                Nordlys
              </TrackListItem>
            </TrackListSide>
          </TrackList>
        </StateRow>
      </DemoSection>
    </>
  )
}
