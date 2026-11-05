"use client"

import { useId, useState, type CSSProperties } from "react"
import { BoldIcon, ItalicIcon } from "lucide-react"
import { Lettering, type LetteringFace } from "@/fineliner/drawing/lettering"
import { cn } from "@/fineliner/lib/utils"
import { Input } from "@/fineliner/ui/input"
import { Slider } from "@/fineliner/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { FACES, styleClass, type Ink } from "./faces"
import {
  Control,
  FillSwatches,
  PenSwatches,
  washStyle,
  type Fill,
} from "./swatches"

// The lettering page's tester: your words in any face and style, at any size, in any pen, and Inline's Fill in any
// pen's wash or none. The sample shrinks to fit a narrow screen, so the size is the most it is set at.

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
    face === "inline" ? washStyle(fill) : undefined

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
          <PenSwatches labelledBy={`${id}-ink`} value={ink} onChange={setInk} />
        </Control>
        {face === "inline" && (
          <Control label="Fill" labelId={`${id}-fill`}>
            <FillSwatches
              labelledBy={`${id}-fill`}
              value={fill}
              onChange={setFill}
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
