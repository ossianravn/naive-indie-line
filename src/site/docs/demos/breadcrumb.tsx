import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/fineliner/ui/breadcrumb"
import { Button } from "@/fineliner/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/fineliner/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Breadcrumb",
  description:
    "The trail from the top of the shop to the page you are on, each step a link back, joined by small pen chevrons.",
  item: "breadcrumb",
  group: "Navigation",
}

/** A trail of links ending on the current page. */
function Trail({ steps, page }: { steps: string[]; page: string }) {
  return (
    <>
      {steps.map((step) => (
        <Fragment key={step}>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`#${step.toLowerCase().replace(/\W+/g, "-")}`}
            >
              {step}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </Fragment>
      ))}
      <BreadcrumbItem>
        <BreadcrumbPage>{page}</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  )
}

export default function BreadcrumbDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#shop">Listening Room</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#catalogue">Catalogue</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Harbour Lights</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Collapsed">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#shop">Listening Room</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Show the hidden steps"
                      />
                    }
                  >
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Thursday evenings</DropdownMenuItem>
                    <DropdownMenuItem>November 2026</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#thursday-12">
                  Thursday 12 November
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bookings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Long trail">
          <Breadcrumb className="max-w-[20rem]">
            <BreadcrumbList>
              <Trail
                steps={["Listening Room", "Catalogue", "Library", "1973"]}
                page="Studies in Blue Light, Library Ensemble Nº 4"
              />
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Custom separator">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>·</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Opening hours</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
      </DemoSection>
    </>
  )
}
