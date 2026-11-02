import { FinelinerDefs } from "@/fineliner/defs/fineliner-defs"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { Circled } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { useAppearance } from "@/fineliner/theme"

// A record shop's opening notice: lettering, a drawing and a ringed date, with a switch between day and night, using
// the parts the install test adds.
export function App() {
  const [appearance, setAppearance] = useAppearance()
  const night = appearance.theme === "night"

  return (
    <>
      <FinelinerDefs />
      <main className="mx-auto grid max-w-measure gap-section p-page">
        <Lettering text="Side B" face="liner" className="h-16" />
        <Drawing object="turntable" seed="consumer" className="w-64" />
        <p className={cn("font-read text-body", night && "text-pen")}>
          Records, coffee and a listening corner, open from{" "}
          <Circled seed="opening">Friday</Circled>.
        </p>
        <button
          type="button"
          className="frame h-control w-fit px-snug font-ui text-ui"
          onClick={() => setAppearance({ theme: night ? "day" : "night" })}
        >
          {night ? "Day" : "Night"}
        </button>
      </main>
    </>
  )
}
