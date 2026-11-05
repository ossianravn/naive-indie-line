"use client"

// Colour for the Inline section: a pen and a fill, applied to the section's samples, which the server has already
// drawn. The samples follow `data-pen` and `--wash` on their wrapper, so choosing only sets those two; until the
// island hydrates they show in the page's own pen.
import { useEffect, useId, useState } from "react"
import { type Ink } from "./faces"
import {
  Control,
  FillSwatches,
  PenSwatches,
  washOf,
  type Fill,
} from "./swatches"

export function InlineColour({ target }: { target: string }) {
  const [ink, setInk] = useState<Ink | null>(null)
  const [fill, setFill] = useState<Fill>("own")
  const id = useId()

  useEffect(() => {
    const el = document.getElementById(target)
    if (!el) return
    if (ink) el.dataset.pen = ink
    else delete el.dataset.pen
    const wash = washOf(fill)
    if (wash) el.style.setProperty("--wash", wash)
    else el.style.removeProperty("--wash")
  }, [target, ink, fill])

  return (
    <div className="flex flex-wrap items-end gap-x-page gap-y-snug">
      <Control label="Pen" labelId={`${id}-ink`}>
        <PenSwatches labelledBy={`${id}-ink`} value={ink} onChange={setInk} />
      </Control>
      <Control label="Fill" labelId={`${id}-fill`}>
        <FillSwatches
          labelledBy={`${id}-fill`}
          value={fill}
          onChange={setFill}
        />
      </Control>
    </div>
  )
}
