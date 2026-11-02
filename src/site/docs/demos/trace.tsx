import { ExternalLinkIcon } from "lucide-react"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/fineliner/ui/trace"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Trace",
  description:
    "The steps an assistant took to reach an answer, numbered in order, each one open for its detail.",
  item: "trace",
  group: "Conversation",
}

type Step = {
  title: string
  note: string
  detail: string
  status: "done" | "running" | "pending" | "error"
}

const STEPS: Step[] = [
  {
    title: "Read Maya’s message",
    note: "0.3 s",
    status: "done",
    detail:
      "Keep Neon Orchard until Thursday, and hear it in the listening room before buying it.",
  },
  {
    title: "Find the record",
    note: "LR-0414",
    status: "done",
    detail:
      "Neon Orchard, Satoko Ishii. Kasumi, 1986; near mint, 420 kr, in the city pop rack.",
  },
  {
    title: "Check the hold",
    note: "held",
    status: "done",
    detail:
      "Already held for Maya since Saturday. The hold runs until closing on Thursday 5 November.",
  },
  {
    title: "Check room 1 on Thursday",
    note: "5 Nov",
    status: "running",
    detail:
      "Room 1 is free from 15:00 until the shop closes at 17:00; the Thursday session has it from 19:00.",
  },
  {
    title: "Draft the reply",
    note: "",
    status: "pending",
    detail: "Confirm the hold, offer 16:00 in room 1 and say when we close.",
  },
]

function Steps({ steps, open }: { steps: Step[]; open?: number }) {
  return (
    <Trace className="max-w-[34rem]">
      {steps.map((step, index) => (
        <TraceCollapsible key={step.title} defaultOpen={index === open}>
          <TraceCollapsibleTrigger>
            <TraceLine status={step.status}>
              <TraceIcon>{index + 1}</TraceIcon>
              <TraceTitle>{step.title}</TraceTitle>
              {step.note ? (
                <TraceDescription>{step.note}</TraceDescription>
              ) : null}
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>{step.detail}</TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  )
}

export default function TraceDemo() {
  return (
    <>
      <DemoSection title="Answering Maya">
        <Steps steps={STEPS} open={2} />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Done">
          <Trace>
            <TraceLine status="done">
              <TraceIcon>1</TraceIcon>
              <TraceTitle>Read Maya&rsquo;s message</TraceTitle>
              <TraceDescription>0.3 s</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Running">
          <Trace>
            <TraceLine status="running">
              <TraceIcon>4</TraceIcon>
              <TraceTitle>Check room 1 on Thursday</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Pending">
          <Trace>
            <TraceLine status="pending">
              <TraceIcon>5</TraceIcon>
              <TraceTitle>Draft the reply</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Error">
          <Trace>
            <TraceLine status="error">
              <TraceIcon>2</TraceIcon>
              <TraceTitle>Read the sleeve photo</TraceTitle>
              <TraceDescription>too dark</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="No status">
          <Trace>
            <TraceLine>
              <TraceIcon>2</TraceIcon>
              <TraceTitle>Find the record</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="As a link">
          <Trace>
            <a href="#lr-0414">
              <TraceLine status="done">
                <TraceIcon>2</TraceIcon>
                <TraceTitle>Opened LR-0414 in the catalogue</TraceTitle>
                <TraceIcon>
                  <ExternalLinkIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </StateRow>
      </DemoSection>
      <DemoSection title="A step that failed">
        <Steps
          open={1}
          steps={[
            STEPS[0]!,
            {
              title: "Read the sleeve photo",
              note: "too dark",
              status: "error",
              detail:
                "The catalogue number on the spine can’t be made out in the photo. Carrying on with the title and the artist from the message.",
            },
            { ...STEPS[1]!, note: "by title" },
            STEPS[2]!,
          ]}
        />
      </DemoSection>
    </>
  )
}
