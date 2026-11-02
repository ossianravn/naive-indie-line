import { CalendarClockIcon } from "lucide-react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/fineliner/ui/alert"
import { Button } from "@/fineliner/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert",
  description:
    "A note in the page's margin, with a pen mark by its title, that tells the reader something about where they are.",
  item: "alert",
  group: "Data display",
}

export default function AlertDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="Default">
          <Alert className="max-w-[36rem]">
            <AlertTitle>The shop closes at 17:00 on Thursday</AlertTitle>
            <AlertDescription>
              The listening room opens again at 19:00 for the Thursday session;
              come in through the yard door.
            </AlertDescription>
          </Alert>
        </StateRow>
        <StateRow label="Title only">
          <Alert className="max-w-[36rem]">
            <AlertTitle>
              Paper Moons is held for Jonas until Thursday
            </AlertTitle>
          </Alert>
        </StateRow>
        <StateRow label="Destructive">
          <Alert variant="destructive" className="max-w-[36rem]">
            <AlertTitle>Room 2 is double-booked at 19:00</AlertTitle>
            <AlertDescription>
              Maya Singh and Ama Owusu both hold the slot. Move one booking
              before the confirmations go out at noon.
            </AlertDescription>
          </Alert>
        </StateRow>
      </DemoSection>
      <DemoSection title="With an action or icon">
        <StateRow label="Action">
          <Alert className="max-w-[36rem]">
            <AlertTitle>Harbour Lights removed from the racks</AlertTitle>
            <AlertDescription>It leaves today's new arrivals.</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                Undo
              </Button>
            </AlertAction>
          </Alert>
        </StateRow>
        <StateRow label="Icon">
          <Alert className="max-w-[36rem]">
            <CalendarClockIcon />
            <AlertTitle>Bookings for December open on Monday</AlertTitle>
            <AlertDescription>
              Regulars get the first week; the rest of the month opens on the
              14th.
            </AlertDescription>
          </Alert>
        </StateRow>
      </DemoSection>
    </>
  )
}
