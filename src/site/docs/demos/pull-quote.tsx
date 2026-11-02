import { PullQuote } from "@/fineliner/extras/pull-quote"
import { Typography, TypographyKicker } from "@/fineliner/ui/typography"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Pull quote",
  description:
    "A line lifted out of an article and set large, against a pen-ruled margin with quotation marks drawn by the pen.",
  item: "pull-quote",
  group: "Fineliner extras",
}

export default function PullQuoteDemo() {
  return (
    <>
      <DemoSection title="Pull quote">
        <StateRow label="With a source">
          <PullQuote cite="Ines, behind the counter">
            Play the record you came for, then the one next to it in the rack.
          </PullQuote>
        </StateRow>
        <StateRow label="Without">
          <PullQuote>The ear always wins.</PullQuote>
        </StateRow>
        <StateRow label="Calm hand">
          <div data-hand="calm">
            <PullQuote cite="The Thursday list" hand="calm">
              Six bottles, one room, and whatever the last guest left on the
              platter.
            </PullQuote>
          </div>
        </StateRow>
      </DemoSection>

      <DemoSection title="In an article">
        <Typography>
          <TypographyKicker>
            The journal · How we grade a record
          </TypographyKicker>
          <h2>Very good plus, and why we play it first</h2>
          <p>
            Every record that comes over the counter is graded twice: the vinyl
            and the sleeve, each on its own. We look first, under the bright
            lamp by the till, tilting the record until every scuff catches the
            light. Then we listen, because a scuff that plays silent is only a
            mark, and a clean-looking side can still crackle through its quiet
            passages.
          </p>
          <PullQuote cite="From the grading card by the till">
            A scuff that plays silent is only a mark.
          </PullQuote>
          <p>
            So a record can look very good plus and play very good, and the
            lower grade is the one on the sticker. Harbour Lights came in last
            week looking tired and played like new; it went into the racks as
            very good plus, at 320 kr.
          </p>
        </Typography>
      </DemoSection>
    </>
  )
}
