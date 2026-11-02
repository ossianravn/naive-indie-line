import { useState } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"

/** Holding a record for a customer: the sleeve, its price and state, and the one action that changes it. */
export function HoldScene() {
  const [held, setHeld] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-snug">
      <Drawing object="record" seed="LR-0429" title="" className="w-24" />
      <div className="min-w-0">
        <p className="m-0 font-medium leading-subhead">Paper Moons</p>
        <p className="m-0 text-small leading-small text-pen-quiet">
          Odile &amp; the Lanterns
        </p>
        <p className="m-0 mt-hair flex items-center gap-tight">
          <span className="font-type text-small">180 kr</span>
          <Badge variant={held ? "default" : "outline"}>
            {held ? "Held for Jonas" : "In the racks"}
          </Badge>
        </p>
      </div>
      <Button
        variant={held ? "outline" : "default"}
        onClick={() => setHeld((h) => !h)}
        className="ms-auto"
      >
        {held ? "Back in the racks" : "Hold for Jonas"}
      </Button>
    </div>
  )
}
