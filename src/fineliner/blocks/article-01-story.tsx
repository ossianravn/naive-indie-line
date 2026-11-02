"use client"

import { HandNote } from "@/fineliner/extras/hand-note"
import { PullQuote } from "@/fineliner/extras/pull-quote"

// The article's default prose: Listening Room's journal on how the shop grades a record. Children of Typography, so
// it reads as typeset text; the hand note hangs in the margin beside its paragraph on wide screens and drops under
// it on narrow ones.

export function GradingStory() {
  return (
    <>
      <p>
        Every record that comes into the shop goes on the turntable in the
        listening room before it goes in the racks. We look at it first, under
        the lamp on the counter, and then we play it: the first track of each
        side, the last, and anywhere the light showed us a mark.
      </p>
      {/* The note's positioned parent: it hangs beside this paragraph, held to the reading measure. */}
      <div className="relative max-w-measure">
        <p>
          We grade the vinyl and the sleeve separately, because they age
          differently. A sleeve can be soft at the corners from forty years in a
          box while the record inside plays like the day it was pressed, and the
          other way round. The grade on the price tag is the record’s; the
          sleeve’s is in the note under it.
        </p>
        <HandNote placement="margin" point="start" seed="grading-note">
          ask at the counter: we play you any record first
        </HandNote>
      </div>
      <h2>The grades</h2>
      <table>
        <thead>
          <tr>
            <th>Grade</th>
            <th>What it means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-type">M</td>
            <td>Mint. Still sealed, or never played.</td>
          </tr>
          <tr>
            <td className="font-type">NM</td>
            <td>Near mint. Played with care; nothing you can see or hear.</td>
          </tr>
          <tr>
            <td className="font-type">VG+</td>
            <td>
              Very good plus. Light marks under the lamp, silent when it plays.
            </td>
          </tr>
          <tr>
            <td className="font-type">VG</td>
            <td>
              Very good. Some noise in the quiet passages; it never jumps.
            </td>
          </tr>
          <tr>
            <td className="font-type">G</td>
            <td>
              Good. It plays through, crackle and all, and is priced to be
              played.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        We grade by ear. A record can look scuffed and play quietly, or look
        clean and hiss through every fade. The lamp tells us where to listen;
        the room tells us the grade.
      </p>
      <PullQuote cite="Ellen Moe, at the counter">
        The lamp tells us where to listen; the room tells us the grade.
      </PullQuote>
      <h2>When we are not sure</h2>
      <p>
        We grade down. If a record sits between VG+ and VG, it goes in the racks
        as VG and the price follows. Nobody has come back yet to complain that a
        record played better than its tag.
      </p>
      <p>
        Anything worth knowing goes on the note. Harbour Lights by the Ellen Moe
        Trio is a first pressing at VG+, and its note says there is a whisper of
        surface noise on side two, so you know before the needle finds it.
      </p>
    </>
  )
}
