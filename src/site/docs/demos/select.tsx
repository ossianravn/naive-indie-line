import { Label } from "@/fineliner/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Select",
  description:
    "A steady field that opens a framed sheet of options, for choosing one value from a list too long for radios.",
  item: "select",
  group: "Forms",
}

const REDS = {
  gamay: "Gamay, Beaujolais",
  "cabernet-franc": "Cabernet Franc, Loire",
  nerello: "Nerello Mascalese",
}
const WHITES = {
  gruner: "Grüner Veltliner",
  "pinot-gris": "Skin-contact Pinot Gris",
  "pet-nat": "Pétillant Naturel",
}
const WINES = { ...REDS, ...WHITES }

const LENGTHS = {
  half: "Half an hour",
  hour: "An hour",
  two: "Two hours",
}

function WineList() {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Red</SelectLabel>
        {Object.entries(REDS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>White and orange</SelectLabel>
        {Object.entries(WHITES).map(([value, label]) => (
          <SelectItem key={value} value={value} disabled={value === "pet-nat"}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  )
}

function LengthList() {
  return (
    <SelectContent>
      <SelectGroup>
        {Object.entries(LENGTHS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  )
}

export default function SelectDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Chosen">
          <Select items={WINES} defaultValue="gamay">
            <SelectTrigger aria-label="Wine" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <WineList />
          </Select>
        </StateRow>
        <StateRow label="Placeholder">
          <div className="flex flex-col gap-hair">
            <Label id="wine-label">A glass with your session</Label>
            <Select items={WINES}>
              <SelectTrigger aria-labelledby="wine-label" className="w-56">
                <SelectValue placeholder="Choose a wine" />
              </SelectTrigger>
              <WineList />
            </Select>
          </div>
        </StateRow>
        <StateRow label="Invalid">
          <Select items={LENGTHS}>
            <SelectTrigger
              aria-label="Session length"
              aria-invalid="true"
              className="w-36"
            >
              <SelectValue placeholder="Length" />
            </SelectTrigger>
            <LengthList />
          </Select>
        </StateRow>
        <StateRow label="Disabled">
          <Select items={LENGTHS} defaultValue="hour" disabled>
            <SelectTrigger aria-label="Session length" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <LengthList />
          </Select>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <Select items={LENGTHS} defaultValue="two">
            <SelectTrigger
              size="sm"
              aria-label="Session length, compact"
              className="w-34"
            >
              <SelectValue />
            </SelectTrigger>
            <LengthList />
          </Select>
          <Select items={LENGTHS} defaultValue="two">
            <SelectTrigger aria-label="Session length" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <LengthList />
          </Select>
        </StateRow>
      </DemoSection>
    </>
  )
}
