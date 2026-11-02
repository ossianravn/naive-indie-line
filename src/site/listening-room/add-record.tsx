import { useState, type FormEvent } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import { Checkbox } from "@/fineliner/ui/checkbox"
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/fineliner/ui/field"
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"
import { RadioGroup, RadioGroupItem } from "@/fineliner/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/fineliner/ui/select"
import { Textarea } from "@/fineliner/ui/textarea"
import {
  CONDITION_LABEL,
  FORMATS,
  GENRES,
  catalogueNumber,
  type Condition,
  type Format,
  type Release,
} from "./data"

const genres = GENRES.map((g) => ({ label: g, value: g }))
const conditions = (Object.keys(CONDITION_LABEL) as Condition[]).map((c) => ({
  label: `${c} · ${CONDITION_LABEL[c]}`,
  value: c,
}))

/** The "Add a record" button and its dialog. Calls onAdd with the new record once the form is valid. */
export function AddRecord({
  onAdd,
  next,
}: {
  onAdd: (item: Release) => void
  next: number
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [price, setPrice] = useState("")
  const [format, setFormat] = useState<Format>("LP")
  const [genre, setGenre] = useState<string>("Jazz")
  const [condition, setCondition] = useState<Condition>("VG+")
  const [held, setHeld] = useState(false)
  const [note, setNote] = useState("")
  const [tried, setTried] = useState(false)

  const priceValue = Number(price.replace(/[\s,]|kr/g, ""))
  const errors = {
    title: title.trim() ? "" : "Give the record its title, as on the sleeve.",
    artist: artist.trim() ? "" : "Name the artist, or write Various artists.",
    price:
      Number.isInteger(priceValue) && priceValue > 0
        ? ""
        : "Price it in whole kroner, like 240.",
  }
  const reset = () => [
    setTitle(""),
    setArtist(""),
    setPrice(""),
    setFormat("LP"),
    setGenre("Jazz"),
    setCondition("VG+"),
    setHeld(false),
    setNote(""),
    setTried(false),
  ]

  function save(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (errors.title || errors.artist || errors.price) return
    onAdd({
      id: catalogueNumber(next),
      title: title.trim(),
      artist: artist.trim(),
      label: "Label to be checked",
      year: 2026,
      format,
      genre,
      condition,
      price: priceValue,
      status: held ? "held" : "racks",
      note: note.trim(),
    })
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" /> Add a record
      </DialogTrigger>
      <DialogContent className="sm:max-w-[34rem]">
        <form onSubmit={save} noValidate>
          <DialogHeader>
            <DialogTitle>Add a record</DialogTitle>
            <DialogDescription>
              {catalogueNumber(next)} · Monday 2 November
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-snug">
            <Field data-invalid={tried && !!errors.title}>
              <FieldLabel htmlFor="record-title">Title</FieldLabel>
              <Input
                id="record-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={tried && !!errors.title}
                className="w-[18rem] max-w-full"
                autoFocus
              />
              {tried && errors.title && <FieldError>{errors.title}</FieldError>}
            </Field>
            <Field data-invalid={tried && !!errors.artist}>
              <FieldLabel htmlFor="record-artist">Artist</FieldLabel>
              <Input
                id="record-artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                aria-invalid={tried && !!errors.artist}
                className="w-[18rem] max-w-full"
              />
              {tried && errors.artist && (
                <FieldError>{errors.artist}</FieldError>
              )}
            </Field>
            <div className="flex flex-wrap gap-x-section gap-y-snug">
              <Field data-invalid={tried && !!errors.price} className="w-auto">
                <FieldLabel htmlFor="record-price">Price, kr</FieldLabel>
                <Input
                  id="record-price"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  aria-invalid={tried && !!errors.price}
                  className="w-[6rem] font-type tabular-nums"
                />
                {tried && errors.price && (
                  <FieldError>{errors.price}</FieldError>
                )}
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="record-genre">Genre</FieldLabel>
                <Select
                  items={genres}
                  value={genre}
                  onValueChange={(value) => setGenre(String(value))}
                >
                  <SelectTrigger id="record-genre" className="w-[10rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="record-condition">Condition</FieldLabel>
                <Select
                  items={conditions}
                  value={condition}
                  onValueChange={(value) => setCondition(value as Condition)}
                >
                  <SelectTrigger id="record-condition" className="w-[13.5rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel>Format</FieldLabel>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as Format)}
                className="flex flex-wrap gap-x-section"
              >
                {FORMATS.map((f) => (
                  <Label key={f}>
                    <RadioGroupItem value={f} /> {f}
                  </Label>
                ))}
              </RadioGroup>
            </Field>
            <Label>
              <Checkbox
                checked={held}
                onCheckedChange={(checked) => setHeld(checked === true)}
              />{" "}
              Put it straight on hold
            </Label>
            <Field>
              <FieldLabel htmlFor="record-note">Note</FieldLabel>
              <Textarea
                id="record-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Pressing, wear, who it is held for"
                className="max-w-[30rem]"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Add to the catalogue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
