// @ts-check
import { existsSync, utimesSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

const demoHost = fileURLToPath(
  new URL("./src/site/docs/demo-host.tsx", import.meta.url),
)
const blockList = fileURLToPath(
  new URL("./src/site/docs/blocks/blocks.ts", import.meta.url),
)

/**
 * Dev only. The watcher reports a new file as added, and two things only react to changes: Tailwind's class
 * scanner, and the server-side demo list in demo-host.tsx (its glob is expanded when the module is transformed).
 * Touching the new file, and the demo host for a new demo, turns the add into a change both pick up. From Patina UI.
 * @type {import("vite").Plugin}
 */
const touchNewFiles = {
  name: "fineliner:touch-new-files",
  apply: "serve",
  configureServer(server) {
    server.watcher.on("add", (file) => {
      if (!/[\\/]src[\\/].+\.(tsx?|astro|css)$/u.test(file)) return
      setTimeout(() => {
        const now = new Date()
        if (existsSync(file)) utimesSync(file, now, now)
        if (/[\\/]site[\\/]docs[\\/]demos[\\/][^\\/]+\.tsx$/u.test(file))
          utimesSync(demoHost, now, now)
        if (/[\\/]fineliner[\\/]blocks[\\/][^\\/]+\.tsx$/u.test(file))
          utimesSync(blockList, now, now)
      }, 100)
    })
  },
}

/**
 * Build only. The kit embeds Fineliner Naïve Sans in its stylesheet so an install needs no font files; the site serves
 * the file instead (preloaded in the layouts), so 74 KB of font loads beside the stylesheet rather than inside it, where
 * it would hold back the first paint.
 * @type {import("vite").Plugin}
 */
const lineSansFromFile = {
  name: "fineliner:line-sans-from-file",
  apply: "build",
  generateBundle(_, bundle) {
    for (const file of Object.values(bundle))
      if (file.type === "asset" && file.fileName.endsWith(".css"))
        file.source = String(file.source).replace(
          /(font-family:\s*"?Fineliner Naïve Sans"?;[^}]*?)url\(data:font\/woff2;base64,[^)]+\)/,
          '$1url("/fonts/fineliner-naive-sans.woff2")',
        )
  },
}

export default defineConfig({
  // The canonical URL, for absolute share-image links and the registry address; SITE_URL overrides it.
  site: process.env.SITE_URL || "https://naiveindieline.com",
  // Project ports rather than Astro's defaults (4321 and 4322), so Fineliner never collides with another project.
  server: ({ command }) => ({
    host: "127.0.0.1",
    port: command === "preview" ? 4792 : 4791,
  }),
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [react()],
  devToolbar: { enabled: false },
  // The drawing skill's Markdown is set in the pen by Typography; Shiki's theme colours would fight it.
  markdown: { syntaxHighlight: false },
  vite: { plugins: [tailwindcss(), touchNewFiles, lineSansFromFile] },
})
