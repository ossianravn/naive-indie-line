import { useEffect, useState } from "react"
import {
  CalendarPlusIcon,
  DiscIcon,
  FileTextIcon,
  PlusIcon,
  UserIcon,
  WineIcon,
} from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/fineliner/ui/command"
import { Kbd } from "@/fineliner/ui/kbd"
import { RELEASES } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Command",
  description:
    "A searchable index of the shop, for jumping to a record, a person or an action by typing.",
  item: "command",
  group: "Overlays",
}

const RECORDS = RELEASES.slice(0, 4)
const PEOPLE = ["Maya Singh", "Jonas Berg", "Ama Owusu"]
const PAGES = ["Catalogue", "Bookings", "Thursday events", "Wine list"]

function ShopIndex() {
  return (
    <>
      <CommandEmpty>Nothing matches. Try the artist’s name.</CommandEmpty>
      <CommandGroup heading="Records">
        {RECORDS.map((r) => (
          <CommandItem key={r.id} value={`${r.title} ${r.artist} ${r.id}`}>
            <DiscIcon />
            <span>{r.title}</span>
            <span className="truncate text-small text-pen-quiet">
              {r.artist}
            </span>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="People">
        {PEOPLE.map((name) => (
          <CommandItem key={name} value={name}>
            <UserIcon />
            {name}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Go to">
        {PAGES.map((page) => (
          <CommandItem
            key={page}
            value={page}
            data-checked={page === "Bookings"}
          >
            <FileTextIcon />
            {page}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem value="Add a record">
          <PlusIcon />
          Add a record
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem value="Book a listening session">
          <CalendarPlusIcon />
          Book a listening session
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem value="Print the wine list" disabled>
          <WineIcon />
          Print the wine list
        </CommandItem>
      </CommandGroup>
    </>
  )
}

function Palette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search the shop
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the shop"
        description="Records, people, pages and actions"
      >
        <Command>
          <CommandInput placeholder="Record, person or action" />
          <CommandList>
            <ShopIndex />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function CommandDemo() {
  const [query, setQuery] = useState("Moondog")
  return (
    <>
      <DemoSection title="Inline">
        <StateRow label="Index">
          <Command className="h-auto max-w-md" label="Search the shop">
            <CommandInput placeholder="Record, person or action" />
            <CommandList>
              <ShopIndex />
            </CommandList>
          </Command>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Dialog">
          <Palette />
        </StateRow>
        <StateRow label="Nothing found">
          <Command className="h-auto max-w-md" label="Search records">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Title or artist"
            />
            <CommandList>
              <CommandEmpty>
                Nothing matches. Try the artist’s name.
              </CommandEmpty>
              <CommandGroup heading="Records">
                {RECORDS.map((r) => (
                  <CommandItem key={r.id} value={`${r.title} ${r.artist}`}>
                    {r.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </StateRow>
      </DemoSection>
    </>
  )
}
