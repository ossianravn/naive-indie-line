import { drawing } from "@/fineliner/pen"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/fineliner/ui/avatar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Avatar",
  description:
    "A person's picture in a drawn circle, or a portrait drawn from their name when there is none.",
  item: "avatar",
  group: "Data display",
}

// A stand-in photo, so the demo needs no network: a portrait inked on a coloured ground, cropped close like a head
// shot, as a self-contained image.
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  drawing({ object: "portrait", seed: "Jonas Berg at the counter" })[0]!
    .replace(/viewBox="[^"]+"/, 'viewBox="17 6 66 66"')
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(
      /(<svg[^>]*>)/,
      '$1<style>.ln{fill:none;stroke:#1d2840;stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}.ink{fill:#1d2840}.wash,.sheet-fill{fill:#e9dcc0}</style><rect x="-10" y="-10" width="120" height="120" fill="#b9c7d9"/>',
    ),
)}`

const PEOPLE = ["Maya Singh", "Jonas Berg", "Ama Owusu", "Lars Holm"]
const SIZES = ["sm", "default", "lg"] as const

export default function AvatarDemo() {
  return (
    <>
      <DemoSection title="Sizes">
        <StateRow label="Portrait">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback name="Maya Singh">MS</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
        <StateRow label="Image">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarImage src={PHOTO} alt="Jonas Berg" />
              <AvatarFallback name="Jonas Berg">JB</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
        <StateRow label="Initials only">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback>AO</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Seeded by name">
        <StateRow label="Each person">
          {PEOPLE.map((name) => (
            <Avatar key={name} size="lg">
              <AvatarFallback name={name} />
            </Avatar>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Badge and group">
        <StateRow label="In the shop now">
          <Avatar>
            <AvatarFallback name="Ama Owusu">AO</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src={PHOTO} alt="Jonas Berg" />
            <AvatarBadge />
          </Avatar>
        </StateRow>
        <StateRow label="Group">
          <AvatarGroup>
            {PEOPLE.slice(0, 3).map((name) => (
              <Avatar key={name}>
                <AvatarFallback name={name} />
              </Avatar>
            ))}
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
        </StateRow>
        <StateRow label="In a booking">
          <p className="m-0 flex items-center gap-tight text-small leading-small text-pen-quiet">
            <Avatar size="sm">
              <AvatarFallback name="Maya Singh" />
            </Avatar>
            <span>
              Booked by <span className="font-medium text-pen">Maya Singh</span>{" "}
              · Thursday 19:00
            </span>
          </p>
        </StateRow>
      </DemoSection>
    </>
  )
}
