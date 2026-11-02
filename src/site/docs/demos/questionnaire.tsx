import { useState } from "react"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/fineliner/ui/questionnaire"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Questionnaire",
  description:
    "A short run of questions answered one sheet at a time, such as booking the listening room.",
  item: "questionnaire",
  group: "Forms",
}

const TIMES = [
  ["thu-5", "Thursday 5 November, 16:00", "Room 1 · the hour before closing"],
  ["fri-6", "Friday 6 November, 11:00", "Room 1 · morning light"],
  ["sat-7", "Saturday 7 November, 14:00", "Room 2 · the small room"],
  ["sun-8", "Sunday 8 November", "Closed on Sundays"],
] as const
const MUSIC = [
  ["holds", "Records on hold for me"],
  ["picks", "Staff picks"],
  ["arrivals", "New arrivals"],
  ["own", "I’ll bring my own"],
] as const
const GLASSES = [
  ["petnat", "Pétillant naturel", "Loire · 75 kr"],
  ["gruner", "Skin-contact Grüner", "Weinviertel · 80 kr"],
  ["gamay", "Gamay", "Beaujolais · 70 kr"],
  ["soda", "Elderflower soda", "No alcohol · 35 kr"],
] as const

function Booking() {
  const [booked, setBooked] = useState<string | null>(null)
  if (booked) {
    return (
      <p className="m-0 text-body leading-body text-pen">
        Room booked for <strong className="font-medium">{booked}</strong>.{" "}
        <button
          type="button"
          className="cursor-pointer text-pen underline decoration-1 underline-offset-[0.25em]"
          onClick={() => setBooked(null)}
        >
          Book another
        </button>
      </p>
    )
  }
  return (
    <Questionnaire
      shortcuts="letters"
      className="max-w-[34rem]"
      onSubmit={(event) => {
        event.preventDefault()
        const name = new FormData(event.currentTarget).get("name")
        setBooked(String(name || "a guest"))
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="time" required>
        <QuestionnaireTitle>When would you like the room?</QuestionnaireTitle>
        <QuestionnaireDescription>
          An hour, with up to three records from the racks.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {TIMES.map(([value, label, note]) => (
            <QuestionnaireChoice
              key={value}
              value={value}
              disabled={value === "sun-8"}
            >
              {label}
              <QuestionnaireChoiceDescription>
                {note}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="music" multiple>
        <QuestionnaireTitle>What would you like to hear?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose any that apply.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {MUSIC.map(([value, label]) => (
            <QuestionnaireChoice key={value} value={value}>
              {label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="glass">
        <QuestionnaireTitle>A glass while you listen?</QuestionnaireTitle>
        <QuestionnaireDescription>
          From this month&rsquo;s list, poured when you arrive.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {GLASSES.map(([value, label, note]) => (
            <QuestionnaireChoice key={value} value={value}>
              {label}
              <QuestionnaireChoiceDescription>
                {note}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="name">
        <QuestionnaireTitle>Whose name is on the booking?</QuestionnaireTitle>
        <QuestionnaireInput
          placeholder="e.g. Maya Singh"
          autoComplete="name"
          className="max-w-[18rem]"
        />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Book the room</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export default function QuestionnaireDemo() {
  return (
    <>
      <DemoSection title="Booking the listening room">
        <Booking />
      </DemoSection>
      <DemoSection title="Unanswered">
        <Questionnaire className="max-w-[34rem]">
          <QuestionnaireItem name="room" required invalid>
            <QuestionnaireTitle>Which room?</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="room-1">Room 1</QuestionnaireChoice>
              <QuestionnaireChoice value="room-2">Room 2</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireSubmit>Continue</QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
      </DemoSection>
    </>
  )
}
