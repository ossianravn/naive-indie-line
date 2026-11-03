import {
  BookmarkIcon,
  ChevronDownIcon,
  HeadphonesIcon,
  ListPlusIcon,
} from "lucide-react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { MenuRow, MenuRule, PageLines, Sheet, Strip } from "./parts"

// Overlays as they look open, for the Components index; each mirrors its demo's first example.

function Title({ children }: { children: string }) {
  return (
    <p className="m-0 font-read text-lead leading-subhead font-medium">
      {children}
    </p>
  )
}

function DropdownMenuPreview() {
  return (
    <div className="flex flex-col items-start gap-tight">
      <Button variant="outline" size="sm">
        Quiet Hours <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Sheet seed="gallery:dropdown" className="w-max p-1">
        <MenuRow active shortcut="H">
          <BookmarkIcon className="size-4" /> Hold
        </MenuRow>
        <MenuRow shortcut="P">
          <HeadphonesIcon className="size-4" /> Play in the room
        </MenuRow>
        <MenuRow>
          <ListPlusIcon className="size-4" /> Add to list
        </MenuRow>
      </Sheet>
    </div>
  )
}

function ContextMenuPreview() {
  return (
    <div className="flex w-64 flex-col">
      <div className="flex items-baseline justify-between gap-tight border-b border-dotted border-pen-faint py-hair">
        <span className="text-ui leading-ui">Quiet Hours</span>
        <span className="font-type text-small text-pen-quiet">180 kr</span>
      </div>
      <Sheet seed="gallery:context" className="-mt-1 ms-[32%] w-max p-1">
        <MenuRow>Open</MenuRow>
        <MenuRow active>Hold for a week</MenuRow>
        <MenuRule />
        <MenuRow danger>Mark as sold</MenuRow>
      </Sheet>
    </div>
  )
}

function DialogSheet({
  seed,
  title,
  body,
  cancel,
  action,
  destructive,
}: {
  seed: string
  title: string
  body: string
  cancel: string
  action: string
  destructive?: boolean
}) {
  return (
    <Sheet seed={seed} className="grid w-[17rem] gap-tight p-snug">
      <Title>{title}</Title>
      <p className="m-0 text-pen-quiet">{body}</p>
      <div className="flex justify-end gap-tight">
        <Button variant="outline" size="sm">
          {cancel}
        </Button>
        <Button variant={destructive ? "destructive" : "default"} size="sm">
          {action}
        </Button>
      </div>
    </Sheet>
  )
}

function DialogPreview() {
  return (
    <Sheet seed="gallery:dialog" className="grid w-max gap-tight p-snug">
      <Title>Book a listening session</Title>
      <div className="flex items-end gap-tight">
        <Input
          placeholder="e.g. Maya Singh"
          className="h-control-compact w-40"
        />
        <Input
          defaultValue="2"
          className="h-control-compact w-12 text-center tabular-nums"
        />
      </div>
      <div className="flex justify-end">
        <Button size="sm">Book</Button>
      </div>
    </Sheet>
  )
}

function SheetPreview() {
  return (
    <div className="flex h-40 w-full max-w-[19rem] overflow-hidden ps-hair pt-hair pb-3">
      <div className="flex-1 pe-snug pt-tight">
        <PageLines widths={[80, 95, 60, 90, 70]} />
      </div>
      <Sheet seed="gallery:sheet" className="w-[58%] p-tight">
        <p className="label m-0 text-pen-quiet">LR-0431</p>
        <Title>Harbour Lights</Title>
        <p className="m-0 mt-hair text-pen-quiet">Ellen Moe Trio · 1974</p>
        <p className="m-0 font-type text-pen-quiet">320 kr</p>
      </Sheet>
    </div>
  )
}

function DrawerPreview() {
  return (
    <div className="flex h-40 w-full max-w-[19rem] flex-col justify-between overflow-hidden px-hair pt-tight">
      <PageLines widths={[70, 90, 55]} />
      <Sheet seed="gallery:drawer" className="me-2 px-snug pb-snug text-center">
        <PenMark
          name="underline"
          seed="drawer-handle"
          hand="calm"
          className="mx-auto h-6 w-12 py-2 text-pen-quiet [--pen-weight:var(--pen-weight-pressed)]"
        />
        <p className="m-0 font-medium">Book a seat</p>
        <p className="m-0 text-pen-quiet">Thursday 5 November · 19:00</p>
      </Sheet>
    </div>
  )
}

function PopoverPreview() {
  return (
    <div className="flex flex-col items-start gap-tight">
      <Button variant="outline" size="sm">
        Thursday listening <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Sheet seed="gallery:popover" className="w-60 p-tight">
        <p className="m-0 font-medium">Thursday 5 November, 19:00</p>
        <p className="m-0 text-pen-quiet">By the window · 3 of 8 seats left</p>
      </Sheet>
    </div>
  )
}

function TooltipPreview() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Strip>Play in the room</Strip>
      <Button variant="outline" size="icon">
        <HeadphonesIcon />
      </Button>
    </div>
  )
}

function SonnerPreview() {
  return (
    <Sheet
      seed="toast"
      className="flex w-[17rem] items-start gap-tight py-tight ps-snug pe-tight"
    >
      <PenMark
        name="tick"
        seed="toast:success"
        hand="calm"
        className="mt-px size-5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="m-0 font-ui text-ui leading-ui font-medium">
          Session booked
        </p>
        <p className="m-0 text-pen-quiet">Maya Singh · Thursday, 18:00</p>
      </div>
    </Sheet>
  )
}

function HoverCardPreview() {
  return (
    <div className="flex w-64 flex-col">
      <p className="m-0 text-small leading-small">
        On Thursday{" "}
        <span className="underline decoration-dotted underline-offset-[0.2em]">
          Jonas Berg
        </span>{" "}
        plays Harbour Lights, both sides.
      </p>
      <Sheet
        seed="gallery:hover-card"
        className="mt-tight ms-[18%] w-52 p-tight"
      >
        <div className="flex items-center gap-tight">
          <Avatar size="sm">
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="m-0 font-medium">Jonas Berg</p>
            <p className="m-0 text-pen-quiet">Hosts 12 November</p>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

export const OVERLAY_PREVIEWS = {
  "dropdown-menu": DropdownMenuPreview,
  "context-menu": ContextMenuPreview,
  dialog: DialogPreview,
  "alert-dialog": () => (
    <DialogSheet
      seed="gallery:alert-dialog"
      title="Cancel Maya’s booking?"
      body="Her two seats go back on the list."
      cancel="Keep it"
      action="Cancel booking"
      destructive
    />
  ),
  sheet: SheetPreview,
  drawer: DrawerPreview,
  popover: PopoverPreview,
  tooltip: TooltipPreview,
  sonner: SonnerPreview,
  "hover-card": HoverCardPreview,
}
