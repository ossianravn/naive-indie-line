import { useState } from "react"
import {
  BookmarkIcon,
  HeadphonesIcon,
  ListPlusIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/fineliner/ui/context-menu"
import {
  RELEASES,
  STATUS_LABEL,
  kroner,
  type Release,
  type Status,
} from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Context menu",
  description:
    "The actions for one thing, opened where the pointer is with a right-click or a long press.",
  item: "context-menu",
  group: "Overlays",
}

const LISTS = ["Rainy Thursdays", "For Maya", "Staff picks"]
const ROWS = RELEASES.slice(0, 4)

/** One catalogue row; right-click or long-press it for its actions. */
function Row({
  item,
  status,
  onStatus,
  inWindow,
  onWindow,
}: {
  item: Release
  status: Status
  onStatus: (status: Status) => void
  inWindow: boolean
  onWindow: (on: boolean) => void
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="pocket grid cursor-context-menu grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-tight px-hair py-tight data-popup-open:before:bg-tint">
        <Drawing object="record" seed={item.id} title="" className="w-10" />
        <div className="min-w-0">
          <p className="m-0 truncate leading-subhead font-medium">
            {item.title}
          </p>
          <p className="m-0 truncate text-small leading-small text-pen-quiet">
            {item.artist} · {STATUS_LABEL[status]}
          </p>
        </div>
        <span
          className={
            status === "sold"
              ? "font-type text-small text-pen-quiet tabular-nums line-through"
              : "font-type text-small tabular-nums"
          }
        >
          {kroner(item.price)}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>
            {item.title} · {item.id}
          </ContextMenuLabel>
          <ContextMenuItem disabled={status === "sold"}>
            <BookmarkIcon /> Hold
            <ContextMenuShortcut>H</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <HeadphonesIcon /> Play in the room
            <ContextMenuShortcut>P</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ListPlusIcon /> Add to list
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {LISTS.map((name) => (
                <ContextMenuItem key={name}>{name}</ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Status</ContextMenuLabel>
          <ContextMenuRadioGroup
            value={status}
            onValueChange={(value) => onStatus(value as Status)}
          >
            {(Object.keys(STATUS_LABEL) as Status[]).map((key) => (
              <ContextMenuRadioItem key={key} value={key}>
                {STATUS_LABEL[key]}
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={inWindow} onCheckedChange={onWindow}>
          Show in the window
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <TagIcon /> Reprice (count in progress)
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Trash2Icon /> Remove
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function ContextMenuDemo() {
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(ROWS.map((r) => [r.id, r.status])),
  )
  const [shown, setShown] = useState<string[]>([ROWS[0]!.id])
  return (
    <DemoSection title="Right-click or long-press a record">
      <StateRow label="Catalogue rows">
        <ul className="m-0 w-full max-w-[30rem] list-none p-0 [&>li]:border-b [&>li]:border-dotted [&>li]:border-pen-faint">
          {ROWS.map((item) => (
            <li key={item.id}>
              <Row
                item={item}
                status={status[item.id] ?? item.status}
                onStatus={(next) =>
                  setStatus((s) => ({ ...s, [item.id]: next }))
                }
                inWindow={shown.includes(item.id)}
                onWindow={(on) =>
                  setShown((w) =>
                    on ? [...w, item.id] : w.filter((id) => id !== item.id),
                  )
                }
              />
            </li>
          ))}
        </ul>
      </StateRow>
    </DemoSection>
  )
}
