import { Card, CardContent } from "@/fineliner/ui/card"
import { Checkbox } from "@/fineliner/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { RadioGroup, RadioGroupItem } from "@/fineliner/ui/radio-group"
import { Switch } from "@/fineliner/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Field",
  description:
    "Label, control, description and error kept together in one readable column, for building forms.",
  item: "field",
  group: "Forms",
}

const SIDES = [
  { value: "a", label: "Side A" },
  { value: "b", label: "Side B" },
  { value: "shop", label: "The shop's pick" },
]

const BOOKINGS = [
  {
    value: "session",
    title: "Listening session",
    hint: "An hour in the back room with the turntable and your own picks.",
  },
  {
    value: "thursday",
    title: "Thursday event",
    hint: "An evening of records the shop has chosen, with a glass of wine.",
  },
]

export default function FieldDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <Field className="w-auto">
            <FieldLabel htmlFor="field-name">Your name</FieldLabel>
            <Input
              id="field-name"
              placeholder="e.g. Maya Singh"
              aria-describedby="field-name-hint"
              className="w-64"
            />
            <FieldDescription id="field-name-hint">
              As it should appear on the booking.
            </FieldDescription>
          </Field>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-email">Email</FieldLabel>
            <Input
              id="field-email"
              type="email"
              defaultValue="maya@"
              aria-invalid="true"
              className="w-64"
            />
            <FieldError>
              That address is missing the part after the @.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Several errors">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-size">Group size</FieldLabel>
            <Input
              id="field-size"
              inputMode="numeric"
              defaultValue="12"
              aria-invalid="true"
              className="w-20 text-center tabular-nums"
            />
            <FieldError
              errors={[
                { message: "The back room seats eight at most." },
                { message: "For twelve, book the whole shop." },
              ]}
            />
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Field data-disabled="true" className="w-auto">
            <FieldLabel htmlFor="field-member">Membership number</FieldLabel>
            <Input
              id="field-member"
              disabled
              defaultValue="Nº 0412"
              className="w-36 font-type"
            />
            <FieldDescription>Set when you joined.</FieldDescription>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Horizontal">
        <StateRow label="Switch">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <FieldContent>
              <FieldLabel htmlFor="field-own">
                Bring your own records
              </FieldLabel>
              <FieldDescription>
                We'll have the cleaning machine ready.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-own" defaultChecked />
          </Field>
        </StateRow>
        <StateRow label="Checkbox">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <Checkbox id="field-visit" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="field-visit">
                I'm visiting the shop
              </FieldLabel>
              <FieldDescription>
                Browse the crates before your session starts.
              </FieldDescription>
            </FieldContent>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Fieldset">
        <StateRow label="Radio set">
          <FieldSet className="w-auto">
            <FieldLegend variant="label">Play first</FieldLegend>
            <FieldDescription>
              We'll have it on as you sit down.
            </FieldDescription>
            <RadioGroup defaultValue="a">
              {SIDES.map(({ value, label }) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`side-${value}`} />
                  <FieldLabel htmlFor={`side-${value}`}>{label}</FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
        <StateRow label="Choice cards">
          <FieldSet className="w-full max-w-[28rem]">
            <FieldLegend>Book</FieldLegend>
            <RadioGroup defaultValue="session">
              {BOOKINGS.map(({ value, title, hint }) => (
                <FieldLabel key={value} htmlFor={`booking-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{title}</FieldTitle>
                      <FieldDescription>{hint}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`booking-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a form">
        <Card className="w-full max-w-[28rem]">
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Your name</FieldLabel>
                <Input
                  id="form-name"
                  defaultValue="Maya Singh"
                  className="w-64"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-date">Date</FieldLabel>
                <Input
                  id="form-date"
                  type="date"
                  defaultValue="2026-11-06"
                  className="w-44"
                />
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field orientation="horizontal">
                <Checkbox id="form-any" />
                <FieldLabel htmlFor="form-any">
                  Any Thursday in November
                </FieldLabel>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </DemoSection>
    </>
  )
}
