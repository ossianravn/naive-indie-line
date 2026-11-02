import type { ReactNode } from "react"
import { EllipsisIcon, type LucideIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import { Separator } from "@/fineliner/ui/separator"
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/fineliner/ui/sidebar"
import { RELEASES, STATUS_LABEL, kroner } from "@/site/listening-room/data"

// The sidebar demo's Listening Room: its Thursday evenings, saved lists and the page beside the sidebar.

export const EVENINGS = [
  ["Thu 5 Nov", "Harbour Lights", "Ellen Moe Trio, both sides", 14],
  ["Thu 12 Nov", "Dub at dusk", "Ama Owusu plays Low Tide Dub", 22],
  ["Thu 19 Nov", "Library hour", "Library Ensemble Nº 4 and friends", 9],
  [
    "Thu 26 Nov",
    "Bring a record",
    "One side each; Jonas Berg keeps the list",
    17,
  ],
] as const

const held = RELEASES.filter((r) => r.status === "held")
const rainy = RELEASES.filter((r) =>
  ["Folk", "Jazz", "Ambient"].includes(r.genre),
)

export const LISTS = [
  ["Rainy Thursdays", rainy],
  ["Held for customers", held],
  ["New arrivals", RELEASES.slice(0, 5)],
] as const

type Row = readonly [title: string, detail: string, aside: string]

const records = (list: readonly (typeof RELEASES)[number][]): Row[] =>
  list.map((r) => [r.title, r.artist, kroner(r.price)])

export const BOOKINGS: Row[] = [
  ["Maya Singh", "Thu 5 Nov · 2 seats · Neon Orchard", "18:00"],
  ["Jonas Berg", "Thu 5 Nov · 1 seat · Paper Moons", "19:00"],
  ["Ama Owusu", "Thu 12 Nov · 3 seats · Rain on Tin", "19:00"],
  ["Maya Singh", "Thu 19 Nov · 2 seats", "20:00"],
]

const count = (status: string) =>
  String(RELEASES.filter((r) => r.status === status).length)

/** What the page beside the sidebar lists for each place in it. */
function rowsFor(open: string): Row[] {
  const evening = EVENINGS.find(([day]) => day === open)
  if (evening)
    return [
      [evening[1], evening[2], `${evening[3]} booked`],
      ...BOOKINGS.filter(([, detail]) => detail.startsWith(open)),
    ]
  const list = LISTS.find(([name]) => name === open)
  if (list) return records(list[1])
  if (open === "Sessions") return BOOKINGS
  if (open === "Overview")
    return (["racks", "held", "sold"] as const).map((s) => [
      STATUS_LABEL[s],
      "Records",
      count(s),
    ])
  if (open === "Settings")
    return [
      ["Name", "Maya Singh", ""],
      ["Paper", "Recycled, day", ""],
      ["The Thursday list", "Monday mornings", "On"],
    ]
  return records(RELEASES.slice(0, 8))
}

/** The page beside the sidebar: the open place as a ruled list. */
export function Page({ open }: { open: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-snug">
      <ul className="m-0 flex max-w-[38rem] list-none flex-col p-0">
        {rowsFor(open).map(([title, detail, aside], i) => (
          <li key={`${title}-${i}`}>
            {i > 0 && <Separator />}
            <div className="flex items-baseline justify-between gap-tight py-hair">
              <span className="min-w-0">
                <span className="block truncate text-ui leading-ui">
                  {title}
                </span>
                <span className="block truncate text-small text-pen-quiet">
                  {detail}
                </span>
              </span>
              <span className="shrink-0 font-type text-small">{aside}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** One place in the sidebar; choosing it on a phone also closes the sheet. */
export function NavItem({
  name,
  icon: Icon,
  count,
  open,
  onOpen,
  children,
}: {
  name: string
  icon: LucideIcon
  count?: number
  open: string
  onOpen: (name: string) => void
  children?: ReactNode
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={open === name}
        aria-current={open === name ? "page" : undefined}
        tooltip={name}
        onClick={() => {
          onOpen(name)
          setOpenMobile(false)
        }}
      >
        <Icon />
        <span>{name}</span>
      </SidebarMenuButton>
      {count !== undefined && <SidebarMenuBadge>{count}</SidebarMenuBadge>}
      {children}
    </SidebarMenuItem>
  )
}

/** The Thursday evenings, hung under Sessions. */
export function EveningsSub({
  open,
  onOpen,
}: {
  open: string
  onOpen: (name: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuSub>
      {EVENINGS.map(([day, name]) => (
        <SidebarMenuSubItem key={day}>
          <SidebarMenuSubButton
            href={`#${day.toLowerCase().replaceAll(" ", "-")}`}
            isActive={open === day}
            aria-current={open === day ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault()
              onOpen(day)
              setOpenMobile(false)
            }}
          >
            <span>
              {day.replace("Thu ", "")} · {name}
            </span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}

/** A saved list's menu: share, rename or delete, shown while its row is hovered or focused. */
export function ListActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
        <EllipsisIcon />
        <span className="sr-only">More for {name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem>Share list</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete list</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
