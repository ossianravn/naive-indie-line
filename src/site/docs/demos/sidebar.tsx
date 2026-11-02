import { useState, type ReactNode } from "react"
import {
  Disc3Icon,
  HeadphonesIcon,
  LayoutGridIcon,
  ListMusicIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { Separator } from "@/fineliner/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/fineliner/ui/sidebar"
import { RELEASES } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { Choice } from "./sidebar/choice"
import {
  BOOKINGS,
  EveningsSub,
  LISTS,
  ListActions,
  NavItem,
  Page,
} from "./sidebar/shell"

export const meta: DemoMeta = {
  title: "Sidebar",
  description:
    "An app's main navigation in a column beside the page, which folds to icons on a desktop and becomes a sheet on a phone.",
  item: "sidebar",
  group: "Navigation",
}

type Variant = "sidebar" | "floating" | "inset"
type Collapse = "icon" | "offcanvas"
type Side = "left" | "right"

/** Listening Room's shell: the shop's places, its Thursday evenings and saved lists, settings and the person. */
function Shell({
  variant,
  collapse,
  side,
}: {
  variant: Variant
  collapse: Collapse
  side: Side
}) {
  const [open, setOpen] = useState("Catalogue")
  const nav = { open, onOpen: setOpen }
  // The sidebar holds its room in the row, so on the right it comes after the page.
  const sidebar = (
    <Sidebar
      variant={variant}
      collapsible={collapse}
      side={side}
      className="absolute h-full"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Listening Room">
              <Drawing
                object="turntable"
                seed="listening-room"
                title=""
                still
                className="w-8 shrink-0"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">Listening Room</span>
                <span className="label truncate text-pen-quiet">
                  Record shop
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput
          type="search"
          aria-label="Search the catalogue"
          placeholder="Search the catalogue"
          className="group-data-[collapsible=icon]:hidden"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem
                name="Catalogue"
                icon={Disc3Icon}
                count={RELEASES.length}
                {...nav}
              />
              <NavItem
                name="Sessions"
                icon={HeadphonesIcon}
                count={BOOKINGS.length}
                {...nav}
              >
                <EveningsSub {...nav} />
              </NavItem>
              <NavItem name="Overview" icon={LayoutGridIcon} {...nav} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Lists</SidebarGroupLabel>
          <SidebarGroupAction title="New list">
            <PlusIcon />
            <span className="sr-only">New list</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {LISTS.map(([name]) => (
                <NavItem key={name} name={name} icon={ListMusicIcon} {...nav}>
                  <ListActions name={name} />
                </NavItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NavItem name="Settings" icon={SettingsIcon} {...nav} />
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Maya Singh">
              <Avatar className="size-8" aria-hidden="true">
                <AvatarFallback name="Maya Singh">MS</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">Maya Singh</span>
                <span className="label truncate text-pen-quiet">
                  Behind the counter
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
  return (
    <div className="frame p-[3px]">
      <SidebarProvider className="relative isolate h-[42rem] min-h-0 overflow-hidden">
        {side === "left" && sidebar}
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-tight px-tight">
            <SidebarTrigger />
            <Separator orientation="vertical" className="my-4" />
            <h3 className="m-0 truncate font-read text-lead leading-subhead">
              {open}
            </h3>
            <span className="label ml-auto shrink-0 text-pen-quiet">
              Mon 2 Nov
            </span>
          </header>
          <Separator />
          <Page open={open} />
        </SidebarInset>
        {side === "right" && sidebar}
      </SidebarProvider>
    </div>
  )
}

/** A short, still sidebar for one state: collapsible none, sized to its rows. */
function Still({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar collapsible="none" className="h-auto">
        <SidebarContent>
          <SidebarGroup>{children}</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

export default function SidebarDemo() {
  const [variant, setVariant] = useState<Variant>("sidebar")
  const [collapse, setCollapse] = useState<Collapse>("icon")
  const [side, setSide] = useState<Side>("left")
  return (
    <>
      <DemoSection title="Listening Room shell">
        <div className="mb-snug flex flex-wrap gap-x-line gap-y-tight">
          <Choice
            label="Variant"
            value={variant}
            onChange={setVariant}
            options={[
              ["sidebar", "Sidebar"],
              ["floating", "Floating"],
              ["inset", "Inset"],
            ]}
          />
          <Choice
            label="Collapse"
            value={collapse}
            onChange={setCollapse}
            options={[
              ["icon", "To icons"],
              ["offcanvas", "Off canvas"],
            ]}
          />
          <Choice
            label="Side"
            value={side}
            onChange={setSide}
            options={[
              ["left", "Left"],
              ["right", "Right"],
            ]}
          />
        </div>
        <Shell variant={variant} collapse={collapse} side={side} />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Loading">
          <Still>
            <SidebarGroupLabel>Lists</SidebarGroupLabel>
            <SidebarMenu>
              {[0, 1, 2].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </Still>
        </StateRow>
        <StateRow label="Outline, small">
          <Still>
            <SidebarMenu className="gap-tight">
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline" isActive>
                  <Disc3Icon />
                  <span>Catalogue</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline">
                  <HeadphonesIcon />
                  <span>Sessions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" disabled>
                  <ListMusicIcon />
                  <span>Archive</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Still>
        </StateRow>
      </DemoSection>
    </>
  )
}
