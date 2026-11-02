import { Typography, TypographyKicker } from "@/fineliner/ui/typography"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Typography",
  description:
    "A prose container that typesets plain long-form content, such as a shop newsletter or a guide, without a class on every element.",
  item: "typography",
  group: "Data display",
}

export default function TypographyDemo() {
  return (
    <DemoSection title="A note from the counter">
      <Typography dropCap>
        <TypographyKicker>Shop notes · Monday 2 November 2026</TypographyKicker>
        <h2>Harbour Lights came back in a box of jazz</h2>
        <p>
          Someone left a box on the step on Saturday morning: forty records, a
          note that said only “for the racks”, and at the bottom, in a sleeve
          soft with handling, a first pressing of Harbour Lights by the Ellen
          Moe Trio. We played side one in the listening room before we had even
          priced it. A whisper of surface noise on the quiet passages, and
          otherwise it sounds like the night it was made.
        </p>
        <p>
          It is in the racks now, under Jazz, at 320 kr. If you would rather
          hear it first, <a href="#book">book the listening room</a> for an
          hour; the armchair by the window is the good one.
        </p>
        <h3>New in this week</h3>
        <ul>
          <li>Slow Weather, The Quiet Arcade, near mint</li>
          <li>
            Music for Waiting Rooms, Ana Lindqvist
            <ul>
              <li>Plays beautifully on the room&apos;s speakers</li>
            </ul>
          </li>
          <li>Low Tide Dub, Kingsway Sound System, a 12″ with a heavy cut</li>
        </ul>
        <blockquote>
          Play the record you came for, then the one next to it in the rack.
          That is how the second one becomes the favourite.
        </blockquote>
        <h3>By the glass on Thursday</h3>
        <table>
          <thead>
            <tr>
              <th>Wine</th>
              <th>From</th>
              <th>Glass</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pét-nat</td>
              <td>Loire</td>
              <td>65 kr</td>
            </tr>
            <tr>
              <td>Light red</td>
              <td>Jura</td>
              <td>70 kr</td>
            </tr>
            <tr>
              <td>Orange</td>
              <td>Slovenia</td>
              <td>75 kr</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h4>Before Thursday 5 November</h4>
        <ol>
          <li>Pull the Ellen Moe Trio records into one rack by the door.</li>
          <li>
            Mark held records with <code>held:thu</code> in the stock book so
            they come back out on Friday.
          </li>
          <li>Clean the stylus and set out eight chairs by the window.</li>
        </ol>
      </Typography>
    </DemoSection>
  )
}
