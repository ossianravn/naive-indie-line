import { FileCodeIcon, FileJsonIcon, TerminalIcon } from "lucide-react"
import { useHighlightedCode } from "@/fineliner/ui/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/fineliner/ui/code-block"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Code block",
  description:
    "Code or data typed on a well of tint, with line numbers, highlighting in one pen and a copy button.",
  item: "code-block",
  group: "Data display",
}

const BOOKING = `{
  "id": "BK-1105-1600",
  "room": 1,
  "guest": "Maya Singh",
  "guests": 2,
  "starts": "2026-11-05T16:00:00+01:00",
  "ends": "2026-11-05T17:00:00+01:00",
  "records": ["LR-0414", "LR-0423"],
  "hold": { "record": "LR-0414", "until": "2026-11-05T17:00:00+01:00" },
  "paid": false
}
`

const SLEEVE = `import { Drawing } from "@/fineliner/drawing/drawing"

// Same seed, same record, in every build.
export function SleeveArt({ id, title }: { id: string; title: string }) {
  return (
    <Drawing
      object="record"
      seed={id}
      seed={\`sleeve:\${id}\`}
      title={title}
    />
  )
}
`

const INSTALL = "npx shadcn add @fineliner/code-block"

const ERROR = `Error: unknown object "gramophone"
    at drawing (src/fineliner/pen/drawing-svg.ts:41:22)
    at SleeveArt (src/site/listening-room/sleeve-art.tsx:6:5)`

type Mark = "added" | "removed" | "highlighted"

function Code({
  code,
  language,
  marks = {},
  lineNumbers = true,
}: {
  code: string
  language: string
  marks?: Record<number, Mark>
  lineNumbers?: boolean
}) {
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlockContent lineNumbers={lineNumbers}>
      {lines.map((line, index) => (
        <CodeBlockLine key={index} variant={marks[index + 1]}>
          {line}
        </CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export default function CodeBlockDemo() {
  return (
    <>
      <DemoSection title="The booking">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileJsonIcon />
              booking.json
            </CodeBlockTitle>
            <span>JSON</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={BOOKING} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code code={BOOKING} language="json" marks={{ 4: "highlighted" }} />
        </CodeBlock>
      </DemoSection>
      <DemoSection title="A drawing, from code">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileCodeIcon />
              sleeve-art.tsx
            </CodeBlockTitle>
            <span>TSX</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={SLEEVE} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code
            code={SLEEVE}
            language="tsx"
            marks={{ 8: "removed", 9: "added" }}
          />
          <CodeBlockFooter>
            Seeded · the same drawing everywhere
          </CodeBlockFooter>
        </CodeBlock>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Shell, small">
          <CodeBlock size="sm" className="max-w-[26rem]">
            <CodeBlockActions>
              <CodeBlockCopyButton value={INSTALL} />
            </CodeBlockActions>
            <Code code={INSTALL} language="bash" lineNumbers={false} />
          </CodeBlock>
        </StateRow>
        <StateRow label="Destructive">
          <CodeBlock
            variant="destructive"
            className="max-w-[40rem] contain-inline-size"
          >
            <CodeBlockHeader>
              <CodeBlockTitle>
                <TerminalIcon />
                npm run dev
              </CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>{ERROR}</CodeBlockContent>
          </CodeBlock>
        </StateRow>
        <StateRow label="Wrapped">
          <CodeBlock size="sm" className="max-w-[22rem]">
            <CodeBlockContent wrap lineNumbers>
              {`curl -s "https://listeningroom.example/api/bookings?room=1&date=2026-11-05&include=records,holds"`}
            </CodeBlockContent>
          </CodeBlock>
        </StateRow>
      </DemoSection>
    </>
  )
}
