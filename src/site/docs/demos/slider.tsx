import { useState, type ReactNode } from "react"
import { Slider } from "@/fineliner/ui/slider"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Slider",
  description:
    "A pen line with a paper thumb, for setting a value or a range by feel within known bounds.",
  item: "slider",
  group: "Forms",
}

const first = (v: number | readonly number[]) =>
  Array.isArray(v) ? (v[0] ?? 0) : (v as number)

function Readout({ children }: { children: ReactNode }) {
  return (
    <output className="w-[5.5rem] shrink-0 font-type text-small leading-small tabular-nums">
      {children}
    </output>
  )
}

function Labelled({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-hair">
      <span id={id} className="text-ui leading-ui">
        {label}
      </span>
      <div className="flex items-center gap-snug">{children}</div>
    </div>
  )
}

function Eq({ id, label }: { id: string; label: string }) {
  const [level, setLevel] = useState(0)
  return (
    <div className="flex flex-col items-center gap-hair">
      <Slider
        aria-labelledby={id}
        orientation="vertical"
        min={-6}
        max={6}
        value={level}
        onValueChange={(v) => setLevel(first(v))}
        className="h-40"
      />
      <span id={id} className="label">
        {label}
      </span>
      <output className="font-type text-small tabular-nums">
        {level > 0 ? `+${level}` : level} dB
      </output>
    </div>
  )
}

export default function SliderDemo() {
  const [volume, setVolume] = useState(6)
  const [price, setPrice] = useState<readonly number[]>([10, 30])
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Single value">
          <Labelled id="booth-volume" label="Volume in the booth">
            <Slider
              aria-labelledby="booth-volume"
              min={0}
              max={10}
              value={volume}
              onValueChange={(v) => setVolume(first(v))}
              className="w-64"
            />
            <Readout>{volume} of 10</Readout>
          </Labelled>
        </StateRow>
        <StateRow label="Range">
          <Labelled id="price-range" label="Price">
            <Slider
              aria-labelledby="price-range"
              min={5}
              max={60}
              value={price}
              onValueChange={(v) =>
                setPrice(Array.isArray(v) ? v : [v as number])
              }
              className="w-64"
            />
            <Readout>
              £{price[0]}–£{price[1]}
            </Readout>
          </Labelled>
        </StateRow>
        <StateRow label="Disabled">
          <Labelled id="room-volume" label="Room volume (set by the shop)">
            <Slider
              aria-labelledby="room-volume"
              min={0}
              max={10}
              defaultValue={4}
              disabled
              className="w-64"
            />
            <Readout>4 of 10</Readout>
          </Labelled>
        </StateRow>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="Bass · treble">
          <div className="flex gap-section">
            <Eq id="eq-bass" label="Bass" />
            <Eq id="eq-treble" label="Treble" />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
