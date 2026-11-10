"use client"

// The ground floor's room: its wall above the strip, and every one at lunch as a spot that opens a card with their
// name, role and one plain fact: on hover with a mouse, on a tap with a finger. The people list on the wall is the
// second way to the same people.
import type { ReactNode } from "react"
import { RoomSection } from "@/fineliner/extras/room-section"
import { SceneSpot, type SceneRegions } from "@/fineliner/extras/scene-spots"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/fineliner/ui/popover"
import { CAT, PEOPLE } from "./data"

const AT_LUNCH = [...PEOPLE, CAT]

export function PeopleRoom({
  regions,
  children,
}: {
  regions: SceneRegions
  children?: ReactNode
}) {
  return (
    <RoomSection
      id="people"
      aria-labelledby="people-title"
      scene="baghuset-ground"
      format="strip"
      seed="baghuset"
      side="both"
      regions={regions}
      spots={AT_LUNCH.map((person) => (
        <Popover key={person.id}>
          <PopoverTrigger
            openOnHover
            delay={150}
            render={
              <SceneSpot
                region={person.id}
                label={person.name.split(" ")[0] ?? person.name}
              />
            }
          />
          <PopoverContent className="w-auto max-w-[18rem]">
            <PopoverHeader>
              <PopoverTitle>{person.name}</PopoverTitle>
              <PopoverDescription className="label">
                {person.role}
              </PopoverDescription>
            </PopoverHeader>
            <p className="m-0 text-small leading-small">{person.fact}</p>
          </PopoverContent>
        </Popover>
      ))}
    >
      {children}
    </RoomSection>
  )
}
