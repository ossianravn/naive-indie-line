import { TypographyKicker } from "@/fineliner/ui/typography"

/** A journal post from the shop, long enough to scroll: how a record is graded before it goes into the racks. */
export function GradingArticle() {
  return (
    <>
      <TypographyKicker>The journal · Monday 2 November 2026</TypographyKicker>
      <h2>How we grade a record</h2>
      <p>
        Every record that comes over the counter is graded twice, the vinyl and
        the sleeve each on its own, and the lower of the two never hides behind
        the higher. The grade goes on a small white sticker in the top corner of
        the sleeve, written by hand, with the date we checked it.
      </p>
      <h3>First by eye</h3>
      <p>
        Under the bright lamp by the till we tilt the record slowly until every
        mark catches the light. Hairlines are fine scratches that sit in the
        surface; scuffs are dull patches where the shine has gone. Neither tells
        you how a side will sound, which is why looking is only the first half.
      </p>
      <p>
        The sleeve gets the same lamp. Ring wear, seam splits, a price sticker
        that tore the print when someone pulled it off: each takes the sleeve
        down a step. A name written on the back in biro does not, if it was the
        first owner&apos;s; we rather like those.
      </p>
      <h3>Then by ear</h3>
      <p>
        Then the record goes on the counter&apos;s turntable, with the volume a
        little higher than is polite. We play the start of every side, the
        quietest passage we can find, and the run-out. Surface noise lives in
        the quiet passages; a skip lives wherever the last owner&apos;s cat
        walked across the platter.
      </p>
      <p>
        A record that looks very good plus but crackles through its quiet
        passages drops to very good. One with scuffs that play silent keeps its
        grade. The ear always wins.
      </p>
      <h3>The grades we use</h3>
      <ul>
        <li>Mint: sealed, or opened and never played.</li>
        <li>Near mint: played a few times by someone careful.</li>
        <li>Very good plus: light marks that barely play.</li>
        <li>Very good: some surface noise, never over the music.</li>
        <li>Good: it plays through; the price says the rest.</li>
      </ul>
      <p>
        If you disagree with a grade, bring the record to the listening room on
        a Thursday evening and we will play it together. Thursday 5 November is
        the next one, from 7 pm, with a glass of pét-nat if you like.
      </p>
    </>
  )
}
