import { DiscIcon, HeadphonesIcon } from "lucide-react"
import { Badge } from "@/fineliner/ui/badge"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Badge",
  description:
    "A small framed label for a record's status or kind; a pocket of ink for the rare loud one.",
  item: "badge",
  group: "Data display",
}

const VARIANTS = [
  { variant: "default", label: "New in" },
  { variant: "secondary", label: "On hold" },
  { variant: "destructive", label: "Skips" },
  { variant: "outline", label: "Near mint" },
  { variant: "ghost", label: "2×LP" },
  { variant: "link", label: "Ellen Moe Trio" },
] as const

const RECORDS = [
  {
    title: "Harbour Lights",
    id: "LR-0431",
    status: "New in",
    variant: "default",
  },
  {
    title: "Paper Moons",
    id: "LR-0429",
    status: "On hold",
    variant: "secondary",
  },
  {
    title: "Second Breakfast",
    id: "LR-0420",
    status: "Skips",
    variant: "destructive",
  },
  {
    title: "Slow Weather",
    id: "LR-0430",
    status: "Near mint",
    variant: "outline",
  },
] as const

export default function BadgeDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map(({ variant, label }) => (
          <StateRow key={variant} label={variant}>
            <Badge variant={variant}>{label}</Badge>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="As a link">
        <StateRow label="Hover and focus">
          <Badge render={<a href="#badge-list" />}>New in</Badge>
          <Badge variant="secondary" render={<a href="#badge-list" />}>
            On hold
          </Badge>
          <Badge variant="outline" render={<a href="#badge-list" />}>
            Jazz
          </Badge>
          <Badge variant="destructive" render={<a href="#badge-list" />}>
            Skips
          </Badge>
          <Badge variant="link" render={<a href="#badge-list" />}>
            Ellen Moe Trio
          </Badge>
        </StateRow>
      </DemoSection>
      <DemoSection title="With icon and invalid">
        <StateRow label="Icon">
          <Badge>
            <HeadphonesIcon data-icon="inline-start" /> Listening copy
          </Badge>
          <Badge variant="outline">
            <DiscIcon data-icon="inline-start" /> 2×LP
          </Badge>
        </StateRow>
        <StateRow label="Invalid">
          <Badge variant="outline" aria-invalid="true">
            No price
          </Badge>
          <Badge aria-invalid="true">No price</Badge>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a list">
        <ul id="badge-list" className="m-0 max-w-[28rem] list-none p-0">
          {RECORDS.map(({ title, id, status, variant }) => (
            <li
              key={id}
              className="relative flex items-center gap-tight py-tight after:absolute after:inset-x-0 after:-bottom-1.5 after:rule after:text-pen-faint"
            >
              <span className="font-medium">{title}</span>
              <span className="font-type text-small text-pen-quiet">{id}</span>
              <Badge variant={variant} className="ml-auto">
                {status}
              </Badge>
            </li>
          ))}
        </ul>
      </DemoSection>
    </>
  )
}
