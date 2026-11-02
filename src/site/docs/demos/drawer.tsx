import { Button } from "@/fineliner/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/fineliner/ui/drawer"
import { Field, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Separator } from "@/fineliner/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Drawer",
  description:
    "A drawn sheet pulled up from the bottom of the screen for a quick task on a phone, dismissed by swiping it back down.",
  item: "drawer",
  group: "Overlays",
}

const WINES = [
  ["Grüner Veltliner", "Kamptal 2023", "75", "340"],
  ["Txakoli", "Getaria 2024", "80", "360"],
  ["Pinot Noir", "Ahr 2022", "95", "430"],
  ["Pét-nat rosé", "Loire 2024", "70", "320"],
] as const

/** The quick booking form: a name and a number of seats. */
function BookSeat({ id }: { id: string }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <DrawerHeader>
        <DrawerTitle>Book a seat</DrawerTitle>
        <DrawerDescription>Thursday 5 November · 19:00</DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-wrap items-end gap-tight px-snug pt-snug">
        <Field className="w-auto">
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            placeholder="e.g. Maya Singh"
            className="w-56 max-w-full"
          />
        </Field>
        <Field className="w-auto">
          <FieldLabel htmlFor={`${id}-seats`}>Seats</FieldLabel>
          <Input
            id={`${id}-seats`}
            inputMode="numeric"
            defaultValue="2"
            className="w-16 text-center tabular-nums"
          />
        </Field>
      </div>
      <DrawerFooter>
        <DrawerClose render={<Button />}>Book seat</DrawerClose>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
      </DrawerFooter>
    </div>
  )
}

/** The short wine list: by the glass and by the bottle, in kroner. */
function WineList() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <DrawerHeader>
        <DrawerTitle>The wine list</DrawerTitle>
        <DrawerDescription>Thursday evenings, from 18:00</DrawerDescription>
      </DrawerHeader>
      <div className="mx-snug mt-snug mb-snug grid w-fit grid-cols-[minmax(0,11rem)_3rem_3rem] gap-x-tight">
        <span className="label text-pen-quiet">Wine</span>
        <span className="label text-right text-pen-quiet">Glass</span>
        <span className="label text-right text-pen-quiet">Bottle</span>
        {WINES.map(([wine, origin, glass, bottle]) => (
          <div key={wine} className="col-span-3 grid grid-cols-subgrid">
            <Separator className="col-span-3" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-ui leading-ui">{wine}</span>
              <span className="truncate text-small text-pen-quiet">
                {origin}
              </span>
            </span>
            <span className="text-right font-type text-small tabular-nums">
              {glass}
            </span>
            <span className="text-right font-type text-small tabular-nums">
              {bottle}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DrawerDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Bottom, with handle">
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button />}>Book a seat</DrawerTrigger>
            <DrawerContent>
              <BookSeat id="drawer-handle" />
            </DrawerContent>
          </Drawer>
        </StateRow>
        <StateRow label="Without handle">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>
              Quick booking
            </DrawerTrigger>
            <DrawerContent>
              <BookSeat id="drawer-plain" />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
      <DemoSection title="Directions">
        <StateRow label="Swipe">
          <Drawer showSwipeHandle swipeDirection="right">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the right
            </DrawerTrigger>
            <DrawerContent>
              <WineList />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="left">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the left
            </DrawerTrigger>
            <DrawerContent>
              <WineList />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="up">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the top
            </DrawerTrigger>
            <DrawerContent>
              <WineList />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
    </>
  )
}
