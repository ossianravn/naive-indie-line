"use client"

import { useId, useState, type CSSProperties, type ReactNode } from "react"
import { BoldIcon, ItalicIcon } from "lucide-react"
import { Lettering, type LetteringFace } from "@/fineliner/drawing/lettering"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { Input } from "@/fineliner/ui/input"
import { Slider } from "@/fineliner/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { FACES, INKS, styleClass, type Ink } from "./faces"

// The lettering page's tester: your words in any face and style, at any size, in any pen, and Inline's Fill in any
// pen's wash or none. The sample shrinks to fit a narrow screen, so the size is the most it is set at.

type Fill = "own" | Ink | "none"

export function LetteringTester() {
  const [words, setWords] = useState("Rêverie")
  const [face, setFace] = useState<LetteringFace>("inline")
  const [style, setStyle] = useState<string[]>([])
  const [size, setSize] = useState(128)
  const [ink, setInk] = useState<Ink | null>(null)
  const [fill, setFill] = useState<Fill>("own")
  const id = useId()
  const bold = style.includes("bold")
  const italic = style.includes("italic")
  const wash: CSSProperties | undefined =
    face !== "inline" || fill === "own"
      ? undefined
      : ({
          "--wash": fill === "none" ? "transparent" : `var(--wash-${fill})`,
        } as CSSProperties)

  return (
    <div className="grid gap-y-line">
      <div className="flex flex-wrap items-end gap-x-line gap-y-snug">
        <Control label="Words" htmlFor={`${id}-words`}>
          <Input
            id={`${id}-words`}
            value={words}
            maxLength={60}
            onChange={(e) => setWords(e.target.value)}
            className="w-[15rem]"
          />
        </Control>
        <Control label="Face" labelId={`${id}-face`}>
          <ToggleGroup
            aria-labelledby={`${id}-face`}
            variant="outline"
            spacing={0}
            value={[face]}
            onValueChange={(next: unknown[]) =>
              next[0] && setFace(next[0] as LetteringFace)
            }
          >
            {FACES.map((f) => (
              <ToggleGroupItem key={f.face} value={f.face}>
                {f.short}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Control>
        <Control label="Style" labelId={`${id}-style`}>
          <ToggleGroup
            aria-labelledby={`${id}-style`}
            variant="outline"
            spacing={0}
            multiple
            value={style}
            onValueChange={(next: unknown[]) => setStyle(next as string[])}
          >
            <ToggleGroupItem value="bold" aria-label="Bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ItalicIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </Control>
        <Control label="Size" labelId={`${id}-size`}>
          <div className="flex h-control items-center gap-tight">
            <Slider
              aria-labelledby={`${id}-size`}
              min={32}
              max={200}
              value={size}
              onValueChange={(v) => setSize(Array.isArray(v) ? (v[0] ?? 0) : v)}
              className="w-36"
            />
            <output className="w-[3.25rem] text-small tabular-nums text-pen-quiet">
              {size} px
            </output>
          </div>
        </Control>
      </div>
      {/* Colour on a row of its own: the pen, and for Inline its Fill, each named beside its dots. */}
      <div className="flex flex-wrap items-end gap-x-page gap-y-snug">
        <Control label="Pen" labelId={`${id}-ink`}>
          <Swatches
            labelledBy={`${id}-ink`}
            options={INKS.map(([value, name]) => ({ value, name, pen: value }))}
            value={ink}
            none="The page's pen"
            onChange={(v) => setInk(v as Ink)}
          />
        </Control>
        {face === "inline" && (
          <Control label="Fill" labelId={`${id}-fill`}>
            <Swatches
              labelledBy={`${id}-fill`}
              options={[
                { value: "own", name: "The pen's wash", wash: "own" },
                ...INKS.map(([value, name]) => ({
                  value,
                  name: `${name} wash`,
                  wash: value,
                })),
                { value: "none", name: "No fill", wash: "none" },
              ]}
              value={fill}
              onChange={(v) => setFill(v as Fill)}
            />
          </Control>
        )}
      </div>
      <div
        data-pen={ink ?? undefined}
        style={wash}
        className="@container min-h-[calc(min(200px,22vw)*1.3)] text-pen max-sm:order-first"
      >
        <Lettering
          text={words.trim() || "Rêverie"}
          face={face}
          aria-live="polite"
          className={cn("block wrap-anywhere", styleClass({ bold, italic }))}
          style={{ fontSize: `min(${size}px, 17cqi)` }}
        />
      </div>
    </div>
  )
}

function Control({
  label,
  htmlFor,
  labelId,
  children,
}: {
  label: string
  htmlFor?: string
  labelId?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-y-hair">
      <label id={labelId} htmlFor={htmlFor} className="label text-pen-quiet">
        {label}
      </label>
      {children}
    </div>
  )
}

interface Option {
  value: string
  name: string
  /** A pen's dot, or a wash: "own" (the pen's), a pen's, or "none". */
  pen?: Ink
  wash?: string
}

/** A row of colour dots as radios, the chosen one ringed by the pen. */
function Swatches({
  labelledBy,
  options,
  value,
  none = "",
  onChange,
}: {
  labelledBy: string
  options: Option[]
  value: string | null
  /** What a row with nothing chosen says beside it. */
  none?: string
  onChange: (value: string) => void
}) {
  const name = useId()
  const chosen = options.find((o) => o.value === value)?.name ?? none
  return (
    <div className="flex h-control items-center gap-hair">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        className="-ms-[0.3rem] flex items-center"
      >
        {options.map((o) => (
          <label
            key={o.value}
            title={o.name}
            data-pen={o.pen}
            className="press relative grid size-control cursor-pointer place-items-center rounded-full text-pen has-focus-visible:outline-[1.5px] has-focus-visible:outline-pen has-focus-visible:outline-dashed"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              aria-label={o.name}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              style={
                o.wash && o.wash !== "own" && o.wash !== "none"
                  ? { background: `var(--wash-${o.wash})` }
                  : undefined
              }
              className={cn(
                "size-[1.125rem] rounded-full [filter:var(--wob-2)] forced-colors:[forced-color-adjust:none]",
                o.pen && "bg-pen",
                o.wash === "own" && "bg-wash",
                o.wash && "border border-pen",
              )}
            />
            {value === o.value && (
              <PenMark
                name="ring"
                seed={`tester:${o.value}`}
                className="put-down pointer-events-none absolute inset-[0.4rem]"
              />
            )}
          </label>
        ))}
      </div>
      <span
        aria-hidden="true"
        className="text-small leading-small text-pen-quiet"
      >
        {chosen}
      </span>
    </div>
  )
}
