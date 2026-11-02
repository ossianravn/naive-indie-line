import { toast } from "sonner"
import { Button } from "@/fineliner/ui/button"
import { Toaster } from "@/fineliner/ui/sonner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sonner",
  description:
    "Brief slips that confirm what just happened, or offer to undo it, without taking anyone away from what they were doing.",
  item: "sonner",
  group: "Overlays",
}

const sync = () =>
  new Promise<{ count: number }>((resolve) =>
    setTimeout(() => resolve({ count: 20 }), 1800),
  )

export default function SonnerDemo() {
  return (
    <>
      <DemoSection title="By kind">
        <StateRow label="Success">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Session booked", {
                description: "Maya Singh · Thursday 5 November, 18:00",
              })
            }
          >
            Book a session
          </Button>
        </StateRow>
        <StateRow label="Error">
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Hold not placed", {
                description: "Paper Moons is already held for Jonas Berg.",
              })
            }
          >
            Hold Paper Moons
          </Button>
        </StateRow>
        <StateRow label="Warning">
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Two seats left on Thursday", {
                description: "The 19 November evening is nearly full.",
              })
            }
          >
            Check seats
          </Button>
        </StateRow>
        <StateRow label="Info">
          <Button
            variant="outline"
            onClick={() =>
              toast.info("The shop opens at noon on Mondays", {
                description: "The listening room opens at one.",
              })
            }
          >
            Opening hours
          </Button>
        </StateRow>
        <StateRow label="Plain">
          <Button
            variant="outline"
            onClick={() => toast("Price label printed for LR-0431")}
          >
            Print price label
          </Button>
        </StateRow>
      </DemoSection>
      <DemoSection title="Flows">
        <StateRow label="Loading, then done">
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(sync(), {
                loading: "Counting the racks…",
                success: (data) => `${data.count} records counted`,
                error: "The count stopped. Try again.",
              })
            }
          >
            Count the racks
          </Button>
        </StateRow>
        <StateRow label="With an action">
          <Button
            variant="outline"
            onClick={() =>
              toast("Record removed", {
                description: "Night Ferry · Saltwater Choir · LR-0425",
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Night Ferry is back"),
                },
              })
            }
          >
            Remove Night Ferry
          </Button>
        </StateRow>
        <StateRow label="With a close button">
          <Button
            variant="outline"
            onClick={() =>
              toast("Ama Owusu is on her way", {
                description: "She asked for Rain on Tin to be kept out.",
                closeButton: true,
                duration: 8000,
              })
            }
          >
            Note a visitor
          </Button>
        </StateRow>
      </DemoSection>
      <Toaster />
    </>
  )
}
