// A portrait for each of BAGHUSET's five, with the hair, glasses and beard the people list gives them, so the
// avatar in the list and the person at the lunch table are the same person.
import { define, objectsIn } from "@/fineliner/pen"
import { portrait } from "@/fineliner/pen/objects/faces"
import { PEOPLE } from "../data"

const T = objectsIn("baghuset")
define(...PEOPLE.map((person) =>
  T(
    `baghuset-${person.id}`,
    person.name,
    [100, 100],
    [50, 46],
    1,
    (s, p, r, at, k) =>
      portrait(s, p, r, at, k, {
        hair: person.hair,
        glasses: person.glasses,
        beard: person.beard,
      }),
    ["person"],
  ),
))
