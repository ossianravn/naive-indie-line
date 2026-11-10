"use client"

// "What it costs": the page's one calculator. What you need (any of three kinds), how big, when you need it and two
// extras on the left; the answer as a receipt beside them (under them on a phone), stamped ESTIMATE, and a button that
// carries its lines down to the brief form at the street. Nothing in the receipt moves: lines appear and go.
import { useId, useState } from "react"
import { Receipt, ReceiptLine, ReceiptTotal } from "@/fineliner/extras/receipt"
import { Stamp } from "@/fineliner/extras/stamp"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { buttonVariants } from "@/fineliner/ui/button"
import { Slider } from "@/fineliner/ui/slider"
import { Switch } from "@/fineliner/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { carry } from "./brief-store"
import { kr, PRICES } from "./data"

const KINDS = Object.keys(PRICES.kinds)
const SIZES = Object.keys(PRICES.sizes)

export function Estimate() {
  const id = useId()
  const [kinds, setKinds] = useState<string[]>(["Identity"])
  const [size, setSize] = useState("Medium")
  const [weeks, setWeeks] = useState(10)
  const [drawings, setDrawings] = useState(false)
  const [words, setWords] = useState(false)
  const rush = weeks < 6
  const base = kinds.reduce((sum, kind) => sum + (PRICES.kinds[kind] ?? 0), 0)
  const factor = PRICES.sizes[size] ?? 1
  const extras = (drawings ? PRICES.drawings : 0) + (words ? PRICES.words : 0)
  const total =
    base * factor * (rush ? 1 + PRICES.rush : 1) + (kinds.length ? extras : 0)
  const lines: [string, string][] = [
    ...kinds.map((kind): [string, string] => [
      kind,
      kr(PRICES.kinds[kind] ?? 0),
    ]),
    ...(kinds.length
      ? ([
          [
            `Size: ${size.toLowerCase()}`,
            `× ${String(factor).replace(".", ",")}`,
          ],
          ...(rush ? [[`Within ${weeks} weeks`, "+20 %"]] : []),
          ...(drawings ? [["Drawings", kr(PRICES.drawings)]] : []),
          ...(words ? [["We write the words", kr(PRICES.words)]] : []),
        ] as [string, string][])
      : []),
  ]
  const label = "label m-0 text-pen-quiet"
  return (
    <div className="grid items-start gap-x-section gap-y-line md:grid-cols-[minmax(0,24rem)_minmax(0,22rem)]">
      <div className="grid gap-y-line">
        <div className="grid gap-y-tight">
          <p id={`${id}-kind`} className={label}>
            What you need
          </p>
          <ToggleGroup
            aria-labelledby={`${id}-kind`}
            variant="outline"
            spacing={0}
            multiple
            value={kinds}
            onValueChange={(next: unknown[]) => setKinds(next as string[])}
            className="flex-wrap justify-self-start"
          >
            {KINDS.map((kind) => (
              <ToggleGroupItem key={kind} value={kind}>
                {kind}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="grid gap-y-tight">
          <p id={`${id}-size`} className={label}>
            Size
          </p>
          <ToggleGroup
            aria-labelledby={`${id}-size`}
            variant="outline"
            spacing={0}
            value={[size]}
            onValueChange={(next: unknown[]) =>
              next[0] && setSize(next[0] as string)
            }
            className="justify-self-start"
          >
            {SIZES.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="grid gap-y-tight">
          <div className="flex items-baseline justify-between gap-x-snug">
            <p id={`${id}-weeks`} className={label}>
              Weeks until you need it
            </p>
            <span className="font-type text-small tabular-nums">{weeks}</span>
          </div>
          <Slider
            aria-labelledby={`${id}-weeks`}
            min={4}
            max={16}
            value={weeks}
            onValueChange={(v) => setWeeks(Array.isArray(v) ? (v[0] ?? 10) : v)}
            className="max-w-[18rem]"
          />
          <p className="m-0 text-small leading-small text-pen-quiet">
            Under six weeks adds 20 %.
          </p>
        </div>
        <div className="grid gap-y-tight">
          {(
            [
              ["Drawings", drawings, setDrawings],
              ["We write the words", words, setWords],
            ] as const
          ).map(([name, on, set]) => (
            <label
              key={name}
              className="flex items-center justify-between gap-x-snug sm:max-w-[18rem]"
            >
              <span>{name}</span>
              <Switch checked={on} onCheckedChange={(next) => set(next)} />
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-y-snug" aria-live="polite">
        <Receipt seed="baghuset-estimate">
          {lines.length ? (
            lines.map(([what, amount]) => (
              <ReceiptLine key={what} amount={amount}>
                {what}
              </ReceiptLine>
            ))
          ) : (
            <p className="m-0 text-pen-quiet">Choose what you need.</p>
          )}
          <ReceiptTotal amount={kr(total)}>Total excl. moms</ReceiptTotal>
          <p className="m-0 pt-tight text-end">
            <Stamp>Estimate</Stamp>
          </p>
        </Receipt>
        <a
          href="#write"
          data-slot="button"
          aria-disabled={kinds.length ? undefined : true}
          className={buttonVariants({
            variant: "outline",
            className:
              "justify-self-start no-underline aria-disabled:pointer-events-none aria-disabled:opacity-50",
          })}
          style={frameStyle(["Send this with a brief"])}
          onClick={() =>
            carry({
              kinds,
              lines: [
                ...lines.map(([w, a]) => `${w}: ${a}`),
                `Total excl. moms: ${kr(total)}`,
              ],
            })
          }
        >
          Send this with a brief
        </a>
      </div>
    </div>
  )
}
