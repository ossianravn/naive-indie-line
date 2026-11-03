import type { ReactNode } from "react"
import {
  CalendarDaysIcon,
  ChevronsUpDownIcon,
  DiscIcon,
  LayoutGridIcon,
  LogOutIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import { Separator } from "@/fineliner/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/fineliner/ui/sidebar"
import { RELEASES } from "./data"
import { SESSIONS, TODAY } from "./sessions-data"

export type Section = "catalogue" | "sessions" | "overview" | "settings"

// Each badge counts what its page's kicker counts, in the same words: records in the racks, sessions today.
const SHOP: {
  key: Section
  label: string
  href: string
  icon: LucideIcon
  count?: { n: number; of: string }
}[] = [
  {
    key: "catalogue",
    label: "Catalogue",
    href: "/listening-room",
    icon: DiscIcon,
    count: {
      n: RELEASES.filter((r) => r.status === "racks").length,
      of: "in the racks",
    },
  },
  {
    key: "sessions",
    label: "Sessions",
    href: "/listening-room/sessions",
    icon: CalendarDaysIcon,
    count: {
      n: SESSIONS.filter((s) => s.date === TODAY && s.status !== "cancelled")
        .length,
      of: "today",
    },
  },
  {
    key: "overview",
    label: "Overview",
    href: "/listening-room/overview",
    icon: LayoutGridIcon,
  },
]

const CRUMB: Record<Section, [label: string, href: string]> = {
  catalogue: ["Catalogue", "/listening-room"],
  sessions: ["Sessions", "/listening-room/sessions"],
  overview: ["Overview", "/listening-room/overview"],
  settings: ["Settings", "/listening-room/settings"],
}

/** The shop's name, in Naïve Indie Line Sans. */
const Name = ({ className }: { className: string }) => (
  <Lettering text="Listening Room" className={className} />
)

/** Listening Room's frame: the shop's sections in a sidebar (a sheet on phones) beside the page. */
export function ListeningRoomShell({
  current,
  children,
}: {
  current: Section
  children?: ReactNode
}) {
  return (
    <SidebarProvider>
      {/* On wide screens the column is the shop's navigation landmark; on phones it is a sheet, named by its title. */}
      <Sidebar collapsible="icon" role="navigation" aria-label="Listening Room">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip="Listening Room"
                render={<a href="/listening-room" />}
                className="h-auto gap-tight py-hair"
              >
                <Drawing
                  object="turntable"
                  seed="listening-room"
                  title=""
                  still
                  className="w-12 shrink-0 group-data-[collapsible=icon]:w-7"
                />
                <span className="flex min-w-0 flex-col gap-hair">
                  <Name className="text-[1.3rem] whitespace-nowrap" />
                  <span className="label truncate text-pen-quiet">
                    Records · Room · Wine
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>The shop</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SHOP.map(({ key, label, href, icon: Icon, count }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={key === current}
                      tooltip={label}
                      render={
                        <a
                          href={href}
                          aria-current={key === current ? "page" : undefined}
                        />
                      }
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {count ? (
                      <SidebarMenuBadge title={`${count.n} ${count.of}`}>
                        {count.n}
                        <span className="sr-only"> {count.of}</span>
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      tooltip="Maya Singh"
                      isActive={current === "settings"}
                    />
                  }
                >
                  <Avatar size="sm" className="size-8!" aria-hidden="true">
                    <AvatarFallback name="Maya Singh">MS</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">Maya Singh</span>
                    <span className="label truncate text-pen-quiet">
                      Behind the counter
                    </span>
                  </span>
                  <ChevronsUpDownIcon className="ms-auto text-pen-quiet" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>maya@example.com</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<a href="/listening-room/settings" />}
                  >
                    <SettingsIcon />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<a href="/listening-room/sign-in" />}
                  >
                    <LogOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset id="main" className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-tight px-snug sm:px-line">
          <SidebarTrigger className="-ms-2" />
          <Separator orientation="vertical" className="my-4" />
          {/* On phones the sidebar is a sheet, so the top bar carries the shop's name. */}
          <a href="/listening-room" className="flex items-center md:hidden">
            <Name className="text-[1.15rem] whitespace-nowrap" />
          </a>
          <a
            href={CRUMB[current][1]}
            className="label text-pen-quiet no-underline hover:text-pen hover:underline"
          >
            {CRUMB[current][0]}
          </a>
          <a href="/" className="label ms-auto text-pen-quiet max-sm:hidden">
            Demo · Fineliner
          </a>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
