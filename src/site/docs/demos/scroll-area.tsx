import { Drawing } from "@/fineliner/drawing/drawing"
import { ScrollArea, ScrollBar } from "@/fineliner/ui/scroll-area"
import { Separator } from "@/fineliner/ui/separator"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Scroll area",
  description:
    "A region that scrolls inside a fixed frame, with a thin pencil scrollbar that stays out of the way of its content.",
  item: "scroll-area",
  group: "Data display",
}

export default function ScrollAreaDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Vertical">
        <ScrollArea className="frame h-72 w-[19rem]">
          <div className="px-snug py-tight">
            <h3 className="label m-0 mb-hair text-pen-quiet">
              The catalogue · {RELEASES.length} records
            </h3>
            {RELEASES.map((r, i) => (
              <div key={r.id}>
                {i > 0 && <Separator />}
                <p className="m-0 flex items-baseline justify-between gap-tight py-hair text-ui leading-ui">
                  <span className="min-w-0 truncate">{r.title}</span>
                  <span className="shrink-0 font-type text-small text-pen-quiet">
                    {r.id}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </StateRow>
      <StateRow label="Horizontal">
        <ScrollArea className="frame w-full max-w-[38rem] [contain:inline-size]">
          <ul className="m-0 flex w-max list-none gap-snug p-snug pb-line">
            {RELEASES.slice(0, 12).map((r) => (
              <li key={r.id} className="flex w-28 flex-col gap-1">
                <Drawing
                  object="record"
                  seed={r.id}
                  title=""
                  className="w-28"
                />
                <span className="truncate text-small leading-small font-medium">
                  {r.title}
                </span>
                <span className="truncate font-type text-small text-pen-quiet">
                  {kroner(r.price)}
                </span>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </StateRow>
    </DemoSection>
  )
}
