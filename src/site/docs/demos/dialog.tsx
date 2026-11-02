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
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dialog",
  description:
    "A drawn sheet centred over the dimmed page, for a task that needs full attention before returning to it.",
  item: "dialog",
  group: "Overlays",
}

export default function DialogDemo() {
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Form">
        <Dialog>
          <DialogTrigger render={<Button />}>Book a session</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a listening session</DialogTitle>
              <DialogDescription>
                Thursday 5 November · 19:00 · by the window
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-snug">
              <div className="flex flex-wrap gap-tight">
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="booking-name">Name</Label>
                  <Input
                    id="booking-name"
                    autoComplete="name"
                    placeholder="e.g. Maya Singh"
                    className="w-64 max-w-full"
                  />
                </div>
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="booking-seats">Seats</Label>
                  <Input
                    id="booking-seats"
                    defaultValue="2"
                    inputMode="numeric"
                    className="w-20 text-center tabular-nums"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-hair">
                <Label htmlFor="booking-record">A record to bring</Label>
                <Input
                  id="booking-record"
                  placeholder="Optional"
                  className="w-72 max-w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Book session</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Footer close only">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            House rules
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>House rules</DialogTitle>
              <DialogDescription>For the listening room</DialogDescription>
            </DialogHeader>
            <p className="m-0 max-w-measure text-body leading-body">
              One side at a time, and whoever brought the record lifts the
              needle. Glasses stay on the bar, not on the sleeves. Talk between
              sides, not during them.
            </p>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Long title">
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" />}>
            Rename list
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Rename “Records to play on a rainy Thursday afternoon”
              </DialogTitle>
              <DialogDescription>
                Anyone you shared it with sees the new name.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-hair">
              <Label htmlFor="list-name">Name</Label>
              <Input
                id="list-name"
                defaultValue="Rainy Thursdays"
                className="w-72 max-w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Rename</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
    </DemoSection>
  )
}
