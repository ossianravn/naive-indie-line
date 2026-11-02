import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/fineliner/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Popover",
  description:
    "A small drawn sheet that opens beside its trigger for a detail or a quick edit, without leaving the page.",
  item: "popover",
  group: "Overlays",
}

const WINES = [
  ["Pétillant Naturel, Loire", "7.50"],
  ["Gamay, Beaujolais", "8.00"],
  ["Skin-contact Grüner", "9.00"],
] as const

export default function PopoverDemo() {
  return (
    <>
      <DemoSection title="Open">
        <StateRow label="Default open">
          {/* Room for the open sheet, so it does not cover the next example. */}
          <div className="min-h-[12rem]">
            <Popover defaultOpen>
              <PopoverTrigger render={<Button variant="outline" />}>
                Thursday listening <ChevronDownIcon data-icon="inline-end" />
              </PopoverTrigger>
              <PopoverContent align="start" initialFocus={false}>
                <PopoverHeader>
                  <PopoverTitle>Thursday 5 November, 19:00</PopoverTitle>
                  <PopoverDescription>
                    By the window · 3 of 8 seats left
                  </PopoverDescription>
                </PopoverHeader>
                <p className="m-0">
                  Bring a record you love and one you have never played. We pour
                  from seven.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Open with the trigger">
        <StateRow label="Quick edit">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Group size
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <PopoverHeader>
                <PopoverTitle>Maya Singh</PopoverTitle>
                <PopoverDescription>Thu 5 Nov · 19:00</PopoverDescription>
              </PopoverHeader>
              <div className="flex items-end gap-tight">
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="group-size">Seats</Label>
                  <Input
                    id="group-size"
                    defaultValue="2"
                    inputMode="numeric"
                    className="w-20 text-center tabular-nums"
                  />
                </div>
                <Button>Save</Button>
              </div>
            </PopoverContent>
          </Popover>
        </StateRow>
        <StateRow label="A short list">
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" />}>
              Tonight’s wine
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <PopoverTitle>By the glass</PopoverTitle>
              <ul className="m-0 grid list-none grid-cols-[auto_auto] gap-x-line gap-y-hair p-0">
                {WINES.map(([wine, price]) => (
                  <li key={wine} className="contents">
                    <span>{wine}</span>
                    <span className="text-right font-type">{price}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </StateRow>
        <StateRow label="Above the trigger">
          <Popover>
            <PopoverTrigger render={<Button variant="link" />}>
              Who’s hosting?
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto">
              <PopoverHeader>
                <PopoverTitle>Ines Duarte</PopoverTitle>
                <PopoverDescription>
                  Runs the Thursday listening · 41 evenings
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </StateRow>
      </DemoSection>
    </>
  )
}
