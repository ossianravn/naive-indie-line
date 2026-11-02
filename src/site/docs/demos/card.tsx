import { Button } from "@/fineliner/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Card",
  description:
    "Groups one subject: open on the page by default, framed by the pen when containers are boxed.",
  item: "card",
  group: "Data display",
}

function Session({ boxed }: { boxed?: boolean }) {
  return (
    <div
      data-containers={boxed ? "boxed" : undefined}
      className="w-full max-w-[22rem]"
    >
      <Card>
        <CardHeader>
          <CardTitle>Thursday listening</CardTitle>
          <CardDescription>5 November, from seven</CardDescription>
          <CardAction>
            <Button variant="link">Share</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="m-0 text-small leading-small">
            Bring a record you love and one you have never played. Eight seats
            by the window.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Book a seat</Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function CardDemo() {
  return (
    <DemoSection title="Containers">
      <StateRow label="Open">
        <Session />
      </StateRow>
      <StateRow label="Boxed">
        <Session boxed />
      </StateRow>
    </DemoSection>
  )
}
