import { useState } from "react"
import { CalendarXIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/fineliner/ui/alert-dialog"
import { Button } from "@/fineliner/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert dialog",
  description:
    "A drawn sheet that asks for a decision before something that cannot be undone.",
  item: "alert-dialog",
  group: "Overlays",
}

// The action button does the work and then closes the dialog itself, as a real handler would.
function useConfirm() {
  const [open, setOpen] = useState(false)
  return { root: { open, onOpenChange: setOpen }, done: () => setOpen(false) }
}

export default function AlertDialogDemo() {
  const cancel = useConfirm()
  const release = useConfirm()
  const discard = useConfirm()
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Destructive">
        <AlertDialog {...cancel.root}>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Cancel booking
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="text-correction">
                <CalendarXIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Cancel Maya’s booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Her two seats on Thursday 5 November go back on the list, and
                we’ll let her know. This can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={cancel.done}>
                Cancel booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
      <StateRow label="Without media">
        <AlertDialog {...release.root}>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Release hold
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Release the hold on Quiet Hours?
              </AlertDialogTitle>
              <AlertDialogDescription>
                It goes back in the crate, and anyone can buy it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep holding</AlertDialogCancel>
              <AlertDialogAction onClick={release.done}>
                Release
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
      <StateRow label="Small">
        <AlertDialog {...discard.root}>
          <AlertDialogTrigger render={<Button variant="ghost" />}>
            Discard note
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard this note?</AlertDialogTitle>
              <AlertDialogDescription>
                Your note on the B-side isn’t saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={discard.done}>
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
    </DemoSection>
  )
}
