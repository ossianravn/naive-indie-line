import { FileJsonIcon, TerminalIcon } from "lucide-react"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/fineliner/ui/code-block"

// The two install steps, each with its code and a copy button: register Fineliner's registry in components.json,
// then add everything or one part. An island only for the copy buttons.

export function InstallSteps({ registry }: { registry: string }) {
  const config = `{\n  "registries": {\n    "@fineliner": "${registry}/r/{name}.json"\n  }\n}`
  const command = "npx shadcn add @fineliner/fineliner"
  return (
    <ol className="m-0 flex min-w-0 list-none flex-col gap-line p-0">
      <li>
        <h3 className="m-0 text-body leading-subhead font-medium">
          Add the registry to components.json
        </h3>
        <CodeBlock size="sm" className="mt-tight w-full">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileJsonIcon />
              components.json
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={config} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent className="pe-snug">{config}</CodeBlockContent>
        </CodeBlock>
      </li>
      <li>
        <h3 className="m-0 text-body leading-subhead font-medium">
          Add the kit
        </h3>
        <CodeBlock size="sm" className="mt-tight w-full">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <TerminalIcon />
              Terminal
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={command} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent className="pe-snug">{command}</CodeBlockContent>
        </CodeBlock>
        <p className="m-0 mt-tight max-w-[30rem] text-small leading-small text-pen-quiet">
          Or one part at a time, such as{" "}
          <code className="font-type">@fineliner/record-sleeve</code>: each
          component&rsquo;s page has its own command.
        </p>
      </li>
    </ol>
  )
}
