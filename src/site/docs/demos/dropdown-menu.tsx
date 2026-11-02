import { useState } from "react"
import {
  BookmarkIcon,
  ChevronDownIcon,
  EllipsisIcon,
  HeadphonesIcon,
  ListPlusIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dropdown menu",
  description:
    "A drawn list of actions or view options that opens from a button and closes once one is chosen.",
  item: "dropdown-menu",
  group: "Overlays",
}

const LISTS = ["Rainy Thursdays", "For Maya", "Staff picks"]

/** The actions on one record: icons and shortcuts, a submenu, a toggle, a disabled item and a destructive one. */
function RecordItems() {
  const [inWindow, setInWindow] = useState(true)
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Quiet Hours · Nº 0412</DropdownMenuLabel>
        <DropdownMenuItem>
          <BookmarkIcon /> Hold
          <DropdownMenuShortcut>H</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HeadphonesIcon /> Play in the room
          <DropdownMenuShortcut>P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ListPlusIcon /> Add to list
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LISTS.map((name) => (
              <DropdownMenuItem key={name}>{name}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        inset
        checked={inWindow}
        onCheckedChange={setInWindow}
      >
        Show in the window
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>
        <TagIcon /> Reprice (on hold)
      </DropdownMenuItem>
      <DropdownMenuItem variant="destructive">
        <Trash2Icon /> Remove
        <DropdownMenuShortcut>Del</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  )
}

/** A catalogue row: the record, its details, and its menu at the end. */
function RecordRow() {
  return (
    <div className="flex w-full max-w-[28rem] items-center gap-snug">
      <div className="min-w-0">
        <div className="text-ui leading-ui">Quiet Hours</div>
        <div className="text-small leading-small text-pen-quiet">
          Saltwater Choir · 33⅓ · 1979
        </div>
      </div>
      <span className="ms-auto font-type text-small">24.00</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Actions for Quiet Hours"
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <RecordItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function DropdownMenuDemo() {
  const [sort, setSort] = useState("artist")
  const [inStock, setInStock] = useState(true)
  const [prices, setPrices] = useState(false)
  return (
    <>
      <DemoSection title="On a record">
        <StateRow label="Row actions">
          <RecordRow />
        </StateRow>
      </DemoSection>
      <DemoSection title="Open with the trigger">
        <StateRow label="Actions">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Quiet Hours <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <RecordItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </StateRow>
        <StateRow label="View options">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
              View <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort the crate</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="artist">
                    By artist
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="year">
                    By year
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="added">
                    Newest in
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Show</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={inStock}
                  onCheckedChange={setInStock}
                >
                  In stock only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={prices}
                  onCheckedChange={setPrices}
                >
                  Prices
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem disabled>
                  Signed copies (none yet)
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </StateRow>
      </DemoSection>
    </>
  )
}
