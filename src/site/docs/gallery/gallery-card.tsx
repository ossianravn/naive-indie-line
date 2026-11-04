import type { ComponentType } from "react"
import { LabelCard } from "@/fineliner/extras/label-card"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { TooltipProvider } from "@/fineliner/ui/tooltip"
import { DemoPreview, previewClaim, type DemoMeta } from "../demo-kit"
import { Scaled } from "./parts"
import { PREVIEWS, SCALE } from "./previews"

// One component on the Components index: a label card whose art is the part itself at rest, drawn in a border like a
// label's picture. The preview renders on the server from the component's own demo (its first example row), or from
// a preview made for the index where that row would not show the part (overlays open in a portal, only in the
// browser). It is a picture, not a control: hidden from assistive technology and inert, so the card's title link,
// which covers the card, is its one target. A preview taller than the plate is cropped from the top, never squeezed.

type DemoModule = { default: ComponentType; meta: DemoMeta }
const modules = import.meta.glob<DemoModule>("../demos/*.tsx", { eager: true })
const demos = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    mod,
  ]),
)

export function GalleryCard({ name }: { name: string }) {
  const demo = demos[name]
  if (!demo) return null
  const Preview = PREVIEWS[name] ?? demo.default
  const scale = PREVIEWS[name] ? undefined : SCALE[name]
  return (
    <LabelCard
      title={demo.meta.title}
      href={`/docs/components/${name}`}
      seed={name}
      className="h-full w-full"
      art={
        <div
          className="frame relative h-52 [--over:3px] calm:[--over:1px]"
          style={frameStyle(`${name}:plate`)}
        >
          <div
            aria-hidden="true"
            inert
            data-preview-plate
            className="pointer-events-none absolute inset-0 grid items-center-safe justify-items-center overflow-hidden px-snug py-tight select-none [&_.fl-unseen]:opacity-100!"
          >
            <div className="flex w-full min-w-0 justify-center">
              <TooltipProvider>
                <DemoPreview.Provider value={previewClaim()}>
                  {scale ? (
                    <Scaled by={scale}>
                      <Preview />
                    </Scaled>
                  ) : (
                    <Preview />
                  )}
                </DemoPreview.Provider>
              </TooltipProvider>
            </div>
          </div>
        </div>
      }
    >
      <p className="m-0 text-small leading-small text-pen-quiet">
        {demo.meta.description}
      </p>
    </LabelCard>
  )
}
