import { useCallback, useSyncExternalStore } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/fineliner/ui/carousel"
import { RELEASES, kroner, type Release } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Carousel",
  description:
    "A row of slides to leaf through one at a time, such as this week's records on the counter.",
  item: "carousel",
  group: "Data display",
}

const COUNTER = RELEASES.filter((r) => r.status === "racks").slice(0, 6)
const OBJECTS = ["record", "turntable", "cassette", "radio", "speaker", "crate"]

function Sleeve({ release, object }: { release: Release; object: string }) {
  return (
    <figure className="m-0 flex flex-col gap-hair">
      <Drawing
        object={object}
        seed={release.id}
        title=""
        className="aspect-[4/3] min-h-0 w-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] p-tight [&>svg]:size-full"
      />
      <figcaption className="flex flex-col gap-0.5">
        <span className="font-type text-small text-pen-quiet">
          {release.id} · {kroner(release.price)}
        </span>
        <span className="font-read text-body leading-subhead font-medium">
          {release.title}
        </span>
        <span className="text-small leading-small text-pen-quiet">
          {release.artist}, {release.year}
        </span>
      </figcaption>
    </figure>
  )
}

/** Which slide shows and how many there are, typed: "2 / 6". */
function SlideCount() {
  const { api } = useCarousel()
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return () => {}
      api.on("select", notify)
      api.on("reInit", notify)
      return () => {
        api.off("select", notify)
        api.off("reInit", notify)
      }
    },
    [api],
  )
  const at = useSyncExternalStore(
    subscribe,
    () => (api ? api.selectedScrollSnap() + 1 : 1),
    () => 1,
  )
  const of = useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  )
  return (
    <p
      className="absolute inset-x-0 top-full m-0 mt-tight text-center font-type text-small text-pen-quiet"
      aria-live="polite"
    >
      {of ? `${at} / ${of}` : " "}
    </p>
  )
}

export default function CarouselDemo() {
  return (
    <>
      <DemoSection title="Horizontal">
        <div className="w-full px-12 pb-line">
          <Carousel
            opts={{ align: "start" }}
            aria-label="On the counter this week"
            className="max-w-[40rem]"
          >
            <CarouselContent>
              {COUNTER.map((release, index) => (
                <CarouselItem
                  key={release.id}
                  aria-label={`${index + 1} of ${COUNTER.length}`}
                  className="sm:basis-1/2 lg:basis-1/3"
                >
                  <Sleeve
                    release={release}
                    object={OBJECTS[index % OBJECTS.length]!}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <SlideCount />
          </Carousel>
        </div>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="One at a time">
          <div className="py-14">
            <Carousel
              orientation="vertical"
              aria-label="Records held for Thursday"
              className="w-[15rem]"
            >
              <CarouselContent className="h-[20rem]">
                {RELEASES.filter((r) => r.status === "held").map(
                  (release, index, held) => (
                    <CarouselItem
                      key={release.id}
                      aria-label={`${index + 1} of ${held.length}`}
                    >
                      <Sleeve release={release} object="record" />
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
