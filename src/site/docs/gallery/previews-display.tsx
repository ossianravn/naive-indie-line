import { Fragment } from "react"
import { FileJsonIcon, PlusIcon } from "lucide-react"
import { Drawing } from "@/fineliner/drawing/drawing"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/fineliner/ui/accordion"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import { Calendar } from "@/fineliner/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/fineliner/ui/carousel"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/fineliner/ui/code-block"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/fineliner/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/fineliner/ui/item"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { RELEASES, kroner } from "@/site/listening-room/data"
import { Scaled } from "./parts"

// Data display parts whose demo opens with something taller or wider than a card's plate: the same part, with less
// of Listening Room's content in it.

const RACK = RELEASES.filter((r) => r.status !== "sold")

function CalendarPreview() {
  return (
    <Scaled by={0.52}>
      <Calendar
        mode="single"
        weekStartsOn={1}
        today={new Date(2026, 10, 2)}
        defaultMonth={new Date(2026, 10, 2)}
        selected={new Date(2026, 10, 5)}
      />
    </Scaled>
  )
}

function AccordionPreview() {
  return (
    <Accordion defaultValue={["listen"]} className="w-full max-w-[17rem]">
      <AccordionItem value="listen">
        <AccordionTrigger>Can I listen first?</AccordionTrigger>
        <AccordionContent>
          <p>Yes: book the room for an hour.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hold">
        <AccordionTrigger>How long is a hold?</AccordionTrigger>
      </AccordionItem>
    </Accordion>
  )
}

function CardPreview() {
  return (
    <Scaled by={0.85}>
      <div data-containers="boxed" className="w-[17rem]">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Thursday listening</CardTitle>
            <CardDescription>5 November, from seven</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="m-0 text-small leading-small">
              Eight seats by the window.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Book a seat</Button>
          </CardFooter>
        </Card>
      </div>
    </Scaled>
  )
}

function CarouselPreview() {
  return (
    <Carousel opts={{ align: "start" }} className="mx-12 w-[14rem]">
      <CarouselContent>
        {RACK.slice(0, 3).map((release, i) => (
          <CarouselItem key={release.id} className="basis-1/2">
            <Drawing
              object={["record", "turntable", "cassette"][i]!}
              seed={`gallery:${release.id}`}
              still
              title=""
              className="aspect-[4/3] w-full p-hair [&>svg]:size-full"
            />
            <p className="m-0 text-small leading-small font-medium">
              {release.title}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const BOOKING = ["{", '  "guest": "Maya Singh",', '  "guests": 2', "}"]

function CodeBlockPreview() {
  return (
    <CodeBlock className="w-full max-w-[16rem]">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileJsonIcon />
          booking.json
        </CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {BOOKING.map((line, i) => (
          <CodeBlockLine key={i} variant={i === 1 ? "highlighted" : "default"}>
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function EmptyPreview() {
  return (
    <Scaled by={0.8}>
      <Empty className="gap-tight p-0">
        <EmptyHeader>
          <EmptyMedia>
            <Drawing object="crate" seed="empty:racks" still title="" />
          </EmptyMedia>
          <EmptyTitle>The racks are empty</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            Add a record
          </Button>
        </EmptyContent>
      </Empty>
    </Scaled>
  )
}

function ItemPreview() {
  return (
    <ItemGroup className="w-full max-w-[17rem]">
      {RACK.slice(0, 2).map((r, i) => (
        <Fragment key={r.id}>
          {i > 0 ? <ItemSeparator /> : null}
          <Item role="listitem" size="sm">
            <ItemMedia variant="image">
              <Drawing object="record" seed={r.id} still title="" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{r.title}</ItemTitle>
              <ItemDescription>{r.artist}</ItemDescription>
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
  )
}

function TablePreview() {
  return (
    <div className="w-full max-w-[17rem]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {RACK.slice(0, 3).map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.title}</TableCell>
              <TableCell className="text-right font-type text-small">
                {kroner(r.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const DISPLAY_PREVIEWS = {
  calendar: CalendarPreview,
  accordion: AccordionPreview,
  card: CardPreview,
  carousel: CarouselPreview,
  "code-block": CodeBlockPreview,
  empty: EmptyPreview,
  item: ItemPreview,
  table: TablePreview,
}
