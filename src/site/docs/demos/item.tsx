import { Fragment, type ComponentProps } from "react"
import {
  ChevronRightIcon,
  HeadphonesIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/fineliner/ui/item"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Item",
  description:
    "An open row for one thing in a list: a drawing or an icon, a title, one line about it and its actions.",
  item: "item",
  group: "Data display",
}

const COLUMN = "w-full max-w-[34rem]"
const RACK = RELEASES.filter((r) => r.status !== "sold").slice(0, 4)
const HARBOUR = RELEASES[0]!

function Harbour({
  variant,
  size,
}: Pick<ComponentProps<typeof Item>, "variant" | "size">) {
  return (
    <Item variant={variant} size={size} className={COLUMN}>
      <ItemMedia variant="image">
        <Drawing object="record" seed={HARBOUR.id} title="" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{HARBOUR.title}</ItemTitle>
        <ItemDescription>
          {HARBOUR.artist} · {HARBOUR.year} · {kroner(HARBOUR.price)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`More for ${HARBOUR.title}`}
        >
          <MoreHorizontalIcon />
        </Button>
      </ItemActions>
    </Item>
  )
}

export default function ItemDemo() {
  return (
    <>
      <DemoSection title="In the racks">
        <ItemGroup className={COLUMN}>
          {RACK.map((r, i) => (
            <Fragment key={r.id}>
              {i > 0 ? <ItemSeparator /> : null}
              <Item role="listitem">
                <ItemMedia variant="image">
                  <Drawing object="record" seed={r.id} title="" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{r.title}</ItemTitle>
                  <ItemDescription>
                    {r.artist} · {r.year} · {r.format}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {r.status === "held" ? (
                    <Badge variant="secondary">On hold</Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Hold
                    </Button>
                  )}
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Harbour />
        </StateRow>
        <StateRow label="outline">
          <Harbour variant="outline" />
        </StateRow>
        <StateRow label="muted">
          <Harbour variant="muted" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="default">
          <Harbour variant="outline" />
        </StateRow>
        <StateRow label="sm">
          <Harbour variant="outline" size="sm" />
        </StateRow>
        <StateRow label="xs">
          <Item variant="outline" size="xs" className={COLUMN}>
            <ItemMedia variant="image">
              <Drawing object="glass" seed="wine:pet-nat" title="" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Pét-nat, Loire</ItemTitle>
            </ItemContent>
            <ItemActions>
              <span className="font-type text-small">65 kr</span>
            </ItemActions>
          </Item>
        </StateRow>
      </DemoSection>
      <DemoSection title="Media and links">
        <StateRow label="Icon">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="icon">
              <HeadphonesIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>The listening room</ItemTitle>
              <ItemDescription>
                Two armchairs, the shop&apos;s best turntable and the good
                speakers. Book an hour and bring a record from the racks.
              </ItemDescription>
            </ItemContent>
          </Item>
        </StateRow>
        <StateRow label="As a link">
          <Item
            variant="outline"
            className={COLUMN}
            render={<a href="#paper-moons" />}
          >
            <ItemMedia variant="image">
              <Drawing object="record" seed="LR-0429" title="" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Paper Moons</ItemTitle>
              <ItemDescription>
                Odile &amp; the Lanterns, held for Jonas until Thursday.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-pen-quiet rtl:-scale-x-100" />
            </ItemActions>
          </Item>
        </StateRow>
        <StateRow label="Link, muted">
          <Item
            variant="muted"
            className={COLUMN}
            render={<a href="#music-for-waiting-rooms" />}
          >
            <ItemMedia variant="number">27</ItemMedia>
            <ItemContent>
              <ItemTitle>Music for Waiting Rooms</ItemTitle>
              <ItemDescription>
                Ana Lindqvist. Plays beautifully in the listening room.
              </ItemDescription>
            </ItemContent>
          </Item>
        </StateRow>
        <StateRow label="With footer">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="number">05</ItemMedia>
            <ItemContent>
              <ItemTitle>Thursday listening</ItemTitle>
              <ItemDescription>
                Bring a record you love and one you have never played.
              </ItemDescription>
            </ItemContent>
            <ItemFooter className="label text-pen-quiet">
              <span>Thursday 5 November, from seven</span>
              <span>8 seats</span>
            </ItemFooter>
          </Item>
        </StateRow>
      </DemoSection>
    </>
  )
}
