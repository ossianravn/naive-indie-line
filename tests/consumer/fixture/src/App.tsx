import { useState } from "react"
import { FinelinerDefs } from "@/fineliner/defs/fineliner-defs"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { Circled } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { useAppearance } from "@/fineliner/theme"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
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
import { RecordSleeve } from "@/fineliner/extras/record-sleeve"
import { SignIn01 } from "@/fineliner/blocks/sign-in-01"
import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  drawnBar,
  type ChartConfig,
} from "@/fineliner/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"

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

// A record shop's opening notice: lettering, a drawing and a ringed date, a day and night switch, and a booking
// dialog, using the parts the install test adds.
export function App() {
  const [appearance, setAppearance] = useAppearance()
  const [length, setLength] = useState("60")
  const night = appearance.theme === "night"

  return (
    <>
      <FinelinerDefs />
      <main className="mx-auto grid max-w-measure gap-section p-page">
        <Lettering text="Side B" face="liner" className="h-16" />
        <Drawing object="turntable" seed="consumer" className="w-64" />
        <p className={cn("font-read text-body", night && "text-pen")}>
          Records, coffee and a listening corner, open from{" "}
          <Circled seed="opening">Thursday</Circled>.
        </p>
        <Avatar size="lg">
          <AvatarFallback name="Maya Singh">MS</AvatarFallback>
        </Avatar>
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
        <RecordSleeve
          title="Harbour Lights"
          artist="Ellen Moe Trio"
          catalogue="LR-0431"
          size="sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Harbour Lights</TableCell>
              <TableCell className="text-right font-type">320 kr</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ChartContainer config={SOLD_CONFIG} className="h-48 w-full">
          <BarChart data={SOLD}>
            <XAxis dataKey="day" />
            <Bar dataKey="sold" shape={drawnBar} />
          </BarChart>
        </ChartContainer>
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
      </main>
      <SignIn01 product="Side B" />
    </>
  )
}
