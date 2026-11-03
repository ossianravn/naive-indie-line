import { useEffect, useRef, useState } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

// A block running in a frame of its own page, so it lays out for the frame's width (full width, or a 390 px phone)
// and its fixed and full-height parts behave as they would in an app. A segmented control picks the width, another
// the state for blocks with variants; the link opens the frame's page on its own. At desktop width the frame takes
// its page's whole height, measured in the frame (same origin) and followed as the block changes, so the page reads
// top to bottom with the rest of the docs; at phone width it keeps a phone's height and scrolls inside.

const PHONE = 390

/** The height of the frame's page, followed while `on`; undefined when off or not yet measured. */
function useFittedHeight(src: string, on: boolean) {
  const frame = useRef<HTMLIFrameElement>(null)
  // Kept with the frame and width it was measured for, so a new frame or width starts from the default height.
  const key = `${src} ${on}`
  const [fit, setFit] = useState<{ key: string; height: number }>()
  useEffect(() => {
    const el = frame.current
    if (!el || !on) return
    let observer: ResizeObserver | undefined
    const attach = () => {
      const doc = el.contentDocument
      const main = doc?.querySelector("main")
      if (!doc || !main || !el.contentWindow) return
      observer?.disconnect()
      // The page never scrolls in a fitted frame, so it keeps no gutter for a scrollbar.
      doc.documentElement.style.scrollbarGutter = "auto"
      const measure = () =>
        setFit({ key, height: Math.ceil(main.getBoundingClientRect().bottom) })
      const win = el.contentWindow as typeof window
      observer = new win.ResizeObserver(measure)
      observer.observe(main)
      measure()
    }
    el.addEventListener("load", attach)
    if (el.contentDocument?.readyState === "complete") attach()
    return () => {
      el.removeEventListener("load", attach)
      observer?.disconnect()
      if (el.contentDocument)
        el.contentDocument.documentElement.style.scrollbarGutter = ""
    }
  }, [key, on])
  return [frame, fit?.key === key ? fit.height : undefined] as const
}

/** "no-results" → "No results". */
const variantLabel = (variant: string) =>
  variant.charAt(0).toUpperCase() + variant.slice(1).replaceAll("-", " ")

export function BlockPreview({
  name,
  title,
  variants,
}: {
  name: string
  title: string
  variants?: readonly string[]
}) {
  const [width, setWidth] = useState<"desktop" | "phone">("desktop")
  const [variant, setVariant] = useState(variants?.[0])
  const src = `/docs/blocks/view/${name}${variant && variant !== variants?.[0] ? `/${variant}` : ""}`
  const phone = width === "phone"
  const [frame, height] = useFittedHeight(src, !phone)

  return (
    <div className="@container/preview">
      <div className="flex flex-wrap items-center gap-x-snug gap-y-tight">
        {variants && (
          <ToggleGroup
            aria-label={`${title} state`}
            variant="outline"
            size="sm"
            spacing={0}
            value={variant ? [variant] : []}
            onValueChange={(next: unknown[]) =>
              next[0] && setVariant(next[0] as string)
            }
          >
            {variants.map((v) => (
              <ToggleGroupItem key={v} value={v}>
                {variantLabel(v)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        {/* Below phone width plus the frame's gutter both widths are the same, so the choice goes. */}
        <ToggleGroup
          aria-label="Preview width"
          variant="outline"
          size="sm"
          spacing={0}
          value={[width]}
          onValueChange={(next: unknown[]) =>
            next[0] && setWidth(next[0] as "desktop" | "phone")
          }
          className="@max-[30rem]/preview:hidden"
        >
          <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
          <ToggleGroupItem value="phone">Phone</ToggleGroupItem>
        </ToggleGroup>
        <a
          href={src}
          target="_blank"
          rel="noopener"
          className="label ms-auto inline-flex items-center gap-hair text-pen-quiet no-underline hover:text-pen"
        >
          Open
          <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{title} in a new tab</span>
        </a>
      </div>
      {/* The drawn frame is the window's edge; at phone width a narrower page stands in it, its sides ruled. */}
      <div
        className="frame mt-tight p-1.5 text-pen-faint"
        style={frameStyle(`preview ${name}`)}
      >
        <div
          className="relative mx-auto max-w-full"
          style={{ width: phone ? PHONE : "100%" }}
        >
          {phone && (
            <>
              <span
                aria-hidden="true"
                className="rule-y absolute inset-y-0 -left-1.5"
              />
              <span
                aria-hidden="true"
                className="rule-y absolute inset-y-0 -right-1.5"
              />
            </>
          )}
          <iframe
            key={src}
            ref={frame}
            src={src}
            title={`${title} preview`}
            loading="lazy"
            style={height ? { height } : undefined}
            className={cn(
              "block w-full bg-paper",
              !height && "h-[44rem] max-h-[80dvh]",
            )}
          />
        </div>
      </div>
    </div>
  )
}
