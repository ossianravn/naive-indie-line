import { useEffect, useId, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { Label } from "@/fineliner/ui/label"
import { Switch } from "@/fineliner/ui/switch"

// "Show parts": a switch for a demo's strip that names every kit part on the page. Each part gets a dashed outline
// and a tag with its component's name, a link to its docs page, so a demo doubles as its own documentation. Parts are
// found by shadcn's data-slot attribute; a trigger (dialog-trigger, popover-trigger) is named after what it opens, and
// a part inside another of the same kind is named once. The overlay is the demo's, not the kit's: it measures the
// page, and redraws when the page changes size or something opens. The choice is kept, so it follows the visitor
// from page to page.

const KEY = "fineliner-parts"

/** Every component with a docs page, by its slot. Wrappers that would only box their own parts again are left out. */
const DOCS = [
  "accordion",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "dialog",
  "drawer",
  "drawn-border",
  "dropdown-menu",
  "edition-number",
  "empty",
  "hand-note",
  "hover-card",
  "input",
  "input-otp",
  "label-card",
  "native-select",
  "pagination",
  "popover",
  "price-tag",
  "progress",
  "pull-quote",
  "radio-group",
  "select",
  "sheet",
  "slider",
  "switch",
  "table",
  "tabs",
  "tasting-note",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
]
/** Parts documented outside the component pages. */
const PAGES: Record<string, string> = {
  drawing: "/drawings",
  lettering: "/specimen#lettering",
}

interface Part {
  name: string
  href: string
  box: { top: number; left: number; width: number; height: number }
}

const pascal = (slot: string) =>
  slot.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase())

/** The docs page a slot belongs to, if it is a part worth naming. */
function docsOf(slot: string) {
  if (PAGES[slot]) return { slot, href: PAGES[slot] }
  const kind = slot.replace(/-trigger$/, "")
  return DOCS.includes(kind)
    ? { slot: kind, href: `/docs/components/${kind}` }
    : undefined
}

function findParts(): Part[] {
  const parts: Part[] = []
  for (const element of document.querySelectorAll<HTMLElement>("[data-slot]")) {
    if (element.closest("[data-parts-skip]")) continue
    const docs = docsOf(element.dataset.slot ?? "")
    if (!docs) continue
    // Name a part once: not again inside another of its kind (a toggle in a toggle group is the group's).
    const outer = element.parentElement?.closest<HTMLElement>("[data-slot]")
    if (outer && docsOf(outer.dataset.slot ?? "")?.slot === docs.slot) continue
    const rect = element.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) continue
    parts.push({
      name: pascal(docs.slot),
      href: docs.href,
      box: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      },
    })
  }
  return parts
}

const CHANGED = "fineliner-parts-change"

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(CHANGED, onChange)
    window.removeEventListener("storage", onChange)
  }
}

function stored() {
  try {
    return localStorage.getItem(KEY) === "on"
  } catch {
    return false // blocked storage starts with the parts hidden
  }
}

/** The switch's state, kept in local storage; off on the server and while hydrating. */
function useStoredSwitch() {
  const on = useSyncExternalStore(subscribe, stored, () => false)
  const set = (next: boolean) => {
    try {
      localStorage.setItem(KEY, next ? "on" : "off")
    } catch {
      // Blocked storage: nothing to keep it in, so it stays off.
    }
    window.dispatchEvent(new Event(CHANGED))
  }
  return [on, set] as const
}

function Overlay() {
  const [parts, setParts] = useState<Part[]>([])
  useEffect(() => {
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setParts(findParts()))
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(document.body)
    // Portals (a calendar's popover, a dialog) come and go at the end of <body>.
    const changes = new MutationObserver(measure)
    changes.observe(document.body, { childList: true, subtree: true })
    window.addEventListener("resize", measure)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      changes.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])
  return createPortal(
    <div
      data-parts-skip=""
      aria-label="Parts on this page"
      role="list"
      className="pointer-events-none absolute inset-x-0 top-0 z-40"
    >
      {parts.map(({ name, href, box }, i) => (
        <div
          key={i}
          role="listitem"
          className="absolute rounded-[3px] outline-1 outline-offset-2 outline-pen outline-dashed"
          style={box}
        >
          <a
            href={href}
            className="pointer-events-auto absolute -top-[1.35rem] left-0 bg-pen px-1 font-type text-[0.6875rem] leading-[1.1rem] whitespace-nowrap text-paper no-underline hover:underline"
          >
            {name}
          </a>
        </div>
      ))}
    </div>,
    document.body,
  )
}

/** The switch, and the parts named over the page while it is on. */
export function PartsXray({ className }: { className?: string }) {
  const id = useId()
  const [on, setOn] = useStoredSwitch()
  return (
    <div className={className} data-parts-skip="">
      <div className="flex items-center gap-tight">
        <Switch id={id} size="sm" checked={on} onCheckedChange={setOn} />
        <Label htmlFor={id} className="text-small font-normal text-pen-quiet">
          Show parts
        </Label>
      </div>
      {on && <Overlay />}
    </div>
  )
}
