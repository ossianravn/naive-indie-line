import { useState } from "react"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import { Card, CardContent, CardFooter } from "@/fineliner/ui/card"

/** A customer's request on a record: the sleeve and its state, what Jonas asked, and the one press that answers it. */
export function HoldScene() {
  const [held, setHeld] = useState(false)
  return (
    <Card className="max-w-[34rem] gap-snug">
      <CardContent className="flex items-center gap-snug">
        <Drawing
          object="record"
          seed="LR-0429"
          title=""
          className="w-20 shrink-0"
        />
        <div className="min-w-0">
          <p className="m-0 font-medium leading-subhead">Paper Moons</p>
          <p className="m-0 text-small leading-small text-pen-quiet">
            Odile &amp; the Lanterns · LP ·{" "}
            <span className="font-type">180 kr</span>
          </p>
          <Badge
            variant={held ? "default" : "outline"}
            className="mt-tight"
            aria-live="polite"
          >
            {held ? "Held for Jonas until Saturday" : "In the racks, 2 copies"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-snug">
        <figure className="m-0 min-w-0">
          <blockquote className="m-0">
            “Could you keep one for me until Saturday?”
          </blockquote>
          <figcaption className="text-small leading-small text-pen-quiet">
            Jonas, on Tuesday
          </figcaption>
        </figure>
        <Button
          variant={held ? "outline" : "default"}
          onClick={() => setHeld((h) => !h)}
        >
          {held ? "Put back" : "Hold for Jonas"}
        </Button>
      </CardFooter>
    </Card>
  )
}
