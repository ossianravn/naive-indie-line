import { useMemo, useSyncExternalStore } from "react"
import { DownloadIcon } from "lucide-react"
import { cn } from "@/fineliner/lib/utils"
import { useAppearance } from "@/fineliner/theme"
import { Button } from "@/fineliner/ui/button"
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
import { Input } from "@/fineliner/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/fineliner/ui/tabs"
import { useHighlightedCode } from "@/fineliner/ui/use-highlighted-code"
import { siteAppearance } from "@/site/appearance"
import { choicesOf } from "./presets"
import {
  download,
  readTheme,
  registryItem,
  slugOf,
  themeCss,
} from "./theme-export"

function ExportBlock({
  file,
  language,
  code,
  type,
  footer,
}: {
  file: string
  language: string
  code: string
  type: string
  footer?: string
}) {
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{file}</CodeBlockTitle>
        <CodeBlockActions>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => download(file, code, type)}
          >
            <DownloadIcon data-icon="inline-start" />
            Download
          </Button>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers className="max-h-[32rem]">
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
      {footer && (
        <CodeBlockFooter>
          <code>{footer}</code>
        </CodeBlockFooter>
      )}
    </CodeBlock>
  )
}

const noSubscription = () => () => {}

/** The current choices as a stylesheet and as a shadcn registry:theme item, named, copyable and downloadable. */
export function ExportPanel({
  name,
  onName,
  className,
}: {
  name: string
  onName: (name: string) => void
  className?: string
}) {
  const [appearance] = useAppearance(siteAppearance)
  const choices = useMemo(() => choicesOf(appearance), [appearance])
  // The values come from the page's stylesheets, so they are read once the page has hydrated in the browser.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
  const theme = useMemo(
    () => (hydrated ? readTheme(choices) : undefined),
    [hydrated, choices],
  )
  const title = name.trim() || "Custom"
  const slug = slugOf(title)
  const css = theme ? themeCss(title, choices, theme) : ""
  const json = theme
    ? `${JSON.stringify(registryItem(title, css), null, 2)}\n`
    : ""

  return (
    <section
      id="export"
      aria-labelledby="export-title"
      className={cn("scroll-mt-24", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-section gap-y-tight">
        <h2 id="export-title" className="m-0 text-h2">
          Export
        </h2>
        <label className="flex items-center gap-tight">
          <span className="label text-pen-quiet">Theme name</span>
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            spellCheck={false}
            className="w-[14rem]"
          />
        </label>
      </div>
      <Tabs defaultValue="css" className="mt-snug">
        <TabsList>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="shadcn">shadcn item</TabsTrigger>
        </TabsList>
        <TabsContent value="css">
          <ExportBlock
            file={`${slug}.css`}
            language="css"
            code={css}
            type="text/css"
          />
        </TabsContent>
        <TabsContent value="shadcn">
          <ExportBlock
            file={`${slug}.json`}
            language="json"
            code={json}
            type="application/json"
            footer={`npx shadcn add ./${slug}.json`}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
