"use client"

import { useState } from "react"
import { useAppearance } from "@/fineliner/theme"
import { Button } from "@/fineliner/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/fineliner/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  drawnBar,
  type ChartConfig,
} from "@/fineliner/ui/chart"

const SOLD = [
  { day: "Thu", sold: 18 },
  { day: "Fri", sold: 12 },
  { day: "Sat", sold: 21 },
]
const SOLD_CONFIG = { sold: { label: "Records sold" } } satisfies ChartConfig

const LENGTHS = [
  { value: "30", label: "Half an hour" },
  { value: "60", label: "An hour" },
]

// The parts that take handlers or state, as a consumer would split them out of a server page.
export function LightSwitch() {
  const [appearance, setAppearance] = useAppearance()
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      value={[appearance.theme]}
      onValueChange={(value) =>
        value[0] && setAppearance({ theme: value[0] as "day" | "night" })
      }
      aria-label="Light"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="night">Night</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function SoldChart() {
  return (
    <ChartContainer config={SOLD_CONFIG} className="h-48 w-full">
      <BarChart data={SOLD}>
        <XAxis dataKey="day" />
        <Bar dataKey="sold" shape={drawnBar} />
      </BarChart>
    </ChartContainer>
  )
}

export function Booking() {
  const [length, setLength] = useState("60")
  return (
    <Dialog>
      <DialogTrigger render={<Button className="w-fit" />}>
        Book a session
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a listening session</DialogTitle>
          <DialogDescription>Thursday 5 November</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" className="w-64" />
          </Field>
          <Field>
            <FieldLabel htmlFor="length">Length</FieldLabel>
            <Select
              items={LENGTHS}
              value={length}
              onValueChange={(value) => value && setLength(value)}
            >
              <SelectTrigger id="length" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button>Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
