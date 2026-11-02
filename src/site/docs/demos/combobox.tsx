import { Fragment } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/fineliner/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/fineliner/ui/field"
import { RELEASES } from "@/site/listening-room/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Combobox",
  description:
    "A field that filters a list as you type, for finding one record, or several, in a catalogue too long to scroll.",
  item: "combobox",
  group: "Forms",
}

const ARTIST = Object.fromEntries(RELEASES.map((r) => [r.title, r.artist]))
const TITLES = RELEASES.map((r) => r.title)
const GENRES = [
  "Ambient",
  "Bossa",
  "Dub",
  "Folk",
  "Jazz",
  "Kraut",
  "Library",
  "Soul",
]
const SHELVES = GENRES.map((genre) => ({
  value: genre,
  items: RELEASES.filter((r) => r.genre === genre).map((r) => r.title),
}))

function RecordItem({ title }: { title: string }) {
  return (
    <ComboboxItem value={title}>
      <span className="shrink-0 whitespace-nowrap">{title}</span>
      <span className="min-w-0 truncate text-small text-pen-quiet">
        {ARTIST[title]}
      </span>
    </ComboboxItem>
  )
}

function Records(
  props: React.ComponentProps<typeof ComboboxInput> & {
    defaultValue?: string
  },
) {
  const { defaultValue, ...input } = props
  return (
    <Combobox items={TITLES} defaultValue={defaultValue}>
      <ComboboxInput placeholder="Choose a record" {...input} />
      <ComboboxContent className="w-96">
        <ComboboxEmpty>No record by that name.</ComboboxEmpty>
        <ComboboxList>
          {(title: string) => <RecordItem key={title} title={title} />}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function Genres() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox
      multiple
      autoHighlight
      items={GENRES}
      defaultValue={["Jazz", "Soul", "Library"]}
    >
      <ComboboxChips ref={anchor} className="w-96 max-w-full">
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Genres for Thursday"
                placeholder={values.length ? "" : "Add a genre"}
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No genre by that name.</ComboboxEmpty>
        <ComboboxList>
          {(genre: string) => (
            <ComboboxItem key={genre} value={genre}>
              {genre}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function Shelves() {
  return (
    <Combobox items={SHELVES}>
      <ComboboxInput
        aria-label="Record, by genre"
        placeholder="Choose a record"
        className="w-72"
      />
      <ComboboxContent className="w-96">
        <ComboboxEmpty>No record by that name.</ComboboxEmpty>
        <ComboboxList>
          {(shelf: (typeof SHELVES)[number], index: number) => (
            <ComboboxGroup key={shelf.value} items={shelf.items}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxLabel>{shelf.value}</ComboboxLabel>
              <ComboboxCollection>
                {(title: string) => <RecordItem key={title} title={title} />}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Chosen">
          <Records
            aria-label="Record to hold"
            defaultValue="Harbour Lights"
            className="w-72"
            showClear
          />
        </StateRow>
        <StateRow label="Placeholder">
          <Field className="w-auto">
            <FieldLabel htmlFor="cb-record">Record to play first</FieldLabel>
            <Records id="cb-record" className="w-72" />
          </Field>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <Records
              aria-label="Record to hold"
              aria-invalid="true"
              aria-describedby="cb-error"
              className="w-72"
            />
            <FieldError id="cb-error">Choose the record to hold.</FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Records
            aria-label="Record to hold"
            defaultValue="Neon Orchard"
            disabled
            className="w-72"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Several">
          <Genres />
        </StateRow>
        <StateRow label="Groups">
          <Shelves />
        </StateRow>
      </DemoSection>
    </>
  )
}
