// The five as a plain list: a portrait drawn with the same hair, glasses and beard as their figure at the lunch table,
// their name and their role. Rendered on the server; nothing here is operated.
import "@/site/baghuset/drawings"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { PEOPLE } from "./data"

export function PeopleList() {
  return (
    <ul className="m-0 grid list-none gap-y-snug p-0">
      {PEOPLE.map((person) => (
        <li key={person.id} className="flex items-center gap-x-snug">
          <Avatar size="lg" className="size-12">
            <AvatarFallback data-portrait="">
              <Drawing
                object={`baghuset-${person.id}`}
                seed={person.name}
                title=""
                className="pointer-events-none absolute top-[-14%] left-[-25%] w-[150%]"
              />
            </AvatarFallback>
          </Avatar>
          <span className="grid">
            <span>{person.name}</span>
            <span className="text-small leading-small text-pen-quiet">
              {person.role}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
