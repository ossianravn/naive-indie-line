import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/fineliner/ui/item"
import { Progress, ProgressLabel, ProgressValue } from "@/fineliner/ui/progress"
import { EVENINGS, shortDay } from "./sessions-data"

/** The Thursday evenings: date, what is on, who hosts, and how full each is. */
export function Evenings() {
  return (
    <section aria-labelledby="evenings" className="mt-page">
      <h2 id="evenings" className="m-0 text-h2">
        Thursday evenings
      </h2>
      <p className="m-0 mt-hair text-small leading-small text-pen-quiet">
        From seven, twelve seats, the records on the turntable chosen by the
        host.
      </p>
      <ItemGroup className="mt-snug max-w-[44rem]">
        {EVENINGS.map((evening) => (
          <Item key={evening.date} role="listitem">
            <ItemMedia variant="number" className="w-16 font-type text-small">
              {shortDay(evening.date).replace(/^\w+ /u, "")}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{evening.title}</ItemTitle>
              <ItemDescription>
                With {evening.host} · {evening.note}
              </ItemDescription>
            </ItemContent>
            <Progress
              value={(evening.taken / evening.seats) * 100}
              className="w-36 shrink-0 max-sm:hidden"
            >
              <ProgressLabel className="sr-only">
                Seats taken for {evening.title}
              </ProgressLabel>
              <ProgressValue>
                {() => `${evening.taken} of ${evening.seats}`}
              </ProgressValue>
            </Progress>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
