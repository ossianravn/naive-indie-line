import type { ReactNode } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { AspectRatio } from "@/fineliner/ui/aspect-ratio"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Aspect ratio",
  description:
    "A frame that keeps its proportions as it resizes, holding a drawing in place until the picture it frames has loaded.",
  item: "aspect-ratio",
  group: "Data display",
}

function Plate({
  ratio,
  caption,
  width,
  children,
}: {
  ratio: number
  caption: string
  width: string
  children?: ReactNode
}) {
  return (
    <figure className={`m-0 flex flex-col gap-hair ${width}`}>
      <AspectRatio ratio={ratio}>{children}</AspectRatio>
      <figcaption className="text-small leading-small text-pen-quiet">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function AspectRatioDemo() {
  return (
    <DemoSection title="Ratios">
      <StateRow label="3 : 2">
        <Plate
          ratio={3 / 2}
          caption="The listening room at opening time"
          width="w-full max-w-[26rem]"
        >
          <Drawing scene="room" seed="listening-room" />
        </Plate>
      </StateRow>
      <StateRow label="1 : 1">
        <Plate
          ratio={1}
          caption="Harbour Lights · Ellen Moe Trio"
          width="w-full max-w-[16rem]"
        >
          <Drawing object="record" seed="LR-0431" />
        </Plate>
      </StateRow>
      <StateRow label="16 : 9, empty">
        <Plate
          ratio={16 / 9}
          caption="Dub at dusk, Thursday 12 November"
          width="w-full max-w-[26rem]"
        />
      </StateRow>
    </DemoSection>
  )
}
