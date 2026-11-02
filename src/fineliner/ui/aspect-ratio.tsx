import { cn } from "@/fineliner/lib/utils"

// A frame of fixed proportion on a pale tint well whose edge wobbles like any pocket. Its children stack to fill it,
// in order, so a Drawing placed before an image holds the frame until the image paints over it, with no script.
// Images and video cover the frame; a drawing sits inside it with air around, contained whatever the ratio. The well
// stands 2px inside the box, so its wobble never shows past a picture's edge.

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn(
        "pocket relative aspect-(--ratio) text-pen before:inset-0.5 before:bg-tint *:absolute *:inset-0 *:size-full [&>img]:object-cover [&>video]:object-cover *:data-[slot=drawing]:inset-[12%] *:data-[slot=drawing]:size-auto *:data-[slot=drawing]:grid-cols-1 *:data-[slot=drawing]:grid-rows-1 [&>[data-slot=drawing]>svg]:size-full",
        className,
      )}
      {...props}
    />
  )
}

export { AspectRatio }
