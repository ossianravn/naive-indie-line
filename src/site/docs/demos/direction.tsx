import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/fineliner/ui/breadcrumb"
import { Button } from "@/fineliner/ui/button"
import { DirectionProvider } from "@/fineliner/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import { Slider } from "@/fineliner/ui/slider"
import { DemoSection, type DemoMeta } from "../demo-kit"
import { PagePicker } from "./pagination/page-picker"

export const meta: DemoMeta = {
  title: "Direction",
  description:
    "Tells every primitive which way the page reads, so menus, sliders, keyboard arrows and the pen's arrows follow right-to-left text.",
  item: "direction",
  group: "Navigation",
}

type Dir = "ltr" | "rtl"

const LISTS = ["Rainy Thursdays", "For Maya", "Staff picks"]

/** The same small screen in either direction: a trail, a menu with a submenu, a slider and pagination. */
function Composition({ dir }: { dir: Dir }) {
  const [sort, setSort] = useState("artist")
  const [volume, setVolume] = useState(40)
  const [page, setPage] = useState(2)
  const label = `volume-${dir}`
  return (
    <DirectionProvider direction={dir}>
      <div dir={dir} className="flex min-w-0 flex-col gap-snug">
        <p className="label m-0">
          {dir === "ltr" ? "Left to right" : "Right to left"}
        </p>
        <Breadcrumb aria-label={`Trail, ${dir}`}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`#${dir}-shop`}>
                Listening Room
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`#${dir}-catalogue`}>
                Catalogue
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Harbour Lights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="self-start" />}
          >
            Harbour Lights <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent dir={dir}>
            <DropdownMenuItem>Play in the room</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add to list</DropdownMenuSubTrigger>
              <DropdownMenuSubContent dir={dir} side="inline-end">
                {LISTS.map((name) => (
                  <DropdownMenuItem key={name}>{name}</DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort the crate</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="artist">
                  By artist
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="year">
                  By year
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col gap-hair">
          <span id={label} className="label">
            Volume in the room
          </span>
          <div className="flex items-center gap-tight">
            <Slider
              aria-labelledby={label}
              value={volume}
              onValueChange={(v) =>
                setVolume(Array.isArray(v) ? (v[0] ?? 0) : v)
              }
              className="w-48"
            />
            <output
              dir="ltr"
              className="w-10 font-type text-small text-pen-quiet tabular-nums"
            >
              {volume} %
            </output>
          </div>
        </div>
        <PagePicker
          page={page}
          pages={5}
          onPage={setPage}
          className="mx-0 w-auto justify-start"
        />
      </div>
    </DirectionProvider>
  )
}

export default function DirectionDemo() {
  return (
    <DemoSection title="Side by side">
      <div className="grid gap-x-section gap-y-line md:grid-cols-2">
        <Composition dir="ltr" />
        <Composition dir="rtl" />
      </div>
    </DemoSection>
  )
}
