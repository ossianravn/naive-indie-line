import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/fineliner/ui/tabs"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tabs",
  description:
    "Labels on a pen rule that switch between views of one thing, the current one underlined by hand.",
  item: "tabs",
  group: "Navigation",
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 max-w-measure text-body leading-body text-pen">
      {children}
    </p>
  )
}

export default function TabsDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Tabs defaultValue="details" className="w-full max-w-[36rem]">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history" disabled>
                Sales history
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Panel>
                Harbour Lights, Ellen Moe Trio. Nordlys, 1968; first pressing,
                very good plus. 320 kr.
              </Panel>
            </TabsContent>
            <TabsContent value="tracks">
              <Panel>
                Six tracks: three a side, the title track closing side two.
              </Panel>
            </TabsContent>
            <TabsContent value="notes">
              <Panel>
                A whisper of surface noise on side two; it plays beautifully in
                the listening room.
              </Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
        <StateRow label="line">
          <Tabs defaultValue="week" className="w-full max-w-[36rem]">
            <TabsList variant="line">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
              <TabsTrigger value="month">November</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <Panel>
                Two listening sessions booked today, both in room 1.
              </Panel>
            </TabsContent>
            <TabsContent value="week">
              <Panel>
                Eleven sessions this week, and the Thursday evening is full.
              </Panel>
            </TabsContent>
            <TabsContent value="month">
              <Panel>
                Thirty-eight sessions in November so far, four of them members'
                evenings.
              </Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="Thursday">
          <Tabs
            defaultValue="programme"
            orientation="vertical"
            className="w-full max-w-[36rem]"
          >
            <TabsList>
              <TabsTrigger value="programme">Programme</TabsTrigger>
              <TabsTrigger value="wine">Wine list</TabsTrigger>
              <TabsTrigger value="guests">Guests</TabsTrigger>
            </TabsList>
            <TabsContent value="programme">
              <Panel>
                Side one of Field Hum at 19:00, then Tove Aske talks about
                recording it in a church hall.
              </Panel>
            </TabsContent>
            <TabsContent value="wine">
              <Panel>
                A Grüner Veltliner, a light Gamay and a pét-nat, by the glass.
              </Panel>
            </TabsContent>
            <TabsContent value="guests">
              <Panel>Twenty-four seats; Maya Singh brings two guests.</Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
      </DemoSection>
    </>
  )
}
