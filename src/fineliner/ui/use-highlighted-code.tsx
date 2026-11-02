"use client"

import * as React from "react"
import type { GrammarState, HighlighterCore, ThemedToken } from "shiki/core"

// Syntax highlighting with Shiki, loaded on first use: the core, the engine and each grammar are separate chunks, so a
// page pays nothing until a code block asks. Highlighting is done with one pen: Shiki's CSS-variables theme names
// each token's kind, and the kind becomes a weight, a slant or a quieter pen, never a colour. Keywords are bold,
// strings italic, comments quiet and italic, punctuation quiet; ANSI red (errors) is the correction pen.

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

// Token kinds (the theme's variable names) to the pen's voices. Anything not listed is the plain pen.
const PEN: Record<string, string> = {
  "token-keyword": "text-pen font-bold",
  "token-string": "text-pen italic",
  "token-string-expression": "text-pen italic",
  "token-comment": "text-pen-quiet italic",
  "token-punctuation": "text-pen-quiet",
  "token-link": "text-pen underline",
  "token-deleted": "text-pen line-through",
  "ansi-red": "text-correction",
  "ansi-bright-red": "text-correction",
  "ansi-bright-black": "text-pen-quiet",
  "ansi-white": "text-pen-quiet",
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
  ]).then(([{ createHighlighterCore, createCssVariablesTheme }, engine]) =>
    createHighlighterCore({
      themes: [
        createCssVariablesTheme({
          name: "fineliner",
          variablePrefix: "--shiki-",
          fontStyle: true,
        }),
      ],
      langs: [],
      engine: engine.createJavaScriptRegexEngine({ forgiving: true }),
    }),
  )

  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()

  if (name === "ansi") {
    return name
  }

  if (name in languages) {
    return name as keyof typeof languages
  }

  return aliases[name] ?? null
}

// The token's kind from its colour, var(--shiki-token-keyword), plus Shiki's font-style flags: 1 italic, 2 bold,
// 4 underline.
function tokenClass(token: ThemedToken) {
  const kind = /--shiki-([a-z-]+)/.exec(token.color ?? "")?.[1] ?? ""
  const flags = token.fontStyle ?? 0
  return [
    PEN[kind] ?? "text-pen",
    flags & 1 ? "italic" : "",
    flags & 2 ? "font-bold" : "",
    flags & 4 ? "underline" : "",
  ]
    .filter(Boolean)
    .join(" ")
}

/** Loads a language and returns a highlighter for it, or null for a language that is not listed. */
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language)

  if (!lang) {
    return null
  }

  const shiki = await getHighlighter()

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang])
  }

  return {
    // One React node per line, and the grammar state after the last line. Pass that state back to continue where the
    // code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          theme: "fineliner",
          grammarState: state,
        }).tokens

      // ANSI has no grammar state, so each line is tokenized on its own and reads the same whether it arrives in one
      // piece or streams.
      const tokens =
        lang === "ansi"
          ? code.split("\n").flatMap((line) => tokenize(line))
          : tokenize(code)

      // A line's indent sits in its own inline box, which a removed line's strike passes over.
      return {
        lines: tokens.map((line) =>
          line.flatMap((token, index) => {
            const indent = index ? "" : (/^\s+/.exec(token.content)?.[0] ?? "")
            const rest = token.content.slice(indent.length)
            return [
              indent ? (
                <span key="indent" className="inline-block">
                  {indent}
                </span>
              ) : null,
              rest ? (
                <span key={index} className={tokenClass(token)}>
                  {rest}
                </span>
              ) : null,
            ]
          }),
        ),
        state: shiki.getLastGrammarState(tokens),
      }
    },
  }
}

/** One React node per line, or null for a language that is not listed. */
export async function highlightCode(code: string, language: string) {
  const loaded = await loadHighlighter(language)

  return loaded ? loaded.highlight(code).lines : null
}

/**
 * The lines of a code block: plain strings until the highlighter has loaded in the browser, then highlighted spans.
 * The text is identical either way, so the block renders at its final size from the first paint.
 */
export function useHighlightedCode(value: string, language: string) {
  // A trailing newline would render as an extra empty line.
  const code = value.endsWith("\n") ? value.slice(0, -1) : value
  const [loaded, setLoaded] = React.useState<{
    language: string
    highlighter: Awaited<ReturnType<typeof loadHighlighter>>
  } | null>(null)
  const current = loaded?.language === language ? loaded.highlighter : null

  React.useEffect(() => {
    let cancelled = false

    loadHighlighter(language)
      .then((next) => {
        if (!cancelled) {
          setLoaded({ language, highlighter: next })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [language])

  // The complete lines, highlighted. While the code streams, only the new lines are tokenized, starting from the
  // grammar state of the last one.
  const [done, setDone] = React.useState<{
    highlighter: typeof current
    text: string
    lines: React.ReactNode[]
    state?: GrammarState
  }>({ highlighter: null, text: "", lines: [] })

  let next = done

  if (next.highlighter !== current || !code.startsWith(next.text)) {
    next = { highlighter: current, text: "", lines: [] }
  }

  const end = code.lastIndexOf("\n") + 1

  if (current && end > next.text.length) {
    const result = current.highlight(
      code.slice(next.text.length, end - 1),
      next.state,
    )

    next = {
      highlighter: current,
      text: code.slice(0, end),
      lines: [...next.lines, ...result.lines],
      state: result.state,
    }
  }

  if (next !== done) {
    setDone(next)
  }

  // The last line is still being written, so it is tokenized on every render.
  const tail = code.slice(end)

  return React.useMemo(() => {
    if (!current) {
      return code.split("\n")
    }

    return [...next.lines, current.highlight(tail, next.state).lines[0]]
  }, [code, current, next, tail])
}
