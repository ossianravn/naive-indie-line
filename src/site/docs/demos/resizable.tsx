import { Fragment } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/fineliner/ui/resizable"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Resizable",
  description:
    "Panels side by side or stacked, divided by a pen line you can drag to give one of them more room.",
  item: "resizable",
  group: "Data display",
}

// The group fills its parent (react-resizable-panels sets height: 100% inline), so the parent sets the size, and
// carries the frame, so the group's own clipping never cuts the frame's overshoot.
const BOX = "frame w-full max-w-[44rem]"
const LIST = RELEASES.slice(0, 6)
const HARBOUR = RELEASES[0]!

const TONIGHT = [
  ["Booked", "14"],
  ["Seats left", "6"],
  ["On the list", "23"],
] as const

function Notes() {
  return (
    <div className="flex h-full flex-col gap-hair overflow-auto p-snug">
      <p className="label m-0 text-pen-quiet">
        {HARBOUR.artist} · {HARBOUR.year}
      </p>
      <h3 className="m-0 text-lead leading-subhead">{HARBOUR.title}</h3>
      <p className="m-0 max-w-measure text-ui leading-small text-pen-quiet">
        {HARBOUR.note} Side one opens with a brushed snare and a piano that
        sounds as if it is in the next room; by the third track the trio is in
        the room with you.
      </p>
      <p className="m-0 font-type text-small">
        {HARBOUR.id} · {kroner(HARBOUR.price)}
      </p>
    </div>
  )
}

export default function ResizableDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Horizontal">
        <div className={`${BOX} h-72`}>
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="38%" minSize="25%">
              <ul
                tabIndex={0}
                aria-label="Records in the rack"
                className="m-0 h-full list-none overflow-auto p-hair"
              >
                {LIST.map((r, i) => (
                  <li
                    key={r.id}
                    aria-current={i === 0 ? "true" : undefined}
                    className="pocket flex flex-col px-tight py-1.5 aria-current:before:bg-tint"
                  >
                    <span className="truncate text-ui leading-ui in-aria-current:font-medium">
                      {r.title}
                    </span>
                    <span className="truncate text-small text-pen-quiet">
                      {r.artist}
                    </span>
                  </li>
                ))}
              </ul>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize the list" />
            <ResizablePanel defaultSize="62%" minSize="35%">
              <Notes />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StateRow>
      <StateRow label="Vertical">
        <div className={`${BOX} h-[24rem]`}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="45%" minSize="25%">
              <div className="flex h-full items-center justify-center p-snug">
                <Drawing
                  scene="room"
                  seed="listening-room"
                  className="size-full grid-cols-1 grid-rows-1 [&>svg]:size-full"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize the drawing" />
            <ResizablePanel defaultSize="55%" minSize="25%">
              <Notes />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StateRow>
      <StateRow label="Line only">
        <div className={`${BOX} h-40`}>
          <ResizablePanelGroup orientation="horizontal">
            {TONIGHT.map(([label, value], i) => (
              <Fragment key={label}>
                {i > 0 ? (
                  <ResizableHandle aria-label={`Resize ${label}`} />
                ) : null}
                <ResizablePanel defaultSize="33%" minSize="20%">
                  <div className="flex h-full flex-col justify-between p-snug">
                    <span className="label text-pen-quiet">{label}</span>
                    <span className="font-read text-h2 leading-heading tabular-nums">
                      {value}
                    </span>
                  </div>
                </ResizablePanel>
              </Fragment>
            ))}
          </ResizablePanelGroup>
        </div>
      </StateRow>
    </DemoSection>
  )
}
