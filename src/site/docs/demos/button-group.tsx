import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  Volume1Icon,
  Volume2Icon,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/fineliner/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/fineliner/ui/button-group"
import { Input } from "@/fineliner/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button group",
  description:
    "Related actions joined in one drawn frame, so a toolbar reads as a single control rather than a row of loose buttons.",
  item: "button-group",
  group: "Actions",
}

const FORMATS = { lp: "LP", ep: "12″", single: "7″" }

function Guests() {
  const [guests, setGuests] = useState(2)
  return (
    <ButtonGroup aria-label="Guests">
      <ButtonGroupText>Guests</ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="One guest fewer"
        disabled={guests <= 1}
        onClick={() => setGuests((n) => n - 1)}
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText
        aria-live="polite"
        className="w-10 justify-center px-0 text-ui text-pen tabular-nums"
      >
        {guests}
      </ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="One guest more"
        disabled={guests >= 6}
        onClick={() => setGuests((n) => n + 1)}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}

export default function ButtonGroupDemo() {
  return (
    <>
      <DemoSection title="Orientation">
        <StateRow label="Horizontal">
          <ButtonGroup aria-label="Record actions">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Hold</Button>
            <Button variant="outline">Mark sold</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ButtonGroup orientation="vertical" aria-label="Volume">
            <Button variant="outline" size="icon" aria-label="Louder">
              <Volume2Icon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Quieter">
              <Volume1Icon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Nested">
          <ButtonGroup aria-label="Catalogue pager">
            <ButtonGroup aria-label="Previous or next record">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous record"
              >
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next record">
                <ChevronRightIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Share">
              <Button variant="outline">Share</Button>
            </ButtonGroup>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="With fields">
        <StateRow label="Input">
          <ButtonGroup className="w-80 max-w-full">
            <Input
              aria-label="Search the catalogue"
              placeholder="Title, artist or label"
            />
            <Button variant="outline" aria-label="Search">
              <SearchIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Select">
          <ButtonGroup aria-label="Price and format">
            <Input
              aria-label="Price in kroner"
              inputMode="numeric"
              defaultValue="320"
              className="w-20 tabular-nums"
            />
            <Select items={FORMATS} defaultValue="lp">
              <SelectTrigger aria-label="Format" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FORMATS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Text">
          <Guests />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants and states">
        <StateRow label="Separator">
          <ButtonGroup aria-label="Export the catalogue">
            <Button variant="secondary">Export CSV</Button>
            <ButtonGroupSeparator />
            <Button variant="secondary">Export PDF</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Small">
          <ButtonGroup aria-label="Receipt">
            <Button variant="outline" size="sm">
              Print
            </Button>
            <Button variant="outline" size="sm">
              Email
            </Button>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Disabled member">
          <ButtonGroup aria-label="Booking">
            <Button variant="outline">Save booking</Button>
            <Button variant="outline" disabled>
              Send confirmation
            </Button>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
