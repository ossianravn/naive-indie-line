import { Progress, ProgressLabel, ProgressValue } from "@/fineliner/ui/progress"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Progress",
  description:
    "A drawn track that fills with a pocket of ink as a task moves towards done.",
  item: "progress",
  group: "Data display",
}

// A fixed locale keeps the formatted value the same on the server and in the browser, so hydration matches.
const LOCALE = "en-GB"

export default function ProgressDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="In progress">
        <Progress locale={LOCALE} value={58} className="w-[22rem] max-w-full">
          <ProgressLabel>Thursday session seats</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Not started">
        <Progress locale={LOCALE} value={0} className="w-[22rem] max-w-full">
          <ProgressLabel>December bookings</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Complete">
        <Progress locale={LOCALE} value={100} className="w-[22rem] max-w-full">
          <ProgressLabel>Catalogue photographed</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Indeterminate">
        <Progress locale={LOCALE} value={null} className="w-[22rem] max-w-full">
          <ProgressLabel>Importing 140 records</ProgressLabel>
        </Progress>
      </StateRow>
      <StateRow label="Track only">
        <Progress
          locale={LOCALE}
          value={30}
          aria-label="Wine list poured"
          className="w-[12rem]"
        />
      </StateRow>
    </DemoSection>
  )
}
