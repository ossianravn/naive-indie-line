import { ArrowDownIcon, DiscIcon, HomeIcon, ListMusicIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/fineliner/ui/breadcrumb"
import { Bubble, BubbleContent } from "@/fineliner/ui/bubble"
import { Button } from "@/fineliner/ui/button"
import { DirectionProvider } from "@/fineliner/ui/direction"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/fineliner/ui/message"
import { Progress } from "@/fineliner/ui/progress"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/fineliner/ui/resizable"
import { ScrollArea } from "@/fineliner/ui/scroll-area"
import { Separator } from "@/fineliner/ui/separator"
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/fineliner/ui/sidebar-menu"
import { SidebarProvider } from "@/fineliner/ui/sidebar-provider"
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/fineliner/ui/trace"
import { Typography, TypographyKicker } from "@/fineliner/ui/typography"
import { RELEASES } from "@/site/listening-room/data"
import { PageLines, Scaled } from "./parts"

// Navigation, conversation and layout parts whose demo opens with a whole page, a long thread or a scrolling list:
// the same parts, holding a little of Listening Room's content.

function DirectionPreview() {
  return (
    <div className="grid w-full max-w-[16rem] gap-snug">
      {(["ltr", "rtl"] as const).map((dir) => (
        <DirectionProvider key={dir} direction={dir}>
          <div dir={dir} className="grid gap-hair">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>Catalogue</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Harbour Lights</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Progress value={40} aria-label="Side one" />
          </div>
        </DirectionProvider>
      ))}
    </div>
  )
}

function SidebarPreview() {
  return (
    <SidebarProvider className="min-h-0 w-full max-w-[17rem] gap-snug">
      <SidebarMenu className="w-36 shrink-0">
        <SidebarMenuItem>
          <SidebarMenuButton isActive>
            <HomeIcon />
            <span>Overview</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <DiscIcon />
            <span>Catalogue</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>24</SidebarMenuBadge>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <ListMusicIcon />
            <span>Sessions</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="min-w-0 flex-1 pt-tight">
        <PageLines widths={[70, 100, 85, 60]} />
      </div>
    </SidebarProvider>
  )
}

function MessagePreview() {
  return (
    <Message className="w-full max-w-[17rem]">
      <MessageAvatar>
        <Avatar>
          <AvatarFallback name="Lars Holm">LH</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <b>Lars Holm</b>
          <time dateTime="2026-11-02T14:12">14:12</time>
        </MessageHeader>
        <Bubble variant="secondary">
          <BubbleContent>Neon Orchard is held until Thursday.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function MessageScrollerPreview() {
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-hair">
      <Bubble align="end">
        <BubbleContent>Could you keep Neon Orchard for me?</BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>Held until Thursday.</BubbleContent>
      </Bubble>
      <Button variant="outline" size="xs" className="mt-hair self-center">
        Latest message <ArrowDownIcon data-icon="inline-end" />
      </Button>
    </div>
  )
}

function TracePreview() {
  return (
    <Trace className="w-full max-w-[16rem]">
      <TraceLine status="done">
        <TraceIcon>1</TraceIcon>
        <TraceTitle>Read Maya’s message</TraceTitle>
        <TraceDescription>0.3 s</TraceDescription>
      </TraceLine>
      <TraceLine status="done">
        <TraceIcon>2</TraceIcon>
        <TraceTitle>Find Neon Orchard</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>3</TraceIcon>
        <TraceTitle>Check room 1</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

function TypographyPreview() {
  return (
    <Scaled by={0.8}>
      <Typography dropCap className="w-[20rem]">
        <TypographyKicker>Shop notes · 2 November</TypographyKicker>
        <h3>Harbour Lights came back</h3>
        <p>
          Someone left a box on the step: forty records and a note that said
          only “for the racks”.
        </p>
      </Typography>
    </Scaled>
  )
}

function ResizablePreview() {
  return (
    <div className="frame h-36 w-full max-w-[17rem]">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="42%">
          <ul className="m-0 list-none p-hair">
            {RELEASES.slice(0, 3).map((r, i) => (
              <li
                key={r.id}
                className={`pocket truncate px-tight py-1 text-small leading-small ${i === 0 ? "font-medium before:bg-tint" : ""}`}
              >
                {r.title}
              </li>
            ))}
          </ul>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="58%">
          <div className="p-tight">
            <p className="m-0 text-ui leading-ui font-medium">
              {RELEASES[0]!.title}
            </p>
            <p className="m-0 text-small text-pen-quiet">
              {RELEASES[0]!.artist}
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function ScrollAreaPreview() {
  return (
    <ScrollArea className="frame h-40 w-56">
      <div className="px-snug py-tight">
        {RELEASES.slice(0, 8).map((r, i) => (
          <div key={r.id}>
            {i > 0 && <Separator />}
            <p className="m-0 flex items-baseline justify-between gap-tight py-hair text-small leading-small">
              <span className="min-w-0 truncate">{r.title}</span>
              <span className="shrink-0 font-type text-pen-quiet">{r.id}</span>
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export const OTHER_PREVIEWS = {
  direction: DirectionPreview,
  sidebar: SidebarPreview,
  message: MessagePreview,
  "message-scroller": MessageScrollerPreview,
  trace: TracePreview,
  typography: TypographyPreview,
  resizable: ResizablePreview,
  "scroll-area": ScrollAreaPreview,
}
