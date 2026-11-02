import { CopyIcon, SearchIcon, XIcon } from "lucide-react"
import { Field, FieldError, FieldLabel } from "@/fineliner/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/fineliner/ui/input-group"
import { Kbd } from "@/fineliner/ui/kbd"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input group",
  description:
    "One steady field line shared by an input and its units, icons or buttons, for values that need a word or an action beside them.",
  item: "input-group",
  group: "Forms",
}

export default function InputGroupDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Search">
          <InputGroup className="w-80 max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search the catalogue"
              placeholder="Title, artist or label"
            />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="Filled">
          <Field className="w-auto">
            <FieldLabel htmlFor="ig-price">Price</FieldLabel>
            <InputGroup className="w-32">
              <InputGroupInput
                id="ig-price"
                inputMode="numeric"
                defaultValue="320"
                className="tabular-nums"
              />
              <InputGroupAddon align="inline-end">kr</InputGroupAddon>
            </InputGroup>
          </Field>
          <InputGroup className="w-80 max-w-full self-end">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search the catalogue"
              defaultValue="Harbour Lights"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Clear search">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="ig-guests">Guests</FieldLabel>
            <InputGroup className="w-36">
              <InputGroupInput
                id="ig-guests"
                inputMode="numeric"
                defaultValue="9"
                aria-invalid="true"
                aria-describedby="ig-guests-error"
                className="tabular-nums"
              />
              <InputGroupAddon align="inline-end">people</InputGroupAddon>
            </InputGroup>
            <FieldError id="ig-guests-error">
              The listening room seats six.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <InputGroup className="w-32">
            <InputGroupAddon>
              <InputGroupText>LR-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Catalogue number"
              defaultValue="0431"
              disabled
              className="pl-0.5! font-type"
            />
          </InputGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Alignments">
        <StateRow label="inline-start">
          <InputGroup className="w-32">
            <InputGroupAddon>
              <InputGroupText>LR-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Catalogue number"
              defaultValue="0432"
              className="pl-0.5! font-type"
            />
          </InputGroup>
        </StateRow>
        <StateRow label="inline-end">
          <InputGroup className="w-80 max-w-full">
            <InputGroupInput
              aria-label="Link to this record"
              readOnly
              defaultValue="listeningroom.example/r/LR-0431"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy link">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="block-start">
          <InputGroup className="w-full max-w-measure">
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupText>Back room · Thu 5 Nov, 19:00</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea
              aria-label="Note for the shop"
              defaultValue="We would like to hear Harbour Lights first, then something on Halo. Two of us, maybe three."
            />
          </InputGroup>
        </StateRow>
        <StateRow label="block-end">
          <InputGroup className="w-full max-w-measure">
            <InputGroupTextarea
              aria-label="Note for the shop"
              placeholder="Anything we should put on first?"
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText className="tabular-nums">0 / 280</InputGroupText>
              <InputGroupButton size="sm" variant="default" className="ml-auto">
                Send note
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
