import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Skeleton } from "@/fineliner/ui/skeleton"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Skeleton",
  description:
    "A quiet pocket of tint in the shape of content that is still on its way.",
  item: "skeleton",
  group: "Data display",
}

export default function SkeletonDemo() {
  return (
    <DemoSection title="In the content's own geometry">
      <StateRow label="Loading">
        <div
          className="flex w-[20rem] max-w-full items-center gap-tight"
          aria-busy="true"
          aria-label="Loading booking"
        >
          <Skeleton className="size-8 shrink-0 rounded-full" />
          {/* Bars centred in the line boxes of the text they stand in for, so nothing moves when it loads. */}
          <div className="flex flex-1 flex-col">
            <Skeleton className="my-[0.2rem] h-4 w-36" />
            <Skeleton className="my-[0.378rem] h-3 w-52" />
          </div>
        </div>
      </StateRow>
      <StateRow label="Loaded">
        <div className="flex w-[20rem] max-w-full items-center gap-tight">
          <Avatar>
            <AvatarFallback name="Maya Singh">MS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-ui leading-ui font-medium">
              Listening session
            </span>
            <span className="text-small leading-small text-pen-quiet">
              Thursday 19:00 · room 2 · Maya Singh
            </span>
          </div>
        </div>
      </StateRow>
      <StateRow label="Paragraph">
        <div
          className="flex w-full max-w-measure flex-col gap-2.5"
          aria-busy="true"
          aria-label="Loading the record's notes"
        >
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[94%]" />
          <Skeleton className="h-3.5 w-[58%]" />
        </div>
      </StateRow>
      <StateRow label="Sleeve">
        <Skeleton
          className="aspect-square w-40"
          aria-label="Loading the sleeve"
        />
      </StateRow>
    </DemoSection>
  )
}
