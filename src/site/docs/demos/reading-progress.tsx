import { useRef } from "react"
import { ReadingProgress } from "@/fineliner/extras/reading-progress"
import { Typography } from "@/fineliner/ui/typography"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { GradingArticle } from "./reading-progress/grading-article"

export const meta: DemoMeta = {
  title: "Reading progress",
  description:
    "A pen line along the top of the page that draws itself as the reader scrolls through an article.",
  item: "reading-progress",
  group: "Fineliner extras",
}

export default function ReadingProgressDemo() {
  const scroller = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLElement>(null)
  return (
    <DemoSection title="In a scrolling container">
      <StateRow label="Scroll the post">
        <div className="frame w-full max-w-[40rem] p-[3px]">
          <div
            ref={scroller}
            tabIndex={0}
            role="region"
            aria-label="How we grade a record"
            className="h-[24rem] overflow-y-auto"
          >
            <ReadingProgress container={scroller} target={article} />
            <article ref={article} className="px-line py-snug">
              <Typography>
                <GradingArticle />
              </Typography>
            </article>
          </div>
        </div>
      </StateRow>
    </DemoSection>
  )
}
