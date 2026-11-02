import type { ReactNode } from "react"
import {
  CalendarDaysIcon,
  DiscIcon,
  LayoutGridIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
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

const SHOP: {
  key: Section
  label: string
  href: string
  icon: LucideIcon
  count?: number
}[] = [
  {
    key: "catalogue",
    label: "Catalogue",
    href: "/listening-room",
    icon: DiscIcon,
    count: RELEASES.filter((r) => r.status !== "sold").length,
  },
  {
    key: "sessions",
    label: "Sessions",
    href: "/listening-room/sessions",
    icon: CalendarDaysIcon,
    count: SESSIONS.filter((s) => s.date === TODAY && s.status === "booked")
      .length,
  },
  {
    key: "overview",
    label: "Overview",
    href: "/listening-room/overview",
    icon: LayoutGridIcon,
  },
]

const LABEL: Record<Section, string> = {
  catalogue: "Catalogue",
  sessions: "Sessions",
  overview: "Overview",
  settings: "Settings",
}

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
              >
                <Drawing
                  object="turntable"
                  seed="listening-room"
                  title=""
                  still
                  className="w-8 shrink-0"
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <Lettering
                    text="Listening Room"
                    seed="listening-room"
                    face="stilt"
                    className="[&>svg]:h-4 [&>svg]:w-auto"
                  />
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
                      <SidebarMenuBadge>{count}</SidebarMenuBadge>
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
              <SidebarMenuButton
                isActive={current === "settings"}
                tooltip="Settings"
                render={
                  <a
                    href="/listening-room/settings"
                    aria-current={current === "settings" ? "page" : undefined}
                  />
                }
              >
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Maya Singh">
                <Avatar size="sm" className="size-8!" aria-hidden="true">
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
      <SidebarInset id="main" className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-tight px-snug sm:px-line">
          <SidebarTrigger className="-ms-2" />
          <Separator orientation="vertical" className="my-4" />
          <span className="label text-pen-quiet">{LABEL[current]}</span>
          <a href="/" className="label ms-auto text-pen-quiet max-sm:hidden">
            Demo · Fineliner
          </a>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
