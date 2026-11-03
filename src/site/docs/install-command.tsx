import { TerminalIcon } from "lucide-react"
import { cn } from "@/fineliner/lib/utils"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/fineliner/ui/code-block"

// A shell command on a docs page as the home page's install steps show theirs: a small code block headed "Terminal"
// with the copy button in its header. An island only for the copy button.

export function InstallCommand({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  return (
    <CodeBlock size="sm" className={cn("w-fit max-w-full", className)}>
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
  )
}
