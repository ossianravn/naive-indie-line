import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/fineliner/ui/navigation-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Navigation menu",
  description:
    "A site's main links, with panels that open to show the pages in each section; the page you are on is underlined.",
  item: "navigation-menu",
  group: "Navigation",
}

type Page = { title: string; href: string; about: string }

const CATALOGUE: Page[] = [
  { title: "New in", href: "#new", about: "Twelve records priced this week" },
  {
    title: "All records",
    href: "#records",
    about: "391 in the racks, newest first",
  },
  {
    title: "Held for you",
    href: "#held",
    about: "Kept at the counter until the date on the slip",
  },
  {
    title: "Sell us your records",
    href: "#sell",
    about: "Saturday mornings, no appointment",
  },
]

// Thursdays in November 2026: the 5th, 12th, 19th and 26th.
const THURSDAYS: Page[] = [
  {
    title: "Bring a record",
    href: "#nov-5",
    about: "Thu 5 Nov · 19:00 · 3 of 8 seats left",
  },
  {
    title: "Harbour Lights, both sides",
    href: "#nov-12",
    about: "Thu 12 Nov · 19:00 · with Jonas Berg",
  },
  {
    title: "Library music night",
    href: "#nov-19",
    about: "Thu 19 Nov · 19:30 · waiting list",
  },
  {
    title: "Bossa and natural wine",
    href: "#nov-26",
    about: "Thu 26 Nov · 19:00 · with Ama Owusu",
  },
]

/** A panel's short list of pages, each with a one-line description. */
function Pages({ pages, current }: { pages: Page[]; current?: string }) {
  return (
    <ul className="m-0 grid w-[19rem] max-w-[calc(100vw-3rem)] list-none gap-0.5 p-0">
      {pages.map((page) => (
        <li key={page.href}>
          <NavigationMenuLink
            href={page.href}
            active={page.href === current}
            className="flex-col items-start gap-0.5"
          >
            <span className="text-ui leading-ui">{page.title}</span>
            <span className="text-pen-quiet">{page.about}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  )
}

/** Listening Room's main navigation, on the given page; gift cards are not on sale yet. */
function ShopNav({ current }: { current: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap justify-start">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#shop"
            active={current === "#shop"}
            className={navigationMenuTriggerStyle()}
          >
            The shop
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={CATALOGUE} current={current} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Thursdays</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={THURSDAYS} current={current} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#book"
            active={current === "#book"}
            className={navigationMenuTriggerStyle()}
          >
            Book the room
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#gift-cards"
            className={navigationMenuTriggerStyle()}
            aria-disabled="true"
            tabIndex={-1}
          >
            Gift cards
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function NavigationMenuDemo() {
  return (
    <>
      <DemoSection title="Listening Room">
        <StateRow label="On a top-level page">
          <ShopNav current="#shop" />
        </StateRow>
        <StateRow label="On a page in a panel">
          <ShopNav current="#records" />
        </StateRow>
      </DemoSection>
    </>
  )
}
